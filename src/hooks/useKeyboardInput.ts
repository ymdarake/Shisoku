import { useEffect } from 'react';

type KeyboardHandler = (event: KeyboardEvent) => void;

export function useKeyboardInput(onKeyDown: KeyboardHandler): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      onKeyDown(e);
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [onKeyDown]);
}


