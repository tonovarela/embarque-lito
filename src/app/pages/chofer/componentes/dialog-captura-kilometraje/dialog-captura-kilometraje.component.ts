import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal,input, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Recorrido } from '@app/interface/models';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { GpsPosition, GpsService } from '@app/services';
import { PosicionKilometraje } from '../../interface/PosicionKilometraje';

@Component({
  selector: 'dialog-captura-kilometraje',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgModule],
  templateUrl: './dialog-captura-kilometraje.component.html',
  styleUrl: './dialog-captura-kilometraje.component.css',
})
export class DialogCapturaKilometrajeComponent implements OnInit {
  

  @Input() recorrido: Recorrido | null = null;
  minimoKilometraje = input.required<number>();
  @Input() title: string = 'Kilometraje ';
  @Output() save = new EventEmitter<PosicionKilometraje | null>();

  public gpsPosition: GpsPosition | null = null;
  public loadingGps = signal<boolean>(false);
  public loading  = signal<boolean>(false);
  public kilometraje= signal<number>(0);
  private gpsService = inject(GpsService);


  esMinimoRequerido = computed(() => {
    if (this.kilometraje() <= this.minimoKilometraje()) {
      return true;
    }
    return false;
  });

  ngOnInit(): void {

    this.kilometraje.set(this.minimoKilometraje());    
  }


  cancelDialog() {
    if (this.loading()) {
      return;
    }
    this.save.emit(null);
  }

  async obtenerUbicacion() {
    try {
      this.loadingGps.set(true);
      this.gpsPosition = await this.gpsService.getCurrentPosition();
    } catch (error) {
      console.error('Error GPS:', error);
    } finally {
      this.loadingGps.set(false);
    }
  }
  

   onValidateNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9.]$/)) {
      event.preventDefault();
    }
  }


  async onSave() {
    await this.obtenerUbicacion();
    this.loading.set(true);
    if (!this.gpsPosition) {
      // Mostrar error - ubicación requerida
      this.loading.set(false);
      return;
    }  
   if (this.kilometraje()! < this.minimoKilometraje()) {      
    this.loading.set(false);
      return;
    }

    


    this.save.emit({
      gpsPosicion: this.gpsPosition,
      kilometraje: this.kilometraje(),
      id_recorrido: this.recorrido?.id_recorrido!,
    },
    );
    this.recorrido = null;
    this.loading.set(false);
  }


  onInputNumber(event: any,) {
    const value = event.target.value;    
    if (!/^\d*$/.test(value)) {
      event.target.value = value.replace(/[^\d]/g, '');
    }
    const numero = parseInt(event.target.value);
    if (isNaN(numero)) {
      this.kilometraje.set(0);
      return;
    }
    this.kilometraje.set(numero);
  }
}
