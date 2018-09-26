import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChoreshomeComponent } from './choreshome/choreshome.component'

const routes: Routes = [
  { path: '',      component: ChoreshomeComponent },
  {
    path: 'choreedit',
    loadChildren: './chore-edit/chore-edit.module#ChoreEditModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
