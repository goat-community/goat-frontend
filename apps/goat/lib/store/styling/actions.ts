import { stylingApi } from '@/lib/store/styling/api';
import { stylesObj } from "@/lib/utils/mockLayerData";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const layerDataFetcher = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stylesObj[id]);
    }, 1000); // Simulate a 1-second delay
  });
};

export const fetchLayerData = createAsyncThunk(
  "styling/fetchLayerData",
  async (id:string, { rejectWithValue }) => {
    try {
      const response = await stylingApi.getLayersByCollection(id as string);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCollections = createAsyncThunk(
  "styling/getCollections",
  async ( _, { rejectWithValue }) => {
    try {
      const response = await stylingApi.getCollections();
      return response.data.collections;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
