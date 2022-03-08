const express = require('express'); 
const cors = require('cors'); 
const { createUser, loginUser, getUsers } = require('./src/authenticatedUsers')
const { createCar, getCars, deleteCars, updateCars, getSingleCar } = require('./src/cars')
const PORT = process.env.PORT || 4325


const app = express();
app.use(cors());
app.use(express.json());

app.get("/users", getUsers)
app.post("/users",createUser)
app.post("/users/login", loginUser)

app.get("/cars", getCars)
app.get('/cars/:id', getSingleCar)
app.post("/cars", createCar)
app.patch('/cars/:id', updateCars)
app.delete('/cars/:id', deleteCars)


app.listen(PORT, () => {
    console.log('Listening on PORT: ', PORT)
});