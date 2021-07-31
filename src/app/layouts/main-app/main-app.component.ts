import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss']
})
export class MainAppComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  inicio(){
    this.router.navigate(['inicio']);
  }

}
