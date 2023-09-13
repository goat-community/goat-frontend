import type { ICON_NAME } from "@p4b/ui/components/Icon";

export interface HomeCardType {
  title: string;
  description?: string;
  chips: string[];
  info?: {
    author: string;
    date: string;
  };
  icon?: ICON_NAME;
}

export interface CardsDataArray {
  content: HomeCardType;
  media: false | { image: string };
}

export interface CardDataType {
  title: string;
  cards: CardsDataArray[];
  buttons: {label: string; path: string;}[];
}