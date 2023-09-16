import { Box, Button, Divider, Typography } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

const ContentSection = () => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Recent Content</Typography>
        <Button
          variant="text"
          size="small"
          endIcon={
            <Icon iconName={ICON_NAME.CHEVRON_RIGHT} style={{ fontSize: 12 }} />
          }
          href="/content"
          sx={{
            borderRadius: 0,
          }}
        >
          See All
        </Button>
      </Box>
      <Divider sx={{ mb: 4 }} />
    </Box>
  );
};

export default ContentSection;
