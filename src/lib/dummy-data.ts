import type { Note, Folder, Tag, User } from "@/types";

export const dummyUser: User = {
  id: "user-1",
  name: "Samuel Adebanjo",
  email: "adebanjosamuel2002@gmail.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  createdAt: "2024-01-15T10:00:00Z",
};

export const dummyFolders: Folder[] = [
  {
    id: "folder-1",
    name: "Personal",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-01T14:30:00Z",
  },
  {
    id: "folder-2",
    name: "Work",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-05T09:15:00Z",
  },
  {
    id: "folder-3",
    name: "Projects",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-03-07T16:45:00Z",
  },
  {
    id: "folder-4",
    name: "Research",
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-03-08T11:20:00Z",
  },
  {
    id: "folder-5",
    name: "Ideas",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-03-09T08:00:00Z",
  },
];

export const dummyTags: Tag[] = [
  { id: "tag-1", name: "important" },
  { id: "tag-2", name: "todo" },
  { id: "tag-3", name: "reference" },
  { id: "tag-4", name: "idea" },
  { id: "tag-5", name: "meeting" },
];

export const dummyNotes: Note[] = [
  {
    id: "note-1",
    title: "Project Roadmap Q2 2024",
    content: `<h1>Project Roadmap Q2 2024</h1>
<p>This quarter, we're focusing on three main objectives:</p>
<h2>1. Platform Stability</h2>
<p>Improving the core infrastructure to handle 10x more traffic.</p>
<h2>2. New Features</h2>
<ul>
<li>Real-time collaboration</li>
<li>AI-powered suggestions</li>
<li>Advanced search</li>
</ul>
<h2>3. User Experience</h2>
<p>Complete redesign of the dashboard with modern UI patterns.</p>`,
    preview:
      "This quarter, we're focusing on three main objectives: Platform Stability, New Features, and User Experience...",
    folderId: "folder-2",
    tags: ["tag-1", "tag-2"],
    isFavorite: true,
    isArchived: false,
    isDeleted: false,
    isPinned: true,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2024-03-01T09:00:00Z",
    updatedAt: "2024-03-09T14:30:00Z",
  },
  {
    id: "note-2",
    title: "Meeting Notes - Design Review",
    content: `<h1>Design Review Meeting</h1>
<p><strong>Date:</strong> March 8, 2024</p>
<p><strong>Attendees:</strong> Alex, Sarah, Mike, Jennifer</p>
<h2>Discussion Points</h2>
<ul data-type="taskList">
<li><input type="checkbox" checked> Review new color palette</li>
<li><input type="checkbox" checked> Discuss typography choices</li>
<li><input type="checkbox"> Finalize component library</li>
</ul>
<h2>Action Items</h2>
<p>Sarah will prepare the final mockups by Friday.</p>`,
    preview:
      "Design Review Meeting - Date: March 8, 2024. Discussion points include new color palette and typography...",
    folderId: "folder-2",
    tags: ["tag-5"],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    isPinned: false,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2024-03-08T15:00:00Z",
    updatedAt: "2024-03-08T16:30:00Z",
  },
  {
    id: "note-3",
    title: "AI Integration Research",
    content: `<h1>AI Integration Research</h1>
<h2>Overview</h2>
<p>Exploring options for integrating AI capabilities into our note-taking app.</p>
<h2>Potential Features</h2>
<ol>
<li><strong>Smart Summarization</strong> - Automatically generate summaries of long notes</li>
<li><strong>Writing Assistance</strong> - Help users improve their writing</li>
<li><strong>Semantic Search</strong> - Find notes based on meaning, not just keywords</li>
</ol>
<h2>Technical Considerations</h2>
<blockquote>We should consider using OpenAI's API for initial implementation, then evaluate alternatives.</blockquote>
<pre><code>const ai = new OpenAI({ apiKey: process.env.OPENAI_KEY });</code></pre>`,
    preview:
      "Exploring options for integrating AI capabilities into our note-taking app. Potential features include Smart Summarization...",
    folderId: "folder-4",
    tags: ["tag-3", "tag-4"],
    isFavorite: true,
    isArchived: false,
    isDeleted: false,
    isPinned: true,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-03-09T11:00:00Z",
  },
  {
    id: "note-4",
    title: "Personal Goals 2024",
    content: `<h1>Personal Goals 2024</h1>
<h2>Health & Fitness</h2>
<ul data-type="taskList">
<li><input type="checkbox"> Run a half marathon</li>
<li><input type="checkbox" checked> Exercise 4 times per week</li>
<li><input type="checkbox"> Learn to cook 10 new recipes</li>
</ul>
<h2>Career</h2>
<ul data-type="taskList">
<li><input type="checkbox" checked> Complete AWS certification</li>
<li><input type="checkbox"> Lead a major project</li>
<li><input type="checkbox"> Mentor a junior developer</li>
</ul>
<h2>Personal</h2>
<ul data-type="taskList">
<li><input type="checkbox"> Read 24 books</li>
<li><input type="checkbox" checked> Travel to 2 new countries</li>
</ul>`,
    preview:
      "Personal Goals 2024 covering Health & Fitness, Career development, and Personal growth objectives...",
    folderId: "folder-1",
    tags: ["tag-1"],
    isFavorite: true,
    isArchived: false,
    isDeleted: false,
    isPinned: false,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-03-07T20:00:00Z",
  },
  {
    id: "note-5",
    title: "App Feature Ideas",
    content: `<h1>App Feature Ideas</h1>
<p>Brainstorming session for the next version of our app.</p>
<h2>High Priority</h2>
<ul>
<li>Dark mode support (with custom themes)</li>
<li>Offline mode with sync</li>
<li>Keyboard shortcuts for power users</li>
</ul>
<h2>Nice to Have</h2>
<ul>
<li>Custom templates</li>
<li>Export to multiple formats</li>
<li>Integration with Notion/Obsidian</li>
</ul>
<h2>Future Vision</h2>
<p>Eventually, we want to build the best note-taking experience that combines the simplicity of Apple Notes with the power of Notion.</p>`,
    preview:
      "Brainstorming session for the next version of our app. High Priority features include Dark mode, Offline mode...",
    folderId: "folder-5",
    tags: ["tag-4"],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    isPinned: false,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2024-02-28T14:00:00Z",
    updatedAt: "2024-03-06T10:30:00Z",
  },
  {
    id: "note-6",
    title: "Weekly Review Template",
    content: `<h1>Weekly Review</h1>
<h2>What went well?</h2>
<p>Add your wins here...</p>
<h2>What could be improved?</h2>
<p>Add areas for improvement...</p>
<h2>Key learnings</h2>
<p>What did you learn this week?</p>
<h2>Next week's priorities</h2>
<ul data-type="taskList">
<li><input type="checkbox"> Priority 1</li>
<li><input type="checkbox"> Priority 2</li>
<li><input type="checkbox"> Priority 3</li>
</ul>`,
    preview:
      "Weekly Review template with sections for wins, improvements, learnings, and priorities...",
    folderId: "folder-1",
    tags: ["tag-3"],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    isPinned: false,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2024-02-20T09:00:00Z",
    updatedAt: "2024-03-04T09:00:00Z",
  },
  {
    id: "note-7",
    title: "Database Schema Design",
    content: `<h1>Database Schema Design</h1>
<h2>Tables</h2>
<h3>Users</h3>
<pre><code>CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP
);</code></pre>
<h3>Notes</h3>
<pre><code>CREATE TABLE notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);</code></pre>
<h2>Indexes</h2>
<p>We'll need indexes on user_id and created_at for efficient queries.</p>`,
    preview:
      "Database schema design including Users and Notes tables with proper relationships and indexes...",
    folderId: "folder-3",
    tags: ["tag-3"],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    isPinned: false,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2024-03-02T11:00:00Z",
    updatedAt: "2024-03-02T14:00:00Z",
  },
  {
    id: "note-8",
    title: "Reading List",
    content: `<h1>Reading List 2024</h1>
<h2>Currently Reading</h2>
<ul>
<li><strong>Atomic Habits</strong> by James Clear</li>
</ul>
<h2>Up Next</h2>
<ul>
<li>The Psychology of Money - Morgan Housel</li>
<li>Deep Work - Cal Newport</li>
<li>Thinking, Fast and Slow - Daniel Kahneman</li>
</ul>
<h2>Completed</h2>
<ul>
<li>✓ The Lean Startup - Eric Ries</li>
<li>✓ Zero to One - Peter Thiel</li>
</ul>`,
    preview:
      "Reading List 2024 - Currently reading Atomic Habits. Up next: The Psychology of Money, Deep Work...",
    folderId: "folder-1",
    tags: ["tag-2"],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    isPinned: false,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-03-01T18:00:00Z",
  },
  {
    id: "note-9",
    title: "Archived: Old Project Notes",
    content: `<h1>Old Project Notes</h1>
<p>These are notes from a previous project that has been completed.</p>
<p>Keeping for reference purposes.</p>`,
    preview:
      "Archived notes from a previous project, kept for reference purposes...",
    folderId: "folder-2",
    tags: [],
    isFavorite: false,
    isArchived: true,
    isDeleted: false,
    isPinned: false,
    deletedAt: null,
    wasArchived: false,
    createdAt: "2023-11-15T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "note-10",
    title: "Deleted Draft",
    content: `<h1>Deleted Draft</h1>
<p>This note was deleted and is in the trash.</p>`,
    preview: "This note was deleted and is in the trash...",
    folderId: null,
    tags: [],
    isFavorite: false,
    isArchived: false,
    isDeleted: true,
    isPinned: false,
    // Set within the last 30 days so it stays in Trash (change to >30 days ago to test auto-purge)
    deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    wasArchived: false,
    createdAt: "2024-02-25T10:00:00Z",
    updatedAt: "2024-03-05T10:00:00Z",
  },
];
