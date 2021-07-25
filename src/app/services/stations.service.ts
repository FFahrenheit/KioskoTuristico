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

  public changeStation(station : string, name : string){
    let form = {
      station,
      name
    };
    return this.http.post(`${ base_url }/estacion`, form)
    .pipe(
      map(resp=>{
        if(resp['ok']){
          return true;
        }
        this.messageError = resp['error'] || 'No se pudo cambiar el nombre a la estación';
        return false;
      }),catchError(error=>{
        this.messageError = 'Error de servidor';
        return of(false);
      })
    );  
  }

  public toggleStation(station : string, state : number){
    let form = {
      station,
      state
    };
    return this.http.put(`${ base_url }/estacion`, form)
               .pipe(
                 map(resp=>{
                   if(resp['ok']){
                     return true;
                   }
                   this.messageError = 'No se pudo cambiar el estado de la estación';
                   return false;
                 }),catchError(error=>{
                   this.messageError = 'Error de servidor';
                   return of(false);
                 })
               );
  }
}
