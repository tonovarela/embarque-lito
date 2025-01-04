import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule } from '@angular/forms';
import { Transportes } from '@app/data';
import { createFormRegistroCargaBuilder, resetFormRegistroCarga } from '@app/helpers/formModel';
import { NumberFormatter } from '@app/helpers/validators';
import { Transporte } from '@app/interface';
import { GaugeComponent, MinusComponent, PlusComponent } from '@app/shared/svg';
import { CalendarComponent } from '@app/shared/svg/calendar/calendar.component';



@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [CalendarComponent, PlusComponent, MinusComponent, GaugeComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css',

})
export class NuevoComponent implements OnInit {

  constructor(private _change: ChangeDetectorRef) { }

  transportes: Transporte[] = [];
  fb= inject(FormBuilder);

  formRegistro:FormGroup =createFormRegistroCargaBuilder(this.fb);

  ngOnInit() {
    resetFormRegistroCarga(this.formRegistro);
    this.transportes = Transportes;    
  }


  incrementar(valor: number, nombre: string) {
    const valorActual = this.formRegistro.get(nombre)!.value;
    const nuevoValor = (+valorActual + valor) || 0;
    if (nuevoValor < 0) {
      return;
    }
    this.formRegistro.get(nombre)!.setValue(nuevoValor);
  }

  tieneError(controlName: string): boolean {
    const control = this.formRegistro.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }

  public  actualizarKilometrajeInicial() {  
    const id_transporte = this.formRegistro.get('transporte')!.value; 
    console.log(id_transporte); 
    if (id_transporte == "0") {
      this.formRegistro.get('kilometraje_inicial')!.setValue(0);
      this.formRegistro.get('kilometraje_inicial')!.disable();
      this.formRegistro.get('kilometraje_final')!.setValue(0);
      this.formRegistro.get('kilometraje_final')!.disable();
      return;
    }
    //TODO: obtener el kilometraje inicial del transporte seleccionado por api y si tiene kilometraje final setearlo como inicial y deshabilitar el campo en caso contrario habilitar los 2 campos    
    this.formRegistro.get('kilometraje_inicial')?.disable();
    this.formRegistro.get('kilometraje_inicial')!.setValue(50);
    this.formRegistro.get('kilometraje_final')!.enable();
    this.formRegistro.get('kilometraje_final')!.setValue(0);
  }

  actualizarFecha({ detail }: any, nombre: string) {
    const fecha = detail.date;
    this.formRegistro.get(nombre)!.setValue(fecha);
  }

  public onValidateNumber(event: KeyboardEvent) {
    const charCode = event.charCode;    
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9.]$/)) {
      event.preventDefault();
    }
  }
  public onInput(event: any, prefix:string,field:string) {
    const target = event.target as HTMLInputElement;    
    let value = target.value;
    const newValue=new NumberFormatter(value, prefix).getFormat(2);    
    target.value = newValue;
    this.formRegistro.get(field)!.setValue(newValue);
    
  }


  registro(){
    this.formRegistro.markAllAsTouched(); 
    console.log(this.formRegistro.valid);
    console.log(this.formRegistro.value);
  }

}
