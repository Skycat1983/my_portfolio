// NEW CODE: Window system interfaces
export interface WindowPosition {
  x: number;
  y: number;
}

export interface OpenWindow {
  id: string;
  directory: Directory;
  position: WindowPosition;
  zIndex: number;
}

export interface Directory {
  label: string;
  image: string;
  children: Item[];
}

export interface App {
  label: string;
  image: string;
}

export type Item = Directory | App;

// PROFILE ICONS
export const GITHUB_IMG = "src/assets/profile_icons/github_white.png";
export const LINKEDIN_IMG = "src/assets/profile_icons/linked_in1.png";

// ICONS
export const ICON_IMG = "src/assets/icons/1.png";

// FOLDERS
export const FOLDER_IMG = "src/assets/folder_icons/1.png";
export const BIN_EMPTY_IMG = "src/assets/folder_icons/bin_empty.png";
export const BIN_FULL_IMG = "src/assets/folder_icons/bin_full.png";

// APPS
export const TERMINAL_IMG = "src/assets/app_icons/terminal.png";

// STACK ICONS
export const REACT_IMG = "src/assets/stack_icons/react.png";
export const TYPESCRIPT_IMG = "src/assets/stack_icons/typescript.png";
export const NODEJS_IMG = "src/assets/stack_icons/nodejs.png";
export const MONGODB_IMG = "src/assets/stack_icons/mongo_db.png";
// export const EXPRESS_IMG = "src/assets/stack_icons/express.png";
export const JAVASCRIPT_IMG = "src/assets/stack_icons/javascript.png";
export const JEST_IMG = "src/assets/stack_icons/jest.png";
export const POSTMAN_IMG = "src/assets/stack_icons/postman.png";
export const TAILWIND_IMG = "src/assets/stack_icons/tailwind.png";
export const FIREBASE_IMG = "src/assets/stack_icons/firebase.png";

export const defaultDirectories = {
  label: "Desktop",
  image: FOLDER_IMG,
  children: [
    {
      label: "Terminal",
      image: TERMINAL_IMG,
    },
    {
      label: "Trash",
      image: BIN_EMPTY_IMG,
      children: [],
    },
    {
      label: "Projects",
      image: FOLDER_IMG,
      children: [],
    },
    {
      label: "Stack",
      image: FOLDER_IMG,
      children: [
        {
          label: "React",
          image: REACT_IMG,
        },
        {
          label: "TypeScript",
          image: TYPESCRIPT_IMG,
        },
        {
          label: "Node.js",
          image: NODEJS_IMG,
        },
        {
          label: "MongoDB",
          image: MONGODB_IMG,
        },
        // {
        //   label: "Express",
        //   image: EXPRESS_IMG,
        // },
        {
          label: "Jest",
          image: JEST_IMG,
        },
        {
          label: "Postman",
          image: POSTMAN_IMG,
        },
        {
          label: "Tailwind",
          image: TAILWIND_IMG,
        },
        {
          label: "Firebase",
          image: FIREBASE_IMG,
        },
        {
          label: "JavaScript",
          image: JAVASCRIPT_IMG,
        },
      ],
    },
    {
      label: "Documents",
      image: FOLDER_IMG,
      children: [
        {
          label: "Resume",
          image: FOLDER_IMG,
        },
        {
          label: "References",
          image: FOLDER_IMG,
        },
      ],
    },
  ],
};
