import { CommonModule } from '@angular/common';

import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Datepicker } from 'flowbite';

import { Choferes } from '@app/data/Chofer.data';
import { Chofer } from '@app/interface/Usuario';
import { Transporte } from '@app/interface/Transporte';
import { Transportes } from '@app/data/Transporte.data';
import { CalendarComponent, GaugeComponent, MinusComponent, PlusComponent, TimeComponent, SearchComponent } from '@app/shared/svg';
import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';
import { PrimeNgModule } from '@app/lib/primeng.module';








@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [AutocompleteComponent, PrimeNgModule, ReactiveFormsModule, CommonModule, FormsModule, MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css'
})
export class NuevaComponent implements OnInit, AfterViewInit {

  fb = inject(FormBuilder);


  ops = signal<string[]>([
    "Orden 1",
    "Orden 3",
    "Orden 4",
    "Orden 5",
    "Orden 6",
    "Orden 7",
  ]);

  fechaSalida: string = '';
  today = new Date();
  formRegistro: FormGroup;

  diferenciaTiempo = { horas: 0, minutos: 0 };

  choferes: Chofer[] = [];
  transportes: Transporte[] = [];

  constructor() {
    this.formRegistro = this.fb.group({
      transporte: ['0'],
      chofer: ['0'],
      kilometraje_inicial: { value: '0', disabled: true },
      kilometraje_final: { value: '0', disabled: true },
      hora_salida: ['08:00'],
      hora_regreso: ['09:00'],
      fecha_salida: [this.today],
      fecha_regreso: [this.today],
      observaciones: [''],
    });



  }

  ngOnInit(): void {
    this.choferes = Choferes;
    this.transportes = Transportes;
  }


  onSelectOP(op: string) {
    const opExiste = this.ops().find((opActual) => opActual === op);
    console.log(opExiste);
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




  ngAfterViewInit(): void {
    const $datepickerEl = document.getElementById('fecha_regreso');
    const $datepickerEl2 = document.getElementById('fecha_salida');
    const datepicker1 = new Datepicker($datepickerEl, { format: 'dd-mm-yyyy', }, {});
    const datepicker2 = new Datepicker($datepickerEl2, { format: 'dd-mm-yyyy' }, {});
    setTimeout(() => {
      datepicker1.setDate(this.today);
      datepicker2.setDate(this.today);
    }, 1000);


    this.formRegistro.valueChanges.subscribe((form) => {
      const { hora_regreso, hora_salida, fecha_salida, fecha_regreso, transporte } = form;
      const fecha_salidaTime = this.unirFechaHora(fecha_salida, hora_salida);
      const fecha_regresoTime = this.unirFechaHora(fecha_regreso, hora_regreso);
      this.diferenciaTiempo = this.obtenerDiferenciaHoras(fecha_salidaTime, fecha_regresoTime);
    });
  }

  actualizarKilometrajeInicial(element: any | null) {
    const id_transporte = element?.value || "0";
    console.log(id_transporte);
    if (id_transporte == "0") {
      this.formRegistro.get('kilometraje_inicial')!.setValue(0);
      this.formRegistro.get('kilometraje_inicial')!.disable();
      this.formRegistro.get('kilometraje_final')!.setValue(0);
      this.formRegistro.get('kilometraje_final')!.disable();
      return;
    }
    // Todo obtener el kilometraje inicial del transporte seleccionado por api y si tiene kilometraje final setearlo como inicial y deshabilitar el campo en caso contrario habilitar los 2 campos    
    this.formRegistro.get('kilometraje_inicial')!.enable();
    this.formRegistro.get('kilometraje_inicial')!.setValue(0);
    this.formRegistro.get('kilometraje_final')!.enable();
    this.formRegistro.get('kilometraje_final')!.setValue(0);


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
    return { horas: diferenciaHoras, minutos: diferenciaMinutos, totalMinutos };
  }





  // formatDate(date: Date) {
  //   return date;
  //   const dia = ('0' + date.getDate()).slice(-2);
  //   const mes = ('0' + (date.getMonth() + 1)).slice(-2);
  //   const anio = date.getFullYear();
  //   const fechaCadena = `${dia}-${mes}-${anio}`;
  //   return fechaCadena;

  // }

}
