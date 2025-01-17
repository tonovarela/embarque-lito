import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';

import {  SpeedDialModule } from 'primeng/speeddial';
import {ChipsModule} from 'primeng/chips';



import { ChipModule } from 'primeng/chip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,    
  ],
  exports:[AutoCompleteModule,ChipModule,SpeedDialModule,ChipsModule]
})
export class PrimeNgModule { }
