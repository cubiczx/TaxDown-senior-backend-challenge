# Usage

## Running the Application

### Server

To start the server, run:

#### Express Server

```bash
npm run build
npm run start
```

#### Serverless Framework

```bash
npm run build-serverless
npm run start-serverless
```

### Local / Development

To start the server, run:

#### If you use PowerShell with the Set-ExecutionPolicy, run

1. Enable Script Execution in PowerShell
Open PowerShell as Administrator: Search for "PowerShell" in the start menu, right-click and select "Run as administrator."
2. Enable Script Execution: Run the following command in the PowerShell window:

```bash
Set-ExecutionPolicy RemoteSigned
```

This will allow local scripts that are not signed to be executed.
3. Confirm Action: You may be asked to confirm the change. Type Y and press Enter.
4. Close PowerShell and try the tsc command again in your terminal.

##### For Express

```bash
tsc
npm run dev
```

###### With npx

```bash
npx tsc
npm run dev
```

#### For Serverless Framework

```bash
serverless offline
```

## Running Tests

To run the tests, use:

```bash
npm test
```

To run specific test use:

```bash
npx jest src/tests/integration/CustomerController.test.ts -t "should return 409 if email is already in use"
```
