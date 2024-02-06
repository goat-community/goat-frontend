"use client";

import EmptySection from "@/components/common/EmptySection";
import { useTranslation } from "@/i18n/client";
import { Box } from "@mui/material";
import { ICON_NAME } from "@p4b/ui/components/Icon";

export default function Teams() {
  const { t } = useTranslation("maps");

  return (
    <>
      <Box sx={{ p: 4, minHeight: "300px" }}>
        <EmptySection label={t("coming_soon")} icon={ICON_NAME.COMING_SOON} />
      </Box>
    </>
  );
}
