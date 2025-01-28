import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundComponent {}
