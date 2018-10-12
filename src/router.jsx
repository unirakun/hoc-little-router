import React from 'react'

const getDisplayName = Component => `router(${
  Component.displayName
  || Component.name
  || (Component.constructor && Component.constructor.name)
  || 'Unknown'
})`

const isRouteFound = title => result => result && [].concat(title).includes(result.title)

const hoc = (title, options) => Component => class extends React.Component {
  static displayName = getDisplayName(Component)

  static contextTypes = {
    store: () => null, // this is to avoid importing prop-types
  }

  constructor(props, context) {
    super(props, context)

    this.state = { show: false }
  }

  componentWillMount() {
    const { store } = this.context

    // subscribe
    this.unsubscribe = store.subscribe(() => {
      this.toShow()
    })

    // run in once
    this.toShow()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  toShow = () => {
    const { store } = this.context

    const state = store.getState()

    if (!state.router || !state.router.result) {
      // eslint-disable-next-line no-console
      console.error('/HOC/ Router | There is no route found in `state.router.result`')
      return
    }

    // Absolute mode, we are looking in top level only
    let { result } = state.router
    if (options && options.absolute) {
      const show = isRouteFound(title)(result)
      if (show !== this.state.show) { // eslint-disable-line react/destructuring-assignment
        this.setState(innerState => ({ ...innerState, show }))
      }

      return
    }

    // Either way we are looking top down the result tree
    let show = isRouteFound(title)(result)
    while (result && !show) {
      result = result.parent
      show = isRouteFound(title)(result)
    }

    if (show !== this.state.show) { // eslint-disable-line react/destructuring-assignment
      this.setState(innerState => ({ ...innerState, show }))
    }
  }

  render() {
    const { show } = this.state

    if (!show) return null

    return <Component {...this.props} />
  }
}

hoc.absolute = (title, options) => hoc(title, { ...options, absolute: true })

export default hoc
