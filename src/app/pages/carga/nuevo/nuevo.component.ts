import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Transportes } from '@app/data';
import { createFormRegistroCargaBuilder, resetFormRegistroCarga } from '@app/helpers/formModel';
import { NumberFormatter } from '@app/helpers/validators';
import { Transporte } from '@app/interface';
import { DataService } from '@app/services/data.service';
import { GaugeComponent, MinusComponent, PlusComponent } from '@app/shared/svg';
import { CalendarComponent } from '@app/shared/svg/calendar/calendar.component';
import { obtenerValorNumerico } from '../../../helpers/validators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [CalendarComponent, PlusComponent, MinusComponent, GaugeComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css',

})
export class NuevoComponent implements OnInit {

  constructor() { }

  transportes: Transporte[] = [];
  fb = inject(FormBuilder);
  dataService = inject(DataService);
  router = inject(Router);
  formRegistro: FormGroup = createFormRegistroCargaBuilder(this.fb);

  ngOnInit() {
    resetFormRegistroCarga(this.formRegistro);
    this.transportes = Transportes;
  }


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
      return;
    }
    const kilometraje = this.dataService.traerUltimoKilometrajeCargaGasolina(id_transporte)

    if (kilometraje != 0) {
      this.formRegistro.get('kilometraje_inicial')?.disable()
    } else {
      this.formRegistro.get('kilometraje_inicial')?.enable();
    }



    this.formRegistro.get('kilometraje_inicial')!.setValue(kilometraje);
    this.formRegistro.get('kilometraje_final')!.enable();
    this.formRegistro.get('kilometraje_final')!.setValue(0);


    //TODO: obtener el kilometraje inicial del transporte seleccionado por api y si tiene kilometraje final setearlo como inicial y deshabilitar el campo en caso contrario habilitar los 2 campos    

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

}
