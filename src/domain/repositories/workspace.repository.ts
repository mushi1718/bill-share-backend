import { Workspace, WorkspaceApp } from '../entities/user';

export interface IWorkspaceAppRepository {
  findByWorkspaceId(workspaceId: number, lang?: string): Promise<WorkspaceApp[]>;
  addAppToWorkspace(workspaceId: number, appId: string, order?: number): Promise<WorkspaceApp>;
  removeAppFromWorkspace(workspaceId: number, appId: string): Promise<void>;
  updateOrder(workspaceId: number, appId: string, order: number): Promise<void>;
}

export interface IWorkspaceRepository {
  findByUserId(userId: string): Promise<Workspace[]>;
  findById(id: number): Promise<Workspace | null>;
  create(userId: string, name: string, icon?: string, isDefault?: boolean, initialAppIds?: string[]): Promise<Workspace>;
  update(id: number, data: Partial<Pick<Workspace, 'name' | 'icon' | 'order'>>): Promise<Workspace>;
  delete(id: number): Promise<void>;
}
