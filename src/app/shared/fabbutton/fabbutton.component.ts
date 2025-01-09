import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-fabbutton',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink    
  ],
  templateUrl: './fabbutton.component.html',
  styleUrl: './fabbutton.component.css',

})
export class FabbuttonComponent implements OnInit {
   
  menuOpen = false;
  ngOnInit(): void {  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}

