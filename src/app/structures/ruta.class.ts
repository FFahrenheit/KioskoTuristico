import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Linea } from "../models/line.interface";
import { PuntoInteres } from "../models/place.interface";
import { Point, RutaFinal, Tramo } from "../models/route.interface";
import { Estacion } from "../models/station.interface";
import { Lista } from "./lista.structure";
import { sort } from "./quicksort.algorithm";

export class Ruta {

    private origen: Estacion;
    private destino: Estacion;

    public o: Estacion;
    public d: Estacion;
    public min: number;

    private costoTransbordo = 3;
    private costoEspera = 2;
    private costoEstacion = 1;

    private currentTramo: Tramo;
    private rutaFinal: RutaFinal;
    private matrices: Lista<number>;

    constructor(private estaciones: Lista<Estacion>,
        private puntos: Lista<PuntoInteres>,
        private lineas: Lista<Linea>,
        private transbordos: Lista<Estacion>,
        private M: Lista<Lista<number>>,
        private T: Lista<Lista<number>>) { }

    public setRuta(origen: Estacion, destino: Estacion): RutaFinal | number {
        this.origen = origen;
        this.destino = destino;
        return this.calculateRoute();
    }

    private calculateRoute(): RutaFinal | number {

        let minPeso = 999;
        let minIr = 100;
        let minLlegar = 100;

        let posiblesTransbordosOrigen = this.transbordos.map(t => t.id_linea == this.origen.id_linea);
        let posiblesTransbordosDestino = this.transbordos.map(t => t.id_linea == this.destino.id_linea);

        posiblesTransbordosOrigen.forEach(o => {
            posiblesTransbordosDestino.forEach(d => {
                let peso = this.ruta(o, d);
                if (peso[0] <= minPeso) {
                    if ((peso[1] <= minIr && peso[2] <= minLlegar) || minLlegar == 0) {
                        minPeso = peso[0];
                        this.o = o;
                        this.min = minPeso;
                        this.d = d;
                        minIr = peso[1];
                        minLlegar = peso[2];
                    }
                }
            });
        });
        console.warn('MIN PESO => ' + minPeso);

        return minPeso;
    }

    private ruta(o: Estacion, d: Estacion): number[] {
        console.warn('Nuevo cálculo');
        let costoIr = this.tramo(this.origen, o);
        let costoLlegar = this.tramo(d, this.destino);
        console.log({
            de: o.estacion,
            hacia: d.estacion
        });

        let costoMatriz = this.pesoRecorrido(o.id_matriz, d.id_matriz);
        if (costoMatriz == 0) {
            if(this.origen.id_linea == this.destino.id_linea){
                costoIr = this.tramo(this.origen, this.destino);
                costoLlegar = 0;
            }
        }

        let pesoTotal = costoIr + costoLlegar + costoMatriz;
        console.error({
            ir: costoIr,
            llegar: costoLlegar,
            matriz: costoMatriz,
            total: pesoTotal
        });
        return [pesoTotal, costoIr, costoLlegar, costoMatriz];
    }

    private tramo(a: Estacion, b: Estacion): number {
        let min = Math.min(a.id_estacion, b.id_estacion);
        let max = Math.max(a.id_estacion, b.id_estacion);
        return this.estaciones.map(e => e.id_linea == a.id_linea
            && e.estatus == 0
            && e.id_estacion > min && e.id_estacion <= max).size() * this.costoEstacion;
    }

    private getEstaciones(linea: number, inicio: number, fin: number): Lista<Point> {
        console.log({ linea, inicio, fin });
        let lista = new Lista<Point>();

        let direccion = inicio < fin;
        let min = direccion ? inicio : fin;
        let max = direccion ? fin : inicio;
        let estaciones: Lista<Estacion> = this.estaciones.map(e => e.id_linea == linea
            && e.id_estacion >= min && e.id_estacion <= max && e.estatus == 0);

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

        return lista;
    }

    private getPuntos(id: number): Lista<string> {
        let lista = new Lista<string>();

        this.puntos.map(p => p.id_kiosco == id).forEach(p => {
            lista.pushFront(p.punto_de_interes);
        });

        return lista;
    }

    private pesoRecorrido(i: number, j: number): number {
        return this.M.get(i).get(j);
    }

    private destinoRecorrido(i: number, j: number): number {
        return this.T.get(i).get(j);
    }

    private getDirection(id: number, direction: boolean) {
        if (direction) {
            return this.lineas.findUnique(l => l.id_linea == id).destino;
        }
        return this.lineas.findUnique(l => l.id_linea == id).origen;
    }

    public getRecorrido() {
        console.warn({
            de: this.o.id_matriz + ' ->' + this.o.estacion,
            hacia: this.d.id_matriz + ' -> ' + this.d.estacion
        });

        this.rutaFinal = {
            costo: 0,
            peso: this.min,
            lineas: new Lista<Tramo>()
        };
        this.matrices = new Lista<number>();
        this.matrices.pushBack(this.o.id_matriz);
        console.error('Calculando transbordos ... ');
        this.obtenerTransbordo(this.o, this.d);
        if (this.matrices.back() != this.d.id_matriz) {
            this.matrices.pushBack(this.d.id_matriz);
        }
        console.warn(this.matrices.toArray());

        let origen = this.origen;
        let destino = this.origen;

        this.matrices.iterate((m, i) => {
            //Obtener posibles destinos que concuerden con la matriz
            let destinos = this.estaciones.map(e => e.id_matriz == m);

            if (destinos.map(d => d.id_linea == destino.id_linea).size() > 0) {
                //Si puede seguir en la misma línea...
                console.log('Sigue en la línea ' + origen.id_linea);
                //Actualizamos el destino
                destino = destinos.findUnique(d => d.id_linea == destino.id_linea);
                //Si es el último transbordo cerramos el tramo
            } else {
                //Se acabó el tramo
                //Tenemos que cerrar el tramo y buscar nuevo origen y destino
                console.log('Ya es un transbordo hacia otra linea');
                //Cerramos el tramo
                console.log({
                    origen: origen.estacion,
                    destino: destino.estacion
                });

                this.rutaFinal.lineas.pushBack(
                    this.makeTramo(origen, destino)
                );


                console.log('Sacando nuevo transbordo!');

                console.log({
                    de: destino.id_matriz,
                    hacia: m
                });

                let nuevosOrigenes = this.estaciones.map(e => e.id_matriz == destino.id_matriz);
                let nuevosDestinos = this.estaciones.map(e => e.id_matriz == m);

                console.log(nuevosOrigenes.toArray());
                console.log(nuevosDestinos.toArray());

                nuevosOrigenes.forEach(orig => {
                    nuevosDestinos.forEach(dest => {
                        if (orig.id_linea == dest.id_linea) {
                            console.log({
                                orig,
                                dest
                            });
                            origen = orig;
                            destino = dest;
                        }
                    });
                });
                console.log({
                    origen: origen.estacion,
                    destino: destino.estacion
                });
            }

            if (i == this.matrices.size() - 1) {
                console.error('Last item');
                console.log({
                    origen: origen,
                    destino: destino,
                    final: this.destino
                });

                this.rutaFinal.lineas.pushBack(
                    this.makeTramo(origen, destino)
                );

                console.log(this.rutaFinal.lineas.back().estacion.toArray());
            }

        });

        if (this.rutaFinal.lineas.back().linea == this.destino.id_linea) {
            // Si hay que completar el mismo tramo ... 
            console.log({
                linea: this.rutaFinal.lineas.back().linea,
                origen: this.estaciones.findUnique(e => e.id_kiosco == this.rutaFinal.lineas.back().estacion.front().id),
                estaciones: this.rutaFinal.lineas.back().estacion.toArray()
            });

            let nuevoTramo = this.makeTramo(
                this.estaciones.findUnique(
                    e => e.id_estacion == this.rutaFinal.lineas.back().estacion.front().id
                    && e.id_linea == this.destino.id_linea),
                this.destino
            );

            this.rutaFinal.lineas.popBack();
            
            this.rutaFinal.lineas.pushBack(nuevoTramo);
        } else {
            // Si hay que hacer el ultimo tramo
            this.rutaFinal.lineas.pushBack(
                this.makeTramo(
                    this.estaciones.findUnique(e => e.id_matriz == this.matrices.back() && e.id_linea == this.destino.id_linea),
                    this.destino
                )
            );
        }
        console.log(this.rutaFinal.lineas.toArray());

        this.rutaFinal.costo = this.rutaFinal.peso;
        this.rutaFinal.peso = this.rutaFinal.peso + this.costoEspera
         + (this.rutaFinal.lineas.size() - 1) * this.costoTransbordo;
        return this.rutaFinal;
    }

    private obtenerTransbordo(o: Estacion, d: Estacion) {
        let sigId = this.destinoRecorrido(o.id_matriz, d.id_matriz);
        console.log({
            de: o.id_matriz,
            hacia: d.id_matriz,
            sigId
        });
        if (sigId != 99) {
            let siguienteOrigen = this.estaciones.findUnique(e => e.id_matriz == sigId);
            this.matrices.pushBack(siguienteOrigen.id_matriz);
            this.obtenerTransbordo(siguienteOrigen, d);
        }
    }

    private makeTramo(origen: Estacion, destino: Estacion): Tramo {
        const tramo: Tramo = {
            linea: origen.id_linea,
            estacion: this.getEstaciones(origen.id_linea, origen.id_estacion, destino.id_estacion),
            direccion: this.getDirection(origen.id_linea, origen.id_estacion < destino.id_estacion)
        };
        return tramo;
    }

}