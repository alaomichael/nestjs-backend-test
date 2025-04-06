import { Injectable,Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      Logger.error('JWT_SECRET environment variable is not set');
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      return null;
    }
    return { id: user.id, email: user.email };
  }
}