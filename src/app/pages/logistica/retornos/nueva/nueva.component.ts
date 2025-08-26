import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroRecorridoHook } from '@app/componentes/hooks/useRegistro';
import { createFormRetornoBuilder } from '@app/helpers/formModel';
import { PrimeNgModule } from '@app/lib/primeng.module';
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
export default class NuevaComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  recorridoRegistroHook = inject(RegistroRecorridoHook);
  formRegistro: FormGroup = createFormRetornoBuilder(this.fb);

  onSelectOP(op_metrics: string) {    
    this.recorridoRegistroHook.onSelectOP(op_metrics, this.formRegistro);   
  }
  
  regresar() {
    this.router.navigate(['/logistica/retornos']);
  }


  async guardarRegistro() {
    
  }

  onRemoverOP(op_metrics: string) {
    this.recorridoRegistroHook.onRemoverOP(op_metrics, this.formRegistro);
  }

  // guardandoCarga() {
  //   return this.recorridoRegistroHook.guardandoCarga;
  // }
}
