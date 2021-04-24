import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/modules/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { ValidationPipe } from '@nestjs/common';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUsers = [
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
      password: '1234',
    },
  ];

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest
      .fn()
      .mockImplementation((id) =>
        Promise.resolve(mockUsers.find((user) => user.id == id)),
      ),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockUsers);
  });

  it('/users/2 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users/2')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(await mockUsersRepository.findOne(2));
  });

  it('/users/3 (GET) --> 404 on not found', () => {
    return request(app.getHttpServer())
      .get('/users/3')
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        username: 'John',
        email: 'example@m.com',
        password: '1234',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: expect.any(Number),
          username: 'John',
          email: 'example@m.com',
          password: '1234',
        });
      });
  });

  it('/users (POST) --> 404 on validation error', () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect('Content-Type', /json/)
      .send({
        username: 1234434454,
        email: 'example',
        password: '1234',
      })
      .expect(400);
  });
});
