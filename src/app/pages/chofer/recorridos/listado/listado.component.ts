import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Recorrido } from '@app/interface/models';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { ChoferService, GpsService, RecorridoService, UiService, UsuarioService } from '@app/services';


import { DialogCapturaKilometrajeComponent } from '../../componentes/dialog-captura-kilometraje/dialog-captura-kilometraje.component';
import { PosicionKilometraje } from '../../interface/PosicionKilometraje';
import { firstValueFrom } from 'rxjs';

import { CounterComponent } from '@app/pages/chofer/componentes/counter/counter.component';
import { environment } from '@environments/environment.development';
import { RecorridoActualComponent } from '../../componentes/recorrido-actual/recorrido-actual.component';



@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    SynfusionModule,
    CommonModule,
    PrimeNgModule,
    FormsModule,
    CounterComponent,
    RecorridoActualComponent,
    DialogCapturaKilometrajeComponent,
  ],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',

})
export default class ListadoComponent extends BaseGridComponent implements OnInit {
  private _recorridos = signal<Recorrido[]>([]);
  
  public today = new Date();

  public recorridoActivoInicio: Recorrido | null = null;
  public recorridoActivoFin: Recorrido | null = null;
  public recorridoEnCurso = signal<Recorrido | null>(null);
  public cargando = signal<boolean>(false);


  public uiService = inject(UiService);
  public usuarioService = inject(UsuarioService)

  private choferService = inject(ChoferService);
  private recorridoService = inject(RecorridoService);



  protected minusHeight = 0.27;
  public Recorridos = computed(() => this._recorridos());
  public isRunning = computed(() => this.recorridoEnCurso() !== null);


  public stopCounter(recorrido: Recorrido) {          
    this.recorridoActivoFin = recorrido;
  }

  constructor() {
    super();
  }



  ngOnInit(): void {
    this.autoFitColumns = true;
    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();

    
    
   
  }


  public async startCounter(recorrido: Recorrido) {

    const id_chofer = recorrido.id_chofer;
    const respEnCurso = await this.choferService.estaEnCurso(`${id_chofer}`);
    if (respEnCurso.enCurso) {
      this.recorridoEnCurso.set(respEnCurso.recorrido);
      this.uiService.mostrarAlertaError("Recorridos", "El chofer ya tiene un recorrido en curso");
      return;
    }
    const recorridoResponse = await firstValueFrom(this.recorridoService.ultimo(`${recorrido.id_transporte}`))
    recorrido.kilometraje_inicial = + (recorridoResponse.recorrido?.kilometraje_final || 0);
    recorrido.id_previo = recorridoResponse.recorrido?.id_recorrido || 0;
    this.recorridoActivoInicio = recorrido;
    
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
    this.recorridoActivoInicio.kilometraje_inicial = kilometraje;
    try {
      await firstValueFrom(this.recorridoService.actualizarInicial(this.recorridoActivoInicio, gpsPosicion));
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
      await firstValueFrom(this.recorridoService.actualizarFinal(this.recorridoActivoFin, gpsPosicion));
    } catch (error) {
      this.uiService.mostrarAlertaError("Recorridos", "Error al finalizar el recorrido el recorrido");
    } finally {
      this.recorridoActivoFin = null;
      this.cargarInformacion();
    }

  }

  cargarInformacion() {

    this.cargando.set(true);
    const personal = this.usuarioService.StatusSesion().usuario?.personal || 0;    
    this.recorridoService.porChofer(`${personal}`, true).subscribe(({ recorridos }) => {
      this._recorridos.set(recorridos);
      this.cargando.set(false);
    });        
    this.choferService
      .estaEnCurso(`${personal}`)
      .then((resp) => this.recorridoEnCurso.set(resp.recorrido));
  }






}

