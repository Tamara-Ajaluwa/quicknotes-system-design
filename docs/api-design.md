# QuickNotes API Design

This document outlines the RESTful API endpoints for the QuickNotes backend. The design incorporates scalable patterns to handle read-heavy workloads and asynchronous processing.

## Base URL
`https://api.quicknotes.com/v1`

---

## 1. Retrieve Notes
**GET** `/notes`

Fetches a list of the user's notes. 
*System Design Note:* To handle high peak read queries, this endpoint prioritizes fetching from a Redis caching layer or database read replicas. Due to eventual consistency, clients should account for minor replica lag immediately following a write operation.

**Query Parameters:**
* `search` (string) - Filters notes by text content.
* `category` (string) - Filters notes by category.

**Response: `200 OK`**
```json
{
  "data": [
    {
      "id": "1698745200000",
      "text": "Meeting notes regarding system architecture.",
      "category": "Work",
      "timestamp": 1698745200000
    }
  ],
  "meta": {
    "total_count": 1
  }
}
```

## 2. Create Note
**POST** `/notes`

Creates a new note. Writes are routed directly to the primary database to ensure durability before asynchronously updating the read replicas and cache.

**Request Body:**
```json
{
  "text": "Meeting notes regarding system architecture.",
  "category": "Work"
}
```

**Response: `201 Created`**
```json
{
  "id": "1698745200000",
  "text": "Meeting notes regarding system architecture.",
  "category": "Work",
  "timestamp": 1698745200000
}
```

## 3. Delete Note
**DELETE** `/notes/{id}`

Deletes a specific note by ID.

**Response: `204 No Content`**

## 4. Export Notes (Asynchronous)
**POST** `/notes/export`

Triggers a background job to export all user notes into a downloadable file. 
*System Design Note:* This utilizes a message queue for asynchronous processing, decoupling the heavy file generation from user requests to protect overall system throughput and avoid exhausting connection pools.

**Response: `202 Accepted`**
```json
{
  "message": "Export job queued successfully.",
  "jobId": "exp-98765-abcde",
  "statusUrl": "/jobs/exp-98765-abcde"
}
```