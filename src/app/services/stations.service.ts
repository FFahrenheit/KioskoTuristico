import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  private estaciones : any;
  private messageError = 'Error de servicio';

  constructor(private http: HttpClient) { }

  public loadEstaciones(){
    return this.http.get(`${base_url}/estaciones`)
              .pipe(
                map((resp: any)=>{
                  if(resp['ok']){
                    this.estaciones = resp['estaciones'];
                    return true;
                  }
                  this.messageError = 'No se pudieron obtener las estaciones';
                  return false;
                }),catchError(e=>{
                  console.log(e);
                  this.messageError = 'Error en el servidor';
                  return of(false);  
                })
              );
  }

  public getError() : string{
    return this.messageError;
  }

  public getEstaciones() : any{
    return this.estaciones;
  }
}
