import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnableStationsComponent } from './enable-stations/enable-stations.component';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';

@NgModule({
  declarations: [
    EnableStationsComponent
  ],
  imports: [
    RouterModule.forChild(AdminRoutes),
    CommonModule
  ]
})
export class AdminModule { }
