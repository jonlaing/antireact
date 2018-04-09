AntiReact
================================================================================

The React Clone no one needed or wanted
--------------------------------------------------------------------------------

### Why?

I wanted this YouTube video about JS fatigue, and it made me wonder how hard it
would be to reinvent React using vanilla JS. Well, with a little help from a
wonderful blog post about making a Virtual DOM, and a little bit of my own
ideas on how to do a component system with state management, it turns out it's
something one can do in a few hours on a Sunday night.

### How well does it work?

I don't know... seems to work. This was just a fun experiment, so I didn't go
too hard on testing it. I might come back to it and really put it through its
paces, but at the moment, I'm pretty hyped I got it working at all.

It should go without saying that this isn't production ready at the moment,
and probably never will be. This was only made for my own sense of accomplishment
and nothing more.

### Known issues

I was too lazy to make it update on prop changes. I know that kind defeats the
purpose, but it wouldn't be too hard to add, so I'll get to it eventually.

Also, it is in ES6, so it probably won't work on older browsers.

### Usage

I guess clone it? Or copy and paste it? It's less than 300 lines, so whichever method
floats your boat. There are no external dependencies. Just what was available to me in
vanilla ES6.

So, then you'll obviously have to include it in your project however you do, whatever...
you kids and your WebPack. In my day we included dependencies via carrier pigeon, and we
were happy!

#### Stateless Component

It's just a function that takes props...

```javascript
const dom = AntiReact.dom;

const TestComponent = ({ name }) =>
  dom('div', { style: { backgroundColor: 'green' }},
    dom('h1', { style: { color: 'white' }}, name));

```

#### Stateful Component

We get a little fancier here. The `statefulComponent` helper function turns a base object into a
stateful component. A stateful component only requires an `initialState` and a `render` function.
The `render` function takes three arguments:

- *state:* The current state of the component
- *dispatch:* A Higher Order function for dispatching state changing events
- *props:* The component props

Regarding `dispatch`: The argument function for dispatch takes `state` as an argument, as you'll
see in the next example. Unlike React, you don't call `setState` yourself, you just return your
new state, and the `statefulComponent` helper takes care of the rest for you. I consider this
an immense improvement over React, and I expect a trophy any moment now.

```javascript
const TestStateful = (() => {
  const handleClick = state => state + 1;

  return AntiReact.statefulComponent({
    initialState: 0,

    render(state, dispatch, props) {
      return (
        dom('div', {},
          dom(TestComponent, { name: "My Title" }),
          dom('button', { onclick: () => dispatch(handleClick) }, "Click!"),
          dom('p', {}, `Count: ${state}`)
        )
      );
    }
  });
})();
```

#### Rendering to the DOM

I guess you kinda want your app to show up on the screen. To do that is pretty straight forward:

```javascript
AntiReact.createApp(dom(TestStateful), document.getElementById('root));
```

You might notice that I wrapped `TestStateful` in `dom`. This is because of a bug in the renderer
that I may or may not fix.


#### Contributing

Seriously?