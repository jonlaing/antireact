const dom = AntiReact.dom;

const foobar = x => x % 2 === 0 ? "Foo" : "Bar";

// Stateless example
const TestComponent = ({ name }) =>
  dom('div', { style: { backgroundColor: 'green' }},
    dom('h1', { style: { color: 'white' }}, name));


// Stateful example
const TestStateful = (() => {
  const handleClick = state => state + 1;

  return AntiReact.statefulComponent({
    initialState: 0,

    render(state, dispatch, props) {
      return (
        dom('div', {},
          dom(TestComponent, { name: foobar(state) }),
          dom('button', { onclick: () => dispatch(handleClick) }, "Click!"),
          dom('p', {}, `Count: ${state}`)
        )
      );
    }
  });
})();



//// TODO APPP!!!!!!!

const TodoItem = ({ onChange, onDelete, name, done }) =>
  dom('li', { style: { display: 'table-row' }}, 
    dom('input', { type: 'checkbox', checked: done, onchange: onChange(name), style: { display: 'table-cell' } }),
    dom('span', {style: { display: 'table-cell' }}, name),
    dom('button', { onclick: onDelete(name), style: { display: 'table-cell' } }, 'X')
  );




const TodoForm = ({ onChange, onSubmit, value }) =>
  dom('div', {}, 
    dom('input', { onchange: e => onChange(e), placeholder: "New Todo", value: value }),
    dom('button', { onclick: onSubmit }, "Add"));






const Todos = (() => {
  const handleDelete = name => state =>
    Object.assign({}, state, { todos: state.todos.filter(todo => todo.name !== name) });

  const handleDone = name => state => 
    Object.assign({}, state, {
      todos: state.todos.map(todo => todo.name === name ?
                Object.assign({}, todo, { done: !todo.done }) :
                todo)
    });

  const handleTextChange = e => state => 
    Object.assign({}, state, { newTodo: e.target.value });

  const handleAdd = state =>
    Object.assign({}, state, {
      todos: state.todos.concat({ done: false, name: state.newTodo }),
      newTodo: ''
    });

  return AntiReact.statefulComponent({
    initialState: {
      newTodo: '',
      todos: [
        { done: false, name: "thing" },
        { done: true, name: 'other thing' }
      ]},

    render(state, dispatch, props) {
      return (
        dom('div', {},
          dom('ul', {style: {display: 'table', width: '50%'}},
            ...state.todos.map(todo =>
              dom(TodoItem, {
                name: todo.name,
                done: todo.done,
                onChange: name => () => dispatch(handleDone(name)),
                onDelete: name => () => dispatch(handleDelete(name))
              })
            )
          ),
          dom(TodoForm, {
            value: state.newTodo,
            onChange: e => dispatch(handleTextChange(e)),
            onSubmit: () => dispatch(handleAdd)
          })
        )
      )
    }
  });

})();





AntiReact.createApp(dom(Todos), document.body);