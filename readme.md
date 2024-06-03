# Invoice Generation Service

This service generates PDF invoices based on provided data and serves them via a URL.

## Features

- Generates PDF invoices with customizable details.
- Saves invoices in a public directory.
- Provides a URL to access the generated PDF.

## Prerequisites

- Node.js
- npm, yarn, or pnpm

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/invoice-service.git
    cd backend
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

## Configuration

Ensure you have a `public/assets` directory with the necessary images, such as the company logo.

## Usage

### Starting the Server

Start the server using one of the following commands:
```sh
npm start
# or
yarn start
# or
pnpm start
