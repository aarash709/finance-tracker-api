import { Injectable } from '@nestjs/common';
import { Role } from '../auth/enumes';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { create } from 'domain';

export type User = { name: string; password: string; id: number; role: Role[] };

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findUserByName(name: string) {
    return this.databaseService.user.findFirst({
      where: {
        first_name: name,
      },
    });
  }
  async findUserById(id: number) {
    return this.databaseService.user.findFirst({
      where: {
        id,
      },
    });
  }
  async findUserByEmail(email: string) {
    return this.databaseService.user.findFirst({
      where: {
        email: email,
      },
      include: {
        UserAuthentication: true,
      },
    });
  }

  async createLocalUser(user: {
    displayName: string;
    passwordHash: string;
    email: string;
  }) {
    console.log('checking local user...');
    // const existingUser = await this.databaseService.user.findUnique({
    //     where: { email: user.email }
    // })
    // if (existingUser) throw new Error('Email already registered.');

    console.log('creating local user...');

    const newUser = await this.databaseService.user.create({
      data: {
        first_name: user.displayName,
        email: user.email,
        UserAuthentication: {
          create: {
            provider: 'LOCAL',
            password_hash: user.passwordHash,
          },
        },
        Account: {
          create: {
            name: 'Wallet',
            type: 'ASSET',
          },
        },
      },
    });
    return newUser;
  }
  async createOAuthUser(user: { firstName: string; email: string }) {
    // const newUser = await this.databaseService.$transaction(async (prisma) => {
    const createdUser = await this.databaseService.user.create({
      data: {
        first_name: user.firstName,
        email: user.email,
        UserAuthentication: {
          create: {
            provider: 'GOOGLE',
          },
        },
        Account: {
          create: {
            name: 'Wallet',
            type: 'ASSET',
          },
        },
      },
    });

    return createdUser;
  }
  async deleteUserById(id: number) {
    return this.databaseService.user.delete({
      where: { id },
    });
  }
}
