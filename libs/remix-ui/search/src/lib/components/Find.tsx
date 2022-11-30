import { CustomTooltip } from '@remix-ui/helper'
import React, { useContext, useEffect, useState } from 'react'
import { SearchContext } from '../context/context'

export const Find = () => {
  const {
    setFind,
    cancelSearch,
    startSearch,
    state,
    toggleCaseSensitive,
    toggleMatchWholeWord,
    toggleUseRegex,
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
            <svg
              className="search-icon"
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
          </div>
          <div className="search_plugin_controls">
            <CustomTooltip
              tooltipText="Match Case"
              tooltipClasses="text-nowrap"
              tooltipId="searchCaseSensitiveTooltip"
              placement="top-start"
            >
              <div
                data-id="search_case_sensitive"
                className={`monaco-custom-checkbox codicon codicon-case-sensitive ${
                  state.casesensitive ? 'checked' : ''
                }`}
                role="checkbox"
                aria-checked="false"
                aria-label="Match Case"
                aria-disabled="false"
                onClick={() => {
                  toggleCaseSensitive()
                }}
              ></div>
            </CustomTooltip>
            <CustomTooltip
              tooltipText="Match Whole Word"
              tooltipClasses="text-nowrap"
              tooltipId="searchWholeWordTooltip"
              placement="top-start"
            >
              <div
                data-id="search_whole_word"
                className={`monaco-custom-checkbox codicon codicon-whole-word ${
                  state.matchWord ? 'checked' : ''
                }`}
                role="checkbox"
                aria-checked="false"
                aria-label="Match Whole Word"
                aria-disabled="false"
                onClick={() => {
                  toggleMatchWholeWord()
                }}
              ></div>
            </CustomTooltip>
            <CustomTooltip
              tooltipText="Use Regular Expression"
              tooltipClasses="text-nowrap"
              tooltipId="useRegularExpressionTooltip"
              placement="bottom-start"
            >
              <div
                data-id="search_use_regex"
                className={`monaco-custom-checkbox codicon codicon-regex ${
                  state.useRegExp ? 'checked' : ''
                }`}
                role="checkbox"
                aria-checked="false"
                aria-label="Use Regular Expression"
                aria-disabled="false"
                onClick={() => {
                  toggleUseRegex()
                }}
              ></div>
            </CustomTooltip>
          </div>
        </div>
        <div className="replace">
          <svg
            className="plus"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 0.75C6.48325 0.75 6.875 1.14175 6.875 1.625V5.125L10.375 5.125C10.8582 5.125 11.25 5.51675 11.25 6C11.25 6.48325 10.8582 6.875 10.375 6.875L6.875 6.875L6.875 10.375C6.875 10.8582 6.48325 11.25 6 11.25C5.51675 11.25 5.125 10.8582 5.125 10.375L5.125 6.875H1.625C1.14175 6.875 0.75 6.48325 0.75 6C0.75 5.51675 1.14175 5.125 1.625 5.125H5.125V1.625C5.125 1.14175 5.51675 0.75 6 0.75Z"
              fill="#0500FF"
            />
          </svg>
          <p>Replace</p>
        </div>
      </div>
    </>
  )
}
