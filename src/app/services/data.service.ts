import { computed, Injectable, signal } from '@angular/core';
import { Choferes, ChoferesExternos, Transportes, TransportesExternos } from '@app/data';
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
      id_chofer: 3141,
      fecha_registro: new Date(),
      kilometraje_inicial: 1500,
      kilometraje_final: 2000,
      fecha_salida: new Date(2025, 0, 1, 12, 0, 0),
      fecha_regreso: new Date(2025, 0, 1, 15, 0, 0),
      observaciones: 'observaciones',
      ops: ['L4582'],
      destino: 'destino 1'
    },
    {
      id_recorrido: 2,
      id_transporte: 9,
      tipo: 'externo',
      id_chofer: 3142,
      fecha_registro: new Date(),
      kilometraje_inicial: 2000,
      kilometraje_final: 3000,
      fecha_salida: new Date(2024, 11, 1, 12, 0, 0),
      fecha_regreso: new Date(2024, 11, 1, 18, 0, 0),
      observaciones: 'observaciones1',
      ops: ['64255'],
      destino: 'destino 2'
    },
    {
      id_recorrido: 3,
      id_transporte: 3,
      tipo: 'interno',
      id_chofer: 3141,
      fecha_registro: new Date(),
      kilometraje_inicial: 3000,
      kilometraje_final: 4000,
      fecha_salida: new Date(2024, 11, 2, 10, 0, 0),
      fecha_regreso: new Date(2024, 11, 2, 19, 0, 0),
      observaciones: 'observaciones',
      ops: ['L31469'],
      destino: 'destino 3'
    }
  ]);


  private cargasGasolina = signal<CargaGasolina[]>([
    {
      id_cargaGasolina: 1,
      id_transporte: 1,
      totalLitros: '50',
      importeCarga: '500',
      observaciones: 'observaciones',
      kilometraje_inicial: 1500,
      kilometraje_final: 2000,
      fecha_registro: new Date()
    },
    {
      id_cargaGasolina: 2,
      id_transporte: 2,
      totalLitros: '100',
      importeCarga: '1000',
      observaciones: 'observaciones1',
      kilometraje_inicial: 2000,
      kilometraje_final: 3000,
      fecha_registro: new Date()
    },
    {
      id_cargaGasolina: 3,
      id_transporte: 3,
      totalLitros: '150',
      importeCarga: '1500',
      observaciones: 'observaciones',
      kilometraje_inicial: 3000,
      kilometraje_final: 4000,
      fecha_registro: new Date()
    },
    {
      id_cargaGasolina: 4,
      id_transporte: 1,
      totalLitros: '200',
      importeCarga: '2000',
      observaciones: 'observaciones',
      kilometraje_inicial: 2000,
      kilometraje_final: 2500,
      fecha_registro: new Date()
    }

  ]);
  transportes=[...Transportes, ...TransportesExternos];
  choferes =[...Choferes,...ChoferesExternos];



  Recorridos = computed(() => this.recorridos().map((recorrido: Recorrido) => {
    return {
      ...recorrido,
      descripcion_chofer: this.choferes.find(chofer => chofer.id === recorrido.id_chofer)?.nombre,
      descripcion_transporte: this.transportes.find(transporte => transporte.id_transporte === recorrido.id_transporte)?.descripcion
    }
  }));

  CargasGasolina = computed(() => this.cargasGasolina().map((cargaGasolina: CargaGasolina) => {    
    return { ...cargaGasolina, descripcion_transporte: this.transportes.find(transporte => transporte.id_transporte === cargaGasolina.id_transporte)?.descripcion }
  }));




  agregarRecorrido(recorrido: Recorrido) {
    this.recorridos.set([...this.recorridos(), recorrido]);
  }

  agregarCargaGasolina(cargaGasolina: CargaGasolina) {
    this.cargasGasolina.set([...this.cargasGasolina(), cargaGasolina]);
  }

  traerUltimoKilometrajeRecorrido(id_transporte: number) {
    const recorridos = this.Recorridos().filter(recorrido => recorrido.id_transporte === +id_transporte);
    const kilometraje = recorridos[recorridos.length - 1]?.kilometraje_final || 0;
    return kilometraje;

  }

  traerUltimoKilometrajeCargaGasolina(id_transporte: number) {
    const cargas = this.CargasGasolina().filter(cargaGasolina => cargaGasolina.id_transporte === +id_transporte).sort((a, b) => a.id_cargaGasolina - b.id_cargaGasolina);    
    const kilometraje = cargas[cargas.length-1]?.kilometraje_final || 0;
    return kilometraje
  }


}
