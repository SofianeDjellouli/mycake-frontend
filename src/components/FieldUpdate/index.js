import React, { memo, useCallback, useState, useEffect } from "react";
import { Grid, ClickAwayListener } from "@material-ui/core";
import { Tooltip } from "../";
import { useToggle } from "../../utils";
import "./style.css";

const _FieldUpdate = ({ onSubmit, value, name, label, sm = 6 }) => {
	console.log(value);
	const [currentValue, setCurrentValue] = useState({ value, error: "" }),
		toggleActive = useToggle(),
		onChange = useCallback(({ target: { value } }) => setCurrentValue({ value, error: "" }), []),
		handleName = useCallback(
			_ => ({
				onChange,
				className: `form-input${toggleActive.toggled ? "" : " field-active"}`,
				name,
				"aria-label": name,
				value: currentValue.value,
				...(!toggleActive.toggled && { onClick: toggleActive.toggle })
			}),
			[currentValue, name, onChange, toggleActive.toggle, toggleActive.toggled]
		),
		handleCancel = useCallback(
			_ => {
				toggleActive.toggle();
				setCurrentValue({ value, error: "" });
			},
			[toggleActive, value]
		),
		handleConfirm = useCallback(
			_ => {
				//if (value !== currentValue)
				toggleActive.toggle();
			},
			[toggleActive /*value, currentValue*/]
		);
	useEffect(
		_ => {
			console.log(currentValue);
		},
		[currentValue]
	);

	return (
		<Grid item {...{ sm }} className="field-update">
			<p>{label}</p>
			<ClickAwayListener
				onClickAway={handleConfirm}
				{...(!toggleActive.toggled && { mouseEvent: false, touchEvent: false })}>
				<input readOnly={!toggleActive.toggled} {...handleName()} />
			</ClickAwayListener>
			{toggleActive.toggled && (
				<div>
					<Tooltip
						title="Cancel"
						children={<i onClick={handleCancel} className="fas fa-ban right" />}
					/>
					<Tooltip
						title="Confirm"
						children={<i onClick={handleConfirm} className="fas fa-check-circle" />}
					/>
				</div>
			)}
		</Grid>
	);
};

export const FieldUpdate = memo(_FieldUpdate);
