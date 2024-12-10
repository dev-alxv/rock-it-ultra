import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';

import { IGameState } from '../../../domain/interfaces/game.config';
import { IGameWeapon } from '../../../domain/interfaces/game.interfaces';
import { GameService } from '../../services/game/game.service';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';

@Component({
  selector: 'rock-it-ultra-game',
  standalone: true,
  imports: [
    UiCoreModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  public gameStateStream$: Observable<IGameState>;

  public uiIntentInProgress: boolean = false;
  public selectedWeapon: IGameWeapon | undefined;

  constructor(
    private readonly gameService: GameService
  ) {

    this.gameStateStream$ = this.gameService.gameStateStream$
      .pipe(
        map((state: IGameState) => {

          if (state.winnerBoard.message !== '') {

            this.uiIntentInProgress = false;
          }

          if (state.gameMode === 'COMPUTER_VS_COMPUTER') {

            const modifiedState: IGameState = {
              ...state,
              players: [
                ...state.players.filter((player) => player.type === 'COMPUTER')
              ]
            };

            return modifiedState;
          }

          return state;
        })
      );
  }

  public onPlayerWeaponSelection(weaponSelected: IGameWeapon) {

    this.selectedWeapon = weaponSelected;
    this.uiIntentInProgress = true;

    this.gameService.playWithWeapon(weaponSelected);
  }

  public onComputerVsComputerPlay(): void {

    this.uiIntentInProgress = true;
    this.gameService.computerPlay();
  }

  public onNewGame(): void {

    this.gameService.finishGame();
  }
}
