import { Recorrido } from "@app/interface/models";
import { GpsPosition } from "@app/services";

export interface RecorridoEnCurso {
    ubicacion: GpsPosition | null;
    recorrido: Recorrido | null;
    
}