import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/recipes' },
  {
    path: 'recipes',
    component: RecipesComponent,
  },
  {
    path: 'login',
    component: AuthComponent,
  },
  {
    path: 'recipes',
    component: RecipesComponent,
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
