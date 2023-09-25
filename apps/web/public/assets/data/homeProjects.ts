import type { CardDataType } from "@/types/dashboard/home";
import { ICON_NAME } from "@p4b/ui/components/Icon";

export const tempCardInfo: CardDataType[] = [
  {
    buttons: [{label: "See all", path: "/projects"}],
    title: "Recent Projects",
    cards: [
      {
        content: {
          info: {
            author: "John Doe",
            date: "4 Feb 2022",
          },
          title: "Project title",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: {
          image:
            "/assets/images/goat.png",
        },
      },
      {
        content: {
          info: {
            author: "John Doe",
            date: "4 Feb 2022",
          },
          title: "Project title",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: {
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s",
        },
      },
      {
        content: {
          info: {
            author: "John Doe",
            date: "4 Feb 2022",
          },
          title: "Project title",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: {
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s",
        },
      },
    ],
  },
  {
    buttons: [{label: "See all", path: "/datasets"}],
    title: "Recent Contents",
    cards: [
      {
        content: {
          icon: ICON_NAME.FILE,
          title: "Content title",
          description: "content_file_title.extension",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: false,
      },
      {
        content: {
          icon: ICON_NAME.FILE,
          title: "Content title",
          description: "content_file_title.extension",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: false,
      },
      {
        content: {
          icon: ICON_NAME.FILE,
          title: "Content title",
          description: "content_file_title.extension",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: false,
      },
      {
        content: {
          icon: ICON_NAME.FILE,
          title: "Content title",
          description: "content_file_title.extension",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: false,
      },
    ],
  },
  {
    title: "Explore",
    buttons: [{label: "BLOG", path: "/blog"}, {label: "DOCUMENTATION", path: "documentation"}, {label: "TUTORIALS", path: "/tutorials"}, {label: "USE CASES", path: "/use-cases"}],
    cards: [
      {
        content: {
          info: {
            author: "John Doe",
            date: "4 Feb 2022",
          },
          title: "Label",
          description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: {
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s",
        },
      },
      {
        content: {
          info: {
            author: "John Doe",
            date: "4 Feb 2022",
          },
          title: "Label",
          description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: {
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s",
        },
      },
      {
        content: {
          info: {
            author: "John Doe",
            date: "4 Feb 2022",
          },
          title: "Label",
          description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: {
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s",
        },
      },
      {
        content: {
          info: {
            author: "John Doe",
            date: "4 Feb 2022",
          },
          title: "Label",
          description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
          chips: ["Chip", "Chip", "Chip", "Chip", "Chip"],
        },
        media: {
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s",
        },
      },
    ],
  },
];

export const slideShowImages = [
  {
    imgPath:
      "/assets/images/goat.png",
    label: "Lorem ipsum CTA1",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.",
  },
  {
    imgPath:
      "/assets/images/indicator.jpg",
    label: "Lorem ipsum CTA2",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.",
  },
  {
    imgPath:
      "/assets/images/slideshow.png",
    label: "Lorem ipsum CTA3",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.",
  },
];