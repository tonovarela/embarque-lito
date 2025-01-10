import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChoferesExternos, TransportesExternos } from '@app/data';
import { tipoServicios } from '@app/data/TipoServicio.data';
import { resetFormRegistroExterno } from '@app/helpers/formModel';
import { DiferenciaTiempo, Chofer, Transporte } from '@app/interface';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';
import { MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent } from '@app/shared/svg';

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
  diferenciaTiempo: DiferenciaTiempo = { horas: 0, minutos: 0, totalMinutos: 1 };
  choferes: Partial<Chofer>[] = [];
  transportes: Partial<Transporte>[] = [];
  tipoServicios = tipoServicios;


  ngOnInit(): void {
    this.formRegistro = this.formGroup.get('registroExterno') as FormGroup;
    this.choferes = ChoferesExternos;
    this.transportes = TransportesExternos;
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

  // obtenerDiferenciaHoras(fechaInicio: Date, fechaFin: Date) {
  //   const diferenciaMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
  //   const diferenciaHoras = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60)) || 0;
  //   const diferenciaMinutos = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60)) || 0;
  //   const totalMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
  //   if (isNaN(totalMinutos) || totalMinutos < 60) {
  //     this.formRegistro.get('hora_regreso')!.setErrors({ diferenciaInvalida: true });
  //   } else {
  //     this.formRegistro.get('hora_regreso')!.setErrors(null);
  //   }
  //   return { horas: diferenciaHoras, minutos: diferenciaMinutos, totalMinutos };
  // }

}

