import React from 'react'
import {
  Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import qhistory from 'qhistory'
import { parse, stringify } from 'qs'

const products = [
  { id: 0, name: 'Chair' },
  { id: 1, name: 'Stool' },
  { id: 2, name: 'Recliner' },
  { id: 3, name: 'Adirondack' },
  { id: 4, name: 'Terrace' },
]

const Product = ({ location }) => {
  const product = products[parseInt(location.query.id, 10)]
  return (
    <div>
      You are viewing product: {product.name}
      <p>
        <Link to='/'>Home</Link>
      </p>
      <p>
        <Link
          to={{
            pathname: '/product',
            query: { id: Math.floor(Math.random()*products.length) }
          }}>
          Random Product
        </Link>
      </p>
    </div>
  )
}

const Showcase = () => (
  <div>
    <h1>Products:</h1>
    <ul>
      {
        products.map(p => (
          <li key={p.id}>
            <Link to={{ pathname: '/product', query: { id: p.id }}}>{p.name}</Link>
          </li>
        ))
      }
    </ul>
    <p>
      Or view a <Link
        to={{
          pathname: '/product',
          query: { id: Math.floor(Math.random()*products.length) }
        }}>
        Random Product
      </Link>
    </p>
  </div>
)


const queryHistory = qhistory(
  createBrowserHistory(),
  stringify,
  parse
)

const App = () => (
  <Router history={queryHistory}>
    <Switch>
      <Route exact path='/' component={Showcase} />
      <Route path='/product' component={Product} />
    </Switch>
  </Router>
)

export default App
