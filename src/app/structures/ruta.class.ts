import { Linea } from "../models/line.interface";
import { PuntoInteres } from "../models/place.interface";
import { Point, RutaFinal, Tramo } from "../models/route.interface";
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

    constructor(private estaciones  : Lista<Estacion>,
                private puntos      : Lista<PuntoInteres>,
                private lineas      : Lista<Linea>,
                private transbordos : Lista<Estacion>,
                private M           : Lista<Lista<number>>,
                private T           : Lista<Lista<number>>) { }

    public setRuta(origen: Estacion, destino: Estacion) : RutaFinal {
        this.origen = this.origenFijo = origen;
        this.destino = this.destinoFijo = destino;
        return this.calculateRoute();
    }

    private calculateRoute(): RutaFinal {
        console.clear();

        let minPeso = 999;

        let posiblesTransbordosOrigen = this.transbordos.map(t => t.id_linea == this.origen.id_linea);
        let posiblesTransbordosDestino = this.transbordos.map(t => t.id_linea == this.destino.id_linea);

        let minRuta: RutaFinal;

        posiblesTransbordosOrigen.forEach(o => {
            posiblesTransbordosDestino.forEach(d => {
                let ruta = this.calcularCosto(o, d);
                if (minPeso > ruta.peso) {
                    minPeso = ruta.peso;
                    minRuta = ruta;
                }
            });
        });
        console.warn('MIN PESO = ' + minPeso);

        return minRuta;
    }

    private calcularCosto(o: Estacion, d: Estacion): RutaFinal {
        let rutaFinal: RutaFinal = {
            peso : 0,
            lineas : new Lista<Tramo>() 
        };

        let costoIr = this.tramo(o, this.origen);
        let costoLlegar = this.tramo(d, this.destino);

        let caminoIr : Tramo = {
            linea: o.id_linea,
            estacion: this.getEstaciones(o.id_linea, this.origen.id_estacion, o.id_estacion ),
            direccion: this.getDirection(o.id_linea, this.origen.id_estacion < o.id_estacion)
        }

        let caminoLlegar : Tramo = {
            linea: d.id_linea,
            estacion: this.getEstaciones(d.id_linea, d.id_estacion, this.destino.id_estacion ),
            direccion: this.getDirection(d.id_linea, d.id_estacion < this.destino.id_estacion)
        }

        console.warn('Nuevo cálculo');
        console.log({
            aORIGEN: o,
            bCostoOrigen: costoIr,
            cOrigenOriginal : this.origen,
            dDESTINO: d,
            eCostoDestino: costoLlegar,
            fDestinoOriginal: this.destino
        });

        let costo = costoLlegar + costoIr + this.costoEspera;

        let origen = o;
        let destino = d;
        let transbordos = [];

        if (origen.id_linea == destino.id_linea) {
            costo += this.tramo(origen, destino);
            let tramo: Tramo = {
                estacion : this.getEstaciones(origen.id_linea, this.origen.id_estacion, this.destino.id_estacion),
                linea : origen.id_linea,
                direccion : this.getDirection(origen.id_linea, this.origen.id_estacion < this.destino.id_estacion)
            };
            rutaFinal.lineas.pushBack(tramo);
        }else{
            while (origen.id_linea != destino.id_linea) {
                console.log({ origen, destino });
                let costoMovimiento = this.pesoRecorrido(origen.id_matriz, d.id_matriz);
                costo += costoMovimiento + this.costoTransbordo;
    
                let sigTransbordo = this.destinoRecorrido(origen.id_matriz, destino.id_matriz);
                // console.log({ costoMovimiento, sigTransbordo });
    
                if (costoMovimiento != 0) {
                    transbordos.push(origen);
                }
    
                /***
                 * En teoría están en la misma línea...
                 */
                if (sigTransbordo == 99) {
                    console.log('ANDO VIENDO  ' + this.pesoRecorrido(origen.id_matriz, destino.id_matriz)); //Si es necesario
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
    
                    if(origen.id_matriz != destino.id_matriz){
                        let tramo : Tramo = {
                            linea: origen.id_linea,
                            estacion : this.getEstaciones(origen.id_linea, origen.id_estacion, destino.id_estacion),
                            direccion: this.getDirection(origen.id_linea, origen.id_estacion < destino.id_estacion)
                        };
                        rutaFinal.lineas.pushBack(tramo);
                    }
    
    
                    // console.log({
                    //     origen,
                    //     destino
                    // });
                    transbordos.push(destino);
                } else {
                    /***
                     * Otro transbordo :v
                     */
                    let nuevoOrigen = this.transbordos.findUnique(t => t.id_matriz
                        == this.destinoRecorrido(origen.id_matriz, destino.id_matriz));
                    
                    let tramo: Tramo = {
                        linea: origen.id_linea,
                        estacion : this.getEstaciones(origen.id_linea, origen.id_estacion, nuevoOrigen.id_estacion),
                        direccion : this.getDirection(origen.id_linea, origen.id_estacion < nuevoOrigen.id_estacion) 
                    };
                    rutaFinal.lineas.pushBack(tramo);
                    
                    origen = nuevoOrigen;
                }
            }
            rutaFinal.lineas.pushFront(caminoIr);
            rutaFinal.lineas.pushBack(caminoLlegar);
        }

        
        // console.table(transbordos);
        console.error('Peso aquí => ' + costo);
        rutaFinal.peso = costo;

        return rutaFinal;
    }

    private tramo(a: Estacion, b: Estacion): number {
        return Math.abs(a.id_estacion - b.id_estacion) * this.costoEstacion;
    }

    private getEstaciones(linea: number, inicio: number, fin: number): Lista<Point> {
        console.log({linea, inicio, fin});
        let lista = new Lista<Point>();

        let direccion = inicio < fin;
        let min = direccion ? inicio : fin;
        let max = direccion ? fin : inicio;
        let estaciones: Lista<Estacion> = this.estaciones.map(e => e.id_linea == linea
            && e.id_estacion >= min && e.id_estacion <= max);

        sort(estaciones, e => e.id_estacion);

        if (!direccion) {
            estaciones = estaciones.reverse();
        }

        estaciones.forEach(e => {
            let interes: Lista<string> = this.getPuntos(e.id_kiosco);

            let point: Point = {
                estacion: e.estacion,
                id: e.id_estacion,
                puntos: interes
            };

            lista.pushBack(point);

        });

        // console.log(lista.toArray());
        return lista;
    }

    private getPuntos(id: number): Lista<string> {
        let lista = new Lista<string>();

        this.puntos.map(p => p.id_kiosco == id).forEach(p => {
            lista.pushFront(p.punto_de_interes);
        });

        // console.log( { 
        //     id,
        //     lista : lista.toArray()
        //  });

        return lista;
    }

    private pesoRecorrido(i: number, j: number): number {
        return this.M.get(i).get(j);
    }

    private destinoRecorrido(i: number, j: number): number {
        return this.T.get(i).get(j);
    }

    private getDirection(id : number, direction : boolean){
        if(direction){
            return this.lineas.findUnique(l => l.id_linea == id).destino;
        }
        return this.lineas.findUnique(l => l.id_linea == id).origen;
    }

}