export const enum GridStates {
	"DEFAULT" = 0,
	"START_POSITION" = 1,
	"END_POSITION" = 2,
	"ITERATING" = 3,
}

export type Grid = {
	topWall: boolean;
	bottomWall: boolean;
	leftWall: boolean;
	rightWall: boolean;
	value: GridStates;
};

export type GridPoint = {
	row: number;
	column: number;
};

export const createWalledGrid = () => {
	return {
		topWall: true,
		bottomWall: true,
		leftWall: true,
		rightWall: true,
		value: GridStates.DEFAULT,
	} as Grid;
};