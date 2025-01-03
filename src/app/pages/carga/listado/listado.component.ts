import { Component, OnInit } from '@angular/core';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';

@Component({  
  standalone: true,
  imports: [FabbuttonComponent],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent implements OnInit {
  ngOnInit(): void {
    
  }
}
