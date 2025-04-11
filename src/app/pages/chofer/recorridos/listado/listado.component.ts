import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { obtenerValorNumerico, NumberFormatter } from '@app/helpers/validators';
import { Recorrido } from '@app/interface/models';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { RecorridoService, UiService } from '@app/services';

import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [SynfusionModule,  CommonModule, PrimeNgModule, FormsModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListadoComponent extends BaseGridComponent implements OnInit {
  private router= inject(Router);
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

     await firstValueFrom(this.recorridoService.actualizar(this.recorridoActivo!))    
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

  irNuevo(){
    this.router.navigate(['chofer/recorridos/nuevo']);
  }




}

