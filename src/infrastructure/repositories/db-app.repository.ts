import { AppDataSource } from '../config/data-source';
import { App as AppEntity } from '../database/entities/app.entity';
import { App } from '../../domain/entities/app';
import { IAppRepository } from '../../domain/repositories/app.repository';

export class DbAppRepository implements IAppRepository {
  private repository = AppDataSource.getRepository(AppEntity);

  async findAll(offset: number, limit: number, lang: string, userId?: string): Promise<{ data: App[], count: number }> {
    const query = this.repository.createQueryBuilder('app')
      .leftJoinAndSelect('app.translations', 'translation')
      .where('(app.userId IS NULL OR app.userId = :userId)', { userId })
      .orderBy('app.order', 'ASC')
      .skip(offset)
      .take(limit);

    const [entities, count] = await query.getManyAndCount();

    const data = entities.map(entity => this.mapToDomain(entity, lang));
    return { data, count };
  }

  async findById(id: string, lang: string): Promise<App | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['translations']
    });

    if (!entity) return null;
    return this.mapToDomain(entity, lang);
  }

  async findGlobalDefaults(): Promise<App[]> {
      const entities = await this.repository.find({
          where: { isGlobal: true },
          relations: ['translations'],
          order: { order: 'ASC' }
      });
      return entities.map(e => this.mapToDomain(e, 'en')); 
  }

  async create(appData: Partial<App> & { userId?: string }): Promise<App> {
      // Logic update: store name/desc directly in entity if provided?
      // For now, map simple fields.
      const entity = this.repository.create({
        ...appData,
        isGlobal: appData.isGlobal // map legacy if needed or just use consistent prop
      });
      const saved = await this.repository.save(entity);
      return this.mapToDomain(saved, 'en');
  }

  async update(id: string, appData: Partial<App>): Promise<App> {
      await this.repository.update(id, appData);
      const entity = await this.repository.findOneOrFail({
          where: { id },
          relations: ['translations']
      });
      return this.mapToDomain(entity, 'en');
  }

  private mapToDomain(entity: AppEntity, lang: string): App {
    // If lang is 'en', use entity.name/desc directly (if populated).
    // If other lang, looking translations.
    let name = entity.name || entity.url;
    let desc = entity.description || '';

    if (lang !== 'en' && entity.translations) {
        const t = entity.translations.find(t => t.lang === lang);
        if (t) {
            name = t.name;
            desc = t.description;
        }
    }

    return {
      id: entity.id,
      url: entity.url,
      category: entity.category,
      icon: entity.icon || entity.iconUrl, // Prefer new icon, fallback to url if needed? Or just entity.icon if migrated? 
                                           // User said "add icon column". I'll map 'icon' property in Domain to entity.icon.
                                           // But Wait, domain App entity has 'icon'?: string.
      order: entity.order,
      name,
      description: desc,

      isGlobal: entity.isGlobal
    };
  }
}

export const dbAppRepository = new DbAppRepository();
