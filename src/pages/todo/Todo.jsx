import React, { useState, useEffect } from 'react'
import './todo.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import client from '../../client';

function Todo() {
  const [value, setValue] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    // Acts as ComponentDidMount
    const subscription = client.getTodos(setList)

    return () => subscription.unsubscribe()
  }, [0]);

  const addTodo = () => {
    client.addTodo(value).then(res => {
      if (!res.ack) {
        alert('Could not add todo');
        return;
      }

      setValue('')
    })
  }

  const deleteTodo = id => {
    client.deleteTodo(id).then(res => {
      if (!res.ack) {
        alert('Could not delete todo');
        return;
      }
    })
  }

  const updateTodo = todo => {
    client.updateTodo(todo._id, !todo.isCompleted).then(res => {
      if (!res.ack) {
        alert('Could not update todo');
        return;
      }
    })
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <div className="todo-app">
      <div className="add-todo">
        <Link to="/">
          <i class="material-icons">arrow_back</i>
        </Link>
        <h2>To-do App</h2>
        <div class="todo-flex">
          <div>Add a task:</div>
          <div class="todo-flex">
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleEnter}></input>
            <button type="button" onClick={addTodo} disabled={!value}>Add</button>
          </div>
        </div>
      </div>
      <div>
        {list.map((item) => (
          <div key={item._id} className="single-todo">
            <input className="checkbox" onChange={() => updateTodo(item)} checked={item.isCompleted} type="checkbox" />
            <span className="todo-item">{item.value}</span>
            <i className="material-icons delete" onClick={() => deleteTodo(item._id)}>delete</i>
          </div>)
        )}
      </div>
    </div>
  )
}

export default Todo
