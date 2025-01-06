import { computed, Injectable, signal } from '@angular/core';
import { CargaGasolina, Recorrido } from '@app/interface';



@Injectable({
  providedIn: 'root'
})
export class DataService {
  private recorridos = signal<Recorrido[]>([
    {
      id_recorrido: 1,
      id_transporte: 1,
      tipo: 'interno',
      chofer: 1,
      fecha_registro: new Date(),
      kilometraje_inicial: 1500,
      kilometraje_final: 2000,
      fecha_salida: new Date(2025, 0, 1, 12, 0, 0), 
      fecha_regreso: new Date(2025, 0, 1, 15, 0, 0), 
      observaciones: 'observaciones',
      ops: ['ops'],
      destino: 'destino 1'},
      {
        id_recorrido: 2,
        id_transporte: 2,
        tipo: 'externo',
        chofer: 2,
        fecha_registro: new Date(),
        kilometraje_inicial: 2000,
        kilometraje_final: 3000,
        fecha_salida: new Date(2024, 11, 1, 12, 0, 0), 
        fecha_regreso: new Date(2024, 11, 1, 18, 0, 0), 
        observaciones: 'observaciones1',
        ops: ['ops'],
        destino: 'destino 2'
      },
      {
        id_recorrido: 3,
        id_transporte: 3,
        tipo: 'interno',
        chofer: 3,
        fecha_registro: new Date(),
        kilometraje_inicial: 3000,
        kilometraje_final: 4000,
        fecha_salida: new Date(2024, 11, 2, 10, 0, 0), 
        fecha_regreso: new Date(2024, 11, 2, 19, 0, 0), 
        observaciones: 'observaciones',
        ops: ['ops'],
        destino: 'destino 3'
      }
  ]);

  
  private cargasGasolina = signal<CargaGasolina[]>([
    {
      id_cargaGasolina: 1,
      transporte: 1,
      totalLitros: '50',
      importeCarga: '500',
      observaciones: 'observaciones',
      kilometraje_inicial: 1500,
      kilometraje_final: 2000,
      fecha_registro: new Date()
    },
    { 
      id_cargaGasolina: 2,
      transporte: 2,
      totalLitros: '100',
      importeCarga: '1000',
      observaciones: 'observaciones1',
      kilometraje_inicial: 2000,
      kilometraje_final: 3000,
      fecha_registro: new Date()
    },
    {
      id_cargaGasolina: 3,
      transporte: 3,
      totalLitros: '150',
      importeCarga: '1500',
      observaciones: 'observaciones',
      kilometraje_inicial: 3000,
      kilometraje_final: 4000,
      fecha_registro: new Date()
    },
    {
      id_cargaGasolina: 4,
      transporte: 4,
      totalLitros: '200',
      importeCarga: '2000',
      observaciones: 'observaciones',
      kilometraje_inicial: 4000,
      kilometraje_final: 5000,
      fecha_registro: new Date()
    }
    
  ]);

  constructor() { }


  Recorridos = computed(() => this.recorridos());
  CargasGasolina = computed(() => this.cargasGasolina()); 
  
  agregarRecorrido(recorrido: Recorrido) {
    this.recorridos.set([...this.recorridos(), recorrido]);
  }

  agregarCargaGasolina(cargaGasolina: CargaGasolina) {
    this.cargasGasolina.set([...this.cargasGasolina(), cargaGasolina]);
  }

}
