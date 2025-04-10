import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { NumberFormatter, obtenerValorNumerico } from '@app/helpers/validators';
import { Recorrido } from '@app/interface/models';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { SynfusionModule } from '@app/lib/synfusion.module';

import { RecorridoService } from '@app/services/recorrido.service';
import { UiService } from '@app/services/ui.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import { EditService } from '@syncfusion/ej2-angular-grids';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [SynfusionModule, FabbuttonComponent, CommonModule, PrimeNgModule, FormsModule],
  providers: [EditService],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export default class ListadoComponent extends BaseGridComponent implements OnInit {
  private _recorridos = signal<Recorrido[]>([]);
  private recorridoService = inject(RecorridoService);
  public recorridoActivo: Recorrido | null = null;

  public cargando =signal<boolean>(false);

  private uiService = inject(UiService);

  cargarInformacion() {
    this.cargando.set(true);
    this.recorridoService.listar().subscribe(({ recorridos }) => {
      this._recorridos.set(recorridos);
      this.cargando.set(false);
    });
  }

  ngOnInit(): void {
    this.autoFitColumns = true;
    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();

  }
  Recorridos = computed(() => this._recorridos());
  protected minusHeight = 0.27;
  constructor() {
    super();
  }
  visible = signal<boolean>(false);
  showEditDialog(recorrido: Recorrido) {
    this.recorridoActivo = recorrido;
    const { importe_factura } = this.recorridoActivo
    this.recorridoActivo = { ...this.recorridoActivo, importe_factura: importe_factura == 0 ? 0 : importe_factura }
    this.visible.set(true);
  }


  hideEditDialog() {
    if (this.visible()) {
      this.visible.set(false);
      this.recorridoActivo = null;
    }
  }

  async save() {

    const resp = await firstValueFrom(this.recorridoService.actualizar(this.recorridoActivo!))    
    this._recorridos.set(this._recorridos().map((r) => {
      if (r.id_recorrido === this.recorridoActivo!.id_recorrido) {
        this.recorridoActivo!.importe_factura = obtenerValorNumerico(`${this.recorridoActivo?.importe_factura!}`);
        return this.recorridoActivo!

      }
      return r;
    }));
    this.recorridoActivo = null;
    this.visible.set(false);
  }


  visibleChange(e: boolean) {
    this.hideEditDialog();
  }




  onValidateNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9.]$/)) {
      event.preventDefault();
    }
  }


  onInput(event: any, prefix: string) {
    const target = event.target as HTMLInputElement;
    let value = target.value;
    const newValue = new NumberFormatter(value, prefix).getFormat(2);
    target.value = newValue;
  }


  async descargarExcel() {
    let data: Recorrido[];
    const filtered = await this.grid.getFilteredRecords() as Recorrido[];
    if (filtered.length === 0) {
      data = this.Recorridos();
    } else {
      data = filtered;
    }

    const dataforExcel = data.map(({ id_previo, ...rest }) => rest);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataforExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recorridos');

    /* save to file */
    XLSX.writeFile(wb, 'Recorridos.xlsx');
  }

  async eliminarRecorrido(recorrido: Recorrido) {
    
    const { isConfirmed } = await this.uiService.mostrarAlertaConfirmacion("Recorridos", "¿Está seguro de eliminar el recorrido?", "Si,eliminarlo", "Cancelar");
    if (!isConfirmed) {
      return;
    }
    const { id_recorrido } = recorrido;
    this._recorridos.set([]);
    try {
      await firstValueFrom(this.recorridoService.eliminar(id_recorrido!));
    } catch (e) {
      this.uiService.mostrarAlertaError("Recorridos", "Error al eliminar el recorrido");
    } finally {
      this.cargarInformacion();
    }



  }




}
