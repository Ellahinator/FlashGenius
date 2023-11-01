# API Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [GET /csrf_cookie](#get-csrf_cookie)
   - [POST /auth/signup](#post-authsignup)
   - [POST /auth/login](#post-authlogin)
   - [POST /auth/logout](#post-authlogout)
   - [POST /deck/create](#post-deckcreate)
   - [POST /deck/delete](#post-deckdelete)
   - [POST /flashcards/create](#post-flashcardscreate)
   - [POST /flashcards/delete](#post-flashcardsdelete)
   - [POST /flashcards/edit](#post-flashcardsedit)

## Introduction

This document describes the API endpoints available for the application. Each section below will describe the endpoint, the method, any required JSON payload, and the expected response.

## Authentication

Most API calls require authentication via a CSRF token and a JWT. Use the `/csrf_cookie` endpoint to obtain a CSRF token and `/auth/login` to obtain a JWT.

---

### GET /csrf_cookie

#### Description:

Obtain a CSRF token for authentication.

#### Method:

`GET`

#### Headers:

- None

#### Response:

- Status: 200
- JSON:

  ```json
  {
    "status": "success",
    "message": "CSRF cookie set"
  }
  ```

---

### POST /auth/signup

#### Description:

Register a new user.

#### Method:

`POST`

#### Headers:

- `Content-Type: application/json`
- `X-CSRFToken: YOUR_CSRF_TOKEN`

#### JSON Payload:

```json
{
  "username": "string",
  "email": "string",
  "password1": "string",
  "password2": "string"
}
```

#### Response:

- Status: 201
- JSON:

  ```json
  {
    "status": "success",
    "access_token": "YOUR_ACCESS_TOKEN",
    "message": "Registration successful."
  }
  ```

---

### POST /auth/login

#### Description:

Login an existing user.

#### Method:

`POST`

#### Headers:

- `Content-Type: application/json`
- `X-CSRFToken: YOUR_CSRF_TOKEN`

#### JSON Payload:

```json
{
  "username": "string",
  "password": "string"
}
```

#### Response:

- Status: 200
- JSON:

  ```json
  {
    "status": "success",
    "access_token": "YOUR_ACCESS_TOKEN",
    "message": "You are now logged in as {username}."
  }
  ```

---

### POST /auth/logout

#### Description:

Logout the current user.

#### Method:

`POST`

#### Headers:

- `X-CSRFToken: YOUR_CSRF_TOKEN`

#### Response:

- Status: 200
- JSON:

  ```json
  {
    "status": "success",
    "message": "Successfully logged out."
  }
  ```

---

### POST /deck/create

#### Description:

Create a new deck of flashcards from a given block of text.

#### Method:

`POST`

#### Headers:

- `Content-Type: application/json`
- `X-CSRFToken: YOUR_CSRF_TOKEN`
- `Authorization: Bearer YOUR_ACCESS_TOKEN`

#### JSON Payload:

```json
{
  "content": "string"
}
```

#### Response:

- Status: 201
- JSON:

  ```json
  {
    "status": "success",
    "message": "Flashcards and Deck created successfully."
  }
  ```

---

### POST /deck/delete

#### Description:

Delete a specific deck of flashcards.

#### Method:

`POST`

#### Headers:

- `Content-Type: application/json`
- `X-CSRFToken: YOUR_CSRF_TOKEN`
- `Authorization: Bearer YOUR_ACCESS_TOKEN`

#### JSON Payload:

```json
{
  "deck_id": "integer"
}
```

#### Response:

- Status: 200 or 403
- JSON:

  ```json
  {
    "status": "success",
    "message": "Deck deleted successfully."
  }
  ```

  or

  ```json
  {
    "status": "error",
    "message": "You do not have permission to delete this deck."
  }
  ```

---

### POST /flashcards/create

#### Description:

Create a new flashcard in a specific deck.

#### Method:

`POST`

#### Headers:

- `Content-Type: application/json`
- `X-CSRFToken: YOUR_CSRF_TOKEN`
- `Authorization: Bearer YOUR_ACCESS_TOKEN`

#### JSON Payload:

```json
{
  "term": "string",
  "definition": "string",
  "deck_id": "integer"
}
```

#### Response:

- Status: 201
- JSON:

  ```json
  {
    "status": "success",
    "message": "Flashcard added to the deck successfully."
  }
  ```

---

### POST /flashcards/delete

#### Description:

Delete a specific flashcard.

#### Method:

`POST`

#### Headers:

- `Content-Type: application/json`
- `X-CSRFToken: YOUR_CSRF_TOKEN`
- `Authorization: Bearer YOUR_ACCESS_TOKEN`

#### JSON Payload:

```json
{
  "flashcard_id": "integer"
}
```

#### Response:

- Status: 200 or 403
- JSON:

  ```json
  {
    "status": "success",
    "message": "Flashcard deleted successfully."
  }
  ```

  or

  ```json
  {
    "status": "error",
    "message": "You do not have permission to delete this flashcard."
  }
  ```

---

### POST /flashcards/edit

#### Description:

Edit a specific flashcard.

#### Method:

`POST`

#### Headers:

- `Content-Type: application/json`
- `X-CSRFToken: YOUR_CSRF_TOKEN`
- `Authorization: Bearer YOUR_ACCESS_TOKEN`

#### JSON Payload:

```json
{
  "flashcard_id": "integer",
  "term": "string",
  "definition": "string"
}
```

#### Response:

- Status: 200
- JSON:

  ```json
  {
    "status": "success",
    "message": "Flashcard updated successfully."
  }
  ```
