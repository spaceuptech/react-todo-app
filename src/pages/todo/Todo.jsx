import React, { useState } from 'react'
import './todo.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Todo() {
  const [value, setValue] = useState('');
  const [list, setList] = useState([]);

  const addTodo = () => {
    setList(list.concat({ value, isChecked: false }))
    setValue('')
  }

  const deleteTodo = i => {
    setList(list.filter((_, j) => i !== j));
  }

  const updateTodo = index => {
    setList(list.map((item, i) => {
      if (index !== i) return item
      item.isChecked = !item.isChecked
      return item
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
        {list.map((item, index) => (
          <div key={item} className="single-todo">
            <input className="checkbox" onChange={() => updateTodo(index)} checked={item.isChecked} type="checkbox" />
            <span className="todo-item">{item.value}</span>
            <i className="material-icons delete" onClick={() => deleteTodo(index)}>delete</i>
          </div>)
        )}
      </div>
    </div>
  )
}

export default Todo
