const express = require('express');
const app = express();
const Joi = require('joi'); // Joi is a class

app.use(express.json()); // let app use middle ware to be able to use in post

// GET request

const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'}
]

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

// get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses); //list of courses
});

// get a single course
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id)); //find method finds the course with the same id as stated in the variabel
    if (!course) return res.status(404).send('The course with the given ID was not found'); //404
    res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => { // :id is a variable we created
    // res.send(req.params); 
    res.send(req.query);
});

//----------------------------------------------------------------//

// POST request
app.post('/api/courses', (req,res) => { //add a new course
    // Validation to detect bad post

    // Defining schema
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    const result = schema.validate(req.body);

    if (result.error) return res.status(400).send(result.error.details[0].message); // 400 Bad request

    const course = {
        id: courses.length + 1,
        name: req.body.name // assume user sent name in body
    };
    courses.push(course);
    res.send(course); // Good convention
});

//-----------------------------------------------------------------//

// PUT

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id)); //find method finds the course with the same id as stated in the variabel
    if (!course) return res.status(404).send('The course with the given ID was not found'); //404

    // Validate
    const {error} = validateCourse(req.body); // let error = result.error (object destructuring)

    // If invalid, return 400 - Bad request
    if (error) return res.status(400).send(error.details[0].message); // 400 Bad request

    // Update
    course.name = req.body.name;
    
    // Return 
    res.send(course);
});


// Since validating course is used in multiple function
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return schema.validate(course);
};

//------------------------------------------------------------------//

// DELETE

app.delete('/api/courses/:id', (req,res) => {
    // Look up the course
    // 404 if not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});


// PORT from .env file to make it dynamic for each user
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`)); // a function operates when app is listening