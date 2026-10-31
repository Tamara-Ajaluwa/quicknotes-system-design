# QuickNotes Data Model

This document outlines the database schema for the application, designed to support scalable storage and quick retrieval.

## Relational Schema (PostgreSQL)

### `Users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | UUID | Primary Key | Unique identifier for the user. |
| `email` | VARCHAR | Unique, Not Null | User's email address. |
| `created_at` | TIMESTAMP | Not Null | Account creation date. |

### `Notes` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `note_id` | UUID | Primary Key | Unique identifier for the note. |
| `user_id` | UUID | Foreign Key | References `Users.user_id`. Indexed for fast queries. |
| `text_content` | TEXT | Not Null | The body of the note. |
| `category` | VARCHAR | Not Null | Category label (e.g., Personal, Work). |
| `created_at` | TIMESTAMP | Not Null | Note creation timestamp. |

### `Attachments` Table
*System Design Note:* Supports the asynchronous thumbnail generation workflow.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `attachment_id` | UUID | Primary Key | Unique identifier for the file. |
| `note_id` | UUID | Foreign Key | References `Notes.note_id`. |
| `original_url` | VARCHAR | Not Null | Object storage URL for the uploaded image. |
| `thumbnail_url` | VARCHAR | Nullable | Object storage URL for the generated thumbnail. |
| `size_kb` | INT | Not Null | File size in kilobytes (crucial for accurate daily math and annual storage/egress capacity planning). |