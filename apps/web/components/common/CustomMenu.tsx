import React, { useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";

interface CustomMenuProps {
  children: React.ReactNode;
  close: () => void;
}

const CustomMenu = (props: CustomMenuProps) => {
  const {children, close} = props;

  const menu = useRef<HTMLDivElement | null>(null);

  const theme = useTheme();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
  }, []);

  function handleClickOutside(e: Event) {
    if(menu.current && !menu.current.contains(e.target as Node)){
      close()
    }
  }

  return (
    <Box
      component="div"
      sx={{
        position: "absolute",
        top: "80%",
        right: "20px",
        background: theme.palette.background.default,
        borderRadius: theme.spacing(2),
        zIndex: "20",
      }}
      ref={menu}
    >
      {children}
    </Box>
  );
};

export default CustomMenu;
