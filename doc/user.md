# User API Spec

## Register User

Endpoint: POST /api/users/register

Request Body:

```json
{
  "username": "ikhsan",
  "password": "12345678",
  "name": "ikhsan"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "ikhsan",
    "name": "ikhsan"
  }
}
```

Response Body (Error):

```json
{
  "username": "Username Already registered"
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
  "username": "ikhsan",
  "password": "12345678"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "ikhsan",
    "name": "ikhsan",
    "token": "session_id_generated"
  }
}
```

Response Body (Error):

```json
{
  "username": "Username or Password is wrong!"
}
```

## Get User

Endpoint: GET /api/users/current

Headers:

- authorization: token

Response Body (Success):

```json
{
  "data": {
    "username": "ikhsan",
    "name": "ikhsan"
  }
}
```

Response Body (Error):

```json
{
  "username": "Unauthorized"
}
```

## Update User

Endpoint: PUT /api/users/current

Headers:

- authorization: token

Request Body:

```json
{
  "password": "12345678", // optional
  "name": "ikhsan" // optional
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "ikhsan",
    "name": "ikhsan"
  }
}
```

Response Body (Error):

```json
{
  "username": "Unauthorized"
}
```

## Logout User

Endpoint: DELETE /api/users/logout

Headers:

- authorization: token

Response Body (Success):

```json
{
  "data": true
}
```
