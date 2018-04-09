const AntiReact = (function () {
  /*******************************************************************************/
  /*                               EVENTS                                        */
  /*******************************************************************************/

  /**
   * The render event manager
   */
  const renderPubSub = (() => {
    const _event = new Event('render');
    const _listener = new EventTarget();

    return ({
      listen: f => _listener.addEventListener('render', f),
      emit: () => _listener.dispatchEvent(_event)
    });
  })();


  /*******************************************************************************/
  /*                                UTILS                                        */
  /*******************************************************************************/

  /**
   * Just converting an object into a two-dimensional array
   * 
   * @param {object} obj object to convert
   */
  const pair = obj => Object.keys(obj).map(k => [k, obj[k]]);


  /**
   * Recursively applies arbitrarily nested properties to HTMLElement
   * 
   * @param {HTMLElement} $el element to change properties on
   * @param {object} props key/value pair of properties, can be nested
   */
  const _props = ($el, props) => 
    pair(props).forEach(([k, v]) => {
      if(typeof v === "object") {
        _props($el[k], v);
      } else if(typeof v === "boolean") {
        $el.setAttribute(k, v);
      } else {
        $el[k] = v;
      }
    });


  /*******************************************************************************/
  /*                               DOM                                           */
  /*******************************************************************************/
  
  /**
   * Create Virtual DOM elements
   * 
   * @param {string|Component} item Component or HTML tag
   * @param {object} props properties of element
   * @param {array} children children of element
   */
  const dom = (item, props, ...children) => 
    ({ item, props: props || {}, children })

  const createElement = (item, props) => {
    const el = document.createElement(item);

    _props(el, props);

    return el;
  }

  /**
   * Converts a component to a Virtual DOM tree by evaluating render function
   * 
   * @param {Component} component Component to convert
   * @param {object} props properties
   */
  const componentToTree = (component, props) => 
    component.render ?
      component.render(props) :
      component(props);


  /**
   * Takes an unexpanded Virtual DOM tree (as in components are still unevaulated) and
   * expands it onto a fully evaluated structure
   * 
   * @param {object} tree Virtual DOM tree
   */
  const expandTree = tree => {
    if(!tree || !tree.item) return tree;

    const el = typeof tree.item === "string" ?
      tree :
      componentToTree(tree.item, tree.props);

    if(Array.isArray(el.children)) {
      el.children = el.children.map(expandTree);
    }

    return el;
  }


  /**
   * Converts a Virtual DOM node into HTML Elements
   * 
   * @param {VirtualDOMNode} node node to be converted
   */
  const nodeToHTML = node => {
    if(typeof node === "string")
      return document.createTextNode(node);

    const $el = createElement(node.item, node.props);

    node.children
      .map(nodeToHTML)
      .forEach(child => $el.appendChild(child));

    return $el;
  }


  /*******************************************************************************/
  /*                              DIFFING                                        */
  /*******************************************************************************/

  /**
   * Check if two nodes are different
   */
  const nodeChanged = (a, b) => 
    typeof a !== typeof b ||
    typeof a === "string" && a !== b ||
    a.item !== b.item;


  /**
   * Updates the DOM by diffing
   * 
   * @param {HTMLElement} $parent Parent DOM Node
   * @param {VirtualDOMNode} newNode new Virtual DOM Node to insert
   * @param {VirtualDOMNode} oldNode old Virtual DOM Node to be replaced
   * @param {int} index current index
   */
  const updateElement = ($parent, newNode, oldNode, index = 0) => {
    if(!oldNode) {
      $parent.appendChild(nodeToHTML(newNode));
    } else if (!newNode) {
      $parent.removeChild(
        $parent.childNodes[index]
      );
    } else if (nodeChanged(newNode, oldNode)) {
      $parent.replaceChild(
        nodeToHTML(newNode),
        $parent.childNodes[index]
      );
    } else if (newNode.item) {
      const newlen = newNode.children.length;
      const oldlen = oldNode.children.length;

      for(let i = 0; i < newlen || i < oldlen; i++) {
        updateElement(
          $parent.childNodes[index],
          newNode.children[i],
          oldNode.children[i],
          i
        );
      }
    }
  }


  /*******************************************************************************/
  /*                             COMPONENTS                                      */
  /*******************************************************************************/

  /**
   * Creates a stateful component
   * 
   * @param {object} component Stateless shell that gets wrapped with statefulness
   */
  const statefulComponent = component => {
    let state = component.initialState;

    const setState = (newState) => {
      if(typeof component.state === "object") {
        Object.assign({}, component.state, newState);
      } else {
        state = newState;
      }
      renderPubSub.emit();
    }

    const dispatch = f => {
      setState(f(state));
    }

    return ({
      render(props) {
        return component.render(state, dispatch, props)
      }
    });
  };


  /*******************************************************************************/
  /*                           INITIALIZATION                                    */
  /*******************************************************************************/

  /**
   * Create your app!
   * 
   * @param {VirtualDOMElement} vdom Virtual DOM Element
   * @param {HTMLElement} $parent Parent DOM node
   */
  const createApp = (vdom, $parent) => {
    let currentTree;

    $parent.innerHTML = '';

    renderPubSub.listen(() => {
      updateElement($parent, expandTree(vdom), currentTree);
      currentTree = expandTree(vdom);
    });

    renderPubSub.emit();
  }


  return {
    dom,
    createApp,
    statefulComponent,
  };
})();