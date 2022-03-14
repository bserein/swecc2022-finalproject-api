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

app.get("/cars", getCars)
app.get("/cars/:id", getSingleCar)
app.get("/cars/addcar", getNewCars)
app.post("/cars/addcar", createCar);
app.patch("/cars/:id", updateCars)


app.listen(PORT, () => {
    console.log('Listening on PORT: ', PORT)
});