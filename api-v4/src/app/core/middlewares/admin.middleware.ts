import { RoleEnum } from '@app/enums/role.enum';
import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
    
    use(req: Request, res: Response, next: NextFunction) {
        // Extract roles from res.locals
        const userRoles = res.locals.userRoles as { id: RoleEnum; is_default: boolean }[] | undefined;

        if (!userRoles || userRoles.length === 0) {
            throw new UnauthorizedException('Unauthorized: No roles found.');
        }
        const adminRole = userRoles.find(role => role.id === RoleEnum.ADMIN);

        if (adminRole) {
            res.locals.roleId = RoleEnum.ADMIN;
            adminRole.is_default = true;
        } else {
            throw new ForbiddenException('Access denied. You do not have the required permissions to access this route.');
        }
        next();
    }
}
