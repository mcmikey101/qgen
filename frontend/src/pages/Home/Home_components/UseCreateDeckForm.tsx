import { useState } from 'react';
import type { NewDeckValues } from './types';

const initialValues: NewDeckValues = {
  name: '',
  description: '',
  isPublic: false,
  createInAnki: false,
  tags: [],
};

export const useCreateDeckForm = () => {
  const [values, setValues] = useState<NewDeckValues>(initialValues);

  const setField = <K extends keyof NewDeckValues>(
    key: K,
    value: NewDeckValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setValues(initialValues);

  return { values, setField, reset };
};
