import { Component, OnInit } from '@angular/core';
import { sidebar } from 'src/app/resources/sidebar.options';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public sidebar = sidebar;
  public selected : string = '0-0';

  constructor() { }

  ngOnInit(): void {
    this.selected = localStorage.getItem('index') || '0-0';
    console.log('Selected: ' + this.selected)
  }

  public current(i : number, j : number){
    let index = `${i}-${j}`;
    this.selected = index;
    localStorage.setItem('index',index);
  }

}
