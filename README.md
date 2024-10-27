
# TaxDown senior backend challenge

## About the position

You will be building the backbone of TaxDown. Working shoulder to shoulder with other developers as well as the product team so we can grow and scale. Our business is tech and we build our core. 🔋

We are looking for someone who can help us grow by contributing their experience and their desire to do things well. Designing architectures, solving problems, giving ideas and, of course, developing quality software are the things you will do here.

The main objective is that the whole team can learn from you. And of course, we hope that you can learn a lot from us. It is always important to grow while working and we want you to become more senior than you already are with us (the real "Win - Win" 🚀).

## Take me to the challenge! 🤟

In this challenge (don't worry we don't want you to do work for free, we'll keep it short), you will have to create an API for the customer management of an online motorbike shop. The idea is to use Node.js (This is our base technology) to create this API. The design of the "Customer" entity, the database technology and the structure of the project are your choice.

👂 *Everything you consider "Best Practices" is mandatory to implement ("We LOVE testing")*

### First step 🌟

Create a REST API that allows you to perform CRUD operations for a "Customer" entity with the minimum attributes that you think an online shop selling motorbikes should store.

Once the CRUD operations has been done, create an specific method to add an "available credit" to customers.

Finally, this API needs a method that allows list all customers and sorting them by "available credit". (As we promised, it won't take you too long 😆)

### Second step

We got the service running and working as expected! 🚀

Let's deploy it. What's the fun of developing something if no one can access it?

At TaxDown we use the serverless framework [https://serverless.com/](https://serverless.com/). If you are comfortable with it or want to learn, go for it! Otherwise, use whatever you feel comfortable with, but please remember that we should be able to clone the repo and replicate the environment.

👂 *Psst, remember to include instructions on how to deploy it*

### Third step

Prepare to be asked a lot of questions on your choices 😆

And last but not least, it would be great if you add tests. Easy and simple no? So we are done!

## What will you value? 👌

Some of the things we would like to find in your solution (not necessarily all) are:

- SOLID
- API Design
- Testing
- DDD
- Hexagonal
- Serverless

## How can I share my solution? 🔥

I guess you used Git all the way here and made a few commits already, so how about creating a private repo and inviting us [Thomas Trujillo](https://github.com/tjtrujillo)

This way, we can review your code and have it at hand for the next step, a personal interview! 👻

Good luck with the challenge! Enjoy it and do your best!

# Requirements

Please read the [Requirements](/docs/REQUIREMENTS.md) document for details.

# Installation

For installation instructions, see the [Installation Guide](/docs/INSTALL.md).

# Usage

Check the [Usage Guide](/docs/USAGE.md) for information on using the API.

## Test Coverage

The following coverage results represent the integration test suite (`src/tests/integration/interfaces/controllers/CustomerController.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 84.48%    | 54.54%   | 100%    | 84.48%|
| **Integration Tests** | 55.52%  | 56.25%   | 57.27%    | 56.58%|

The following coverage results represent the integration test suite (`src/tests/integration/interfaces/controllers/CustomerControllerLambda.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 61.22%    | 9.09%   | 70%    | 61.22%|
| **Integration Tests** | 32.91%  | 17.18%   | 36.36%    | 33.33%|

The following coverage results represent the integration test suite (`src/tests/unit/application/CustomerService.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 100%   | 100%    | 100%|
| **Integration Tests** | 23.11%  | 15.62%   | 25.45%    | 23.77%|

The following coverage results represent the integration test suite (`src/tests/unit/infrastructure/persistence/repositories/MongoDBCustomerRepository.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 85.41%    | 80%   | 76.92%    | 85.41%|
| **Integration Tests** | 21.35%  | 12.5%   | 20%    | 21.96%|

The following coverage results represent the integration test suite (`src/tests/unit/infrastructure/persistence/repositories/InMemoryCustomerRepository.test`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 85.71%    | 100%   | 78.57%    | 89.47%|
| **Integration Tests** | 14.82%  | 7.81%   | 19.09%    | 14.98%|

The following coverage results represent the integration test suite (`src/tests/unit/domain/Customer.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 0%   | 100%    | 100%|
| **Integration Tests** | 12.31%  | 0%   | 13.63%    | 12.66%|

The following coverage results represent the integration test suite (`src/tests/unit/exceptions/CustomerNotFoundException.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 0%   | 100%    | 100%|
| **Integration Tests** | 0.75%  | 0%   | 0.9%    | 0.77%|

The following coverage results represent the integration test suite (`src/tests/unit/exceptions/EmailAlreadyInUseException.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 0%   | 100%    | 100%|
| **Integration Tests** | 0.75%  | 0%   | 0.9%    | 0.77%|

The following coverage results represent the integration test suite (`src/tests/unit/exceptions/InvalidEmailFormatException.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 0%   | 100%    | 100%|
| **Integration Tests** | 0.75%  | 0%   | 0.9%    | 0.77%|

The following coverage results represent the integration test suite (`src/tests/unit/exceptions/InvalidSortOrderException.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 0%   | 100%    | 100%|
| **Integration Tests** | 0.75%  | 0%   | 0.9%    | 0.77%|

The following coverage results represent the integration test suite (`src/tests/unit/exceptions/InvalidTypeException.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 0%   | 100%    | 100%|
| **Integration Tests** | 0.75%  | 0%   | 0.9%    | 0.77%|

The following coverage results represent the integration test suite (`src/tests/unit/exceptions/NameTooShortException.test.ts`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 0%   | 100%    | 100%|
| **Integration Tests** | 0.75%  | 0%   | 0.9%    | 0.77%|

The following coverage results represent the integration test suite (`src/tests/unit/exceptions/NegativeCreditAmountException.test`):

| Test Type            | Statements | Branches | Functions | Lines |
|----------------------|------------|----------|-----------|-------|
| **Unit Tests** | 100%    | 0%   | 100%    | 100%|
| **Integration Tests** | 0.75%  | 0%   | 0.9%    | 0.77%|

> Detailed coverage results can be found in the `coverage` folder generated after running tests.
