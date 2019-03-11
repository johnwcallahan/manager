import { act, cleanup, renderHook } from 'react-hooks-testing-library';
import { useOpenClose } from './useOpenClose';

describe('useOpenClose hook', () => {
  afterEach(cleanup);

  it('defaults "isOpen" property to false', () => {
    const { result } = renderHook(() => useOpenClose());
    expect(result.current.isOpen).toBe(false);
  });

  it('defaults "error" property to undefined', () => {
    const { result } = renderHook(() => useOpenClose());
    expect(result.current.error).toBe(undefined);
  });

  it('includes a "open" function which sets isOpen to true', () => {
    const { result } = renderHook(() => useOpenClose());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it('includes a "close" function which sets isOpen to false', () => {
    const { result } = renderHook(() => useOpenClose());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('includes a "setError" function which sets the "error" property', () => {
    const { result } = renderHook(() => useOpenClose());
    act(() => result.current.setError([{ reason: 'Some Error' }]));
    expect(result.current.error).toEqual([{ reason: 'Some Error' }]);
  });
});
