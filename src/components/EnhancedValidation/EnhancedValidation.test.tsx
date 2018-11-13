import { mount } from 'enzyme';

import * as React from 'react';

import withEnhancedValidation from './EnhancedValidation';

describe('EnhancedValidation', () => {
  const MyComponent = withEnhancedValidation(
    () => ({ myName: 'myValue' }),
    jest.fn(),
    jest.fn(),
    'Success'
  )(() => <div/>);

  const wrapper = mount(<MyComponent />);
  const getInnerComponent = () => {
    return wrapper.find('WrappedComponent').first().children();
  }

  const {
    handleTextFieldChange,
    handleSelectFieldChange,
    handleFormSubmission,
    createFormErrors,
    maybeGetErrorText,
  } = getInnerComponent().props();
  describe('Props & Methods', () => {

    it('contains handleTextFieldChange prop', () => {
      expect(handleTextFieldChange).toBeDefined();
      expect(handleTextFieldChange).toBeInstanceOf(Function);
    });

    it('contains handleSelectFieldChange prop', () => {
      expect(handleSelectFieldChange).toBeDefined();
      expect(handleTextFieldChange).toBeInstanceOf(Function);
    });

    it('contains handleFormSubmission prop', () => {
      expect(handleFormSubmission).toBeDefined();
      expect(handleTextFieldChange).toBeInstanceOf(Function);
    });

    it('contains createFormErrors prop', () => {
      expect(createFormErrors).toBeDefined();
      expect(handleTextFieldChange).toBeInstanceOf(Function);
    });

    it('contains maybeGetErrorText prop', () => {
      expect(maybeGetErrorText).toBeDefined();
      expect(handleTextFieldChange).toBeInstanceOf(Function);
    });
  });

  describe('Text field change', () => {
    const newValue = 'myNewValue!!'
    const mockHTMLEvent = { target: { name: 'myName', value: newValue } };
    handleTextFieldChange(mockHTMLEvent);
    wrapper.update();
    expect(getInnerComponent().props().values.myName).toBe(newValue);
  });
});
