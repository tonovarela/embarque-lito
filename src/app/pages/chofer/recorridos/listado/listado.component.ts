import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Recorrido } from '@app/interface/models';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import {  ChoferService, RecorridoService, UiService, UsuarioService } from '@app/services';
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
  private recorridoService = inject(RecorridoService);
  private choferService = inject(ChoferService);
  
  public recorridoActivoInicio: Recorrido | null = null;
  public recorridoActivoFin: Recorrido | null = null;
  public uiService = inject(UiService);

  public usuarioService = inject(UsuarioService)

  public cargando = signal<boolean>(false);
  private _isRunning = signal<boolean>(false);
  private today = new Date();

  public isRunning = computed(() => this._isRunning());
  Recorridos = computed(() => this._recorridos());
  protected minusHeight = 0.27;
  private  _estaEnCurso = signal<boolean>(false);
  public estaEnCurso = computed(() => this._estaEnCurso());


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
     const id_usuario = this.usuarioService.StatusSesion().usuario?.id || 0;
     console.log({ id_usuario });
    this.choferService.estaEnCurso(3142).then((estaEnCurso) => {
      this._estaEnCurso.set(estaEnCurso);
      //console.log({ estaEnCurso });
    });

  }



  public  setRecorrridoInicial(posicionKilometraje: PosicionKilometraje | null) {      
    if (!this.recorridoActivoInicio) {
      return;
    }
    if (posicionKilometraje === null) {
      this.recorridoActivoInicio = null;
      return;
    }
    const { kilometraje,id_recorrido,gpsPosicion } = posicionKilometraje;
    console.log({kilometraje,id_recorrido,gpsPosicion});
    
    if (!kilometraje) {
      this.recorridoActivoInicio = null;
      return;
    }
    this.today = new Date();
     this._isRunning.set(true);    
     this._recorridos.set(
      this._recorridos().map((recorrido) => {
        if (recorrido.id_recorrido === id_recorrido) {
          return { ...recorrido, fecha_salida:new Date(),kilometraje_inicial:kilometraje };
        }
        return recorrido;
      })
     );
     //console.log({ id_recorrido, kilometraje, gpsPosicion,id_previo: this.recorridoActivoInicio?.id_recorrido });
    this.recorridoActivoInicio = null;
  }

  public setRecorrridoFinal(posicionKilometraje: PosicionKilometraje | null) {
    if (!this.recorridoActivoFin) {
      return;
    }
    if (posicionKilometraje === null) {
      this.recorridoActivoFin = null;
      return;
    }
    const { kilometraje, id_recorrido, gpsPosicion } = posicionKilometraje;
    if (!kilometraje) {
      this.recorridoActivoFin = null;
      return;
    }
    this._isRunning.set(false);
    this._recorridos.set(
      this._recorridos().map((recorrido) => {
        if (recorrido.id_recorrido === id_recorrido) {
          return { ...recorrido, fecha_regreso:new Date(),kilometraje_final:kilometraje };
        }
        return recorrido;
      })
     );
    //console.log({ id_recorrido, kilometraje, gpsPosicion });
    this.recorridoActivoFin = null;

  }

  cargarInformacion() {
    this.cargando.set(true);
    this.recorridoService.porChofer("3142", true).subscribe(({ recorridos }) => {
      this._recorridos.set(recorridos);
      this.cargando.set(false);
    });
  }


  // onValidateNumber(event: KeyboardEvent) {
  //   const charCode = event.charCode;
  //   const charStr = String.fromCharCode(charCode);
  //   if (!charStr.match(/^[0-9.]$/)) {
  //     event.preventDefault();
  //   }
  // }

  // onInput(event: any, prefix: string) {
  //   const target = event.target as HTMLInputElement;
  //   let value = target.value;
  //   const newValue = new NumberFormatter(value, prefix).getFormat(2);
  //   target.value = newValue;
  // }




  // async eliminarRecorrido(recorrido: Recorrido) {

  //   const { isConfirmed } = await this.uiService.mostrarAlertaConfirmacion("Recorridos", "¿Está seguro de eliminar el recorrido?", "Si,eliminarlo", "Cancelar");
  //   if (!isConfirmed) {
  //     return;
  //   }
  //   const { id_recorrido } = recorrido;
  //   this._recorridos.set([]);
  //   try {
  //     await firstValueFrom(this.recorridoService.eliminar(id_recorrido!));
  //   } catch (e) {
  //     this.uiService.mostrarAlertaError("Recorridos", "Error al eliminar el recorrido");
  //   } finally {
  //     this.cargarInformacion();
  //   }



  // }

  // irNuevo() {
  //   this.router.navigate(['chofer/recorridos/nuevo']);
  // }




}

