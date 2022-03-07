const {initializeApp, cert, getApps} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')
const credentials = require('../credentials.json')

exports.connectDB = () => {
    if(!getApps().length){
        initializeApp({
            credential: cert(credentials)
        });
    }
    return getFirestore();
}
