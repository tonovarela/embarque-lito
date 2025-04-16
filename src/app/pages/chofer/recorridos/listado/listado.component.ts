import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Recorrido } from '@app/interface/models';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { ChoferService, RecorridoService, UiService, UsuarioService } from '@app/services';
import { CounterComponent } from '@app/shared/components/counter/counter.component';

import { DialogCapturaKilometrajeComponent } from '../../componentes/dialog-captura-kilometraje/dialog-captura-kilometraje.component';
import { PosicionKilometraje } from '../../interface/PosicionKilometraje';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    SynfusionModule,
    CommonModule,
    PrimeNgModule,
    FormsModule,
    CounterComponent,
    DialogCapturaKilometrajeComponent,
  ],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',

})
export default class ListadoComponent extends BaseGridComponent implements OnInit {
  private _recorridos = signal<Recorrido[]>([]);
  private _isRunning = signal<boolean>(false);  
  public today = new Date();
  //private _estaEnCurso = signal<boolean>(false);
  private choferService = inject(ChoferService);
  private recorridoService = inject(RecorridoService);



  public isRunning = computed(() => this._isRunning());
  //public estaEnCurso = computed(() => this._estaEnCurso());

  public cargando = signal<boolean>(false);
  public recorridoActivoInicio: Recorrido | null = null;
  public recorridoActivoFin: Recorrido | null = null;
  public uiService = inject(UiService);
  public usuarioService = inject(UsuarioService)


  protected minusHeight = 0.27;
  Recorridos = computed(() => this._recorridos());

  public stopCounter(recorrido: Recorrido) {
    this.recorridoActivoFin = recorrido;
  }


  public async startCounter(recorrido: Recorrido) {

    const estaEnCurso = await this.choferService.estaEnCurso(recorrido.id_chofer);
    if (estaEnCurso) {
      this.uiService.mostrarAlertaError("Recorridos", "El chofer ya tiene un recorrido en curso");
      return;
    }
    const recorridoResponse = await firstValueFrom(this.recorridoService.ultimo(`${recorrido.id_transporte}`))
    recorrido.kilometraje_inicial = + (recorridoResponse.recorrido?.kilometraje_final || 0);
    recorrido.id_previo = recorridoResponse.recorrido?.id_recorrido || 0;
    this.recorridoActivoInicio = recorrido;

  }


  constructor() {
    super();
  }


  ngOnInit(): void {
    this.autoFitColumns = true;
    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();
    //const id_usuario = this.usuarioService.StatusSesion().usuario?.id || 0;    
    this.choferService.estaEnCurso(3142).then((resp:any) => {      
    this._isRunning.set(resp.enCurso);    
    });

  }



  public async setRecorrridoInicial(posicionKilometraje: PosicionKilometraje | null) {
    if (!this.recorridoActivoInicio) {
      return;
    }
    if (posicionKilometraje === null) {
      this.recorridoActivoInicio = null;
      return;
    }
    const { kilometraje, gpsPosicion } = posicionKilometraje;
    if (!kilometraje) {
      this.recorridoActivoInicio = null;
      return;
    }      
    this.recorridoActivoInicio.kilometraje_inicial= kilometraje;
    try {
      await firstValueFrom(this.recorridoService.actualizarInicial(this.recorridoActivoInicio,gpsPosicion));      
    } catch (error) {
      this.uiService.mostrarAlertaError("Recorridos", "Error al iniciar el recorrido");
    } finally {
      this.recorridoActivoInicio = null;
      this.cargarInformacion();
    }
      
  }

  public async setRecorrridoFinal(posicionKilometraje: PosicionKilometraje | null) {

    if (!this.recorridoActivoFin) {
      return;
    }
    if (posicionKilometraje === null) {
      this.recorridoActivoFin = null;
      return;
    }
    const { kilometraje, gpsPosicion } = posicionKilometraje;
    if (!kilometraje) {
      this.recorridoActivoFin = null;
      return;
    }

    this.recorridoActivoFin.kilometraje_final = kilometraje;
    try {
      await firstValueFrom(this.recorridoService.actualizarInicial(this.recorridoActivoFin,gpsPosicion));      
    } catch (error) {
      this.uiService.mostrarAlertaError("Recorridos", "Error al finalizar el recorrido el recorrido");
    } finally {
      this.recorridoActivoInicio = null;
      this.cargarInformacion();      
    }
    this._isRunning.set(false);



  }

  cargarInformacion() {
    this.cargando.set(true);
    this.recorridoService.porChofer("3142", true).subscribe(({ recorridos }) => {
      this._recorridos.set(recorridos);
      this.cargando.set(false);
    });
  }


 



}

