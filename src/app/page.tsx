"use client";

import { createWalledGrid, Grid, GridStates, GridPoint } from "./Grids";
import GridSystem from "@/components/GridSystem";
import Topbar from "@/components/Topbar";
import styles from "@/page.module.css";
import "@/page.css";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
	type WallKey = "topWall" | "bottomWall" | "leftWall" | "rightWall";

	let ROWS: number;
	let COLUMNS: number;
	let VISITED_ARRAY: number[][] = [];
	// todo: check using usestate with setdim function

	const [gridArray, setGridArray] = useState<Grid[][]>([]);
	const [gridStartPoint, setGridStartPoint] = useState<GridPoint>();
	const [gridEndPoint, setGridEndPoint] = useState<GridPoint>();
	const [isGenerating, setIsGenerating] = useState(false);
	const [animationSpeed, setAnimationSpeed] = useState(50);

	const infoModalRef = useRef<HTMLDialogElement>(null);

	const gridAddPath = (previousPoint: GridPoint, currentPoint: GridPoint) => {
		if (previousPoint === currentPoint) return;
		if (previousPoint === null || currentPoint === null) return;

		let array = [...gridArray];
		const wallsToOpen: [WallKey, WallKey] | undefined = checkWhichWallToOpen(
			previousPoint,
			currentPoint
		);
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
		if (gridArray[newPoint.row][newPoint.column].value !== GridStates.DEFAULT)
			return;

		let array = [...gridArray];
		const oldPoint = gridStartPoint as GridPoint;
		array[oldPoint.row][oldPoint.column].value = GridStates.DEFAULT;
		array[newPoint.row][newPoint.column].value = GridStates.START_POSITION;
		setGridArray([...array]);
		setGridStartPoint(newPoint);
	};

	const gridSetEndPosition = (newPoint: GridPoint) => {
		if (gridArray[newPoint.row][newPoint.column].value !== GridStates.DEFAULT)
			return;

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
	): [WallKey, WallKey] | undefined => {
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

			for (let column = 0; column < COLUMNS; column++) {
				const grid = createWalledGrid();
				rowArray.push(grid);
			}

			array.push(rowArray);
		}

		resetVisitedArray();

		const startPoint = { row: 0, column: 0 };
		const endPoint = { row: ROWS - 1, column: COLUMNS - 1 };

		setGridStartPoint(startPoint);
		setGridEndPoint(endPoint);
		array[startPoint.row][startPoint.column].value = GridStates.START_POSITION;
		array[endPoint.row][endPoint.column].value = GridStates.END_POSITION;

		setGridArray([...array]);
	};

	const resetVisitedArray = () => {
		VISITED_ARRAY = [];
		for (let row = 0; row < ROWS; row++) {
			let rowVisited: number[] = [];

			for (let column = 0; column < COLUMNS; column++) {
				const grid = createWalledGrid();
				rowVisited.push(0);
			}
			VISITED_ARRAY.push(rowVisited);
		}
	};

	const resetGridStates = () => {
		let array = [...gridArray];
		for (let row = 0; row < ROWS; row++) {
			for (let column = 0; column < COLUMNS; column++) {
				if (
					array[row][column].value !== GridStates.START_POSITION &&
					array[row][column].value !== GridStates.END_POSITION
				)
					array[row][column].value = GridStates.DEFAULT;
			}
		}
		setGridArray([...array]);
	};

	const resetGridWalls = () => {
		let array = [...gridArray];
		for (let row = 0; row < ROWS; row++) {
			for (let column = 0; column < COLUMNS; column++) {
				array[row][column].topWall = true;
				array[row][column].bottomWall = true;
				array[row][column].leftWall = true;
				array[row][column].rightWall = true;
			}
		}
		setGridArray([...array]);
	};

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
	let mazeSolvingAlgorithm = "maze-solve-dfs";
	let isPathFound = false;

	const startMazeGeneration = async () => {
		setDimensions();
		resetVisitedArray();
		resetGridStates();
		resetGridWalls();
		globalArray = [...gridArray];
		setIsGenerating(true);
		await generateMaze({ row: 0, column: 0 }, { row: 0, column: 0 });
		resetGridStates();
		setIsGenerating(false);
	};

	const startMazeSolution = async () => {
		setDimensions();
		resetVisitedArray();
		resetGridStates();
		globalArray = [...gridArray];

		setIsGenerating(true);
		isPathFound = false;
		switch (mazeSolvingAlgorithm) {
			case "maze-solve-dfs":
				await solveMazeDFS(gridStartPoint as GridPoint);
				break;
			default:
				break;
		}
		setIsGenerating(false);
	};

	// Maze generation
	const generateMaze = async (previousPoint: GridPoint, point: GridPoint) => {
		if (previousPoint !== point) {
			const wallToOpen: [WallKey, WallKey] | undefined = checkWhichWallToOpen(
				previousPoint,
				point
			);

			if (wallToOpen) {
				globalArray[previousPoint.row][previousPoint.column][wallToOpen[0]] =
					false;
				globalArray[point.row][point.column][wallToOpen[1]] = false;

				// Show currently iterating point
				if (
					globalArray[previousPoint.row][previousPoint.column].value ===
					GridStates.ITERATING
				)
					globalArray[previousPoint.row][previousPoint.column].value =
						GridStates.VISITED;
				if (globalArray[point.row][point.column].value === GridStates.DEFAULT)
					globalArray[point.row][point.column].value = GridStates.ITERATING;

				setGridArray([...globalArray]);
				await delay(animationSpeed);
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

		// Reset changes to original
		if (globalArray[point.row][point.column].value === GridStates.ITERATING)
			globalArray[point.row][point.column].value = GridStates.VISITED;

		return globalArray;
	};

	const solveMazeDFS = async (point: GridPoint) => {
		VISITED_ARRAY[point.row][point.column] = 1;
		if (
			JSON.stringify(point) !== JSON.stringify(gridStartPoint) &&
			JSON.stringify(point) !== JSON.stringify(gridEndPoint)
		) {
			globalArray[point.row][point.column].value = GridStates.VISITED;
			setGridArray([...globalArray]);
			await delay(animationSpeed / 2);
		}

		if (JSON.stringify(point) === JSON.stringify(gridEndPoint)) {
			isPathFound = true;
			return globalArray;
		}

		const neighbors = getCellNeighbors(point, null);
		const shuffledNeighbors = shuffleArray(neighbors);

		for (let i = 0; i < shuffledNeighbors.length; i++) {
			const neighbor = shuffledNeighbors[i];

			const wallToProceed: [WallKey, WallKey] | undefined =
				checkWhichWallToOpen(point, neighbor);

			if (
				wallToProceed &&
				!globalArray[point.row][point.column][wallToProceed[0]] &&
				!VISITED_ARRAY[neighbor.row][neighbor.column] &&
				!isPathFound
			) {
				if (
					JSON.stringify(point) !== JSON.stringify(gridStartPoint) &&
					JSON.stringify(point) !== JSON.stringify(gridEndPoint)
				) {
					globalArray[neighbor.row][neighbor.column].value =
						GridStates.ITERATING;
					setGridArray([...globalArray]);
					await delay(animationSpeed / 2);
				}
				globalArray = await solveMazeDFS(neighbor);
			}
		}

		// Reset changes to original
		if (globalArray[point.row][point.column].value === GridStates.VISITED) {
			if (isPathFound) {
				globalArray[point.row][point.column].value = GridStates.PATH;
				setGridArray([...globalArray]);
				await delay(2 * animationSpeed);
			}
		}

		return globalArray;
	};

	const setMazeSolvingAlgorithm = (value: string) => {
		mazeSolvingAlgorithm = value;
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
				<p> - Left-click drag cells to add path</p>
				<p> - Right-click and drag to remove the paths</p>
				<p> - Ctrl + Click to change the start position (Green color)</p>
				<p> - Ctrl + Right Click to change the end position (Red color)</p>
				<p> - Click on Generate Maze to start generating a maze</p>
				<p> - Click on Solve Maze to start solving the maze</p>
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
							startMazeSolution={startMazeSolution}
							setMazeSolvingAlgorithm={setMazeSolvingAlgorithm}
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
