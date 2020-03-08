import { API, cond, and } from 'space-api';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import gql from 'graphql-tag';

const initGraphQLClient = (httpURL, websocketURL) => {
  // Create an http link for GraphQL client:
  const httpLink = new HttpLink({
    uri: httpURL
  });

  // Create a WebSocket link for GraphQL client:
  const wsLink = new WebSocketLink({
    uri: websocketURL,
    options: {
      reconnect: true
    }
  });


  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }

  // Create a GraphQL client:
  const graphQLClient = new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: link,
    defaultOptions: defaultOptions
  });

  return graphQLClient
}


class Service {
  constructor(projectId, spaceAPIURL, graphqlHTTPURL, graphqlWebsocketURL) {
    this.api = new API(projectId, spaceAPIURL);
    this.graphQLCLient = initGraphQLClient(graphqlHTTPURL, graphqlWebsocketURL)
    this.db = this.api.DB("mongo");
    this.todos = []
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

  getTodos(cb) {
    return this.graphQLCLient.subscribe({
      query: gql`subscription {
        todos(where: {userId: {_eq: "${this.userId}"}}) @mongo{
          type
          payload
        }
      }`,
      variables: { userId: this.userId }
    }).subscribe(({ data }) => {
      console.log("Subscription", data)
      const { todos, find } = data
      const { payload, type } = todos

      switch (type) {
        case "initial":
        case "insert":
          this.todos = ([...this.todos, payload])
          break;
        case "update":
          this.todos = ([...this.todos.filter(obj => obj._id !== find._id), payload])
          break
        case "delete":
          this.todos = (this.todos.filter(obj => obj._id !== find._id))
          break
      }
      cb(this.todos)
    })
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