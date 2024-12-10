export enum PlayerTypeEnum {
  HUMAN = 'Human',
  COMPUTER = 'Computer'
}

export enum GameWeaponsEnum {
  ROCK = 'Rock',
  PAPER = 'Paper',
  SCISSORS = 'Scissors'
}

export enum GameModeEnum {
  HUMAN_VS_COMPUTER = 'HUMAN_VS_COMPUTER',
  COMPUTER_VS_COMPUTER = 'COMPUTER_VS_COMPUTER'
}

export type PlayerType = keyof typeof PlayerTypeEnum;
export type GameModeType = keyof typeof GameModeEnum;
export type GameWeaponType = keyof typeof GameWeaponsEnum;