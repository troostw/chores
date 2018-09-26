import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditchoreComponent } from './editchore/editchore.component';

const routes: Routes = [
  {path: '', component: EditchoreComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoreEditRoutingModule { }
