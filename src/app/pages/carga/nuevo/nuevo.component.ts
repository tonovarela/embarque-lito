import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createFormRegistroCargaBuilder, resetFormRegistroCarga, setFechaCarga } from '@app/helpers/formModel';
import { NumberFormatter } from '@app/helpers/validators';
import { Transporte } from '@app/interface/models';
import { DataService } from '@app/services/data.service';
import { GaugeComponent, MinusComponent, PlusComponent } from '@app/shared/svg';
import { CalendarComponent } from '@app/shared/svg/calendar/calendar.component';
import { obtenerValorNumerico } from '../../../helpers/validators';
import { Router } from '@angular/router';
import { TransporteService } from '@app/services/transporte.service';


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
  //transportes: Transporte[] = [];
  fb = inject(FormBuilder);
  dataService = inject(DataService);
  router = inject(Router);
  formRegistro: FormGroup = createFormRegistroCargaBuilder(this.fb);
  

  ngOnInit() {
    resetFormRegistroCarga(this.formRegistro);
    //this.transportes = Transportes;
  }

  transportes= computed(() => this.transporteService.transportes().internos);


  incrementar(valor: number, nombre: string) {
    const valorActual = this.formRegistro.get(nombre)!.value;
    const nuevoValor = (+valorActual + valor) || 0;
    if (nuevoValor < 0) {
      return;
    }
    this.formRegistro.get(nombre)!.setValue(nuevoValor);
  }

  tieneError(controlName: string): boolean {
    const control = this.formRegistro.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }

  public actualizarKilometrajeInicial() {
    const id_transporte = this.formRegistro.get('transporte')!.value;

    if (id_transporte == "0") {
      this.formRegistro.get('kilometraje_inicial')!.setValue(0);
      this.formRegistro.get('kilometraje_inicial')!.disable();
      this.formRegistro.get('kilometraje_final')!.setValue(0);
      this.formRegistro.get('kilometraje_final')!.disable();
      this.formRegistro.get('fecha_carga')!.setValue(new Date());
      this.formRegistro.get('fecha_minima_carga')!.setValue(null);
      setFechaCarga(this.formRegistro,new Date());
      return;
    }
    const ultimaCarga = this.dataService.traerUltimoKilometrajeCargaGasolina(id_transporte)
    
    if (ultimaCarga != null) {            
      this.formRegistro.get('kilometraje_inicial')?.disable()
    } else {
      this.formRegistro.get('kilometraje_inicial')?.enable();
      
    }
    this.formRegistro.get('kilometraje_inicial')!.setValue(ultimaCarga?.kilometraje_final || 0);
    
    this.formRegistro.get('kilometraje_final')!.enable();
    this.formRegistro.get('kilometraje_final')!.setValue(0)
    const fechaMinimaCarga=ultimaCarga?.fecha_carga ?? new Date();
    this.formRegistro.get('fecha_carga')!.setValue(fechaMinimaCarga);
    this.formRegistro.get('fecha_minima_carga')!.setValue(ultimaCarga?.fecha_carga ?? null);    
    setFechaCarga(this.formRegistro,fechaMinimaCarga);


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
    this.router.navigate(['/carga']);
  }


  guardarRegistro() {
    this.formRegistro.markAllAsTouched();
    if (this.formRegistro.invalid) {
      return;
    }
    const { transporte, ...rest } = this.formRegistro.value;
    const nuevoRegistro = {
      ...rest,
      id_transporte: +transporte,
      id_cargaGasolina: this.dataService.CargasGasolina().length + 1,
      importeCarga: obtenerValorNumerico(this.formRegistro.get('importeCarga')?.value),
      totalLitros: +this.formRegistro.get('totalLitros')?.value,
      kilometraje_inicial: +this.formRegistro.get('kilometraje_inicial')?.value,
      kilometraje_final: +this.formRegistro.get('kilometraje_final')?.value,
    };

    this.dataService.agregarCargaGasolina(nuevoRegistro);

    resetFormRegistroCarga(this.formRegistro);



  }


  tieneErrorFechaCarga(): boolean {
    return this.formRegistro.errors  && this.formRegistro.errors['fechaCargaInvalida'] ;;
  }



}
