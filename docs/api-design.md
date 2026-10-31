**API Endpoints**
1. **GET /notes** - Retrieves a list of all notes for the authenticated user.
2. **GET /notes/{id}** - Retrieves the details of a specific note.
3. **POST /notes** - Creates a new note.
4. **PUT /notes/{id}** - Updates an existing note.
5. **DELETE /notes/{id}** - Deletes a specific note.
6. **GET /tags** - Retrieves a list of all available tags for categorization.

**Standardized Error Status Codes & Sample Payloads**
Client applications must handle the following standard HTTP error responses gracefully. All errors return a standardized JSON payload structure:

**400 Bad Request**
Returned when the request is malformed or missing required fields (e.g., missing a note title).
```json
{
  "error": "Bad Request",
  "status": 400,
  "message": "The 'title' field is required."
}
```

**401 Unauthorized**
Returned when the user is not authenticated or their session has expired.
```json
{
  "error": "Unauthorized",
  "status": 401,
  "message": "Missing or invalid authentication token."
}
```

**403 Forbidden**
Returned when the user is authenticated but does not have permission to access the requested resource.
```json
{
  "error": "Forbidden",
  "status": 403,
  "message": "You do not have permission to modify this note."
}
```

**404 Not Found**
Returned when the requested resource (like a specific note ID) does not exist.
```json
{
  "error": "Not Found",
  "status": 404,
  "message": "The requested note (ID: 123) could not be found."
}
```

**500 Internal Server Error**
Returned when an unexpected condition was encountered on the server.
```json
{
  "error": "Internal Server Error",
  "status": 500,
  "message": "A database connection error occurred. Please try again later."
}
```