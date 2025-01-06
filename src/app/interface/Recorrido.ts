export interface Recorrido {    
id_recorrido: number;
id_transporte: number;
descripcion_transporte?: string; 

tipo: 'interno'| 'externo' 
id_chofer:number;
descripcion_chofer?: string;    
fecha_registro?:Date;
kilometraje_inicial: number;
kilometraje_final: number;
fecha_salida?: Date;
fecha_regreso?: Date;
observaciones: string;
ops:string[];
destino:string;
}