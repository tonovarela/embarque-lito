import { inject, Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";


@Injectable()
export class RegistroRecorridoHook {

    fb= inject(FormBuilder);
    
    onSelectOP(op: string, formRegistro: FormGroup) {
        const opsCurrent = formRegistro.get('ops')!.value;
        const opExiste = opsCurrent.find((opActual: string) => opActual === op);
        if (opExiste) {
            return;
        }
        this.opsArray(formRegistro).push(this.fb.control(op));
    }
    onRemoverOP(op: string, formRegistro: FormGroup) {
        const opsCurrent = formRegistro.get('ops')!.value;
        const index = opsCurrent.findIndex((opActual: string) => opActual === op);
        this.opsArray(formRegistro).removeAt(index);
    }

    onAddRemision({ value: remision }: any, formRegistro: FormGroup) {
        const remisiones = formRegistro.get('remisiones')?.value;
        const remisionExiste = remisiones.find((remisionActual: string) => remisionActual === remision);
        if (remisionExiste) {
            return;
        }
        this.remisionesArray(formRegistro).push(this.fb.control(remision));
    }
    onRemoveRemision({ value: remision }: any, formRegistro: FormGroup) {
        const remisionesCurrent = formRegistro.get('remisiones')!.value;
        const index = remisionesCurrent.findIndex((remisionActual: string) => remisionActual === remision);
        this.remisionesArray(formRegistro).removeAt(index);
    }

    onBlurRemision(event: any, formRegistro: FormGroup) {
        if (event.target.value.trim() == '') {
            event.target.value = '';
            return;
        }
        this.onAddRemision({ value: event.target.value }, formRegistro);
        event.target.value = "";

    }

    opsArray(formRegistro: FormGroup): FormArray {
        return formRegistro.get('ops') as FormArray;
    }
    remisionesArray(formRegistro: FormGroup): FormArray {
        return formRegistro.get('remisiones') as FormArray;
    }

    tieneError(controlName: string, formRegistro: FormGroup): boolean {
        const control = formRegistro.get(controlName);
        if (control && control.errors && (control.dirty || control.touched)) {
            return true;
        }
        return false;
    }

    estaHabilitado(controlName: string, formRegistro: FormGroup): boolean {
        const control = formRegistro.get(controlName);
        if (control) {
            return !control.disabled;
        }
        return false;
    }

}


