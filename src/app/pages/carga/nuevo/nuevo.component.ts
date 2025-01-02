import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css'
})
export class NuevoComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('NuevoComponent carga');
  }

}
