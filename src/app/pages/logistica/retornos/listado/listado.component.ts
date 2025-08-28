import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { ResponseRetornos, Retorno } from '@app/interface/responses';
import { RetornoService } from '@app/services/retorno.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listado',
  standalone: true,
  
  imports:[SynfusionModule,FabbuttonComponent,CommonModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListadoComponent   extends BaseGridComponent implements OnInit
{
  private _retornos = signal<Retorno[]>([]);
  public  retornos = computed(() => this._retornos().map((r) => ({ ...r,tipoRetorno:r.tipo=='R'?'Rechazo':'Devolución' })));
  retornoService = inject(RetornoService);

  cargando = signal(false);
  ngOnInit(): void {
    this.autoFitColumns = false;
    this.iniciarResizeGrid(0.27);    
    this.cargarInformacion();
  }

  async cargarInformacion() {
    this.cargando.set(true);
    try {
      const resp = await firstValueFrom<ResponseRetornos>(
        this.retornoService.listar()
      );
      this._retornos.set(resp.retornos);
    } catch (error) {
      console.error(error);
    } finally {
      this.cargando.set(false);
    }
  }
}
