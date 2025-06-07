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
  action: () => void;
}

export interface Icon {
  type: "icon";
  label: string;
  image: string;
}

export type NodeType = Directory | App | Icon;

export const defaultNodes: Directory = {
  type: "directory",
  label: "Desktop",
  image: FOLDER_IMG,
  children: [
    {
      label: "Terminal",
      image: TERMINAL_IMG,
      type: "app",
      action: () => {
        console.log("Terminal opened");
      },
    },
    {
      label: "Trash",
      image: BIN_EMPTY_IMG,
      type: "directory",
      children: [],
    },
    {
      label: "Projects",
      image: FOLDER_IMG,
      type: "directory",
      children: [],
    },
    {
      label: "Stack",
      image: FOLDER_IMG,
      type: "directory",
      children: [
        {
          label: "React",
          image: REACT_IMG,
          type: "icon",
        },
        {
          label: "TypeScript",
          image: TYPESCRIPT_IMG,
          type: "icon",
        },
        {
          label: "Node.js",
          image: NODEJS_IMG,
          type: "icon",
        },
        {
          label: "MongoDB",
          image: MONGODB_IMG,
          type: "icon",
        },
        // {
        //   label: "Express",
        //   image: EXPRESS_IMG,
        // },
        {
          label: "Jest",
          image: JEST_IMG,
          type: "icon",
        },
        {
          label: "Postman",
          image: POSTMAN_IMG,
          type: "icon",
        },
        {
          label: "Tailwind",
          image: TAILWIND_IMG,
          type: "icon",
        },
        {
          label: "Firebase",
          image: FIREBASE_IMG,
          type: "icon",
        },
        {
          label: "JavaScript",
          image: JAVASCRIPT_IMG,
          type: "icon",
        },
      ],
    },
    {
      label: "Documents",
      image: FOLDER_IMG,
      type: "directory",
      children: [
        {
          label: "Resume",
          image: FOLDER_IMG,
          type: "icon",
        },
        {
          label: "References",
          image: FOLDER_IMG,
          type: "icon",
        },
      ],
    },
  ],
};
