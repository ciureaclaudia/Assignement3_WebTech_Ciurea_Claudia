const express = require('express')
const { json } = require('sequelize')
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'my.db'
})

//models->structura BD
let FoodItem = sequelize.define('foodItem', {
    name : Sequelize.STRING,
    category : {
        type: Sequelize.STRING,
        validate: {
            len: [3, 10]
        },
        allowNull: false
    },
    calories : Sequelize.INTEGER
},{
    timestamps : false
})


const app = express()
app.use(express.json())

app.use((req,res,next)=>{
     next()
    
})


//Contoller-server
app.get('/create', async (req, res) => {
    try{
        await sequelize.sync({force : true})
        for (let i = 0; i < 10; i++){
            let foodItem = new FoodItem({
                name: 'name ' + i,
                category: ['MEAT', 'DAIRY', 'VEGETABLE'][Math.floor(Math.random() * 3)],
                calories : 30 + i
            })
            await foodItem.save()
        }
        res.status(201).json({message : 'created'})
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})
    }
})

//controller-server
app.get('/food-items', async (req, res) => {
    try{
        let foodItems = await FoodItem.findAll()
        res.status(200).json(foodItems)
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})        
    }
})


app.post('/food-items', async (req, res) => {
    try{

        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            res.status(400).send({message:"body is missing"})
        }else
          if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('category') || !req.body.hasOwnProperty('calories')) {
            res.status(400).send({message:"malformed request"})
        }else
        if (req.body.calories<0) {
            res.status(400).send({message:"calories should be a positive number"})
        }else {
            const obiect = await FoodItem.create({ name:req.body.name, category: req.body.category, calories: req.body.calories});
        res.status(201).send({message:"created"})
        }
   
    }
    catch(err){

        res.status(400).send({message:"not a valid category"})

    }
})

module.exports = app