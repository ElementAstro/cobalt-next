const filterAndSearchLogs = (logs: any[], filter: string, search: string) => {
  let result = logs

  if (filter) {
    const filters = filter.toLowerCase().split(',').map(f => f.trim())
    result = result.filter(log =>
      filters.some(f => {
        const [key, value] = f.split(':').map(s => s.trim())
        if (key && value) {
          return log[key]?.toLowerCase().includes(value)
        }
        return false
      })
    )
  }

  if (search) {
    const searchTerms = search.toLowerCase().split(' ')
    result = result.filter(log =>
      searchTerms.every(term =>
        Object.values(log).some(
          value => typeof value === 'string' && value.toLowerCase().includes(term)
        )
      )
    )
  }

  return result
}

self.onmessage = (event) => {
  const { logs, filter, search } = event.data
  const filteredAndSearchedLogs = filterAndSearchLogs(logs, filter, search)
  self.postMessage(filteredAndSearchedLogs)
}

