const { connectDB } = require("./dbConnect");

exports.createCar = (request, response) => {
    const addCar = {
        make: request.body.make,
        model: request.body.model,
        photo: request.body.photo,
        description: request.body.description,
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

  exports.deleteCars = (request, response) => {
      const db = connectDB();
    db.collection('cars')
      .doc(request.params.id)
      .delete()
      .then(() => {
        this.getCars(request, response)
      })
      .catch(err => response.status(500).send(err))
  }