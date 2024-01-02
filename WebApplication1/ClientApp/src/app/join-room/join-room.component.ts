import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from 'src/chat.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {
  joinRoomForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.joinRoomForm = this.fb.group({
      roomName: ['', Validators.required],
      userName: ['', Validators.required]
    });
  }

  joinRoom(): void {
    
    const { userName, roomName } = this.joinRoomForm.value;
    sessionStorage.setItem('user', userName);
    sessionStorage.setItem('room', roomName);
    console.log('Form values before server request:', userName, roomName); // Log form values
    this.chatService.joinRoom(userName, roomName)
      .then(() => {
        this.router.navigate(['chat']);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
}
