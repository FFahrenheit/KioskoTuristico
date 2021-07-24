import { Component, OnInit } from '@angular/core';
import { Estacion } from 'src/app/models/station.interface';
import { StationsService } from 'src/app/services/stations.service';
import { Lista } from 'src/app/structures/lista.structure';
import { sort } from 'src/app/structures/quicksort.algorithm';

@Component({
  selector: 'app-enable-stations',
  templateUrl: './enable-stations.component.html',
  styleUrls: ['./enable-stations.component.scss']
})
export class EnableStationsComponent implements OnInit {

  private estaciones = new Lista<Estacion>();

  constructor(private estacionesService: StationsService) { 
  }

  ngOnInit(): void {
    this.estacionesService.loadEstaciones().subscribe(resp => {
      if(resp){
        let estaciones = this.estacionesService.getEstaciones();
        this.makeStationList(estaciones);
      }
    }, error => {
      console.log(error);
    });
  }

  public makeStationList(estaciones : any){
    estaciones.forEach(e=>{
      // console.log(e);
      const estacion : Estacion = {
        id_estacion : e['id_estacion'],
        estacion : e['estacion'],
        estatus : e['estatus'],
        id_kiosco : e['id_kiosco'],
        id_linea : e['id_linea'],
        id_matriz : e['id_matriz'],
        tipo : e['id_matriz']
      }
      this.estaciones.pushBack(estacion);
    });

    console.log(this.estaciones.toArray());

    console.log(this.estaciones.map((f)=> f.id_linea == 1).toArray());

    sort(this.estaciones,p => p.estacion);
    console.log(this.estaciones.toArray());
  }

}
