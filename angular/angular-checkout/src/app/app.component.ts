import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    console.log('environment: ', environment);
  }
}
