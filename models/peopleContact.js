const mongoose = require('mongoose')


mongoose.set('strictQuery',false)


const url = process.env.MONGODB_URL

mongoose.connect(url)
.then((result)=>{
    console.log("connected to database successfully")
})
.catch((error)=>{
    console.log("couldn't connect to the database")
})


const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: Number,
        required: true,
        validate:{
            validator:(value)=> {
                if(value.toString().length !== 10 ){
                    throw new Error(`contact length must be 11 but you provided ${value.toString().length}`)
                }
                return true 
            },
           
        }
    }
})

function capitalizeFirstChar(str){
    // text.split(" ") turns strings into an array also considering the space between them (" ") e.g input "damilola jibowu" output ["damilola", "jibowu"] 
    return str.split(" ").map((ele)=>{
      return ele.charAt(0).toUpperCase() + ele.slice(1)
      // join(" ") turns content of an array to single a string having also considering the space in between them (" ")
    }).join(" ")
}

 phonebookSchema.set('toJSON',{
    transform:((document,newDocument)=>{
        newDocument.id = newDocument._id.toString()
        newDocument.name = capitalizeFirstChar(newDocument.name)
        newDocument.number = `0${newDocument.number.toString()}`
        delete newDocument._id
        delete newDocument.__v
    })
})

module.exports =  mongoose.model('Person',phonebookSchema)












