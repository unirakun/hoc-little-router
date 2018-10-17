import React from 'react'
import { connect } from 'react-redux'

const getDisplayName = Component => `router(${
  Component.displayName
  || Component.name
  || (Component.constructor && Component.constructor.name)
  || 'Unknown'
})`

const mapStateToProps = (state) => {
  if (!state.router || !state.router.result) {
    // eslint-disable-next-line no-console
    console.error('/HOC/ Router | There is no route found in `state.router.result`')
  }
  return { __hoc_little_router__result: state.router && state.router.result }
}

const isRouteFound = title => result => result && [].concat(title).includes(result.title)

const matchAbsolute = resultMatch => result => resultMatch(result)

const matchTopDown = resultMatch => (result) => {
  if (!result) return false
  return resultMatch(result) || matchTopDown(resultMatch)(result.parent)
}

const hoc = (title, options = {}) => {
  const isRouteFoundForTitle = isRouteFound(title)
  const toShow = options.absolute
    ? matchAbsolute(isRouteFoundForTitle)
    : matchTopDown(isRouteFoundForTitle)

  return (Component) => {
    const WrapedComponent = connect(mapStateToProps)(
      ({ __hoc_little_router__result, ...props }) => (
        toShow(__hoc_little_router__result) && <Component {...props} />
      ),
    )

    WrapedComponent.displayName = getDisplayName(Component)
    return WrapedComponent
  }
}

hoc.absolute = (title, options) => hoc(title, { ...options, absolute: true })

export default hoc
