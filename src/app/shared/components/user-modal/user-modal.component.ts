import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-user-modal',
  imports: [],
  templateUrl: './user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent {
  private readonly authService = inject(AuthService);

  public user = computed(() => this.authService.user());
}
