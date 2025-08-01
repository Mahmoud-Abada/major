/**
 * Form utilities for handling form validation and submission
 */

import { FormErrors, ValidationResult } from "@/types/classroom";
import { z } from "zod";

// Generic form validation function
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): ValidationResult => {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      errors: {},
    };
  }

  const errors: FormErrors = {};

  result.error.errors.forEach((error) => {
    const path = error.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }

    if (Array.isArray(errors[path])) {
      (errors[path] as string[]).push(error.message);
    } else {
      errors[path] = [error.message];
    }
  });

  return {
    isValid: false,
    errors,
  };
};

// Get first error message for a field
export const getFieldError = (
  errors: FormErrors,
  fieldName: string,
): string | undefined => {
  const error = errors[fieldName];

  if (Array.isArray(error)) {
    return error[0];
  }

  if (typeof error === "string") {
    return error;
  }

  return undefined;
};

// Check if field has error
export const hasFieldError = (
  errors: FormErrors,
  fieldName: string,
): boolean => {
  return !!errors[fieldName];
};

// Get all error messages for a field
export const getFieldErrors = (
  errors: FormErrors,
  fieldName: string,
): string[] => {
  const error = errors[fieldName];

  if (Array.isArray(error)) {
    return error;
  }

  if (typeof error === "string") {
    return [error];
  }

  return [];
};

// Form state management utilities
export interface FormState<T> {
  data: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  touchedFields: Set<string>;
}

export const createInitialFormState = <T>(initialData: T): FormState<T> => ({
  data: initialData,
  errors: {},
  isSubmitting: false,
  isValid: true,
  isDirty: false,
  touchedFields: new Set(),
});

// Form field utilities
export const createFieldProps = <T>(
  formState: FormState<T>,
  fieldName: keyof T,
  updateForm: (updates: Partial<FormState<T>>) => void,
) => ({
  value: formState.data[fieldName],
  onChange: (value: T[keyof T]) => {
    updateForm({
      data: { ...formState.data, [fieldName]: value },
      isDirty: true,
      touchedFields: new Set([...formState.touchedFields, fieldName as string]),
    });
  },
  onBlur: () => {
    updateForm({
      touchedFields: new Set([...formState.touchedFields, fieldName as string]),
    });
  },
  error: getFieldError(formState.errors, fieldName as string),
  hasError: hasFieldError(formState.errors, fieldName as string),
  isTouched: formState.touchedFields.has(fieldName as string),
});

// Form submission utilities
export const handleFormSubmission = async <T>(
  formState: FormState<T>,
  schema: z.ZodSchema<T>,
  onSubmit: (data: T) => Promise<void>,
  updateForm: (updates: Partial<FormState<T>>) => void,
): Promise<boolean> => {
  // Validate form
  const validation = validateForm(schema, formState.data);

  if (!validation.isValid) {
    updateForm({
      errors: validation.errors,
      isValid: false,
    });
    return false;
  }

  // Clear errors and set submitting state
  updateForm({
    errors: {},
    isValid: true,
    isSubmitting: true,
  });

  try {
    await onSubmit(formState.data);
    updateForm({
      isSubmitting: false,
      isDirty: false,
    });
    return true;
  } catch (error) {
    updateForm({
      isSubmitting: false,
      errors: {
        submit: error instanceof Error ? error.message : "Submission failed",
      },
    });
    return false;
  }
};

// Auto-save utilities
export const createAutoSave = <T>(
  formState: FormState<T>,
  onSave: (data: T) => Promise<void>,
  delay: number = 2000,
) => {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);

    if (formState.isDirty && formState.isValid) {
      timeoutId = setTimeout(async () => {
        try {
          await onSave(formState.data);
        } catch (error) {
          console.warn("Auto-save failed:", error);
        }
      }, delay);
    }
  };
};

// Form reset utility
export const resetForm = <T>(
  initialData: T,
  updateForm: (updates: Partial<FormState<T>>) => void,
) => {
  updateForm({
    data: initialData,
    errors: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
    touchedFields: new Set(),
  });
};

// Dirty field tracking
export const markFieldAsDirty = <T>(
  fieldName: keyof T,
  formState: FormState<T>,
  updateForm: (updates: Partial<FormState<T>>) => void,
) => {
  updateForm({
    touchedFields: new Set([...formState.touchedFields, fieldName as string]),
    isDirty: true,
  });
};

// Form validation on field change
export const validateField = <T>(
  fieldName: keyof T,
  value: T[keyof T],
  schema: z.ZodSchema<T>,
  formState: FormState<T>,
  updateForm: (updates: Partial<FormState<T>>) => void,
) => {
  const updatedData = { ...formState.data, [fieldName]: value };
  const validation = validateForm(schema, updatedData);

  updateForm({
    data: updatedData,
    errors: validation.errors,
    isValid: validation.isValid,
    isDirty: true,
    touchedFields: new Set([...formState.touchedFields, fieldName as string]),
  });
};

// Conditional field validation
export const validateConditionalField = <T>(
  fieldName: keyof T,
  condition: (data: T) => boolean,
  schema: z.ZodSchema<any>,
  formState: FormState<T>,
): string | undefined => {
  if (!condition(formState.data)) {
    return undefined;
  }

  const result = schema.safeParse(formState.data[fieldName]);

  if (!result.success) {
    return result.error.errors[0]?.message;
  }

  return undefined;
};

// Multi-step form utilities
export interface MultiStepFormState<T> {
  currentStep: number;
  totalSteps: number;
  stepData: Record<number, Partial<T>>;
  stepErrors: Record<number, FormErrors>;
  isStepValid: Record<number, boolean>;
  completedSteps: Set<number>;
}

export const createMultiStepFormState = <T>(
  totalSteps: number,
): MultiStepFormState<T> => ({
  currentStep: 0,
  totalSteps,
  stepData: {},
  stepErrors: {},
  isStepValid: {},
  completedSteps: new Set(),
});

export const validateStep = <T>(
  step: number,
  schema: z.ZodSchema<any>,
  stepData: Partial<T>,
  updateMultiStepForm: (updates: Partial<MultiStepFormState<T>>) => void,
): boolean => {
  const validation = validateForm(schema, stepData);

  updateMultiStepForm({
    stepErrors: { [step]: validation.errors },
    isStepValid: { [step]: validation.isValid },
  });

  return validation.isValid;
};

export const goToNextStep = <T>(
  multiStepState: MultiStepFormState<T>,
  updateMultiStepForm: (updates: Partial<MultiStepFormState<T>>) => void,
) => {
  if (multiStepState.currentStep < multiStepState.totalSteps - 1) {
    updateMultiStepForm({
      currentStep: multiStepState.currentStep + 1,
      completedSteps: new Set([
        ...multiStepState.completedSteps,
        multiStepState.currentStep,
      ]),
    });
  }
};

export const goToPreviousStep = <T>(
  multiStepState: MultiStepFormState<T>,
  updateMultiStepForm: (updates: Partial<MultiStepFormState<T>>) => void,
) => {
  if (multiStepState.currentStep > 0) {
    updateMultiStepForm({
      currentStep: multiStepState.currentStep - 1,
    });
  }
};

export const goToStep = <T>(
  step: number,
  multiStepState: MultiStepFormState<T>,
  updateMultiStepForm: (updates: Partial<MultiStepFormState<T>>) => void,
) => {
  if (step >= 0 && step < multiStepState.totalSteps) {
    updateMultiStepForm({
      currentStep: step,
    });
  }
};

// Form data transformation utilities
export const transformFormData = <T, U>(
  data: T,
  transformer: (data: T) => U,
): U => {
  return transformer(data);
};

export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = { ...data };

  // Remove empty strings and convert to undefined
  Object.keys(sanitized).forEach((key) => {
    if (sanitized[key] === "") {
      sanitized[key] = undefined;
    }
  });

  // Trim string values
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitized[key].trim();
    }
  });

  return sanitized;
};

// Form persistence utilities
export const saveFormToStorage = <T>(
  key: string,
  formData: T,
  persistent: boolean = false,
): void => {
  if (typeof window === "undefined") return;

  const storage = persistent ? localStorage : sessionStorage;

  try {
    storage.setItem(`form_${key}`, JSON.stringify(formData));
  } catch (error) {
    console.warn("Failed to save form data:", error);
  }
};

export const loadFormFromStorage = <T>(
  key: string,
  defaultData: T,
  persistent: boolean = false,
): T => {
  if (typeof window === "undefined") return defaultData;

  const storage = persistent ? localStorage : sessionStorage;

  try {
    const saved = storage.getItem(`form_${key}`);
    if (saved) {
      return { ...defaultData, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.warn("Failed to load form data:", error);
  }

  return defaultData;
};

export const clearFormFromStorage = (
  key: string,
  persistent: boolean = false,
): void => {
  if (typeof window === "undefined") return;

  const storage = persistent ? localStorage : sessionStorage;
  storage.removeItem(`form_${key}`);
};

// Export all utilities
export {
  clearFormFromStorage,
  createAutoSave,
  createFieldProps,
  createInitialFormState,
  createMultiStepFormState,
  getFieldError,
  getFieldErrors,
  goToNextStep,
  goToPreviousStep,
  goToStep,
  handleFormSubmission,
  hasFieldError,
  loadFormFromStorage,
  markFieldAsDirty,
  resetForm,
  sanitizeFormData,
  saveFormToStorage,
  transformFormData,
  validateConditionalField,
  validateField,
  validateForm,
  validateStep,
};
