import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { closeCLIDrawer, openCLIDrawer } from './cli.actions';

export interface State {
  isOpen: boolean;
}

export const defaultState: State = {
  isOpen: false
};

export const reducer: Reducer<State> = (state = defaultState, action) => {
  // OPEN
  if (isType(action, openCLIDrawer)) {
    return {
      ...state,
      isOpen: true
    };
  }

  // CLOSE
  if (isType(action, closeCLIDrawer)) {
    return {
      ...state,
      isOpen: false
    };
  }

  return state;
};

export default reducer;
