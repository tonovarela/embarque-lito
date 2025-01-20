import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { PrimeNgModule } from '@app/lib/primeng.module';

import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { resetFormRecorridoExterno } from '@app/helpers/formModel';
import { DiferenciaTiempo } from '@app/interface/models';

import { ChoferService } from '@app/services/chofer.service';
import { TransporteService } from '@app/services/transporte.service';
import { MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent } from '@app/shared/svg';


import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';
import { RegistroRecorridoHook } from '../hooks/useRegistro';
import { NumberFormatter } from '@app/helpers/validators';

@Component({
  selector: 'app-registro-externo',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule, CommonModule, FormsModule, MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent, AutocompleteComponent],
  providers: [RegistroRecorridoHook],
  templateUrl: './registro-externo.component.html',
  styleUrl: './registro-externo.component.css',
})


export class RegistroExternoComponent implements OnInit {
  @Input() formGroup!: FormGroup;


  formRegistro!: FormGroup;
  recorridoRegistroHook = inject(RegistroRecorridoHook);
  fechaSalida: string = '';
  today = new Date();
  choferService = inject(ChoferService);
  transporteService = inject(TransporteService);
  diferenciaTiempo: DiferenciaTiempo = { horas: 0, minutos: 0, totalMinutos: 1 };



  choferes = computed(() => this.choferService.choferes().externos);
  transportes = computed(() => this.transporteService.transportes().externos);
  tipoServicios = computed(() => this.transporteService.transportes().tipoServicios);

  ngOnInit(): void {
    this.formRegistro = this.formGroup.get('registroExterno') as FormGroup;
    this.resetForm();
  }


  OnKeyPress(event: KeyboardEvent) {
    event.preventDefault();
  }

  onRemoverOP(op: string) {
    this.recorridoRegistroHook.onRemoverOP(op, this.formRegistro);
  }

  onSelectOP(op: string) {
    this.recorridoRegistroHook.onSelectOP(op, this.formRegistro);
  }



  onAddRemision({ value: remision }: any) {
    this.recorridoRegistroHook.onAddRemision({ value: remision }, this.formRegistro);
  }
  onRemoveRemision({ value: remision }: any) {
    this.recorridoRegistroHook.onRemoveRemision({ value: remision }, this.formRegistro);
  }

  onBlurRemision(event: any) {
    this.recorridoRegistroHook.onBlurRemision(event, this.formRegistro);
  }


  get remisionesArray(): FormArray {
    return this.recorridoRegistroHook.remisionesArray(this.formRegistro);
  }



  tieneError(controlName: string): boolean {
    return this.recorridoRegistroHook.tieneError(controlName, this.formRegistro);
  }


  resetForm() {
    resetFormRecorridoExterno(this.formRegistro);
  }



  actualizarFecha({ detail }: any, nombre: string) {
    const fecha = detail.date || null;
    this.formRegistro.get(nombre)!.setValue(fecha);
  }

   onValidateNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9.]$/)) {
      event.preventDefault();
    }
  }


   onInput(event: any, prefix: string, field: string) {
    const target = event.target as HTMLInputElement;
    let value = target.value;
    const newValue = new NumberFormatter(value, prefix).getFormat(2);
    target.value = newValue;
    this.formRegistro.get(field)!.setValue(newValue);
  }

}

