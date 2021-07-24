import { Component, OnInit } from '@angular/core';
import { StationsService } from 'src/app/services/stations.service';

@Component({
  selector: 'app-enable-stations',
  templateUrl: './enable-stations.component.html',
  styleUrls: ['./enable-stations.component.scss']
})
export class EnableStationsComponent implements OnInit {

  constructor(private estacionesService: StationsService) { }

  ngOnInit(): void {
    this.estacionesService.loadEstaciones().subscribe(resp => {
      if(resp){
        
      }
    }, error => {
      console.log(error);
    });
  }

}
