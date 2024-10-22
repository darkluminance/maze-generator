import "@/topbar.css";

function Topbar({
	resetClick,
	toggleBorders,
	saveMaze,
	showInfoModal,
}: {
	resetClick: Function;
	toggleBorders: Function;
	saveMaze: Function;
	showInfoModal: Function;
}) {
	return (
		<div className="topbarContainer pa-1 flex justify-space-between">
			<div className="flex flex-center-ver flex-gap-1">
				<button onClick={() => resetClick()}>Reset</button>
				<button onClick={() => toggleBorders()}>Toggle Borders</button>
				<button onClick={() => saveMaze()}>Save maze</button>
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
