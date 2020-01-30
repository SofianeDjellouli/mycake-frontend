import React, { memo, useCallback, useState, useContext } from "react";
import { Grid, ClickAwayListener, FormHelperText } from "@material-ui/core";
import { Tooltip } from "../";
import { useToggle, handlePromise, firebase, GlobalContext } from "../../utils";
import "./style.css";

const _FieldUpdate = ({ onSubmit, value, name, setData, label, sm = 6 }) => {
	const { user: { uid = "" } = {} } = useContext(GlobalContext),
		[_value, set_Value] = useState(value),
		[currentValue, setCurrentValue] = useState(_value),
		[error, setError] = useState(""),
		toggleActive = useToggle(),
		toggleLoading = useToggle(),
		onChange = useCallback(({ target: { value } }) => {
			setCurrentValue(value);
			setError("");
		}, []),
		handleName = useCallback(
			_ => ({
				onChange,
				className: `form-input${toggleActive.toggled ? "" : " field-active"}`,
				name,
				"aria-label": name,
				value: currentValue,
				...(!toggleActive.toggled && { onClick: toggleActive.toggle })
			}),
			[currentValue, name, onChange, toggleActive.toggle, toggleActive.toggled]
		),
		handleCancel = useCallback(
			_ => {
				toggleActive.toggle();
				setCurrentValue(_value);
				setError("");
			},
			[toggleActive, _value]
		),
		handleConfirm = useCallback(
			e => {
				e.preventDefault();
				if (_value !== currentValue) {
					if (!currentValue) setError("This field is required");
					else {
						set_Value(currentValue);
						handlePromise(
							onSubmit
								? onSubmit(currentValue)
								: firebase
										.database()
										.ref(`users/${uid}`)
										.update({ [name]: currentValue })
										.then(toggleActive.toggle),
							toggleLoading.toggle
						);
					}
				} else toggleActive.toggle();
			},
			[toggleActive, _value, currentValue, uid, name, toggleLoading.toggle, onSubmit]
		);

	return (
		<Grid item {...{ sm }} className="field-update">
			<p>{label}</p>
			<ClickAwayListener
				onClickAway={handleConfirm}
				{...(!toggleActive.toggled && { mouseEvent: false, touchEvent: false })}>
				<form onSubmit={handleConfirm}>
					<div className="input-wrapper">
						<input readOnly={!toggleActive.toggled} {...handleName()} />
						{toggleLoading.toggled && <i className="fas fa-circle-notch fa-spin right" />}
					</div>
				</form>
			</ClickAwayListener>
			{toggleActive.toggled && _value !== currentValue && (
				<div>
					<Tooltip
						title="Cancel"
						children={<i onClick={handleCancel} className="fas fa-times-circle right" />}
					/>
					<Tooltip
						title="Confirm"
						children={<i onClick={handleConfirm} className="fas fa-check-circle" />}
					/>
				</div>
			)}
			{error && <FormHelperText error>{error}</FormHelperText>}
		</Grid>
	);
};

export const FieldUpdate = memo(_FieldUpdate);
