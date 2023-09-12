import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class TestAuthGuard implements CanActivate {
  async canActivate(): Promise<boolean> {
    return true;
  }
}
