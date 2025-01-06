import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Recorrido } from '@app/interface';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { DataService } from '@app/services/data.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';


@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [SynfusionModule,FabbuttonComponent,CommonModule],  
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent extends BaseGridComponent implements OnInit { 

  

  public dataService= inject(DataService);
  ngOnInit(): void {
    this.autoFitColumns = true;    
    this.iniciarResizeGrid(this.minusHeight);    
  }
  protected minusHeight = 0;
  constructor() {
    super();
  }
}
