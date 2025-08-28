export interface ResponseRetornos {
    retornos: Retorno[];
}

export interface Retorno {
    id_retorno:         string;
    cantidad:           string;
    tipo:               string;
    id_motivo:          string;
    observaciones:      string;
    fecha_registro:     Date;
    ops:                string;
    descripcion_motivo: string;
}
