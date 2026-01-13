import { IWorkspaceAppRepository, IWorkspaceRepository } from '../../domain/repositories/workspace.repository';
import { Workspace, WorkspaceApp } from '../../domain/entities/user';
import { AppDataSource } from '../config/data-source';
import { Workspace as WorkspaceEntity } from '../database/entities/workspace.entity';
import { WorkspaceApp as WorkspaceAppEntity } from '../database/entities/workspace-app.entity';

import { dbAppRepository } from './db-app.repository';

export class DbWorkspaceAppRepository implements IWorkspaceAppRepository {
  private repository = AppDataSource.getRepository(WorkspaceAppEntity);

  async findByWorkspaceId(workspaceId: number, lang: string = 'en'): Promise<WorkspaceApp[]> {
    const entities = await this.repository.find({
      where: { workspaceId },
      order: { order: 'ASC' },
      relations: ['app', 'app.translations']
    });
    return entities.map(e => this.mapToDomain(e, lang));
  }

  async addAppToWorkspace(workspaceId: number, appId: string, order?: number): Promise<WorkspaceApp> {
    const entity = this.repository.create({
      workspaceId,
      appId,
      order: order ?? 0
    });
    const saved = await this.repository.save(entity);
    // Ideally fetch the full entity again to return mapped domain
    return this.mapToDomain(saved); 
  }

  async removeAppFromWorkspace(workspaceId: number, appId: string): Promise<void> {
    await this.repository.delete({ workspaceId, appId });
  }

  async updateOrder(workspaceId: number, appId: string, order: number): Promise<void> {
    await this.repository.update({ workspaceId, appId }, { order });
  }

  private mapToDomain(entity: WorkspaceAppEntity, lang: string = 'en'): WorkspaceApp {
    let appData = undefined;
    if (entity.app) {
        let name = entity.app.name || '';
        let description = entity.app.description || '';

        // If lang is not 'en' (and not default), try to find translation
        if (lang !== 'en' && entity.app.translations) {
             const t = entity.app.translations.find(t => t.lang === lang);
             if (t) {
                 name = t.name;
                 description = t.description;
             }
        }
        
        // Fallbacks if still empty (though name should be populated for migrated apps)
        if (!name) name = entity.app.url;

        appData = {
            id: entity.app.id,
            url: entity.app.url,
            category: entity.app.category,
            icon: entity.app.icon || entity.app.iconUrl,
            name: name,
            description: description
        };
    }

    return {
      workspaceId: entity.workspaceId,
      appId: entity.appId,
      order: entity.order,
      createdAt: entity.createdAt,
      app: appData
    };
  }
}

export class DbWorkspaceRepository implements IWorkspaceRepository {
  private repository = AppDataSource.getRepository(WorkspaceEntity);

  async findByUserId(userId: string): Promise<Workspace[]> {
    let groups = await this.repository.find({
      where: { userId },
      order: { order: 'ASC' }
    });

    // Create default groups if none exist
    if (groups.length === 0) {
      groups = await this.createDefaultGroups(userId);
    }

    return groups.map(e => this.mapToDomain(e));
  }

  async findById(id: number): Promise<Workspace | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapToDomain(entity) : null;
  }

  async create(userId: string, name: string, icon?: string, isDefault: boolean = false, initialAppIds?: string[]): Promise<Workspace> {
    const maxOrder = await this.repository
      .createQueryBuilder('group')
      .select('MAX(group.order)', 'max')
      .where('group.userId = :userId', { userId })
      .getRawOne();

    const existing = await this.repository.findOne({
      where: { userId, name }
    });

    if (existing) {
      throw new Error('Workspace with this name already exists');
    }

    const entity = this.repository.create({
      userId,
      name,
      icon,
      order: (maxOrder?.max ?? -1) + 1,
      isDefault
    });
    const saved = await this.repository.save(entity);

    // Add apps: either from template (initialAppIds) or global defaults
    if (initialAppIds && initialAppIds.length > 0) {
       for (let i = 0; i < initialAppIds.length; i++) {
          await dbWorkspaceAppRepository.addAppToWorkspace(saved.id, initialAppIds[i], i);
       }
    } else {
       await this.addGlobalDefaultsToWorkspace(saved.id);
    }

    return this.mapToDomain(saved);
  }

  async update(id: number, data: Partial<Pick<Workspace, 'name' | 'icon' | 'order'>>): Promise<Workspace> {
    await this.repository.update(id, data);
    const entity = await this.repository.findOneByOrFail({ id });
    return this.mapToDomain(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id, isDefault: false });
  }

  private async createDefaultGroups(userId: string): Promise<WorkspaceEntity[]> {
    const defaultGroups = [
      { userId, name: 'favorites', order: 0, isDefault: true, icon: 'Star' }
    ];

    const entities = defaultGroups.map(g => this.repository.create(g));
    const savedGroups = await this.repository.save(entities);

    // Add global defaults to both default workspaces
    for (const group of savedGroups) {
        await this.addGlobalDefaultsToWorkspace(group.id);
    }
    
    return savedGroups;
  }

  private async addGlobalDefaultsToWorkspace(workspaceId: number): Promise<void> {
      const globalDefaults = await dbAppRepository.findGlobalDefaults();
      // Use existing dbWorkspaceAppRepository to add them
      for (const app of globalDefaults) {
          // Use app.order as position
          await dbWorkspaceAppRepository.addAppToWorkspace(workspaceId, app.id, app.order);
      }
  }

  private mapToDomain(entity: WorkspaceEntity): Workspace {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      icon: entity.icon,
      order: entity.order,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt
    };
  }
}

export const dbWorkspaceAppRepository = new DbWorkspaceAppRepository();
export const dbWorkspaceRepository = new DbWorkspaceRepository();
