import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, delay, Observable } from 'rxjs';

import { GameModeType, GameWeaponType, PlayerType } from '../../../domain/enums/game.enums';
import { IGameState } from '../../../domain/interfaces/game.config';
import { IGameWeapon, IPlayer } from '../../../domain/interfaces/game.interfaces';
import { LogicService } from '../logic/logic.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly gameState$: BehaviorSubject<IGameState>;

  private readonly initialGameState: IGameState | undefined;
  private readonly savedGameStateId: string = 'rockItGameState';
  private readonly savedGameState: string | null;

  public readonly gameStateStream$: Observable<IGameState>;

  constructor(
    private readonly logicService: LogicService,
    private readonly router: Router
  ) {

    let initialGameState: IGameState = {
      gameStarted: false,
      gameMode: 'HUMAN_VS_COMPUTER',
      players: [],
      gameWeaponsList: [
        this.createWeapon('ROCK', '✊'),
        this.createWeapon('PAPER', '✋'),
        this.createWeapon('SCISSORS', '✌️')
      ],
      winnerBoard: {
        winner: null,
        message: ''
      }
    };

    this.initialGameState = initialGameState;

    this.savedGameState = localStorage.getItem(this.savedGameStateId);

    if (this.savedGameState) {

      const gameState: IGameState = JSON.parse(this.savedGameState) as IGameState;

      initialGameState = {
        ...initialGameState,
        ...gameState
      };
    }

    this.gameState$ = new BehaviorSubject<IGameState>(initialGameState);
    this.gameStateStream$ = this.gameState$.asObservable()
      .pipe(
        delay(Math.floor(Math.random() * 500) + 600) // Simulate network latency
      );
  }

  /**
   * Retrieves the current game state.
   * 
   * @returns {IGameState} The current state of the game.
   */
  public get gameState(): IGameState {
    return this.gameState$.getValue();
  }

  /**
   * Adds a new human player to the game configuration.
   *
   * @param userName - The name of the human player to be added.
   */
  public createHuman(userName: string): void {

    this.setState({
      players: [
        ...this.gameState.players,
        this.createPlayer(userName, 'HUMAN')
      ]
    });
  }

  /**
   * Starts the game with the selected game mode.
   *
   * Depending on the selected game mode, it sets the game state with the appropriate players
   * and marks the game as started. It also saves the game state to local storage and navigates
   * to the game route.
   *
   * @param {GameModeType} selectedGameMode - The selected game mode, which can be either 'HUMAN_VS_COMPUTER' or 'COMPUTER_VS_COMPUTER'.
   */
  public startGame(selectedGameMode: GameModeType): void {

    let gameConfig: Partial<IGameState> = {
      gameMode: selectedGameMode,
      gameStarted: true,
      players: []
    };

    if (selectedGameMode === 'HUMAN_VS_COMPUTER') {

      gameConfig = {
        ...gameConfig,
        players: [
          ...this.gameState.players,
          this.createPlayer('Angry Computer', 'COMPUTER')
        ]
      };

    } else if (selectedGameMode === 'COMPUTER_VS_COMPUTER') {

      gameConfig = {
        ...gameConfig,
        players: [
          ...this.gameState.players,
          this.createPlayer('Angry Computer', 'COMPUTER'),
          this.createPlayer('Happy Computer', 'COMPUTER')
        ]
      };
    }

    this.setState(gameConfig);
    this.router.navigate(['/game']);
  }


  /**
   * Assigns a weapon to each player and runs the game logic.
   * 
   * @param weapon - The weapon chosen by the human player.
   * 
   * The method iterates over the list of players and assigns the chosen weapon to the human player.
   * For the computer player, it assigns a weapon determined by the logic service.
   * After assigning weapons, it runs the game logic with the updated list of players.
   */
  public playWithWeapon(weapon: IGameWeapon): void {

    const players: IPlayer[] = this.gameState.players.map((player: IPlayer) => {

      if (player.type === 'HUMAN') {
        return {
          ...player,
          chosenWeapon: weapon
        };
      }

      if (player.type === 'COMPUTER') {
        return {
          ...player,
          chosenWeapon: this.logicService.setComputerWeapon(this.gameState.gameWeaponsList)
        };
      }

      return player;
    });

    this.runGameLogic(players);
  }

  /**
   * Executes the computer player's move by selecting a weapon for each computer player
   * and then running the game logic with the updated players.
   *
   * This method iterates over the list of players in the game state. For each player
   * that is of type 'COMPUTER', it sets a chosen weapon using the logic service and
   * updates the player object. After updating all players, it runs the game logic
   * with the new list of players.
   *
   * @returns {void}
   */
  public computerPlay(): void {

    const players: IPlayer[] = this.gameState.players.map((player: IPlayer) => {

      if (player.type === 'COMPUTER') {
        return {
          ...player,
          chosenWeapon: this.logicService.setComputerWeapon(this.gameState.gameWeaponsList)
        };
      }

      return player;
    });

    this.runGameLogic(players);
  }

  /**
   * Ends the current game session by performing the following actions:
   * 1. Removes the saved game state from local storage.
   * 2. Resets the game state to its initial state.
   * 3. Navigates the user back to the home page.
   *
   * @returns {void}
   */
  public finishGame(): void {

    localStorage.removeItem(this.savedGameStateId);
    this.setState(this.initialGameState!);

    this.router.navigate(['/']);
  }

  /**
   * Executes the game logic to determine the winner and update the game state.
   *
   * @param players - An array of players participating in the game.
   *
   * The method performs the following steps:
   * 1. Determines the winner player using the logicService.
   * 2. Updates the score of the winning player.
   *    - If the winner is a human player, increments the score of the human player.
   *    - If the winner is a computer player, increments the score of the computer player.
   * 3. Updates the game state with the new players' scores and the winner board message.
   *    - If there is a winner, sets the winner and a congratulatory message.
   *    - If there is no winner, sets the winner to null and a tie message.
   */
  private runGameLogic(players: IPlayer[]): void {

    const winnerPlayer: IPlayer | undefined = this.logicService.getWinner(players, this.gameState.gameMode);

    this.setState({
      players: [
        ...players.map((player: IPlayer) => {

          if (winnerPlayer && player.type === 'HUMAN' && winnerPlayer.type === 'HUMAN') {

            player.score++;
          } else if (winnerPlayer && player.computerId === winnerPlayer?.computerId) {

            player.score++;
          }

          return player;
        })
      ],
      winnerBoard: {
        winner: winnerPlayer ?? null,
        message: winnerPlayer ? 'Congrats!' : 'It\'s a tie!'
      }
    });
  }

  /**
   * Creates a new player object.
   *
   * @param userName - The name of the player.
   * @param type - The type of the player, either 'HUMAN' or 'COMPUTER'.
   * @returns An object representing the player.
   */
  private createPlayer(userName: string, type: PlayerType): IPlayer {

    return {
      name: userName,
      ...(type === 'COMPUTER') && { computerId: Math.random().toString(36).substring(2, 11) },
      type,
      chosenWeapon: null,
      score: 0
    };
  }

  /**
   * Creates a new weapon object with the specified type and icon.
   *
   * @param {GameWeaponType} type - The type of the weapon.
   * @param {string} icon - The icon representing the weapon.
   * @returns {IGameWeapon} The newly created weapon object.
   */
  private createWeapon(type: GameWeaponType, icon: string): IGameWeapon {

    return {
      type,
      icon: icon
    };
  }

  /**
   * Saves the current game state to the local storage.
   * The saved state includes whether the game has started, the game mode,
   * and a list of players with their names, types, computer IDs, and scores.
   * The chosen weapon for each player is set to null in the saved state.
   * 
   * @private
   */
  private saveGame(): void {

    localStorage.setItem(this.savedGameStateId, JSON.stringify({
      gameStarted: this.gameState.gameStarted,
      gameMode: this.gameState.gameMode,
      players: [
        ...this.gameState.players.map((player: IPlayer) => {
          return {
            name: player.name,
            type: player.type,
            computerId: player.computerId,
            chosenWeapon: null,
            score: player.score
          };
        })
      ]
    }));
  }

  /**
 * Updates the current game configuration state with the provided partial state.
 * Merges the existing game configuration with the new state and emits the updated state.
 *
 * @param state - A partial game configuration object containing the properties to be updated.
 * 
 * @private
 */
  private setState(state: Partial<IGameState>): void {
    this.gameState$.next({
      ...this.gameState,
      ...state
    });

    this.saveGame();

    console.log('Game state updated:', this.gameState);
  }
}
