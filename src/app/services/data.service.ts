import { computed, Injectable, signal } from '@angular/core';
import { CargaGasolina, Recorrido } from '@app/interface/models';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  
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



  CargasGasolina = computed(() => this.cargasGasolina().map((cargaGasolina: CargaGasolina) => {    
    return { ...cargaGasolina}
  }));




  agregarRecorrido(recorrido: Recorrido) {
    //this.recorridos.set([...this.recorridos(), recorrido]);
  }

  agregarCargaGasolina(cargaGasolina: CargaGasolina) {
    this.cargasGasolina.set([...this.cargasGasolina(), cargaGasolina]);
  }

 

  traerUltimoRecorrido(id_transporte:number){
    //const recorridos = this.Recorridos().filter(recorrido => recorrido.id_transporte === +id_transporte);
    //return recorridos[recorridos.length - 1];

  }

  traerUltimoKilometrajeCargaGasolina(id_transporte: number) {
    const cargas = this.CargasGasolina().filter(cargaGasolina => cargaGasolina.id_transporte === +id_transporte).sort((a, b) => a.id_carga_gasolina - b.id_carga_gasolina);    
    return cargas[cargas.length - 1] || null
    
  }

 


}
