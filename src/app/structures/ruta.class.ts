import { Linea } from "../models/line.interface";
import { PuntoInteres } from "../models/place.interface";
import { Estacion } from "../models/station.interface";
import { Lista } from "./lista.structure";
import { sort } from "./quicksort.algorithm";

export class Ruta{

    public origen : Estacion;
    public destino : Estacion;
    public origenFijo : Estacion;
    public destinoFijo : Estacion;


    constructor(private estaciones : Lista<Estacion>,
                private puntos : Lista<PuntoInteres>,
                private lineas : Lista<Linea>,
                private transbordos : Lista<Estacion>,
                private M : Lista<Lista<number>>,
                private T : Lista<Lista<number>>){ }

    public setRuta(origen : Estacion, destino : Estacion){
        this.origen = this.origenFijo = origen;
        this.destino = this.destinoFijo = destino;

        while(this.origen.id_linea != this.destino.id_linea){
            console.log('Blurp');
            return;
        }

        let direccion  = this.destino.id_estacion > this.origen.id_estacion;

        let l = this.lineas.findUnique(l => l.id_linea == this.origen.id_linea);
        let linea = direccion? l.destino : l.origen;
        let min = direccion ? this.origen : this.destino;
        let max = direccion ? this.destino : this.origen;

        console.log('LINEA: Tomar la línea hacia ' + linea);

        let estaciones = this.estaciones.map((l)=>{
            return l.id_linea == this.origen.id_linea && l.id_estacion >=  min.id_estacion && l.id_estacion <= max.id_estacion
        });

        sort(estaciones, e => e.id_estacion);

        console.log(estaciones.toArray());
        console.log(estaciones.reverse().toArray());

        if(direccion){
            for(let i = 0; i<estaciones.size(); i++){
                console.log(estaciones.get(i));
            }
        }else{
            for(let j = estaciones.size(); j<estaciones.size(); j++){

            }
        }
    }
}