import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PuntoInteres } from 'src/app/models/place.interface';
import { PlacesService } from 'src/app/services/places.service';
import { Lista } from 'src/app/structures/lista.structure';
import { sort } from 'src/app/structures/quicksort.algorithm';

@Component({
  selector: 'app-edit-places',
  templateUrl: './edit-places.component.html',
  styleUrls: ['./edit-places.component.scss']
})
export class EditPlacesComponent implements OnInit {

  private puntos = new Lista<PuntoInteres>();
  public filter = ''; //Filtro de línea
  public propiedad = 'punto_de_interes'; //Ordenar por nombre
  public lineas = Array.from(Array(7).keys()); //Lineas
  private currentPoint : PuntoInteres;

  constructor(private puntosService : PlacesService,
              private toastr        : ToastrService) { }

  ngOnInit(): void {
    this.loadPoints();
    console.log(this.puntos);
  }

  private loadPoints(){
    this.puntosService.loadPlaces()
        .subscribe(resp=>{
          if(resp){
            let puntos = this.puntosService.getPlaces();
            this.makeList(puntos);
            console.log(this.puntos);
          }else{
            this.toastr.error(this.puntosService.getError(), 'Error');
          }
        },error=>{
          this.toastr.error(this.puntosService.getError(), 'Error');
        })
  }

  private makeList(puntos : any){
    this.puntos.clear();
    puntos.forEach(p =>{
      const punto : PuntoInteres =  {
        estacion : p['estacion'],
        id_kiosco: p['id_kiosco'],
        id_puntos: p['id_puntos'],
        punto_de_interes: p['punto_de_interes'],
        id_linea: p['id_linea']
      };
      this.puntos.pushBack(punto);
    });
    sort(this.puntos, (p)=>p.punto_de_interes);
  }

}
