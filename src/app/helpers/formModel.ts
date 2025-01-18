import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FechaMinimaCargaValidator, FechaMinimaSalidaValidator, KilometrajeValidator, MayorACeroValidator } from "./validators";
import { Datepicker } from 'flowbite';
import type { DatepickerOptions } from "flowbite";




declare var translateCalendar: any;


export const createFormRegistroInternoBuilder = (fb: FormBuilder) => {
  const today = new Date();
  return fb.group({
    transporte: [0, MayorACeroValidator()],
    chofer: [0, MayorACeroValidator()],
    tipo_servicio: [0, MayorACeroValidator()],
    factura: ['', Validators.required],
    importe_factura: [{ value: '' }, [Validators.required, MayorACeroValidator()]],
    remisiones:fb.array([], Validators.required),
    
    id_previo: [null],
    kilometraje_inicial: [{ value: 0, disabled: true }, MayorACeroValidator()],
    kilometraje_final: [{ value: 0, disabled: true }, MayorACeroValidator()],
    destino: [{ value: '' }, Validators.required],
    ops: fb.array([''], Validators.required),
    hora_salida: ['00:00'],
    hora_regreso: ['00:00'],
    fecha_salida: [today],
    fecha_regreso: [today],
    fecha_minima_salida: [{ value: null }],
    observaciones: [''],
  }, { validators: [KilometrajeValidator(), FechaMinimaSalidaValidator()] });
}


export const createFormRegistroExternoBuilder = (fb: FormBuilder) => {
  return fb.group({
    ops: fb.array([], Validators.required),
    chofer: [0, MayorACeroValidator()],
    id_previo: [null],
    transporte: [0, MayorACeroValidator()],
    observaciones: [''],
    tipo_servicio: [0, MayorACeroValidator()],
    destino: ['', Validators.required],
    fecha_salida: [new Date(), Validators.required],
  });
}


export const createFormRegistroCargaBuilder = (fb: FormBuilder) => {
  return fb.group({
    transporte: [0, MayorACeroValidator()],
    totalLitros: [{ value: '' }, [Validators.required, MayorACeroValidator()]],
    id_previo: [null],
    importeCarga: [{ value: '' }, [Validators.required, MayorACeroValidator()]],
    observaciones: [''],
    kilometraje_inicial: [{ value: 0, disabled: true }, MayorACeroValidator()],
    kilometraje_final: [{ value: 0, disabled: true }, MayorACeroValidator()],
    fecha_carga: ['', Validators.required],
    fecha_minima_carga: [{ value: null }],
  }, { validators: [KilometrajeValidator(),FechaMinimaCargaValidator()] });
}


const actualizarInputPorID = (id: string, valor: string) => {
  const input = document.getElementById(id) as HTMLInputElement;
  if (input) {
    input.value = valor;
  }

}


export const resetFormCarga = (formRegistro: FormGroup) => {
  const today = new Date();  
  formRegistro.reset();
  formRegistro.get("transporte")!.setValue(0);
  
  formRegistro.get("id_previo")!.setValue(null);
  formRegistro.get("kilometraje_inicial")!.setValue(0);
  formRegistro.get("kilometraje_final")!.setValue(0);
  
  formRegistro.get("kilometraje_inicial")!.disable();
  formRegistro.get("kilometraje_final")!.disable();
  
  const $datepickerEl = document.getElementById('fecha_carga');
  const options: DatepickerOptions = { format: 'dd-mm-yyyy', };
  const datepicker1 = new Datepicker($datepickerEl, options);
  actualizarInputPorID("totalLitros", "");
  actualizarInputPorID("importeCarga", "");

  datepicker1.init();
  datepicker1.setDate(today);
  formRegistro.get("fecha_carga")!.setValue(today);
  translateCalendar();


}

export const resetFormRecorridoExterno = (formRegistro: FormGroup) => {
  const today = new Date();

  formRegistro.reset();
  formRegistro.get("transporte")!.setValue("0");
  formRegistro.get("chofer")!.setValue("0");  
  formRegistro.setControl("ops", new FormArray([], Validators.required));
  formRegistro.get('destino')!.setValue('');
  formRegistro.get("tipo_servicio")!.setValue(0);
  formRegistro.get("fecha_salida")!.setValue(today);
  const $datepickerEl = document.getElementById('fecha_salidaExt');
  
  const options: DatepickerOptions = { format: 'dd-mm-yyyy', };
  const datepicker1 = new Datepicker($datepickerEl, options);
  datepicker1.init();    
    datepicker1.setDate(today);    
    translateCalendar();  
  
}

export const resetFormRecorridoInterno = (formRegistro: FormGroup) => {
  const today = new Date();
  const horaActual = today.toTimeString().substring(0, 2);
  const horaSalida = new Date(today.getTime() + 60 * 60 * 1000).toTimeString().substring(0, 2);
  formRegistro.reset();
  formRegistro.get("transporte")!.setValue("0");
  formRegistro.setControl("ops", new FormArray([], Validators.required));
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
  const options: DatepickerOptions = {
    format: 'dd-mm-yyyy',
  };
  
const $datepickerEl = document.getElementById('fecha_regreso');
const $datepickerEl2 = document.getElementById('fecha_salida');
  const datepicker1: Datepicker = new Datepicker($datepickerEl, options);
  const datepicker2: Datepicker = new Datepicker($datepickerEl2, options);
  
 
  datepicker1.init();
  datepicker2.init();
  datepicker1.setDate(today);
  datepicker2.setDate(today);
  translateCalendar();
  
  

}

export const setFechaSalida = (formRegistro: FormGroup, fecha: Date | null) => {
  const $datepickerEl2 = document.getElementById('fecha_salida');  
    const options: DatepickerOptions = {
        format: 'dd-mm-yyyy',
      };      
    const datepicker2: Datepicker = new Datepicker($datepickerEl2, options);
    const newDate= fecha || new Date();
    datepicker2.setDate(newDate);
  formRegistro.get("fecha_salida")!.setValue(newDate || new Date());
  formRegistro.get("hora_salida")!.setValue(newDate?.toTimeString().substring(0, 5) ?? '00:00');
  translateCalendar();
  
}

export const setFechaCarga = (formRegistro: FormGroup, fecha: Date | null) => {
  const $datepickerEl = document.getElementById('fecha_carga');
  const options: DatepickerOptions = { format: 'dd-mm-yyyy', };
  const newDate= fecha || new Date();
  const datepicker1 = new Datepicker($datepickerEl, options);
  datepicker1.setDate(newDate);
  formRegistro.get("fecha_carga")!.setValue(newDate);
  translateCalendar();

}


