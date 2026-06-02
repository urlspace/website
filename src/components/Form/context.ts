import { createContext, type ReactNode, useContext } from "react";

type FormContextValue = {
	formId: string;
	error: ReactNode;
	loading: boolean;
};

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext() {
	const ctx = useContext(FormContext);
	if (!ctx) throw new Error("Form.* must be used inside <Form>");
	return ctx;
}

export function useFieldIds(name: string, hasDescription: boolean) {
	const { formId, error, loading } = useFormContext();
	const inputId = `${name}-${formId}`;
	const descriptionId = `${name}-description-${formId}`;
	const ariaDescribedBy =
		[hasDescription ? descriptionId : null, error ? `error-${formId}` : null]
			.filter(Boolean)
			.join(" ") || undefined;
	return { inputId, descriptionId, ariaDescribedBy, loading };
}

export type SubmitHelpers = {
	setError: (msg: ReactNode) => void;
	setLoading: (loading: boolean) => void;
};
