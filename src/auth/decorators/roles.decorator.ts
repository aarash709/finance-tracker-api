import { SetMetadata } from '@nestjs/common';
import { Role } from '../enumes';
import { Reflector } from '@nestjs/core';

export const Roles_Key = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(Roles_Key, roles);
