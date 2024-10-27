import "@/gridsystem.css";
import { useState, useEffect } from "react";
import { Grid, GridPoint, GridStates } from "../Grids";

function GridSystem({
	gridArray,
	startPoint,
	endPoint,
	gridSetStartPosition,
	gridSetEndPosition,
	onGridAdd,
	onGridClear,
}: {
	gridArray: Grid[][];
	startPoint: GridPoint | undefined;
	endPoint: GridPoint | undefined;
	gridSetStartPosition: Function;
	gridSetEndPosition: Function;
	onGridAdd: Function;
	onGridClear: Function;
}) {
	const enum ClickStatuses {
		"UNCLICKED" = "UNCLICKED",
		"ADD" = "ADD",
		"CLEAR" = "CLEAR",
	}

	const [clickStatus, setClickStatus] = useState<ClickStatuses>(
		ClickStatuses.UNCLICKED
	);
	const [previousClick, setPreviousClick] = useState<GridPoint | null>();

	useEffect(() => {
		window.addEventListener("mousedown", (e) => {
			if (e.button === 0) setClickStatus(ClickStatuses.ADD);
			else if (e.button === 2) setClickStatus(ClickStatuses.CLEAR);
		});

		window.addEventListener("mouseup", (e) => {
			setClickStatus(ClickStatuses.UNCLICKED);
		});
	}, []);

	return (
		<div className="gridContainer flex flex-ver">
			{/* {JSON.stringify(previousClick)} */}
			{gridArray &&
				gridArray.map((row, index) => (
					<div key={index} className="gridRow flex flex-hor">
						{row &&
							row.map((gridValue, index2) => (
								<div
									className={`grid
										${gridValue.topWall ? "gridTopWall" : ""}
										${gridValue.bottomWall ? "gridBottomWall" : ""}
										${gridValue.leftWall ? "gridLeftWall" : ""}
										${gridValue.rightWall ? "gridRightWall" : ""}
										${gridValue.value === GridStates.START_POSITION ? "gridStart" : ""}
										${gridValue.value === GridStates.END_POSITION ? "gridEnd" : ""}
										${gridValue.value === GridStates.ITERATING ? "gridIterating" : ""}
									`.trim()}
									key={index2}
									onClick={(event) => {
										if (event.ctrlKey) {
											gridSetStartPosition({
												row: index,
												column: index2,
											});
										} else {
											setPreviousClick({ row: index, column: index2 });
										}
									}}
									onContextMenu={(event) => {
										event.preventDefault();
										if (event.ctrlKey)
											gridSetEndPosition({
												row: index,
												column: index2,
											});
									}}
									onMouseMove={() => {
										const currentPoint = {
											row: index,
											column: index2,
										} as GridPoint;
										if (clickStatus === ClickStatuses.ADD) {
											onGridAdd(previousClick, currentPoint);
											setPreviousClick(currentPoint);
										} else if (clickStatus === ClickStatuses.CLEAR) {
											onGridClear(previousClick, currentPoint);
											setPreviousClick(currentPoint);
										} else {
											setPreviousClick(null);
										}
									}}
								></div>
							))}
					</div>
				))}
		</div>
	);
}

export default GridSystem;
