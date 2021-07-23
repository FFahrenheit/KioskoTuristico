import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderSpinnerComponent } from './loader-spinner/loader-spinner.component';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    LoaderSpinnerComponent,
    FooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoaderSpinnerComponent,
    FooterComponent
  ]
})
export class SharedModule { }
