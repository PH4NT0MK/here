export const habitMessages = [
  "No habits yet… let's create your first one!",
  "Your habit journey starts here — add your first habit!",
  "Nothing here yet. Ready to start your first habit?",
  "Looks quiet… maybe add a habit to get started?",
  "Your habit tracker is empty! Time to create your first win."
];

export const getRandomHabitMessage = () => habitMessages[Math.floor(Math.random() * habitMessages.length)];
