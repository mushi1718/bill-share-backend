import { IAppRepository } from '../../domain/repositories/app.repository';
import { App } from '../../domain/entities/app';
import { apps } from '../mock/apps.mock';

export class MockAppRepository implements IAppRepository {
  private getLocalizedApp(app: any, lang: string): App {
    const translation = app.translations[lang] || app.translations['en'];
    const { translations, ...baseApp } = app;
    return {
      ...baseApp,
      name: translation.name,
      description: translation.description
    };
  }

  async findAll(offset: number, limit: number, lang: string): Promise<{ data: App[], count: number }> {
    const slicedApps = apps.slice(offset, offset + limit);
    const data = slicedApps.map(app => this.getLocalizedApp(app, lang));
    return {
      data,
      count: apps.length
    };
  }

  async findById(id: string, lang: string): Promise<App | null> {
    const app = apps.find(a => a.id === id);
    if (!app) return null;
    return this.getLocalizedApp(app, lang);
  }
  async findGlobalDefaults(): Promise<App[]> {
      const defaults = apps.filter(a => a.isGlobal).sort((a, b) => a.order - b.order);
      return defaults.map(app => this.getLocalizedApp(app, 'en'));
  }

  async create(appData: Partial<App>): Promise<App> {
      // Mock create - just return somewhat valid object
      const newApp: any = {
           id: Math.random().toString(),
           ...appData,
           translations: { en: { name: appData.name || '', description: appData.description || '' } }
      }
      apps.push(newApp);
      return this.getLocalizedApp(newApp, 'en');
  }

  async update(id: string, appData: Partial<App>): Promise<App> {
      const idx = apps.findIndex(a => a.id === id);
      if (idx === -1) throw new Error('App not found');
      
      apps[idx] = { ...apps[idx], ...appData };
      return this.getLocalizedApp(apps[idx], 'en');
  }
}

export const mockAppRepository = new MockAppRepository();
