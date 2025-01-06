import { Component, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import { ReorderService, ExcelExportService, ToolbarService, PageService,  FilterService } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [SynfusionModule,FabbuttonComponent,],
  providers: [ReorderService, ExcelExportService, ToolbarService,PageService,FilterService],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent extends BaseGridComponent implements OnInit { 

  recorridos = signal<[]>([]);
  ngOnInit(): void {
    this.autoFitColumns = false;    
    this.iniciarResizeGrid(this.minusHeight);
    
  }
  protected minusHeight = 0;
  constructor() {
    super();
  }
}
