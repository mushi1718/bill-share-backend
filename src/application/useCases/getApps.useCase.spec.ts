import { GetAppsUseCase } from './getApps.useCase';
import { IAppRepository } from '../../domain/repositories/app.repository';

describe('GetAppsUseCase', () => {
  let useCase: GetAppsUseCase;
  let mockRepository: jest.Mocked<IAppRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findGlobalDefaults: jest.fn()
    };
    useCase = new GetAppsUseCase(mockRepository);
  });

  it('should return a list of apps', async () => {
    const mockResult = {
      data: [
        { id: '1', name: 'App 1', description: 'Desc 1', url: '', category: '', order: 1 } as any
      ],
      count: 1
    };
    mockRepository.findAll.mockResolvedValue(mockResult);

    const result = await useCase.execute(0, 10, 'en');

    expect(result).toEqual(mockResult);
    expect(mockRepository.findAll).toHaveBeenCalledWith(0, 10, 'en');
  });
});
