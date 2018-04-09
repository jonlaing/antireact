const dom = AntiReact.dom;

const foobar = x => x % 2 === 0 ? "Foo" : "Bar";

const TestComponent = ({ name }) =>
  dom('div', { style: { backgroundColor: 'green' }},
    dom('h1', { style: { color: 'white' }}, name));


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

AntiReact.createApp(dom(TestStateful), document.body);