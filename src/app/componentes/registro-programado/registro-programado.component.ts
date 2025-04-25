import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  resetFormRecorridoProgramado } from '@app/helpers/formModel';
import {  onInputNumberValidate, onFocusNumberValidate } from '@app/helpers/helpers';
import { NumberFormatter } from '@app/helpers/validators';

import { RecorridoService, ChoferService, TransporteService } from '@app/services';

import { RegistroRecorridoHook } from '../hooks/useRegistro';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';
import { MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent } from '@app/shared/svg';

@Component({
  selector: 'registro-programado',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule, CommonModule, FormsModule, MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent, AutocompleteComponent],
  providers: [RegistroRecorridoHook],
  templateUrl: './registro-programado.component.html',
  styleUrl: './registro-programado.component.css',  
})
export class RegistroProgramadoComponent implements OnInit, AfterViewInit {

   @Input() formGroup!: FormGroup;
    
    recorridoService = inject(RecorridoService);
    choferService = inject(ChoferService);
    transporteService = inject(TransporteService);
    recorridoRegistroHook = inject(RegistroRecorridoHook);  
    formRegistro!: FormGroup;
  
  
    transportes = computed(() => this.transporteService.transportes().internos);
    choferes = computed(() => this.choferService.choferes().internos);
    tipoServicios = computed(() => this.transporteService.transportes().tipoServicios);
    
  
    ngOnInit(): void {
      this.formRegistro = this.formGroup.get('registroProgramado') as FormGroup;
    }


    onChangeRetorno(event: any) {
      const valor = event.target.checked;
      if (valor){
        this.formRegistro.get("remisiones")?.disable();
        this.formRegistro.get("ops")?.disable();
        this.formRegistro.get("tipo_servicio")?.disable();
        this.formRegistro.get("destino")?.disable();
      }else{
        this.formRegistro.get("remisiones")?.enable();
        this.formRegistro.get("ops")?.enable();
        this.formRegistro.get("tipo_servicio")?.enable();
        this.formRegistro.get("destino")?.enable();
      }
      
    }

    estaHabilitado(controlName: string): boolean {  
      return this.recorridoRegistroHook.estaHabilitado(controlName, this.formRegistro);
    }
  
    ngAfterViewInit(): void {
      this.resetForm();    
    }
  
    resetForm() {
      resetFormRecorridoProgramado(this.formRegistro);
  
  
    }
  
    onInputNumber(event: any, field: string) {
      onInputNumberValidate(event, field, this.formRegistro);
    }
  
    onFocusNumber(event: any, field: string) {
      onFocusNumberValidate(event, field, this.formRegistro);
    }
  
    onSelectOP(op: string) {
      this.recorridoRegistroHook.onSelectOP(op, this.formRegistro);
    }
  
  
    onRemoverOP(op: string) {
      this.recorridoRegistroHook.onRemoverOP(op, this.formRegistro);
    }
  
    onAddRemision({ value: remision }: any) {
      this.recorridoRegistroHook.onAddRemision({ value: remision }, this.formRegistro);
    }
    onRemoveRemision({ value: remision }: any) {
      this.recorridoRegistroHook.onRemoveRemision({ value: remision }, this.formRegistro);
    }
  
    public onBlurRemision(event: any) {
      this.recorridoRegistroHook.onBlurRemision(event, this.formRegistro);
    }
  
  
    public get remisionesArray(): FormArray {
      return this.recorridoRegistroHook.remisionesArray(this.formRegistro);
    }
  
    tieneError(controlName: string): boolean {      
      return this.recorridoRegistroHook.tieneError(controlName, this.formRegistro);
    }
  
  
  
    incrementar(valor: number, nombre: string) {
      const valorActual = this.formRegistro.get(nombre)!.value;
      const nuevoValor = (+valorActual + valor) || 0;
      if (nuevoValor < 0) {
        return;
      }
      this.formRegistro.get(nombre)!.setValue(nuevoValor);
    }
  
  

  
    OnKeyPress(event: KeyboardEvent) {
      event.preventDefault();
    }
    
  
    public onValidateNumber(event: KeyboardEvent) {
      const charCode = event.charCode;
      const charStr = String.fromCharCode(charCode);
      if (!charStr.match(/^[0-9.]$/)) {
        event.preventDefault();
      }
    }
  
  
  
  
  
  
    public onInput(event: any, prefix: string, field: string) {
      const target = event.target as HTMLInputElement;
      let value = target.value;
      const newValue = new NumberFormatter(value, prefix).getFormat(2);
      target.value = newValue;
      this.formRegistro.get(field)!.setValue(newValue);
    }
  

 }
