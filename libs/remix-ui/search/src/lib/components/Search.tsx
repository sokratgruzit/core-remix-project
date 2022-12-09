import React, { useContext } from 'react'
import { SearchProvider } from '../context/context'
import { Results } from './results/Results'
import '../search.css'
import { Include } from './Include'
import { Exclude } from './Exclude'
import { FindContainer } from './FindContainer'
import { Undo } from './Undo'
import { SearchMatch } from './SearchMatch'

export const SearchTab = (props) => {
  const plugin = props.plugin

  return (
    <>
      <div className="search_plugin_search_tab px-2">
        <SearchProvider plugin={plugin}>
          <FindContainer></FindContainer>
          <Include></Include>
          <Exclude></Exclude>
          <SearchMatch></SearchMatch>
          <Undo></Undo>
          <Results></Results>
        </SearchProvider>
      </div>
    </>
  )
}
