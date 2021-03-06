import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChorelistRoutingModule } from './chorelist-routing.module'
import { ChorelisthomeComponent } from './chorelisthome/chorelisthome.component';
import { MatButtonModule, MatIconModule, MatGridListModule, MatInputModule, MatCardModule, MatMenuModule } from '@angular/material';
import { AddChorelistComponent } from './add-chorelist/add-chorelist.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChorelistRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatMenuModule
  ],
  declarations: [ChorelisthomeComponent, AddChorelistComponent]
})
export class ChorelistModule { }
