import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Linea } from '../models/line.interface';
import { PuntoInteres } from '../models/place.interface';
import { RutaFinal } from '../models/route.interface';
import { Estacion } from '../models/station.interface';
import { Parada } from '../models/stop.interface';
import { PlacesService } from '../services/places.service';
import { RoutesService } from '../services/routes.service';
import { StationsService } from '../services/stations.service';
import { Lista } from './lista.structure';
import { sort } from './quicksort.algorithm';
import { Ruta } from './ruta.class';

@Injectable({
    providedIn: 'root'
})
export class RouteCalculatorService {

    private estaciones = new Lista<Estacion>();
    private puntos = new Lista<PuntoInteres>();
    private lineas = new Lista<Linea>();
    private transbordos = new Lista<Estacion>();
    private ruta : Ruta;
    private rutaFinal : RutaFinal;

    private posiblesOrigenes = new Lista<Estacion>();
    private posiblesDestinos = new Lista<Estacion>();

    private matrizM: Lista<Lista<number>>;
    private matrizT: Lista<Lista<number>>;

    constructor(private estacionesService: StationsService,
        private puntosService: PlacesService,
        private rutasService: RoutesService) {
            this.init();
    }
    
    public init() : void{
        let calls = [];

        calls.push(this.estacionesService.loadEstaciones()
            .pipe(map(resp => {
                if (resp) {
                    this.makeStationList(this.estacionesService.getEstaciones());
                }
                return true;
            })));

        calls.push(this.puntosService.loadPlaces()
            .pipe(map(resp => {
                if (resp) {
                    this.makePlacesList(this.puntosService.getPlaces());
                }
                return true;
            })));

        calls.push(this.rutasService.loadLines()
            .pipe(map(resp => {
                if (resp) {
                    this.makeLinesList(this.rutasService.getLines());
                }
                return true;
            })));

        forkJoin(calls).subscribe(resp => {
            console.log(this.estaciones.toArray());
            sort(this.puntos, p => p.punto_de_interes);
            console.log(this.puntos.toArray());
            console.log(this.lineas.toArray());
            this.calculateMatrix();
            this.ruta = new Ruta(this.estaciones,this.puntos, this.lineas,this.transbordos,this.matrizM,this.matrizT);
        });
    }

    private makeStationList(estaciones: any[]) {
        this.estaciones.clear();
        estaciones.forEach(e => {
            const estacion: Estacion = {
                id_estacion: e['id_estacion'],
                estacion: e['estacion'],
                estatus: e['estatus'],
                id_kiosco: e['id_kiosco'],
                id_linea: e['id_linea'],
                id_matriz: e['id_matriz'],
                tipo: e['tipo']
            }
            this.estaciones.pushBack(estacion);
        });
    }

    private makePlacesList(puntos: any[]) {
        this.puntos.clear();
        console.log(puntos);
        puntos.forEach(p => {
            const punto: PuntoInteres = {
                estacion: p['estacion'],
                id_kiosco: p['id_kiosco'],
                id_puntos: p['id_puntos'],
                punto_de_interes: p['punto_de_interes'],
                id_linea: p['id_linea']
            };
            this.puntos.pushBack(punto);
        });
    }

    private makeLinesList(lineas : any[]){
        this.lineas.clear();
        lineas.forEach(l =>{
            const linea: Linea = {
                id_linea: l['id_linea'],
                origen: l['origen'],
                destino: l['destino'],
            };
            this.lineas.pushBack(linea);
        });
    }

    public loadRoute(origen: Parada, destino: Parada) {
        this.posiblesOrigenes.clear();
        this.posiblesDestinos.clear();

        if (origen.tipo == 0) {
            this.posiblesOrigenes = this.estaciones.map(e => e.estacion == origen.nombre);
        } else {
            let estaciones = new Lista<number>();
            this.puntos.forEach(p => {
                if (p.punto_de_interes == origen.nombre) {
                    estaciones.pushBack(p.id_kiosco);
                }
            });
            this.posiblesOrigenes = this.estaciones.map(e => estaciones.includes(e.id_kiosco));
        }

        if (destino.tipo == 0) {
            this.posiblesDestinos = this.estaciones.map(e => e.estacion == destino.nombre);
        } else {
            let estaciones = new Lista<number>();
            this.puntos.forEach(p => {
                if (p.punto_de_interes == destino.nombre) {
                    estaciones.pushBack(p.id_kiosco);
                }
            });
            this.posiblesDestinos = this.estaciones.map(e => estaciones.includes(e.id_kiosco));
        }

        console.log(this.posiblesOrigenes.toArray());
        console.log(this.posiblesDestinos.toArray());
        
        // console.clear();
        let minPeso = 999;
        this.posiblesOrigenes.forEach(o =>{
            this.posiblesDestinos.forEach(d =>{
                let ruta = this.ruta.setRuta(o,d);
                if(ruta.peso < minPeso){
                    this.rutaFinal = ruta;
                    minPeso = ruta.peso;
                }
            });
        });

        console.log(this.rutaFinal);
    }

    public getRoute() : RutaFinal {
        return this.rutaFinal;
    }

    public calculateMatrix() {
        let ids = new Lista<number>();
        let matrizM = new Lista<Lista<number>>();
        let matrizT = new Lista<Lista<number>>();

        let lista = this.estaciones.map(e => e.id_matriz != null);
        sort(lista, e => e.id_matriz);

        this.transbordos = lista;

        lista.forEach(l => {
            if (!ids.includes(l.id_matriz)) {
                ids.pushBack(l.id_matriz);
            }
        });

        ids.forEach(i => {
            let rowM = new Lista<number>();
            let rowT = new Lista<number>();
            ids.forEach(j => {
                let min = 99;
                if (i == j) {
                    min = 0;
                } else {
                    lista.map(a => a.id_matriz == i).forEach(o => {
                        lista.map(e => e.id_matriz == j).forEach(d => {
                            if (o.id_linea == d.id_linea) {
                                let minId = o.id_estacion > d.id_estacion ? d.id_estacion : o.id_estacion;
                                let maxId = minId == o.id_estacion ? d.id_estacion : o.id_estacion;
                                if (lista.map((l) => l.id_linea == o.id_linea
                                    && l.id_estacion > minId && l.id_estacion < maxId).size() == 0) {
                                    min = maxId - minId;
                                }
                            }
                        });
                    });
                }
                rowM.pushBack(min);
                rowT.pushBack(99);
            });
            matrizM.pushBack(rowM);
            matrizT.pushBack(rowT);
        });

        this.matrizM = matrizM;
        this.matrizT = matrizT;

        console.warn('Floyd algorithm');

        this.floydAlgorithm();

        this.printM();
        this.printT();

    }

    private floydAlgorithm(): void {
        let n = this.matrizM.size();
        for (let k = 0; k < n; k++) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    let path = this.getM(i, k) + this.getM(k, j);
                    if (path < this.getM(i, j)) {
                        this.setM(i, j, path);
                        this.setT(i, j, k);
                    }
                }
            }
        }
    }

    private printM(): void {
        let list = [];
        this.matrizM.forEach(m => {
            list.push(m.toArray());
        });
        console.table(list);
    }

    private printT(): void {
        let list = [];
        this.matrizT.forEach(m => {
            list.push(m.toArray());
        });
        console.table(list);
    }

    private setM(i: number, j: number, val: number): void {
        this.matrizM.get(i).set(j, val);
    }

    private setT(i: number, j: number, val: number): void {
        this.matrizT.get(i).set(j, val);
    }

    private getM(i: number, j: number): number {
        return this.matrizM.get(i).get(j);
    }

    private getT(i: number, j: number): number {
        return this.matrizT.get(i).get(j);
    }

    public getDirection(id : number, direction : boolean){
        if(direction){
          return this.lineas.findMap(l => l.id_linea == id).destino;
        }else{
            return this.lineas.findMap(l => l.id_linea == id).origen;
        }
      }

}
