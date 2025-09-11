import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroRecorridoHook } from '@app/componentes/hooks/useRegistro';
import { createFormRetornoBuilder, resetFormRetorno } from '@app/helpers/formModel';
import { Motivo } from '@app/interface/responses';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { UiService } from '@app/services';
import { RetornoService } from '@app/services/retorno.service';
import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [AutocompleteComponent, PrimeNgModule, ReactiveFormsModule,ReactiveFormsModule,CommonModule],
   providers: [RegistroRecorridoHook],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NuevaComponent implements OnInit  {

  router = inject(Router);
  fb = inject(FormBuilder);
  uiService = inject(UiService);
  motivos = signal<Motivo[]>([]);
  retornoService  = inject(RetornoService);
  recorridoRegistroHook = inject(RegistroRecorridoHook);
  formRegistro: FormGroup = createFormRetornoBuilder(this.fb);  
  private _guardandoCarga = signal(false);

  ngOnInit() {
    this.cargarMotivos();
  }

  private cargarMotivos() {
    
    this.retornoService.listarMotivos().subscribe(response => this.motivos.set(response.motivos.map(({id_motivo,descripcion}) => ({ id_motivo, descripcion: descripcion.toUpperCase() }))));
  }

  onSelectOP(op_metrics: string) {    
    this.recorridoRegistroHook.onSelectOP(op_metrics, this.formRegistro);   
  }

  regresar() {
    this.router.navigate(['/logistica/retornos']);
  }

  async guardarRegistro() {   
    if (this.formRegistro.valid) {
      this._guardandoCarga.set(true);
      this.formRegistro.disable();
      try {
                                
        let formData =new FormData();
        formData.append('id_motivo', this.formRegistro.get('id_motivo')?.value);
        formData.append('fecha_rechazo', this.formRegistro.get('fecha_rechazo')?.value);
        formData.append('tipo', this.formRegistro.get('tipo')?.value);
        formData.append('ops', this.formRegistro.get('ops')?.value);
        formData.append('cantidad', this.formRegistro.get('cantidad')?.value);
        formData.append('observaciones', this.formRegistro.get('observaciones')?.value);
        
        const adjuntosArray = this.formRegistro.get('adjuntos') as FormArray;
        adjuntosArray.value.forEach((file: File, index: number) => {
           formData.append(`adjuntos[]`, file, file.name);
         });
         if (adjuntosArray.length === 0) {
           formData.append('adjuntos', '');
         }         
        await firstValueFrom(this.retornoService.registrar(formData));        
        this.formRegistro.enable();
        resetFormRetorno(this.formRegistro);                    
        this.uiService.mostrarAlertaSuccess('','Retorno registrado con éxito');
        
      } catch (error) {
        console.error('Error al guardar retorno:', error);        
      } finally {
        this._guardandoCarga.set(false);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onRemoverOP(op_metrics: string) {
    this.recorridoRegistroHook.onRemoverOP(op_metrics, this.formRegistro);
  }

  /**
   * Maneja la selección de archivos para adjuntos
   */
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const adjuntosArray = this.formRegistro.get('adjuntos') as FormArray;
      
      // Convertir FileList a Array y agregar cada archivo
      Array.from(input.files).forEach(file => {
        adjuntosArray.push(this.fb.control(file));
      });
    }
  }

  /**
   * Remueve un archivo de los adjuntos
   */
  removeFile(archivo: File) {
    const adjuntosArray = this.formRegistro.get('adjuntos') as FormArray;
    const index = adjuntosArray.value.findIndex((file: File) => file === archivo);
    
    if (index >= 0) {
      adjuntosArray.removeAt(index);
    }
  }

  /**
   * Getter para el estado de carga
   */
  guardandoCarga() {
    return this._guardandoCarga();
  }

  // /**
  //  * Marca todos los campos del formulario como touched para mostrar errores
  //  */
  private markFormGroupTouched() {
    Object.keys(this.formRegistro.controls).forEach(key => {
      const control = this.formRegistro.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          arrayControl.markAsTouched();
        });
      }
    });
  }

  

  /**
   * Verifica si un campo tiene errores
   */
  tieneError(fieldName: string): boolean {
    return this.recorridoRegistroHook.tieneError(fieldName, this.formRegistro);
    
  }


  onKeyDown(event: KeyboardEvent): void {
    // Permitir: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
        // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        // Permitir: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }
    // Asegurar que sea un número (0-9)
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }
  
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text');
    
    if (pastedText && !/^\d+$/.test(pastedText)) {
      event.preventDefault();
    }
  }
}
