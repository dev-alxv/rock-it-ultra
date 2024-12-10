import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IGameWeapon, IPlayer } from '../../../domain/interfaces/game.interfaces';
import { LogicService } from '../logic/logic.service';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;
  let logicService: jasmine.SpyObj<LogicService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const logicServiceSpy = jasmine.createSpyObj('LogicService', ['setComputerWeapon', 'getWinner']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: LogicService, useValue: logicServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(GameService);
    logicService = TestBed.inject(LogicService) as jasmine.SpyObj<LogicService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start the game with HUMAN_VS_COMPUTER mode', () => {
    service.createHuman('Player 1');
    service.startGame('HUMAN_VS_COMPUTER');
    expect(service.gameState.gameMode).toBe('HUMAN_VS_COMPUTER');
    expect(service.gameState.gameStarted).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('should start the game with COMPUTER_VS_COMPUTER mode', () => {
    service.createHuman('Player 1');
    service.startGame('COMPUTER_VS_COMPUTER');
    expect(service.gameState.gameMode).toBe('COMPUTER_VS_COMPUTER');
    expect(service.gameState.gameStarted).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('should create a human player', () => {
    service.createHuman('Player 1');
    expect(service.gameState.players[0].name).toBe('Player 1');
    expect(service.gameState.players[0].type).toBe('HUMAN');
  });

  it('should play with a weapon', () => {
    const weapon: IGameWeapon = { type: 'ROCK', icon: '✊' };
    service.createHuman('Player 1');
    logicService.setComputerWeapon.and.returnValue({ type: 'PAPER', icon: '✋' });

    service.playWithWeapon(weapon);

    expect(service.gameState.players[0].chosenWeapon).toEqual(weapon);
    expect(service.gameState.players[1].chosenWeapon).toEqual({ type: 'PAPER', icon: '✋' });
  });

  it('should finish the game', () => {
    spyOn(localStorage, 'removeItem');
    service.finishGame();
    expect(localStorage.removeItem).toHaveBeenCalledWith(service['savedGameStateId']);
    expect(service.gameState.gameStarted).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should determine the winner and update the game state', () => {
    const players: IPlayer[] = [
      { name: 'Player 1', type: 'HUMAN', chosenWeapon: { type: 'ROCK', icon: '✊' }, score: 0 },
      { name: 'Player 2', type: 'COMPUTER', chosenWeapon: { type: 'SCISSORS', icon: '✌️' }, score: 0 }
    ];
    logicService.getWinner.and.returnValue(players[0]);

    service['runGameLogic'](players);

    expect(service.gameState.players[0].score).toBe(1);
    expect(service.gameState.winnerBoard.winner).toEqual(players[0]);
    expect(service.gameState.winnerBoard.message).toBe('Congrats!');
  });

  it('should handle a tie and update the game state', () => {
    const players: IPlayer[] = [
      { name: 'Player 1', type: 'HUMAN', chosenWeapon: { type: 'ROCK', icon: '✊' }, score: 0 },
      { name: 'Player 2', type: 'COMPUTER', chosenWeapon: { type: 'ROCK', icon: '✊' }, score: 0 }
    ];
    logicService.getWinner.and.returnValue(undefined);

    service['runGameLogic'](players);

    expect(service.gameState.winnerBoard.winner).toBeNull();
    expect(service.gameState.winnerBoard.message).toBe('It\'s a tie!');
  });
});