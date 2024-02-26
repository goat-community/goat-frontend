import React, { useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";

interface CustomMenuProps {
  children: React.ReactNode;
  close: () => void;
  onScrolling?: (e) => void;
  sx?,
}

const CustomMenu = (props: CustomMenuProps) => {
  const {children, close, onScrolling, sx} = props;

  const menu = useRef<HTMLDivElement | null>(null);

  const theme = useTheme();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClickOutside(e: Event) {
    if(menu.current && !menu.current.contains(e.target as Node)){
      close()
    }
  }

  return (
    <Box
      component="div"
      onScroll={onScrolling}
      sx={{
        position: "absolute",
        top: "80%",
        right: "5px",
        background: theme.palette.background.paper,
        borderRadius: theme.spacing(2),
        zIndex: "20",
        maxHeight: "250px",
        overflow: "scroll",
        ...sx,
      }}
      ref={menu}
    >
      {children}
    </Box>
  );
};

export default CustomMenu;
