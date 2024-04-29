import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { PrismaService } from '../common/prisma.serivce';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register New User ${JSON.stringify(request)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
      roleId: user.roleId,
    };
  }

  async addRole(): Promise<string> {
    await this.prismaService.roles.create({
      data: {
        role: 'admin',
      },
    });
    return 'success';
  }

  async login(request: LoginUserRequest): Promise<LoginUserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Username or password is Invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Username or password is Invalid', 401);
    }
    const token = await this.jwtService.signAsync(user);
    console.log('ini token ======== ', token);

    user = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: token,
        isLogin: true,
      },
    });

    return {
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
      roleId: user.roleId,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update(${JSON.stringify(user)}, ${JSON.stringify(request)}`,
    );

    const updateRequest = await this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    return {
      name: result.name,
      username: result.username,
      roleId: result.roleId,
    };
  }

  async logout(user: User): Promise<string> {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
        isLogin: false,
      },
    });
    return 'success logout';
  }

  async checkingRole(id: number): Promise<object> {
    return await this.prismaService.roles.findUnique({
      where: {
        id: id,
      },
    });
  }
}
