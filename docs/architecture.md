**System Architecture Diagram**

```text
[Client / Web Browser]
        |
        | (HTTPS / JSON)
        v
[Load Balancer]
        |
        | (Routes traffic)
        v
[API Servers] (Backend Application Logic)
        |
        | (SQL Queries / TCP)
        v
[PostgreSQL Database] (Relational Data Storage)
```

**Step-by-Step Request Flows**

**Writing a Note (POST)**
1. The user fills out the note title and body in the client interface and clicks the submit button.
2. The frontend JavaScript disables the submission button, displays a loading state, and sends an asynchronous `fetch` POST request with the JSON payload to the API server.
3. The API server validates the incoming payload to ensure all required fields (e.g., title, body) are present and correctly formatted.
4. The API server executes an SQL `INSERT` statement to save the note into the PostgreSQL `notes` table and assigns a unique ID.
5. The backend returns a `201 Created` status code along with the newly created note object in JSON format.
6. The frontend receives the successful response, re-enables the submission button, clears the form, and dynamically injects the new note into the DOM using safe `textContent` manipulation.

**Reading Notes (GET)**
1. The user clicks the "Load Notes" button on the client interface.
2. The frontend triggers a loading state and sends an asynchronous `fetch` GET request to the API server.
3. The API server processes the request and executes a `SELECT` query with `LEFT JOIN` operations against the PostgreSQL database to retrieve the notes and their associated tags.
4. The database returns the result set to the API server, which formats the data into a standardized JSON array.
5. The API server responds to the client with a `200 OK` status code and the JSON array.
6. The frontend parses the JSON, clears the existing list, iterates through the array, and safely renders each note to the screen.

**Formal Load Estimations (1 Million Active Users)**

**Assumptions:**
* Active Users: 1,000,000
* Average Reads per user: 10 times per day
* Average Writes per user: 2 times per day
* Average Note Size: 2 KB (including metadata, title, and body)

**Read Estimations:**
* Daily Read Requests: 1,000,000 users * 10 reads = 10,000,000 reads/day
* Average Read Throughput: 10,000,000 / 86,400 seconds = ~115 requests per second (RPS)

**Write Estimations:**
* Daily Write Requests: 1,000,000 users * 2 writes = 2,000,000 writes/day
* Average Write Throughput: 2,000,000 / 86,400 seconds = ~23 requests per second (RPS)

**Yearly Text Storage Estimations:**
* Notes Generated Annually: 2,000,000 writes/day * 365 days = 730,000,000 notes/year
* Raw Storage Required: 730,000,000 notes * 2 KB = 1,460,000,000 KB 
* Total Estimated Storage: ~1.46 Terabytes (TB) per year (exclusive of database indexing overhead and backups).