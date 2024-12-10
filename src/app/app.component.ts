import { Component } from '@angular/core';

import { LayoutComponent } from './presentation/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'rock-it-ultra';

}
