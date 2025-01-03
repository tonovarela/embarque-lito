import { Injectable } from '@angular/core';
import { Drawer, DrawerInterface, InstanceOptions } from 'flowbite';


@Injectable({
  providedIn: 'root'
})
export class UiService {
  private drawer: DrawerInterface | undefined;
  constructor() { }

  cargarSidebar() {        
    const options = {
      placement: 'left',
      backdrop: false,
      bodyScrolling: false,
      edge: false,
      edgeOffset: ''
    };
    const instanceOptions: InstanceOptions = {
      id: 'logo-sidebar',
      override: false
    };
    const $targetEl = document.getElementById('logo-sidebar');
    this.drawer = new Drawer($targetEl, options, instanceOptions);
    this.drawer.init();
  }
  toggleSidebar() {
    this.drawer!.toggle();
  }
  closeSidebar() {
    if (this.drawer!.isVisible()) {
      this.drawer!.hide();
    }
  }

}
