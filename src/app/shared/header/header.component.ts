import { Component, inject, OnInit } from '@angular/core';
import { UiService } from '@app/services/ui.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit {
   esDark = false;
   uiService = inject(UiService);

   linksMap: Map<string, HTMLLinkElement> = new Map();

  ngOnInit(): void {
    
    const links = Array.from(document.querySelectorAll('link')) as HTMLLinkElement[]; 
    const _links = links.filter(link => link.getAttribute('rel') === 'stylesheet' && link.getAttribute('href')?.includes('syncfusion') ).map(link => {link.setAttribute('disabled', 'true');return link;});    
    _links.forEach(link => {      
         this.linksMap.set(link.getAttribute('href')?.includes('dark')?"dark":'light', link);         
    });
        
    if(!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches){
      localStorage.setItem('color-theme', 'light');
      this.linksMap.get('light')?.removeAttribute('disabled');  
      console.log('prefers-color-scheme: dark');    
    }

    if (localStorage.getItem('color-theme') === 'dark' ) {
      document.documentElement.classList.add('dark');         
      this.linksMap.get('dark')?.removeAttribute('disabled');         
      this.esDark = true;
    }
    console.log(this.linksMap.get('dark'));
    console.log(this.linksMap.get('light'));

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

