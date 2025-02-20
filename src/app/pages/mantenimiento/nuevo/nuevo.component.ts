import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroRecorridoHook } from '@app/componentes/hooks/useRegistro';

import { PrimeNgModule } from '@app/lib/primeng.module';
import { TransporteService, ChoferService, MantenimientoService, UiService } from '@app/services';




import { MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent } from '@app/shared/svg';
import { initFlowbite } from 'flowbite';
import { createFormMantenimientoBuilder, resetFormMantenimiento } from '../helper/formFactory';
import { formatDate, unirFechaHora } from '@app/helpers/helpers';
import { DiferenciaTiempo } from '@app/interface/models';
import { firstValueFrom } from 'rxjs';



@Component({
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule, CommonModule, FormsModule, MinusComponent, PlusComponent, CalendarComponent, TimeComponent, GaugeComponent, SearchComponent],
  providers: [RegistroRecorridoHook],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NuevoComponent implements OnInit, AfterViewInit {

  changeDetectorRef = inject(ChangeDetectorRef);
  transporteService = inject(TransporteService);
  choferService = inject(ChoferService);
  mantenimientoService = inject(MantenimientoService);
  recorridoRegistroHook = inject(RegistroRecorridoHook);
  uiService = inject(UiService);
  router = inject(Router);



  diferenciaTiempo: DiferenciaTiempo = { horas: 0, minutos: 0, totalMinutos: 1 };

  guardandoMantenimiento = signal<boolean>(false);



  transportes = computed(() => this.transporteService.transportes().internos);
  choferes = computed(() => this.choferService.choferes().internos);
  motivosMantenimiento = computed(() => this.mantenimientoService.motivosMantenimiento().map(m => { return { ...m, descripcion: m.descripcion.toUpperCase() } }));


  fb = inject(FormBuilder);
  formRegistro = createFormMantenimientoBuilder(this.fb);

  ngOnInit(): void {
    resetFormMantenimiento(this.formRegistro);
    this.formRegistro.valueChanges.subscribe((form) => {
      const { hora_inicio, hora_fin, fecha_fin, fecha_inicio } = form;
      const fecha_inicioTime = unirFechaHora(fecha_inicio!, hora_inicio!);
      const fecha_regresoTime = unirFechaHora(fecha_fin!, hora_fin!);
      this.diferenciaTiempo = this.obtenerDiferenciaHoras(fecha_inicioTime, fecha_regresoTime);

    });

  }

  ngAfterViewInit(): void {
    initFlowbite();
    this.changeDetectorRef.detectChanges();
  }

  OnKeyPress(event: KeyboardEvent) {
    event.preventDefault();
  }


  actualizarFecha({ detail }: any, nombre: string) {
    const fecha = detail.date;
    this.formRegistro.get(nombre)!.setValue(fecha);
  }

  tieneError(controlName: string): boolean {
    return this.recorridoRegistroHook.tieneError(controlName, this.formRegistro);
  }

  regresar() {
    if (this.guardandoMantenimiento()) {
      return;
    }
    this.router.navigate(['/mantenimiento']);
  }



  private obtenerDiferenciaHoras(fechaInicio: Date, fechaFin: Date) {
    const diferenciaMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
    const diferenciaHoras = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60)) || 0;
    const diferenciaMinutos = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60)) || 0;
    const totalMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
    if (isNaN(totalMinutos) || totalMinutos < 1) {
      this.formRegistro.get('hora_fin')!.setErrors({ diferenciaInvalida: true });
    } else {
      this.formRegistro.get('hora_fin')!.setErrors(null);
    }
    return { horas: diferenciaHoras, minutos: diferenciaMinutos, totalMinutos };

  }

  async guardar() {
    this.formRegistro.markAllAsTouched();
    if (this.formRegistro.invalid) {
      return
    }

    this.guardandoMantenimiento.set(true);
    const { chofer, transporte, motivo, observaciones, fecha_fin, fecha_inicio, hora_fin, hora_inicio } = this.formRegistro.value;
    
    const fecha_inicioTime = formatDate(new Date(fecha_inicio!), hora_inicio!)
    const fecha_finTime = formatDate(new Date(fecha_fin!), hora_fin!)
    const mantenimiento = {
      id_motivo: motivo,
      id_chofer:chofer,
      id_transporte:transporte,      
      fecha_inicio: fecha_inicioTime,
      fecha_fin: fecha_finTime,      
      observaciones,
    };
    await firstValueFrom(this.mantenimientoService.registrar(mantenimiento));

    this.uiService.mostrarAlertaSuccess('Embarques', 'Mantenimiento registrado correctamente');
    resetFormMantenimiento(this.formRegistro);
    this.guardandoMantenimiento.set(false);


  }



}
