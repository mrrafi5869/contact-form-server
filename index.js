require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("contact form server running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9t60goe.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const employeesDetails = client
      .db("employees")
      .collection("employeeDetails");
    // get employee
    app.get("/employees", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const employees = await employeesDetails
        .find(query)
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await employeesDetails.estimatedDocumentCount();
      res.send({ employees, count });
    });
    // emplyeesDetails post
    app.post("/employeeDetails", async (req, res) => {
      const query = req.body;
      const option = await employeesDetails.insertOne(query);
      res.send(option);
    });
    // update employee
    app.patch("/employee/:id", async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const employee = req.body;
      const updateEmployee = {
        $set: {
          name: employee.name,
          job: employee.job,
          phone: employee.phoneValue,
          email: employee.email,
          address: employee.address,
          city: employee.city,
          state: employee.state,
          PContact: employee.PContact,
          PPhone: employee.primaryPhoneValue,
          relation: employee.relation,
          SContact: employee.SContact,
          SPhone: employee.secondaryPhoneValue,
          SRelation: employee.SRelation
        }
      }
      const result = await employeesDetails.updateOne(filter, updateEmployee);
      console.log(employee);
      res.send(result);
    })
    // delete employee
    app.delete("/employee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const option = await employeesDetails.deleteOne(query);
      res.send(option);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`simple node server running on ${port}`);
});