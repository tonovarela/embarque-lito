import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { kilometrajeValidator, MayorACeroValidator } from "./validators";

import { Datepicker } from 'flowbite';
import type { DatepickerOptions } from "flowbite";

declare var translateCalendar: any;


export const createFormRegistroInternoBuilder = (fb: FormBuilder) => {
  const today = new Date();
  return fb.group({
    transporte: [0, MayorACeroValidator()],
    chofer: [0, MayorACeroValidator()],
    tipo_servicio: [0, MayorACeroValidator()],
    kilometraje_inicial: [{ value: 0, disabled: true }, MayorACeroValidator()],
    kilometraje_final: [{ value: 0, disabled: true }, MayorACeroValidator()],
    destino: [''],
    ops: fb.array([], Validators.required),
    hora_salida: ['00:00'],
    hora_regreso: ['00:00'],
    fecha_salida: [today],
    fecha_regreso: [today],
    observaciones: [''],
  }, { validators: kilometrajeValidator() });
}



export const createFormRegistroExternoBuilder = (fb: FormBuilder) => {
  return fb.group({
    ops: fb.array([], Validators.required),
    chofer: [0, MayorACeroValidator()],
    transporte: [0, MayorACeroValidator()],
    observaciones: [''],
    destino: [''],
    fecha_registro: [new Date(), Validators.required],
  });
}

export const createFormRegistroCargaBuilder = (fb: FormBuilder) => {
  return fb.group({
    transporte: [0, MayorACeroValidator()],
    totalLitros: [{value:''} , [Validators.required,MayorACeroValidator()]],
    importeCarga: [{value:''}, [Validators.required,MayorACeroValidator()]],
    observaciones: [''],
    kilometraje_inicial: [{ value: 0, disabled: true }, MayorACeroValidator()],
    kilometraje_final: [{ value: 0, disabled: true }, MayorACeroValidator()],
    fecha_registro: ['', Validators.required],
  },{ validators: kilometrajeValidator() });
}



 const actualizarInputPorID=(id:string,valor:string)=>{
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = valor;
    }

 }



export const resetFormRegistroCarga = (formRegistro: FormGroup) => {
  const today = new Date();
  formRegistro.reset();

  formRegistro.get("transporte")!.setValue(0);
  formRegistro.get("fecha_registro")!.setValue(today);
  formRegistro.get("kilometraje_inicial")!.setValue(0);
  formRegistro.get("kilometraje_final")!.setValue(0);
  const $datepickerEl = document.getElementById('fecha_registro');
  const options: DatepickerOptions = {format: 'dd-mm-yyyy',};
  const datepicker1 = new Datepicker($datepickerEl,options);
  actualizarInputPorID("totalLitros","");
  actualizarInputPorID("importeCarga","");
  
  datepicker1.init();
  datepicker1.setDate(today);
  translateCalendar();


}


export const resetFormRegistroExterno = (formRegistro: FormGroup) => {
  const today = new Date();
  
  formRegistro.reset();
  formRegistro.get("transporte")!.setValue("0");
  formRegistro.get("chofer")!.setValue("0");
  formRegistro.setControl("ops", new FormArray([], Validators.required));
  formRegistro.get('destino')!.setValue('');
  formRegistro.get("fecha_registro")!.setValue(today);
  const $datepickerEl = document.getElementById('fecha_registro');
  const options: DatepickerOptions = {format: 'dd-mm-yyyy',};
  const datepicker1 = new Datepicker($datepickerEl,options);
  datepicker1.init();
  datepicker1.setDate(today);
  translateCalendar();
}



export const resetFormRegistroInterno = (formRegistro: FormGroup) => {
  const today = new Date();
  const horaActual = today.toTimeString().substring(0, 2);
  const horaSalida = new Date(today.getTime() + 60 * 60 * 1000).toTimeString().substring(0, 2);
  formRegistro.reset();
  formRegistro.get("transporte")!.setValue("0");
  formRegistro.setControl("ops", new FormArray([],Validators.required));
  formRegistro.get("chofer")!.setValue("0");
  formRegistro.get("kilometraje_inicial")!.disable();
  formRegistro.get("kilometraje_final")!.disable();
  formRegistro.get("kilometraje_inicial")!.setValue(0);
  formRegistro.get("kilometraje_final")!.setValue(0);
  formRegistro.get("tipo_servicio")!.setValue(0);    
  formRegistro.get("fecha_regreso")!.setValue(today);
  formRegistro.get("fecha_salida")!.setValue(today);
  formRegistro.get('destino')!.setValue('');
  formRegistro.get("hora_salida")!.setValue(`${horaActual}:00`);
  formRegistro.get("hora_regreso")!.setValue(`${horaSalida}:00`);
  const $datepickerEl = document.getElementById('fecha_regreso');
  const $datepickerEl2 = document.getElementById('fecha_salida');


  const options: DatepickerOptions = {
    format: 'dd-mm-yyyy',
  };
  const datepicker1: Datepicker = new Datepicker($datepickerEl, options);
  const datepicker2: Datepicker = new Datepicker($datepickerEl2, options);
  datepicker1.init();
  datepicker2.init();
  datepicker1.setDate(today);
  datepicker2.setDate(today);
  translateCalendar();
  
}