import { defaultField } from "../../utils";

const fields = ["email", "password"];
let defaultForm = {};
for (let i = 0; i < fields.length; i++) defaultForm[fields[i]] = defaultField;

export { defaultForm };
