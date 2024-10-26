# Usage

## Running the Application

### Starting the Server

To start the server, choose one of the following methods based on your setup:

#### 1. Express Server

To run the Express server, execute the following commands:

```bash
npm run build
npm run start

```

#### 2. Serverless Framework

To run the application with the Serverless Framework, use these commands:

```bash
npm run build-serverless
npm run start-serverless
```

### Local / Development Setup

If you're running the application locally, follow these steps:

#### PowerShell Setup (Windows)

If you are using PowerShell, you may need to enable script execution:

1. Enable Script Execution in PowerShell
Open PowerShell as Administrator: Search for "PowerShell" in the start menu, right-click and select "Run as administrator."
2. Enable Script Execution: Run the following command in the PowerShell window:

```bash
Set-ExecutionPolicy RemoteSigned
```

This will allow local scripts that are not signed to be executed.
3. Confirm Action: You may be asked to confirm the change. Type Y and press Enter.
4. Close PowerShell and try the tsc command again in your terminal.

#### Running the Application Locally

##### For Express

To start the Express server in development mode, run:

```bash
tsc
npm run dev
```

###### Using npx

You can also run it using npx:

```bash
npx tsc
npm run dev
```

#### For Serverless Framework

To run the Serverless application locally, use:

```bash
serverless offline
```

## Running Tests

To execute all tests, run:

```bash
npm test
```

To run a specific test, use:

```bash
npx jest src/tests/integration/CustomerController.test.ts -t "should return 409 if email is already in use"
```

### API endpoint Collections

#### Serverless

For testing the Serverless endpoints, you can use the Postman Collection named TaxDown-senior-backend-challenge.postman_collection.json.
You can also access the Swagger specifications in JSON format at: [http://localhost:${PORT}/dev/api-docs](http://localhost:${PORT}/dev/api-docs)

#### Express

For the Express server, you can access the Swagger OpenAPI UI at: [http://localhost:${PORT}/api-docs](http://localhost:${PORT}/api-docs)