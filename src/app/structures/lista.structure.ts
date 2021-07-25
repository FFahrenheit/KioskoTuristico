interface For<T>{
    (item : T) : void
}

interface Map<T>{
    (item : T) : boolean
}
class Nodo<T>{
    public data : T = null;
    public next : Nodo<T> = null;

    constructor(data : T, next: Nodo<T> = null){
        this.data = data;
        this.next = next;
    }
}

export class Lista<T>{
    private listFront : Nodo<T>;
    private listBack : Nodo<T>;
    private listSize : number;

    constructor(){
        this.listSize = 0;
        this.listFront = null;
        this.listBack= null;
    }

    public empty() : boolean{
        return this.listSize == 0;
    }

    public size() : number{
        return this.listSize;
    }

    public pushFront(obj : T) : void{
        if(this.empty()){
            this.listFront = new Nodo(obj);
            this.listBack = this.listFront;
        }else{
            const temp = new Nodo<T>(obj,this.listFront);
            this.listFront = temp;
        }

        this.listSize ++;
    }

    public pushBack(obj :T ) : void{
        if(this.empty()){
            this.listFront = new Nodo<T>(obj);
            this.listBack = this.listFront;
        }else{
            const temp = new Nodo<T>(obj);
            this.listBack.next = temp;
            this.listBack = temp;
        }

        this.listSize ++;
    }

    public front() : T{
        if(this.empty()){
            throw 'Lista vacía';
        }

        return this.listFront.data;
    }

    public back() : T{
        if(this.empty()){
            throw 'Lista vacía';
        }

        return this.listBack.data;
    }

    public popFront() : void{
        if(this.empty()){
            throw 'Lista vacía';
        }
        if(this.size() == 1){
            this.listBack = null;
            this.listFront = null;
        }else{
            this.listFront = this.listFront.next;
        }

        this.listSize--;
    }

    public popBack() : void{
        if(this.empty()){
            throw 'Lista vacía';
        }
        if(this.size() == 1){
            this.listFront = null;
            this.listBack = null;
        }else{
            let temp : Nodo<T> = this.listFront;
            while(temp.next != this.listBack){
                temp = temp.next;
            }
            temp.next = null;
            this.listBack = temp;
        }
        this.listSize --;
    }

    public insert(position : number, obj : T) : void{
        if(this.empty()){
            throw 'Lista vacía';
        }else if(position > this.size()){
            throw 'Posición inválida';
        }else if(position == 0){
            this.pushFront(obj);
        }else if(position == this.size()){
            this.pushBack(obj);
        }else{
            let temp : Nodo<T> = this.listFront;
            for(let i = 0; i < position- 1; i++){
                temp = temp.next;
            }
            let newNodo = new Nodo<T>(obj,temp.next);
            temp.next = newNodo;
            this.listSize++;
        }
    }

    public erase(position : number) : void{
        if(this.empty()){
            throw 'Lista vacía';
        }else if(position >= this.size()){
            throw 'Posición inválida';
        }else if(position == 0){
            this.popFront();
        }else if(position == this.size() - 1){
            this.popBack();
        }else{
            let temp : Nodo<T> = this.listFront;
            for(let i=0; i<position-1; i++){
                temp = temp.next;
            }
            temp.next = temp.next.next;
            this.listSize--;
        }
    }

    public clear() : void{
        while(!this.empty()){
            this.popFront();
        }
    }

    public remove(obj : T) : void{
        if(this.empty()){
            throw 'Lista vacía';
        }else{
            let data : T;
            let i = 0;
            let temp : Nodo<T> = this.listFront;

            while(temp != null){
                data = temp.data;
                temp = temp.next;
                if(obj == data){
                    this.erase(i);
                    i--;
                }
                i++;
            }
        }
    }

    public get(position : number ) : T{
        if(this.empty()){
            throw 'Lista vacía';
        }else if(position >= this.size()){
            throw 'Posición inválida';
        }

        let temp : Nodo<T> = this.listFront;
        for(let i=0; i< position; i++){
            temp = temp.next;
        }
        return temp.data;
    }

    public set(position : number, obj : T) : void{
        if(this.empty()){
            throw 'Lista vacía';
        }else if(position >= this.size()){
            throw 'Posición inválida';
        }

        let temp : Nodo<T> = this.listFront;
        for(let i=0; i< position; i++){
            temp = temp.next;
        }
        temp.data = obj;
    }

    public swapAt(i : number, j : number){
        if(this.empty()){
            throw 'Lista vacía';
        }else if(i >= this.size() || j >= this.size()){
            throw 'Posiciones inválidas';
        }
        let a  = this.get(i);
        let b = this.get(j);
        this.set(i,b);
        this.set(j,a);
    }

    public toArray() : T[]{
        let list :T[] = [];
        for(let i=0; i<this.size(); i++){
            list.push(this.get(i));
        }
        return list;
    }

    public map(comparator : Map<T>) : Lista<T> {
        let list = new Lista<T>();
        for(let i=0; i<this.size(); i++){
            if(comparator(this.get(i))){
                list.pushBack(this.get(i));
            }
        }
        return list;
    }

    public forEach(callback : For<T>) : void {
        for(let i = 0; i < this.size(); i++){
            callback(this.get(i));
        }
    }

}