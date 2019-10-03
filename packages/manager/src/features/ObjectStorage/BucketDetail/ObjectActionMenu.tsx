import * as React from 'react';
import ActionMenu, { Action } from 'src/components/ActionMenu/ActionMenu';

export interface Props {
  objectName: string;
  handleClickDelete: (objectName: string) => void;
}

export const ObjectActionMenu: React.FC<Props> = props => {
  const createActions = () => (closeMenu: Function): Action[] => {
    return [
      {
        title: 'Delete',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          props.handleClickDelete(props.objectName);
          closeMenu();
          e.preventDefault();
        }
      }
    ];
  };

  return <ActionMenu createActions={createActions()} />;
};

export default ObjectActionMenu;
