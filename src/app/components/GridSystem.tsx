import "@/gridsystem.css";
import { useState, useEffect } from "react";

function GridSystem({
	gridArray,
	onGridAdd,
	onGridClear,
	onGridSetStartPosition,
	onGridSetEndPosition,
}: {
	gridArray: Number[][];
	onGridAdd: Function;
	onGridClear: Function;
	onGridSetStartPosition: Function;
	onGridSetEndPosition: Function;
}) {
	const enum ClickStatuses {
		"UNCLICKED" = "UNCLICKED",
		"ADD" = "ADD",
		"CLEAR" = "CLEAR",
	}

	const [clickStatus, setClickStatus] = useState<ClickStatuses>(
		ClickStatuses.UNCLICKED
	);

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
			{/* {JSON.stringify(clickStatus)} */}
			{gridArray &&
				gridArray.map((row, index) => (
					<div key={index} className="gridRow flex flex-hor">
						{row &&
							row.map((gridValue, index2) => (
								<div
									className={
										gridValue === 1
											? "grid gridClicked gridObstacle"
											: gridValue === 2
											? "grid gridClicked gridStart"
											: gridValue === 3
											? "grid gridClicked gridEnd"
											: "grid "
									}
									key={index2}
									onClick={(event) => {
										if (event.ctrlKey) onGridSetStartPosition(index, index2);
										else onGridAdd(index, index2);
									}}
									onContextMenu={(event) => {
										event.preventDefault();
										if (event.ctrlKey) onGridSetEndPosition(index, index2);
										else onGridClear(index, index2);
									}}
									onMouseMove={() => {
										if (clickStatus === ClickStatuses.ADD)
											onGridAdd(index, index2);
										else if (clickStatus === ClickStatuses.CLEAR)
											onGridClear(index, index2);
									}}
								></div>
							))}
					</div>
				))}
		</div>
	);
}

export default GridSystem;
