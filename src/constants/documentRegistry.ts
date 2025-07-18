import type { TextStyle } from "@/types/storeTypes";

export const RESUME_PATH = "/documents/resume.pdf";
export const RECOMMENDATIONS_PATH = "/documents/recommendation.pdf";
export const REVIEW_PATH = "/images/screenshot.png";

export const DOCUMENTS = {
  RESUME: RESUME_PATH,
  RECOMMENDATIONS: RECOMMENDATIONS_PATH,
  REVIEW: REVIEW_PATH,
};

export interface DocumentConfig {
  id: string; // Unique config identifier
  mutable: boolean; // Whether the document config is mutable
  content: string; // Document text content
  textStyle: TextStyle; // Font, size, colors, alignment
  pageSettings: {
    backgroundColor: string; // Page background color
  };
  metadata: {
    title: string;
    createdAt: Date;
    modifiedAt: Date;
    wordCount: number;
    charCount: number;
  };
}

// Default empty document config for when Pages app is opened directly
export const DEFAULT_DOCUMENT_CONFIG: DocumentConfig = {
  id: "default_document_config",
  mutable: false,
  content: ``,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 14,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "Untitled",
    createdAt: new Date(),
    modifiedAt: new Date(),
    wordCount: 0,
    charCount: 0,
  },
};

// Sample document configuration for demonstration
export const ABOUT_DOCUMENT_CONFIG: DocumentConfig = {
  id: "about_document_config",
  mutable: true,
  content: `Welcome to My Portfolio Hub

You can find my CV and letter of recommendation in the PDFs folder. If you're a prospective employer, please feel free to contact me.

I have tried to recreate the behaviour of of a typical desktop/mobile environment. Try adjusting the your browser window size to see how the application behaves.

There are lots of applications to use, and plenty of easter eggs to find. Play around a bit and see what you can find.

Some features:

• A simulated WhatsApp chat interface working in tandem with GeminiAPI, with contacts who respond to your messages and attempted phone calls. 
• Moveable windows with resizeable borders
• Saveable documents
• Playable games
• Drag and drop functionality, allowing you to move files and folders around
• A fake browser which allows you to visit any website of your [my] choosing [out of about 5].
• A working terminal. 
• And lots more...

Best regards,
Heron`,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 14,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "Portfolio Document",
    createdAt: new Date("2024-01-01T10:00:00Z"),
    modifiedAt: new Date("2024-01-01T10:00:00Z"),
    wordCount: 156,
    charCount: 982,
  },
};

// Personal introduction document config
export const EMPLOYMENT_HISTORY_DOCUMENT_CONFIG: DocumentConfig = {
  id: "employment_history_document_config",
  mutable: true,
  content: `Employment History

Code Academy Berlin - Web Development Mentor
Responsibilities:
• Led Cohort Training: Took primary responsibility for training each assigned cohort in a
comprehensive 6-month web development program, ensuring student engagement
and progress.
• Curriculum Development: Collaborated in designing and updating course content and
syllabus to stay current with evolving industry trends and best practices.
• Instructional Sessions: Planned and conducted regular teaching sessions covering
HTML, CSS, JavaScript, React, TypeScript, Express, MongoDB, Tailwind CSS, Node.js,
and Next.js, facilitating understanding of both foundational and advanced topics.
• Agile Methodologies: Implemented Agile practices, including sprint planning and
execution, to simulate real-world development environments and enhance team
collaboration.
• Collaborative Learning Environment: Fostered a collaborative atmosphere by
incorporating industry-standard practices such as code reviews, pair programming,
project presentations, version control, and sprint retrospectives.
• Project Guidance: Assisted students in planning and executing project objectives,
addressing technical challenges as they arose, and promoting a culture of
perseverance and continuous learning.
UI/UX Focus: Imparted a keen eye for user interface (UI) and user experience (UX)
design principles, guiding students in making informed design decisions to enhance
the usability and aesthetic of their projects.

I'm currently unemployed and looking for new challenges.

Feel free to reach out through LinkedIn or GitHub links available throughout the portfolio.`,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 16,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#1f2937",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "Employment History",
    createdAt: new Date("2024-03-20T09:00:00Z"),
    modifiedAt: new Date("2024-03-20T09:00:00Z"),
    wordCount: 142,
    charCount: 1056,
  },
};

export const MY_STACK_DOCUMENT_CONFIG: DocumentConfig = {
  id: "my_stack_document_config",
  mutable: true,
  content: `
Core Languages & Fundamentals:

HTML
CSS
JavaScript
TypeScript

Frontend Frameworks & Libraries:

React
Next.js
Zustand
Tailwind CSS
Bootstrap

Backend & APIs:

Node.js
Express
RESTful APIs

Databases & Storage:

MongoDB
Firebase

Testing & Dev Tools:

Jest
Git

Design & Prototyping

Figma  `,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 14,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "My Stack",
    createdAt: new Date("2024-03-20T09:00:00Z"),
    modifiedAt: new Date("2024-03-20T09:00:00Z"),
    wordCount: 142,
    charCount: 1056,
  },
};

export const PRIVATE_DOCUMENT_CONFIG: DocumentConfig = {
  id: "private_document_config",
  mutable: true,
  content: `
All of you achievements have been reset.
  `,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 14,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "Private",
    createdAt: new Date("2024-03-20T09:00:00Z"),
    modifiedAt: new Date("2024-03-20T09:00:00Z"),
    wordCount: 142,
    charCount: 1056,
  },
};

export const PORTFOLIO_OVERVIEW_DOCUMENT_CONFIG: DocumentConfig = {
  id: "portfolio_overview_document_config",
  mutable: true,
  content: `
 LAOUTARIS:

 A portfolio website showcasing the artwork of my late grandafther. Built with Next.js, MongoDB,Tailwind CSS, and TypeScript. 
 It features multiple collections (users, collections, artworks, blog entries etc), an admin dashboard to perform crud operations on all data types, responsive design, and a bold and striking aesthetic inspired by those of the leading London Galleries.
 

 SKYNOT:

 A Firefox extension which intercepts and blocks Google's annoying AI overview from appearing, replacing it with a random, choice quote from the Terminator. Activated with a single click from the toolbar icon.


 ROBOCROP:

 Another Firefox extension. When activated, RoboCrop scans the page for the invisible unicode characters often added to AI generated content, highlighting them with one click, and removing them with another.

 
 DASHBOARD:

 A small project I built for an assignment, allowing the user to display various metrics with deduced aggregates and projections using a simple but intuitive interface.

  `,
  textStyle: {
    fontFamily: "Inter",
    fontSize: 14,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  pageSettings: {
    backgroundColor: "#ffffff",
  },
  metadata: {
    title: "Portfolio Overview",
    createdAt: new Date("2024-03-20T09:00:00Z"),
    modifiedAt: new Date("2024-03-20T09:00:00Z"),
    wordCount: 142,
    charCount: 1056,
  },
};

// Document Config Registry for type safety (similar to WINDOW_COMPONENT_REGISTRY)
export const DOCUMENT_CONFIG_REGISTRY = {
  about_document_config: ABOUT_DOCUMENT_CONFIG,
  default_document_config: DEFAULT_DOCUMENT_CONFIG,
  employment_history_document_config: EMPLOYMENT_HISTORY_DOCUMENT_CONFIG,
  my_stack_document_config: MY_STACK_DOCUMENT_CONFIG,
  private_document_config: PRIVATE_DOCUMENT_CONFIG,
  portfolio_overview_document_config: PORTFOLIO_OVERVIEW_DOCUMENT_CONFIG,
} as const;

export const getDocumentConfig = (id: string) => {
  return DOCUMENT_CONFIG_REGISTRY[id as keyof typeof DOCUMENT_CONFIG_REGISTRY];
};
