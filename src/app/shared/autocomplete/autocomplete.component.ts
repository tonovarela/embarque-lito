import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { delay, of, Subject, switchMap, tap } from 'rxjs';
import { SearchComponent } from '../svg';
import { opsBusqueda } from '@app/data/Orden.data';

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
  public cargandoBusqueda = signal(false);
  public OPsBusqueda = signal<any[]>([]);
  filteredResults: string[] = [];
  @Output() onSelect = new EventEmitter<string>();

  async _onSelect({ value }: any) {    
    this.onSelect.emit(value.op);
    this.valorQuery = "";
  }

  constructor() {   

    this.valorQuerySubject.pipe(
      tap(() => this.cargandoBusqueda.set(true)),
      delay(1100),
      switchMap(query => { return of({ ordenes: opsBusqueda() }) })
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
