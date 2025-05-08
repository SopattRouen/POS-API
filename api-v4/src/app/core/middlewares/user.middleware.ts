import { RoleEnum } from '@app/enums/role.enum';
import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const userRoles = res.locals.userRoles as { id: RoleEnum; is_default: boolean }[] | undefined;

        if (!userRoles || userRoles.length === 0) {
            throw new UnauthorizedException('Unauthorized: No roles found.');
        }
        const userRole = userRoles.find(role => role.id === RoleEnum.CASHIER);

        if (userRole) {
            res.locals.roleId = RoleEnum.CASHIER;
            userRole.is_default = true;
        } else {
            throw new ForbiddenException('Access denied. You do not have the required permissions to access this route.');
        }
        next();
    }
}
