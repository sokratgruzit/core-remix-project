import React from 'react'
import { useContext } from 'react'
import { SearchContext } from '../context/context'

export const StopSearch = () => {
  const { cancelSearch } = useContext(SearchContext)
  const cancel = async () => {
    await cancelSearch(false)
  }
  return (
    <div
      className="search_plugin_stop failedTests"
      onClick={async () => await cancel()}
    >
      stop
    </div>
  )
}
