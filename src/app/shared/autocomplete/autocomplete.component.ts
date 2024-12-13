import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { of, Subject, switchMap, tap } from 'rxjs';
import { SearchComponent } from '../svg';

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
      switchMap(query => { return of({ ordenes: [
        {op: 'Orden 1',descripcion: 'Descripcion 1'},
        {op: 'Orden 2',descripcion: 'Descripcion 2'},
        {op: 'Orden 3',descripcion: 'Descripcion 3'},
        {op: 'Orden 4',descripcion: 'Descripcion 4'},
      ] }) })
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
