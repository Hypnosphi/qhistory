# qhistory

Add query object support to [`history`](https://github.com/ReactTraining/history) library location objects.

You will need to supply `stringify` and `parse` methods.

#### `stringify`

A function that takes a query object and returns a search string.

```js
stringify({ occupation: 'computer' }) // 'occupation=computer'
```

#### `parse`

A function that takes a search string and returns a query object.

```js
parse('stopDownloading=true') // { stopDownloading: 'true' }
```

There are lots of different query string packages that you can choose from. Some popular ones include:

* [`qs`](https://www.npmjs.com/package/qs)
* [`query-string`](https://www.npmjs.com/package/query-string)
* [`querystring`](https://www.npmjs.com/package/querystring)

There may be subtle differences in the way that each parses and stringifies, so you will need to determine which supports the features that you want.

### Installation

```
npm install --save qhistory
```

### Usage

```js
import { createBrowserHistory } from 'history'
import qhistory from 'qhistory'

import { stringify, parse } from 'qs'

const history = qhistory(
  createBrowserHistory({ /* history configuration options */ }),
  stringify,
  parse
)
```

#### Usage with React Router

This can be used with React Router v4 to add query string support to location objects. If a location object has both a search string and a query object, the search string's value will be overwritten by the stringified query object.

```js
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import qhistory from 'qhistory'

import { stringify, parse } from 'qs'

const history = qhistory(
  createBrowserHistory({ /* history configuration options */ }),
  stringify,
  parse
)

render((
  <Router history={history}>
    <App />
  </Router>
), document.getElementById('root'))
```

#### If you're using React Router 4's BrowserRouter you can incorporate qhistory like this:

```js
class QueryRouter extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    children: PropTypes.node,
    stringify: PropTypes.func,
    parse: PropTypes.func,
  }

  history = qhistory(
    createBrowserHistory(this.props),
    this.props.stringify,
    this.props.parse
  )

  render() {
    return <Router history={this.history} children={this.props.children} />
  }
}

// usage
render((
  <QueryRouter stringify={stringify} parse={parse}>
    <App />
  </QueryRouter>
), document.getElementbyId('root'))
```
