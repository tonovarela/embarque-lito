import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { resetFormRecorridoInterno, setFechaSalida } from '@app/helpers/formModel';
import { DiferenciaTiempo } from '@app/interface/models';
import { PrimeNgModule } from '@app/lib/primeng.module';

import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';
import { obtenerColorTransporte, onFocusNumberValidate, onInputNumberValidate, unirFechaHora } from '@app/helpers/helpers';
import { ChoferService } from '@app/services/chofer.service';
import { TransporteService } from '@app/services/transporte.service';

import { MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent } from '@app/shared/svg';
import { RecorridoService } from '@app/services/recorrido.service';
import { firstValueFrom } from 'rxjs';
import { NumberFormatter } from '@app/helpers/validators';
import { RegistroRecorridoHook } from '../hooks/useRegistro';





@Component({
  selector: 'registro-interno',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule, CommonModule, FormsModule, MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent, AutocompleteComponent],
  providers: [RegistroRecorridoHook],
  templateUrl: './registro-interno.component.html',
  styleUrl: './registro-interno.component.css',

})
export class RegistroInternoComponent implements OnInit, AfterViewInit {

  @Input() formGroup!: FormGroup;




  recorridoService = inject(RecorridoService);
  choferService = inject(ChoferService);
  transporteService = inject(TransporteService);
  recorridoRegistroHook = inject(RegistroRecorridoHook);

  formRegistro!: FormGroup;
  fechaSalida: string = '';
  today = new Date();
  fechaMinimaSalida: Date | null = null;
  diferenciaTiempo: DiferenciaTiempo = { horas: 0, minutos: 0, totalMinutos: 1 };

  transportes = computed(() => this.transporteService.transportes().internos);
  choferes = computed(() => this.choferService.choferes().internos);
  tipoServicios = computed(() => this.transporteService.transportes().tipoServicios);



  ngOnInit(): void {
    this.formRegistro = this.formGroup.get('registroInterno') as FormGroup;
  }


  ngAfterViewInit(): void {
    this.resetForm();
    this.formRegistro.valueChanges.subscribe((form) => {
      const { hora_regreso, hora_salida, fecha_salida, fecha_regreso } = form;
      const fecha_salidaTime = unirFechaHora(fecha_salida, hora_salida);
      const fecha_regresoTime = unirFechaHora(fecha_regreso, hora_regreso);
      this.diferenciaTiempo = this.obtenerDiferenciaHoras(fecha_salidaTime, fecha_regresoTime);
    });
  }

  resetForm() {
    resetFormRecorridoInterno(this.formRegistro);


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




  public actualizarTransporte() {
    const id_chofer = this.formRegistro.get('chofer')!.value;
    const choferAsignado = this.choferes().find(chofer => chofer.id === id_chofer);
    this.formRegistro.get('transporte')!.setValue(choferAsignado?.id_transporteAsignado ?? 0);
    this.actualizarKilometrajeInicial();
  }

  public async actualizarKilometrajeInicial() {

    const id_transporte = this.formRegistro.get('transporte')!.value;
    if (id_transporte == "0") {
      this.formRegistro.get('kilometraje_inicial')!.setValue(0);
      this.formRegistro.get('kilometraje_inicial')!.disable();
      this.formRegistro.get('kilometraje_final')!.setValue(0);
      this.formRegistro.get('id_previo')!.setValue(null);
      this.formRegistro.get('kilometraje_final')!.disable();
      this.formRegistro.get('fecha_minima_salida')!.setValue(null);
      setFechaSalida(this.formRegistro, null);
      return;
    }

    const responseRecorrido = await firstValueFrom(this.recorridoService.ultimo(id_transporte));
    const ultimoRecorrido = responseRecorrido.recorrido;

    if (ultimoRecorrido == null) {
      this.formRegistro.get('kilometraje_inicial')!.enable();
      this.formRegistro.get('kilometraje_final')!.enable();
      this.formRegistro.get('id_previo')!.setValue(null);
      this.formRegistro.get('fecha_minima_salida')!.setValue(null);
      this.formRegistro.get('kilometraje_inicial')!.setValue(0);
      this.formRegistro.get('kilometraje_final')!.setValue(0);
      setFechaSalida(this.formRegistro, null);
      return;
    }


    const { kilometraje_final, id_recorrido } = ultimoRecorrido;
    this.fechaMinimaSalida = ultimoRecorrido.fecha_regreso ?? null;
    this.formRegistro.get('fecha_minima_salida')!.setValue(this.fechaMinimaSalida);
    this.formRegistro.get('kilometraje_inicial')!.disable();
    this.formRegistro.get('id_previo')!.setValue(id_recorrido);
    this.formRegistro.get('kilometraje_inicial')!.setValue(kilometraje_final);
    this.formRegistro.get('kilometraje_final')!.enable();
    this.formRegistro.get('kilometraje_final')!.setValue(0);
    setFechaSalida(this.formRegistro, this.fechaMinimaSalida);
  }



 



  actualizarFecha({ detail }: any, nombre: string) {
    const fecha = detail.date;
    this.formRegistro.get(nombre)!.setValue(fecha);
  }

  obtenerDiferenciaHoras(fechaInicio: Date, fechaFin: Date) {
    const diferenciaMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
    const diferenciaHoras = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60)) || 0;
    const diferenciaMinutos = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60)) || 0;
    const totalMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
    if (isNaN(totalMinutos) || totalMinutos < 1) {
      this.formRegistro.get('hora_regreso')!.setErrors({ diferenciaInvalida: true });
    } else {
      this.formRegistro.get('hora_regreso')!.setErrors(null);
    }
    return { horas: diferenciaHoras, minutos: diferenciaMinutos, totalMinutos };


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
