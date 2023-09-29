import React, { useState, useEffect } from 'react';
import Histogram from './Histogram';
import RangeSlider from './RangeSlider';
import { ClassNames } from '@emotion/react';

interface HistogramSliderProps {
  data: number[];
  value: [number, number];
  min: number;
  max: number;
  step: number;
  distance: number;
  debounceDelay?: number;
  colors: {
    in: string;
    out: string;
  };
  onApply?: (value: [number, number]) => void;
  onChange?: (value: [number, number]) => void;
}

const HistogramSlider: React.FC<HistogramSliderProps> = (props) => {
  const [value, setValue] = useState<[number, number]>([props.value[0], props.value[1]]);
  const [timeout, setTimeoutHandle] = useState<number | null>(null);

  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);

  const reset = (e: React.MouseEvent) => {
    e.preventDefault();
    setValue([props.min, props.max]);
    if (typeof props.onApply === 'function') {
      props.onApply([props.min, props.max]);
    } else if (typeof props.onChange === 'function') {
      props.onChange([props.min, props.max]);
    }
  };

  const isDisabled = () => {
    return value[0] === props.min && value[1] === props.max;
  };

  const handleSliderChange = (newValue: [number, number]) => {
    setValue(newValue);

    if (typeof props.onChange === 'function') {
      if (timeout) {
        clearTimeout(timeout);
      }
      const newTimeout = window.setTimeout(() => {
        props.onChange(newValue);
      }, props.debounceDelay || 500);
      setTimeoutHandle(newTimeout);
    }
  };

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof props.onApply === 'function') {
      props.onApply(value);
    }
  };

  if (props.min >= props.max) {
    console.error(`The prop "min" should not be greater than the props "max".`);
    return null;
  }

  if (props.value[0] >= props.value[1]) {
    console.error(`The [0] of the prop "value" should not be greater than the [1].`);
    return null;
  }

  const isComponentDisabled = isDisabled();
  
  return (
    <ClassNames>
      {({ css }) => (
        <div
          className={css({
            maxWidth: '240px',
            minWidth: '240px',
            padding: '10px',
            boxSizing: 'border-box',
          })}
        >
          <Histogram
            colors={props.colors}
            data={props.data}
            value={value}
            min={props.min}
            max={props.max}
          />
          <div className={css({ marginTop: '-5px' })}>
            <RangeSlider
              {...props}
              value={value}
              onChange={handleSliderChange}
            />
          </div>
          <div className={css({ marginTop: '20px' })}>
            <div
              className={css({
                marginBottom: '10px',
                fontSize: '12px',
                color: '#666666',
              })}
            >
              ${value[0]} AUD - ${value[1]} AUD
            </div>

            {typeof props.onApply === 'function' && (
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isComponentDisabled ? 'flex-end' : 'space-between',
                })}
              >
                {!isComponentDisabled && (
                  <button onClick={reset} disabled={isComponentDisabled}>
                    Reset
                  </button>
                )}
                <button onClick={handleApply}>Apply</button>
              </div>
            )}
          </div>
        </div>
      )}
    </ClassNames>
  );
};

export default HistogramSlider;