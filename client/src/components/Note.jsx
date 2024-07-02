import React from "react";
import { forwardRef } from "react";

const Note = forwardRef(({ content, pos, ...props }, ref) => {
	// console.log(ref);
	// console.log(message,positionX,positionY)
	return (
		<div
			ref={ref}
			className=" absolute border border-solid  border-black cursor-move bg-yellow-100 "
			style={{ left: `${pos?.x}px`, top: `${pos?.y}px` }}
			{...props}
		>
			<h1 className="p-4">📌{content}</h1>
		</div>
	);
});

export default Note;
