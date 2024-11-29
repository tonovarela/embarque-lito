import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit {
   esDark = false;
  ngOnInit(): void {

    if(!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches){
      localStorage.setItem('color-theme', 'light');
    }

    if (localStorage.getItem('color-theme') === 'dark' ) {
      document.documentElement.classList.add('dark');            
      this.esDark = true;
    }

  }
  cambiarTema() {    
    if (localStorage.getItem('color-theme') === 'dark' ) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      this.esDark = false;
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      this.esDark = true;
    }
  }
}

