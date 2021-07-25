import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnableStationsComponent } from './enable-stations/enable-stations.component';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';
import { FormsModule } from '@angular/forms';
import { EditStationsComponent } from './edit-stations/edit-stations.component';

@NgModule({
  declarations: [
    EnableStationsComponent,
    EditStationsComponent
  ],
  imports: [
    RouterModule.forChild(AdminRoutes),
    CommonModule,
    FormsModule,
  ]
})
export class AdminModule { }
