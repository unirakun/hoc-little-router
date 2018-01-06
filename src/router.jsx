import React from 'react'
import { connect } from 'react-redux'

const hoc = (title, options) => {
  const isRouteFound = result => result && [].concat(title).includes(result.title)

  // This is genrated prop name to avoid overlaping props given from parent
  const propName = `show_${title}`

  const mapStateToProps = (state) => {
    if (!state.router || !state.router.result) {
      // eslint-disable-next-line no-console
      console.error('/HOC/ Router | There is no route found in `state.router.result`')
      return {}
    }

    // Absolute mode, we are looking in top level only
    let result = state.router.result
    if (options && options.absolute) {
      return {
        [propName]: isRouteFound(result),
      }
    }

    // Either way we are looking top down the result tree
    let found = isRouteFound(result)
    while (result && !found) {
      result = result.parent
      found = isRouteFound(result)
    }

    return {
      [propName]: !!found,
    }
  }

  return Component => connect(mapStateToProps)(
    (props) => {
      if (!props[propName]) return null

      // Like omit
      // We delete this propse so the child don't see it
      const newProps = { ...props }
      delete newProps[propName]

      return <Component {...newProps} />
    },
  )
}

hoc.absolute = (title, options) => hoc(title, { ...options, absolute: true })

export default hoc
