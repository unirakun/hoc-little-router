# For now we deprecate this HOC (and our redux-little-router usage) in profit of [k-redux-router](https://github.com/alakarteio/k-redux-router).
_Please open an issue if you want to argue about this decision._

**Feel free to open PRs, we are still reviewing them**

-----

# hoc-little-router

[![CircleCI](https://circleci.com/gh/alakarteio/hoc-little-router.svg?&style=shield&circle-token=d41545d97cc6214a201fc4902db2fba4301291c7)](https://circleci.com/gh/alakarteio/hoc-little-router/tree/master) [![NPM Version](https://badge.fury.io/js/hoc-little-router.svg)](https://www.npmjs.com/package/hoc-little-router) [![Coverage Status](https://coveralls.io/repos/github/alakarteio/hoc-little-router/badge.svg?branch=master)](https://coveralls.io/github/alakarteio/hoc-little-router?branch=master) [![Size](http://img.badgesize.io/alakarteio/hoc-little-router/master/index.js.svg)]() [![Greenkeeper badge](https://badges.greenkeeper.io/alakarteio/hoc-little-router.svg)](https://greenkeeper.io/)

redux-little-router HOC to render a component when the route is matching!

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

### List screens
You can attach the same component to multiple routes like this:
```es6
import router from 'hoc-little-router'

class Menu extends React.Component {
// ...

export default router(['HOME', 'SEARCH'])(Menu)
```

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

# About uni rakun
**uni rakun** is created by two passionate french developers.

Do you want to contact them ? Go to their [website](https://unirakun.fr)

<table border="0">
 <tr>
  <td align="center"><img src="https://avatars1.githubusercontent.com/u/26094222?s=460&v=4" width="100" /></td>
  <td align="center"><img src="https://avatars1.githubusercontent.com/u/17828231?s=460&v=4" width="100" /></td>
 </tr>
 <tr>
  <td align="center"><a href="https://github.com/guillaumecrespel">Guillaume CRESPEL</a></td>
  <td align="center"><a href="https://github.com/fabienjuif">Fabien JUIF</a></td>
</table>
