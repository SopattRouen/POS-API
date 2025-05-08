// src/decorators/device-info.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Platform = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const deviceInfo = request['deviceInfo'] || {};
    return deviceInfo.platform || 'undefined';
  },
);
