import { Routes } from '@angular/router';

import { gameGuard } from './game.guard';
import { WelcomeComponent } from './presentation/modules/welcome/welcome.component';

export const routes: Routes = [

  {
    path: 'welcome',
    component: WelcomeComponent
  },

  {
    path: 'game',
    loadComponent: () => import('./presentation/modules/game/game.component').then(m => m.GameComponent),
    canActivate: [gameGuard]
  },

  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'welcome'
  }
];
