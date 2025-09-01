import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EffectRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private _usuarioService = inject(UsuarioService);
  public transporteService = inject(TransporteService);
  public choferService = inject(ChoferService);
  public router = inject(Router);
  public mantenimientoService = inject(MantenimientoService);
  public uiService = inject(UiService);
  public estatusLogin = computed(
    () => this._usuarioService.StatusSesion().estatus
  );

  effectLogin: EffectRef;
  private readonly INIT_DELAY = 1000;


  constructor() {
    this.effectLogin = effect(() => {
      const estatus = this.estatusLogin();      
      switch (estatus) {
        case 'LOGIN':
          this.handleLoginSuccess();
          break;
        case 'LOGOUT':
          this.handleLogout();
          break;
      }
    });
  }

  
  ngOnDestroy(): void {
    this.effectLogin.destroy();
  }

  ngOnInit(): void {
    this._usuarioService.verificarSesionLitoapps();
  }

  /**
   * Maneja el proceso de login exitoso
   */
  private handleLoginSuccess(): void {
    this.navigateBasedOnUserRole();
    this.initializeApp();
  }

  /**
   * Navega según el rol del usuario
   */
  private navigateBasedOnUserRole(): void {
    if (this._usuarioService.esChofer()) {
      this.router.navigate(['/chofer']);
      return;
    }

    // Usuario de logística
    const targetRoute = this._usuarioService.soloRetornos() 
      ? ['/logistica/retornos'] 
      : ['/logistica'];
    
    this.router.navigate(targetRoute);
  }

  /**
   * Inicializa la aplicación después del login
   */
  private initializeApp(): void {
    setTimeout(async () => {
      try {
        this.uiService.cargarSidebar();
        initFlowbite();
        await this.cargarCatalogos();
      } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
      }
    }, this.INIT_DELAY);
  }

  /**
   * Maneja el proceso de logout
   */
  private handleLogout(): void {
    if (environment.production) {
      this.logoutProduction();
    } else {
      console.log('Logout en desarrollo');
    }
  }

  /**
   * Maneja logout en producción
   */
  private logoutProduction(): void {
    try {
      localStorage.removeItem('User');
      localStorage.removeItem('Pass');
      window.location.href = '/litoapps';
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  }
    
  private async cargarCatalogos() {
     try {
      await Promise.all([
        this.choferService.cargar(),
        this.transporteService.cargar(),
        this.mantenimientoService.cargarMotivos()
      ]);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  }
}
