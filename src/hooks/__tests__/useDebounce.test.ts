import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by 250ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(250);
    });
    
    // Value should still be the old one
    expect(result.current).toBe('initial');

    // Fast-forward time by another 250ms (total 500ms)
    act(() => {
      vi.advanceTimersByTime(250);
    });
    
    // Now the value should be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Change value multiple times rapidly
    rerender({ value: 'first', delay: 500 });
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    rerender({ value: 'second', delay: 500 });
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    rerender({ value: 'final', delay: 500 });
    
    // Value should still be initial
    expect(result.current).toBe('initial');
    
    // Complete the debounce period
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Should have the final value
    expect(result.current).toBe('final');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      }
    );

    rerender({ value: 'updated', delay: 1000 });
    
    // Should not update after 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('initial');
    
    // Should update after full 1000ms
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 },
      }
    );

    rerender({ value: 'updated', delay: 0 });
    
    // With zero delay, should update immediately on next tick
    act(() => {
      vi.advanceTimersByTime(0);
    });
    
    expect(result.current).toBe('updated');
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'updated', delay: 500 });
    
    // Unmount before timeout completes
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });

  it('should handle complex objects', () => {
    const initialObj = { name: 'John', age: 30 };
    const updatedObj = { name: 'Jane', age: 25 };
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialObj, delay: 500 },
      }
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj, delay: 500 });
    
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(result.current).toEqual(updatedObj);
  });

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: null as string | null, delay: 500 },
      }
    );

    expect(result.current).toBeNull();

    rerender({ value: undefined as string | undefined, delay: 500 });
    
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(result.current).toBeUndefined();

    rerender({ value: 'defined', delay: 500 });
    
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(result.current).toBe('defined');
  });
});