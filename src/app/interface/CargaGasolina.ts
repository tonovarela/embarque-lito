export interface CargaGasolina {
    id_carga_gasolina: number;
    id_transporte: number;
    total_litros: string;
    importe_carga: string;
    observaciones: string;
    kilometraje_inicial: number;
    kilometraje_final: number;
    fecha_carga: Date    
}

