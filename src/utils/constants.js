export const defaultField = { value: "", error: "" };

const fields = [
	{ email: "Email" },
	{ confirmEmail: "Confirm email" },
	{ password: "Password" },
	{ confirmPassword: "Confirm password" },
	{ photoURL: "Profile picture" },
	{ phoneNumber: "Phone number" },
	{ addressLine1: "Address" },
	{ addressLine2: "Apt/Suite" },
	{ city: "City" },
	{ state: "State" },
	{ country: "Country" },
	{ q1: "What was the street name you lived in as a child?" },
	{ q2: "What were the last four digits of your childhood telephone number?" },
	{ q3: "What primary school did you attend?" }
];
let profile = {};
for (let i = 0; i < fields.length; i++) {
	let field = Object.keys(fields[i])[0];
	profile[field] = { ...defaultField, label: fields[i][field] };
}
profile.DOB = { ...defaultField, value: null, label: "Date of birth" };

export { profile };

export const isDev = process.env.NODE_ENV === "development";
