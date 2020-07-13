import qhistory from '../src/index'
import { createMemoryHistory } from 'history'
import { stringify, parse } from 'qs'

describe('qhistory', () => {
  describe('stringify & parse', () => {
    it('throws error if stringify is not a function', () => {
      const history = createMemoryHistory()
      expect(() => {
        const q = qhistory(history, undefined, parse)
      }).toThrow()
    })

    it('throws error if parse is not a function', () => {
      const history = createMemoryHistory()
      expect(() => {
        const q = qhistory(history, stringify, undefined)
      }).toThrow()
    })
  })

  describe('query', () => {
    it('will be present on initial location', () => {
      const history = createMemoryHistory({
        initialEntries: [{ pathname: '/first', search: '?second=third'}]
      })
      const q = qhistory(history, stringify, parse)
      expect(q.location.query).toBeDefined()
    })

    it('will be present after navigating', () => {
      const history = createMemoryHistory()
      const q = qhistory(history, stringify, parse)

      q.listen(({location}) => {
        expect(location.query).toEqual({ tooGoodToBe: 'true' })
        expect(location.search).toBe('?tooGoodToBe=true')
      })

      q.push('/test?tooGoodToBe=true')
    })

    it('will be an empty query object when there is no query/search', () => {
      const history = createMemoryHistory()
      const q = qhistory(history, stringify, parse)

      q.listen(({location}) => {
        expect(location.query).toBeInstanceOf(Object)
        expect(Object.keys(location.query).length).toBe(0)
      })

      q.push('/test')
    })
  })

  describe('search', () => {
    it('will prefer query object over search string', () => {
      const history = createMemoryHistory()
      history.push = jest.fn();
      const q = qhistory(history, stringify, parse)

      q.push({ pathname: '/somewhere',
        search: '?overRainbow=false',
        query: { overRainbow: true }
      })
      expect(history.push).toHaveBeenCalledWith(expect.objectContaining({search: '?overRainbow=true'}), undefined)
    })

    it('uses search if no query provided', () => {
      const history = createMemoryHistory()
      history.push = jest.fn();
      const q = qhistory(history, stringify, parse)
      q.push({ pathname: '/somewhere', search: '?overRainbow=false' })
      expect(history.push).toHaveBeenCalledWith(expect.objectContaining({search: '?overRainbow=false'}), undefined)
    })

    it('sets search to empty string if no query/search', () => {
      const history = createMemoryHistory()
      history.push = jest.fn();
      const q = qhistory(history, stringify, parse)
      q.push({ pathname: '/somewhere' })
      expect(history.push).toHaveBeenCalledWith(expect.objectContaining({search: ''}), undefined)
    })
  })

  describe('push', () => {
    it('will set search string for location passed to actual history', () => {
      const history = createMemoryHistory()
      history.push = jest.fn();
      const q = qhistory(history, stringify, parse)

      q.push({ pathname: '/somewhere', query: { overRainbow: true }})
      expect(history.push).toHaveBeenCalledWith(expect.objectContaining({search: '?overRainbow=true'}), undefined)
    })

    it('will call the history instance\'s push method', () => {
      const history = createMemoryHistory()
      const q = qhistory(history, stringify, parse)

      q.push({ pathname: '/somewhere', query: { overRainbow: true }})
      expect(q.action).toBe('PUSH')
    })
  })

  describe('replace', () => {
    it('will set search string for location passed to actual history', () => {
      const history = createMemoryHistory()
      history.replace = jest.fn();
      const q = qhistory(history, stringify, parse)

      q.replace({ pathname: '/somewhere', query: { overRainbow: true }})
      expect(history.replace).toHaveBeenCalledWith(expect.objectContaining({search: '?overRainbow=true'}), undefined)
    })

    it('will call the history instance\'s replace method', () => {
      const history = createMemoryHistory()
      history.replace = jest.fn();
      const q = qhistory(history, stringify, parse)

      q.replace({ pathname: '/somewhere', query: { overRainbow: true }})
      expect(history.replace).toHaveBeenCalled()
    })
  })

  describe('createHref', () => {
    it('uses the query object when creating a path from location', () => {
      const history = createMemoryHistory()
      const q = qhistory(history, stringify, parse)
      const location = {
        pathname: '/neighborhood',
        query: {
          beautifulDay: true
        }
      }
      expect(q.createHref(location)).toBe('/neighborhood?beautifulDay=true')
    })
  })
})
