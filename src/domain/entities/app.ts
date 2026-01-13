export interface App {
  id: string;
  url: string;
  category: string;
  icon?: string;
  order: number;
  name: string;
  description: string;
  isGlobal: boolean;
}

export interface AppTranslation {
  name: string;
  description: string;
}

export interface AppWithTranslations extends Omit<App, 'name' | 'description'> {
  translations: {
    [lang: string]: AppTranslation;
  };
}
