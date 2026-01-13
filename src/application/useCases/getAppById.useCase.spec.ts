import { GetAppByIdUseCase } from './getAppById.useCase';
import { IAppRepository } from '../../domain/repositories/app.repository';

describe('GetAppByIdUseCase', () => {
  let useCase: GetAppByIdUseCase;
  let mockRepository: jest.Mocked<IAppRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findGlobalDefaults: jest.fn()
    };
    useCase = new GetAppByIdUseCase(mockRepository);
  });

  it('should return an app by id', async () => {
    const mockApp = { id: '1', name: 'App 1', description: 'Desc 1' } as any;
    mockRepository.findById.mockResolvedValue(mockApp);

    const result = await useCase.execute('1', 'en');

    expect(result).toEqual(mockApp);
    expect(mockRepository.findById).toHaveBeenCalledWith('1', 'en');
  });

  it('should return null if app not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('999', 'en');

    expect(result).toBeNull();
    expect(mockRepository.findById).toHaveBeenCalledWith('999', 'en');
  });
});
