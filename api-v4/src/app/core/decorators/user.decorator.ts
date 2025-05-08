// ================================================================>> Core Library
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// ================================================================>> Third Party Library
import * as jwt from 'jsonwebtoken';

// ================================================================>> Custom Library
import jwtConstants from "@app/shared/jwt/constants";
import TokenPayload from '@app/shared/user.payload';

const UserDecorator = createParamDecorator(async (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const token: string = request.headers?.authorization?.split('Bearer ')[1];
    const payload = jwt.verify(token, jwtConstants.secret) as TokenPayload;
    if (payload && payload.user) {
        return payload.user;
    }
    return null;
})
export default UserDecorator;