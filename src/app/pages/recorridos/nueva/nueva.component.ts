import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, } from '@angular/forms';

import { firstValueFrom } from 'rxjs';
import { initFlowbite } from 'flowbite';

import { createFormRegistroExternoBuilder, createFormRegistroInternoBuilder, resetFormRecorridoExterno, resetFormRecorridoInterno } from '@app/helpers/formModel';

import { RegistroExternoComponent } from '@app/componentes/registro-externo/registro-externo.component';
import { RegistroInternoComponent } from '@app/componentes/registro-interno/registro-interno.component';


import { RecorridoService } from '@app/services/recorrido.service';

import { Recorrido } from '@app/interface/models';
import { UiService } from '@app/services/ui.service';
import { formatDate, tieneErrorForm } from '@app/helpers/helpers';




@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [RegistroInternoComponent, RegistroExternoComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css'
})
export class NuevaComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    initFlowbite();   
    this.changeDetectorRef.detectChanges();  
  }

  changeDetectorRef = inject(ChangeDetectorRef);

  
  recorridoService = inject(RecorridoService);
  uiService = inject(UiService);



  fb = inject(FormBuilder);
  router = inject(Router);

  registroInterno = signal<boolean>(true);

  formRegistro = this.fb.group({
    registroInterno: createFormRegistroInternoBuilder(this.fb),
    registroExterno: createFormRegistroExternoBuilder(this.fb)
  })

  guardandoRecorrido = signal<boolean>(false);


  guardarRegistro() {
   if (this.guardandoRecorrido()) {
      return;
   }
    this.registroInterno() ? this.guardarRecorridoInterno() : this.guardarRecorridoExterno();
  }

  regresar() {    
    if (this.guardandoRecorrido()) {
      return;
   }
    this.router.navigate(['/recorridos']);
  }


  private async guardarRecorridoExterno() {
    this.formRegistro.get("registroExterno")!.markAllAsTouched();
    this.formRegistro.get("registroExterno")!.updateValueAndValidity();
    const registroExterno = this.formRegistro.get("registroExterno")!;    
    if (registroExterno.invalid) {
      return;
    }

    const { fecha_salida, ops, transporte, chofer, destino, observaciones, tipo_servicio,id_previo } = registroExterno.getRawValue();
    const registro: Recorrido = {
      destino,
      observaciones,
      ops,
      id_tipo_servicio: tipo_servicio,
      tipo: 'externo',
      id_previo: id_previo ?? null,
      id_transporte: +transporte,
      id_chofer: +chofer,
      fecha_salida: formatDate(new Date(`${fecha_salida}`), '00:00'),
    };

    await this.registrarRecorrido(registro);
  }

  private async guardarRecorridoInterno() {
    this.formRegistro.get("registroInterno")!.markAllAsTouched();
    this.formRegistro.get("registroInterno")!.updateValueAndValidity();
    const registroInterno = this.formRegistro.get("registroInterno")!;
    if (registroInterno.invalid) {
      return;
    }
    const { fecha_salida, hora_salida, fecha_regreso, hora_regreso, ops, transporte, tipo_servicio, chofer, kilometraje_final, destino, kilometraje_inicial, observaciones, id_previo } = registroInterno.getRawValue();
    const registro: Recorrido = {
      ops,
      observaciones,
      destino,
      id_previo: id_previo ?? null,
      id_tipo_servicio: tipo_servicio,
      fecha_salida: formatDate(new Date(fecha_salida!), hora_salida!),
      fecha_regreso: formatDate(new Date(fecha_regreso!), hora_regreso!),
      id_transporte: +transporte,
      id_chofer: +chofer,
      kilometraje_inicial: +kilometraje_inicial!,
      kilometraje_final: +kilometraje_final!,
      tipo: 'interno'
    };
    await this.registrarRecorrido(registro);    
  }


  private async registrarRecorrido(recorrido:Recorrido){

    try {
      this.guardandoRecorrido.set(true);
      await firstValueFrom(this.recorridoService.registrar(recorrido))      
      this.uiService.mostrarAlertaSuccess('Embarques', 'Recorrido registrado');
    } catch (ex: any) {
      this.uiService.mostrarAlertaError("Embarques", `Error al registrar el recorrido ${ex.message}`);
    }finally{
      this.guardandoRecorrido.set(false);
      this.reset();
    }

  }


 
  tieneError(controlName: string): boolean {
    return tieneErrorForm(controlName, this.formRegistro);    
  }

  private reset() {    
    this.registroInterno() ? resetFormRecorridoInterno(this.formRegistro.get('registroInterno') as FormGroup)
      : resetFormRecorridoExterno(this.formRegistro.get('registroExterno') as FormGroup);
      initFlowbite();   
    this.changeDetectorRef.detectChanges();  

  }


}
