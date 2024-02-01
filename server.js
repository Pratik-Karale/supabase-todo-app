// server.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 5000;

app.use(express.json());

// Create a list
app.post('/lists', async (req, res) => {
  const { name } = req.body;

  const newList = await prisma.list.create({
    data: {
      name,
    },
  });

  res.json(newList);
});

// Get all lists
app.get('/lists', async (req, res) => {
  const lists = await prisma.list.findMany();
  res.json(lists);
});

// Get all todos in a list
app.get('/lists/:listId/todos', async (req, res) => {
  const { listId } = req.params;

  const todos = await prisma.todo.findMany({
    where: { listId: parseInt(listId) },
  });

  res.json(todos);
});

// Add a todo to a list
app.post('/lists/:listId/todos', async (req, res) => {
  const { listId } = req.params;
  const { name } = req.body;

  const newTodo = await prisma.todo.create({
    data: {
      name,
      List: {
        connect: { id: parseInt(listId) },
      },
    },
  });

  res.json(newTodo);
});

// Set todo isDone state
app.patch('/todos/:todoId', async (req, res) => {
  const { todoId } = req.params;
  const { isDone } = req.body;
  const updatedTodo = await prisma.todo.update({
    where: { id: parseInt(todoId) },
    data: {
      isDone:(isDone==='true'),
    },
  });

  res.json(updatedTodo);
});

// Delete a list
app.delete('/lists/:listId', async (req, res) => {
  const { listId } = req.params;

  await prisma.list.delete({
    where: { id: parseInt(listId) },
  });

  res.json({ message: 'Success' });
});

// Delete a todo
app.delete('/todos/:todoId', async (req, res) => {
  const { todoId } = req.params;

  await prisma.todo.delete({
    where: { id: parseInt(todoId) },
  });

  res.json({ message: 'Success' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
