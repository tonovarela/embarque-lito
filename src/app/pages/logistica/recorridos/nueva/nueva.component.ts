import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, } from '@angular/forms';

import { firstValueFrom } from 'rxjs';
import { initFlowbite } from 'flowbite';

import { createFormRegistroExternoBuilder, createFormRegistroInternoBuilder, createFormRegistroProgramadorBuilder, resetFormRecorridoExterno, resetFormRecorridoInterno, resetFormRecorridoProgramado } from '@app/helpers/formModel';

import { RegistroExternoComponent } from '@app/componentes/registro-externo/registro-externo.component';
import { RegistroInternoComponent } from '@app/componentes/registro-interno/registro-interno.component';


import { RecorridoService } from '@app/services/recorrido.service';

import { Recorrido } from '@app/interface/models';
import { UiService } from '@app/services/ui.service';
import { formatDate, tieneErrorForm } from '@app/helpers/helpers';
import { obtenerValorNumerico } from '@app/helpers/validators';
import { RegistroProgramadoComponent } from '@app/componentes/registro-programado/registro-programado.component';




@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [RegistroInternoComponent, RegistroExternoComponent, RegistroProgramadoComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css'
})
export default class NuevaComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
    this.changeDetectorRef.detectChanges();
    
  }


  changeDetectorRef = inject(ChangeDetectorRef);
  recorridoService = inject(RecorridoService);
  uiService = inject(UiService);
  fb = inject(FormBuilder);
  router = inject(Router);
  
  guardandoRecorrido = signal<boolean>(false);
  registro = signal<'interno' | 'externo' | 'programado'>('interno');

  formRegistro = this.fb.group({
    registroInterno: createFormRegistroInternoBuilder(this.fb),
    registroExterno: createFormRegistroExternoBuilder(this.fb),
    registroProgramado: createFormRegistroProgramadorBuilder(this.fb)
  })

  


  public guardarRegistro() {
    if (this.guardandoRecorrido()) {
      return;
    }
    switch (this.registro()) {
      case 'interno':
        this.guardarRecorridoInterno();
        break;
      case 'externo':
        this.guardarRecorridoExterno();
        break;
      case 'programado':
        this.guardarRecorridoProgramado();
        break;
      default:
        console.log('No se reconoce el tipo de registro');
        break;
    }
    
  }

  public regresar() {
    if (this.guardandoRecorrido()) {
      return;
    }
    this.router.navigate(['/logistica/recorridos']);
  }


  private async guardarRecorridoExterno() {
    this.formRegistro.get("registroExterno")!.markAllAsTouched();
    this.formRegistro.get("registroExterno")!.updateValueAndValidity();
    const registroExterno = this.formRegistro.get("registroExterno")!;
    if (registroExterno.invalid) {
      return;
    }

    const { fecha_salida, ops, transporte, chofer, destino, observaciones, tipo_servicio, id_previo, factura, importe_factura, remisiones } = registroExterno.getRawValue();
    const registro: Recorrido = {
      destino,
      observaciones,
      ops,
      factura,
      remisiones,
      importe_factura: obtenerValorNumerico(importe_factura),
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
    const { fecha_salida, hora_salida, fecha_regreso, hora_regreso, ops, transporte, tipo_servicio, chofer, kilometraje_final, destino, kilometraje_inicial, observaciones, id_previo, remisiones } = registroInterno.getRawValue();
    const registro: Recorrido = {
      ops,
      observaciones,
      destino,
      remisiones,
      factura: "N/A",
      importe_factura: 0,
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

  private async guardarRecorridoProgramado() {
    const formRegistro = this.formRegistro.get("registroProgramado")!;
    this.formRegistro.get("registroProgramado")!.markAllAsTouched();
    this.formRegistro.get("registroProgramado")!.updateValueAndValidity();
    
    if (formRegistro.invalid) {
      return;
    }
  
    this.guardandoRecorrido.set(true);
    const {retorno,  ops, transporte, tipo_servicio, chofer,  destino,  observaciones, id_previo, remisiones } = formRegistro.getRawValue();

    const registro: Recorrido = {
      ops:retorno?["Retorno"]:ops,
      observaciones,
      destino:retorno?"Retorno Litoprocess":destino,
      remisiones:retorno?["N/A"]:remisiones,
      factura: "N/A",
      importe_factura: 0,
      id_previo: id_previo ?? null,
      id_tipo_servicio: retorno?"16":tipo_servicio,    
      id_transporte: +transporte,
      id_chofer: +chofer,    
      tipo: 'interno'
    };    
    await this.registrarRecorrido(registro);      
    this.guardandoRecorrido.set(false);
  }

  private async registrarRecorrido(recorrido: Recorrido) {

    try {
      this.guardandoRecorrido.set(true);
      await firstValueFrom(this.recorridoService.registrar(recorrido))
      this.uiService.mostrarAlertaSuccess('Embarques', 'Recorrido registrado');
      this.reset();
    } catch (ex: any) {
      this.uiService.mostrarAlertaError("Embarques", `${ex["error"]["mensaje"]}`);
    } finally {
      this.guardandoRecorrido.set(false);
    }

  }

 public tieneError(controlName: string): boolean {
    return tieneErrorForm(controlName, this.formRegistro);
  }

  private reset() {
    switch (this.registro()) {
      case 'interno':
        resetFormRecorridoInterno(this.formRegistro.get('registroInterno') as FormGroup);
        break;
      case 'externo':
        resetFormRecorridoExterno(this.formRegistro.get('registroExterno') as FormGroup);
        break;
      case 'programado':
        
        resetFormRecorridoProgramado(this.formRegistro.get('registroProgramado') as FormGroup);
        break;
      default:
        console.log('No se reconoce el tipo de registro');
        break;
    }
    // this.registroInterno() ? resetFormRecorridoInterno(this.formRegistro.get('registroInterno') as FormGroup)
    //   : resetFormRecorridoExterno(this.formRegistro.get('registroExterno') as FormGroup);
    initFlowbite();
    this.changeDetectorRef.detectChanges();

  }


}
