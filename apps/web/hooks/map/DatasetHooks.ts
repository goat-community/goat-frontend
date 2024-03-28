import { useTranslation } from "@/i18n/client";
import { useCallback } from "react";

export const useGetMetadataValueTranslation = () => {
  const { t, i18n } = useTranslation(["common", "countries"]);

  const getMetadataValueTranslation = useCallback(
    (key: string, value: string) => {
      if (!value) return " — ";
      let translationPath = `common:metadata.${key}.${value}`;
      if (key === "geographical_code") {
        translationPath = `countries:${value.toUpperCase()}`;
      }

      return i18n.exists(translationPath) ? t(translationPath) : value;
    },
    [i18n, t],
  );

  return getMetadataValueTranslation;
};
