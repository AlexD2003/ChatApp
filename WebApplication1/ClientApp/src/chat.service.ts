import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/chat")
  .configureLogging(signalR.LogLevel.Information)
  .build();
  public messages$ = new BehaviorSubject<any>([]);
  public connectedUser$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];  

  constructor() { 
    this.startConnection();
    this.connection.on("RecieveMessage",(userId: string, message: string,messageTime: string) => {
      this.messages = [...this.messages, {userId,message,messageTime}];
      this.messages$.next(this.messages);
    });
    
    this.connection.on("ConnectedUser",(users: any) => {
      this.connectedUser$.next(users);
    })
  }

  public async startConnection() {
    try {
      await this.connection.start();
      console.log("Connection started");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public async joinRoom(userId: string,roomId: string) {
    console.log(`Invoking joinInstance with userId: ${userId} and roomId: ${roomId}`);
    
    return this.connection.invoke("joinInstance", {user:userId, room:roomId});
 }
 public async sendMessage(message: string) {
    return this.connection.invoke("sendMessage",message);
 }
  public async leaveRoom() {
      return this.connection.stop();
  }
}
