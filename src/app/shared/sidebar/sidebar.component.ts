import { AfterViewInit, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UiService, UsuarioService } from '@app/services';


interface Ruta {
  nombre: string;
  icono: string;
  path: string;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit,AfterViewInit {
  ngAfterViewInit(): void {
    document.querySelectorAll('.pathItem').forEach((element) => {
      element.addEventListener('click', () => {
        console.log('click');
        this.uiService.closeSidebar();
      });
    });
    
  }
  uiService = inject(UiService);
  usuarioService = inject(UsuarioService)
  router = inject(Router);
  private _rutas = signal<Ruta[]>([]);
  public rutas = computed(() => this._rutas());
  private rutasEmbarques: Ruta[] = [{
    nombre: 'Recorridos',
    icono: 'assets/img/recorridos.svg',
    path: '/logistica/recorridos'
  }, {
    nombre: 'Carga',
    icono: 'assets/img/carga.svg',
    path: '/logistica/carga'
  },
  {
    nombre: 'Paros',
    icono: 'assets/img/paros.svg',
    path: '/logistica/mantenimiento'
  }
  ];

  private rutasChofer = [
    {
      nombre: 'Recorridos',
      icono: 'assets/img/recorridos.svg',
      path: 'chofer/recorridos'
    }
  ];
  
  ngOnInit(): void {    
    if (this.usuarioService.esChofer()) {
      this._rutas.set(this.rutasChofer);
    } else {
      this._rutas.set(this.rutasEmbarques);
    }
  }


  // irRuta() {
  //   this.uiService.closeSidebar();
  // }


}
