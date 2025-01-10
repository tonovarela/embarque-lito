import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Choferes, Transportes } from '@app/data';
import { resetFormRegistroInterno } from '@app/helpers/formModel';
import { DiferenciaTiempo, Chofer, Transporte } from '@app/interface';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { DataService } from '@app/services/data.service';
import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';
import { MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent } from '@app/shared/svg';
import { tipoServicios } from '../../data/TipoServicio.data';

@Component({
  selector: 'app-registro-interno',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule, CommonModule, FormsModule, MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent, AutocompleteComponent],
  templateUrl: './registro-interno.component.html',
  styleUrl: './registro-interno.component.css',

})
export class RegistroInternoComponent implements OnInit, AfterViewInit {

  @Input() formGroup!: FormGroup;
  fb = inject(FormBuilder);
  dataService = inject(DataService);
  formRegistro!: FormGroup;
  fechaSalida: string = '';
  today = new Date();
  diferenciaTiempo: DiferenciaTiempo = { horas: 0, minutos: 0, totalMinutos: 1 };
  choferes: Chofer[] = [];
  transportes: Transporte[] = [];
  tipoServicios = tipoServicios;




  ngOnInit(): void {
    this.formRegistro = this.formGroup.get('registroInterno') as FormGroup;
    this.choferes = Choferes;
    this.transportes = Transportes;
  }


  ngAfterViewInit(): void {
    this.resetForm();
    this.formRegistro.valueChanges.subscribe((form) => {
      const { hora_regreso, hora_salida, fecha_salida, fecha_regreso, transporte } = form;
      const fecha_salidaTime = this.unirFechaHora(fecha_salida, hora_salida);
      const fecha_regresoTime = this.unirFechaHora(fecha_regreso, hora_regreso);
      this.diferenciaTiempo = this.obtenerDiferenciaHoras(fecha_salidaTime, fecha_regresoTime);
    });
  }

  resetForm() {    
    resetFormRegistroInterno(this.formRegistro);
  }



  onSelectOP(op: string) {
    const opsCurrent = this.formRegistro.get('ops')!.value;
    const opExiste = opsCurrent.find((opActual: string) => opActual === op);
    if (opExiste) {
      return;
    }
    this.opsArray.push(this.fb.control(op));
  }

  private get opsArray(): FormArray {
    return this.formRegistro.get('ops') as FormArray;
  }


  onRemoverOP(op: string) {
    const opsCurrent = this.formRegistro.get('ops')!.value;
    const index = opsCurrent.findIndex((opActual: string) => opActual === op);
    this.opsArray.removeAt(index);

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
    const choferAsignado  = this.choferes.find(chofer => chofer.id === +id_chofer);    
    this.formRegistro.get('transporte')!.setValue( choferAsignado?.id_transporteAsignado ?? 0);    
    this.actualizarKilometrajeInicial();
  }

  public actualizarKilometrajeInicial() {
    console.log('---');
    const id_transporte = this.formRegistro.get('transporte')!.value;
    
    if (id_transporte == "0") {
      this.formRegistro.get('kilometraje_inicial')!.setValue(0);
      this.formRegistro.get('kilometraje_inicial')!.disable();
      this.formRegistro.get('kilometraje_final')!.setValue(0);
      this.formRegistro.get('kilometraje_final')!.disable();
      return;
    }
    const kilometraje = this.dataService.traerUltimoKilometrajeRecorrido(id_transporte);
     kilometraje != 0 ? this.formRegistro.get('kilometraje_inicial')?.disable()
     : this.formRegistro.get('kilometraje_inicial')?.enable();    
    this.formRegistro.get('kilometraje_inicial')!.setValue(kilometraje);
    this.formRegistro.get('kilometraje_final')!.enable();
    this.formRegistro.get('kilometraje_final')!.setValue(0)
    
    
  }


  tieneError(controlName: string): boolean {
    const control = this.formRegistro.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }

  unirFechaHora(date: Date, hora: string): Date {
    if (date == null || hora == null) {
      return new Date();
    }
    
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


  OnKeyPress(event: KeyboardEvent) { 
    event.preventDefault();    
  }

}
