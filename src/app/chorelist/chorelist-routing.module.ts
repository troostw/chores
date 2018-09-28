import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChorelisthomeComponent } from './chorelisthome/chorelisthome.component';
import { AddChorelistComponent } from './add-chorelist/add-chorelist.component';

const routes: Routes = [
  {path: '', component: ChorelisthomeComponent},
  {path: 'edit/:chorelistid', component: AddChorelistComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChorelistRoutingModule { }
