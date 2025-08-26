import { AfterViewInit, Component, computed, effect, EffectRef, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UiService } from './services/ui.service';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ChoferService } from './services/chofer.service';
import { TransporteService } from './services/transporte.service';
import { UsuarioService } from './services/usuario.service';
import { environment } from '@environments/environment.development';
import { MantenimientoService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private _usuarioService = inject(UsuarioService);
  public transporteService = inject(TransporteService);
  public choferService = inject(ChoferService);
  public router = inject(Router);
  public mantenimientoService= inject(MantenimientoService);
  public uiService = inject(UiService);
  public estatusLogin = computed(() => this._usuarioService.StatusSesion().estatus);
  
  effectLogin: EffectRef;

  constructor() {
    this.effectLogin = effect(() => {
      if (this.estatusLogin() === 'LOGIN') {
        if (this._usuarioService.esChofer()){
           this.router.navigate(['/chofer']);
        }else {          
          this.router.navigate(['/logistica/retornos']);
        }        
        setTimeout(() => {
          this.uiService.cargarSidebar();
          initFlowbite();
          this.cargarCatalogos();
        }, 1000);
      }      
      if (this.estatusLogin() === 'LOGOUT') {
        const esProduccion = environment.production;
        if (esProduccion) {
          window.location.href = "/litoapps";
          localStorage.removeItem("User");
          localStorage.removeItem("Pass");
          return;
        }
      };
    });
  }
  ngOnDestroy(): void {
    this.effectLogin.destroy();
  }
  
  ngOnInit(): void {
    this._usuarioService.verificarSesionLitoapps();

  }
  async cargarCatalogos() {
    await this.choferService.cargar();
    await this.transporteService.cargar();
    await this.mantenimientoService.cargarMotivos();
  }
}
