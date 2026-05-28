import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

@Injectable()

export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    // Get required roles from decorator
    const requiredRoles =
      this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

    // No roles required
    if (!requiredRoles) {
      return true;
    }

    // Get request
    const request =
      context.switchToHttp().getRequest();

    // req.user comes from JwtGuard
    const user = request.user;

    // Check role
    const hasRole =
      requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    return true;
  }
}