/********************************************************************************* 
*  WEB322 – Assignment 3 
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.   
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including web sites) or distributed to other students. 
*  
*  Name: ________Pratham Garg______________ Student ID: ___117900217___________ Date: _______30-11-2022_________
********************************************************************************/


const express = require('express')

const app = express()

//set the view engine as ejs to use ejs file

app.set('view engine', 'ejs')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))

// require mongoose for connection to mongodb

const mongoose = require('mongoose')

//connect to mongodb

mongoose.connect("mongodb+srv://seneca_pratham:GcUrq-cX85pWKSV@cluster0.mm22pii.mongodb.net/smart_drivers?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error) => {
        if (error) {
            console.log("Mongodb is not connected due to the error below!")
            console.log(error)
        }
        else {
            console.log("Mongodb is connected successfully")
        }
    })

// create schema for driver model

const driverSchema = mongoose.Schema({
    dID: Number,
    name: String,
    route: String,
    month: String,
    visits: Number,
    salary: Number
})

//create Model

const driverModel = mongoose.model("driver", driverSchema)



//create a route to display the form in insert.ejs
app.get("/insert", (req, res) => {
    res.render("insert.ejs")
})

app.post('/insert', (req, res) => {
    //to get the form data out of request body we need body parser
    // require bodypaeser and use one of its features before using request body
    const driver_data_from_form = req.body;
    console.log(driver_data_from_form);

    //to save this data data in mongodb we create connectin ,schema and then model
    //having same fields name, route, month, visits, salary

    driverModel.create({
        dID: driver_data_from_form.d_ID,
        name: driver_data_from_form.d_name,
        route: driver_data_from_form.d_route,
        month: driver_data_from_form.d_month,
        visits: driver_data_from_form.d_visit,
        salary: driver_data_from_form.d_slry
    }, (error, driver_Added) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log("Driver inserted to Mongodb!!!")
            res.redirect("/all")
        }
    }
    )

})

app.get('/all', (req, res) => {
    driverModel.find({}, (error, allDriver) => {
        if (error) {
            console.log(error)
        }
        else {
            res.render("display.ejs", { data: allDriver })
        }
    })
})

app.get('/edit/:id', (req, res) => {
    const id_to_edit = req.params.id
    driverModel.findById(id_to_edit, (error, driver_to_edit) => {
        if (error) {
            console.log(error)
        }
        else {
            res.render("edit.ejs", { driver: driver_to_edit })
        }
    })
})

app.post('/edit/:id', (req, res) => {
    const id = req.params.id
    const updated_driver = req.body

    driverModel.findByIdAndUpdate(id, {
        dID: updated_driver.d_ID,
        name: updated_driver.d_name,
        route: updated_driver.d_route,
        month: updated_driver.d_month,
        visits: updated_driver.d_visit,
        salary: updated_driver.d_slry
    }, (error, updated_driver) => {
        if (error) {
            console.log(error)
        }
        else {
            res.redirect('/all')
        }
    })
})

app.get("/delete/:id", (req, res) => {
    const id = req.params.id
    driverModel.findByIdAndDelete(id, (error, driverDeleted) => {
        if (error) {
            console.log(error)
        }
        else {
            res.redirect('/all')
        }
    })
})

app.listen(5000, () => {
    console.log("*******App is listening at port 5000*******")
})