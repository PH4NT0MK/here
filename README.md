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
Here is a personal mood and reflection journal combined with a habit and streak tracker. The application allows users to record how they feel, what they did, and reflect on their past entries over time. By presenting entries from previous weeks, months, and years, the app helps users observe patterns and personal continuity without judgment. The goal is to support self-awareness through simple, consistent logging.

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
- Create, edit, and delete habits
- Mark habits as completed for a given day
- View historical entries (week ago / month ago / year ago)

**Main sections / tabs:**

- Today
- Journal
- Habits
- Time Capsule

---

## 3. 🔑 Authentication & Session Handling

### Authentication Flow

1. When the app starts, it checks if a stored user session exists
2. If no session is found, the user is redirected to the authentication screens
3. On successful login or registration, the user is redirected to the main application
4. On logout, session data is cleared and the user is returned to the login screen

### Session Persistence

- The user session is stored locally using secure storage (e.g. AsyncStorage)
- Automatic login is handled by restoring the stored authentication token on app launch

---

## 4. 🧭 Navigation Structure

### Root Navigation Logic

- The root navigator switches between:
  - Authentication stack (unauthenticated users)
  - Main app navigation (authenticated users)

### Main Navigation

- Bottom Tab Navigation with four main sections:
  - Today
  - Journal
  - Habits
  - Time Capsule

### Nested Navigation

- Each tab contains a Stack Navigator
- Detail screens include:
  - Journal Entry Details
  - Habit Details
  - Create / Edit screens

---

## 5. 📋 List → Details Flow

### List / Overview Screen

- Displays lists of:
  - Journal entries sorted by date
  - Habits with current streak information
- Users can tap list items to view more details

### Details Screen

- Navigation is triggered by tapping a list item
- Route parameters include:
  - Entry ID or Habit ID
- The screen fetches and displays detailed data for the selected item

---

## 6. 🗄️ Data Source & Backend

**Backend Type:**  
Simulated backend using MockAPI (REST API)

---

## 7. 🔄 Data Operations (CRUD)

### Read (GET)

- Journal entries are fetched and displayed in:
  - Journal section
  - Time Capsule section
- Habits and habit logs are fetched and displayed in:
  - Habits section
  - Today section

### Create (POST)

- Users can create:
  - A daily mood and reflection entry
  - New habits

### Update / Delete (Mutation)

- Users can:
  - Edit or delete journal entries
  - Edit or delete habits
- After mutation, the UI is updated by refetching data or updating local state

---

## 8. 📝 Forms & Validation

### Forms Used

1. Login form
2. Registration form
3. Mood & reflection entry form
4. Habit creation / edit form

### Validation Rules

- **Email:** required, must be a valid email format
- **Password:** required, minimum length validation
- **Mood value:** required, must be within a defined range (e.g. 1–5)
- **Habit name:** required, minimum character length

---

## 10. 📱 Native Device Features

### Used Native Feature(s)

- Local Storage (AsyncStorage)
- Push Notifications

### Usage Description

- Local storage is used to persist authentication sessions and user preferences, enabling automatic login after app restart
- Push notifications are used to deliver optional reminders and check-ins, which can be enabled or disabled individually in the settings screen

---

## 11. 🔁 Typical User Flow

1. User opens the app and logs in
2. User records their mood and reflection for the day
3. User marks completed habits
4. User navigates to the Time Capsule to view past entries

---

## 12. ⚠️ Error & Edge Case Handling

The app handles:

- **Authentication errors:** invalid credentials or failed login attempts
- **Network or data errors:** API failures are handled with user-friendly error messages
- **Empty or missing data states:** informative messages are shown when no entries or habits exist

---

## 🚀 Getting Started

This project was created using **Expo** and **React Native**.

### Prerequisites

- Node.js
- npm
- Expo CLI (optional)
- Expo Go app (for testing on a physical device)

### Install Dependencies

```bash
npm install
```
