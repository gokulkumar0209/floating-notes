import NavBar from "./components/NavBar";
import Notes from "./components/Notes";
import { BrowserRouter } from "react-router-dom";
function App() {
	return (
		<> 
			<div className="h-screen bg-yellow-50">
				<NavBar/>
				<Notes />
			</div>
		</>
	);
}

export default App;
