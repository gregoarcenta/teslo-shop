import { Component, inject, OnInit } from '@angular/core';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@/shared/components/navbar/navbar.component';
import { AuthService } from '@/core/services/auth.service';

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
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.flowbiteService.loadFlowbite(() => {
      console.log('Flowbite loaded');
    });

    this.authService.isAuthenticated().subscribe();
  }
}
