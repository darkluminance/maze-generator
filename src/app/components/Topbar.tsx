import "@/topbar.css";

function Topbar({
	resetClick,
	saveMaze,
	showInfoModal,
	startMazeGeneration,
}: {
	resetClick: Function;
	saveMaze: Function;
	showInfoModal: Function;
	startMazeGeneration: Function;
}) {
	return (
		<div className="topbarContainer pa-1 flex justify-space-between">
			<div className="flex flex-center-ver flex-gap-1">
				<button onClick={() => resetClick()}>Reset</button>
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
