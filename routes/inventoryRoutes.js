const express = require("express");
const router = express.Router();
const fs = require("fs");

//Route to GET collection of inventory as array of object
router.get("/", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    const inventoriesData = JSON.parse(data);
    if (err) {
      res.status(400).send("Error reading file");
    } else {
      res.json(inventoriesData);
    }
  });
});

//Route to GET single inventory by ID
router.get("/:id", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    const inventoriesData = JSON.parse(data);
    const foundInventory = inventoriesData.find(
      (inventory) => inventory.id === req.params.id
    );
    if (foundInventory) {
      res.json(foundInventory);
    } else {
      console.log(err);
      res.status(400).send("No inventory found with this id");
    }
  });
});

// Returns a collection of inventory items associated with a warehouse ID
router.get("/warehouse/:id", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    if (err) {
      res.status(501).send("Error reading file");
    } else {
      const inventoriesData = JSON.parse(data);
      const reqInventoryData = inventoriesData.filter((item) => {
        return item.warehouseID === req.params.id;
      });
      if (reqInventoryData) {
        res.status(201).json(reqInventoryData);
      } else {
        res.status(404).json({
          message: "No warehouse with that id exists",
        });
      }
    }
  });
});

// Add a new inventory item
router.post("/", (req, res) => {
  const newInventory = {
    id: req.body.id,
    warehouseID: req.body.warehouseID,
    warehouseName: req.body.warehouseName,
    itemName: req.body.itemName,
    description: req.body.description,
    category: req.body.category,
    status: req.body.status,
    quantity: req.body.quantity,
  };
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).send("Error reading inventory datas");
    } else {
      const inventoriesData = JSON.parse(data);
      inventoriesData.push(newInventory);
      fs.writeFile(
        "./data/inventories.json",
        JSON.stringify(inventoriesData),
        () => {
          res.json("Inventory has been added");
        }
      );
    }
  });
});

//Edit an inventory item
router.put("/edit/:id", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).send("Internal Server Error");
    } else {
      const inventoryData = JSON.parse(data);
      const id = inventoryData.findIndex((inventory) => {
        return inventory.id === req.params.id;
      });
      if (id >= 0) {
        inventoryData[id]["warehouseName"] = req.body.warehouseName;
        inventoryData[id]["itemName"] = req.body.itemName;
        inventoryData[id]["description"] = req.body.description;
        inventoryData[id]["category"] = req.body.category;
        inventoryData[id]["status"] = req.body.status;
        inventoryData[id]["quantity"] = req.body.quantity;
        fs.writeFile(
          "./data/inventories.json",
          JSON.stringify(inventoryData),
          () => {
            res.send("Inventory has been updated");
          }
        );
      } else {
        res.status(404).send("This inventory does not exist in the database");
      }
    }
  });
});

router.delete("/:id", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).send("Internal server Error");
    } else {
      const inventoryData = JSON.parse(data);
      const updatedData = inventoryData.filter((inventory) => {
        return inventory.id != req.params.id;
      });
      fs.writeFile(
        "./data/inventories.json",
        JSON.stringify(updatedData),
        () => {
          res.json(updatedData);
        }
      );
    }
  });
});
module.exports = router;
