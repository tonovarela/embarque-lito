import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder,  ReactiveFormsModule, } from '@angular/forms';
import { createFormRegistroExternoBuilder, createFormRegistroInternoBuilder } from '@app/helpers/formModel';

import { RegistroExternoComponent } from '@app/componentes/registro-externo/registro-externo.component';
import { RegistroInternoComponent } from '@app/componentes/registro-interno/registro-interno.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [RegistroInternoComponent, RegistroExternoComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css'
})
export class NuevaComponent implements OnInit {
  changeDetectorRef = inject(ChangeDetectorRef);
  ngOnInit(): void {
    initFlowbite();   
    this.changeDetectorRef.detectChanges(); 
  }
   
  fb = inject(FormBuilder);
  registroInterno = signal<boolean>(true);
  formRegistro = this.fb.group({
    registroInterno: createFormRegistroInternoBuilder(this.fb),
    registroExterno: createFormRegistroExternoBuilder(this.fb)
  })

  guardarRegistro() {
  
    this.registroInterno() ? this.guardarRegistroInterno() : this.guardarRegistroExterno();
  }


  private guardarRegistroInterno() {
    this.formRegistro.get("registroInterno")!.markAllAsTouched();
    const registroInterno = this.formRegistro.get("registroInterno")!;
    console.log(registroInterno.valid);
    if (registroInterno.invalid) {
      return;
    }
    const { fecha_salida, hora_salida, fecha_regreso, hora_regreso, ops, transporte, chofer, kilometraje_final, observaciones } = registroInterno.value;
    const fechaSalida = this.formatDate(fecha_salida!, hora_salida!);
    const fechaRegreso = this.formatDate(fecha_regreso!, hora_regreso!);
    
    const registro = {fechaSalida, fechaRegreso, transporte, chofer,observaciones,ops,
      kilometraje_inicial: +registroInterno.get('kilometraje_inicial')!,
      kilometraje_final: +kilometraje_final!,
    };
    console.log(registro);
  }

  private guardarRegistroExterno() {
    this.formRegistro.get("registroExterno")!.markAllAsTouched();
    const registroExterno = this.formRegistro.get("registroExterno")!;
    console.log(registroExterno.valid);
    if (registroExterno.invalid) {
      return;
    }
    

    

  }


  private formatDate(date: Date, time: string) {
    const dia = ('0' + date.getDate()).slice(-2);
    const mes = ('0' + (date.getMonth() + 1)).slice(-2);
    const anio = date.getFullYear();
    const fechaCadena = `${anio}-${mes}-${dia} ${time}`;
    return fechaCadena;
  }


}
