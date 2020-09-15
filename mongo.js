const mongoose = require('mongoose')

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
    `mongodb://fullstack:${password}@cluster0-shard-00-00.lkwnv.mongodb.net:27017,cluster0-shard-00-01.lkwnv.mongodb.net:27017,cluster0-shard-00-02.lkwnv.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-qb479v-shard-0&authSource=admin&retryWrites=true&w=majority`

//Connect to the database
mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('Connection successful')
})


const peopleSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', peopleSchema)

//Consolelogs the elements of database if there's not enough arguements
if (process.argv.length < 5) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        });
    mongoose.connection.close()
    console.log("Connection closed")
    })
}
//Adds new element to database
else {
    const person = new Person ({
        name: personName,
        number: personNumber
    })

    person.save().then(result => {
        console.log('Added' , personName, 'number', personNumber, 'to phonebook')
        mongoose.connection.close()
        console.log("Connection closed")
    })
}