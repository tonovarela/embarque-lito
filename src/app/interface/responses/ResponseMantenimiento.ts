import { Mantenimiento } from "../models/Mantenimiento";

export interface ResponseMantenimiento {
    ok:boolean;
    mantenimientos: Mantenimiento[];
}