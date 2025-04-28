import { CommonModule } from '@angular/common';
import {  Component, computed, inject, input, OnInit, output, signal } from '@angular/core';

import { GpsService } from '@app/services';


import { CounterComponent } from '../counter/counter.component';
import { RecorridoEnCurso } from '../../interface/RecorridoEnCurso';
import { GpsPosition } from '@app/interface/models';
import { getMapboxImageUrl } from '@app/helpers/getImagePosition';


@Component({
  selector: 'recorrido-actual',
  standalone: true,
  imports: [CounterComponent,CommonModule],
  templateUrl: './recorrido-actual.component.html',
  styleUrl: './recorrido-actual.component.css',  
})
export class RecorridoActualComponent implements OnInit {

public _mapImageUrl =signal<string>('');
//private mapboxToken = environment.mapboxToken;
public now= new Date(); // Current time in milliseconds
recorridoEnCurso = input.required<RecorridoEnCurso | null>();
gpsInicioPosicion = input<GpsPosition>({latitude: 19.466327669634705,longitude: -99.26530456102172,accuracy: 10} as GpsPosition);
visibleStopCounter = input.required<boolean>();
onStopCounter = output<void>();
isRunning = computed(() => this.recorridoEnCurso() !== null);
gpsService = inject(GpsService);

recorrido = computed(() => this.recorridoEnCurso()?.recorrido);

mapImageUrl = computed(() => {
  if (this.gpsInicioPosicion) {
    const posicion = this.recorridoEnCurso()?.ubicacion || this.gpsInicioPosicion();
    const { latitude, longitude } = posicion;
    return getMapboxImageUrl(longitude,latitude);
  }
  return '';
}); 
ngOnInit(): void {

  }

detenerContador(){
   this.onStopCounter.emit();
}

}
