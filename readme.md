# Apparel Store Inventory Management

This is an Express.js application that allows vendors to update stock and price information for apparel items and allows users to check if an order can be fulfilled and the lowest cost at which an order can be fulfilled.

## Features

- **Vendor**

  - Update the stock quantity and price of a single apparel item.
  - Simultaneously update the stock quantity and price of multiple apparel items.

- **User**
  - Check if an order can be fulfilled based on the current stock.
  - Get the lowest cost to fulfill an order.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rhthk/freshprint-assignment-node.git
   cd freshprint-assignment-node
   docker build -t fresh-print-node-api .
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run application:
   ```
   npm start
   ```

## API Endpoints

### Vendor Endpoints

#### Update single item:

- URL: /vendor/update
- Method: POST
- Body:
  ```json
  {
    "apparelCode": "A001",
    "size": "M",
    "stock": 100,
    "price": 25
  }
  ```
- Description: Updates the stock quantity and price for a single apparel item.

#### Update multiple item:

- URL: /vendor/update-multiple
- Method: POST
- Body:

  ```json
  [
    {
      "apparelCode": "A001",
      "size": "M",
      "stock": 100,
      "price": 25
    },
    {
      "apparelCode": "A002",
      "size": "L",
      "stock": 50,
      "price": 30
    }
  ]
  ```

- Description: Updates the stock quantity and price for multiple apparel items.

### User Endpoints

#### Check Order:

- URL: /user/check-order
- Method: POST
- Body:

  ```json
  [
    {
      "apparelCode": "A001",
      "size": "M",
      "quantity": 10
    },
    {
      "apparelCode": "A002",
      "size": "L",
      "quantity": 5
    }
  ]
  ```

- Description: Checks if an order can be fulfilled based on the current stock.

#### Get Lowest Cost:

- URL: /user/lowest-cost
- Method: POST
- Body:

  ```json
  [
    {
      "apparelCode": "A001",
      "size": "M",
      "quantity": 10
    },
    {
      "apparelCode": "A002",
      "size": "L",
      "quantity": 5
    }
  ]
  ```

- Description: Calculates the lowest cost to fulfill an order, ensuring all items are in stock.

## Inventory Storage

Inventory details are stored in a JSON file (inventory.json) in the root directory of the project. The application reads from and writes to this file to manage inventory data.
