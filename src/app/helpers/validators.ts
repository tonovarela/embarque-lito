import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


// export const diferenteDeCeroValidator = (): ValidatorFn => {
//   return (control: AbstractControl): ValidationErrors | null => {
    
//     return `${control.value}` !== '0' ? null : { diferenteDeCero: true };
//   };
// }

export const MayorACeroValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {    
    const valor:string = `${control.value}`.replace(/\,/g, '').replace(/\$/g, '')        
    return Number(valor) > 0 ? null : { MayorACero: true,mensaje:"El valor debe ser mayor a cero"};
  };
}


export const kilometrajeValidator = (): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const group = formGroup as FormGroup;
    const kilometrajeInicial = group.get('kilometraje_inicial')?.value;
    const kilometrajeFinal = group.get('kilometraje_final')?.value;
    if (group.get('kilometraje_inicial')?.disabled && group.get('kilometraje_final')?.disabled) {
      return null;
    }
    if (group.get('kilometraje_inicial')?.disabled && kilometrajeInicial > 0 && kilometrajeFinal === 0) {
      return { kilometrajeInicialRequerido: true, mensaje: "El kilometraje final es requerido" };
    }
    if (kilometrajeInicial === 0 && kilometrajeFinal === 0) {
      return { kilometrajeInicialRequerido: true, mensaje: "El kilometraje inicial y final son requeridos" };
    }

    if (kilometrajeInicial == kilometrajeFinal) {
      return { kilometrajeIgual: true, mensaje: "El kilometraje inicial y final no pueden ser iguales" };
    }

    return kilometrajeFinal > kilometrajeInicial ? null : { kilometrajeInvalido: true, mensaje: "El kilometraje final debe ser mayor al inicial" };
  };
}





// export const NumberValidator = (): ValidatorFn => {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const value = control.value;
//     if (value === null || value === undefined || value === '') {
//       return null;
//     }
//     const valor =value.replace(/\,/g, '').replace(/\$/g, '');  
//     if (Number(valor)>0) {
//       return { number: true };
//     }
//     return null;
//   }
// }


export class NumberFormatter {
  constructor(private value: string, private prefix: string) {
  }

  public getFormat(decimals: number) {
    this.value = this.value.replace(/\,/g, '');
    if (this.prefix !== "") {
      this.value = this.value.replace(new RegExp(`\\${this.prefix}`, 'g'), '');
    }
    //Valida que solo se ingrese un punto    
    const pointCount = (this.value.match(/\./g) || []).length;

    if (pointCount > 1) {
      return this.format(this.value.slice(0, this.value.length - 1));
    }
    //Valida que solo se ingrese dos decimales
    const parts = this.value.split('.');
    if (parts.length > 1 && parts[1].length > decimals) {
      return this.format(this.value.slice(0, -1));
    }
    return this.format(this.value);

  }


  private format(number: string) {
    const parts = number.split('.');
    parts[0] = parts[0].replace(/^0+(?!$)/, ''); //Elimina ceros a la izquierda
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");//Agrega comas        
    const value = parts.join('.');
    if (value === '.') {
      return `${this.prefix}0.`;
    }
    return value.length > 0 ? `${this.prefix}${value}` : '';


  }



}