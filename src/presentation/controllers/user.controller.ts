import { Request, Response } from 'express';
import { UserService } from '../../application/services/user.service';
import { dbUserRepository } from '../../infrastructure/repositories/db-user.repository';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(dbUserRepository);
  }

  public updatePreferences = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const { preferences } = req.body;

    if (!userId || !preferences) {
      res.status(400).json({ error: 'userId and preferences are required' });
      return;
    }

    try {
      const user = await this.userService.updatePreferences(userId, preferences);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update preferences' });
    }
  }

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
    }

    try {
        const user = await this.userService.getUser(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch profile' });
    }
  }
}

export const userController = new UserController();
