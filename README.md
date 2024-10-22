
# Case Connect

The live website can found at: https://case-connect.vercel.app/

The folders in this repository are:
- *components* - Application Components
- *constants* - Application constants
- *cypress* - Testing Files
- *lib* - Initialization files (i.e. prisma)
- *pages* - Application Pages/Routes
- *pages/api* - API Routes
- *prisma* - Database Schema
- *utils* - Application helper functions




## Run Locally

Clone the project

```bash
  git clone https://github.com/rxp392/CSDS393Project
```

Go to the project directory

```bash
  cd CSDS393Project
```

Install dependencies

```bash
  npm install
```

** add a file in the root of the directory called **.env** and add the environment variables **

Start the server

```bash
  npm run dev
```

visit http://localhost:3000/


## Running Tests

To run the tests, 

add the following envrinoment variable to your **.env** file

```
TEST_MODE=true
```

** add a file in the root of the directory called **cypress.env.json** and add the envrinoment variable **

then run
```bash
  npm run test
```
OR to not show the browser, run
```bash
  npm run test:headless
```

