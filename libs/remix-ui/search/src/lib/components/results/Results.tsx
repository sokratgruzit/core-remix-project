import React, { useContext, useEffect } from 'react'
import { SearchContext } from '../../context/context'
import { StopSearch } from '../StopSearch'
import { ResultItem } from './ResultItem'
import { CornerDecorYellow } from '@remix-ui/helper'

export const Results = () => {
  const { state } = useContext(SearchContext)
  return (
    <div data-id="search_results" className="mt-1">
      <div className="search_plugin_search_indicator py-1">
        {state.searching && !state.clipped ? <StopSearch></StopSearch> : null}{' '}
        {state.searching && !state.clipped
          ? `searching in ${state.searching}`
          : null}
        <br></br>
      </div>

      {state.find && !state.clipped ? (
        <div className="search_plugin_result_count_number">
          showing {state.count} results {state.fileCount} in files
        </div>
      ) : null}
      {state.find && state.clipped ? (
        <div className="tooManyResults">
          <CornerDecorYellow />
          Too many resuls to display...<br></br>Please narrow down your search.
        </div>
      ) : null}
      {state.searchResults &&
        state.searchResults.map((result, index) => {
          return <ResultItem index={index} key={index} file={result} />
        })}
    </div>
  )
}
