import "@/topbar.css";

function Topbar({
	resetClick,
	toggleBorders,
	saveMaze,
	showInfoModal,
	fillBlack,
	fillWhite,
	startMazeGeneration,
}: {
	resetClick: Function;
	toggleBorders: Function;
	saveMaze: Function;
	showInfoModal: Function;
	fillBlack: Function;
	fillWhite: Function;
	startMazeGeneration: Function;
}) {
	return (
		<div className="topbarContainer pa-1 flex justify-space-between">
			<div className="flex flex-center-ver flex-gap-1">
				<button onClick={() => resetClick()}>Reset</button>
				<button onClick={() => toggleBorders()}>Toggle Borders</button>
				<button onClick={() => fillBlack()}>Fill Black</button>
				<button onClick={() => fillWhite()}>Fill White</button>
				<button onClick={() => startMazeGeneration()}>Generate Maze</button>
				<button onClick={() => saveMaze()}>Save Maze</button>
			</div>
			<div>
				<button className="infoBtn" onClick={() => showInfoModal()}>
					?
				</button>
			</div>
		</div>
	);
}

export default Topbar;
