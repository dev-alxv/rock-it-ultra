import { GameModeType } from "../enums/game.enums";
import { IGameWeapon, IGameWinnerBoard, IPlayer } from "./game.interfaces";

export interface IGameState {
  gameStarted: boolean;
  gameMode: GameModeType;
  gameWeaponsList: IGameWeapon[];
  players: IPlayer[];
  winnerBoard: IGameWinnerBoard;
}