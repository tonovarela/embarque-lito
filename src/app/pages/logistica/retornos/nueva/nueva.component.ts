import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroRecorridoHook } from '@app/componentes/hooks/useRegistro';
import { createFormRetornoBuilder } from '@app/helpers/formModel';
import { Motivo } from '@app/interface/responses';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { RetornoService } from '@app/services/retorno.service';
import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';

@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [AutocompleteComponent, PrimeNgModule, ReactiveFormsModule,ReactiveFormsModule],
   providers: [RegistroRecorridoHook],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NuevaComponent implements OnInit  {
  router = inject(Router);
  fb = inject(FormBuilder);
  motivos = signal<Motivo[]>([]);

  retornoService  = inject(RetornoService);

  ngOnInit() {
    this.cargarMotivos();
  }

  private cargarMotivos() {
    this.retornoService.listarMotivos().subscribe(response => {
      this.motivos.set(response.motivos);
       
    });
  }




  recorridoRegistroHook = inject(RegistroRecorridoHook);
  formRegistro: FormGroup = createFormRetornoBuilder(this.fb);
  
  // Signal para controlar el estado de carga
  private _guardandoCarga = signal(false);

  onSelectOP(op_metrics: string) {    
    this.recorridoRegistroHook.onSelectOP(op_metrics, this.formRegistro);   
  }
  
  regresar() {
    this.router.navigate(['/logistica/retornos']);
  }

  async guardarRegistro() {
    if (this.formRegistro.valid) {
      this._guardandoCarga.set(true);
      
      try {
        const formData = this.formRegistro.value;
        console.log('Datos del retorno:', formData);
        
        // TODO: Implementar el servicio para guardar el retorno
        // await this.retornoService.crearRetorno(formData);
        
        // Simular llamada async
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Redirigir después del guardado exitoso
        this.router.navigate(['/logistica/retornos']);
        
      } catch (error) {
        console.error('Error al guardar retorno:', error);
        // TODO: Mostrar mensaje de error al usuario
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

  /**
   * Marca todos los campos del formulario como touched para mostrar errores
   */
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
   * Getter para obtener errores de validación de un campo específico
   */
  getFieldError(fieldName: string): string | null {
    const field = this.formRegistro.get(fieldName);
    
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['mayorACero']) {
        return 'El valor debe ser mayor a cero';
      }
    }
    
    return null;
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.formRegistro.get(fieldName);
    return !!(field && field.errors && field.touched);
  }
}
