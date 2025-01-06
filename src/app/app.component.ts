import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UiService } from './services/ui.service';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule,HeaderComponent ,SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit,AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.uiService.cargarSidebar();
    }, 1000);
    
  }
  uiService = inject(UiService);
  ngOnInit(): void {
    initFlowbite();    
  }
  
}
