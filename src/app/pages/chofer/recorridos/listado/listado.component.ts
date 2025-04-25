import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Recorrido } from '@app/interface/models';

import { PrimeNgModule } from '@app/lib/primeng.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { ChoferService, RecorridoService, UiService, UsuarioService } from '@app/services';
import { CounterComponent } from '@app/pages/chofer/componentes/counter/counter.component';
import { RecorridoActualComponent } from '../../componentes/recorrido-actual/recorrido-actual.component';
import { DialogCapturaKilometrajeComponent } from '../../componentes/dialog-captura-kilometraje/dialog-captura-kilometraje.component';
import { firstValueFrom } from 'rxjs';

import { RecorridoEnCurso } from '../../interface/RecorridoEnCurso';
import { PosicionKilometraje } from '../../interface/PosicionKilometraje';
import { FirmaPadComponent } from '../../componentes/firma-pad/firma-pad.component';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    SynfusionModule,
    CommonModule,
    PrimeNgModule,
    FormsModule,
    FirmaPadComponent,
    CounterComponent,
    RecorridoActualComponent,
    DialogCapturaKilometrajeComponent,
  ],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
})
export default class ListadoComponent extends BaseGridComponent implements OnInit {
  // Signals for state management
  private _recorridos = signal<Recorrido[]>([]);
  public cargando = signal<boolean>(false);
  public recorridoEnCurso = signal<RecorridoEnCurso | null>(null);
  public recorridoPorFirmar = signal<Recorrido | null>(null);
  public guardandoFirma = signal<boolean>(false);

  // Public properties
  public today = new Date();
  public recorridoActivoInicio: Recorrido | null = null;
  public recorridoActivoFin: Recorrido | null = null;
  protected minusHeight = 0.27;

  // Computed properties
  public Recorridos = computed(() => this._recorridos());
  public isRunning = computed(() => !!this.recorridoEnCurso()?.recorrido);

  // Injected services
  private uiService = inject(UiService);
  private usuarioService = inject(UsuarioService);
  private choferService = inject(ChoferService);
  private recorridoService = inject(RecorridoService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.autoFitColumns = true;
    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();
  }

  /**
   * Starts the counter for a given recorrido.
   * @param recorrido The recorrido to start the counter for.
   */
  public async startCounter(recorrido: Recorrido): Promise<void> {
    const id_chofer = recorrido.id_chofer;

    try {
      const respEnCurso = await this.choferService.estaEnCurso(`${id_chofer}`);

      if (respEnCurso.enCurso) {
        this.recorridoEnCurso.set({ recorrido: respEnCurso.recorrido, ubicacion: respEnCurso.ubicacion });
        this.uiService.mostrarAlertaError("Recorridos", "El chofer ya tiene un recorrido en curso");
        return;
      }

      const recorridoResponse = await firstValueFrom(this.recorridoService.ultimo(`${recorrido.id_transporte}`));
      recorrido.kilometraje_inicial = +(recorridoResponse.recorrido?.kilometraje_final || 0);
      recorrido.id_previo = recorridoResponse.recorrido?.id_recorrido || 0;
      this.recorridoActivoInicio = recorrido;

    } catch (error: any) {
      this.uiService.mostrarAlertaError("Recorridos", error?.message || "Error al iniciar el recorrido");
    }
  }

  public stopCounter(): void {
    if (this.recorridoEnCurso()) {
      this.recorridoActivoFin = this.recorridoEnCurso()!.recorrido;
    }
  }

  public async setRecorrridoInicial(posicionKilometraje: PosicionKilometraje | null): Promise<void> {
    await this.actualizarRecorrido(posicionKilometraje, true);
  }

  public async setRecorrridoFinal(posicionKilometraje: PosicionKilometraje | null): Promise<void> {
    await this.actualizarRecorrido(posicionKilometraje, false);
  }

  /**
   * Updates recorrido with initial or final data.
   * @param posicionKilometraje The kilomentraje position data.
   * @param isInitial Flag to determine if it's initial or final data.
   */
  private async actualizarRecorrido(posicionKilometraje: PosicionKilometraje | null, isInitial: boolean): Promise<void> {
    const recorrido = isInitial ? this.recorridoActivoInicio : this.recorridoActivoFin;

    if (!recorrido) {
      return;
    }

    if (!posicionKilometraje) {
      if (isInitial) {
        this.recorridoActivoInicio = null;
      } else {
        this.recorridoActivoFin = null;
      }
      return;
    }

    const { kilometraje, gpsPosicion } = posicionKilometraje;

    if (!kilometraje) {
      if (isInitial) {
        this.recorridoActivoInicio = null;
      } else {
        this.recorridoActivoFin = null;
      }
      return;
    }

    if (isInitial) {
      recorrido.kilometraje_inicial = kilometraje;
    } else {
      recorrido.kilometraje_final = kilometraje;
    }

    try {
      const updateFn = isInitial ? this.recorridoService.actualizarInicial(recorrido, gpsPosicion) : this.recorridoService.actualizarFinal(recorrido, gpsPosicion);
      await firstValueFrom(updateFn);

      this.uiService.mostrarAlertaSuccess("Recorridos", `Kilometraje ${isInitial ? 'inicial' : 'final'} actualizado correctamente.`);
    } catch (error: any) {
      this.uiService.mostrarAlertaError("Recorridos", error?.message || `Error al actualizar recorrido ${isInitial ? 'inicial' : 'final'}`);
    } finally {
      this.recorridoActivoInicio = null;
      this.recorridoActivoFin = null;
      this.cargarInformacion();
    }
  }

  /**
   * Loads recorrido information for a given personal ID.
   */
  cargarInformacion(): void {
    this.cargando.set(true);
    const personal = this.usuarioService.StatusSesion().usuario?.personal || 0;
    this.recorridoService.porChofer(`${personal}`, true).subscribe({
      next: ({ recorridos, recorridosSinFirma }) => {
        const _recorridos = [...recorridos, ...recorridosSinFirma];
        this._recorridos.set(_recorridos);
        this.cargando.set(false);
      },
      error: (error: any) => {
        this.uiService.mostrarAlertaError("Recorridos", error?.message || "Error al cargar la información de los recorridos");
        this.cargando.set(false);
      }
    });


    this.choferService.estaEnCurso(`${personal}`)
      .then(resp => this.recorridoEnCurso.set({
        recorrido: resp.recorrido,
        ubicacion: resp.ubicacion,
      }));
  };




  mostrarPad(recorridoPorFirma: Recorrido) {
    this.recorridoPorFirmar.set(recorridoPorFirma);
  }

  cancelarFirma() {
    this.recorridoPorFirmar.set(null);
  }
  async guardarFirma(firma: string) {
    const id_recorrido = this.recorridoPorFirmar()?.id_recorrido;
     this.guardandoFirma.set(true);
    try {
      await firstValueFrom(this.recorridoService.firmar(`${id_recorrido}`, firma))
      this.uiService.mostrarAlertaSuccess("Recorridos", "Firma guardada correctamente");
    } catch (_) {
      this.uiService.mostrarAlertaError("Recorridos", "Error al guardar la firma");
    } finally {
      this.cargarInformacion();
      this.recorridoPorFirmar.set(null);
      this.guardandoFirma.set(false);
    }    
  }


}