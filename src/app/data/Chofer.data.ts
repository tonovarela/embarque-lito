import { Chofer } from "@app/interface/Usuario";

export const Choferes: Chofer[] = [
    {
        id: 3141,
        nombre: 'GARCIA GARCIA JUAN CARLOS',
        personal: "555"
    },
    {
        id: 3142,
        nombre: 'VARGAS VARGAS SOTERO',
        personal: "555"
    },
    {
        id: 3192,
        nombre: 'LOPEZ LOPEZ FERNANDO',
        personal: "555"
    },
    {
        id: 3380,
        nombre: 'PEREZ PEREZ JOSE ANTONIO',
        personal: "555"
    },
    {
        id: 3491,
        nombre: 'RAYMUNDO RAYMUNDO CRISTOBAL',
        personal: "555"
    }    
]

export const ChoferesExternos :Partial<Chofer>[]=[
    {
        id:1,
        nombre:"CYC LOGSTIC",        
    },
    {
       id:2,
       nombre:"MENVELO", 
       
    },
    {
        id:3,
        nombre:"LOGISTICA TAES",
       
    },{
        id:4,
        nombre:"TRANSPORTES PORTILLO"       
    }
]