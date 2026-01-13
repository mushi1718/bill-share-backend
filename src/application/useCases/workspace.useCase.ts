import { IWorkspaceAppRepository, IWorkspaceRepository } from '../../domain/repositories/workspace.repository';
import { Workspace, WorkspaceApp } from '../../domain/entities/user';

export class GetWorkspaceAppsUseCase {
  constructor(private workspaceAppRepository: IWorkspaceAppRepository) {}

  async execute(workspaceId: number, lang?: string): Promise<WorkspaceApp[]> {
    return this.workspaceAppRepository.findByWorkspaceId(workspaceId, lang);
  }
}

export class AddAppToWorkspaceUseCase {
  constructor(private workspaceAppRepository: IWorkspaceAppRepository) {}

  async execute(workspaceId: number, appId: string, order?: number): Promise<WorkspaceApp> {
    return this.workspaceAppRepository.addAppToWorkspace(workspaceId, appId, order);
  }
}

export class RemoveAppFromWorkspaceUseCase {
  constructor(private workspaceAppRepository: IWorkspaceAppRepository) {}

  async execute(workspaceId: number, appId: string): Promise<void> {
    return this.workspaceAppRepository.removeAppFromWorkspace(workspaceId, appId);
  }
}

export class UpdateAppOrderUseCase {
  constructor(private workspaceAppRepository: IWorkspaceAppRepository) {}

  async execute(workspaceId: number, appId: string, order: number): Promise<void> {
    return this.workspaceAppRepository.updateOrder(workspaceId, appId, order);
  }
}

// Workspace Use Cases
export class GetWorkspacesUseCase {
  constructor(private workspaceRepository: IWorkspaceRepository) {}

  async execute(userId: string): Promise<Workspace[]> {
    return this.workspaceRepository.findByUserId(userId);
  }
}

export class CreateWorkspaceUseCase {
  constructor(private workspaceRepository: IWorkspaceRepository) {}

  async execute(userId: string, name: string, icon?: string, isDefault: boolean = false, initialAppIds?: string[]): Promise<Workspace> {
    return this.workspaceRepository.create(userId, name, icon, isDefault, initialAppIds);
  }
}

export class DeleteWorkspaceUseCase {
  constructor(private workspaceRepository: IWorkspaceRepository) {}

  async execute(id: number): Promise<void> {
    return this.workspaceRepository.delete(id);
  }
}
