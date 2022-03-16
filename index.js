const express = require('express'); 
const cors = require('cors'); 
const { createUser, loginUser, getUsers } = require('./src/authenticatedUsers')
const { createCar, getCars, updateCars, getSingleCar, getNewCars } = require('./src/cars')
const PORT = process.env.PORT || 4325


const app = express();
app.use(cors());
app.use(express.json());

app.get("/users", getUsers)
app.post("/users",createUser)
app.post("/users/login", loginUser)

app.get("/", getCars)
app.get("/:id", getSingleCar)
app.get("/addcar", getNewCars)
app.post("/addcar", createCar);
app.patch("/:id", updateCars)


app.listen(PORT, () => {
    console.log('Listening on PORT: ', PORT)
});