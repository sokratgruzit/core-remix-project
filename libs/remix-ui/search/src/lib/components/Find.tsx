import React, { useContext, useEffect, useState } from 'react'
import { SearchContext } from '../context/context'

export const Find = () => {
  const {
    setFind,
    cancelSearch,
    startSearch,
    state,
    // toggleCaseSensitive,
    // toggleMatchWholeWord,
    // toggleUseRegex,
  } = useContext(SearchContext)

  const [inputValue, setInputValue] = useState('')
  const change = async (e) => {
    setInputValue(e.target.value)
    await cancelSearch()
  }

  const handleKeypress = async (e) => {
    if (e.charCode === 13 || e.keyCode === 13) {
      startSearch()
    }
    await setFind(inputValue)
  }
  const handleSearchStart = async () => {
    startSearch()
    await setFind(inputValue)
  }

  useEffect(() => {
    setInputValue('')
  }, [state.workspace])

  return (
    <>
      <div className="search_plugin_find-part">
        <div className="search_plugin_search-input">
          <div className="search-field">
            <input
              id="search_input"
              placeholder="Search"
              className="form-control"
              value={inputValue}
              onChange={async (e) => await change(e)}
              onKeyUp={handleKeypress}
            />
            <span className="search-icon" onClick={handleSearchStart}>
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="15" cy="15" r="15" fill="#0F1218" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.3333 9.5C11.664 9.5 9.5 11.664 9.5 14.3333C9.5 17.0027 11.664 19.1667 14.3333 19.1667C17.0027 19.1667 19.1667 17.0027 19.1667 14.3333C19.1667 11.664 17.0027 9.5 14.3333 9.5ZM8.5 14.3333C8.5 11.1117 11.1117 8.5 14.3333 8.5C17.555 8.5 20.1667 11.1117 20.1667 14.3333C20.1667 17.555 17.555 20.1667 14.3333 20.1667C11.1117 20.1667 8.5 17.555 8.5 14.3333Z"
                  fill="#808287"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.7465 17.7463C17.9418 17.551 18.2584 17.551 18.4537 17.7463L21.3537 20.6463C21.5489 20.8416 21.5489 21.1581 21.3537 21.3534C21.1584 21.5487 20.8418 21.5487 20.6465 21.3534L17.7465 18.4534C17.5513 18.2581 17.5513 17.9416 17.7465 17.7463Z"
                  fill="#808287"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
