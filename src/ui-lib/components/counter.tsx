import { forwardRef, useState } from 'react';
import { cva, type RecipeVariantProps } from 'styled-system/css';
import { styled } from 'styled-system/jsx';

export type CounterVariantProps = RecipeVariantProps<typeof counterRecipe>;

export const counterRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    border: '1px solid',
    borderColor: 'border.01_gray',
    rounded: 'full',
    p: 1,
    gap: 1,
    userSelect: 'none',

    height: '28px',
    width: '89px',
  },
});

export const counterButtonRecipe = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontWeight: 'bold',
    color: 'neutral.09_black',
    width: '24px',
    height: '24px',
    fontSize: '14px',

    _hover: {
      backgroundColor: 'neutral.04_lightestgray',
      transform: 'scale(1.1)',
    },

    _active: {
      transform: 'scale(0.95)',
    },

    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.4,
      pointerEvents: 'none',
    },
  },
});

export const counterDisplayRecipe = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    fontSize: '14px',
    fontWeight: 'semibold',
    color: 'neutral.09_black',
    minWidth: '20px',
  },
});

const StyledCounterContainer = styled('div', counterRecipe);
const StyledCounterButton = styled('button', counterButtonRecipe);
const StyledCounterDisplay = styled('div', counterDisplayRecipe);

export interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
}

export const Counter = forwardRef<HTMLDivElement, CounterProps>((props, ref) => {
  const {
    value: controlledValue,
    defaultValue = 0,
    min = 0,
    max = Infinity,
    step = 1,
    disabled = false,
    onValueChange,
    ...restProps
  } = props;

  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    const newValue = Math.min(value + step, max);
    if (newValue !== value) {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    }
  };

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    const newValue = Math.max(value - step, min);
    if (newValue !== value) {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    }
  };

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  return (
    <StyledCounterContainer ref={ref} {...restProps}>
      <StyledCounterButton disabled={!canDecrement} onClick={handleDecrement} aria-label="Decrease value">
        −
      </StyledCounterButton>

      <StyledCounterDisplay>{value}</StyledCounterDisplay>

      <StyledCounterButton disabled={!canIncrement} onClick={handleIncrement} aria-label="Increase value">
        +
      </StyledCounterButton>
    </StyledCounterContainer>
  );
});

Counter.displayName = 'Counter';
