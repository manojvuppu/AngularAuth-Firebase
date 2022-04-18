import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.modules';
import { RecipesComponent } from './recipes/recipes.component';
import { AuthComponent } from './auth/auth.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule,AppRoutingModule,HttpClientModule ],
  declarations: [ AppComponent, HelloComponent,HeaderComponent,RecipesComponent,AuthComponent,ShoppingListComponent,SpinnerComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
