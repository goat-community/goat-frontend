"use client";

// import { makeStyles } from "@/lib/theme";

// import Box from "@p4b/ui/components/Box";

interface ContentLayoutProps {
  children: React.ReactNode;
}

const ContentLayout = (props: ContentLayoutProps) => {
  // const { children } = props;

  // const { classes } = useStyles();

  return <>{props.children}</>;
};

// const useStyles = makeStyles({ name: { ContentLayout } })(() => ({
//   root: {
//     marginTop: "100px",
//   },
// }));

export default ContentLayout;