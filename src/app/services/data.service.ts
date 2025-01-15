import { computed, Injectable, signal } from '@angular/core';
//import { Choferes, ChoferesExternos, Transportes, TransportesExternos } from '@app/data';
import { CargaGasolina, Recorrido } from '@app/interface';
//import { tipoServicios } from '../data/TipoServicio.data';



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
      id_tipo_servicio: 1,
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
      id_tipo_servicio: 2,
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
      id_tipo_servicio: 3,
      ops: ['L31469'],
      destino: 'destino 3'
    }
  ]);


  private cargasGasolina = signal<CargaGasolina[]>([
    {
      id_carga_gasolina: 1,
      id_transporte: 1,
      total_litros: '50',
      importe_carga: '500',
      observaciones: 'observaciones',
      kilometraje_inicial: 1500,
      kilometraje_final: 2000,
      fecha_carga: new Date(2025,1,1)
    },
    {
      id_carga_gasolina: 2,
      id_transporte: 2,
      total_litros: '100',
      importe_carga: '1000',
      observaciones: 'observaciones1',
      kilometraje_inicial: 2000,
      kilometraje_final: 3000,
      fecha_carga: new Date(2025, 0, 1, 15, 0, 0)
    },
    {
      id_carga_gasolina: 3,
      id_transporte: 3,
      total_litros: '150',
      importe_carga: '1500',
      observaciones: 'observaciones',
      kilometraje_inicial: 3000,
      kilometraje_final: 4000,
      fecha_carga:  new Date(2025, 0, 2, 15, 0, 0)
    },
    
  ]);

  //transportes=[...Transportes, ...TransportesExternos];
  //choferes =[...Choferes,...ChoferesExternos];
  //tipoServicios = tipoServicios;



  Recorridos = computed(() => this.recorridos().map((recorrido: Recorrido) => {
    return {
      ...recorrido,
      //descripcion_chofer: this.choferes.find(chofer => chofer.id === recorrido.id_chofer)?.nombre,
      //descripcion_tipo_servicio:this.tipoServicios.find(tipoServicio => tipoServicio.id === recorrido.id_tipo_servicio)?.descripcion,      
      //descripcion_transporte: this.transportes.find(transporte => transporte.id_transporte === recorrido.id_transporte)?.descripcion
    }
  }));

  CargasGasolina = computed(() => this.cargasGasolina().map((cargaGasolina: CargaGasolina) => {    
    return { ...cargaGasolina, 
      //descripcion_transporte: this.transportes.find(transporte => transporte.id_transporte === cargaGasolina.id_transporte)?.descripcion 
      }
  }));




  agregarRecorrido(recorrido: Recorrido) {
    this.recorridos.set([...this.recorridos(), recorrido]);
  }

  agregarCargaGasolina(cargaGasolina: CargaGasolina) {
    this.cargasGasolina.set([...this.cargasGasolina(), cargaGasolina]);
  }

 

  traerUltimoRecorrido(id_transporte:number){
    const recorridos = this.Recorridos().filter(recorrido => recorrido.id_transporte === +id_transporte);
    return recorridos[recorridos.length - 1];

  }

  traerUltimoKilometrajeCargaGasolina(id_transporte: number) {
    const cargas = this.CargasGasolina().filter(cargaGasolina => cargaGasolina.id_transporte === +id_transporte).sort((a, b) => a.id_carga_gasolina - b.id_carga_gasolina);    
    return cargas[cargas.length - 1] || null
    
  }

 


}
