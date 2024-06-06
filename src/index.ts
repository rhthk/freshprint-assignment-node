import express from "express";
import { readInventory, writeInventory } from "./utility";
import { z } from "zod";
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const ApparelItemSchema = z.object({
  name: z.string(),
  M: z
    .object({
      stock: z.number(),
      price: z.number(),
    })
    .optional(),
  S: z
    .object({
      stock: z.number(),
      price: z.number(),
    })
    .optional(),
  L: z
    .object({
      stock: z.number(),
      price: z.number(),
    })
    .optional(),
});

app.post("/vendor/insert", (req, res) => {
  try {
    const valid = ApparelItemSchema.parse(req.body);
    const inventory = readInventory();
    if (!inventory.status) return res.status(500).json(inventory);

    inventory.data = { ...inventory.data, [req.body.apparelCode]: req.body };
    writeInventory(inventory.data);

    res.send("Stock and price updated");
  } catch (error) {
    return res.status(500).send("Something went wrong!!!");
  }
});

app.post("/vendor/update", (req, res) => {
  const { apparelCode, size, stock, price } = req.body;
  if (!apparelCode || !size || stock == null || price == null) {
    return res.status(400).send("Missing required fields");
  }

  const inventory = readInventory();
  if (!inventory.status) return res.status(500).json(inventory);

  if (!inventory.data[apparelCode]) {
    inventory.data[apparelCode] = {};
  }

  inventory.data[apparelCode][size] = { stock, price };
  writeInventory(inventory.data);

  res.send("Stock and price updated");
});

// Vendor updates stock and price for multiple items
app.post("/vendor/update-multiple", (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).send("Updates should be an array");
  }

  const inventory = readInventory();
  if (!inventory.status) return res.status(500).json(inventory);

  updates.forEach((update) => {
    const { apparelCode, size, stock, price } = update;
    if (!apparelCode || !size || stock == null || price == null) {
      return res
        .status(400)
        .send("Missing required fields in one of the updates");
    }

    if (!inventory.data[apparelCode]) {
      inventory.data[apparelCode] = {};
    }

    inventory.data[apparelCode][size] = { stock, price };
  });

  writeInventory(inventory.data);

  res.send("Stock and prices updated");
});

// User checks if an order can be fulfilled
app.post("/user/check-order", (req, res) => {
  const order = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).send("Order should be an array");
  }

  const inventory = readInventory();

  if (!inventory.status) return res.status(500).json(inventory);

  let canFulfill = true;
  order.forEach((item) => {
    const { apparelCode, size, quantity } = item;
    if (!apparelCode || !size || quantity == null) {
      return res
        .status(400)
        .send("Missing required fields in one of the order items");
    }

    if (
      !inventory.data[apparelCode] ||
      !inventory.data[apparelCode][size] ||
      inventory.data[apparelCode][size].stock < quantity
    ) {
      canFulfill = false;
    }
  });

  res.send({ canFulfill });
});

// User checks the lowest cost for an order
app.post("/user/lowest-cost", (req, res) => {
  const order = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).send("Order should be an array");
  }

  const inventory = readInventory();
  if (!inventory.status) return res.status(500).json(inventory);

  let totalCost = 0;
  let canFulfill = true;
  order.forEach((item) => {
    const { apparelCode, size, quantity } = item;
    if (!apparelCode || !size || quantity == null) {
      return res
        .status(400)
        .send("Missing required fields in one of the order items");
    }

    if (
      !inventory.data[apparelCode] ||
      !inventory.data[apparelCode][size] ||
      inventory.data[apparelCode][size].stock < quantity
    ) {
      canFulfill = false;
    } else {
      totalCost += inventory.data[apparelCode][size].price * quantity;
    }
  });

  if (!canFulfill) {
    return res.status(400).send("Order cannot be fulfilled");
  }

  res.send({ totalCost });
});

process.on("uncaughtException", (error) => {
  console.log(error.message);
});

app.listen(port, () => {
  console.log(`Server started and listening on port ${port}`);
});
