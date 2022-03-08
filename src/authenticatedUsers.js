const jwt = require('jsonwebtoken')
const { connectDB } = require('./dbConnect')

exports.createUser = (request, response) => {
    if(!request.body || !request.body.email || !request.body.password) {
        response.status(400).send({
            success: false,
            message: "Invalid Request"
        })
        return
    }
    const newUser = {
        email: request.body.email.toLowerCase(), 
        password: request.body.password,
        isAdmin: false,
        userRole: 5, 
    }

    const db = connectDB()
    db.collection('users').add(newUser) 
    .then(doc => {
        const user = { 
            id: doc.id,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            userRole: newUser.userRole
        }
        const token = jwt.sign(user, 'ThisIsASecretDontShareShhh') 
        response.status(201).send({
        success: true,
        message: "Acccount Created",
        token 
      })
    })
    .catch((err) => response.status(500).send({ 
    success: false,
    message: err.message,
    error: err
  }))
}

exports.loginUser = (request, response) => {
     if(!request.body || !request.body.email || !request.body.password) {
        response.status(400).send({
            success: false,
            message: "Invalid Request"
          })
        return
      }
      const db = connectDB();
      db.collection('users')
        .where('email', '==', request.body.email.toLowerCase()) 
        .where('password', '==', request.body.password)
        .get()
            .then(snapshot => {
                if(snapshot.empty) { 
                    response.status(401).send({
                        success: false,
                        message: "Invalid email or password" 
                    })
                    return  
                }
                const users = snapshot.docs.map(doc => {
                    let user = doc.data()
                    user.id = doc.id
                    user.password = undefined
                    return user
                })
                const token = jwt.sign(users[0], 'ThisIsASecretDontShareShhh')
                response.send({
                    success: true,
                    message: "Login Sucessful",
                    token
                })
            })
            .catch(
                (err) => response.status(500).send({ 
                success: false,
                message: err.message,
                error: err
              }))
}

exports.getUsers = (request, response) => { 
    if(!request.headers.authorization) {
        return response.status(403).send({
            success: false,
            message: "No Authorization token found"
        })
    }
    const decode = jwt.verify(request.headers.authorization, 'ThisIsASecretDontShareShhh')
    console.log('NEW REQUEST BY:', decode.email)
    if(decode.userRole > 5) { //************************** */
        return response.status(401).send({
            success: false,
            message: 'NOT AUTHORIZED'
        })
    }
    const db = connectDB()
    db.collection('users')
    .get()
    .then(snapshot => {
        const users = snapshot.docs.map(doc => {
            let user = doc.data()
            user.id = doc.id
            user.password = undefined
            return user
        })
        response.send({
            success: true,
            message: "Users Returned",
            users
         })
    })
    .catch(
        (err) => response.status(500).send({ 
        success: false,
        message: err.message,
        error: err
      }))
} 