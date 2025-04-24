import { environment } from "@environments/environment.development";


export const  getMapboxImageUrl =(
    lng: number,
    lat: number,
    zoom: number =15,
    width: number=600,
    height: number =400
  ): string=> {
    // Reemplaza con tu estilo de mapa preferido
    const mapStyle = 'mapbox/streets-v11';
    return `https://api.mapbox.com/styles/v1/${mapStyle}/static/${lng},${lat},${zoom}/${width}x${height}?access_token=${environment.mapboxToken}`;
  }