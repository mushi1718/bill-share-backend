import { IAppRepository } from '../../domain/repositories/app.repository';
import { App } from '../../domain/entities/app';

export class GetAppsUseCase {
  constructor(private appRepository: IAppRepository) {}

  async execute(offset: number, limit: number, lang: string): Promise<{ data: App[], count: number }> {
    return this.appRepository.findAll(offset, limit, lang);
  }
}
