import { DRESS, GRAPES, ME_CAPTCHA } from "../../../../../constants/images";

export const CAPTCHA_DATA = [
  {
    title: "just_me",
    src: ME_CAPTCHA,
    task: "select all squares with",
    text: "highly employable web developers",
    correctAnswers: [1, 4, 6, 7, 8, 9, 10, 11], // placeholder array
  },
  {
    title: "dress",
    src: DRESS,
    task: "select all squares with",
    text: "the colour blue",
    correctAnswers: [], // placeholder array
  },
  {
    title: "grid_tricks",
    src: ME_CAPTCHA,
    task: "select all squares WITHOUT",
    text: "highly employable web developers",
    correctAnswers: [0, 1], // placeholder array
  },
  // {
  //   title: "all_squares",
  //   src: ME,
  //   task: "select all squares",
  //   text: null,
  //   correctAnswers: [0, 2, 5, 3], // placeholder array
  // },
  {
    title: "grapes",
    src: GRAPES,
    task: "select all squares with",
    text: "seedless grapes",
    correctAnswers: [2, 4, 7], // placeholder array
  },
];
