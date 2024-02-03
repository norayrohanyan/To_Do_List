import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const todoSchema = mongoose.Schema({
    value: { type: String, required: true },
    isChecked: { type: Boolean, default: false },
});

  const Todo = mongoose.model("Todo", todoSchema);
const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/todo');
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}

app.post('/todos', async (req, res) => {
    try {
      const { value, isChecked } = req.body;
      const todo = new Todo({ value, isChecked });
      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.status(200).json(todos);
})


app.patch('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { value, isChecked } = req.body;
        const todo = await Todo.findByIdAndUpdate(id, { 
            ...(value && { value }), 
            ...(isChecked !== undefined && { isChecked }),
            }, { new: true }
        );

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


start();