export interface Recorrido {    
id_recorrido: number;
id_transporte: number;
tipo: 'interno'| 'externo' 
chofer:number;
fecha_registro?:Date;
kilometraje_inicial: number;
kilometraje_final: number;
fecha_salida?: Date;
fecha_regreso?: Date;
observaciones: string;
ops:string[];
destino:string;
}