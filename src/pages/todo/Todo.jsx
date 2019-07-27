import React, { useState, useEffect } from 'react'
import './todo.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Todo() {
  const [value, setValue] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    // Acts as ComponentDidMount
  }, [0]);

  const addTodo = () => {
    setList(list.concat({ _id: value, value, isCompleted: false }))
    setValue('')
  }

  const deleteTodo = id => {
    setList(list.filter(todo => todo._id !== id));
  }

  const updateTodo = todo => {
    setList(list.map(t => {
      if (t._id !== todo._id) return t
      return Object.assign({}, t, { isCompleted: !todo.isCompleted})
    }))
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
