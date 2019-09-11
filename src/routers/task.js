const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body); replaced when auth added
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
    /* task.save().then(() => {
        res.status(201).send(task);
    }).catch((e) => {
        res.status(400).send(e);
    }); */
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {},
          sort = {};

    if(req.query.completed){
        //the statement below is setting the value of match.completed to the answer of the question if 
        //req.query.completed === 'true', so if this is true then match.completed = true, or viceversa
        match.completed = req.query.completed === 'true';//needed to provide a boolean  instead of a string
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc'? 1 : -1;
    }
    try {
        //const tasks =  await Task.find({ owner: req.user._id, completed: false });
        //const tasks = await Task.find({});
        await req.user.populate({
                path: 'userTasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }).execPopulate(); 
            res.send(req.user.userTasks); 
            
        //res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
    /* Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((e) => {
        res.status(500).send(e);
    }); */
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        
        const task = await Task.findOne({ _id, owner: req.user._id });

        if(!task){
            return res.status(404).send('Invalid ID, Task not found!');
       }
       res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid Update!' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        
        if(!task){
           return res.status(404).send('Invalid ID, Task not found!');
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send('Task not Found!');
        }
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});


module.exports = router;