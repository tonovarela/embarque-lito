type Usuario ={
    id: number;
    nombre: string;
    
}

export interface Chofer extends Usuario{
    id_transporteAsignado?:number
}