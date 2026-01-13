import { App, AppWithTranslations } from '../entities/app';

export interface IAppRepository {
  findAll(offset: number, limit: number, lang: string, userId?: string): Promise<{ data: App[], count: number }>;
  findById(id: string, lang: string): Promise<App | null>;
  create(appData: Partial<AppWithTranslations> & { userId?: string }): Promise<App>;
  update(id: string, appData: Partial<AppWithTranslations>): Promise<App>;
  findGlobalDefaults(): Promise<App[]>;
}
