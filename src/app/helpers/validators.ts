import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

 export const diferenteDeCeroValidator =(): ValidatorFn=> {
    return (control: AbstractControl): ValidationErrors | null => {      
      return `${control.value}` !== '0' ? null : { diferenteDeCero: true };
    };
  }

  
  export const kilometrajeValidator=(): ValidatorFn=> {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const group = formGroup as FormGroup;
      const kilometrajeInicial = group.get('kilometraje_inicial')?.value;
      const kilometrajeFinal = group.get('kilometraje_final')?.value;
      if (group.get('kilometraje_inicial')?.disabled && group.get('kilometraje_final')?.disabled) {        
        return null;
      }
      if (group.get('kilometraje_inicial')?.disabled && kilometrajeInicial> 0   && kilometrajeFinal === 0) {
        return { kilometrajeInicialRequerido: true,mensaje:"El kilometraje final es requerido" };
      }
      if ( kilometrajeInicial=== 0   && kilometrajeFinal === 0) {
        return { kilometrajeInicialRequerido: true,mensaje:"El kilometraje inicial y final son requeridos" };
      }
            
      if (kilometrajeInicial == kilometrajeFinal ) {
        return { kilometrajeIgual: true,mensaje:"El kilometraje inicial y final no pueden ser iguales" };
      }
            
      return kilometrajeFinal > kilometrajeInicial ? null : { kilometrajeInvalido: true ,mensaje:"El kilometraje final debe ser mayor al inicial"};
    };
  }