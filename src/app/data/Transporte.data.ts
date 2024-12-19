import { Transporte } from "@app/interface/Transporte";


export const Transportes: Transporte[] = [
    {
        id_transporte: 1,
        descripcion: 'URVAN 2015',
        placas: 'NYP1406'
    },
    {
        id_transporte: 2,
        descripcion: 'URVAN 2016',
        placas: 'NZK8749'
    },
    {
        id_transporte: 3,
        descripcion: 'URVAN 2015',
        placas: 'NYP1406'
    },
    {
        id_transporte: 4,
        descripcion: 'UNIDAD 4.5',
        placas: 'LE25277'
    },
    {
        id_transporte: 5,
        descripcion: 'CAMION WORKER',
        placas: 'LC82088'
    },
    {
        id_transporte: 6,
        descripcion: 'CAMION FREIGHTLINER',
        placas: 'LC82033'
    },
    {
        id_transporte: 7,
        descripcion: 'CAMIONETA CADDY',
        placas: 'NSF6298'
    }
];

export const TransportesExternos: Partial<Transporte>[] = [
    {
        id_transporte: 8,
        descripcion: '1.5 Ton',
    },
    {
        id_transporte: 9,
        descripcion: '3.5 Ton',

    }, {
        id_transporte: 10,
        descripcion: '3.5 Ton',

    },
    {
        id_transporte: 11,
        descripcion: '4.5 Ton',

    }, {
        id_transporte: 12,
        descripcion: 'TORTON',

    },
    {
        id_transporte: 13,
        descripcion: 'TRAILER',

    }, {
        id_transporte: 14,
        descripcion: 'KANGO',
    }
]