import { GameWeaponType, PlayerType } from "../enums/game.enums";

export interface IGameWeapon {
  type: GameWeaponType;
  icon: string;
}

export interface IGameWinnerBoard {
  winner: IPlayer | null;
  message: string;
}

export interface IPlayer {
  name: string;
  computerId?: string;
  type: PlayerType;
  chosenWeapon: IGameWeapon | null;
  score: number;
}