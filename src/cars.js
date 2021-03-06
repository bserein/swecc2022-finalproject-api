const { connectDB } = require("./dbConnect");
const carsData = require("../carRef.json");

exports.createCar = (request, response) => {
    const addCar = {
        make: request.body.make,
        model: request.body.model,
        // photo: request.body.photo,
        // photo2: request.body.photo2,
        // photo3: request.body.photo3,
        // photo4: request.body.photo4,
        // description: request.body.description,
        // description2: request.body.description2,
        // description3: request.body.description3,
        // description4: request.body.description4,
        topSpeed: request.body.topSpeed,
        horsepower: request.body.horsepower,
        msrp: request.body.msrp,
        mpg: request.body.mpg,
        fuelCapacity: request.body.fuelCapacity,
        seatingCapacity: request.body.seatingCapacity,
    }

    const db = connectDB();
    db.collection("pending")
    .add(addCar)
    .then((doc) => response.status(201).send(doc.id))
    .catch((err) => response.status(500).send(err))
    // for (let i = 0; i < carsData.length; i++) {
    //     const db = connectDB();
    //     db.collection("pending")
    //       .add(carsData[i])
    //       .then((doc) => {
    //           console.log(`cars added: ${doc.id}`)
    //       })
    //       .catch(err => console.error(err))
    //   }
}


exports.getNewCars = (request, response) => {
    const db = connectDB();
    db.collection("pending")
    .get()
    .then((snapshot) => {
        const newCars = snapshot.docs.map((doc) => {
            let car = doc.data();
            car.id = doc.id;
            return car 
        })
        response.send(newCars)
    })
    .catch((err) => response.status(500).send(err))
}
exports.getCars = (request, response) => {
    const db = connectDB();
    db.collection("cars")
    .get()
    .then((snapshot) => {
        const carList = snapshot.docs.map((doc) => {
            let car = doc.data();
            car.id = doc.id;
            return car 
        })
        response.send(carList)
    })
    .catch((err) => response.status(500).send(err))
}

exports.updateCars = (request, response) => {
    const db = connectDB();
    db.collection('cars')
    if (request.body.rating && request.params.id) {
      db.collection('cars')
        .doc(request.params.id)
        .get()
        .then(doc => {
          const newRating = Number(request.body.rating)
          let newRatings = doc.data().ratings || []
          newRatings.push(newRating)
          const newCount = newRatings.length
          const newRatingsSum = newRatings.reduce((accum, curr) => accum + curr, 0)
          const newAvgRating = newRatingsSum / newCount
          const newRatingObj = {
            ratings: newRatings,
            averageRating: newAvgRating,
            numberOfRatings: newCount,
          }
          db.collection('cars')
            .doc(request.params.id)
            .update(newRatingObj)
            .then(() => {
              response.status(200).send({message: `car ${request.params.id} was updated`})
            })
        })
        .catch(err => response.status(500).send(err))
    } else {
      db.collection('cars')
        .doc(request.params.id)
        .update(request.body)
        .then(() => {
          getCars(request, response)
        })
        .catch(err => response.status(500).send(err))
    }
  }
  
  exports.getSingleCar = (request, response) => {
      const db = connectDB();
    db.collection('cars')
      .doc(request.params.id)
      .get()
      .then(doc => {
        if (doc.exists) {
          response.send(doc.data())
        } else {
          response.status(404).send('No such document!')
        }
      })
      .catch(err => response.status(500).send(err))
  }
