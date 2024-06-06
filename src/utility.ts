import fs from "fs";
import path from "path";
import { ErrorType, SuccessType } from "./inventory.type";

const inventoryFilePath = path.join(__dirname, "inventory.json");

export const readInventory = (): SuccessType | ErrorType => {
  try {
    if (!fs.existsSync(inventoryFilePath)) {
      fs.writeFileSync(inventoryFilePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(inventoryFilePath, "utf-8");
    return { status: true, data: JSON.parse(data) };
  } catch (error) {
    return { status: false, message: "Failed to read file" };
  }
};

export const writeInventory = (inventory: any) => {
  try {
    fs.writeFileSync(inventoryFilePath, JSON.stringify(inventory, null, 2));
    return { status: true, message: "File write successfully" };
  } catch (error) {
    return { status: false, message: "Failed to write file" };
  }
};

export function* generateID() {
  let i = 1;
  do {
    yield i;
    i++;
  } while (true);
}
