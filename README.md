# QuickNotes System Design

Capture your thoughts, anytime, anywhere. 

QuickNotes is a cohesive, single-page application that allows users to create, categorize, search, and delete notes. This project demonstrates secure frontend practices and serves as the foundation for a larger system design architecture.

## Features
* **Note Management:** Add and delete notes with unique IDs and timestamps.
* **Categorization:** Organize notes by custom categories (dynamically generates CSS classes, sanitizing spaces for robust styling).
* **Real-time Search:** Filter notes dynamically by text or category.
* **Persistent Storage:** Saves all user data locally using browser `localStorage`.
* **Security & Validation:** Implements secure DOM element creation using `textContent` to prevent Cross-Site Scripting (XSS) and utilizes custom form validation.

## Repository Structure
This repository contains the functional frontend application at the root level and system design documentation within the `docs` directory.

* `index.html` - The core markup, structure, and application tagline.
* `style.css` - Visual styling, flexbox layouts, and category-specific UI.
* `api.js` - The application logic, DOM manipulation, and state management.
* `README.md` - Project overview and instructions.
* `docs/`
  * `api-design.md` - API endpoints and communication protocols.
  * `data-model.md` - Database schema and data relationships.
  * `architecture.md` - High-level system architecture and component interactions.

## How to Run
1. Clone this repository to your local machine.
2. Open `index.html` directly in any modern web browser.
3. Start adding notes to see the application and system design principles in action.