import { AppDataSource } from '../src/infrastructure/config/data-source';
import { User } from '../src/infrastructure/database/entities/user.entity';
import { App } from '../src/infrastructure/database/entities/app.entity';
import { AppTranslation } from '../src/infrastructure/database/entities/app-translation.entity';
import { apps as mockApps } from '../src/infrastructure/mock/apps.mock';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected for seeding');

  const userRepository = AppDataSource.getRepository(User);
  const appRepository = AppDataSource.getRepository(App);
  const translationRepository = AppDataSource.getRepository(AppTranslation);

  // 1. Seed User
  const existingUser = await userRepository.findOneBy({ email: 'x32323@gmail.com' });
  if (!existingUser) {
    const user = userRepository.create({
      id: 'user_x32323',
      email: 'x32323@gmail.com',
      firebaseUid: 'fake_firebase_uid_123',
      name: 'Ray',
      avatarUrl: 'https://ui-avatars.com/api/?name=Ray&background=0D8ABC&color=fff'
    });
    await userRepository.save(user);
    console.log('Default user created');
  } else {
    console.log('Default user already exists');
  }

  // 2. Seed Apps and Translations
  for (const mockApp of mockApps) {
    let app = await appRepository.findOneBy({ id: mockApp.id });
    if (!app) {
      app = appRepository.create({
        id: mockApp.id,
        url: mockApp.url,
        category: mockApp.category,
        icon: mockApp.icon,
        order: mockApp.order
      });
      await appRepository.save(app);
      
      const translations = Object.entries(mockApp.translations).map(([lang, data]) => {
        return translationRepository.create({
          appId: mockApp.id,
          lang,
          name: data.name,
          description: data.description
        });
      });
      await translationRepository.save(translations);
      console.log(`App ${mockApp.id} seeded with translations`);
    }
  }

  console.log('Seeding completed successfully');
  await AppDataSource.destroy();
}

seed().catch(error => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
