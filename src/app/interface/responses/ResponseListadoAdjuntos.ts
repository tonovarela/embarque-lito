export interface ResponseListadoAdjuntos {
    archivos: ArchivoRetorno[];
}

export interface ArchivoRetorno {
  id_adjunto: number;
  nombre: string;  
  tipo: string;  
  archivo: string;
}