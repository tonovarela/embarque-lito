import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { delay, Subject, switchMap, tap } from 'rxjs';
import { SearchComponent } from '../svg';
import { MetricsService } from '@app/services/metrics.service';
import { OrdenMetrics } from '@app/interface/ResponseOrdenMetrics';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [PrimeNgModule,FormsModule,SearchComponent],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent {

  public valorQuery: string = "";
  private valorQuerySubject: Subject<string> = new Subject<string>();  
  metricsService = inject(MetricsService);
  public cargandoBusqueda = signal(false);
  public OPsBusqueda = signal<OrdenMetrics[]>([]);
  filteredResults: string[] = [];
  @Input() hasError: boolean =false;
  @Output() onSelect = new EventEmitter<string>();

  async _onSelect({ value }: any) {    
    this.onSelect.emit(value.op);
    this.valorQuery = "";
  }

  constructor() {   

    this.valorQuerySubject.pipe(
      tap(async() => {        
        this.cargandoBusqueda.set(true);
      }),
      delay(1100),
      switchMap(query =>  this.metricsService.buscar(query))
    ).subscribe((response) => {    
      this.cargandoBusqueda.set(false);
      this.OPsBusqueda.set(response.ordenes);
    })

  }  

  OnQueryChanged() {    
    this.OPsBusqueda.set([]);
    if (this.valorQuery.length < 3) {
      return;
    }    
    this.valorQuerySubject.next(this.valorQuery);

  }

}
