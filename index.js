const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()


morgan.token('body',(req,res)=>{
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(morgan(':method :url :status :response-time ms - :body'))

app.use((request,response,next)=>{
  request.requestDate = new Date().toUTCString()
  next()
})

let persons = [
    { 
      "id": 1,
      "name": "Arto Hella", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

function createNewId(){
  return randomNum = Math.floor(Math.random()* 1555)
}

app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find((ele)=>ele.id === id)
    if(!person){
      response.statusMessage = `the id ${id} not present`
      response.status(404).end(`the id ${id} not present`)
    }else{
      response.send(person)
      console.log(person)
    }
})

app.delete('/api/persons/:id',(request,response)=>{
  const id = Number(request.params.id)
  const newList = persons.filter(ele=>ele.id !== id)
  persons = newList
  console.log(persons)
  response.status(204).end()
})
app.post('/api/persons',(request,response)=>{
    const body = request.body

    if(!body.name || !body.number){
      return response.status(400).json({
        error: "a field is missing in the data entered"
      })
    }
    if(persons.some(ele=>ele.name.includes(body.name)&&ele.number.includes(body.number))){
      return response.status(400).json({
        error: "name must be unique"
      })
    }

    const newEntries ={
      id: createNewId(),
      name: body.name,
      number: body.number
    }
    
    persons.push(newEntries)
    console.log(persons) 
})
app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/api/info',(request,response)=>{
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${request.requestDate}</p></div>`)
})

const PORT = 3002

app.listen(PORT,()=>{
    console.log("server running on port 3002")
})