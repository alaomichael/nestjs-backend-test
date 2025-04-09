import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, biometricKey?: string): Promise<string> {
    this.logger.log(`Registering user with email: ${email}`);
    try {
      const user = await this.userService.createUser(email, password, biometricKey);
      return this.jwtService.sign({ sub: user.id, email: user.email });
    } catch (error) {
      this.logger.error(`Error registering user with email ${email}`, error.stack);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<string> {
    this.logger.log(`Logging in user with email: ${email}`);
    try {
      const user = await this.userService.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.jwtService.sign({ sub: user.id, email: user.email });
    } catch (error) {
      this.logger.error(`Error logging in user with email ${email}`, error.stack);
      throw error;
    }
  }

  async biometricLogin(biometricKey: string): Promise<string> {
    this.logger.log(`Attempting biometric login with key`);
    try {
      const user = await this.userService.findByBiometricKey(biometricKey);
      if (!user) {
        throw new UnauthorizedException('Invalid biometric key');
      }
      this.logger.log(`Biometric login successful for user with email: ${user.email}`);
      return this.jwtService.sign({ sub: user.id, email: user.email });
    } catch (error) {
      this.logger.error(`Error in biometric login`, error.stack);
      throw error;
    }
  }
}