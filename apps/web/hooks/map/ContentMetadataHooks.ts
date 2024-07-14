import { countries } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { useMemo } from "react";

import { useTranslation } from "@/i18n/client";

import { dataCategory, dataLicense } from "@/lib/validations/common";

export const useContentMetadataHooks = () => {
  const { t } = useTranslation(["common", "countries"]);

  const dataCategoryOptions = useMemo(() => {
    return dataCategory.options.map((dataCategory) => {
      return {
        value: dataCategory,
        label: `${t(`common:metadata.data_category.${dataCategory}`)}`,
      };
    });
  }, [t]);

  const geographicalCodeOptions = useMemo(() => {
    return countries.map((countryCode) => {
      return {
        value: countryCode,
        label: `${t(`countries:${countryCode}`)}`,
        icon: getUnicodeFlagIcon(countryCode),
      };
    });
  }, [t]);

  const licenseOptions = useMemo(() => {
    return dataLicense.options.map((license) => {
      return {
        value: license,
        label: `${t(`common:metadata.license.${license}`)}`,
      };
    });
  }, [t]);

  return {
    t,
    dataCategoryOptions,
    geographicalCodeOptions,
    licenseOptions,
  };
};
