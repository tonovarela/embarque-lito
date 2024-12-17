import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';

import { PrimeNgModule } from '@app/lib/primeng.module';
import { CalendarComponent, GaugeComponent, MinusComponent, PlusComponent, TimeComponent, SearchComponent } from '@app/shared/svg';
import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';

import { createFormRegistro, resetFormRegistro } from '@app/helpers/formModel';
import { Chofer, DiferenciaTiempo, Transporte } from '@app/interface';
import { Choferes, opsData, Transportes } from '@app/data';



@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule, CommonModule, FormsModule, MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent, AutocompleteComponent],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css'
})
export class NuevaComponent implements OnInit, AfterViewInit {

  ops = opsData;
  fechaSalida: string = '';
  today = new Date();
  formRegistro: FormGroup;
  diferenciaTiempo: DiferenciaTiempo = { horas: 0, minutos: 0, totalMinutos: 1 };
  choferes: Chofer[] = [];
  transportes: Transporte[] = [];

  ngOnInit(): void {
    this.choferes = Choferes;
    this.transportes = Transportes;
  }
  ngAfterViewInit(): void {
    this.resetForm();

    this.formRegistro.valueChanges.subscribe((form) => {
      const { hora_regreso, hora_salida, fecha_salida, fecha_regreso } = form;
      const fecha_salidaTime = this.unirFechaHora(fecha_salida, hora_salida);
      const fecha_regresoTime = this.unirFechaHora(fecha_regreso, hora_regreso);
      this.diferenciaTiempo = this.obtenerDiferenciaHoras(fecha_salidaTime, fecha_regresoTime);
    });
  }
  constructor() {
    this.formRegistro = createFormRegistro();
  }

  resetForm() {
    this.ops.set([]);
    resetFormRegistro(this.formRegistro);
  }
  onSelectOP(op: string) {
    const opExiste = this.ops().find((opActual) => opActual === op);
    if (opExiste) {
      return;
    }
    this.ops.update((ops) => {
      return [...ops, op];
    });
  }

  onRemoverOP(op: string) {
    this.ops.update((ops) => ops.filter((opActual) => opActual !== op));
  }

  incrementar(valor: number, nombre: string) {
    const valorActual = this.formRegistro.get(nombre)!.value;
    const nuevoValor = (+valorActual + valor) || 0;
    if (nuevoValor < 0) {
      return;
    }
    this.formRegistro.get(nombre)!.setValue(nuevoValor);
  }

  actualizarKilometrajeInicial(element: any | null) {
    const id_transporte = element?.value || "0";
    //console.log(id_transporte);
    if (id_transporte == "0") {
      this.formRegistro.get('kilometraje_inicial')!.setValue(0);
      this.formRegistro.get('kilometraje_inicial')!.disable();
      this.formRegistro.get('kilometraje_final')!.setValue(0);
      this.formRegistro.get('kilometraje_final')!.disable();
      return;
    }
    // Todo obtener el kilometraje inicial del transporte seleccionado por api y si tiene kilometraje final setearlo como inicial y deshabilitar el campo en caso contrario habilitar los 2 campos    
    this.formRegistro.get('kilometraje_inicial')!.disable();
    this.formRegistro.get('kilometraje_inicial')!.setValue(50);
    this.formRegistro.get('kilometraje_final')!.enable();
    this.formRegistro.get('kilometraje_final')!.setValue(0);
  }


  tieneError(controlName: string): boolean {
    const control = this.formRegistro.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }




  unirFechaHora(date: Date, hora: string): Date {
    const dia = (date.getDate());
    const mes = date.getMonth() + 1
    const anio = date.getFullYear();
    const [horas, minutos] = hora.split(':').map(Number);
    return new Date(anio, mes - 1, dia, horas, minutos);
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
    if (isNaN(totalMinutos) || totalMinutos < 60) {
      this.formRegistro.get('hora_regreso')!.setErrors({ diferenciaInvalida: true });
    } else {
      this.formRegistro.get('hora_regreso')!.setErrors(null);
    }
    return { horas: diferenciaHoras, minutos: diferenciaMinutos, totalMinutos };
  }

  guardarRegistro() {
    this.formRegistro.markAllAsTouched();
    if (this.formRegistro.invalid || this.ops().length === 0) {
      return;
    }
    const { fecha_salida, hora_salida, fecha_regreso, hora_regreso, transporte, chofer,  kilometraje_final, observaciones } = this.formRegistro.value;
    const fechaSalida = this.formatDate(fecha_salida, hora_salida);
    const fechaRegreso = this.formatDate(fecha_regreso, hora_regreso);
    const registro = { fechaSalida, fechaRegreso, transporte, chofer, kilometraje_inicial: +this.formRegistro.get('kilometraje_inicial')?.value, kilometraje_final:+kilometraje_final, observaciones, ops: this.ops() };

    console.log(registro);
  }




  private formatDate(date: Date, time: string) {

    const dia = ('0' + date.getDate()).slice(-2);
    const mes = ('0' + (date.getMonth() + 1)).slice(-2);
    const anio = date.getFullYear();
    const fechaCadena = `${anio}-${mes}-${dia} ${time}`;
    return fechaCadena;
  }

}
