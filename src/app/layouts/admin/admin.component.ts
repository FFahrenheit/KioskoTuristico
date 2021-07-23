import { Component, OnInit } from '@angular/core';
import { sidebar } from 'src/app/resources/sidebar.options';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public sidebar = sidebar;
  public selected : number = 0;

  constructor() { }

  ngOnInit(): void {
    this.selected = Number(localStorage.getItem('index')) || 0;
    console.log('Selected: ' + this.selected)
  }

  public current(index : number){
    console.log(index);
    this.selected = index;
    localStorage.setItem('index',index.toString());
  }

}
