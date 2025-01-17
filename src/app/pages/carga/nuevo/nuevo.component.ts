import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createFormRegistroCargaBuilder, resetFormRegistroCarga, setFechaCarga } from '@app/helpers/formModel';
import { NumberFormatter } from '@app/helpers/validators';
import { CargaGasolina } from '@app/interface/models';

import { GaugeComponent, MinusComponent, PlusComponent } from '@app/shared/svg';
import { CalendarComponent } from '@app/shared/svg/calendar/calendar.component';
import { obtenerValorNumerico } from '../../../helpers/validators';
import { Router } from '@angular/router';
import { TransporteService } from '@app/services/transporte.service';
import { onFocusNumberValidate, onInputNumberValidate, tieneErrorForm } from '@app/helpers/helpers';
import { CargaGasolinaService } from '@app/services/cargaGasolina.service';
import { firstValueFrom } from 'rxjs';
import { formatDate } from '../../../helpers/helpers';
import { UiService } from '@app/services/ui.service';


@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [CalendarComponent, PlusComponent, MinusComponent, GaugeComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css',

})
export class NuevoComponent implements OnInit {

  constructor() { }
  transporteService = inject(TransporteService);

  fb = inject(FormBuilder);
  
  cargaGasolinaService = inject(CargaGasolinaService);
  uiService = inject(UiService);

  router = inject(Router);
  formRegistro: FormGroup = createFormRegistroCargaBuilder(this.fb);
  guardandoCarga = signal(false);


  ngOnInit() {
    resetFormRegistroCarga(this.formRegistro);
  }

  transportes = computed(() => this.transporteService.transportes().internos);


  incrementar(valor: number, nombre: string) {
    const valorActual = this.formRegistro.get(nombre)!.value;
    const nuevoValor = (+valorActual + valor) || 0;
    if (nuevoValor < 0) {
      return;
    }
    this.formRegistro.get(nombre)!.setValue(nuevoValor);
  }



  public async actualizarKilometrajeInicial() {
    const id_transporte = this.formRegistro.get('transporte')!.value;

    if (id_transporte == "0") {
      this.formRegistro.get('kilometraje_inicial')!.setValue(0);
      this.formRegistro.get('kilometraje_inicial')!.disable();
      this.formRegistro.get('kilometraje_final')!.setValue(0);
      this.formRegistro.get('id_previo')!.setValue(null);
      this.formRegistro.get('kilometraje_final')!.disable();
      this.formRegistro.get('fecha_carga')!.setValue(new Date());
      this.formRegistro.get('fecha_minima_carga')!.setValue(null);
      setFechaCarga(this.formRegistro, new Date());
      return;
    }
    const responseUltimaCarga = firstValueFrom(this.cargaGasolinaService.ultimo(id_transporte));
    const ultimaCarga = (await responseUltimaCarga).carga;
    if (ultimaCarga != null) {      
      this.formRegistro.get('kilometraje_inicial')?.disable()
    } else {
      this.formRegistro.get('kilometraje_inicial')?.enable();

    }
    this.formRegistro.get('kilometraje_inicial')!.setValue(ultimaCarga?.kilometraje_final || 0);

    this.formRegistro.get('kilometraje_final')!.enable();
    this.formRegistro.get('kilometraje_final')!.setValue(0)
    const today= new Date();    
    const fechaCargaActual=ultimaCarga?new Date(`${ultimaCarga?.fecha_carga}`):today;
    const fechaMinimoCarga = ultimaCarga?new Date(`${ultimaCarga?.fecha_carga}`):null;
    this.formRegistro.get('id_previo')?.setValue(ultimaCarga?.id_carga_gasolina??null);
    this.formRegistro.get('fecha_carga')!.setValue(fechaCargaActual);
    this.formRegistro.get('fecha_minima_carga')!.setValue( fechaMinimoCarga);
    setFechaCarga(this.formRegistro, fechaCargaActual);


  }

  actualizarFecha({ detail }: any, nombre: string) {
    const fecha = detail.date;
    this.formRegistro.get(nombre)!.setValue(fecha);
  }

  public onValidateNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9.]$/)) {
      event.preventDefault();
    }
  }




  public onInput(event: any, prefix: string, field: string) {
    const target = event.target as HTMLInputElement;
    let value = target.value;
    const newValue = new NumberFormatter(value, prefix).getFormat(2);
    target.value = newValue;
    this.formRegistro.get(field)!.setValue(newValue);

  }

  regresar() {
    if (this.guardandoCarga()){
      return;
    }
    this.router.navigate(['/carga']);
  }


  async guardarRegistro() {
    this.formRegistro.markAllAsTouched();
    if (this.formRegistro.invalid || this.guardandoCarga()) {
      return;
    }
    const { transporte, chofer, observaciones, id_previo, ...rest } = this.formRegistro.getRawValue();        
    const nuevoRegistro: CargaGasolina = {
      observaciones,
      id_previo,
      id_transporte: +transporte,
      total_litros: this.formRegistro.get('totalLitros')?.value,
      importe_carga: obtenerValorNumerico(this.formRegistro.get('importeCarga')?.value),
      kilometraje_inicial: +this.formRegistro.get('kilometraje_inicial')?.value,
      kilometraje_final: +this.formRegistro.get('kilometraje_final')?.value,
      fecha_carga: formatDate(this.formRegistro.get('fecha_carga')?.value, '00:00')
    };
    this.guardandoCarga.set(true);
    try {
      await firstValueFrom(this.cargaGasolinaService.registrar(nuevoRegistro));      
      this.uiService.mostrarAlertaSuccess('Embarques', 'Carga de gasolina registrada correctamente');
      resetFormRegistroCarga(this.formRegistro);
      
    } catch (ex) {
      this.uiService.mostrarAlertaError('Embarques', 'Error al registrar la carga de gasolina');
    }
    finally {
      this.guardandoCarga.set(false);
      resetFormRegistroCarga(this.formRegistro);
    }

  }


 onInputNumber(event: any,field:string){
    onInputNumberValidate(event,field,this.formRegistro);    
  }

  onFocusNumber(event: any,field:string){
    onFocusNumberValidate(event,field,this.formRegistro); 
  }

  tieneError(controlName: string): boolean {
    return tieneErrorForm(controlName, this.formRegistro);
  }

  tieneErrorFechaCarga(): boolean {
    return this.formRegistro.errors && this.formRegistro.errors['fechaCargaInvalida'];;
  }



}
