**Database Selection Rationale**
PostgreSQL was selected as the database for this system due to its strong support for relational data integrity and complex querying. Since a note can have multiple tags, and a tag can belong to multiple notes, this system requires a true many-to-many relationship. A relational database like PostgreSQL handles these joins efficiently and enforces strict data consistency through foreign key constraints, which a NoSQL document store would struggle to natively enforce without data duplication.

**SQL CREATE TABLE Statements**
The data model relies on three tables to establish the many-to-many relationship between notes and tags.

```sql
-- Table to store the main note content
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store unique tags
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Junction table modeling the many-to-many relationship
CREATE TABLE note_tags (
    note_id INT REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```

**Sample Queries with Joins**
To retrieve a specific note along with all of its associated tags, the backend will execute a query joining all three tables:

```sql
SELECT 
    notes.id, 
    notes.title, 
    notes.body, 
    tags.name AS tag_name
FROM 
    notes
LEFT JOIN 
    note_tags ON notes.id = note_tags.note_id
LEFT JOIN 
    tags ON note_tags.tag_id = tags.id
WHERE 
    notes.id = 1;
```