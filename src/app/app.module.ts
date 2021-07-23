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
    SharedModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
