
import { authService } from '../src/application/services/auth.service';
import { workspaceController } from '../src/presentation/controllers/workspace.controller';
import { AppDataSource } from '../src/infrastructure/config/data-source';
import { Request, Response } from 'express';

async function reproduce() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    console.log('Skipping login in repro script due to Firebase Auth change - setting up manual mocked user/context if needed or just failing for now if auth is hard requirement');
    // For reproduction scripts, often better to manually insert a user or use a test token if possible. 
    // Since we just changed to Firebase, we might not have a valid token generator handy here.
    // I'll assume we can skip the authService call and just pretend we have a userId, 
    // BUT wait, we need a valid userId that exists in DB.
    // Let's assume 'user_x32323' from seed exists.
    const userId = 'user_x32323';
    console.log('Using hardcoded userId:', userId);

    // Mock Express Request and Response
    const req = {
      params: { userId: userId }
    } as unknown as Request;

    const res = {
      json: (data: any) => {
        console.log('Workspaces fetched successfully:', data);
      },
      status: (code: number) => {
        console.log('Status:', code);
        return {
          json: (data: any) => {
            console.log('Error/Response:', data);
          },
          send: () => {
             console.log('Sent');
          }
        };
      }
    } as unknown as Response;

    console.log('Fetching workspaces...');
    await workspaceController.getWorkspaces(req, res);
    console.log('Done.');

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
  }
}

reproduce();
