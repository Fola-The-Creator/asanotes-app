# Asanotes App

Asanotes is a modern, feature-rich note-taking web application built for seamless organization, high-quality rich-text editing, and premium visual design.

## Features

* **Rich-Text Editing**: Powered by TipTap, supporting headings, bold/italic/underline formatting, checklists, bulleted/numbered lists, quotes, inline code, highlights, links, and table structures.
* **Organizational Structure**: Categorize notes using folders and tags. Quickly filter notes based on tags or folder assignments.
* **Note Lifecycle Management**: Easy note pinning, favoriting, archiving, and deletion.
* **Automatic Trash Purge**: Configurable trash auto-expiry (options include 7, 14, 30, 60, and 90 days) to keep your notes tidy.
* **Command Palette**: Fast navigation and quick actions accessible via a keyboard shortcut palette.
* **Comprehensive Settings**: Tailor your experience with adjustable font sizes, customizable theme modes, motion reduction toggles, and optional confirmation dialogs for destructive actions.
* **User Authentication**: Clean, modern layouts for login and registration screens.
* **Responsive and Fluid UI**: Responsive layouts tailored for both mobile and desktop screens, featuring dark mode transitions and smooth micro-animations.

## Technology Stack

* **Framework & Core**: Next.js (App Router), React 19, TypeScript
* **Styling & UI**: Tailwind CSS v4, Lucide React (Icons), Motion (Animations), Radix UI (Accessible primitive components)
* **Editor**: TipTap Rich-Text Editor and extensions
* **State Management**: Zustand
* **Data Fetching**: TanStack React Query

## Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

* Node.js (version 18 or higher is recommended)
* npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Fola-The-Creator/asanotes-app.git
   ```

2. Navigate into the project directory:
   ```bash
   cd asanotes-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Other Commands

* **Build**: Build the production application with `npm run build`
* **Start**: Start the built production server with `npm run start`
* **Lint**: Run ESLint to check for code issues with `npm run lint`

## Project Structure

* `src/app`: App Router pages, layout configurations, and route groups (such as dashboard and auth routes)
* `src/components`: UI primitives, layout structures, sidebar elements, settings panel, and rich-text editor components
* `src/constants`: Configuration constants, theme values, shortcuts, and default settings
* `src/hooks`: Custom React hooks for notes, tags, folders, settings, and user states
* `src/lib`: API layer integration and mocked data stores
* `src/store`: Zustand state stores for application-wide status, selected notes, and user settings
* `src/styles`: CSS style configurations and Tailwind directives
* `src/types`: TypeScript definitions and interface shapes

## License

This project is licensed under the MIT License. See the [LICENSE](file:///c:/Users/admin/Documents/My%20Programs/Projects/Portfolio%20Projects/Asanotes%20App/LICENSE) file for more information.
