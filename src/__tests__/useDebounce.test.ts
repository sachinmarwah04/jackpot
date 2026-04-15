import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update before the delay has elapsed', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    rerender({ value: 'world', delay: 300 });
    act(() => { jest.advanceTimersByTime(200); });

    expect(result.current).toBe('hello');
  });

  it('updates to the latest value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    rerender({ value: 'world', delay: 300 });
    act(() => { jest.advanceTimersByTime(300); });

    expect(result.current).toBe('world');
  });

  it('resets the timer on rapid updates and only emits the last value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    act(() => { jest.advanceTimersByTime(100); });
    rerender({ value: 'abc' });
    act(() => { jest.advanceTimersByTime(100); });
    rerender({ value: 'abcd' });
    act(() => { jest.advanceTimersByTime(100); });

    // 300 ms have elapsed in total but each change reset the timer
    expect(result.current).toBe('a');

    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('abcd');
  });

  it('uses the default delay of 300 ms when no delay is provided', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    act(() => { jest.advanceTimersByTime(299); });
    expect(result.current).toBe('initial');

    act(() => { jest.advanceTimersByTime(1); });
    expect(result.current).toBe('updated');
  });

  it('respects a custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    act(() => { jest.advanceTimersByTime(999); });
    expect(result.current).toBe('initial');

    act(() => { jest.advanceTimersByTime(1); });
    expect(result.current).toBe('updated');
  });

  it('works with non-string types', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: 0 } }
    );

    rerender({ value: 42 });
    act(() => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe(42);
  });
});
