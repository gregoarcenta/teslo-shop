import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pay-success',
  imports: [RouterLink],
  templateUrl: './pay-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PaySuccessComponent {}
