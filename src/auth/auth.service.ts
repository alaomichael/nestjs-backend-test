import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, biometricKey?: string): Promise<string> {
    const user = await this.userService.createUser(email, password, biometricKey);
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  async biometricLogin(biometricKey: string): Promise<string> {
    const user = await this.userService.findByBiometricKey(biometricKey);
    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}