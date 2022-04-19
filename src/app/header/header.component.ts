import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      this.isLoggedIn = !!user;
      console.log(this.isLoggedIn);
    });
  }
}
