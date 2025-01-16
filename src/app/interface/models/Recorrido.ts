export interface Recorrido {    
id_recorrido?: number;
id_chofer:number;
id_transporte: number;
tipo: 'interno'| 'externo' 

kilometraje_inicial?: number;
kilometraje_final?: number;
fecha_salida?: Date | string;
fecha_regreso?: Date | string;
observaciones?: string;
id_tipo_servicio?:number;
destino:string;
nombre_chofer?: string;    
descripcion_tipo_servicio?:string;
descripcion_transporte?: string; 
fecha_registro?:Date;
ops?:string[];
id_previo?:number;
}


export interface TipoServicio {
    id: number;
    descripcion: string;
}