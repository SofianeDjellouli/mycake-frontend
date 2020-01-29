import { useState, useCallback } from "react";
import { useMediaQuery } from "@material-ui/core";

export const useToggle = (bool = false) => {
	const [toggled, setToggled] = useState(bool);
	const toggle = useCallback(_ => setToggled(toggled => !toggled), []);
	return { toggled, toggle };
};

export const useMobile = _ => useMediaQuery("(max-width:768px)");
