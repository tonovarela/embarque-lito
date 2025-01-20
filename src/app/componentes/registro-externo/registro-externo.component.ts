import { CommonModule } from '@angular/common';
import {  Component, computed, inject, Input, OnInit } from '@angular/core';
import { PrimeNgModule } from '@app/lib/primeng.module';

import {  FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { resetFormRecorridoExterno } from '@app/helpers/formModel';
import { DiferenciaTiempo } from '@app/interface/models';

import { ChoferService } from '@app/services/chofer.service';
import { TransporteService } from '@app/services/transporte.service';
import { MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent } from '@app/shared/svg';


import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';
import { RegistroRecorridoHook } from '../hooks/useRegistro';

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
  registroRecorridoHook = inject(RegistroRecorridoHook);
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
    this.resetForm();    
  }


  OnKeyPress(event: KeyboardEvent) { 
    event.preventDefault();    
  }


  resetForm() {
    resetFormRecorridoExterno(this.formRegistro);
  }


  onSelectOP(op: string) {
    this.registroRecorridoHook.onSelectOP(op, this.formRegistro); 
    
  }

  


  onRemoverOP(op: string) {
    this.registroRecorridoHook.onRemoverOP(op, this.formRegistro);
  }

  tieneError(controlName: string): boolean {
    return this.registroRecorridoHook.tieneError(controlName, this.formRegistro);    
  }

  
  actualizarFecha({ detail }: any, nombre: string) {    
    const fecha = detail.date || null;
    this.formRegistro.get(nombre)!.setValue(fecha);
  }

}

