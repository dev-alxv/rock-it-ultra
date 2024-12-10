import { TestBed } from '@angular/core/testing';

import { GameModeType } from '../../../domain/enums/game.enums';
import { IGameWeapon, IPlayer } from '../../../domain/interfaces/game.interfaces';
import { LogicService } from './logic.service';

describe('LogicService', () => {
  let service: LogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a random number within the specified range', () => {
    const min = 1;
    const max = 10;
    const randomNumber = service['generateRandomNumber'](min, max);
    expect(randomNumber).toBeGreaterThanOrEqual(min);
    expect(randomNumber).toBeLessThanOrEqual(max);
  });

  it('should choose a random weapon from the provided list', () => {
    const weapons: IGameWeapon[] = [
      { type: 'ROCK', icon: 'rock-icon' },
      { type: 'PAPER', icon: 'paper-icon' },
      { type: 'SCISSORS', icon: 'scissors-icon' }
    ];
    const chosenWeapon = service['chooseRandomWeapon'](weapons);
    expect(weapons).toContain(chosenWeapon);
  });

  it('should correctly determine the more powerful weapon', () => {
    const player1: IPlayer = { name: 'Player 1', type: 'HUMAN', chosenWeapon: { type: 'ROCK', icon: 'rock-icon' }, score: 0 };
    const player2: IPlayer = { name: 'Player 2', type: 'COMPUTER', chosenWeapon: { type: 'SCISSORS', icon: 'scissors-icon' }, score: 0 };
    const winningWeapon = service['checkWeaponPower'](player1, player2);
    expect(winningWeapon.type).toBe('ROCK');
  });

  it('should set a random weapon for the computer', () => {
    const weapons: IGameWeapon[] = [
      { type: 'ROCK', icon: 'rock-icon' },
      { type: 'PAPER', icon: 'paper-icon' },
      { type: 'SCISSORS', icon: 'scissors-icon' }
    ];
    const computerWeapon = service.setComputerWeapon(weapons);
    expect(weapons).toContain(computerWeapon);
  });

  it('should determine the winner between two players', () => {
    const players: IPlayer[] = [
      { name: 'Player 1', type: 'HUMAN', chosenWeapon: { type: 'ROCK', icon: 'rock-icon' }, score: 0 },
      { name: 'Player 2', type: 'COMPUTER', chosenWeapon: { type: 'SCISSORS', icon: 'scissors-icon' }, score: 0 }
    ];
    const gameMode: GameModeType = 'HUMAN_VS_COMPUTER';
    const winner = service.getWinner(players, gameMode);
    expect(winner).toEqual({ name: 'Player 1', type: 'HUMAN', chosenWeapon: { type: 'ROCK', icon: 'rock-icon' }, score: 1 });
  });

  it('should return undefined if there is a tie', () => {
    const players: IPlayer[] = [
      { name: 'Player 1', type: 'HUMAN', chosenWeapon: { type: 'ROCK', icon: 'rock-icon' }, score: 0 },
      { name: 'Player 2', type: 'COMPUTER', chosenWeapon: { type: 'ROCK', icon: 'rock-icon' }, score: 0 }
    ];
    const gameMode: GameModeType = 'HUMAN_VS_COMPUTER';
    const winner = service.getWinner(players, gameMode);
    expect(winner).toBeUndefined();
  });
});
