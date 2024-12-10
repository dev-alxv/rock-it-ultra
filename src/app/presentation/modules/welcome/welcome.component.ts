import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Router } from '@angular/router';
import { GameModeType } from '../../../domain/enums/game.enums';
import { IGameState } from '../../../domain/interfaces/game.config';
import { IPlayer } from '../../../domain/interfaces/game.interfaces';
import { GameService } from '../../services/game/game.service';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';

@Component({
  selector: 'rock-it-ultra-welcome',
  standalone: true,
  imports: [
    UiCoreModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

  public userName: string = '';
  public userNameInput: string = '';
  public uiRequestInProgress: boolean = false;

  public gameStateStream$: Observable<IGameState>;

  constructor(
    private readonly gameService: GameService,
    private readonly router: Router
  ) {

    if (this.gameService.gameState.gameStarted) {
      this.router.navigate(['/game']);
    }

    this.gameStateStream$ = this.gameService.gameStateStream$
      .pipe(
        tap((state: IGameState) => {

          this.uiRequestInProgress = false;

          if (state.players.length) {
            this.userName = state.players.find((player: IPlayer) => player.type === 'HUMAN')?.name || '';
          }
        })
      )
  }

  public onSetUserName(): void {

    this.uiRequestInProgress = true;
    this.gameService.createHuman(this.userNameInput);
  }

  public onStartGame(mode: GameModeType): void {

    this.uiRequestInProgress = true;
    this.gameService.startGame(mode);
  }
}
