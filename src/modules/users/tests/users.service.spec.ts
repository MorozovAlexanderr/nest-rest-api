import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that', async () => {
    const dto = {
      username: 'John',
      email: 'example@m.com',
      password: '1234',
    };

    expect(await service.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
  });
});
