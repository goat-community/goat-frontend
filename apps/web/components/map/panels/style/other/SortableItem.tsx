import { useSortable } from "@dnd-kit/sortable";
import { Grid, MenuItem, Stack } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "@/components/common/DragHandle";
import { DragIndicator } from "@mui/icons-material";

type SortableItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  active?: boolean;
  label: string;
  colorLegend?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

export function SortableItem(props: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: `${transition}, border-color 0.2s ease-in-out`,
  };
  return (
    <MenuItem
      key={props.item.id}
      ref={setNodeRef}
      selected={props.active}
      style={style}
      disableGutters
      disableRipple
      sx={{
        pr: 0,
        py: 1,
        ":hover": {
          "& div, & button": {
            opacity: 1,
          },
        },
      }}
    >
      <Grid container alignItems="center" justifyContent="start" spacing={2}>
        <Grid item xs={1} sx={{ mx: 1 }}>
          <DragHandle {...attributes} listeners={listeners}>
            <DragIndicator fontSize="small" />
          </DragHandle>
        </Grid>
        <Grid item xs={2} zeroMinWidth>
          {props.colorLegend}
        </Grid>
        <Grid item xs={6} zeroMinWidth>
          {props.children}
        </Grid>
        <Grid item xs={2}>
          <Stack direction="row" justifyContent="flex-end">
            {props.actions && props.actions}
          </Stack>
        </Grid>
      </Grid>
    </MenuItem>
  );
}
