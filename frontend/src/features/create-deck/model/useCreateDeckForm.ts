import { useState } from 'react';
import { hasErrors } from '../../../shared/lib/validation';
import { validateDeckFields } from '../../../entities/deck/model/validation';

export interface NewDeckValues {
  name: string;
  description: string;
  isPublic: boolean;
  createInAnki: boolean;
  tags: string[];
}

const initialValues: NewDeckValues = {
  name: '',
  description: '',
  isPublic: false,
  createInAnki: false,
  tags: [],
};

export const useCreateDeckForm = () => {
  const [values, setValues] = useState<NewDeckValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateDeckFields(values);

  const setField = <K extends keyof NewDeckValues>(
    key: K,
    value: NewDeckValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const submit = () => {
    setSubmitted(true);
    return !hasErrors(errors);
  };

  const reset = () => {
    setValues(initialValues);
    setSubmitted(false);
  };

  return { values, errors, setField, submitted, submit, reset };
};
