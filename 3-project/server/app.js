const express = require("express");
const app = express();
const fs = require("fs/promises");


const PORT = 5000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    next();
  });

app.get("/employees", async (req, res) => {
  try {
    const employees = await fs.readFile("./employees.json");
    res.send(JSON.parse(employees));

  } catch (error) {
    res.status(500).send({ error });

  }

});


app.post("/employees", async (req, res) => {
  try {
    const employee = req.body;

    const listBuffer = await fs.readFile("./employees.json");
    const currentEmployees = JSON.parse(listBuffer);
    let maxEmployeeId = 1;
    if (currentEmployees && currentEmployees.length > 0) {
      maxEmployeeId = currentEmployees.reduce((maxId, currentElement) => currentElement.id > maxId ? currentElement.id : maxId, maxEmployeeId);

    }
    const newEmployee = { id: maxEmployeeId + 1, ...employee };
    const newList = currentEmployees ? [...currentEmployees, newEmployee] : [newEmployee];

    await fs.writeFile("./employees.json", JSON.stringify(newList));
    res.send(newEmployee);

  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.delete("/employees/:id", async (req, res) => {

  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile("./employees.json");
    const currentEmployees = JSON.parse(listBuffer);
    if (currentEmployees.length > 0) {
      await fs.writeFile("./employees.json", JSON.stringify(currentEmployees.filter((employee) => employee.id != id)));
      res.send({ message: `uppgift med id ${id} har tagits bort` });

    } else {
      res.status(404).send({ error: "Ingen uppgift att ta bort" });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});



app.put('/employees/:id', async (req, res) => {
  try {
    const stampEmployee = req.body.stampEmployee;
    const id = req.params.id;
    const listBuffer = await fs.readFile('./employees.json');
    const currentEmployees = JSON.parse(listBuffer);
    if (stampEmployee == true) {
      for (let i = 0; i < currentEmployees.length; i++) {
        if (currentEmployees[i]['id'] == id) {
          currentEmployees[i]['completed'] = true;
        }
      }

      await fs.writeFile('./employees.json', JSON.stringify(currentEmployees));
      res.send({ message: `Uppgift med ID nummer ${id} har uppdaterats` });
    }
    else if (stampEmployee == false) {
      for (let i = 0; i < currentEmployees.length; i++) {
        if (currentEmployees[i]['id'] == id) {
          currentEmployees[i]['completed'] = false;
        }
      }
      await fs.writeFile('./employees.json', JSON.stringify(currentEmployees));

      res.send({ message: `Uppgift med ID nummer ${id} har uppdaterats` });
    };

  }
  catch (error) {

    res.status(500).send({ error: error.stack });
  }
});




app.listen(PORT, () => console.log("Server running on http://localhost:5000"));