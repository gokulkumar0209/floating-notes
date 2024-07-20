import React from "react";

function NavBar() {
	return (
		<div className=" bg-blue-200 flex justify-between">
			<div className="ml-4">Notes</div>

			<div className="mr-4">
				<button className="mr-2">Login</button>
				<button>Signup</button>
			</div>
		</div>
	);
}

export default NavBar;
