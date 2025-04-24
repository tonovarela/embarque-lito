
import { GpsPosition, Recorrido } from "../models";

export interface ResponseRecorridoActivo {
    enCurso:   boolean;
    recorrido: Recorrido | null;
    ubicacion:GpsPosition | null;
}

