import React, { Fragment, memo, useCallback } from "react";
import {
	Grid,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormHelperText,
	Checkbox
} from "@material-ui/core";
import { Tooltip } from "../";
import { useToggle } from "../../utils";
import "./style.css";

const InputRender = ({ required, ...props }) => (
	<Fragment>
		{required && <div className="required">*</div>}
		<input className="form-input" {...props} />
	</Fragment>
);

const AreaRender = ({ required, ...props }) => (
	<Fragment>
		{required && <div className="required">*</div>}
		<textarea className="form-input" maxLength="380" {...props} />
	</Fragment>
);

const RadioRender = ({ control, value, title, required, ...props }) => (
	<div className="input-wrapper">
		{required && <div className="required">*</div>}
		<RadioGroup row {...props} className="">
			{control.map(({ label, _value }) => (
				<FormControlLabel
					key={label}
					value={_value}
					control={<Radio checked={value === _value} color="primary" />}
					{...{ label }}
				/>
			))}
		</RadioGroup>
	</div>
);

const CheckRender = ({ checkLabel, value, onChange, name }) => (
	<FormControlLabel
		label={checkLabel}
		labelPlacement="start"
		control={
			<Checkbox
				{...{ onChange, value }}
				className="left"
				inputProps={{ name }}
				checked={value}
				color="primary"
			/>
		}
	/>
);

const PasswordRender = ({ required, value, ...props }) => {
	const { toggle, toggled } = useToggle(true);
	return (
		<div className="input-wrapper">
			{required && <div className="required">*</div>}
			<input
				className="form-input"
				{...{ value, ...props, ...(toggled && { type: "password" }) }}
			/>
			{value && (
				<Tooltip
					title={toggled ? "Show" : "Hide"}
					children={<i onClick={toggle} className={`far fa-eye${toggled ? "-slash" : ""}`} />}
				/>
			)}
		</div>
	);
};

const PhoneRender = ({ value, onChange, ...props }) => {
	const handlePhone = useCallback(
		({ target: { name, value } }) => {
			if (/^[0-9 ]+$/.test(value) || !value)
				onChange({ target: { name, value: value.replace(/ /g, "") } });
		},
		[onChange]
	);
	return (
		<InputRender
			minLength="8"
			maxLength="20"
			type="tel"
			placeholder="Phone number"
			onChange={handlePhone}
			value={
				value.length > 3
					? `${value.slice(0, 3)} ${value.slice(3, 6)}${value.length > 6 ? " " : ""}${value.slice(
							6
					  )}`
					: value
			}
			{...props}
		/>
	);
};

export const Render = Children =>
	memo(({ error, label, sm = 6, id, required, ...props }) => {
		const bool = Boolean(error);
		return (
			<Grid item xs={12} {...{ sm }}>
				<FormControl fullWidth error={bool}>
					{/*label && (
						<label className="form-label" htmlFor={id}>{`${label}${required ? " *" : ""}`}</label>
					)*/}
					<Children {...{ id, /* ...(!label && { required }),*/ ...props }} />
					{bool && <FormHelperText>{error}</FormHelperText>}
				</FormControl>
			</Grid>
		);
	});

export const RenderInput = Render(InputRender);
export const RenderArea = Render(AreaRender);
export const RenderPassword = Render(PasswordRender);
export const RenderPhone = Render(PhoneRender);
export const RenderRadio = Render(RadioRender);
export const RenderCheck = Render(CheckRender);
