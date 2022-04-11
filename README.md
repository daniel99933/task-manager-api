# task-manager-api

This is a REST API providing task management service.



## REST API

The root of the API is located at https://danieltyl-task-manager.herokuapp.com

### Create user

`POST /users`

- accept JSON body (name, email, password)

### Login user

`POST /users/login`

- accept JSON body (email, password)

### Logout user

`POST /users/logout`

- requires authorization (Bearer Token)

### Logout all sessions

`POST /users/logoutAll`

- requires authorization (Bearer Token)

### Create task

`POST /tasks`

- requires authorization (Bearer Token)
- accept JSON body (description, completed)

### Upload profile pic

`POST /users/me/avatar`

- requires authorization (Bearer Token)
- requires form-data (avatar=(Your File))

### Read profile

`GET /users/me`

- requires authorization (Bearer Token)

### Read tasks

`GET /tasks`

- requires authorization (Bearer Token)

### Read task

`GET /tasks/{task_id}`

- requires authorization (Bearer Token)

### Update user

`PATCH /users/me`

- requires authorization (Bearer Token)
- accept JSON body (name, email)

### Update task

`PATCH /tasks/{task_id}`

- requires authorization (Bearer Token)
- accept JSON body (title, completed)

### Delete user

`DELETE /users/me`

- requires authorization (Bearer Token)

### Delete task

`DELETE /tasks/{task_id}`

- requires authorization (Bearer Token)

### Delete profile pic

`DELETE /users/me/avatar`

- requires authorization (Bearer Token)
