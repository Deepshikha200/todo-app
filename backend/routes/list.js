const express = require('express');
const User = require('../model/user');
const List = require('../model/list')
const router = express.Router();


//create list 

router.post('/addTask', async (req, res) => {
  try {
    const { title, body, id } = req.body;
    const existingUser = await User.findById(id);

    if (existingUser) {
      const list = new List({ title, body, user: existingUser });
      await list.save();
      existingUser.list.push(list._id); // Pushing the list's ObjectId
      await existingUser.save();
      res.status(200).json({ list });
    }

  } catch (error) {
    console.log(error)
  }

});


//update 

router.put('/updateTask/:id', async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const list = await List.findByIdAndUpdate(req.params.id, { title, body });
      list.save().then(() => {
        res.status(200).json({ message: 'record upadted' })
      });
    }
  } catch (error) {
    console.log(error)
  }

});

//delete

router.delete('/deleteTask/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task to get the associated user
    const deletedTask = await List.findByIdAndDelete(taskId);

    if (deletedTask) {
      // Remove the task ID from the user's list array
      await User.updateOne(
        { _id: deletedTask.user },
        { $pull: { list: taskId } }
      );

      res.status(200).json({ message: 'Task deleted', taskId });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/getTask/:id", async (req, res) => {
  try {
    const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({ list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;