type Usuario ={
    id: number;
    nombre: string;
    personal:string
}

export interface Chofer extends Usuario{
    id_transporteAsignado?:number
}