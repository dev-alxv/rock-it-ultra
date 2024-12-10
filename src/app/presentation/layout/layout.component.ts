import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UiCoreModule } from '../shared/modules/ui-core/ui-core.module';

@Component({
  selector: 'rock-it-ultra-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    UiCoreModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
