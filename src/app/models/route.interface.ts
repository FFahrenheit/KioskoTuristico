import { Lista } from "../structures/lista.structure";

export interface RutaFinal{
    peso : number,
    lineas : Lista<Tramo>
}

export interface Tramo{
    linea : number,
    direccion : string,
    estacion : Lista<Point>
}

export interface Point{
    estacion : string,
    id : number,
    puntos : Lista<string>
} 