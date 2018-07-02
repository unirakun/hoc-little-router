import React from 'react'
import dynamic from './dynamic'

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
    // subscribe
    this.unsubscribe = this.context.store.subscribe(() => {
      this.toShow()
    })

    // run in once
    this.toShow()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  toShow = () => {
    const state = this.context.store.getState()

    if (!state.router || !state.router.result) {
      // eslint-disable-next-line no-console
      console.error('/HOC/ Router | There is no route found in `state.router.result`')
      return
    }

    // Absolute mode, we are looking in top level only
    let { result } = state.router
    if (options && options.absolute) {
      const show = isRouteFound(title)(result)
      if (show !== this.state.show) {
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

    if (show !== this.state.show) {
      this.setState(innerState => ({ ...innerState, show }))
    }
  }

  render() {
    if (!this.state.show) return null

    const RouteComponent = options && options.dynamic ? dynamic(Component) : Component
    return <RouteComponent {...this.props} />
  }
}

hoc.absolute = (title, options) => hoc(title, { ...options, absolute: true })

hoc.dynamic = (title, options) => hoc(title, { ...options, dynamic: true })

export default hoc
