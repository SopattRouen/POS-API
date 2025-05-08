import { RoleEnum } from '@app/enums/role.enum';
import jwtConstants from '@app/shared/jwt/constants';
import TokenPayload from '@app/shared/user.payload';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authorization token is missing or not in the correct format.');
        }

        const token = authorizationHeader.split('Bearer ')[1];

        try {
            // Verify and decode the JWT
            const payload = jwt.verify(token, jwtConstants.secret) as TokenPayload;

            // Extract roles from the payload and check for a default role
            const userRoles = payload.user.roles.map(role => ({
                id: role.id as RoleEnum,
                is_default: role.is_default
            }));

            let defaultRole = userRoles.find(role => role.is_default);
            if (!defaultRole) {
                console.warn('User does not have a default role. Using the first role as default.');
                defaultRole = userRoles.length > 0 ? userRoles[0] : null; // Ensure there's at least one role
            }

            // Set the roles and default role in res.locals
            if (defaultRole) {
                res.locals.userRoles = userRoles;
                res.locals.roleId = defaultRole.id;
            } else {
                throw new UnauthorizedException('User does not have any valid roles.');
            }

            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException('Authorization token is expired.');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException('Authorization token is invalid.');
            } else {
                throw new UnauthorizedException('Authorization token is invalid.');
            }
        }
    }
}

