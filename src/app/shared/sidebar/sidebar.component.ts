import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiService } from '@app/services/services/ui.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  uiService = inject(UiService);
  router = inject(Router);
  ngOnInit(): void {
   
  }

  irRuta(ruta: string) {
    this.router.navigate([ruta]);
    this.uiService.closeSidebar();



  }



}
