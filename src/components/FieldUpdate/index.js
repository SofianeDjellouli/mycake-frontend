import React, { memo, useCallback, useState, useContext, useEffect } from "react";
import { Grid, ClickAwayListener, FormHelperText } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { Tooltip } from "../";
import { useToggle, handlePromise, firebase, GlobalContext } from "../../utils";
import "./style.css";

const _FieldUpdate = ({ onSubmit, value, name, setData, label, sm = 6 }) => {
	const { user: { uid = "" } = {}, setSnackbar } = useContext(GlobalContext),
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
				className: `form-input${toggleActive.toggled ? "" : " field-inactive"}`,
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
										.then(_ => true),
							toggleLoading.toggle,
							setSnackbar
						).then(bool => {
							if (bool) toggleActive.toggle();
							else handleCancel();
						});
					}
				} else toggleActive.toggle();
			},
			[
				toggleActive,
				handleCancel,
				setSnackbar,
				_value,
				currentValue,
				uid,
				name,
				toggleLoading.toggle,
				onSubmit
			]
		);

	useEffect(
		_ => {
			if (value) {
				set_Value(value);
				setCurrentValue(value);
			}
		},
		[value]
	);
	return (
		<Grid item {...{ sm }} className="field-update" xs={12}>
			<p className="field-label">{label}</p>
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

const _DOBUpdate = ({ value }) => {
	const { user: { uid = "" } = {}, setSnackbar } = useContext(GlobalContext),
		[DOB, setDOB] = useState(value),
		toggleLoading = useToggle(),
		handleDOB = useCallback(
			value => {
				setDOB(value);
				handlePromise(
					firebase
						.database()
						.ref(`users/${uid}`)
						.update({ DOB: value.toJSON() }),
					toggleLoading.toggle,
					setSnackbar
				);
			},
			[toggleLoading.toggle, uid, setSnackbar]
		);
	useEffect(
		_ => {
			if (value) setDOB(value);
		},
		[value]
	);
	return (
		<Grid item sm={6} xs={12}>
			<p className="field-label">Date of birth</p>
			<div className="input-wrapper">
				<DatePicker
					fullWidth
					disableFuture
					openTo="year"
					format="DD/MM/YYYY"
					emptyLabel="Date of birth"
					views={["year", "month", "date"]}
					value={DOB}
					onChange={handleDOB}
					disabled={toggleLoading.toggled}
					inputProps={{
						"aria-label": "Date of birth",
						className: "form-input field-inactive"
					}}
					InputProps={{
						disableUnderline: true,
						...(!value && { style: { color: "gray" } })
					}}
				/>
				{toggleLoading.toggled && <i className="fas fa-circle-notch fa-spin right" />}
			</div>
		</Grid>
	);
};

export const FieldUpdate = memo(_FieldUpdate);
export const DOBUpdate = memo(_DOBUpdate);
