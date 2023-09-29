import React, { useState, useRef } from 'react';
import { ClassNames } from '@emotion/react';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  distance: number;
  onChange?: (value: [number, number]) => void;
  colors: {
    in: string;
    out: string;
  };
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step,
  value,
  distance,
  onChange,
  colors,
}) => {
  const [stateValue, setStateValue] = useState<[number, number]>(value);
  const ref = useRef<HTMLDivElement>(null);
  const range = max - min;

  const getKeyboardStep = () => {
    let keyboardStep = Math.floor(max / 100);
    return keyboardStep < step ? step : keyboardStep;
  };

  const triggerMouseMin = () => {
    document.addEventListener('mousemove', mouseMoveMin);
    document.addEventListener('mouseup', clearDocumentEvents);
  };

  const triggerMouseMax = () => {
    document.addEventListener('mousemove', mouseMoveMax);
    document.addEventListener('mouseup', clearDocumentEvents);
  };

  const triggerTouchMin = () => {
    document.addEventListener('touchmove', touchMoveMin);
    document.addEventListener('touchend', clearDocumentEvents);
    document.addEventListener('touchcancel', clearDocumentEvents);
  };

  const triggerTouchMax = () => {
    document.addEventListener('touchmove', touchMoveMax);
    document.addEventListener('touchend', clearDocumentEvents);
    document.addEventListener('touchcancel', clearDocumentEvents);
  };

  const getCordsProperties = () => {
    if (ref.current) {
      const { x, width } = ref.current.getBoundingClientRect();
      return { minX: x, maxX: x + width, width };
    }
    return { minX: 0, maxX: 0, width: 0 };
  };

  const touchMoveMax = (e: TouchEvent) => {
    const { clientX } = e.changedTouches[0];
    dragMax(clientX);
  };

  const mouseMoveMax = (e: MouseEvent) => {
    const { clientX } = e;
    dragMax(clientX);
  };

  const touchMoveMin = (e: TouchEvent) => {
    const { clientX } = e.changedTouches[0];
    dragMin(clientX);
  };

  const mouseMoveMin = (e: MouseEvent) => {
    const { clientX } = e;
    dragMin(clientX);
  };

  const dragMin = (clientX: number) => {
    const { minX, width } = getCordsProperties();
    const percent = clientX < minX ? 0 : (clientX - minX) / width;
    let minVal = percent * range;

    setStateValue((prevState) => {
      const [prevStateMin, prevStateMax] = prevState;
      if (clientX <= minX) {
        return [min, prevStateMax];
      }

      const delta =
        (minVal - prevStateMin + min) / step;
      let addition = 0;
      if (Math.abs(delta) >= 1) {
        addition = Math.floor(delta / step) * step;
      }
      minVal = prevStateMin + addition;
      if (minVal + distance > prevStateMax) {
        minVal = prevStateMax - distance;
      }
      return [minVal, prevStateMax];
    });
    callback();
  };

  const dragMax = (clientX: number) => {
    const { maxX, minX, width } = getCordsProperties();
    const percent = clientX > maxX ? 1 : (clientX - minX) / width;
    let maxVal = percent * range;

    setStateValue((prevState) => {
      const [prevStateMin, prevStateMax] = prevState;
      if (clientX >= maxX) {
        return [prevStateMin, max];
      }
      const delta = (maxVal - prevStateMax + min) / step;
      let addition = 0;
      if (Math.abs(delta) >= 1) {
        addition = Math.ceil(delta / step) * step;
      }
      maxVal = prevStateMax + addition;
      if (maxVal - distance < prevStateMin) {
        maxVal = prevStateMin + distance;
      }
      return [prevStateMin, maxVal];
    });
    callback();
  };

  const callback = () => {
    if (typeof onChange === 'function') {
      onChange(stateValue);
    }
  };

  const clearDocumentEvents = () => {
    document.removeEventListener('mouseup', clearDocumentEvents);
    document.removeEventListener('mousemove', mouseMoveMin);
    document.removeEventListener('mousemove', mouseMoveMax);
    document.removeEventListener('touchmove', touchMoveMin);
    document.removeEventListener('touchmove', touchMoveMax);
    document.removeEventListener('touchend', clearDocumentEvents);
    document.removeEventListener('touchcancel', clearDocumentEvents);
  };

  const handleMinKeydown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e;

    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      return;
    }

    if (key === 'ArrowRight') {
      setStateValue((prevState) => {
        const [prevStateMin, prevStateMax] = prevState;
        const nextStateMin =
          prevStateMin + distance >= prevStateMax
            ? prevStateMax - distance
            : prevStateMin + getKeyboardStep();
        return [nextStateMin, prevStateMax];
      });
    } else if (key === 'ArrowLeft') {
      setStateValue((prevState) => {
        const [prevStateMin] = prevState;
        const nextStateMin =
          prevStateMin <= min ? min : prevStateMin - getKeyboardStep();
        return [nextStateMin, prevState[1]];
      });
    }
    callback();
  };

  const handleMaxKeydown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e;

    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      return;
    }

    if (key === 'ArrowRight') {
      setStateValue((prevState) => {
        const [, prevStateMax] = prevState;
        const nextStateMax =
          prevStateMax >= max ? max : prevStateMax + getKeyboardStep();
        return [prevState[0], nextStateMax];
      });
    } else if (key === 'ArrowLeft') {
      setStateValue((prevState) => {
        const [prevStateMin, prevStateMax] = prevState;
        const nextStateMax =
          prevStateMax - distance <= prevStateMin
            ? prevStateMin + distance
            : prevStateMax - getKeyboardStep();
        return [prevStateMin, nextStateMax];
      });
    }
    callback();
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    let point = e.clientX;
    const { minX, maxX, width } = getCordsProperties();
    if (point < minX) {
      point = minX;
    } else if (point > maxX) {
      point = maxX;
    }
    const rangeValue =
      Math.round(((point - minX) * range) / width) + min;

    setStateValue((prevState) => {
      const [prevStateMin, prevStateMax] = prevState;
      if (rangeValue <= prevStateMin) {
        return [rangeValue, prevStateMax];
      } else if (rangeValue >= prevStateMax) {
        return [prevStateMin, rangeValue];
      }
      if (Math.abs(rangeValue - prevStateMin) >= Math.abs(rangeValue - prevStateMax)) {
        const nextMaxState =
          rangeValue - prevStateMin < distance
            ? prevStateMin + distance
            : rangeValue;
        return [prevStateMin, nextMaxState];
      } else {
        const nextMinState =
          prevStateMax - rangeValue < distance
            ? prevStateMax - distance
            : rangeValue;
        return [nextMinState, prevStateMax];
      }
    });
    callback();
  };

  const [minState, maxState] = stateValue;
  const right = 100 - ((maxState - min) * 100) / range;
  const left = ((minState - min) * 100) / range;

  return (
    <ClassNames>
      {({ css }) => (
        <div className={css({})}>
          <div
            className={css({ width: '100%', position: 'relative' })}
            ref={ref}
          >
            <div
              className={css({
                width: '100%',
                height: '4px',
                borderRadius: '999px',
                backgroundColor: colors.out,
              })}
              onClick={handleBarClick}
            />
            <div
              className={css({
                position: 'absolute',
                top: '0px',
                height: '4px',
                borderRadius: '999px',
                backgroundColor: colors.in,
              })}
              onClick={handleBarClick}
              style={{
                left: left + '%',
                right: right + '%',
              }}
            >
              <Button
                className={css({
                  position: 'absolute',
                  top: '-13px',
                  left: '-10px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  boxShadow: 'rgb(235, 235, 235) 0px 2px 2px',
                  border: '1px solid #d9d9d9',
                })}
                onClick={(e) => e.preventDefault()}
                role="slider"
                tabIndex={0}
                aria-valuenow={minState}
                aria-valuemax={max}
                aria-valuemin={min}
                aria-disabled="false"
                onMouseDown={triggerMouseMin}
                onKeyDown={handleMinKeydown}
                onTouchStart={triggerTouchMin}
              />
              <Button
                className={css({
                  position: 'absolute',
                  top: '-13px',
                  right: '-10px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  boxShadow: 'rgb(235, 235, 235) 0px 2px 2px',
                  border: '1px solid #d9d9d9',
                })}
                onClick={(e) => e.preventDefault()}
                role="slider"
                tabIndex={0}
                aria-valuenow={maxState}
                aria-valuemax={max}
                aria-valuemin={min}
                aria-disabled="false"
                onKeyDown={handleMaxKeydown}
                onMouseDown={triggerMouseMax}
                onTouchStart={triggerTouchMax}
              />
            </div>
          </div>
        </div>
      )}
    </ClassNames>
  );
};

const Button: React.FC<React.HTMLAttributes<HTMLButtonElement>> = (props) => (
  <ClassNames>
    {({ css }) => (
      <button {...props}>
        {[1, 2, 3].map((index) => (
          <span
            key={index}
            className={css({
              height: '9px',
              width: '1px',
              backgroundColor: 'rgb(216, 216, 216)',
              marginLeft: '1px',
              marginRight: '1px',
              display: 'inline-block',
            })}
          />
        ))}
      </button>
    )}
  </ClassNames>
);

export default RangeSlider;