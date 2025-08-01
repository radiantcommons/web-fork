import cn from 'clsx';
import { useState, KeyboardEvent } from 'react';
import { Text } from '../Text';

export const ELLIPSIS_KEY = '...';

interface PaginationButtonProps {
  value: number | typeof ELLIPSIS_KEY;
  onClick: (value: number) => void;
  active?: boolean;
  disabled?: boolean;
}

export const PaginationButton = ({ value, onClick, active, disabled }: PaginationButtonProps) => {
  const [isInput, setIsInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const isEllipsis = value === ELLIPSIS_KEY;

  const handleClick = () => {
    if (isEllipsis) {
      setIsInput(true);
      return;
    }
    onClick(value);
  };

  const clearInput = () => {
    setInputValue('');
    setIsInput(false);
  };

  const setNewValue = () => {
    const newValue = parseInt(inputValue, 10);
    if (!isNaN(newValue)) {
      onClick(newValue);
    }
    clearInput();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setNewValue();
    } else if (event.key === 'Escape') {
      clearInput();
    }
  };

  let color = active
    ? cn('bg-other-tonal-fill10 text-text-primary')
    : cn('text-text-secondary hover:text-text-primary focus:text-text-primary');
  if (isEllipsis) {
    color = cn('text-text-muted');
  }

  if (isInput) {
    return (
      <input
        autoFocus
        type='number'
        value={inputValue}
        onBlur={setNewValue}
        onKeyDown={onKeyDown}
        onInput={event => setInputValue(event.currentTarget.value)}
        className={cn(
          'h-8 w-12 rounded-sm bg-other-tonal-fill5 px-2 text-text-sm font-normal',
          'outline-2 outline-transparent transition-[background-color,outline-color] duration-150 outline-solid',
          'hover:bg-action-hover-overlay focus:outline-action-neutral-focus-outline',
          '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          disabled ? 'text-text-muted' : 'text-text-primary',
        )}
      />
    );
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'size-8 min-w-8 rounded-full border-none transition-colors focus:outline-hidden focus-visible:outline-2 focus-visible:outline-action-neutral-focus-outline',
        color,
      )}
    >
      <Text small>{value}</Text>
    </button>
  );
};
