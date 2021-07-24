import { Lista } from "./lista.structure";

interface Property<T>{
    (item : T) : number | string | Date
}

let property : Property<any> = null;

export function sort<T>(lista : Lista <T>, compare : Property<T>) : void{
    property = compare;
    quickSort(lista,0,lista.size()-1);
}

function quickSort<T>(lista : Lista<T>, l : number, r : number){
    if(l < r){
        let s = partition(lista, l, r);
        quickSort(lista, l, s-1);
        quickSort(lista, s+1, r);
    }
}

function partition<T>(lista : Lista<T>, l : number, r : number){
    let p : T = lista.get(l);
    let i = l;
    let j = r;
    do{
        while(i<j && property(lista.get(i)) <= property(p)){
            i++;
        }
        while(property(lista.get(j)) > property(p)){
            j--;
        }
        lista.swapAt(i,j);
    }while(i<j);
    lista.swapAt(i,j);
    lista.swapAt(l,j);
    return j;
}