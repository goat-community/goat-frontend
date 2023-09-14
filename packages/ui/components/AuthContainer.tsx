import { Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
export default function AuthContainer({
  headerTitle,
  headerAlert,
  body,
  footer,
}: {
  headerTitle: string;
  headerAlert?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: 490,
        height: "fit-content",
        marginBottom: theme.spacing(4),
      }}
    >
      <CardContent>
        <Stack
          spacing={theme.spacing(4)}
          sx={{
            mb: theme.spacing(4),
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              pb: theme.spacing(4),
            }}
          >
            {headerTitle}
          </Typography>
          {headerAlert}
        </Stack>
        {body}
        {footer}
      </CardContent>
    </Card>
  );
}
