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
      let search = location.search || ''
      if (location.query) {
        search = stringify(location.query)
        // Ensure leading "?" for non-empty search
        if (search.length > 0 && search.charAt(0) !== '?') {
          search = `?${search}`
        }
      }
      return {...location, search}
    }

    return location
  }

  const addQuery = (location) => {
    const { search } = location
    return {
      ...location,
      query: search ? parse(search.charAt(0) === '?' ? search.substring(1) : search) : {}
    }
  }

  const updateProperties = (history) => {
    const properties = ['length', 'entries', 'index', 'action']
    properties.forEach(prop => {
      if (history.hasOwnProperty(prop)) {
        queryHistory[prop] = history[prop]
      }
    })
  }

  // This relies on being the first listener called by
  // the actual history instance. If you register a
  // listener on the history instance before modifying
  // it with qhistory, the location object will not have
  // the query property set on it when that listener
  // is called.
  history.listen((location) => {
    updateProperties(history)
  })

  const queryHistory = {
    ...history,
    listen: (listener) =>
      history.listen((location, action) => {
        const isV5 = location.location != null
        if (isV5) {
          action = location.action
          location = location.location
        }
        const queryLocation = addQuery(location)
        isV5 ? listener({location: queryLocation, action}) : listener(queryLocation, action)
      }),
    push: (location, state) =>
      history.push(addSearch(location), state),
    replace: (location, state) =>
      history.replace(addSearch(location), state),
    createHref: (location) =>
      history.createHref(addSearch(location))
  }

  Object.defineProperty(queryHistory, 'location', {
    get: () => addQuery(history.location),
  })

  return queryHistory
}

export default qhistory
