import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MayorACeroValidator } from "@app/helpers/validators";
import { Datepicker } from 'flowbite';
import type { DatepickerOptions } from "flowbite";

declare var translateCalendar: any;

export const createFormMantenimientoBuilder = (fb: FormBuilder) => {
    const today = new Date();
    return fb.group({
        transporte: [0, MayorACeroValidator()],
        chofer: [0, MayorACeroValidator()],
        fecha_inicio: [today, Validators.required],
        fecha_fin: [today, Validators.required],
        hora_inicio: ['00:00'],
        hora_fin: ['00:00'],
        motivo: [0, MayorACeroValidator()],
        observaciones: [''],
    });

}


export const resetFormMantenimiento = (formRegistro: FormGroup) => {

    const today = new Date();
    const horaActual = today.toTimeString().substring(0, 2);
    const horaFin = new Date(today.getTime() + 60 * 60 * 1000).toTimeString().substring(0, 2);
    formRegistro.reset();
    formRegistro.get("transporte")!.setValue(0);
    formRegistro.get("observaciones")!.setValue('');
    formRegistro.get("chofer")!.setValue("0");
    formRegistro.get("motivo")!.setValue("0");
    formRegistro.get("hora_inicio")!.setValue(`${horaActual}:00`);
    formRegistro.get("hora_fin")!.setValue(`${horaFin}:00`);
    formRegistro.get("fecha_inicio")!.setValue(today);
    formRegistro.get("fecha_fin")!.setValue(today);
  
    const options: DatepickerOptions = {
      format: 'dd-mm-yyyy',
    };
  
  
    const $datepickerEl = document.getElementById('fecha_inicio');
    const $datepickerEl2 = document.getElementById('fecha_fin');
    const datepicker1: Datepicker = new Datepicker($datepickerEl, options);
    const datepicker2: Datepicker = new Datepicker($datepickerEl2, options);
    datepicker1.init();
    datepicker2.init();
    datepicker1.setDate(today);
    datepicker2.setDate(today);
    translateCalendar();
  
  
  }