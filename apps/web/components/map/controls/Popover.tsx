import { OverflowTypograpy } from "@/components/common/OverflowTypography";
import { Box, Divider, IconButton, Link, Paper, Stack } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { Popup } from "react-map-gl";

export type MapPopoverProps = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: { [name: string]: any } | null;
  lngLat: [number, number];
  onClose: () => void;
};

interface RowProps {
  name: string;
  value: string;
}

const Row: React.FC<RowProps> = ({ name, value }) => {
  // Set 'url' to 'value' if it looks like a url
  let url = "";
  if (
    !url &&
    value &&
    typeof value === "string" &&
    value.match(/^(http|www)/)
  ) {
    url = value;
  }

  return (
    <tr>
      <td>
        <OverflowTypograpy
          variant="body2"
          tooltipProps={{
            placement: "top",
            arrow: true,
            enterDelay: 200,
          }}
        >
          {name}
        </OverflowTypograpy>
      </td>
      <td style={{ textAlign: "right" }}>
        <OverflowTypograpy
          variant="body2"
          fontWeight="bold"
          tooltipProps={{
            placement: "top",
            arrow: true,
            enterDelay: 200,
          }}
        >
          {url ? (
            <Link target="_blank" rel="noopener noreferrer" href={url}>
              {value}
            </Link>
          ) : (
            <>{value}</>
          )}
        </OverflowTypograpy>
      </td>
    </tr>
  );
};

const MapPopover: React.FC<MapPopoverProps> = ({
  title,
  properties,
  lngLat,
  onClose,
}) => {
  return (
    <Popup
      onClose={onClose}
      longitude={lngLat[0]}
      latitude={lngLat[1]}
      closeButton={false}
      maxWidth="300px"
    >
      <Box>
        <Paper elevation={0}>
          <Stack
            sx={{ px: 2, pt: 2 }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ width: "90%" }}
            >
              <Icon iconName={ICON_NAME.LAYERS} style={{ fontSize: 16 }} />
              <OverflowTypograpy
                variant="body2"
                fontWeight="bold"
                tooltipProps={{
                  placement: "top",
                  arrow: true,
                }}
              >
                {title}
              </OverflowTypograpy>
            </Stack>
            <IconButton onClick={onClose}>
              <Icon iconName={ICON_NAME.XCLOSE} style={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 0 }} />
          <Box sx={{ maxHeight: "280px", overflowY: "auto" }}>
            {properties && (
              <table
                style={{
                  tableLayout: "fixed",
                  width: "100%",
                  padding: 5,
                }}
              >
                <tbody>
                  {Object.entries(properties).map(([key, value]) => (
                    <Row key={key} name={key} value={value} />
                  ))}
                </tbody>
              </table>
            )}
          </Box>
        </Paper>
      </Box>
    </Popup>
  );
};

export default MapPopover;
