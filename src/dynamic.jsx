import React from 'react'

function load(componentToLoad) {
  const promise = componentToLoad()

  const state = {
    loading: true,
    loaded: null,
    error: null,
  }

  state.promise = promise
    .then((loaded) => {
      state.loading = false
      state.loaded = loaded
      return loaded
    })
    .catch((err) => {
      state.loading = false
      state.error = err
      throw err
    })

  return state
}

function resolve(obj) {
  // eslint-disable-next-line no-underscore-dangle
  return obj && obj.__esModule ? obj.default : obj
}

export default (componentToLoad) => {
  let res = null

  return class extends React.Component {
    constructor(props) {
      super(props)
      res = load(componentToLoad)
      this.state = {
        loaded: res.loaded,
        loading: res.loading,
      }
    }

    componentWillMount() {
      this.mounted = true

      if (!res.loading) {
        return
      }

      const update = () => {
        if (!this.mounted) {
          return
        }

        this.setState({
          error: res.error,
          loaded: res.loaded,
          loading: res.loading,
        })
      }

      res.promise
        .then(() => {
          update()
        })
        .catch(() => {
          update()
        })
    }

    componentWillUnmount() {
      this.mounted = false
    }

    render() {
      if (this.state.loading || this.state.error) {
        return null // loading
      } else if (this.state.loaded) {
        const Component = resolve(this.state.loaded)
        return <Component {...this.props} />
      }
      return null
    }
  }
}
