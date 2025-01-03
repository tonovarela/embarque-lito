import { CommonModule } from '@angular/common';
import {  Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-fabbutton',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './fabbutton.component.html',
  styleUrl: './fabbutton.component.css',
  
})
export class FabbuttonComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  }
   
