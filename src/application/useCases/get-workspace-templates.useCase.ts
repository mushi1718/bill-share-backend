import { IWorkspaceTemplateRepository } from '../../infrastructure/repositories/db-workspace-template.repository';
import { Template } from '../../domain/entities/template';

export class GetWorkspaceTemplatesUseCase {
  constructor(private workspaceTemplateRepository: IWorkspaceTemplateRepository) {}

  async execute(lang?: string): Promise<Template[]> {
    return this.workspaceTemplateRepository.findAll(lang);
  }
}
