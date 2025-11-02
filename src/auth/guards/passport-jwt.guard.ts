import { AuthGuard } from '@nestjs/passport';

export class PassportJwtGuard extends AuthGuard('jwt') {}
