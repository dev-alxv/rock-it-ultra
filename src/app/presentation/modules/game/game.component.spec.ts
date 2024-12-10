import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { IGameState } from '../../../domain/interfaces/game.config';
import { IGameWeapon } from '../../../domain/interfaces/game.interfaces';
import { GameService } from '../../services/game/game.service';
import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameService: jasmine.SpyObj<GameService>;

  beforeEach(async () => {
    const initialState: IGameState = {
      winnerBoard: { winner: null, message: '' },
      gameMode: 'HUMAN_VS_COMPUTER',
      players: [],
      gameStarted: false,
      gameWeaponsList: []
    };

    const gameServiceSpy = jasmine.createSpyObj('GameService', ['playWithWeapon', 'computerPlay', 'finishGame'], {
      gameStateStream$: of(initialState)
    });

    await TestBed.configureTestingModule({
      imports: [GameComponent], // Add GameComponent to imports instead of declarations
      providers: [
        { provide: GameService, useValue: gameServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedWeapon and uiIntentInProgress on onPlayerWeaponSelection', () => {
    const weapon: IGameWeapon = { type: 'ROCK', icon: '✊' };
    component.onPlayerWeaponSelection(weapon);
    expect(component.selectedWeapon).toBe(weapon);
    expect(component.uiIntentInProgress).toBeTrue();
    expect(gameService.playWithWeapon).toHaveBeenCalledWith(weapon);
  });

  it('should set uiIntentInProgress on onComputerVsComputerPlay', () => {
    component.onComputerVsComputerPlay();
    expect(component.uiIntentInProgress).toBeTrue();
    expect(gameService.computerPlay).toHaveBeenCalled();
  });

  it('should call finishGame on onNewGame', () => {
    component.onNewGame();
    expect(gameService.finishGame).toHaveBeenCalled();
  });

});