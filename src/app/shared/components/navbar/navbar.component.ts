import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { initDropdowns } from 'flowbite';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterViewInit {
  private readonly dw = viewChild('userDropdownButton', { read: ElementRef });

  private readonly authService = inject(AuthService);
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly router = inject(Router);

  public showInputSearch = signal<boolean>(false);

  public isAuthenticated = computed(() => {
    return !!this.authService.user();
  });

  ngAfterViewInit(): void {
    this.flowbiteService.loadFlowbite(() => {
      initDropdowns();
    });
  }

  onToggleInputSearch() {
    this.showInputSearch.update((currentValue) => !currentValue);
  }

  login() {
    return this.router.navigate(['login']);
  }

  logout() {
    this.authService.logout();
    this.dw()?.nativeElement.focus();
    this.dw()?.nativeElement.click();
    return this.router.navigate(['login']);
  }
}
