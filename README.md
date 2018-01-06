# hoc-little-router
[![CircleCI](https://circleci.com/gh/alakarteio/hoc-little-router.svg?&style=shield&circle-token=d41545d97cc6214a201fc4902db2fba4301291c7)](https://circleci.com/gh/alakarteio/hoc-little-router/tree/master) [![NPM Version](https://badge.fury.io/js/hoc-little-router.svg)](https://www.npmjs.com/package/hoc-little-router) [![Coverage Status](https://coveralls.io/repos/github/alakarteio/hoc-little-router/badge.svg?branch=master)](https://coveralls.io/github/alakarteio/hoc-little-router?branch=master)

HOC to hide a component when the route didn't match.

You need [redux-little-router](https://github.com/FormidableLabs/redux-little-router) for that HOC.

## Examples
**routes** (redux-little-router ones)
```es6
export default {
  '/': {
    title: 'HOME',
    '/search': {
      title: 'SEARCH',
    },
  },
}
```

### Relative
The `Home` component will be printed when `redux-little-router` find a title that match `HOME` from URL and its parents.

```es6
// ...
import router from 'hoc-little-router'

class Home extends React.Component {
// ...

export default router('HOME')(Home)
```

 - `/` : Home Component is **printed**
 - `/search` : Home Component is **printed**

### Absolute
The `Home` component will be printed when `redux-little-router` find a title that match `HOME` from URL but **not** its parents.

```es6
// ...
import router from 'hoc-little-router'

class Home extends React.Component {
// ...

export default router('HOME', { absolute: true })(Home)
// or
export default router.absolute('HOME')(Home)
```

 - `/` : Home Component is **printed**
 - `/search` : Home Component is _**not** printed_
