import { useState } from "react";
import Notes from "./components/Notes";
function App() {
	const [notes, setNotes] = useState([
		{ id: 1, text: "Hello World!", x: 0, y: 0 },
		{ id: 2, text: "Goodbye World!", x: 0, y: 0 },
	]);

	return (
		<>
			<div className="h-screen bg-yellow-200">
				<Notes notes={notes} setNotes={setNotes} />
			</div>
		</>
	);
}

export default App;
