"use client";

import GridSystem from "@/components/GridSystem";
import Topbar from "@/components/Topbar";
import styles from "@/page.module.css";
import "@/page.css";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
	let ROWS: number;
	let COLUMNS: number;
	// todo: check using usestate with setdim function

	const [gridArray, setGridArray] = useState<Number[][]>([]);
	const [gridStartPoint, setGridStartPoint] = useState<number[]>([]);
	const [gridEndPoint, setGridEndPoint] = useState<number[]>([]);

	const infoModalRef = useRef<HTMLDialogElement>(null);

	const onGridAdd = (row: number, column: number) => {
		let array = [...gridArray];
		if (array[row][column] === 2 || array[row][column] === 3) return;
		array[row][column] = 1;
		setGridArray([...array]);
	};
	const onGridClear = (row: number, column: number) => {
		let array = [...gridArray];
		if (array[row][column] === 2 || array[row][column] === 3) return;
		array[row][column] = 0;
		setGridArray([...array]);
	};

	const onGridSetStartPosition = (row: number, column: number) => {
		let array = [...gridArray];
		array[gridStartPoint[0]][gridStartPoint[1]] = 0;
		array[row][column] = 2;
		setGridStartPoint([row, column]);
		setGridArray([...array]);
	};
	const onGridSetEndPosition = (row: number, column: number) => {
		let array = [...gridArray];
		array[gridEndPoint[0]][gridEndPoint[1]] = 0;
		array[row][column] = 3;
		setGridEndPoint([row, column]);
		setGridArray([...array]);
	};

	const resetGrid = () => {
		setDimensions();

		let array: Number[][] = [];

		for (let row = 0; row < ROWS; row++) {
			let rowArray = [];

			for (let column = 0; column < COLUMNS; column++) {
				rowArray.push(0);
			}

			array.push(rowArray);
		}

		const startPoint = [1, 1];
		const endPoint = [ROWS - 2, COLUMNS - 2];

		setGridStartPoint(startPoint);
		setGridEndPoint(endPoint);
		array[startPoint[0]][startPoint[1]] = 2;
		array[endPoint[0]][endPoint[1]] = 3;

		setGridArray([...array]);
	};

	const toggleBorders = () => {
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
	};

	const isGridBordered = () => {
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
		ROWS = Math.floor((height - TOPBAR_HEIGHT) / GRID_SIZE) - 1;
		COLUMNS = Math.floor(width / GRID_SIZE) - 1;
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

	const showInfoModal = () => {
		infoModalRef.current?.showModal();
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
				<p> - Click on any cell to add an obstacle</p>
				<p> - Right-click on any cell to remove an obstacle</p>
				<p> - Click and drag on cells to add walls between them</p>
				<p> - Ctrl + Click to change the start position (Red color)</p>
				<p> - Ctrl + Right Click to change the end position (Green color)</p>
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
					<Topbar
						resetClick={resetGrid}
						toggleBorders={toggleBorders}
						saveMaze={saveMaze}
						showInfoModal={showInfoModal}
					></Topbar>
					<GridSystem
						gridArray={gridArray}
						onGridClear={onGridClear}
						onGridAdd={onGridAdd}
						onGridSetStartPosition={onGridSetStartPosition}
						onGridSetEndPosition={onGridSetEndPosition}
					></GridSystem>
				</main>
			</div>
		</>
	);
}
