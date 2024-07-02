import React, { createRef, useEffect, useRef } from "react";

import Note from "./Note";
function Notes({ notes = [], setNotes = () => {} }) {
	const noteRefs = useRef({});
	function determinePos() {
		const maxX = window.innerWidth - 250;
		const maxY = window.innerHeight - 250;
		return {
			x: Math.floor(Math.random() * maxX),
			y: Math.floor(Math.random() * maxY),
		};
	}
	const handleDragStart = (note, e) => {
		// console.log(noteRefs);
		// console.log(noteRefs);
		const { id } = note;
		if (noteRefs.current[id] && noteRefs.current[id].current) {
			const noteRef = noteRefs.current[id].current;
			// console.log(noteRef);
			const rect = noteRef.getBoundingClientRect();
			// console.log(rect);
			const offsetX = e.clientX - rect.left;
			const offsetY = e.clientY - rect.top;
			const startPos = note.position;
			const handleMouseMove = (e) => {
				const newX = e.clientX - offsetX;
				const newY = e.clientY - offsetY;
				noteRef.style.left = `${newX}px`;
				noteRef.style.top = `${newY}px`;
			};
			const handleMouseUp = () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				const finalRect = noteRef.getBoundingClientRect();
				const newPosition = { x: finalRect.left, y: finalRect.top };
				if (checkOverlap(id)) {
					// check for overlap
					noteRef.style.left = `${startPos.x}px`;
					noteRef.style.top = `${startPos.y}px`;
				} else {
					updateNotePosition(id, newPosition);
				}
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		} else {
			console.error(`Current for id ${id} is not found`);
		}
		const updateNotePosition = (id, newPosition) => {
			const updatedNotes = notes.map((note) =>
				note.id == id ? { ...note, position: newPosition } : note
			);
			setNotes(updatedNotes);
			localStorage.setItem("notes", JSON.stringify(updatedNotes));
		};
		const checkOverlap = (id) => {
			const currentNoteRef = noteRefs.current[id].current;
			const rect = currentNoteRef.getBoundingClientRect();
			return notes.some((note) => {
				if (note.id === id) return false;
				const otherNoteRef = noteRefs.current[note.id].current;
				const otherRect = otherNoteRef.getBoundingClientRect();
				const topLeft =
					rect.left >= otherRect.left &&
					rect.left <= otherRect.right &&
					rect.top >= otherRect.top &&
					rect.top <= otherRect.bottom;
				const topRight =
					rect.right >= otherRect.left &&
					rect.right <= otherRect.right &&
					rect.top >= otherRect.top &&
					rect.top <= otherRect.bottom;
				const bottomLeft =
					rect.left >= otherRect.left &&
					rect.left <= otherRect.right &&
					rect.bottom >= otherRect.top &&
					rect.bottom <= otherRect.bottom;
				const bottomRight =
					rect.right >= otherRect.left &&
					rect.right <= otherRect.right &&
					rect.bottom >= otherRect.top &&
					rect.bottom <= otherRect.bottom;
				console.log(topLeft, topRight, bottomLeft, bottomRight);
				return topLeft || topRight || bottomLeft || bottomRight;
			});
		};
	};
	useEffect(() => {
		const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
		const updatedNotes = notes.map((note) => {
			const savedNote = savedNotes.find((snote) => snote.id === note.id);
			if (savedNote) {
				return { ...note, position: savedNote.position };
			} else {
				const position = determinePos();
				return { ...note, position };
			}
		});
		setNotes(updatedNotes);
		localStorage.setItem("notes", JSON.stringify(updatedNotes));
	}, [notes.length]);

	return (
		<div>
			{notes.map((note) => {
				return (
					<Note
						key={note.id}
						ref={
							noteRefs.current[note.id]
								? noteRefs.current[note.id]
								: (noteRefs.current[note.id] = createRef())
						}
						content={note.text}
						pos={note.position}
						onMouseDown={(e) => {
							handleDragStart(note, e);
						}}
					/>
				);
			})}
		</div>
	);
}

export default Notes;

// import React, { useEffect, useState } from "react";
// import Note from "./Note";

// function Notes() {
// 	const [notes, setNotes] = useState([]);
// 	const [inputValue, setInputValue] = useState("");

// 	// Function to determine random positions within window bounds
// 	function determinePos() {
// 		const maxX = window.innerWidth - 250;
// 		const maxY = window.innerHeight - 250;
// 		return {
// 			x: Math.floor(Math.random() * maxX),
// 			y: Math.floor(Math.random() * maxY),
// 		};
// 	}

// 	// Load notes from local storage on initial render
// 	useEffect(() => {
// 		try {
// 			const storedNotes = JSON.parse(localStorage.getItem("notes"));
// 			setNotes(storedNotes);
// 		} catch (error) {
// 			console.error("Failed to parse local storage notes:", error);

// 		}
// 	}, []);

// 	// Update notes and save to local storage whenever notes change
// 	useEffect(() => {
// 		const positionedNotes = notes.map((note) => {
// 			// Only update position if x and y are not already set
// 			if (note.x === 0 && note.y === 0) {
// 				const pos = determinePos();
// 				return {
// 					...note,
// 					x: pos.x,
// 					y: pos.y,
// 				};
// 			}
// 			return note;
// 		});

// 		setNotes(positionedNotes);
// 		console.log(positionedNotes);
// 		localStorage.setItem("notes", JSON.stringify(positionedNotes));
// 	}, [notes.length]);

// 	// Handle form submission to add a new note
// 	const handleSubmit = (e) => {
// 		e.preventDefault(); // Prevent default form submission
// 		if (inputValue.trim() === "") return; // Do not add empty notes

// 		const newId = Date.now(); // Use current timestamp as a unique ID
// 		const newNote = { id: newId, text: inputValue, x: 0, y: 0 }; // Initialize x and y to 0

// 		const updatedNotes = [...notes, newNote];
// 		setNotes(updatedNotes);
// 		setInputValue(""); // Clear the input field after submission
// 	};

// 	return (
// 		<div className="p-4">
// 			<form onSubmit={handleSubmit} className="mb-4">
// 				<input
// 					type="text"
// 					value={inputValue}
// 					onChange={(e) => setInputValue(e.target.value)} // Controlled input handling
// 					className="border border-gray-300 rounded p-2 mr-2"
// 					placeholder="Enter note text"
// 				/>
// 				<button type="submit" className="bg-blue-500 text-white rounded p-2">
// 					Add
// 				</button>
// 			</form>

// 			<div className="relative">
// 				{notes.map((note) => (
// 					<Note
// 						key={note.id}
// 						message={note.text}
// 						positionX={note.x}
// 						positionY={note.y}
// 					/>
// 				))}
// 			</div>
// 		</div>
// 	);
// }

// export default Notes;
