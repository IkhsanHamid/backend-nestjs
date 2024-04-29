import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { webResponse } from '../model/web.model';
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { Auth, AuthAdmin } from '../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<webResponse<UserResponse>> {
    const result = await this.userService.register(request);
    return {
      data: result,
    };
  }

  @Post('addRole')
  async addRole(): Promise<string> {
    return await this.userService.addRole();
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<webResponse<LoginUserResponse>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }

  @Get('current')
  @HttpCode(200)
  async get(@AuthAdmin() user: User): Promise<webResponse<UserResponse>> {
    const result = await this.userService.get(user);
    return {
      data: result,
    };
  }

  @Put('current')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<webResponse<UserResponse>> {
    const result = await this.userService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('logout')
  @HttpCode(200)
  async logout(@Auth() user: User): Promise<webResponse<string>> {
    const result = await this.userService.logout(user);
    return {
      data: result,
    };
  }
}
