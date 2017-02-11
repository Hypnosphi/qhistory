import invariant from 'invariant'

const qhistory = (history, stringify, parse) => {

  invariant(
    typeof stringify === 'function',
    'A stringify function is required in order to transform ' +
    'query objects into search strings.'
  )

  invariant(
    typeof parse === 'function',
    'A parse function is required in order to transform ' +
    'search strings into query objects.'
  )

  const addSearch = (location) => {
    if (typeof location === 'object') {
      location.search = location.query ? stringify(location.query) : ''
    }
  }

  const addQuery = (location) => {
    location.query = location.search ? parse(location.search) : {}
  }  

  // This relies on being the first listener called by
  // the actual history instance. If you register a
  // listener on the history instance before modifying
  // it with qhistory, the location object will not have
  // the query property set on it when that listener
  // is called.
  history.listen(addQuery)

  // make sure that the initial location has query support
  addQuery(history.location)

  return {
    ...history,
    push: (location, state) => {
      addSearch(location)
      history.push(location, state)
    },
    replace: (location, state) => {
      addSearch(location)
      history.replace(location, state)
    },
    createHref: (location) => {
      addSearch(location)
      return history.createHref(location)
    }
  }
}

export default qhistory
