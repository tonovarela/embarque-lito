import { GpsPositionWithType } from "../models";


export interface ResponseUbicacionRecorrido {
    ubicaciones:GpsPositionWithType[],
    firma?:Firma;
}


export interface Firma {
    imagen: string ;
    fecha_registro: Date ;
    id_recorrido: number 
}