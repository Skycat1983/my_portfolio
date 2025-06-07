import { images } from "./images";

const {
  FOLDER,
  BIN_EMPTY,
  TERMINAL,
  REACT,
  TYPESCRIPT,
  NODEJS,
  MONGODB,
  JEST,
  POSTMAN,
  TAILWIND,
  FIREBASE,
  JAVASCRIPT,
} = images;

export interface Directory {
  type: "directory";
  label: string;
  image: string;
  children: NodeType[];
}

export interface App {
  type: "app";
  label: string;
  image: string;
  // action: () => void;
}

export type NodeType = Directory | App;

export const defaultNodes: Directory = {
  type: "directory",
  label: "Desktop",
  image: FOLDER,
  children: [
    {
      label: "Terminal",
      image: TERMINAL,
      type: "app",
    },
    {
      label: "Trash",
      image: BIN_EMPTY,
      type: "directory",
      children: [],
    },
    {
      label: "Projects",
      image: FOLDER,
      type: "directory",
      children: [],
    },
    {
      label: "Stack",
      image: FOLDER,
      type: "directory",
      children: [
        {
          label: "React",
          image: REACT,
          type: "app",
        },
        {
          label: "TypeScript",
          image: TYPESCRIPT,
          type: "app",
        },
        {
          label: "Node.js",
          image: NODEJS,
          type: "app",
        },
        {
          label: "MongoDB",
          image: MONGODB,
          type: "app",
        },
        // {
        //   label: "Express",
        //   image: EXPRESS_IMG,
        // },
        {
          label: "Jest",
          image: JEST,
          type: "app",
        },
        {
          label: "Postman",
          image: POSTMAN,
          type: "app",
        },
        {
          label: "Tailwind",
          image: TAILWIND,
          type: "app",
        },
        {
          label: "Firebase",
          image: FIREBASE,
          type: "app",
        },
        {
          label: "JavaScript",
          image: JAVASCRIPT,
          type: "app",
        },
      ],
    },
    {
      label: "Documents",
      image: FOLDER,
      type: "directory",
      children: [
        {
          label: "Resume",
          image: FOLDER,
          type: "app",
        },
        {
          label: "References",
          image: FOLDER,
          type: "app",
        },
      ],
    },
  ],
};
