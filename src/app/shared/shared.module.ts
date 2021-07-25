import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderSpinnerComponent } from './loader-spinner/loader-spinner.component';
import { FooterComponent } from './footer/footer.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoaderSpinnerComponent,
    FooterComponent,
    EditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoaderSpinnerComponent,
    FooterComponent,
    EditModalComponent
  ]
})
export class SharedModule { }
