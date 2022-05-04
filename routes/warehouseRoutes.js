const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//
// Write code here
//
// get collection of warehouses
router.get("/", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf-8", (err, data) => {
    const warehousesData = JSON.parse(data);
    if (err) {
      res.status(400).send("Error reading file");
    } else {
      res.json(warehousesData);
    }
  });
});

// Returns data for a specific warehouse by a given ID
router.get("/:id", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(501).send("Error reading data file.");
    } else {
      const warehousesData = JSON.parse(data);
      const reqWarehouse = warehousesData.find((warehouse) => {
        return warehouse.id === req.params.id;
      });
      // console.log(reqWarehouse);
      if (reqWarehouse) {
        res.status(201).json(reqWarehouse);
      } else {
        res.status(404).json({
          message: "No warehouse with that id exists",
        });
      }
    }
  });
});

router.post("/", (req, res) => {
  const newWarehouse = {
    id: uuidv4(),
    name: req.body.whname,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact: {
      name: req.body.name,
      position: req.body.position,
      phone: req.body.phone,
      email: req.body.email,
    },
  };
  fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).send("Internal server error");
    } else {
      const warehousesData = JSON.parse(data);
      warehousesData.unshift(newWarehouse);
      fs.writeFile(
        "./data/warehouses.json",
        JSON.stringify(warehousesData),
        () => {
          res.send("Warehouse has been added");
        }
      );
    }
  });
});

router.put("/:id", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).send("Internal Server Error");
    } else {
      const whData = JSON.parse(data);
      const id = whData.findIndex((warehouse) => {
        return warehouse.id === req.params.id;
      });
      if (id >= 0) {
        whData[id]["name"] = req.body.whname;
        whData[id]["address"] = req.body.address;
        whData[id]["city"] = req.body.city;
        whData[id]["country"] = req.body.country;
        whData[id]["contact"]["name"] = req.body.name;
        whData[id]["contact"]["position"] = req.body.position;
        whData[id]["contact"]["phone"] = req.body.phone;
        whData[id]["contact"]["email"] = req.body.email;
        fs.writeFile(
          "./data/warehouses.json",
          JSON.stringify(whData),
          () => {
            res.send("Warehouse has been updated");
          }
        );
      } else {
        res.status(404).send("This warehouse does not exist in the database")
      }

    }
  });
});

// Read the json data, filter out the id that matches the id of the requested warehouse that the user wishes to delete. 
// then write the new file with the updated data, making sure to filter any inventory
// items with that particular deleted warehouse's id and write those changes back into data
router.delete("/:id", (req,res)=>{
  fs.readFile('./data/warehouses.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
      res.status(400).send(`Internal server Error`)
    } else {
      const warehousesData = JSON.parse(data);
      const updatedWarehouseData = warehousesData.filter((warehouse) => {
        return warehouse.id !== req.params.id});
      fs.writeFile(
        "./data/warehouses.json",
        JSON.stringify(updatedWarehouseData), 
        () => {
          
        }
      );

      fs.readFile("./data/inventories.json", "utf8", (_err, _data) => {
        if (_err) {
          res.status(500).send("Internal server Error");
        } else {
          const inventoryData = JSON.parse(_data);
          const updatedInventoryData = inventoryData.filter((inventory) => {
            return inventory.warehouseID !== req.params.id;
          });
          fs.writeFile(
            "./data/inventories.json",
            JSON.stringify(updatedInventoryData),
            () => {
              res.json(updatedWarehouseData);
            }
          );
        }
      });
    }
  });
});


module.exports = router
