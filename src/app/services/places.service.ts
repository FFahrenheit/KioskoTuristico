import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private places : any;
  private errorMessage = 'Error de servicio';

  constructor(private http : HttpClient) { }

  public loadPlaces(){
    return this.http.get(`${base_url}/puntos`)
    .pipe(
      map((resp: any)=>{
        console.log(resp);
        if(resp['ok']){
          this.places = resp['puntos'];
          return true;
        }
        this.errorMessage = resp['error'] ||'No se pudieron obtener los puntos de interes';
        return false;
      }),catchError(e=>{
        console.log(e);
        this.errorMessage= 'Error en el servidor';
        return of(false);  
      })
    );
  }

  public getPlaces(){
    return this.places;
  }

  public getError() : string{
    return this.errorMessage;
  }
}
