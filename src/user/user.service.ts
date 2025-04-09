import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string, biometricKey?: string): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      let hashedBiometricKey: string | null = null;

      if (biometricKey) {
        hashedBiometricKey = await bcrypt.hash(biometricKey, 10);
      }

      return await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          biometricKey: hashedBiometricKey,
        },
      });
    } catch (error) {
      Logger.error('Error creating user', error.stack);
      throw new Error('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      Logger.error('Error finding user by email', error.stack);
      return null;
    }
  }

  async findByBiometricKey(biometricKey: string): Promise<User | null> {
    try {
      const users = await this.prisma.user.findMany({
        where: { biometricKey: { not: null } },
      });

      for (const user of users) {
        if (user.biometricKey && (await bcrypt.compare(biometricKey, user.biometricKey))) {
          return user;
        }
      }
      return null;
    } catch (error) {
      Logger.error('Error finding user by biometric key', error.stack);
      return null;
    }
  }
}