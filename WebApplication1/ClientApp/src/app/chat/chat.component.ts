import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private messageSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    public chatService: ChatService
  ) {}

  inputMessage = "";
  messages: any[] = [];
  loggedInUserName = sessionStorage.getItem('user');
  roomName = sessionStorage.getItem('room');

  ngOnInit(): void {
    this.messageSubscription = this.chatService.messages$.subscribe((res: any[]) => {
      this.messages = res.map(message => {
        return {
          user: message.userId,
          message: message.message,
          time: new Date(message.messageTime)
        };
      });
      console.log('Received messages:', this.messages);
    });
  }

  leaveRoom() {
    this.router.navigate(['join-room']);
  }

  sendMessage() {
    this.chatService.sendMessage(this.inputMessage).then(() => {
      this.inputMessage = "";
    }).catch((err) => {
      console.log(err);
    });
  }

  ngOnDestroy(): void {

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
