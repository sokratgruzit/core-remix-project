import { CustomTooltip } from '@remix-ui/helper'
import React, { useContext, useEffect, useState } from 'react'
import { SearchContext } from '../context/context'
import { Find } from './Find'
import { OverWriteCheck } from './OverWriteCheck'
import { Replace } from './Replace'

export const FindContainer = (props) => {
  const { setReplaceEnabled } = useContext(SearchContext)
  const [expanded, setExpanded] = useState<boolean>(false)
  const toggleExpand = () => setExpanded(!expanded)
  useEffect(() => {
    setReplaceEnabled(expanded)
  }, [expanded])
  return (
    <div className="search_plugin_find_container">
      <div className="search_plugin_find_container_internal">
        <Find></Find>
        <CustomTooltip
          tooltipText="Toggle Replace"
          tooltipClasses="text-nowrap"
          tooltipId="toggleReplaceTooltip"
          placement="left-start"
        >
          <div className="replace" onClick={toggleExpand}>
            {expanded ? (
              <svg
                width="12"
                height="2"
                viewBox="0 0 12 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.875 0.125012L10.375 0.125012C10.8582 0.125012 11.25 0.516763 11.25 1.00001C11.25 1.48326 10.8582 1.87501 10.375 1.87501H6.875C5 1.87501 6.875 1.87503 5.125 1.87501L1.625 1.87501C1.14175 1.87501 0.75 1.48326 0.75 1.00001C0.75 0.516763 1.14175 0.125012 1.625 0.125012L5.125 0.125012C6.875 0.125032 4 0.124977 6.875 0.125012Z"
                  fill="#0500FF"
                />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="#0500FF"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 0.75C6.48325 0.75 6.875 1.14175 6.875 1.625V5.125L10.375 5.125C10.8582 5.125 11.25 5.51675 11.25 6C11.25 6.48325 10.8582 6.875 10.375 6.875L6.875 6.875L6.875 10.375C6.875 10.8582 6.48325 11.25 6 11.25C5.51675 11.25 5.125 10.8582 5.125 10.375L5.125 6.875H1.625C1.14175 6.875 0.75 6.48325 0.75 6C0.75 5.51675 1.14175 5.125 1.625 5.125H5.125V1.625C5.125 1.14175 5.51675 0.75 6 0.75Z"
                />
              </svg>
            )}
            <p>Replace</p>
          </div>
        </CustomTooltip>
        {expanded ? (
          <>
            <Replace></Replace>
            <OverWriteCheck></OverWriteCheck>
          </>
        ) : null}
      </div>
    </div>
  )
}
