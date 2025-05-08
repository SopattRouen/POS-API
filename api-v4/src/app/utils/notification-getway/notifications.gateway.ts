import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface RegisteredUser {
  clientId: string; // Track clientId to send notifications
  userId: string;   // Track userId for identifying users
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/notifications-getway' })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private registeredUsers: RegisteredUser[] = [];
  handleConnection(client: Socket): void {
  }

  handleDisconnect(client: Socket): void {
    this.registeredUsers = this.registeredUsers.filter(user => user.clientId !== client.id);
  }

  sendOrderNotification(notification: any): void {
    this.server.emit('new-order-notification', notification);
  }
  
  sendNotificationToUser(userId: string, notification: any): void {
    const user = this.registeredUsers.find(user => user.userId === userId);
    if (user) {
      const client = this.server.sockets.sockets.get(user.clientId);
      if (client) {
        client.emit('notification-update', notification);
      }
    } else {
      console.error(`User with ID ${userId} is not connected.`);
    }
  }
}
