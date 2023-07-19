import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotifierService } from './notifier.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifierComponent {
  event$: Observable<number>;

  constructor(private notifier: NotifierService) {
    this.event$ = notifier.getNotifierEvent();
  }

  onRemoveMessage() {
    this.notifier.removeEvent();
  }
}
