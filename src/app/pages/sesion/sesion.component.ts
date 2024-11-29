import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sesion',
  standalone: true,
  imports: [],
  templateUrl: './sesion.component.html',
  styleUrl: './sesion.component.css'
})
export class SesionComponent implements OnInit {
  ngOnInit(): void {
    console.log('SesionComponent initialized');
  }
}
