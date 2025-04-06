import { useState, useCallback, ChangeEvent } from 'react';

export type ValidationRule<T> = {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: any, formValues: T) => true | string;
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type ValidationRules<T> = Partial<Record<keyof T, ValidationRule<T>>>;

export interface UseFormResult<T> {
  values: T;
  errors: FormErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, isTouched: boolean) => void;
  reset: () => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: React.FormEvent) => void;
}

function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isDirty, setIsDirty] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: any): string | undefined => {
      if (!validationRules || !validationRules[name]) return undefined;

      const rules = validationRules[name];

      if (rules?.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return typeof rules.required === 'string' 
          ? rules.required 
          : `${String(name)} is required`;
      }

      if (rules?.minLength && typeof value === 'string' && value.length < rules.minLength.value) {
        return rules.minLength.message;
      }

      if (rules?.maxLength && typeof value === 'string' && value.length > rules.maxLength.value) {
        return rules.maxLength.message;
      }

      if (rules?.pattern && typeof value === 'string' && !rules.pattern.value.test(value)) {
        return rules.pattern.message;
      }

      if (rules?.validate) {
        const result = rules.validate(value, values);
        if (result !== true) {
          return result;
        }
      }

      return undefined;
    },
    [validationRules, values]
  );

  const validateForm = useCallback((): FormErrors<T> => {
    if (!validationRules) return {};

    const newErrors: FormErrors<T> = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T;
      const errorMessage = validateField(fieldName, values[fieldName]);

      if (errorMessage) {
        newErrors[fieldName] = errorMessage;
        hasErrors = true;
      }
    });

    return newErrors;
  }, [validateField, validationRules, values]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      
      let parsedValue: any = value;
      
      // Handle different input types
      if (type === 'checkbox') {
        parsedValue = (e.target as HTMLInputElement).checked;
      } else if (type === 'number') {
        parsedValue = value === '' ? '' : Number(value);
      }
      
      setValues((prevValues) => ({
        ...prevValues,
        [name]: parsedValue,
      }));
      
      setIsDirty(true);
      
      if (touched[name as keyof T]) {
        const errorMessage = validateField(name as keyof T, parsedValue);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: errorMessage,
        }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
      
      const errorMessage = validateField(name as keyof T, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    },
    [validateField]
  );

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    
    setIsDirty(true);
    
    if (touched[name]) {
      const errorMessage = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }
  }, [touched, validateField]);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  }, []);

  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: isTouched,
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      
      // Set all fields as touched
      const touchedFields = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      );
      setTouched(touchedFields);
      
      // Validate all fields
      const newErrors = validateForm();
      setErrors(newErrors);
      
      // If no errors, submit
      if (Object.keys(newErrors).length === 0) {
        onSubmit(values);
      }
    },
    [validateForm, values]
  );

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    reset,
    handleSubmit,
  };
}

export default useForm;
