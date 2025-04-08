import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { BiometricLoginInput } from './dto/biometric-login.input';
import { User } from '../user/user.type';
import { UserService } from '../user/user.service';
import { Logger } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Query(() => User, { nullable: true })
  async getUser(@Args('email') email: string): Promise<User | null> {
    this.logger.log(`Fetching user with email: ${email}`);
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        this.logger.warn(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with email ${email}`, error.stack);
      throw new Error('Failed to fetch user');
    }
  }

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput): Promise<string> {
    this.logger.log(`Registering user with email: ${input.email}`);
    try {
      return await this.authService.register(input.email, input.password, input.biometricKey);
    } catch (error) {
      this.logger.error(`Error registering user with email ${input.email}`, error.stack);
      throw new Error('Failed to register user');
    }
  }

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput): Promise<string> {
    this.logger.log(`Logging in user with email: ${input.email}`);
    try {
      return await this.authService.login(input.email, input.password);
    } catch (error) {
      this.logger.error(`Error logging in user with email ${input.email}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => String)
  async biometricLogin(@Args('input') input: BiometricLoginInput): Promise<string> {
    this.logger.log(`Biometric login with key: ${input.biometricKey}`);
    try {
      return await this.authService.biometricLogin(input.biometricKey);
    } catch (error) {
      this.logger.error(`Error in biometric login with key ${input.biometricKey}`, error.stack);
      throw error;
    }
  }
}