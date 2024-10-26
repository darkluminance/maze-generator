"use client";

import { createWalledGrid, Grid, GridStates, GridPoint } from "./Grids";
import GridSystem from "@/components/GridSystem";
import Topbar from "@/components/Topbar";
import styles from "@/page.module.css";
import "@/page.css";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
	let ROWS: number;
	let COLUMNS: number;
	let VISITED_ARRAY: number[][] = [];
	// todo: check using usestate with setdim function

	const [gridArray, setGridArray] = useState<Grid[][]>([]);
	const [gridStartPoint, setGridStartPoint] = useState<GridPoint>();
	const [gridEndPoint, setGridEndPoint] = useState<GridPoint>();
	const [isGenerating, setIsGenerating] = useState(false);

	const infoModalRef = useRef<HTMLDialogElement>(null);

	const gridAddPath = (previousPoint: GridPoint, currentPoint: GridPoint) => {
		if (previousPoint === currentPoint) return;
		if (previousPoint === null || currentPoint === null) return;

		let array = [...gridArray];
		const wallsToOpen = checkWhichWallToOpen(previousPoint, currentPoint);
		if (!wallsToOpen) return;

		array[previousPoint.row][previousPoint.column][wallsToOpen[0]] = false;
		array[currentPoint.row][currentPoint.column][wallsToOpen[1]] = false;
		setGridArray([...array]);
	};

	const gridAddWall = (previousPoint: GridPoint, currentPoint: GridPoint) => {
		if (previousPoint === currentPoint) return;
		if (previousPoint === null || currentPoint === null) return;

		let array = [...gridArray];
		const wallsToOpen = checkWhichWallToOpen(previousPoint, currentPoint);
		if (!wallsToOpen) return;

		array[previousPoint.row][previousPoint.column][wallsToOpen[0]] = true;
		array[currentPoint.row][currentPoint.column][wallsToOpen[1]] = true;
		setGridArray([...array]);
	};

	const gridSetStartPosition = (newPoint: GridPoint) => {
		let array = [...gridArray];
		const oldPoint = gridStartPoint as GridPoint;
		array[oldPoint.row][oldPoint.column].value = GridStates.DEFAULT;
		array[newPoint.row][newPoint.column].value = GridStates.START_POSITION;
		setGridArray([...array]);
		setGridStartPoint(newPoint);
	};

	const gridSetEndPosition = (newPoint: GridPoint) => {
		let array = [...gridArray];
		const oldPoint = gridEndPoint as GridPoint;
		array[oldPoint.row][oldPoint.column].value = GridStates.DEFAULT;
		array[newPoint.row][newPoint.column].value = GridStates.END_POSITION;
		setGridArray([...array]);
		setGridEndPoint(newPoint);
	};

	const checkWhichWallToOpen = (
		previousPoint: GridPoint,
		currentPoint: GridPoint
	) => {
		if (previousPoint.row > currentPoint.row) return ["topWall", "bottomWall"];
		if (previousPoint.row < currentPoint.row) return ["bottomWall", "topWall"];
		if (previousPoint.column > currentPoint.column)
			return ["leftWall", "rightWall"];
		if (previousPoint.column < currentPoint.column)
			return ["rightWall", "leftWall"];
		else return;
	};

	const resetGrid = () => {
		setDimensions();

		let array: Grid[][] = [];

		for (let row = 0; row < ROWS; row++) {
			let rowArray: Grid[] = [];
			let rowVisited: number[] = [];

			for (let column = 0; column < COLUMNS; column++) {
				const grid = createWalledGrid();
				rowArray.push(grid);
				rowVisited.push(0);
			}

			array.push(rowArray);
			VISITED_ARRAY.push(rowVisited);
		}

		const startPoint = { row: 0, column: 0 };
		const endPoint = { row: ROWS - 1, column: COLUMNS - 1 };

		setGridStartPoint(startPoint);
		setGridEndPoint(endPoint);
		array[startPoint.row][startPoint.column].value = GridStates.START_POSITION;
		array[endPoint.row][endPoint.column].value = GridStates.END_POSITION;

		setGridArray([...array]);
	};

	/* const toggleBorders = () => {
		setDimensions();

		let array = [...gridArray];
		const borderValue = isGridBordered() ? 0 : 1;

		for (let column = 0; column < COLUMNS; column++) {
			array[0][column] = borderValue;
			array[ROWS - 1][column] = borderValue;
		}

		for (let row = 1; row < ROWS - 1; row++) {
			array[row][0] = borderValue;
			array[row][COLUMNS - 1] = borderValue;
		}

		setGridArray([...array]);
	}; */

	/* const isGridBordered = () => {
		for (let column = 0; column < COLUMNS; column++) {
			if (gridArray[0][column] === 0 || gridArray[ROWS - 1][column] === 0) {
				return false;
			}
		}

		for (let row = 1; row < ROWS - 1; row++) {
			if (gridArray[row][0] === 0 || gridArray[row][COLUMNS - 1] === 0) {
				return false;
			}
		}

		return true;
	}; */

	const resizeGrid = () => {
		let array = [...gridArray];

		array.length = ROWS;
		for (let row = 0; row < ROWS; row++) {
			array[row].length = COLUMNS;
		}

		setGridArray([...array]);
	};

	const setDimensions = () => {
		const GRID_SIZE = Number(
			getComputedStyle(document.documentElement)
				.getPropertyValue("--grid-size")
				.split("px")[0]
		);

		const TOPBAR_HEIGHT = Number(
			getComputedStyle(document.documentElement)
				.getPropertyValue("--topbar-height")
				.split("px")[0]
		);

		const { innerWidth: width, innerHeight: height } = window;

		ROWS = Math.floor((height - TOPBAR_HEIGHT) / GRID_SIZE);
		COLUMNS = Math.floor(width / GRID_SIZE) + 1;
	};

	const onResize = () => {
		// TODO: Keep existing array data
		// setDimensions();
		resetGrid();
	};

	const saveMaze = () => {
		const gridElement = document.querySelector(".gridContainer") as HTMLElement;

		// Get current date and time
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
		const day = String(now.getDate()).padStart(2, "0");
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");

		// Construct the dynamic file name
		const filename = `grid_${year}_${month}_${day}_${hours}_${minutes}_${seconds}.png`;

		html2canvas(gridElement).then((canvas) => {
			const link = document.createElement("a");
			link.download = filename;
			link.href = canvas.toDataURL();
			link.click();
		});
	};

	const getCellNeighbors = (point: GridPoint, adjacentCell: any) => {
		let neighbors: GridPoint[] = [];

		const row = point.row;
		const column = point.column;

		if (row > 0) neighbors.push({ row: row - 1, column: column });
		if (row < ROWS - 1) neighbors.push({ row: row + 1, column: column });
		if (column > 0) neighbors.push({ row: row, column: column - 1 });
		if (column < COLUMNS - 1) neighbors.push({ row: row, column: column + 1 });

		return neighbors.filter(
			(cell) => JSON.stringify(cell) !== JSON.stringify(adjacentCell)
		);
	};

	const shuffleArray = (array: GridPoint[]) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	let globalArray: Grid[][] = [];

	const startMazeGeneration = async () => {
		setDimensions();
		resetGrid();
		globalArray = [...gridArray];
		setIsGenerating(true);
		await generateMaze({ row: 0, column: 0 }, { row: 0, column: 0 });
		setIsGenerating(false);
	};

	// Maze generation
	const generateMaze = async (previousPoint: GridPoint, point: GridPoint) => {
		if (previousPoint !== point) {
			const wallToOpen = checkWhichWallToOpen(previousPoint, point);

			if (wallToOpen) {
				globalArray[previousPoint.row][previousPoint.column][wallToOpen[0]] =
					false;
				globalArray[point.row][point.column][wallToOpen[1]] = false;
				setGridArray([...globalArray]);
				await delay(10);
			}
		}
		VISITED_ARRAY[point.row][point.column] = 1;

		const neighbors = getCellNeighbors(point, null);
		const shuffledNeighbors = shuffleArray(neighbors);

		for (let i = 0; i < shuffledNeighbors.length; i++) {
			const neighbor = shuffledNeighbors[i];
			if (!VISITED_ARRAY[neighbor.row][neighbor.column])
				globalArray = await generateMaze(point, neighbor);
		}

		return globalArray;
	};

	const showInfoModal = () => {
		infoModalRef.current?.showModal();
	};

	const delay = (ms: number) => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	const addEventListeners = () => {
		window.addEventListener("resize", onResize);
	};

	useEffect(() => {
		addEventListeners();
		resetGrid();
	}, []);

	return (
		<>
			<dialog id="myDialog" ref={infoModalRef}>
				<button
					className="close-btn"
					id="closeDialogBtn"
					onClick={() => infoModalRef.current?.close()}
				>
					&times;
				</button>
				<h2>Instructions</h2>
				<br />
				<p> - Drag cells to add path</p>
				<p> - Right-click and drag to remove the paths</p>
				<p> - Ctrl + Click to change the start position (Green color)</p>
				<p> - Ctrl + Right Click to change the end position (Red color)</p>
				<br />
				<p>
					Source code:{" "}
					<a href="http://github.com/darkluminance/maze-generator">
						github.com/darkluminance/maze-generator
					</a>
				</p>
			</dialog>
			<div className={styles.container}>
				<main className={styles.main}>
					<div className={isGenerating ? "disabled" : ""}>
						<Topbar
							resetClick={resetGrid}
							saveMaze={saveMaze}
							showInfoModal={showInfoModal}
							startMazeGeneration={startMazeGeneration}
						></Topbar>
						<GridSystem
							gridArray={gridArray}
							startPoint={gridStartPoint}
							endPoint={gridEndPoint}
							gridSetStartPosition={gridSetStartPosition}
							gridSetEndPosition={gridSetEndPosition}
							onGridAdd={gridAddPath}
							onGridClear={gridAddWall}
						></GridSystem>
					</div>
				</main>
			</div>
		</>
	);
}
