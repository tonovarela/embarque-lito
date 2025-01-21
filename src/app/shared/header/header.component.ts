import { Component, computed, inject, OnInit } from '@angular/core';
import { UiService } from '@app/services/ui.service';
import { UsuarioService } from '@app/services/usuario.service';
import { environment } from '@environments/environment.development';


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
   usuarioService = inject(UsuarioService);
   linksThemeMap: Map<string, HTMLLinkElement> = new Map();


   Usuario = computed(() => this.usuarioService.StatusSesion().usuario);
   Foto = computed(() => `${!environment.production?'https://servicios.litoprocess.com':''}/colaboradores/api/foto/${this.usuarioService.StatusSesion().usuario?.personal??'XX'}`);

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

   cerrarSesion(){
    this.usuarioService.logout()
   }

  private  setTema(props:{esDark:boolean}) {
    if (props.esDark) {
      document.documentElement.classList.add('dark');
      this.linksThemeMap.get('dark')?.removeAttribute('disabled');
      this.linksThemeMap.get('light')?.setAttribute('disabled', 'true');      
      localStorage.setItem('color-theme', 'dark');
      this.esDark = true;
    } else {
      document.documentElement.classList.remove('dark');      
      localStorage.setItem('color-theme', 'light');
      this.linksThemeMap.get('light')?.removeAttribute('disabled');
      this.linksThemeMap.get('dark')?.setAttribute('disabled', 'true');      
      this.esDark = false;
     
    }

  }
}

