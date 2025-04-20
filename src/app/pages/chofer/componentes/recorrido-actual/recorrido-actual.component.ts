import { CommonModule } from '@angular/common';
import {  Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Recorrido } from '@app/interface/models';
import { GpsPosition, GpsService } from '@app/services';

import { environment } from '@environments/environment.development';
import { CounterComponent } from '../counter/counter.component';


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

recorrido = input.required<Recorrido | null>();
gpsInicioPosicion = input<GpsPosition>({latitude: 19.466327669634705,longitude: -99.26530456102172,accuracy: 10} as GpsPosition);
visibleStopCounter = input.required<boolean>();
onStopCounter = output<void>();
isRunning = computed(() => this.recorrido() !== null);
gpsService = inject(GpsService);


mapImageUrl = computed(() => {
  if (this.gpsInicioPosicion) {
    const { latitude, longitude } = this.gpsInicioPosicion();
    return this.getMapboxImageUrl(
      longitude, // Longitud
      latitude,
      15, // Nivel de zoom
      600, // Ancho de la imagen      
      400 // Alto de la imagen
    );
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
