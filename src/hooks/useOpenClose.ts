import * as React from 'react';

interface OpenCloseState {
  open: boolean;
  error?: Linode.ApiFieldError[];
}

export interface OpenClose {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  error?: Linode.ApiFieldError[];
  setError: (error: Linode.ApiFieldError[]) => void;
}

const defaultState = {
  open: false
};

export const useOpenClose = (
  initialState: OpenCloseState = defaultState
): OpenClose => {
  const [entity, setEntity] = React.useState<OpenCloseState>(initialState);

  const open = () => setEntity(prevState => ({ ...prevState, open: true }));
  const close = () => setEntity(prevState => ({ ...prevState, open: false }));

  const setError = (error: Linode.ApiFieldError[]) =>
    setEntity(prevState => ({ ...prevState, error }));

  const { error } = entity;
  const isOpen = entity.open;

  return { isOpen, open, close, error, setError };
};
