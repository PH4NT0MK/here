# 📍 Here

### React Native – Exam Project

#### Functional Guide

---

## 1. 📖 Project Overview

**Application Name:**
**Here**

**Application Category / Topic:**
Productivity / Mental Health / Self-Reflection

**Main Purpose (2–4 sentences):**
Here is a personal mood and reflection journal combined with a habit tracker. The application allows users to log daily experiences, moods, and reflections, helping them keep track of what’s going on in their life. Users can also create and manage habits, marking them as completed to observe personal patterns and progress over time. The goal is to encourage consistent self-tracking and reflection to support self-awareness and personal growth.

---

## 2. 🔐 User Access & Permissions

### Guest (Not Authenticated)

An unauthenticated user can:

- Access the login screen
- Access the registration screen
- View a welcome / introduction screen explaining the app
- Cannot view or modify any personal data

### Authenticated User

A logged-in user can:

- Access all main sections of the application
- View, create, edit, and delete mood journal entries
- Add tags and energy levels to journal entries
- Mark entries as favourites
- Create, edit, and delete habits
- Mark habits as completed for a given day
- View historical entries (week ago / month ago / year ago)
- View habit streaks and analytics
- View tag usage analytics

**Main sections / tabs:**

- Today
- Journal
- Habits
- Memory
- Settings

---

## 3. 🔑 Authentication & Session Handling

### Authentication Flow

1. When the app starts, it checks if a stored user session exists.
2. If no session is found, the user is redirected to the login or registration screens.
3. Users authenticate using **email and password through Firebase Authentication**.
4. On successful login or registration, the user is redirected to the main application.
5. On logout, session data is cleared and the user is returned to the login screen.

### Session Persistence

- User session data is stored locally using **AsyncStorage**.
- Automatic login is handled by restoring the stored authentication token on app launch.

---

## 4. 🧭 Navigation Structure

### Root Navigation Logic

- The root navigator switches between:
  - **Authentication stack** (unauthenticated users)
  - **Main app navigation** (authenticated users)

### Main Navigation

- Bottom Tab Navigation with five main sections:
  - Today
  - Journal
  - Habits
  - Memory
  - Settings

### Nested Navigation

- Each tab contains a **Stack Navigator**
- Detail screens include:
  - Journal Entry Details screen
  - Habit Details screen

---

## 5. 📋 List → Details Flow

### List / Overview Screen

- Displays lists of:
  - Journal entries, sorted by date, with filtering options (e.g., by tag, mood, or favourites)
  - Habits with current streak information

- Users can tap list items to view more details

### Details Screen

- Navigation is triggered by tapping a list item
- Route parameters include:
  - Entry ID or Habit ID

- The screen fetches and displays detailed data for the selected item, including:
  - Mood, tags, energy level, and favourite status (for journal entries)
  - Habit details, streaks, and completion history

- Users can edit entries or habits directly from the details screen

---

## 6. 🗄️ Data Source & Backend

**Backend Type:**
**Firebase Firestore** (NoSQL cloud database)

**Usage Description:**

- Stores user-specific data under the structure:
  - `users/{uid}/` → default document stores the **user profile**
  - Subcollections:
    - `energyFrequency` – tracks energy level usage for analytics
    - `habits` – stores user-created habits
    - `journalEntries` – stores mood and reflection entries
    - `tagFrequency` – tracks tag usage for analytics

- Handles real-time updates to reflect changes across sessions
- Supports querying for filtering journal entries by date, tag, mood, or favourite status

---

## 7. 🔄 Data Operations (CRUD)

### Read (GET)

- Journal entries are fetched and displayed in:
  - Journal section (with filtering by date, tag, mood, or favourite status)
  - Memory section

- Habits are fetched and displayed in:
  - Habits section
  - Today section

- Analytics data (`energyFrequency`, `tagFrequency`) is read to generate insights

### Create (POST)

- Users can create:
  - A daily mood and reflection entry
  - New habits

- Creating a journal entry or habit also updates relevant analytics data (`energyFrequency`, `tagFrequency`) in Firestore

### Update / Delete (Mutation)

- Users can:
  - Edit or delete journal entries
  - Edit or delete habits

- Updates and deletions also modify the associated analytics data to maintain accurate tracking
- After any mutation, the UI is updated by refetching data or updating local state

---

## 8. :pencil: Forms & Validation

### Forms Used

1. Login form
2. Registration form
3. Mood & reflection entry form (includes tags, energy level, and optional favourite marking)
4. Habit creation / edit form

### Validation Rules

- **Email:** required, must be a valid email format
- **Password:** required, minimum length validation
- **Mood value:** required, must be within a defined range (e.g., 1–5)
- **Habit name:** required, minimum and maximum character length
- **Tags:** required, minimum and maximum character length
- **Energy level:** required, must be within a defined range (e.g., 1–5)

**UX Note:**

- The app uses **KeyboardAvoidingView** and properly configured **SafeAreaView** so that input fields are never covered by the keyboard, providing a smooth user experience.

**Notes:**

- Analytics (`tagFrequency` and `energyFrequency`) automatically track the tags and energy levels entered in journal entries.

---

## 9. 📱 Native Device Features

### Used Native Feature(s)

- **Local Storage (AsyncStorage)**
- **Photo Upload / Image Picker**
- **Push Notifications (planned feature)**

### Usage Description

- **Local Storage**: Persists authentication sessions and user preferences, enabling automatic login after app restart.
- **Photo Upload / Image Picker**: Allows users to upload a profile picture from the Settings screen.
- **Push Notifications (to be implemented soon)**: Will deliver optional reminders and check-ins for habits or journal entries.

---

## 10. 🔁 Typical User Flow

1. User opens the app and logs in.
2. User records their mood and reflection for the day, adding **tags** and **energy levels** to better categorize and reflect on their experiences.
3. User can mark an entry as a **favourite** if it is important or meaningful.
4. User marks completed habits for the day.
5. User navigates to the **Memory** or **Analytics** screens to view past entries, habit streaks, and tag/energy level insights.
6. If the user missed a previous day or wants to update an entry, they can **edit past journal entries**.

---

## 11. ⚠️ Error & Edge Case Handling

The app handles errors and edge cases to ensure a smooth user experience:

- **Authentication errors:**
  - Invalid email or password shows a clear, user-friendly message.
  - Failed login or registration attempts are handled gracefully.

- **Network or data errors:**
  - API / Firestore failures display informative error messages.
  - Pull-to-refresh provides an option to retry fetching data.

- **Empty or missing data states:**
  - If no journal entries exist, the Memory screen shows a message encouraging the user to create their first entry.
  - If no habits exist, the Habits screen prompts the user to add new habits.
  - Filtering or analytics screens display a message when no relevant data is found.

- **Data integrity:**
  - Analytics collections (`tagFrequency`, `energyFrequency`) are updated consistently when creating, editing, or deleting entries.

---

## 🚀 Getting Started

This project was created using **Expo** and **React Native**.

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Expo CLI (optional, for development)
- Expo Go app (for testing on a physical device)

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Run the Project

```bash
npm start
# or
yarn start
```

- This will start the Expo development server.
- Scan the QR code with **Expo Go** to run on your device, or use an emulator.
- Make sure your Firebase configuration is set up correctly.

---

## 📦 APK Download

A functional build of the app can be downloaded here:

[**Download Here.apk**](https://drive.google.com/file/d/1A2iK4TXriYc-zWUJusUrJdVycHi7ZjIj/view?usp=drive_link)

> Replace the link above with the actual URL to your built `.apk` file in your repository or hosting service.

---
