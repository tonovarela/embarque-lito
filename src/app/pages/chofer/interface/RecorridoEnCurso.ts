import { GpsPosition, Recorrido } from "@app/interface/models";


export interface RecorridoEnCurso {
    ubicacion: GpsPosition | null;
    recorrido: Recorrido | null;
    
}