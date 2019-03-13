import * as React from 'react';

export interface OpenClose {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/**
 *  Simple hook to keep track of open/close state.
 * @param  initialState {boolean} default value for isOpen
 */
export const useOpenClose = (initialState: boolean = false): OpenClose => {
  const [isOpen, setIsOpen] = React.useState<boolean>(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
};
