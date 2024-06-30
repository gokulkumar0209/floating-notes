import React, { useEffect, useState } from "react";
import Note from "./Note";
function Notes({ notes = [], setNotes }) {
	function determinePos() {
		const maxX = window.innerWidth - 250;
		const maxY = window.innerHeight - 250;
		return {
			x: Math.floor(Math.random() * maxX),
			y: Math.floor(Math.random() * maxY),
		};
	}
	useEffect(() => {
		const positionedNotes = notes.map((note) => {
			const pos = determinePos();
			return {
				...note,
				x: pos.x,
				y: pos.y,
			};
		});

		setNotes(positionedNotes);
	}, [notes.length]);
	// console.log(notes);

	return (
		<div>
			{notes.map((note) => {
				// console.log(note);
				return (
					<Note
						key={note.id}
						message={note.text}
						positionX={note.x}
						positionY={note.y}
					/>
				);
			})}
		</div>
	);
}

export default Notes;
