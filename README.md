# Goal-Based Savings Planner

A lightweight, client-side savings planner that allows users to create financial goals, add contributions, and track progress across multiple currencies (INR and USD). This project was built as part of a Frontend Intern take-home assignment, with an emphasis on correctness, clean code structure, and a polished user experience.

## Overview

The application enables users to plan and track multiple savings goals such as an emergency fund or a travel goal. Each goal supports live currency conversion, progress tracking, and incremental contributions, all while remaining completely client-side. No backend or authentication is used. All data is stored locally in the browser.

## Features

### Goal Management

-   Create multiple goals with:
    -   Name
    -   Target amount
    -   Currency (INR or USD)

### Goal Display

Each goal is shown as a card displaying:

-   Target amount in the original currency
-   Converted target amount in the other currency
-   Current saved amount
-   Progress bar indicating completion percentage

### Contributions

-   Add contributions using a modal
-   Each contribution includes:
    -   Amount
    -   Date
-   Progress and totals update immediately

### Exchange Rates

-   Fetches live INR ↔ USD exchange rates
-   Displays the last updated timestamp
-   Manual refresh option to re-fetch rates

### Dashboard Summary

-   Total target amount across all goals
-   Total saved amount
-   Overall progress (average completion percentage)

### UX and Validation

-   Input validation (required fields, no negative values)
-   Loading and error states for async operations
-   Fully responsive layout

## Tech Stack

-   **Framework:** Next.js (16.1.1, App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Client-side Storage:** Dexie.js (IndexedDB)
-   **API:** ExchangeRate API

## Technical Decisions

-   Next.js was chosen for its modern routing, performance, and seamless deployment workflow.
-   Tailwind CSS enables fast, consistent UI development without relying on external component libraries.
-   Dexie.js provides a clean and reliable abstraction over IndexedDB for persistent client-side storage.
-   A client-only architecture keeps the app lightweight and aligns with the assignment requirements.

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/goal-based-savings-planner.git
cd goal-based-savings-planner
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=your_api_key_here
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # Reusable UI components
├── db/               # Dexie database setup and helpers
├── lib/              # Utility functions (API, currency logic)
├── types/            # TypeScript type definitions
```

## Data Persistence

-   All goals and contributions are stored locally using IndexedDB via Dexie
-   Data persists across page reloads
-   No backend services are required

## Live Demo

Live demo link: [https://savings-planner-nine.vercel.app/](https://savings-planner-nine.vercel.app/)

Alternatively, a short demo video can be linked in this section.

## Validation and Edge Cases

-   Prevents invalid or negative inputs
-   Handles exchange rate API errors gracefully
-   Works across mobile, tablet, and desktop screen sizes

## Possible Improvements

-   Adding deletion functionality
-   Adding a list to track contributions
-   Monthly or yearly contribution analytics
-   Dark mode support
-   Export goals and contributions to pdf
-   Optional backend synchronization

## Author

**Vaibhav Tiwari**  
Full-Stack Developer
