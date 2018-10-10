import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoreEditRoutingModule } from './chore-edit-routing.module';
import { EditchoreComponent } from './editchore/editchore.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatGridListModule, MatInputModule, 
  MatCardModule, MatMenuModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChoreEditRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  declarations: [EditchoreComponent]
})
export class ChoreEditModule { }
