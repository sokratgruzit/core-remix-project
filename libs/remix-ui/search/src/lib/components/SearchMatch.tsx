import { CustomTooltip } from '@remix-ui/helper'
import React, { useContext } from 'react'
import { SearchContext } from '../context/context'

export const SearchMatch = () => {
  const {
    setFind,
    cancelSearch,
    startSearch,
    state,
    toggleCaseSensitive,
    toggleMatchWholeWord,
    toggleUseRegex,
  } = useContext(SearchContext)

  return (
    <>
      <div className="search_plugin_find-part">
        <div className="search_plugin_search-input">
          <div className="search_plugin_controls">
            <CustomTooltip
              tooltipText="Match Case"
              tooltipClasses="text-nowrap"
              tooltipId="searchCaseSensitiveTooltip"
              placement="top-start"
            >
              <div
                data-id="search_case_sensitive"
                className={` ${
                  state.casesensitive ? 'checked' : ''
                } border searchMatch`}
                onClick={() => {
                  toggleCaseSensitive()
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 14.3582H3.56332L4.36344 12.3764H8.38868L9.1888 14.3582H10.7521L7.03462 6H5.7175L2 14.3582ZM4.86814 11.1208L6.38222 7.56332L7.88399 11.1208H4.86814Z" />
                  <path d="M14.541 14.5429C15.575 14.5429 16.252 14.1366 16.6706 13.7058L16.6583 14.3582H18V7.99415H16.6829V8.60963C16.2397 8.16649 15.4642 7.80951 14.541 7.80951C12.5961 7.80951 11.2174 9.32359 11.2174 11.1823C11.2174 13.0411 12.5961 14.5429 14.541 14.5429ZM14.6395 13.3611C13.4455 13.3611 12.5469 12.3764 12.5469 11.17C12.5469 9.96369 13.4455 8.99123 14.6395 8.99123C15.8212 8.99123 16.7567 9.79135 16.7567 11.17C16.7567 12.561 15.8212 13.3611 14.6395 13.3611Z" />
                </svg>
              </div>
            </CustomTooltip>
            <CustomTooltip
              tooltipText="Match Whole Word"
              tooltipClasses="text-nowrap"
              tooltipId="searchWholeWordTooltip"
              placement="top-start"
            >
              <div
                data-id="search_whole_word"
                className={` ${
                  state.matchWord ? 'checked' : ''
                } border searchMatch`}
                onClick={() => {
                  toggleMatchWholeWord()
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.75 12.5833C2.16421 12.5833 2.5 12.919 2.5 13.3333V14.1666C2.5 14.6307 2.68437 15.0758 3.01256 15.404C3.34075 15.7322 3.78587 15.9166 4.25 15.9166H15.5833C16.0475 15.9166 16.4926 15.7322 16.8208 15.404C17.149 15.0758 17.3333 14.6307 17.3333 14.1666V13.3333C17.3333 12.919 17.6691 12.5833 18.0833 12.5833C18.4975 12.5833 18.8333 12.919 18.8333 13.3333V14.1666C18.8333 15.0285 18.4909 15.8552 17.8814 16.4647C17.2719 17.0742 16.4453 17.4166 15.5833 17.4166H4.25C3.38805 17.4166 2.5614 17.0742 1.9519 16.4647C1.34241 15.8552 1 15.0285 1 14.1666V13.3333C1 12.919 1.33579 12.5833 1.75 12.5833Z"
                  />
                  <path d="M5.39885 11.9629C6.45627 11.9629 7.14863 11.5475 7.57663 11.1069L7.56404 11.7741H8.93617V5.2659H7.58922V5.89532C7.13604 5.44214 6.34298 5.07708 5.39885 5.07708C3.40989 5.07708 2 6.62544 2 8.52628C2 10.4271 3.40989 11.9629 5.39885 11.9629ZM5.49956 10.7544C4.27849 10.7544 3.35954 9.74735 3.35954 8.51369C3.35954 7.28003 4.27849 6.28556 5.49956 6.28556C6.70804 6.28556 7.66475 7.1038 7.66475 8.51369C7.66475 9.93617 6.70804 10.7544 5.49956 10.7544Z" />
                  <path d="M14.6011 11.9629C16.5901 11.9629 18 10.4271 18 8.52628C18 6.62544 16.5901 5.07708 14.6011 5.07708C13.657 5.07708 12.864 5.44214 12.4108 5.89532V3L11.0638 3.22659V11.7741H12.436L12.4234 11.1069C12.8514 11.5475 13.5437 11.9629 14.6011 11.9629ZM14.5004 10.7544C13.292 10.7544 12.3352 9.93617 12.3352 8.51369C12.3352 7.1038 13.292 6.28556 14.5004 6.28556C15.7215 6.28556 16.6782 7.28003 16.6782 8.51369C16.6782 9.74735 15.7215 10.7544 14.5004 10.7544Z" />
                </svg>
              </div>
            </CustomTooltip>
            <CustomTooltip
              tooltipText="Use Regular Expression"
              tooltipClasses="text-nowrap"
              tooltipId="useRegularExpressionTooltip"
              placement="bottom-start"
            >
              <div
                data-id="search_use_regex"
                className={` ${
                  state.useRegExp ? 'checked' : ''
                } border searchMatch`}
                onClick={() => {
                  toggleUseRegex()
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2.60107"
                    y="12.5"
                    width="5"
                    height="5"
                    rx="1"
                    fill="white"
                  />
                  <path
                    d="M12.6348 10.5H14.3651L14.2078 7.71348L16.5224 9.24157L17.3988 7.73596L14.9044 6.5L17.3988 5.26404L16.5224 3.73596L14.2078 5.28652L14.3651 2.5H12.6348L12.7921 5.26404L10.4775 3.73596L9.60107 5.26404L12.0955 6.5L9.60107 7.73596L10.4775 9.26404L12.7921 7.73596L12.6348 10.5Z"
                    fill="white"
                  />
                </svg>
              </div>
            </CustomTooltip>
          </div>
        </div>
      </div>
    </>
  )
}
