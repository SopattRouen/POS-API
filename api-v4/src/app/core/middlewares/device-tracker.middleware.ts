// src/middleware/device-tracker.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as requestIp from 'request-ip';
import * as useragent from 'useragent';

@Injectable()
export class DeviceTrackerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      requestIp.getClientIp(req) ||
      '127.0.0.1'; // Default to localhost for development

    // Normalize IPv4-mapped IPv6 address (e.g., ::ffff:192.168.1.1 -> 192.168.1.1)
    if (ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    if (ip === '::1' || ip === '127.0.0.1') {
      ip = '127.0.0.1';
    }

    // Parse User-Agent header to detect the device and browser
    const userAgentString = req.headers['user-agent'] || '';
    const agent = useragent.parse(userAgentString);

    // Detect if the request is coming from a mobile app (e.g., Flutter)
    const isMobile = req.headers['x-flutter'] === 'true';
    const platform = isMobile ? 'Mobile' : agent.device.type || 'Web';

    // Extract relevant data for logging or analytics
    const deviceInfo = {
      ip,
      browser: agent.toAgent(),
      os: agent.os.toString(),
      platform,
      timestamp: new Date(),
    };

    // Attach deviceInfo to request object for further processing
    req['deviceInfo'] = deviceInfo;

    // Continue to the next middleware or route handler
    next();
  }
}
