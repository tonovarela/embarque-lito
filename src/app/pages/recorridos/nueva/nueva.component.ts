import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, } from '@angular/forms';

import { firstValueFrom } from 'rxjs';
import { initFlowbite } from 'flowbite';

import { createFormRegistroExternoBuilder, createFormRegistroInternoBuilder, resetFormRegistroExterno, resetFormRegistroInterno } from '@app/helpers/formModel';

import { RegistroExternoComponent } from '@app/componentes/registro-externo/registro-externo.component';
import { RegistroInternoComponent } from '@app/componentes/registro-interno/registro-interno.component';

import { DataService } from '@app/services/data.service';
import { RecorridoService } from '@app/services/recorrido.service';

import { Recorrido } from '@app/interface/models';


@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [RegistroInternoComponent, RegistroExternoComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css'
})
export class NuevaComponent implements OnInit {
  changeDetectorRef = inject(ChangeDetectorRef);
  dataService = inject(DataService);
  recorridoService = inject(RecorridoService);


  fb = inject(FormBuilder);
  router = inject(Router);

  registroInterno = signal<boolean>(true);

  formRegistro = this.fb.group({
    registroInterno: createFormRegistroInternoBuilder(this.fb),
    registroExterno: createFormRegistroExternoBuilder(this.fb)
  })

  ngOnInit(): void {
    initFlowbite();
    this.changeDetectorRef.detectChanges();
  }

  guardarRegistro() {
    this.registroInterno() ? this.guardarRegistroInterno() : this.guardarRegistroExterno();
  }




  regresar() {
    this.router.navigate(['/recorridos']);
  }


  private reset() {
    this.registroInterno() ? resetFormRegistroInterno(this.formRegistro.get('registroInterno') as FormGroup)
      : resetFormRegistroExterno(this.formRegistro.get('registroExterno') as FormGroup);
  }




  private async guardarRegistroExterno() {
    this.formRegistro.get("registroExterno")!.markAllAsTouched();
    const registroExterno = this.formRegistro.get("registroExterno")!;
    if (registroExterno.invalid) {
      return;
    }
    const { fecha_registro, ops, transporte, chofer, destino, observaciones } = registroExterno.getRawValue();

    const registro: Recorrido = {
      tipo: 'externo',
      id_transporte: +transporte,
      id_chofer: +chofer,
      fecha_registro,
      destino,
      observaciones,
      ops,
    };
    //this.dataService.agregarRecorrido(registro);
    console.log(registro);






  }


  private async guardarRegistroInterno() {    
    this.formRegistro.get("registroInterno")!.markAllAsTouched();
    this.formRegistro.get("registroInterno")!.updateValueAndValidity();
    const registroInterno = this.formRegistro.get("registroInterno")!;
    if (registroInterno.invalid) {
      return;
    }
    const { fecha_salida, hora_salida, fecha_regreso, hora_regreso, ops, transporte, tipo_servicio, chofer, kilometraje_final, destino, kilometraje_inicial, observaciones,id_previo } = registroInterno.getRawValue();
    const registro: Recorrido = {
      ops,
      observaciones,
      destino,
      id_previo:id_previo??null,
      id_tipo_servicio: tipo_servicio,
      fecha_salida: this.formatDate(new Date(fecha_salida!), hora_salida!),
      fecha_regreso: this.formatDate(new Date(fecha_regreso!), hora_regreso!),
      id_transporte: +transporte,
      id_chofer: +chofer,
      kilometraje_inicial: +kilometraje_inicial!,
      kilometraje_final: +kilometraje_final!,
      tipo: 'interno'
    };
    await firstValueFrom(this.recorridoService.registrar(registro))
    this.reset();
  }


  private formatDate(date: Date, time: string | null): string {
    const dia = ('0' + date.getDate()).slice(-2);
    const mes = ('0' + (date.getMonth() + 1)).slice(-2);
    const anio = date.getFullYear();
    const fechaCadena = `${anio}-${dia}-${mes} ${time === null ? '' : time}`;
    return fechaCadena;
  }


  // private convertirACadenaFecha(fecha: string, hora: string): Date {

  //   const [year, month, day] = fecha.split('-').map(Number);
  //   const [hours, minutes] = hora.split(':').map(Number);
  //   return new Date(year, month - 1, day, hours, minutes);
  // }

  tieneError(controlName: string): boolean {
    const control = this.formRegistro.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }

}
