"use client";

import { useEffect, useRef } from "react";
import { makeStyles } from "@/lib/theme";
import { Chip, Typography } from "@mui/material";
import { v4 } from "uuid";
import { changeColorOpacity } from "@/lib/utils/helpers";

export type ChipListProps = {
  className?: string;
  chips: string[];
};

export const ChipList = (props) => {
  const { className, chips } = props;

  const { classes } = useStyles();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOverflow = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const chipsContainer = container.firstChild as HTMLElement;

      if (chipsContainer) {
        const chips = Array.from(chipsContainer.children) as HTMLElement[];

        chips.forEach((chip) => {
          const chipRect = chip.getBoundingClientRect();
          const isChipFullyVisible =
            chipRect.left >= containerRect.left &&
            chipRect.right <= containerRect.right;

          chip.style.display = isChipFullyVisible ? "flex" : "none";
        });
      }
    };

    handleOverflow();

    window.addEventListener("resize", handleOverflow);

    return () => {
      window.removeEventListener("resize", handleOverflow);
    };
  }, []);

  return (
    <div className={className} ref={containerRef} style={{ overflowX: "auto" }}>
      <div style={{ display: "flex" }} className={classes.chips}>
        {chips.map((chip: string) => (
          <Chip
            key={v4()}
            label={
              <Typography variant="body2" color="secondary">
                {chip}
              </Typography>
            }
            className={classes.chip}
          />
        ))}
        <Chip label="..." className={classes.chip} />
      </div>
    </div>
  );
};

const useStyles = makeStyles({ name: { ChipList } })((theme) => ({
  chips: {
    display: "flex",
    width: "100%",
  },
  chip: {
    backgroundColor: changeColorOpacity({
      color:
        theme.colors.palette[theme.isDarkModeEnabled ? "dark" : "light"]
          .greyVariant2,
      opacity: 0.3,
    }),
    marginRight: "8px",
    padding: "7px 18px",
    fontStyle: "italic",
    fontSize: "11px",
    "& .mui-6od3lo-MuiChip-label": {
      padding: "0",
    },
  },
}));

export default ChipList;
