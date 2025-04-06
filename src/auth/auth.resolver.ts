import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { BiometricLoginInput } from './dto/biometric-login.input';
import { User } from '../user/user.type';
import { UserService } from '../user/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Query(() => User, { nullable: true })
  async getUser(@Args('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput): Promise<string> {
    return this.authService.register(input.email, input.password, input.biometricKey);
  }

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput): Promise<string> {
    return this.authService.login(input.email, input.password);
  }

  @Mutation(() => String)
  async biometricLogin(@Args('input') input: BiometricLoginInput): Promise<string> {
    return this.authService.biometricLogin(input.biometricKey);
  }
}