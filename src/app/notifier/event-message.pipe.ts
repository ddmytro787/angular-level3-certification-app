import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'eventMessage' })
export class EventMessagePipe implements PipeTransform {
  transform(eventCode: number): string {
    switch (eventCode) {
      case 1:
      case 2:
        return 'Create quiz request was failed due to incorrect input data';
      default:
        return 'Unknown server error';
    }
  }
}
