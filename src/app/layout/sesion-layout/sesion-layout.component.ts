import { Component } from '@angular/core';

import {  RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/header/header.component';
import { SidebarComponent } from '@shared/sidebar/sidebar.component';


@Component({
  selector: 'app-sesion-layout',
  standalone: true,
  imports: [HeaderComponent,SidebarComponent,RouterOutlet],
  templateUrl: './sesion-layout.component.html',
  styleUrl: './sesion-layout.component.css'
})
export class SesionLayoutComponent {

}
