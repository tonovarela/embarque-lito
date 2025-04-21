import { CommonModule } from '@angular/common';
import {  Component, computed, inject, input, OnInit, output, signal } from '@angular/core';

import { GpsPosition, GpsService } from '@app/services';

import { environment } from '@environments/environment.development';
import { CounterComponent } from '../counter/counter.component';
import { RecorridoEnCurso } from '../../interface/RecorridoEnCurso';


@Component({
  selector: 'recorrido-actual',
  standalone: true,
  imports: [CounterComponent,CommonModule],
  templateUrl: './recorrido-actual.component.html',
  styleUrl: './recorrido-actual.component.css',  
})
export class RecorridoActualComponent implements OnInit {

public _mapImageUrl =signal<string>('');
private mapboxToken = environment.mapboxToken;

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
    return this.getMapboxImageUrl(longitude,latitude,15, 600, 400 );
  }
  return '';
}); 
ngOnInit(): void {

  }

detenerContador(){
   this.onStopCounter.emit();
}

private getMapboxImageUrl(
  lng: number,
  lat: number,
  zoom: number,
  width: number,
  height: number
): string {
  // Reemplaza con tu estilo de mapa preferido
  const mapStyle = 'mapbox/streets-v11';
  return `https://api.mapbox.com/styles/v1/${mapStyle}/static/${lng},${lat},${zoom}/${width}x${height}?access_token=${this.mapboxToken}`;
}

}
