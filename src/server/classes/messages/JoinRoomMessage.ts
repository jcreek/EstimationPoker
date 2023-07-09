export class JoinRoomMessage {
    type: string;
    roomId: string;
    userId: string;
    name: string;
  
    constructor(roomId: string, userId: string, name: string) {
      this.type = 'join-room';
      this.roomId = roomId;
      this.userId = userId;
      this.name = name;
    }
  }
  