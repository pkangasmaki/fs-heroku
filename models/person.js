const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI

//Connect to the database
mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const peopleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8
    }
})

peopleSchema.plugin(uniqueValidator)

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);

peopleSchema.set('toJSON', {
    transform: (doc,ret,options) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', peopleSchema)