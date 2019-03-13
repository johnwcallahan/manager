import { shallow } from 'enzyme';
import * as React from 'react';
import { ObjectStorageDrawer, Props } from './ObjectStorageDrawer';

describe('ObjectStorageDrawer', () => {
  const props = {
    classes: { root: '' },
    open: true,
    onSubmit: jest.fn(),
    onClose: jest.fn()
  };
  const wrapper = shallow<Props>(<ObjectStorageDrawer {...props} />);
  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });
  it.skip('calls onSubmit when the submit button is clicked', () => {
    const submitButton = wrapper.find('[data-qa-submit]');
    submitButton.simulate('click');
    expect(props.onSubmit).toHaveBeenCalled();
  });
  it.skip('calls onClose when the cancel button is clicked', () => {
    const submitButton = wrapper.find('[data-qa-cancel]');
    submitButton.simulate('click');
    expect(props.onClose).toHaveBeenCalled();
  });
});
