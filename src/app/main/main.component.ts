import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Parada } from '../models/stop.interface';
import { RoutesService } from '../services/routes.service';
import { Lista } from '../structures/lista.structure';
import { sort } from '../structures/quicksort.algorithm';
import { RouteCalculatorService } from '../structures/route-calculator.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public form : FormGroup;
  public submitted = false;
  public loading : boolean = true;
  public origin : Parada;
  public destination : Parada;
  public originName : string;
  public destinationName : string;

  private paradas = new Lista<Parada>();

  constructor(private fb : FormBuilder,
              private stopsService : RoutesService,
              private toastr : ToastrService,
              private route : RouteCalculatorService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      origen: [null, Validators.required],
      destino: [null, Validators.required]
    });
    this.loadStops();
  }

  public loadStops() : void{
    this.stopsService.loadStops()
        .subscribe(resp=>{
          if(resp){
            this.makeList(this.stopsService.getStops());
            this.get('origen').setValue(null);
            this.get('destino').setValue(null);
          }else{
            this.toastr.error(this.stopsService.getError(),'Error');
          }
        },error=>{
          this.toastr.error(this.stopsService.getError(),'Error');
        });
  }

  public get(ctrl : string) : AbstractControl{
    return this.form.controls[ctrl];
  }

  public get stops() : Parada[]{
    return this.paradas.toArray();
  }

  public makeList(paradas : any[]) : void{
    this.paradas.clear();
    paradas.forEach(p=>{
      const parada : Parada ={
        nombre: p['nombre'],
        tipo: p['tipo']
      };
      this.paradas.pushBack(parada);
    });
    sort(this.paradas, (p) => p.nombre);
  }

  public getClass(ctrl : string) : string{
    if(this.get(ctrl).untouched){
      return ''
    };
    return this.get(ctrl).valid ? 'is-valid' : 'is-invalid';
  }

  public submit(){
    this.form.markAllAsTouched();
    if(this.form.valid){
      this.submitted = true;
      this.loading = true;
      // console.log(this.get('origen').value);
      this.originName = this.destination.nombre;
      this.destinationName = this.origin.nombre;
      this.route.loadRoute(this.origin as Parada, this.destination as Parada)
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
}
