import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../src/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', async () => {
  let authService: AuthService;
  let userService: UserService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: await bcrypt.hash('password123', 10),
    biometricKey: 'biometric123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-token'),
  };

  const mockUserService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    findByEmail: jest.fn().mockResolvedValue(mockUser),
    findByBiometricKey: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        PrismaService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should register a user and return a token', async () => {
    const token = await authService.register('test@example.com', 'password123');
    expect(token).toBe('mocked-token');
    expect(userService.createUser).toHaveBeenCalled();
  });

  it('should login a user and return a token', async () => {
    const token = await authService.login('test@example.com', 'password123');
    expect(token).toBe('mocked-token');
    expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should perform biometric login and return a token', async () => {
    const token = await authService.biometricLogin('biometric123');
    expect(token).toBe('mocked-token');
    expect(userService.findByBiometricKey).toHaveBeenCalledWith('biometric123');
  });

  it('should throw UnauthorizedException for invalid login', async () => {
    mockUserService.findByEmail.mockResolvedValueOnce(null);
    await expect(authService.login('test@example.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
  });
});