import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChoreshomeComponent } from './choreshome/choreshome.component'
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '',      component: ChoreshomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'choreedit',
    loadChildren: './chore-edit/chore-edit.module#ChoreEditModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'chorelist',
    loadChildren: './chorelist/chorelist.module#ChorelistModule',
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
