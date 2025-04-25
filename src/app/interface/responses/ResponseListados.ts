import { CargaGasolina, Recorrido } from "../models";



export interface ResponseListadoRecorrido {
    recorridos: Recorrido[];
    recorridosSinFirma: Recorrido[];
}

export interface ResponseListadoCargasGasolina {
    cargas: CargaGasolina[];
}