import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  private getUsers() {
    this.http
      .get(
        'https://ng-complete-guide-2657e-default-rtdb.firebaseio.com/users.json'
      )
      .pipe(
        map((users) => {
          const usersArray = [];
          for (const key in users) {
            if (users.hasOwnProperty(key)) {
              usersArray.push({ ...users[key], id: key });
            }
          }
          return usersArray;
        })
      )
      .subscribe((resp) => console.log(resp));
  }
}
