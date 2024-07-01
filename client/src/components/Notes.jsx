import React, { useEffect, useState } from "react";
import Note from "./Note";

function Notes() {
	const [notes, setNotes] = useState([]);
	const [inputValue, setInputValue] = useState("");

	// Function to determine random positions within window bounds
	function determinePos() {
		const maxX = window.innerWidth - 250;
		const maxY = window.innerHeight - 250;
		return {
			x: Math.floor(Math.random() * maxX),
			y: Math.floor(Math.random() * maxY),
		};
	}

	// Load notes from local storage on initial render
	useEffect(() => {
		try {
			const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
			setNotes(storedNotes);
		} catch (error) {
			console.error("Failed to parse local storage notes:", error);
			setNotes([]);
		}
	}, []);

	// Update notes and save to local storage whenever notes change
	useEffect(() => {
		const positionedNotes = notes.map((note) => {
			// Only update position if x and y are not already set
			if (note.x === 0 && note.y === 0) {
				const pos = determinePos();
				return {
					...note,
					x: pos.x,
					y: pos.y,
				};
			}
			return note;
		});

		setNotes(positionedNotes);
		localStorage.setItem("notes", JSON.stringify(positionedNotes));
	}, [notes]);

	// Handle form submission to add a new note
	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent default form submission
		if (inputValue.trim() === "") return; // Do not add empty notes

		const newId = Date.now(); // Use current timestamp as a unique ID
		const newNote = { id: newId, text: inputValue, x: 0, y: 0 }; // Initialize x and y to 0

		const updatedNotes = [...notes, newNote];
		setNotes(updatedNotes);
		setInputValue(""); // Clear the input field after submission
	};

	return (
		<div className="p-4">
			<form onSubmit={handleSubmit} className="mb-4">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)} // Controlled input handling
					className="border border-gray-300 rounded p-2 mr-2"
					placeholder="Enter note text"
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white rounded p-2"
				>
					Add
				</button>
			</form>

			<div className="relative">
				{notes.map((note) => (
					<Note
						key={note.id}
						message={note.text}
						positionX={note.x}
						positionY={note.y}
					/>
				))}
			</div>
		</div>
	);
}

export default Notes;
