import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { NumberFormatter, obtenerValorNumerico } from '@app/helpers/validators';
import { Recorrido } from '@app/interface/models';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { SynfusionModule } from '@app/lib/synfusion.module';

import { RecorridoService } from '@app/services/recorrido.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import { EditService } from '@syncfusion/ej2-angular-grids';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [SynfusionModule, FabbuttonComponent, CommonModule, PrimeNgModule, FormsModule],
  providers: [EditService],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent extends BaseGridComponent implements OnInit {
  private _recorridos = signal<Recorrido[]>([]);
  private recorridoService = inject(RecorridoService);
  public recorridoActivo: Recorrido | null = null;

  ngOnInit(): void {
    this.autoFitColumns = true;
    this.iniciarResizeGrid(this.minusHeight);
    this.recorridoService.listar().subscribe(({ recorridos }) => {
      this._recorridos.set(recorridos);
    });

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

    const resp= await firstValueFrom(this.recorridoService.actualizar(this.recorridoActivo!))
    console.log(resp)
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




}
