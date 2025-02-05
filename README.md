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

## Base URL
```
http://host:PORT
```

---

## API and endpoints

### Public Routes

#### **[GET] Get Categories**
**Endpoint:** `GET /get-categories`
- **Auth Required:** ❌
- **Query Params:** None
- **Body:** None
- **Example response:**
  ```json
  [
    {
        "_id": "64f0e4dc2bc6c0f19464df82",
        "name": "Problem z komputerem",
        "__v": 0,
        "priority": "1"
    },
    {
        "_id": "64ebb5340791e4fcf0c2937e",
        "name": "Problem z internetem",
        "__v": 0,
        "priority": "3"
    },
  ]
  ```

#### **[GET] Get Places**
**Endpoint:** `GET /get-places`
- **Auth Required:** ❌
- **Query Params:** None
- **Body:** None
- **Example response:**
  ```json
  [
    {
        "_id": "649879769b8d119d39347bb2",
        "name": "10"
    },
    {
        "_id": "64ee62bcc370d7228bf1837d",
        "name": "13",
        "__v": 0
    }
  ]
  ```

#### **[GET] Get User Teams**
**Endpoint:** `GET /get-user-teams`
- **Auth Required:** ❌
- **Query Params:**
  - `id` (string) - User ID
- **Body:** None
- **Example response:**
  ```json
  [
    "Matematyka 3c",
    "3C - Administracja bazami danych",
    "1c_gr1_c++",
    "2C - Bazy danych",
    "Prog 2C 1/2 2023_2024",
    "Informatyka 3C gr 1 2024_25",
    "3cgr1 - Bazy danych [2024-2025]",
    "3C - Projektowanie oprogramowania",
    "3c - Programowanie aplikacji mobilnych",
    "3cgr1 - Programowanie obiektowe [2024-2025]",
    "3C_JP",
    "3cgr1 - Programowanie aplikacji internetowych [2024-2025]"
  ]
  ```

#### **[GET] Set Tokens**
**Endpoint:** `GET /set-tokens`
- **Auth Required:** ❌
- **Query Params:**
  - `id` (string) - MSAL_TOKEN
- **Body:** None
- **Example response:**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9sZWpuaWsuamFrdWJAenN0ei1yYWR6eW1pbi5wbCIsInJvbGUiOjIsInVzZXJJZCI6ImU1ZjQzMzM3LWI4ZTgtNDdmMy1iYzg1LTRiODEyZWNlNmY2MCIsInVzZXJuYW1lIjoiT2xlam5payBKYWt1YiIsImlhdCI6MTczODYwNDk2NiwiZXhwIjoxNzM4NjA2NzY2fQ.gYDKgDou0D9DurVcDTsvX07eXinVVhXGPPp5UgT7pwM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNWY0MzMzNy1iOGU4LTQ3ZjMtYmM4NS00YjgxMmVjZTZmNjAiLCJ1c2VybmFtZSI6Ik9sZWpuaWsgSmFrdWIiLCJlbWFpbCI6Im9sZWpuaWsuamFrdWJAenN0ei1yYWR6eW1pbi5wbCIsInJvbGUiOjIsImlhdCI6MTczODYwNDk2NiwiZXhwIjoxNzM5MjA5NzY2fQ.87bypbaVmnntSsQT2XxVFcVWITXb7shKZXREVD_Tx7E",
    "user": {
        "userId": "e5f43337-b8e8-47f3-bc85-4b812ece6f60",
        "username": "Olejnik Jakub",
        "email": "olejnik.jakub@zstz-radzymin.pl",
        "role": 2
    }
  }
  
  ```
  #### **[GET] Refresh Token**
**Endpoint:** `GET /refresh-token`
- **Auth Required:** ❌
- **Query Params:**
  - `id` (string) - REFRESH_TOKEN
- **Body:** None
- **Example response:**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNWY0MzMzNy1iOGU4LTQ3ZjMtYmM4NS00YjgxMmVjZTZmNjAiLCJ1c2VybmFtZSI6Ik9sZWpuaWsgSmFrdWIiLCJlbWFpbCI6Im9sZWpuaWsuamFrdWJAenN0ei1yYWR6eW1pbi5wbCIsInJvbGUiOjIsImlhdCI6MTczODYxMTI2NywiZXhwIjoxNzM4NjEyMTY3fQ.vTBiqkqwVnQvauYM2fiUlf8NyFdyWWmZEZJlX2y-dKE"
  }
  
  ```
---

### Private Routes

#### **[POST] Report a Problem**
**Endpoint:** `POST /report-problem`
- **Auth Required:** ✅
- **Query Params:** None
- **Body:**
  ```json
  {
    "PlaceID":"649879769b8d119d39347bb2",
    "CategoryID":"64f0e4dc2bc6c0f19464df82",
    "what":"Opis zgłoszenia"
  }
  ```

#### **[GET] Unsolved Problems**
**Endpoint:** `GET /get-unsolved-problems`
- **Auth Required:** ✅
- **Query Params:** None
- **Body:** None
- **Example response:**
  ```json
  [
    {
        "_id": "679ffb2c41eb602bafc03bbe",
        "priority": 1,
        "PlaceID": {
            "_id": "649879769b8d119d39347bb2",
            "name": "10"
        },
        "whoName": "Stoch Mateusz",
        "whoEmail": "stoch.mateusz@zstz-radzymin.pl",
        "what": "test",
        "when": 1738537772032,
        "isSolved": false,
        "isUnderRealization": true,
        "CategoryID": {
            "_id": "64f0e4dc2bc6c0f19464df82",
            "name": "Problem z komputerem"
        },
        "__v": 0,
        "whoDealsEmail": "stoch.mateusz@zstz-radzymin.pl",
        "whoDealsName": "Stoch Mateusz",
        "categoryName": "Problem z komputerem",
        "categoryId": "64f0e4dc2bc6c0f19464df82",
        "placeName": "10",
        "placeId": "649879769b8d119d39347bb2"
    },
    {
        "_id": "679ffb2e41eb602bafc03bc5",
        "priority": 1,
        "PlaceID": {
            "_id": "649879769b8d119d39347bb2",
            "name": "10"
        },
        "whoName": "Stoch Mateusz",
        "whoEmail": "stoch.mateusz@zstz-radzymin.pl",
        "what": "test2",
        "when": 1738537774057,
        "isSolved": false,
        "isUnderRealization": false,
        "CategoryID": {
            "_id": "64f0e4dc2bc6c0f19464df82",
            "name": "Problem z komputerem"
        },
        "__v": 0,
        "categoryName": "Problem z komputerem",
        "categoryId": "64f0e4dc2bc6c0f19464df82",
        "placeName": "10",
        "placeId": "649879769b8d119d39347bb2"
    },
  ]
  ```

#### **[GET] Solved Problems**
**Endpoint:** `GET /get-solved-problems`
- **Auth Required:** ✅
- **Query Params:**
    - `page` (number) - page for pagination
- **Body:** None
- **Example response:**
  ```json
  {
    "totalCount": 64,
    "currentPage": 1,
    "items": [
        {
            "_id": "679bf9cac4e1ae59a69ce091",
            "priority": 3,
            "PlaceID": {
                "_id": "649879769b8d119d39347bb2",
                "name": "10"
            },
            "whoName": "Stoch Mateusz",
            "whoEmail": "stoch.mateusz@zstz-radzymin.pl",
            "what": "b dghn dgfh dfgg",
            "when": 1738275274534,
            "isSolved": true,
            "isUnderRealization": false,
            "CategoryID": {
                "_id": "64ebb5340791e4fcf0c2937e",
                "name": "Problem z internetem"
            },
            "__v": 0,
            "whoDealsEmail": "stoch.mateusz@zstz-radzymin.pl",
            "whoDealsName": "Stoch Mateusz",
            "dateOfSolved": 1738537766764,
            "whoSolvedEmail": "stoch.mateusz@zstz-radzymin.pl",
            "whoSolvedName": "Stoch Mateusz",
            "categoryName": "Problem z internetem",
            "placeName": "10"
        },
        {
            "_id": "679bf9bcc4e1ae59a69ce07d",
            "priority": 3,
            "PlaceID": {
                "_id": "649879769b8d119d39347bb2",
                "name": "10"
            },
            "whoName": "Stoch Mateusz",
            "whoEmail": "stoch.mateusz@zstz-radzymin.pl",
            "what": "gsdfgdsgfet43344343",
            "when": 1738275260021,
            "isSolved": true,
            "isUnderRealization": false,
            "CategoryID": {
                "_id": "64ebb5340791e4fcf0c2937e",
                "name": "Problem z internetem"
            },
            "__v": 0,
            "whoDealsEmail": "stoch.mateusz@zstz-radzymin.pl",
            "whoDealsName": "Stoch Mateusz",
            "dateOfSolved": 1738537765098,
            "whoSolvedEmail": "stoch.mateusz@zstz-radzymin.pl",
            "whoSolvedName": "Stoch Mateusz",
            "categoryName": "Problem z internetem",
            "placeName": "10"
        }
    ]
  }
  ```

#### **[PUT] Update Problem**
**Endpoint:** `PUT /update-problem`
- **Auth Required:** ✅
- **Body:**
  ```json
  {
    "ProblemID":"6769e92de3a0f60bba9a54ea",
    "CategoryID":"64f0e4dc2bc6c0f19464df82",
    "priority":"3",
    "PlaceID":"64ee62c2c370d7228bf18386"
  }
  ```

#### **[DELETE] Delete Category**
**Endpoint:** `DELETE /delete-category`
- **Auth Required:** ✅
- **Body:**
    ```json
    {
        "CategoryID":"67a11b2e41eb602bafc03cae"
    }
    ```

#### **[DELETE] Delete Place**
**Endpoint:** `DELETE /delete-place`
- **Auth Required:** ✅
- **Body:**
    ```json
    {
        "PlaceID":"67a11b2e41eb602bafc03cae"
    }
    ```

#### **Delete Problems**
**Endpoint:** `DELETE /delete-problems`
- **Auth Required:** ✅
- **Query Params:** None
- **Body:** 
```json
  {
    "problems": ["id1", "id2"]
  }
  ```
  

---

## Authentication
This API uses token-based authentication. Include the `Authorization` header with a valid token for protected routes:
```
Authorization: Bearer <TOKEN>
```


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

