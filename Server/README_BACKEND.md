# NerdsOnCall API Documentation

This document provides a concise overview of the database schema and API endpoints for the NerdsOnCall backend.

## 1. Database Schema

The database is built on PostgreSQL. The schema consists of the following tables:

### `users`

Stores user account information for students, tutors, and admins.

| Field               | Data Type        | Constraints      | Description                           |
| :------------------ | :--------------- | :--------------- | :------------------------------------ |
| `id`                | `bigserial`      | Primary Key      | Unique identifier for the user        |
| `email`             | `varchar(255)`   | Not Null, Unique | User's email address                  |
| `password`          | `varchar(255)`   | Not Null         | Hashed password                       |
| `first_name`        | `varchar(255)`   | Not Null         | User's first name                     |
| `last_name`         | `varchar(255)`   | Not Null         | User's last name                      |
| `role`              | `varchar(255)`   | Not Null         | `STUDENT`, `TUTOR`, or `ADMIN`        |
| `is_active`         | `boolean`        | Not Null         | If the user account is active         |
| `is_online`         | `boolean`        | Not Null         | User's current online status          |
| `profile_picture`   | `varchar(255)`   |                  | URL to profile picture                |
| `phone_number`      | `varchar(255)`   |                  | User's phone number                   |
| `bio`               | `varchar(255)`   |                  | Short biography (for tutors)          |
| `subjects`          | `varchar(255)[]` |                  | List of subjects a tutor teaches      |
| `rating`            | `float8`         |                  | Average rating for a tutor            |
| `total_sessions`    | `integer`        |                  | Total number of completed sessions    |
| `total_earnings`    | `float8`         |                  | Total earnings (for tutors)           |
| `hourly_rate`       | `float8`         |                  | Tutor's hourly rate                   |
| `stripe_account_id` | `varchar(255)`   |                  | Stripe Connect account ID for payouts |
| `created_at`        | `timestamp`      |                  | Timestamp of creation                 |
| `updated_at`        | `timestamp`      |                  | Timestamp of last update              |

### `doubts`

Stores the details of questions or doubts submitted by students.

| Field                | Data Type        | Constraints             | Description                                                |
| :------------------- | :--------------- | :---------------------- | :--------------------------------------------------------- |
| `id`                 | `bigserial`      | Primary Key             | Unique identifier for the doubt                            |
| `student_id`         | `bigint`         | Not Null, FK to `users` | The student who created the doubt                          |
| `subject`            | `varchar(255)`   | Not Null                | The subject of the doubt                                   |
| `title`              | `varchar(255)`   | Not Null                | A brief title for the doubt                                |
| `description`        | `oid`            | Not Null                | A detailed description of the doubt                        |
| `priority`           | `varchar(255)`   | Not Null                | `LOW`, `MEDIUM`, `HIGH`, `URGENT`                          |
| `status`             | `varchar(255)`   | Not Null                | `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CANCELLED` |
| `attachments`        | `varchar(255)[]` |                         | URLs to any attached files                                 |
| `preferred_tutor_id` | `bigint`         |                         | ID of a specific tutor the student requested               |
| `created_at`         | `timestamp`      |                         | Timestamp of creation                                      |
| `updated_at`         | `timestamp`      |                         | Timestamp of last update                                   |

### `sessions`

Stores information about each tutoring session.

| Field               | Data Type       | Constraints              | Description                                              |
| :------------------ | :-------------- | :----------------------- | :------------------------------------------------------- |
| `id`                | `bigserial`     | Primary Key              | Unique identifier for the session                        |
| `student_id`        | `bigint`        | Not Null, FK to `users`  | The student in the session                               |
| `tutor_id`          | `bigint`        | FK to `users`            | The tutor in the session                                 |
| `doubt_id`          | `bigint`        | Not Null, FK to `doubts` | The doubt this session is for                            |
| `status`            | `varchar(255)`  | Not Null                 | `PENDING`, `ACTIVE`, `COMPLETED`, `CANCELLED`, `TIMEOUT` |
| `start_time`        | `timestamp`     | Not Null                 | When the session started                                 |
| `end_time`          | `timestamp`     |                          | When the session ended                                   |
| `duration_minutes`  | `bigint`        |                          | Total duration of the session in minutes                 |
| `cost`              | `numeric(10,2)` |                          | Total cost of the session                                |
| `tutor_earnings`    | `numeric(10,2)` |                          | How much the tutor earned                                |
| `session_id`        | `varchar(255)`  |                          | Unique ID for WebRTC signaling                           |
| `room_id`           | `varchar(255)`  |                          | Video call room identifier                               |
| `session_notes`     | `oid`           |                          | Shared notes from the session                            |
| `canvas_data`       | `oid`           |                          | JSON data for the collaborative canvas                   |
| `recording_enabled` | `boolean`       |                          | If the session was recorded                              |
| `recording_url`     | `varchar(255)`  |                          | URL to the session recording                             |
| `created_at`        | `timestamp`     |                          | Timestamp of creation                                    |
| `updated_at`        | `timestamp`     |                          | Timestamp of last update                                 |

### `subscriptions`

Manages user subscription plans.

| Field                    | Data Type      | Constraints             | Description                                 |
| :----------------------- | :------------- | :---------------------- | :------------------------------------------ |
| `id`                     | `bigserial`    | Primary Key             | Unique identifier for the subscription      |
| `user_id`                | `bigint`       | Not Null, FK to `users` | The user who owns the subscription          |
| `plan_type`              | `varchar(255)` | Not Null                | `BASIC`, `STANDARD`, `PREMIUM`              |
| `status`                 | `varchar(255)` | Not Null                | `ACTIVE`, `CANCELED`, `EXPIRED`, `PAST_DUE` |
| `price`                  | `float8`       | Not Null                | The price paid for the subscription         |
| `start_date`             | `timestamp`    | Not Null                | Subscription start date                     |
| `end_date`               | `timestamp`    | Not Null                | Subscription end date                       |
| `stripe_subscription_id` | `varchar(255)` |                         | ID from Stripe                              |
| `sessions_used`          | `integer`      |                         | Number of sessions used in the period       |
| `sessions_limit`         | `integer`      |                         | Maximum number of sessions allowed          |
| `created_at`             | `timestamp`    |                         | Timestamp of creation                       |
| `updated_at`             | `timestamp`    |                         | Timestamp of last update                    |

### `feedbacks`

Stores ratings and comments from users after a session.

| Field         | Data Type      | Constraints                | Description                              |
| :------------ | :------------- | :------------------------- | :--------------------------------------- |
| `id`          | `bigserial`    | Primary Key                | Unique identifier for the feedback       |
| `session_id`  | `bigint`       | Not Null, FK to `sessions` | The session this feedback is for         |
| `reviewer_id` | `bigint`       | Not Null, FK to `users`    | The user who gave the feedback           |
| `reviewee_id` | `bigint`       | Not Null, FK to `users`    | The user who received the feedback       |
| `rating`      | `integer`      | Not Null                   | Rating from 1 to 5                       |
| `comment`     | `oid`          |                            | The text comment                         |
| `type`        | `varchar(255)` | Not Null                   | `STUDENT_TO_TUTOR` or `TUTOR_TO_STUDENT` |
| `created_at`  | `timestamp`    |                            | Timestamp of creation                    |

### `payouts`

Tracks money paid out to tutors.

| Field                | Data Type      | Constraints             | Description                                                 |
| :------------------- | :------------- | :---------------------- | :---------------------------------------------------------- |
| `id`                 | `bigserial`    | Primary Key             | Unique identifier for the payout                            |
| `tutor_id`           | `bigint`       | Not Null, FK to `users` | The tutor receiving the payout                              |
| `amount`             | `float8`       | Not Null                | The amount of the payout                                    |
| `status`             | `varchar(255)` | Not Null                | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `CANCELLED` |
| `period_start`       | `timestamp`    | Not Null                | Start of the earnings period                                |
| `period_end`         | `timestamp`    | Not Null                | End of the earnings period                                  |
| `stripe_transfer_id` | `varchar(255)` |                         | The transfer ID from Stripe                                 |
| `created_at`         | `timestamp`    |                         | Timestamp of creation                                       |
| `updated_at`         | `timestamp`    |                         | Timestamp of last update                                    |

---

## 2. API Endpoints

All endpoints are relative to the base URL (e.g., `http://localhost:8080`).

| Method                       | Path                                | Description                                            |
| :--------------------------- | :---------------------------------- | :----------------------------------------------------- |
| `GET`                        | `/`                                 | Serves the static `index.html` welcome page.           |
| `GET`                        | `/info`                             | Returns a JSON object with API details.                |
| `GET`                        | `/health`                           | Health check endpoint. Returns status `UP`.            |
| `GET`                        | `/welcome`                          | Alias for the `/info` endpoint.                        |
|                              |                                     |                                                        |
| **Authentication**           |                                     |                                                        |
| `POST`                       | `/auth/register`                    | Register a new user.                                   |
| `POST`                       | `/auth/login`                       | Login and receive a JWT token.                         |
| `POST`                       | `/auth/logout`                      | Logout the current user.                               |
| `GET`                        | `/auth/me`                          | Get the current authenticated user's details.          |
|                              |                                     |                                                        |
| **Users**                    |                                     |                                                        |
| `GET`                        | `/users/profile`                    | Get the profile of the current user.                   |
| `PUT`                        | `/users/profile`                    | Update the profile of the current user.                |
| `GET`                        | `/users/tutors`                     | Get a list of online tutors (can filter by `subject`). |
| `GET`                        | `/users/tutors/top-rated`           | Get a list of top-rated tutors.                        |
| `GET`                        | `/users/{id}`                       | Get user details by their ID.                          |
| `PUT`                        | `/users/online-status`              | Update the `isOnline` status for the current user.     |
|                              |                                     |                                                        |
| **Doubts**                   |                                     |                                                        |
| `POST`                       | `/doubts`                           | Create a new doubt.                                    |
| `GET`                        | `/doubts/my-doubts`                 | Get all doubts created by the current user.            |
| `GET`                        | `/doubts/available`                 | Get all open doubts available for tutors.              |
| `GET`                        | `/doubts/preferred`                 | Get doubts where the current tutor is preferred.       |
| `GET`                        | `/doubts/{id}`                      | Get a specific doubt by its ID.                        |
| `PUT`                        | `/doubts/{id}/status`               | Update the status of a doubt.                          |
|                              |                                     |                                                        |
| **Sessions**                 |                                     |                                                        |
| `POST`                       | `/sessions`                         | Create a new tutoring session.                         |
| `GET`                        | `/sessions/my-sessions`             | Get all sessions for the current user.                 |
| `GET`                        | `/sessions/{id}`                    | Get a specific session by its ID.                      |
| `PUT`                        | `/sessions/{id}/end`                | End a session and calculate costs.                     |
| `PUT`                        | `/sessions/{id}/notes`              | Update the shared notes for a session.                 |
| `PUT`                        | `/sessions/{id}/canvas`             | Update the shared canvas data for a session.           |
|                              |                                     |                                                        |
| **Subscriptions & Payments** |                                     |                                                        |
| `POST`                       | `/subscriptions/checkout`           | Creates a Stripe checkout session for a plan.          |
| `POST`                       | `/subscriptions/cancel/{id}`        | Cancels a user's subscription.                         |
| `GET`                        | `/subscriptions/my-subscription`    | Get the current user's active subscription.            |
| `GET`                        | `/subscriptions/history`            | Get the subscription history for the current user.     |
| `GET`                        | `/subscriptions/can-create-session` | Check if the user can start a new session.             |
| `POST`                       | `/stripe/webhook`                   | Handles incoming webhook events from Stripe.           |
|                              |                                     |                                                        |
| **Feedback**                 |                                     |                                                        |
| `POST`                       | `/feedback`                         | Submit feedback for a completed session.               |
| `GET`                        | `/feedback/tutor/{tutorId}`         | Get all feedback for a specific tutor.                 |
| `GET`                        | `/feedback/my-feedback`             | Get all feedback submitted by the current user.        |

---
