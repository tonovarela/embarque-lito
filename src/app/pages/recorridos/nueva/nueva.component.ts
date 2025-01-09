import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, } from '@angular/forms';
import { createFormRegistroExternoBuilder, createFormRegistroInternoBuilder, resetFormRegistroCarga, resetFormRegistroExterno, resetFormRegistroInterno } from '@app/helpers/formModel';

import { RegistroExternoComponent } from '@app/componentes/registro-externo/registro-externo.component';
import { RegistroInternoComponent } from '@app/componentes/registro-interno/registro-interno.component';
import { initFlowbite } from 'flowbite';
import { Recorrido } from '@app/interface';
import { DataService } from '@app/services/data.service';
import { Router } from '@angular/router';


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
  fb = inject(FormBuilder);
  router=inject(Router);
  registroInterno = signal<boolean>(true);
  formRegistro = this.fb.group({
    registroInterno: createFormRegistroInternoBuilder(this.fb),
    registroExterno: createFormRegistroExternoBuilder(this.fb)
  })




  guardarRegistro() {
    this.registroInterno() ? this.guardarRegistroInterno() : this.guardarRegistroExterno();
  }


  ngOnInit(): void {
    initFlowbite();
    this.changeDetectorRef.detectChanges();
  }

  private guardarRegistroInterno() {
    this.formRegistro.get("registroInterno")!.markAllAsTouched();
    const registroInterno = this.formRegistro.get("registroInterno")!;
    if (registroInterno.invalid) {
      return;
    }

    const {
      fecha_salida,
      hora_salida,
      fecha_regreso,
      hora_regreso,
      ops,
      transporte,
      chofer,
      kilometraje_final,
      destino,
      kilometraje_inicial,
      observaciones
    } = registroInterno.getRawValue();
    //const fechaSalida = this.formatDate(fecha_salida!, hora_salida!);
    //const fechaRegreso = this.formatDate(fecha_regreso!, hora_regreso!);
    //const fecha_salida=new Date(2025, 0, 1, 12, 0, 0);
    //const fecha_regreso=new Date(2025, 0, 1, 12, 0, 0);

    const registro: Recorrido = {
      //fechaSalida,
      //fechaRegreso,
      fecha_regreso: new Date(2025, 0, 1, 12, 0, 0),
      fecha_salida: new Date(2025, 0, 1, 12, 0, 0),
      id_transporte: +transporte,
      id_chofer: +chofer,
      observaciones,
      ops,
      kilometraje_inicial: +kilometraje_inicial!,
      kilometraje_final: +kilometraje_final!,
      id_recorrido: this.dataService.Recorridos().length + 1,
      tipo: 'interno',      
      destino
    };     
    this.dataService.agregarRecorrido(registro);
    this.reset();
    
  }


  regresar(){
    this.router.navigate(['/recorridos']);
  }


  private reset() {
    this.registroInterno() ? resetFormRegistroInterno(this.formRegistro.get('registroInterno') as FormGroup)
      : resetFormRegistroExterno(this.formRegistro.get('registroExterno') as FormGroup);    
  }
  private guardarRegistroExterno() {
    this.formRegistro.get("registroExterno")!.markAllAsTouched();
    const registroExterno = this.formRegistro.get("registroExterno")!;    
    if (registroExterno.invalid) {
      return;
    }


    const {
      fecha_registro,              
      ops,
      transporte,
      chofer,
      destino,      
      observaciones
    } = registroExterno.getRawValue();
    const registro:Recorrido ={
      tipo: 'externo',
      id_recorrido: this.dataService.Recorridos().length + 1,
      id_transporte: +transporte,
      id_chofer: +chofer,
      fecha_registro,
      destino,
      observaciones,      
      ops,
    };
    this.dataService.agregarRecorrido(registro);
    console.log(registro);



  }


  private formatDate(date: Date, time: string) {
    const dia = ('0' + date.getDate()).slice(-2);
    const mes = ('0' + (date.getMonth() + 1)).slice(-2);
    const anio = date.getFullYear();
    const fechaCadena = `${anio}-${mes}-${dia} ${time}`;
    return fechaCadena;
  }


}
