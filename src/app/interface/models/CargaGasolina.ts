export interface CargaGasolina {
    id_carga_gasolina?: number;
    id_transporte: number;
    total_litros: string;
    importe_carga: number;
    id_previo?: number;
    observaciones: string;
    kilometraje_inicial: number;
    kilometraje_final: number;
    fecha_carga: Date | string;
    
}

