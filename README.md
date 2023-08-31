# eszut-api - server side of ESZUT (ENG)

The server side of ESZUT is implemented in Node.js (with TypeScript). Data is stored in MongoDB. This app also provides the ability to send emails and push notifications via web-push.

This app works in conjunction with the client side of the application, which is also available on GitHub: [eszut-client](https://github.com/JakubOlejnik2007/eszut-client)

This code is a part of ESZUT - *Electronical system for reporting technical issues* - an application that provides the following abilities:
- Reporting problems without the need for authorization
- Managing reported problems

The client side is implemented in React.js.

## Table on Contents

- [Installation](#installation "Installation")
- [Configuration](#configuration "Configuration")
- [Running](#running "Running")
- [Api and endpoints](#api-and-endpoints "API and endpoints")
- [Project structure](#project-structure "Project structure")
## Installation

To install this application you need to:

1. Clone code form GitHub repository via  
    ```
    git clone https://github.com/JakubOlejnik2007/eszut-api.git
    ```

2. Then, you need to install all depedencies in project directory via  
    ```
    npm install
    ```
3. Create a `.env` file containing configuration data for the app, including:
    - Port for the Express server (the port to be used for running the app).
    - IP address, port, and name of the database (MongoDB in this case).
    - Mail service details, including username and password for sending emails.
    - Pair of VAPID keys for web-push (private and public keys).
    - JSONWebToken secret and token expiration time (used in the authorization process).


4. Build the entire project using:
    ```
    npm run build
    ```
    The built app will be located in the `dist` directory.

## Configuration

To configure this app, you can use the `.env.example` file as a template. Rename it to `.env` and adjust the data according to your requirements. The example data in the file is not suitable for the app to work correctly.

## Running
To run this app you must build it, then use `node` on index.js file inside `dist` directory,  
ex. from project directory 
```
node dist/index.js
``` 
or inside `dist`
```
node index.js
```

You can also use `pm2` or other manager for node processes.

## API and endpoints

This section provides a detailed explanation of the available API endpoints:

### `GET /get-categories`

Endpoint for retrieving a list of categories (used in form for reporting problem).

**Parameters:**
None

**Response:**
A JSON array containing a list of categories.


Example Response:
```json
[
    {
        "_id": "64ebb5340791e4fcf0c2937e",
        "name": "Problem z internetem",
        "__v": 0
    },
    {
        "_id": "64f0e4dc2bc6c0f19464df82",
        "name": "Problem z komputerem",
        "__v": 0
    }
]
```

### `GET /get-places`

Endpoint for retrieving a list of places (used in form for reporting problem).

**Parameters:**
None

**Response:**
A JSON array containing a list of places.

Example Response:
```json
[
    {
        "_id": "64ee62c0c370d7228bf18383",
        "name": "15",
        "__v": 0
    },
    {
        "_id": "64ee62c2c370d7228bf18386",
        "name": "16",
        "__v": 0
    },
    {
        "_id": "649879879b8d119d39347bb4",
        "name": "Świetlica"
    }
]
```

### `POST /report-problem`

Endpoint for sending new problems to app.

**Parameters:**
- `who` (string): Who reporting problem
- `what` (string): What happened
- `when` (number): Current date
- `PlaceID` (string): ID for place
- `CategoryID` (string): ID for category

**Response:**
Status 200 if successs

### `POST /login`

Endpoint for logging in.

**Parameters:**
- `email` (string)
- `password` (string)

**Response:**
Status 200 if successs

### `POST /report-problem`

Endpoint for sending new problems to app.

**Parameters:**
- `who` (string): Who reporting problem
- `what` (string): What happened
- `when` (number): Current date
- `PlaceID` (string): ID for place
- `CategoryID` (string): ID for category
- `priority` (number): Priority of problem
**Response:**
Status 200 if successs

### `POST /subscribe`

Endpoint for registering push notification subscriptions.

**Parameters:**
- `subscription` (string): Push notification subscription

**Response:**
Status 200 if successs

### `GET /get-admins`

Endpoint for retrieving a list of admins.

**Headers**
Authorization

**Parameters:**
None

**Response:**
A JSON array containing a list of admins.

Example response
```JSON
[
    {
        "_id": "646a64885a0d990137399d6d",
        "name": "root",
        "email": "jacobole2000@gmail.com"
    },
    {
        "_id": "64790ea6879ad5f9fdeb3de7",
        "name": "Jakub Olejnik",
        "email": "jolejniktesty@gmail.com"
    }
]
```

### `GET /get-unsolved-problems`

Endpoint for retrieving a list of unsolved problems.

**Headers**
Authorization

**Parameters:**
None

**Response:**
A JSON array containing a list of unsolved problems.

Example response
```JSON
[
    [
    {
        "_id": "64da92a9d98cf8cc5525206a",
        "priority": 1,
        "PlaceID": {
            "_id": "649879769b8d119d39347bb2",
            "name": "10"
        },
        "who": "asdasdasdads",
        "what": "asdasdasdasdasd",
        "when": 1692045390452,
        "isSolved": false,
        "isUnderRealization": true,
        "CategoryID": {
            "_id": "64ebb5340791e4fcf0c2937e",
            "name": "Problem z internetem"
        },
        "__v": 0,
        "whoDealsID": "646a64885a0d990137399d6d",
        "categoryName": "Problem z internetem",
        "placeName": "10",
        "whoDeals": "root"
    },
    {
        "_id": "64da92afd98cf8cc55252077",
        "priority": 3,
        "PlaceID": {
            "_id": "649879769b8d119d39347bb2",
            "name": "10"
        },
        "who": "asdasdasdads",
        "what": "asdasdasdasdasd",
        "when": 1692045390452,
        "isSolved": false,
        "isUnderRealization": false,
        "CategoryID": {
            "_id": "64ebb5340791e4fcf0c2937e",
            "name": "Problem z internetem"
        },
        "__v": 0,
        "categoryName": "Problem z internetem",
        "placeName": "10",
        "whoDeals": "",
        "whoDealsID": ""
    }
]
```

### `GET /get-solved-problems`

Endpoint for retrieving a list of solved problems (pagination).

**Headers**
Authorization

**Parameters:**
 - `page` (number): page of problems to send (pagination).

**Response:**
A JSON array containing a list of solved problems.

Example response
```JSON
{
    "totalCount": 1368,
    "currentPage": 1,
    "items": [
        {
            "_id": "64dd15a9886ac439adeed7b1",
            "priority": 1,
            "PlaceID": {
                "_id": "649879879b8d119d39347bb4",
                "name": "Świetlica"
            },
            "who": "Jakub Olejnik",
            "what": "Zgloszenie test",
            "when": 1692202224254,
            "isSolved": true,
            "isUnderRealization": false,
            "CategoryID": {
                "_id": "64ebb5340791e4fcf0c2937e",
                "name": "Problem z internetem"
            },
            "__v": 0,
            "whoDealsID": "646a64885a0d990137399d6d",
            "dateOfSolved": 1692214262424,
            "whoSolvedID": {
                "_id": "646a64885a0d990137399d6d",
                "name": "root"
            },
            "categoryName": "Problem z internetem",
            "placeName": "Świetlica",
            "whoSolved": "root"
        },
        {
            "_id": "64da90ab6becc5750eff00e9",
            "priority": 1,
            "PlaceID": {
                "_id": "649879769b8d119d39347bb2",
                "name": "10"
            },
            "who": "asdasdasdads",
            "what": "asdasdasdasdasd",
            "when": 1692045390452,
            "isSolved": true,
            "isUnderRealization": false,
            "CategoryID": {
                "_id": "64ebb5340791e4fcf0c2937e",
                "name": "Problem z internetem"
            },
            "__v": 0,
            "whoDealsID": "646a64885a0d990137399d6d",
            "dateOfSolved": 1692210020665,
            "whoSolvedID": {
                "_id": "646a64885a0d990137399d6d",
                "name": "root"
            },
            "categoryName": "Problem z internetem",
            "placeName": "10",
            "whoSolved": "root"
        }
    ]
}
```

### `POST /insert-category`

Endpoint for inserting new category.

**Headers**
Authorization

**Parameters:**
 - `name` (string): name of the category

**Response:**
Status 200 if success.

### `POST /insert-place`

Endpoint for inserting new place.

**Headers**
Authorization

**Parameters:**
 - `name` (string): name of the place

**Response:**
Status 200 if success.

### `POST /add-new-administrator`

Endpoint for adding new administrator.

**Headers**
Authorization

**Parameters:**
 - `name` (string): name of the administrator
 - `email` (string): email of the administrator
 - `password` (string): password of the administrator

**Response:**
Status 200 if success.

### `PUT /update-problem`

Endpoint for updating problem data.

**Headers**
Authorization

**Parameters:**
 - `ProblemID` (string): ID of the problem to update
 - `priority` (number): new priority of the problem
 - `CategoryID` (string): ID of a new category of the problem
 - `PlaceID` (string): ID of a new place of the problem

**Response:**
Status 200 if success.

### `PUT /take-on-problem`

Endpoint for updating problem data (administrator want to take on the problem).

**Headers**
Authorization

**Parameters:**
 - `ProblemID` (string): ID of the problem to update
 - `AdministratorID` (string): ID of the administrator
 
**Response:**
Status 200 if success.


### `PUT /reject-problem`

Endpoint for updating problem data (administrator want to reject working on the problem).

**Headers**
Authorization

**Parameters:**
 - `ProblemID` (string): ID of the problem to update
 - `AdministratorID` (string): ID of the administrator
 
**Response:**
Status 200 if success.

### `PUT /mark-problem-as-solved`

Endpoint for updating problem data (administrator want to mark the problem as solved).

**Headers**
Authorization

**Parameters:**
 - `ProblemID` (string): ID of the problem to update
 - `AdministratorID` (string): ID of the administrator
 
**Response:**
Status 200 if success.

### `PUT /mark-problem-as-unsolved`

Endpoint for updating problem data (administrator want to mark the problem as unsolved).

**Headers**
Authorization

**Parameters:**
 - `ProblemID` (string): ID of the problem to update
 - `AdministratorID` (string): ID of the administrator
 
**Response:**
Status 200 if success.

### `PUT /change-password`

Endpoint for updating administrator data (administrator want to change password).

**Headers**
Authorization

**Parameters:**
 - `newPassword` (string): New password
 - `AdministratorID` (string): ID of the administrator
 
**Response:**
Status 200 if success.

### `PUT /change-password`

Endpoint for updating administrator data (administrator want to change email).

**Headers**
Authorization

**Parameters:**
 - `newEmail` (string): New email
 - `AdministratorID` (string): ID of the administrator
 
**Response:**
Status 200 if success.

### `DELETE /delete-category`

Endpoint for deleting categories.

**Headers**
Authorization

**Parameters:**
 - `CategoryID` (string): Category to delete
**Response:**
Status 200 if success.

### `DELETE /delete-place`

Endpoint for deleting places.

**Headers**
Authorization

**Parameters:**
 - `PlaceID` (string): Place to delete
**Response:**
Status 200 if success.

## Project Structure

The project is structured as follows:

- **/node_modules** - NPM dependencies
- **/db** - Working with the database (MongoDB) - includes models and functions to interact with data
- **/models** - Database models
- **/helpers** - Functions for working with data
- **/utils** - Tools for the application (e.g., generating and verifying JWT)
- **/.env** - Configuration file
- **/.env.example** - Example configuration file
- **/config.ts** - Exported constants with configuration from `.env`
- **/index.ts** - The main starting file for the app
- **/package.json** - NPM configuration file
- **/tsconfig.json** - TypeScript configuration file

