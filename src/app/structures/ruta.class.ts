import { Linea } from "../models/line.interface";
import { PuntoInteres } from "../models/place.interface";
import { Estacion } from "../models/station.interface";
import { Lista } from "./lista.structure";
import { sort } from "./quicksort.algorithm";

export class Ruta {

    public origen: Estacion;
    public destino: Estacion;
    public origenFijo: Estacion;
    public destinoFijo: Estacion;

    private costoTransbordo = 3;
    private costoEspera = 2;
    private costoEstacion = 1;

    constructor(private estaciones: Lista<Estacion>,
        private puntos: Lista<PuntoInteres>,
        private lineas: Lista<Linea>,
        private transbordos: Lista<Estacion>,
        private M: Lista<Lista<number>>,
        private T: Lista<Lista<number>>) { }

    public setRuta(origen: Estacion, destino: Estacion) {
        this.origen = this.origenFijo = origen;
        this.destino = this.destinoFijo = destino;
        this.calculateRoute();
    }

    private calculateRoute(): void {
        console.clear();

        while (this.origen.id_linea != this.destino.id_linea) {
            let posiblesTransbordosOrigen = this.transbordos.map(t => t.id_linea == this.origen.id_linea);
            let posiblesTransbordosDestino = this.transbordos.map(t => t.id_linea == this.destino.id_linea);
            let minPeso = 99;
            let minTransbordos: any[];
            posiblesTransbordosOrigen.forEach(o => {
                posiblesTransbordosDestino.forEach(d => {
                    let costoIr = Math.abs(o.id_estacion - this.origen.id_estacion) * this.costoEstacion;
                    let costoLlegar = Math.abs(d.id_estacion - this.destino.id_estacion) * this.costoEstacion;
                    console.warn('Nuevo cálculo');
                    console.log({ o, d });
                    console.log({ costoIr, costoLlegar });
                    let costo = costoLlegar + costoIr + this.costoEspera;
                    let origen = o;
                    let destino = d;
                    let transbordos = [];

                    while (origen.id_linea != destino.id_linea) {
                        console.log({ origen, destino });
                        costo += this.pesoRecorrido(origen.id_matriz, d.id_matriz) + this.costoTransbordo;
                        transbordos.push(origen);

                        let sigTransbordo = this.destinoRecorrido(origen.id_matriz, destino.id_matriz);
                        console.log({ sigTransbordo });

                        /***
                         * En teoría están en la misma línea...
                         */
                        if (sigTransbordo == 99) {
                            costo += this.pesoRecorrido(origen.id_matriz, destino.id_matriz);
                            let s = this.estaciones.map(e => e.id_matriz == destino.id_matriz);
                            let t = this.estaciones.map(e => e.id_matriz == origen.id_matriz);
                            s.forEach(_s => {
                                t.forEach(_t => {
                                    if (_s.id_linea == _t.id_linea) {
                                        origen = _t;
                                        destino = _s;
                                    }
                                })
                            });
                            console.log({
                                origen,
                                destino
                            });
                            if (origen && destino) {
                                console.error('Peso aquí => ' + costo);
                                transbordos.push(destino);
                            } else {
                                costo += 100;
                                console.log('Skipped!');
                                break;
                            }
                        } else {
                            /***
                             * Otro transbordo :v
                             */
                            origen = this.transbordos.findUnique(t => t.id_matriz
                                == this.destinoRecorrido(origen.id_matriz, destino.id_matriz));
                        }
                    }
                    if (minPeso > costo) {
                        minPeso = costo;
                        minTransbordos = transbordos;
                    }
                });
            });
            console.warn('MIN PESO = ' + minPeso);
            console.table(minTransbordos);
            console.warn('Blurp!');
            break;
        }
    }

    private faltante(): number {
        let direccion = this.destino.id_estacion > this.origen.id_estacion;

        let l = this.lineas.findUnique(l => l.id_linea == this.origen.id_linea);
        let linea = direccion ? l.destino : l.origen;
        let min = direccion ? this.origen : this.destino;
        let max = direccion ? this.destino : this.origen;

        console.log('LINEA: Tomar la línea hacia ' + linea);

        let estaciones = this.estaciones.map((l) => {
            return l.id_linea == this.origen.id_linea && l.id_estacion >= min.id_estacion && l.id_estacion <= max.id_estacion
        });

        sort(estaciones, e => e.id_estacion);

        if (!direccion) {
            estaciones = estaciones.reverse();
        }

        estaciones.iterate((e, i) => {
            if (e == estaciones.front()) {
                console.log('Subirse en ' + e.estacion);
            } else if (e == estaciones.back()) {
                console.log('Bajarse en ' + e.estacion);
            } else if (e.id_matriz) {
                estaciones.sublist(i).map(s => s.id_matriz && s.id_matriz != e.id_matriz).forEach(s => {
                    let myPath = Math.abs(s.id_estacion - e.id_estacion);
                    let matrixPond = this.pesoRecorrido(e.id_matriz, s.id_matriz) + 1;
                    let matrixPath = this.destinoRecorrido(e.id_matriz, s.id_matriz);
                    console.log({
                        'directo': myPath,
                        'por matriz': matrixPond,
                        'destino matriz': matrixPath,
                        estacion: s.estacion,

                    });
                });
                console.log('Pasa por la estación cruce ' + e.estacion);
            } else {
                console.log('Pasar ' + e.estacion);
            }
        });

        return estaciones.size();
    }

    private pesoRecorrido(i: number, j: number): number {
        return this.M.get(i).get(j);
    }

    private destinoRecorrido(i: number, j: number): number {
        return this.T.get(i).get(j);
    }

}