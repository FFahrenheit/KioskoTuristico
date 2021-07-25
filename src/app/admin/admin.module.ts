import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnableStationsComponent } from './enable-stations/enable-stations.component';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';
import { FormsModule } from '@angular/forms';
import { EditStationsComponent } from './edit-stations/edit-stations.component';
import { SharedModule } from '../shared/shared.module';
import { EditPlacesComponent } from './edit-places/edit-places.component';

@NgModule({
  declarations: [
    EnableStationsComponent,
    EditStationsComponent,
    EditPlacesComponent
  ],
  imports: [
    RouterModule.forChild(AdminRoutes),
    CommonModule,
    FormsModule,
    SharedModule
  ]
})
export class AdminModule { }
