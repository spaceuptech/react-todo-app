import { API, cond, and } from 'space-api';

class Service {
  constructor(projectId, url) {
    this.api = new API(projectId, url);
    this.db = this.api.Mongo();
  }

  async login(username, pass) {
    // Fire the sign in request
    const res = await this.db.signIn(username, pass);

    // Check if login was successfull
    if (res.status !== 200) {
      return { ack: false };
    }

    // Set the token with the API object for authentication
    this.api.setToken(res.data.token);

    // Store the userId for further operation
    this.userId = res.data.user._id;

    return { ack: true };
  }

  async signUp(username, name, pass) {
    // Fire the sign up request
    const res = await this.db.signUp(username, name, pass, 'default');

    // Check if sign up was successfull
    if (res.status !== 200) {
      return { ack: false };
    }

    // Set the token with the API object for authentication
    this.api.setToken(res.data.token);

    // Store the userId for further operation
    this.userId = res.data.user._id;

    return { ack: true };
  }

  async addTodo(value) {
    const obj = { _id: this.generateId(), value: value, isCompleted: false, userId: this.userId }

    // Fire the insert query
    const res = await this.db.insert('todos').doc(obj).apply();

    // Return -ve ack is status code isn't 200
    if (res.status !== 200) {
      return { ack: false };
    }

    return { ack: true, doc: obj };
  }

  async deleteTodo(id) {
    const condition = and(cond('_id', '==', id), cond('userId', '==', this.userId));

    // Fire the query to delete the todo
    const res = await this.db.delete('todos').where(condition).apply()

    // Return -ve ack is status code isn't 200
    if (res.status !== 200) {
      return { ack: false };
    }

    return { ack: true };
  }

  async updateTodo(id, isCompleted) {
    const condition = and(cond('_id', '==', id), cond('userId', '==', this.userId));

    // Fire the query to update the todo
    const res = await this.db.update('todos').set({ isCompleted: isCompleted }).where(condition).apply()

    // Return -ve ack is status code isn't 200
    if (res.status !== 200) {
      return { ack: false };
    }

    return { ack: true };
  }

  async getTodos() {
    const condition = cond('userId', '==', this.userId);

    // Fire the query to get the todos
    const res = await this.db.get('todos').where(condition).apply()

    // Return -ve ack is status code isn't 200
    if (res.status !== 200) {
      return { ack: false };
    }

    return { ack: true, todos: res.data.result };
  }

  generateId = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}

export default Service