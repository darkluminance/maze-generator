import "@/topbar.css";

function Topbar({
	resetClick,
	saveMaze,
	showInfoModal,
	startMazeGeneration,
	setMazeSolvingAlgorithm,
	startMazeSolution,
}: {
	resetClick: Function;
	saveMaze: Function;
	showInfoModal: Function;
	startMazeGeneration: Function;
	setMazeSolvingAlgorithm: Function;
	startMazeSolution: Function;
}) {
	return (
		<div className="topbarContainer pa-1 flex justify-space-between">
			<div className="flex flex-center-ver flex-gap-1">
				<button onClick={() => resetClick()}>Reset</button>
				<button onClick={() => startMazeGeneration()}>Generate Maze</button>
				<button onClick={() => startMazeSolution()}>Solve Maze</button>
				<button onClick={() => saveMaze()}>Save Maze</button>
			</div>
			<div className="flex flex-center-ver flex-gap-1">
				{/* <div className="mazeAlgorithmDropdown flex flex-center-ver flex-gap-1">
					<label htmlFor="select">Maze solving algorithm</label>
					<select onChange={(e) => setMazeSolvingAlgorithm(e.target.value)}>
						<option value="maze-solve-dfs">DFS</option>
						<option value="maze-solve-djikstra">Djikstra</option>
					</select>
				</div> */}
				<button className="infoBtn" onClick={() => showInfoModal()}>
					?
				</button>
			</div>
		</div>
	);
}

export default Topbar;
