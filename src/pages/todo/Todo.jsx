import React, { Component } from 'react'
import './todo.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Todo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      list: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange = event => this.setState({ value: event.target.value });

  onAddItem = () => {
    this.setState(state => {
      const list = state.list.concat({ value: state.value, isChecked: false });
      return {
        value: '',
        list,
      };
    });
  };

  onRemoveItem = i => {
    this.setState(state => {
      const list = state.list.filter((_, j) => i !== j);
      return {
        list,
      };
    });
  }

  toggleCheckbox = index => {
    this.setState(state => {
      const list = state.list.map((item, i) => {
        if (index !== i) return item
        item.isChecked = !item.isChecked
        return item
      })
      return {
        list
      }
    })
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.setState(state => {
        const list = state.list.concat({ value: state.value, isChecked: false });
        return {
          value: '',
          list,
        };
      });
    }
  }

  render() {
    return (
      <div className="todo-app">
        <div className="add-todo">
          <Link to="/">
            <i class="material-icons">arrow_back</i>
          </Link>
          <h2>To-do App</h2>
          <span>Add a task:</span>
          <input type="text" value={this.state.value} onChange={this.handleChange} onKeyDown={this.handleKeyDown}></input>
          <button type="button" onClick={this.onAddItem} disabled={!this.state.value}>Add</button>
        </div>
        <div>
          {this.state.list.map((item, index) => (
            <div key={item} className="single-todo">
              <input className="checkbox" onChange={() => this.toggleCheckbox(index)} checked={item.isChecked} type="checkbox" />
              <span className="todo-item">{item.value}</span>
              <i className="material-icons delete" onClick={() => this.onRemoveItem(index)}>delete</i>
            </div>)
          )}
        </div>
      </div>
    )
  }
}

export default Todo
