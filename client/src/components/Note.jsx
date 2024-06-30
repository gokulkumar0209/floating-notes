import React from "react";

function Note({ message, positionX, positionY }) {
	// console.log(message,positionX,positionY)
	return (
		<div
			className=" absolute border border-solid  border-black "
			style={{ left: `${positionX}px`, top: `${positionY}px` }}
		>
			<h1 className="p-4">{message}</h1>
		</div>
	);
}

export default Note;
