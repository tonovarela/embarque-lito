import { Transporte } from "./Transporte";
import { Chofer } from "./Usuario";
import { TipoServicio } from "./Recorrido";

export interface Choferes {
    internos: Chofer[];
    externos: Chofer[];
}


export interface Transportes {
    internos:Transporte[]
    externos:Transporte[]
    tipoServicios:TipoServicio[]
}


export interface MotivoMantenimiento {
    id_motivo: number;
    descripcion: string;
        
}


