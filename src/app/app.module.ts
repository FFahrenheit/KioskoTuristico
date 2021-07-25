import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { InicioComponent } from './inicio/inicio.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { SharedModule } from './shared/shared.module';
import { AdminComponent } from './layouts/admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    BlankComponent,
    AdminComponent
  ],
  imports: [
    RouterModule.forRoot(AppRoutes),
    BrowserModule,
    FormsModule,
    NgbModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3500,
      progressBar: true,
      progressAnimation: 'increasing'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
