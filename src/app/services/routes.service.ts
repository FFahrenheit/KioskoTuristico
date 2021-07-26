import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private stops : any;
  private errorMessage = 'Error de servicio';

  constructor(private http : HttpClient) { }

  public loadStops(){
    return this.http.get(`${base_url}/paradas`)
               .pipe(
                 map(resp=>{
                   if(resp['ok']){
                     this.stops = resp['paradas'];
                     return true;
                   }
                   this.errorMessage = resp['error'] || 'No se pudieron obtener las paradas';
                   return false;
                 }),catchError(error=>{
                   console.log(error);
                   this.errorMessage = 'Error de servidor';
                   return of(false);
                 })
               );
  }

  public getError() : string{
    return this.errorMessage;
  }

  public getStops(){
    return this.stops;
  }
}
