const mongoose = require('mongoose')


mongoose.set('strictQuery',false)


const url = process.env.MONGODB_URL

mongoose.connect(url)
.then((result)=>{
    console.log("connected to database successfully")
})
.catch((error)=>{
    console.log("couldn't connect to the database", error)
})


const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: Number,
        maxLength: 11,
        minLength: 11,
        required: true
    }
})

 phonebookSchema.set('toJSON',{
    transform:((document,newDocument)=>{
        newDocument.id = newDocument._id.toString()
        delete newDocument._id
        delete newDocument.__v
    })
})

module.exports =  mongoose.model('Person',phonebookSchema)












