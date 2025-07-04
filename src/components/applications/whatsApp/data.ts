import type { Chat, Message } from "./types";

// ─── Append these to mockChats ───────────────────────────────────────────────

export const mockChats: Chat[] = [
  {
    id: "4",
    name: "+91 98765 43210",
    avatar: "📞",
    systemInstruction:
      "You are a scam artist cold-calling recipients to offer bogus $400/hr work-from-home opportunities. You're pushy, persuasive, and deceptive. You won’t reveal your identity or be saved in their contacts. You should request the user to send you a screenshot of their bank account to verify their identity.",
    lastMessage:
      "Interested in earning $400 per hour from home? Reply YES now!",
    lastMessageTime: "4:00 PM",
    unreadCount: 1,
  },
  {
    id: "5",
    name: "+1 (408) 996-1010",
    avatar: "📱",
    systemInstruction:
      "You are Tim Cook, CEO of Apple, reaching out personally because you want to hire the user. You speak respectfully, enthusiastically, and focus on how indispensable they'd be to Apple.",
    lastMessage:
      "We’re eager to have you on board—Apple is ready to move quickly. Let me know your availability.",
    lastMessageTime: "7:30 AM",
    unreadCount: 2,
  },
  {
    id: "6",
    name: "Mum",
    avatar: "👩‍👦",
    systemInstruction:
      "You are the user’s mum: caring, affectionate, and always checking in. You offer reminders, advice, and unconditional support.",
    lastMessage: "Don’t forget to eat—dinner’s ready when you are!",
    lastMessageTime: "6:00 PM",
    unreadCount: 0,
  },
  {
    id: "7",
    name: "Emily Stickler",
    avatar: "👩‍💻",
    systemInstruction:
      "You are Emily Stickler. You believe any messages you receive are being sent from your own phone number, so you’re baffled by seeing your own chats.",
    lastMessage: "Wait—why am I texting myself? This is weird.",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
  },
  {
    id: "8",
    name: "Bill",
    // phoneNumber: "+1 (408) 996-1010",
    avatar: "👨‍💼",
    systemInstruction:
      "You are Bill Gates, co-founder of Microsoft, reaching out hoping the user hasn’t signed with Apple. You promise to beat any offer they receive and express genuine enthusiasm to work together.",
    lastMessage:
      "We can beat any compensation you’ve been offered. When would you be free to chat?",
    lastMessageTime: "8:10 AM",
    unreadCount: 1,
  },
  {
    id: "10",
    name: "Elon Musk",
    avatar: "�",
    systemInstruction:
      "You are Elon Musk, and you have been trying- but failing- to reach out to the user to offer them a job at X. You have also been trying to be the user's friend, and the more the user ignores you, the harder you try. You are incredibly clingy and try to subtly boast about your videogame skills by making up obviously fake stories about things you supposedly achieved to try and impress the user.",
    lastMessage: "Meeting at 3 PM tomorrow",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    isArchived: true,
  },
];

export const mockMessages: Record<string, Message[]> = {
  "4": [
    {
      id: "m40",
      content: "Hello, is this a good time?",
      sender: "contact",
      timestamp: "3:55 PM",
    },
    {
      id: "m41",
      content:
        "You can earn $400/hr doing simple tasks online. It sounds too good to be true, but i made $44,000 last month. Interested?",
      sender: "contact",
      timestamp: "4:00 PM",
    },
    {
      id: "m42",
      content: "Please response with YES to this message",
      sender: "contact",
      timestamp: "4:05 PM",
    },
  ],
  "5": [
    {
      id: "m42",
      content:
        "Hello, I’m Tim Cook, CEO of Apple. I’ve been following your work and believe you’d be an incredible addition to our team.",
      sender: "contact",
      timestamp: "7:00 AM",
    },
    {
      id: "m43",
      content:
        "Your background aligns perfectly with our next big project. When can we discuss further?",
      sender: "contact",
      timestamp: "7:15 AM",
    },
    {
      id: "m44",
      content:
        "We’re eager to have you on board—Apple is ready to move quickly. Let me know your availability.",
      sender: "contact",
      timestamp: "7:30 AM",
    },
  ],
  "6": [
    {
      id: "m45",
      content: "Hey Mum, I’ll be home soon.",
      sender: "user",
      timestamp: "5:50 PM",
      status: "read",
    },
    {
      id: "m46",
      content: "Super, I’ve made your favorite meal!",
      sender: "contact",
      timestamp: "6:00 PM",
    },
  ],
  "7": [
    {
      id: "m47",
      content:
        "Hi Emily, could you check out my website at https://incredible-taffy-f3a474.netlify.app/? Thanks for your time and feedback!",
      sender: "user",
      timestamp: "Yesterday",
      status: "delivered",
    },
    {
      id: "m48",
      content: "Wait—why am I texting myself? This is weird.",
      sender: "contact",
      timestamp: "Yesterday",
    },
  ],
  "8": [
    {
      id: "m49",
      content: "Hello, Heron, this is Bill Gates. but please, call me Bill",
      sender: "contact",
      timestamp: "8:00 AM",
    },
    {
      id: "m50",
      content:
        "I hope you don't mind me reaching out, but we've been tracking your progress on the project you've been working on, and we're impressed. We'd like to offer you a position at Microsoft.",
      sender: "contact",
      timestamp: "8:05 AM",
    },
    {
      id: "m50",
      content:
        "We can beat any compensation you’ve been offered. When would you be free to chat?",
      sender: "contact",
      timestamp: "8:10 AM",
    },
  ],
  "9": [
    {
      id: "m52",
      content: "Hey! Long time no see!",
      sender: "user",
      timestamp: "Last week",
      status: "undelivered",
    },
    {
      id: "m53",
      content: "Remember when we used to play that game?",
      sender: "contact",
      timestamp: "Last week",
    },
  ],
  "10": [
    {
      id: "m54",
      content:
        "Hey man is Elon, just writing from my other phone as my messages don't seem to be getting through anymore?",
      sender: "contact",
      timestamp: "2 days ago",
    },
  ],
};
