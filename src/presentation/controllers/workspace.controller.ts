import { Request, Response } from 'express';
import { 
  GetWorkspaceAppsUseCase, 
  AddAppToWorkspaceUseCase, 
  RemoveAppFromWorkspaceUseCase,
  UpdateAppOrderUseCase,
  GetWorkspacesUseCase,
  CreateWorkspaceUseCase,
  DeleteWorkspaceUseCase
} from '../../application/useCases/workspace.useCase';
import { dbWorkspaceAppRepository, dbWorkspaceRepository } from '../../infrastructure/repositories/db-workspace.repository';
import { GetWorkspaceTemplatesUseCase } from '../../application/useCases/get-workspace-templates.useCase';
import { dbWorkspaceTemplateRepository } from '../../infrastructure/repositories/db-workspace-template.repository';

export class WorkspaceController {
  private getWorkspaceAppsUseCase: GetWorkspaceAppsUseCase;
  private addAppToWorkspaceUseCase: AddAppToWorkspaceUseCase;
  private removeAppFromWorkspaceUseCase: RemoveAppFromWorkspaceUseCase;
  private updateAppOrderUseCase: UpdateAppOrderUseCase;
  private getWorkspacesUseCase: GetWorkspacesUseCase;
  private createWorkspaceUseCase: CreateWorkspaceUseCase;
  private deleteWorkspaceUseCase: DeleteWorkspaceUseCase;
  private getWorkspaceTemplatesUseCase: GetWorkspaceTemplatesUseCase;

  constructor() {
    this.getWorkspaceAppsUseCase = new GetWorkspaceAppsUseCase(dbWorkspaceAppRepository);
    this.addAppToWorkspaceUseCase = new AddAppToWorkspaceUseCase(dbWorkspaceAppRepository);
    this.removeAppFromWorkspaceUseCase = new RemoveAppFromWorkspaceUseCase(dbWorkspaceAppRepository);
    this.updateAppOrderUseCase = new UpdateAppOrderUseCase(dbWorkspaceAppRepository);
    this.getWorkspacesUseCase = new GetWorkspacesUseCase(dbWorkspaceRepository);
    this.createWorkspaceUseCase = new CreateWorkspaceUseCase(dbWorkspaceRepository);
    this.deleteWorkspaceUseCase = new DeleteWorkspaceUseCase(dbWorkspaceRepository);
    this.getWorkspaceTemplatesUseCase = new GetWorkspaceTemplatesUseCase(dbWorkspaceTemplateRepository);
  }

  // Workspace App endpoints
  public getWorkspaceApps = async (req: Request, res: Response): Promise<void> => {
    const workspaceId = parseInt(req.params.workspaceId);
    const lang = req.query.lang as string;
    if (isNaN(workspaceId)) {
      res.status(400).json({ error: 'workspaceId must be a number' });
      return;
    }
    const apps = await this.getWorkspaceAppsUseCase.execute(workspaceId, lang);
    res.json({ data: apps });
  }

  public addAppToWorkspace = async (req: Request, res: Response): Promise<void> => {
    const workspaceId = parseInt(req.params.workspaceId);
    const { appId, order } = req.body;

    if (isNaN(workspaceId) || !appId) {
      res.status(400).json({ error: 'workspaceId and appId are required' });
      return;
    }

    const result = await this.addAppToWorkspaceUseCase.execute(workspaceId, appId, order);
    res.status(201).json(result);
  }

  public removeAppFromWorkspace = async (req: Request, res: Response): Promise<void> => {
    const workspaceId = parseInt(req.params.workspaceId);
    const appId = req.params.appId;

    if (isNaN(workspaceId) || !appId) {
      res.status(400).json({ error: 'workspaceId and appId are required' });
      return;
    }

    await this.removeAppFromWorkspaceUseCase.execute(workspaceId, appId);
    res.status(204).send();
  }

  public updateAppOrder = async (req: Request, res: Response): Promise<void> => {
    const workspaceId = parseInt(req.params.workspaceId);
    const appId = req.params.appId;
    const { order } = req.body;

    if (isNaN(workspaceId) || !appId || order === undefined) {
      res.status(400).json({ error: 'workspaceId, appId and order are required' });
      return;
    }

    await this.updateAppOrderUseCase.execute(workspaceId, appId, order);
    res.status(200).send();
  }

  // Workspace endpoints
  public getWorkspaces = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const workspaces = await this.getWorkspacesUseCase.execute(userId);
    res.json({ data: workspaces });
  }



  // Workspace templates
  public getWorkspaceTemplates = async (req: Request, res: Response): Promise<void> => {
    const lang = req.query.lang as string;
    const templates = await this.getWorkspaceTemplatesUseCase.execute(lang);
    res.json({ data: templates });
  }

  public createWorkspace = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const { name, icon, isDefault, initialAppIds } = req.body;

    if (!userId || !name) {
      res.status(400).json({ error: 'userId and name are required' });
      return;
    }

    const workspace = await this.createWorkspaceUseCase.execute(userId, name, icon, isDefault, initialAppIds);
    res.status(201).json(workspace);
  }

  public deleteWorkspace = async (req: Request, res: Response): Promise<void> => {
    const workspaceId = parseInt(req.params.id);
    if (isNaN(workspaceId)) {
      res.status(400).json({ error: 'id must be a number' });
      return;
    }
    await this.deleteWorkspaceUseCase.execute(workspaceId);
    res.status(204).send();
  }
}

export const workspaceController = new WorkspaceController();
