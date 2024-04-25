import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.serivce';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}
  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'ikhsans',
      },
    });
  }

  async getUser(): Promise<any> {
    return await this.prismaService.user.findFirst({
      where: {
        username: 'ikhsans',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'ikhsans',
        name: 'ikhsans hamid',
        password: await bcrypt.hash('12345678', 10),
        roleId: 1,
        token: 'test',
      },
    });
  }
}
