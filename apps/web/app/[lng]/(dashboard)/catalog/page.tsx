"use client";

import EmptySection from "@/components/common/EmptySection";
import { useTranslation } from "@/i18n/client";
import { Container } from "@mui/material";
import { ICON_NAME } from "@p4b/ui/components/Icon";

const Catalog = () => {
  const { t } = useTranslation("maps");
  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      <EmptySection label={t("coming_soon")} icon={ICON_NAME.COMING_SOON} />
    </Container>
  );
};

export default Catalog;
