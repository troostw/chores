import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChoreshomeComponent } from './choreshome/choreshome.component'
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { InvitecompleteComponent } from './invitecomplete/invitecomplete.component';

const routes: Routes = [
  { path: '',      component: ChoreshomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'invite', component: InvitecompleteComponent },
  {
    path: 'choreedit',
    loadChildren: './chore-edit/chore-edit.module#ChoreEditModule',
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
