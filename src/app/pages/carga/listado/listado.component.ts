import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { CargaGasolina } from '@app/interface/models';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { CargaGasolinaService } from '@app/services/cargaGasolina.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
@Component({  
  standalone: true,
  imports: [SynfusionModule,FabbuttonComponent,CommonModule],
  
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent extends BaseGridComponent implements OnInit {


private cargaGasolinaService = inject(CargaGasolinaService);

private _cargas = signal<CargaGasolina[]>([]);  
  ngOnInit(): void {
    this.autoFitColumns = false;    
    this.cargaGasolinaService.listar().subscribe(response => this._cargas.set(response.cargas))
    
    
    this.iniciarResizeGrid(this.minusHeight);

    
  }
  cargasGasolina= computed(()=>this._cargas());
  protected minusHeight = 0.27;
  constructor() {
    super();
  }
}
