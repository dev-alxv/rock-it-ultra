import { Injectable } from '@angular/core';

import { GameModeType, GameWeaponType } from '../../../domain/enums/game.enums';
import { IGameWeapon, IPlayer } from '../../../domain/interfaces/game.interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  /**
   * A map that defines the power relationships between different game weapon types.
   * Each key-value pair represents a weapon and the weapon it can defeat.
   * 
   * @private
   * @readonly
   * @type {Map<GameWeaponType, GameWeaponType>}
   * 
   * @example
   * // Example usage:
   * // 'ROCK' defeats 'SCISSORS'
   * // 'PAPER' defeats 'ROCK'
   * // 'SCISSORS' defeats 'PAPER'
   */
  private readonly weaponPowerMap: Map<GameWeaponType, GameWeaponType> = new Map<GameWeaponType, GameWeaponType>([
    ['ROCK', 'SCISSORS'],
    ['PAPER', 'ROCK'],
    ['SCISSORS', 'PAPER']
  ]);

  constructor(

  ) { }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Selects a random weapon from the provided list of weapons.
   *
   * @param weapons - An array of IGameWeapon objects to choose from.
   * @returns A randomly selected IGameWeapon from the provided array.
   */
  private chooseRandomWeapon(weapons: IGameWeapon[]): IGameWeapon {
    return weapons[this.generateRandomNumber(0, weapons.length - 1)];
  }

  /**
   * Compares the chosen weapons of two players and determines the more powerful weapon.
   *
   * @param player1 - The first player, containing their chosen weapon.
   * @param player2 - The second player, containing their chosen weapon.
   * @returns The weapon that is more powerful based on the weapon power map.
   */
  private checkWeaponPower(player1: IPlayer, player2: IPlayer): IGameWeapon {

    const player1Weapon: IGameWeapon = player1.chosenWeapon!;
    const player2Weapon: IGameWeapon = player2.chosenWeapon!;

    if (this.weaponPowerMap.get(player1Weapon.type) === player2Weapon.type) {
      return player1Weapon;
    }

    return player2Weapon;
  }

  /**
   * Selects and sets a random weapon for the computer from the provided list of game weapon types.
   *
   * @param {IGameWeapon[]} gameWeaponTypes - An array of available game weapon types.
   * @returns {IGameWeapon} - The randomly chosen weapon for the computer.
   */
  public setComputerWeapon(gameWeaponTypes: IGameWeapon[]): IGameWeapon {
    return this.chooseRandomWeapon(gameWeaponTypes);
  }

  /**
   * Determines the winner between two players based on their chosen weapons and the game mode.
   *
   * @param players - An array of players participating in the game.
   * @param gameMode - The mode of the game, which can be 'HUMAN_VS_COMPUTER' or another type.
   * @returns The winning player with an updated score, or `undefined` if there is a tie.
   */
  public getWinner(players: IPlayer[], gameMode: GameModeType): IPlayer | undefined {

    const player1 = players[gameMode === 'HUMAN_VS_COMPUTER' ? 0 : 1];
    const player2 = players[gameMode === 'HUMAN_VS_COMPUTER' ? 1 : 2];

    if (player1.chosenWeapon?.type === player2.chosenWeapon?.type) {
      return undefined;
    }

    if (player1.chosenWeapon === this.checkWeaponPower(player1, player2)) {
      return {
        ...player1,
        score: player1.score + 1
      };
    }

    return {
      ...player2,
      score: player2.score + 1
    };
  }
}
