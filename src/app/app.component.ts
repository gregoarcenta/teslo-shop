import { Component, inject, OnInit } from '@angular/core';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <router-outlet />
  `,
})
export class AppComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService);

  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
    });
  }
}
