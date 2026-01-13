import { IAppRepository } from '../../domain/repositories/app.repository';
import { App } from '../../domain/entities/app';

export class GetAppByIdUseCase {
  constructor(private appRepository: IAppRepository) {}

  async execute(id: string, lang: string): Promise<App | null> {
    return this.appRepository.findById(id, lang);
  }
}
