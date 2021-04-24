import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(() => {
      return [
        {
          id: 1,
          username: 'John',
          email: 'example@m.com',
          password: '1234',
        },
        {
          id: 2,
          username: 'Jack',
          email: 'example2@m.com',
          password: '12345',
        },
      ];
    }),
    create: jest.fn((dto) => {
      return { id: Date.now(), ...dto };
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return { id, ...dto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = {
      username: 'John',
      email: 'example@m.com',
      password: '1234',
    };

    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });

    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', () => {
    const dto = {
      username: 'John',
      email: 'example@m.com',
      password: '1234',
    };

    expect(controller.update(1, dto)).toEqual({
      id: 1,
      ...dto,
    });

    expect(mockUsersService.update).toHaveBeenCalled();
  });

  it('should return all users', () => {
    const users = [
      {
        id: 1,
        username: 'John',
        email: 'example@m.com',
        password: '1234',
      },
      {
        id: 2,
        username: 'Jack',
        email: 'example2@m.com',
        password: '12345',
      },
    ];

    expect(controller.findAll()).toEqual(users);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });
});
