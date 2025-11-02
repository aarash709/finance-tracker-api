import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TransactionService } from '../transaction/transaction.service';
import * as bcrypt from 'bcrypt';

type AuthInput = { email: string; password: string };
type SingInData = {
  first_name: string;
  email: string;
  id: number;
  role?: string;
};
type AuthResult = {
  accessToken: string;
  email: string;
  first_name: string;
  sub: number;
  role?: string;
};
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private transactionService: TransactionService,
  ) {}

  async login(authinput: AuthInput) {
    const user = await this.validateLocalUser(authinput);
    if (!user) {
      throw new UnauthorizedException();
    }
    const saltRounds = 10;
    const inputHashedPassword = await bcrypt.hash(
      authinput.password,
      saltRounds,
    );
    const isPassEqual = await bcrypt.compare(
      authinput.password,
      inputHashedPassword,
    );

    if (!isPassEqual) {
      throw new UnauthorizedException();
    }
    return this.generateJWT({
      first_name: user.first_name!,
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async validateOAuthUser(authInput: { firstName: string; email: string }) {
    const user = await this.usersService.findUserByEmail(authInput.email);
    if (user) {
      //update user here
      return user;
    }
    const newUser = await this.usersService.createOAuthUser({
      firstName: authInput.firstName,
      email: authInput.email,
    });
    return newUser;
  }
  async validateLocalUser(authInput: AuthInput) {
    const user = await this.usersService.findUserByEmail(authInput.email);
    if (!user) return null;

    return user;
  }

  async generateJWT(input: SingInData) {
    const jwtPayload = {
      sub: input.id,
      first_name: input.first_name,
      email: input.email,
      role: input.role,
    };
    const token = await this.jwtService.signAsync(jwtPayload);

    return { access_token: token };
  }

  async localSignup(input: {
    displayName: string;
    email: string;
    password: string;
  }) {
    //check database
    const existingUser = await this.usersService.findUserByEmail(input.email);

    if (existingUser) throw new ConflictException('Email already in use!');

    const saltRounds = 10;
    const inputHashedPassword = await bcrypt.hash(input.password, saltRounds);

    const createdUser = await this.usersService.createLocalUser({
      email: input.email,
      passwordHash: inputHashedPassword,
      displayName: input.displayName,
    });

    const jwtPayload = {
      sub: createdUser.id,
      email: createdUser.email,
      displayName: createdUser.first_name,
      role: createdUser.role,
    };
    const token = await this.jwtService.signAsync(jwtPayload);

    return {
      token: token,
      id: createdUser.id,
      displayName: createdUser.first_name,
      email: createdUser.email,
      role: createdUser.role,
    };
  }
}
