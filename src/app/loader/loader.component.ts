import { Component } from '@angular/core';
import { LoaderService } from './loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  messages$: Observable<string[]>;

  constructor(private loader: LoaderService) {
    this.messages$ = loader.getLoaderMessages();
  }
}
