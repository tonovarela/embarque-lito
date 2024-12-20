import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { diferenteDeCeroValidator, kilometrajeValidator } from "./validators";
import { Datepicker } from "flowbite";




export const createFormRegistroInternoBuilder = (fb: FormBuilder) => {
  const today = new Date();
  return fb.group({
    transporte: [0, diferenteDeCeroValidator()],
    chofer: [0, diferenteDeCeroValidator()],
    kilometraje_inicial: [{ value: 0, disabled: true }, diferenteDeCeroValidator()],
    kilometraje_final: [{ value: 0, disabled: true }, diferenteDeCeroValidator()],
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
    chofer: [0, diferenteDeCeroValidator()],
    transporte: [0, diferenteDeCeroValidator()],
    observaciones: [''],
    destino: [''],
    fecha_registro: [new Date(), Validators.required],
  });
}


// export const createFormRegistro = () => {
//   const today = new Date();
//   return new FormGroup({
//     transporte: new FormControl(0, diferenteDeCeroValidator()),
//     chofer: new FormControl(0, diferenteDeCeroValidator()),
//     kilometraje_inicial: new FormControl({ value: 0, disabled: true }, diferenteDeCeroValidator()),
//     kilometraje_final: new FormControl({ value: 0, disabled: true }, diferenteDeCeroValidator()),
//     destino: new FormControl(''),
//     ops: new FormArray([],Validators.required),
//     hora_salida: new FormControl('00:00'),
//     hora_regreso: new FormControl('00:00'),
//     fecha_salida: new FormControl(today),
//     fecha_regreso: new FormControl(today),
//     observaciones: new FormControl(''),
//   }, { validators: kilometrajeValidator() });

// }




export const resetFormRegistroExterno = (formRegistro: FormGroup) => {
  const today = new Date();
  formRegistro.reset();
  formRegistro.get("transporte")!.setValue("0");
  formRegistro.get("chofer")!.setValue("0");
  formRegistro.get("ops")!.setValue([]);
  formRegistro.get('destino')!.setValue('');
  formRegistro.get("fecha_registro")!.setValue(today);
  const $datepickerEl = document.getElementById('fecha_registro');
  const datepicker1 = new Datepicker($datepickerEl, { format: 'dd-mm-yyyy', }, {});
  setTimeout(() => {
    datepicker1.setDate(today);    
  }, 500);

}

export const resetFormRegistroInterno = (formRegistro: FormGroup) => {
  const today = new Date();

  const horaActual = today.toTimeString().substring(0, 2);
  const horaSalida = new Date(today.getTime() + 60 * 60 * 1000).toTimeString().substring(0, 2);
  formRegistro.reset();
  formRegistro.get("transporte")!.setValue("0");
  formRegistro.get("ops")!.setValue([]);
  formRegistro.get("chofer")!.setValue("0");
  formRegistro.get("kilometraje_inicial")!.setValue(0);
  formRegistro.get("kilometraje_final")!.setValue(0);
  formRegistro.get("fecha_regreso")!.setValue(today);
  formRegistro.get("fecha_salida")!.setValue(today);
  formRegistro.get('destino')!.setValue('');
  formRegistro.get("hora_salida")!.setValue(`${horaActual}:00`);
  formRegistro.get("hora_regreso")!.setValue(`${horaSalida}:00`);
  const $datepickerEl = document.getElementById('fecha_regreso');
  const $datepickerEl2 = document.getElementById('fecha_salida');
  const datepicker1 = new Datepicker($datepickerEl, { format: 'dd-mm-yyyy', }, {});
  const datepicker2 = new Datepicker($datepickerEl2, { format: 'dd-mm-yyyy' }, {});
  setTimeout(() => {
    datepicker1.setDate(today);
    datepicker2.setDate(today);
  }, 500);

}