import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  public filter = '1';
  public estado = ['Habilitada', 'Deshabilitada'];
  public tipo = ['Normal', 'Transbordo'];
  public propiedad = 'estacion';
  public lineas = Array.from(Array(7).keys());

  constructor(private estacionesService: StationsService,
              private toastr: ToastrService
              ) { 
  }

  ngOnInit(): void {
    this.loadStations();
    console.log(this.lineas)
  }

  public loadStations(){
    this.estacionesService.loadEstaciones().subscribe(resp => {
      if(resp){
        let estaciones = this.estacionesService.getEstaciones();
        this.makeStationList(estaciones);
      }else{
        this.toastr.error(this.estacionesService.getError(),'Error');
      }
    }, error => {
      this.toastr.error(this.estacionesService.getError(),'Error');
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
        tipo : e['tipo']
      }
      this.estaciones.pushBack(estacion);
    });
    sort(this.estaciones, (e)=> e[this.propiedad]);
  }
  
  /***
   * Se convierte a Array JSON para que Angular pueda manejarlo en el ngFor
   * Sin embargo, la función map esta implementada con código
   * puro y usando implementación propia 
   * (ver declaración en structures/lista.structures.ts)
   */
  public get stations() : Estacion[]{
    let estaciones = this.estaciones.map(e=> this.filter == '' || e.id_linea == Number(this.filter));
    sort(estaciones, e=>e[this.propiedad]);
    return estaciones.toArray();
  }

  public toggleStation(event, estacion : string, est : Estacion){
    event.preventDefault();
    let state = event.currentTarget.checked ? 0 : 1;
    console.log(estacion + ' => ' + state);
    this.estacionesService.toggleStation(estacion,state)
        .subscribe(resp=>{
          if(resp){
            let estado = state == 1 ? 'inhabilitada' : 'habilitada';
            let title = state == 1 ? 'Inhabilitación' : 'Habilitación';
            this.toastr.success(`La estación ${ estacion } fue ${ estado } con éxito`,`${title} con éxito`);
            this.estaciones.map(e => {
              return e.estacion == estacion;
            }).forEach(e=>{
              e.estatus = state;
            });
          }else{
            this.toastr.error(this.estacionesService.getError(),'Error');
          }
        },error=>{
          this.toastr.error(this.estacionesService.getError(),'Error');
        });
  }
}
