import { cleanup, fireEvent, waitForElement } from '@testing-library/react';
import * as jaxe from 'jest-axe';
import * as React from 'react';
import { renderWithTheme, toPassAxeCheck } from 'src/utilities/testHelpers';
import { ActionMenu } from './ActionMenu';

jest.setTimeout(10000);

afterEach(cleanup);

expect.extend(toPassAxeCheck);
expect.extend(jaxe.toHaveNoViolations);

const classes = {
  actionSingleLink: '',
  button: '',
  hidden: '',
  item: '',
  root: '',
  menu: ''
};

const NB_OF_ACTIONS = 3;
describe('ActionMenu', () => {
  const action = { title: 'whatever', onClick: () => undefined };
  const createActionsMany = (closeMenu: Function) => {
    return Array(NB_OF_ACTIONS).fill(action);
  };
  const baseProps = {
    classes,
    createActions: createActionsMany,
    ariaLabel: 'label'
  };
  describe('should render', () => {
    it('a disabled button', () => {
      const { getByRole } = renderWithTheme(
        <ActionMenu {...baseProps} disabled={true} />
      );
      expect(getByRole('button')).toHaveAttribute('disabled');
    });

    it('an enabled button', () => {
      const cb = jest.fn();
      const { getByRole } = renderWithTheme(
        <ActionMenu {...baseProps} toggleOpenCallback={cb} />
      );
      const btn = getByRole('button');
      expect(btn).not.toHaveAttribute('disabled');
      fireEvent.click(btn);
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  it(`a list of ${NB_OF_ACTIONS} action menuitem`, async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <ActionMenu {...baseProps} />
    );
    fireEvent.click(getByRole('button'));
    const listItems = await waitForElement(() => getAllByRole('menuitem'));
    expect(listItems).toHaveLength(NB_OF_ACTIONS);
  });
  it('should pass axe check', async () => {
    const res = renderWithTheme(
      <ActionMenu
        classes={classes}
        createActions={createActionsMany}
        ariaLabel="label"
        disabled={true}
      />
    );
    expect(res).toPassAxeCheck();
    expect(await jaxe.axe(res.container)).toHaveNoViolations();
  });
});
