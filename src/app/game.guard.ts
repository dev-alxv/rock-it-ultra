import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { GameService } from './presentation/services/game/game.service';

export const gameGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const routerService: Router = inject(Router);
  const gameService: GameService = inject(GameService);

  if (gameService.gameState.gameStarted) {
    return true;
  }

  routerService.navigate(['/welcome']);

  return false;
};
