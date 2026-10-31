# QuickNotes System Architecture

This document outlines the high-level architecture designed to support a read-heavy platform, scaling to handle up to 2,500 peak feed queries per second without exhausting database connection pools or causing latency spikes.

## Core Components

1. **Client Application**
   * The frontend SPA communicating with the backend via RESTful APIs.

2. **API Gateway / Load Balancer**
   * Routes incoming traffic efficiently across multiple backend instances.

3. **Caching Layer**
   * **Technology:** Redis or Memcached.
   * **Purpose:** Stores frequently accessed notes and feed queries to drastically reduce latency and protect the database from read spikes. 

4. **Database Cluster (Primary & Read Replicas)**
   * **Primary Database:** Handles all write operations (creating, updating, deleting).
   * **Read Replicas:** Multiple read-only instances. Because the application is read-heavy, these replicas are essential to prevent connection pool exhaustion. 
   * *Trade-off:* Users may experience slight replica lag (favoring availability over strict consistency), but system throughput remains protected.

5. **Message Queue**
   * **Technology:** RabbitMQ, Kafka, or Amazon SQS.
   * **Purpose:** Enables asynchronous processing, decoupling user requests from system-intensive background tasks.

6. **Dedicated Thumbnail Worker**
   * **Purpose:** Consumes upload events from the message queue and generates optimized thumbnails. 
   * **Capacity Planning:** Accurate unit conversions are necessary here. Processing 1 million thumbnails at 50 KB each amounts to 50 GB per day, accumulating to roughly 18 TB per year. Precise daily math is critical for predicting network egress and storage costs.

7. **Object Storage**
   * **Technology:** Amazon S3 or similar.
   * **Purpose:** Stores the physical attachment files and generated thumbnails, keeping heavy media out of the relational database.