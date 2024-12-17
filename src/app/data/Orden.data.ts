import { signal } from "@angular/core";

 export const opsData = signal<string[]>([ ]);


  export const opsBusqueda = signal([
    {op: 'L45926',descripcion: 'Op test 1'},
    {op: 'L45927',descripcion: 'Op test 2'},
    {op: 'L45928',descripcion: 'Op test 3'},
    {op: 'L45929',descripcion: 'Op test 4'},
    {op: 'L45930',descripcion: 'Op test 5'},
    {op: 'L45931',descripcion: 'Op test 6'},
    {op: 'L45932',descripcion: 'Op test 7'},
  ])