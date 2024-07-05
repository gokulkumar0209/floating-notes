import React, { createRef, useEffect, useRef, useState } from "react";
import Note from "./Note";
import useLocalStorage from "../hooks/useLocalStorage";

function Notes({}) {
	const [notes, setNotes] = useLocalStorage("notes", []);
	// State to manage input value for new notes
	const [input, setInput] = useState("");

	// Ref to hold references to all the Note components
	const noteRefs = useRef({});

	// Function to determine a random position within the window boundaries
	function determinePos() {
		const maxX = window.innerWidth - 250;
		const maxY = window.innerHeight - 250;
		return {
			x: Math.floor(Math.random() * maxX),
			y: Math.floor(Math.random() * maxY),
		};
	}

	// Handle the drag start event for a note
	const handleDragStart = (note, e) => {
		const { id } = note;

		// Check if the ref for the note is available
		if (noteRefs.current[id] && noteRefs.current[id].current) {
			const noteRef = noteRefs.current[id].current;
			const rect = noteRef.getBoundingClientRect();

			// Calculate the offset from the mouse position to the note's position
			const offsetX = e.clientX - rect.left;
			const offsetY = e.clientY - rect.top;
			const startPos = note.position;

			// Function to handle the note's movement as the mouse moves
			const handleMouseMove = (e) => {
				const newX = e.clientX - offsetX;
				const newY = e.clientY - offsetY;
				noteRef.style.left = `${newX}px`;
				noteRef.style.top = `${newY}px`;
			};

			// Function to handle the mouse release, finalizing the note's new position
			const handleMouseUp = () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				const finalRect = noteRef.getBoundingClientRect();
				const newPosition = { x: finalRect.left, y: finalRect.top };

				// Check for overlap with other notes
				if (checkOverlap(id)) {
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
	};

	// Function to update the note's position in the state and localStorage
	const updateNotePosition = (id, newPosition) => {
		const updatedNotes = notes.map((note) =>
			note.id === id ? { ...note, position: newPosition } : note
		);
		setNotes(updatedNotes);
		localStorage.setItem("notes", JSON.stringify(updatedNotes));
	};

	// Function to check if the current note overlaps with any other notes
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

	// useEffect to load notes from localStorage and set their positions
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
	}, []);

	// Handle the form submission to add a new note
	const handleSubmit = (e) => {
		e.preventDefault();
		const newId = Date.now();
		const newNote = { id: newId, text: input, position: determinePos() };
		const updatedNotes = [...notes, newNote];
		setNotes(updatedNotes);
		setInput(""); // Clear the input field after adding the note
	};

	return (
		<div>
			{/* Form to add a new note */}
			<div>
				<form onSubmit={handleSubmit}>
					<input
						type="textbox"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="bg-amber-100 border border-yellow-600"
					/>
					<button type="submit">Add</button>
				</form>
			</div>
			{/* Render each note */}
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
						onMouseDown={(e) => handleDragStart(note, e)}
					/>
				);
			})}
		</div>
	);
}

export default Notes;
