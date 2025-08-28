export interface ResponseListadoAdjuntos {
    adjuntos: ArchivoRetorno[];
}

export interface ArchivoRetorno {
  id_adjunto: number;
  nombre: string;  
  tipo: string;  
  url: string;
}