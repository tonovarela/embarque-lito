import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { PrimeNgModule } from '@app/lib/primeng.module';

import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { resetFormRegistroExterno } from '@app/helpers/formModel';
import { DiferenciaTiempo } from '@app/interface/models';

import { ChoferService } from '@app/services/chofer.service';
import { TransporteService } from '@app/services/transporte.service';
import { MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent } from '@app/shared/svg';


import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';

@Component({
  selector: 'app-registro-externo',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule, CommonModule, FormsModule, MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent, AutocompleteComponent],
  templateUrl: './registro-externo.component.html',
  styleUrl: './registro-externo.component.css',
})


export class RegistroExternoComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  fb = inject(FormBuilder);
  formRegistro!: FormGroup;
  fechaSalida: string = '';
  today = new Date();
  choferService = inject(ChoferService);  
  transporteService = inject(TransporteService);  
  diferenciaTiempo: DiferenciaTiempo = { horas: 0, minutos: 0, totalMinutos: 1 };
  
  

  choferes= computed(() => this.choferService.choferes().externos);
  transportes= computed(() => this.transporteService.transportes().externos);
  tipoServicios = computed(() => this.transporteService.transportes().tipoServicios);
  

  ngOnInit(): void {
    this.formRegistro = this.formGroup.get('registroExterno') as FormGroup;  
    
  }

  ngAfterViewInit(): void {
    this.resetForm();
  }


  OnKeyPress(event: KeyboardEvent) { 
    event.preventDefault();    
  }

  resetForm() {
    resetFormRegistroExterno(this.formRegistro);
  }

  onSelectOP(op: string) {
    const opsCurrent = this.formRegistro.get('ops')!.value;
    const opExiste = opsCurrent.find((opActual: string) => opActual === op);
    if (opExiste) {
      return;
    }
    this.opsArray.push(this.fb.control(op));
  }

  private get opsArray(): FormArray {
    return this.formRegistro.get('ops') as FormArray;
  }


  onRemoverOP(op: string) {
    const opsCurrent = this.formRegistro.get('ops')!.value;
    const index = opsCurrent.findIndex((opActual: string) => opActual === op);
    this.opsArray.removeAt(index);
  }


  tieneError(controlName: string): boolean {
    const control = this.formRegistro.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }

  actualizarFecha({ detail }: any, nombre: string) {    
    const fecha = detail.date || null;
    this.formRegistro.get(nombre)!.setValue(fecha);
  }

}

