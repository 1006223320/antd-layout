export const fetchTodos = () => ({
  url: 'https://api2.diandianyy.com/todo/rest/user?limit=10',
  update: {
    todos: (oldValue, newValue) => {
      return newValue
    },
  },
  transform: responseBody => {
    return { todos: responseBody }
  },
})
