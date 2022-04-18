import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


export interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  user: User = {
    email: '',
    password: '',
  };


  constructor() {}

  ngOnInit() {}


  onSubmit(form:NgForm){
    console.log(form.value);
    form.reset();
  }


}