import { AppDataSource } from '../src/infrastructure/config/data-source';
import { User } from '../src/infrastructure/database/entities/user.entity';
import { Workspace } from '../src/infrastructure/database/entities/workspace.entity';
import { App } from '../src/infrastructure/database/entities/app.entity';
import { WorkspaceApp } from '../src/infrastructure/database/entities/workspace-app.entity';

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    // 1. Login (or find existing user)
    const email = 'x32323@gmail.com'; 
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    
    if (!user) {
        console.error('User not found. Run previous reproduction script first.');
        return;
    }
    console.log(`User found: ${user.id}`);

    // 2. Get Workspaces
    const workspaceRepo = AppDataSource.getRepository(Workspace);
    let workspaces = await workspaceRepo.find({ where: { userId: user.id } });
    
    if (workspaces.length === 0) {
        // Create one if none
        const ws = workspaceRepo.create({ userId: user.id, name: 'Test WS', isDefault: false });
        await workspaceRepo.save(ws);
        workspaces = [ws];
    }
    const workspace = workspaces[0];
    console.log(`Using workspace: ${workspace.id}`);

    // 3. Add App to Workspace
    const appRepo = AppDataSource.getRepository(App);
    const apps = await appRepo.find({ take: 1 });
    const app = apps[0];
    
    if (!app) {
        console.error('No apps found in DB');
        return;
    }

    // Clear existing apps in workspace for clean test
    const wsAppRepo = AppDataSource.getRepository(WorkspaceApp);
    await wsAppRepo.delete({ workspaceId: workspace.id });

    // Add app
    console.log('Adding app to workspace...');
    const addRes = await fetch(`http://localhost:3000/api/users/workspaces/${workspace.id}/apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.id, order: 0 })
    });
    // Note: The route might be /api/workspaces/... or /api/users/workspaces/... depending on user.routes.ts
    // Looking at user.routes.ts: router.post('/workspaces/:workspaceId/apps', ...)
    // But user.routes.ts is likely mounted under /api/users by app.ts?
    // Let's check app.ts or similar if I can, but usually it's /api/users...
    // Wait, the workspaceController methods take workspaceId.
    // The previous 500 error repro used: workspaceController.getWorkspaces(req, res);
    // Let's assume the previous path I used in script was /api/workspaces/... 
    // In user.routes.ts I saw: router.post('/workspaces/:workspaceId/apps', workspaceController.addAppToWorkspace);
    // If user.routes.ts is mounted at /api/users, then full path is /api/users/workspaces/:workspaceId/apps.
    
    // Let's try to verify the mount point.
    // But for now I'll use the URL that matches the router structure if mounted at root or /api.
    // Actually, looking at repo history or common sense, user routes usually under /users.
    
    // I entered http://localhost:3000/api/workspaces/... in previous script.
    // Let's check app.ts to be sure.
    
    console.log('App added response:', addRes.status);

    // 4. Update Order API Call
    const newOrder = 5;
    console.log('Updating order...');
    const updateRes = await fetch(`http://localhost:3000/api/users/workspaces/${workspace.id}/apps/${app.id}/order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
    });
    console.log(`Order update response: ${updateRes.status}`);

    // 5. Verify Persistence
    const wsApp = await wsAppRepo.findOne({ where: { workspaceId: workspace.id, appId: app.id } });
    
    if (wsApp?.order === newOrder) {
        console.log('SUCCESS: Order persisted correctly!');
    } else {
        console.error(`FAILURE: Expected order ${newOrder}, got ${wsApp?.order}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
  }
}

main();
