import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoreEditRoutingModule } from './chore-edit-routing.module';
import { EditchoreComponent } from './editchore/editchore.component';

@NgModule({
  imports: [
    CommonModule,
    ChoreEditRoutingModule
  ],
  declarations: [EditchoreComponent]
})
export class ChoreEditModule { }
