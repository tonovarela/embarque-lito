import { CargaGasolina, Recorrido } from "../models";



export interface ResponseListadoRecorrido {
    recorridos: Recorrido[];
}

export interface ResponseListadoCargasGasolina {
    cargas: CargaGasolina[];
}