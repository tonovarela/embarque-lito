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
   linksThemeMap: Map<string, HTMLLinkElement> = new Map();

  ngOnInit(): void {    
    const links = Array.from(document.querySelectorAll('link')) as HTMLLinkElement[]; 
    const _links = links.filter(link => link.getAttribute('rel') === 'stylesheet' && link.getAttribute('href')?.includes('syncfusion') )
                          .map(link => {link.setAttribute('disabled', 'true');return link;});        
    _links.forEach(link =>this.linksThemeMap.set(link.getAttribute('href')?.includes('dark')?"dark":'light', link));      
    if(('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches){      
      const  esDark= localStorage.getItem('color-theme') === 'dark';
      this.setTema({esDark});          
    }else{
      this.setTema({esDark:false});
     }
    
  }

  cambiarTema() {            
      this.setTema({esDark:localStorage.getItem('color-theme') !== 'dark'});    
   }

  private  setTema(props:{esDark:boolean}) {
    if (props.esDark) {
      document.documentElement.classList.add('dark');
      this.linksThemeMap.get('light')?.setAttribute('disabled', 'true');
      this.linksThemeMap.get('dark')?.removeAttribute('disabled');
      localStorage.setItem('color-theme', 'dark');
      this.esDark = true;
    } else {
      document.documentElement.classList.remove('dark');      
      localStorage.setItem('color-theme', 'light');
      this.linksThemeMap.get('dark')?.setAttribute('disabled', 'true');
      this.linksThemeMap.get('light')?.removeAttribute('disabled');
      this.esDark = false;
     
    }

  }
}

