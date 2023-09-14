import type { IStore } from '@/types/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectStyling = (state: IStore) => state.styling;

export const selectMapLayer = createSelector(
    selectStyling,
    ({mapLayer}) => mapLayer
  );
