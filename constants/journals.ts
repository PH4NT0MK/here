export const journalPrompts = [
  "What made you smile today?",
  "What's one small win you had today?",
  "Write about something that inspired you recently.",
  "Reflect on a challenge you overcame today.",
  "What's one thing you're grateful for right now?"
];

export const getRandomJournalPrompt = () => journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
