import { GpsPosition } from "@app/services";
import { Recorrido } from "../models";

export interface ResponseRecorridoActivo {
    enCurso:   boolean;
    recorrido: Recorrido | null;
    ubicacion:GpsPosition | null;
}

