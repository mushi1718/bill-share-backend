import { AppDataSource } from '../config/data-source';
import { Template } from '../database/entities/workspace-template.entity';

import { Template as DomainTemplate } from '../../domain/entities/template';

export interface IWorkspaceTemplateRepository {
  findAll(lang?: string): Promise<DomainTemplate[]>;
}

export class DbWorkspaceTemplateRepository implements IWorkspaceTemplateRepository {
  private repository = AppDataSource.getRepository(Template);

  async findAll(lang: string = 'en'): Promise<DomainTemplate[]> {
    const templates = await this.repository.find({
      relations: ['translations']
    });

    return templates.map(t => this.mapToDomain(t, lang));
  }

  private mapToDomain(entity: Template, lang: string): DomainTemplate {
      let name = entity.name || 'Untitled';
      let description = entity.description || '';

      if (lang !== 'en' && entity.translations) {
        const t = entity.translations.find(t => t.lang === lang);
        if (t) {
            name = t.name;
            description = t.description;
        }
      }

      return {
          id: entity.id,
          name: name,
          description: description,
          icon: entity.icon,
          appIds: entity.appIds
      };
  }
}

export const dbWorkspaceTemplateRepository = new DbWorkspaceTemplateRepository();
