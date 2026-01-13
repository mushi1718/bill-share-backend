import { Request, Response } from 'express';
import { GetAppsUseCase } from '../../application/useCases/getApps.useCase';
import { GetAppByIdUseCase } from '../../application/useCases/getAppById.useCase';
import { dbAppRepository } from '../../infrastructure/repositories/db-app.repository';

export class AppController {
  private getAppsUseCase: GetAppsUseCase;
  private getAppByIdUseCase: GetAppByIdUseCase;

  constructor() {
    this.getAppsUseCase = new GetAppsUseCase(dbAppRepository);
    this.getAppByIdUseCase = new GetAppByIdUseCase(dbAppRepository);
  }

  public getAllApps = async (req: Request, res: Response): Promise<void> => {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const lang = (req.query.lang as string) || 'en';
    const userId = req.query.userId as string;
    
    // Pass userId to repo to include private apps
    const { data, count } = await dbAppRepository.findAll(offset, limit, lang, userId);
    
    res.json({
      data,
      count,
      offset,
      limit
    });
  }

  public getAppById = async (req: Request, res: Response): Promise<void> => {
    const appId = req.params.id;
    const lang = (req.query.lang as string) || 'en';
    const appData = await this.getAppByIdUseCase.execute(appId, lang);

    if (!appData) {
      res.status(404).json({ message: 'App not found' });
      return;
    }

    res.json(appData);
  }

  public createApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, ...appData } = req.body;

        if (userId) {
            // Check if user is Pro
            // Using direct repo access to avoid circular dependency or overhead if UserService not injected
            // Ideally inject UserService
            // For now, assume a helper or direct DB access is acceptable as per repo pattern
            const { AppDataSource } = require('../../infrastructure/config/data-source');
            const { User } = require('../../infrastructure/database/entities/user.entity');
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ id: userId });

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            if (!user.isPro) {
                 res.status(403).json({ message: 'Only Pro users can create custom apps' });
                 return;
            }
            
            // Create with userId
            const created = await dbAppRepository.create({ ...appData, userId });
            res.status(201).json(created);
        } else {
            // Admin creation (global)? Or just disallow global via this endpoint for now to regular users?
            // Assuming this endpoint is for Custom Apps mostly.
            // If no userId, maybe treat as global? Let's restrict to userId for now or allow if backend admin.
            // Let's allow simple creation for now but maybe default to global if no userId?
            // "Custom Apps" implies userId.
            const created = await dbAppRepository.create(appData);
            res.status(201).json(created);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create app' });
    }
  }

  public updateApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const appId = req.params.id;
        const appData = req.body;
        const updated = await dbAppRepository.update(appId, appData);
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update app' });
    }
  }
}

export const appController = new AppController();
