import { useState } from "react";
import Notes from "./components/Notes";
function App() {
	const [notes, setNotes] = useState([
		{ id: 1, text: "Hello World!" },
		{ id: 2, text: "Goodbye World!" },
	]);

	return (
		<>
			<div className="h-screen bg-yellow-50">
				<Notes notes={notes} setNotes={setNotes} />
			</div>
		</>
	);
}

export default App;
