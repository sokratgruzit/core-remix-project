/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useRef, useState } from 'react' // eslint-disable-line
import { PluginRecord } from '../types'
import './panel.css'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
// import { CustomTooltip } from '@remix-ui/helper'

export interface RemixPanelProps {
  plugins: Record<string, PluginRecord>;
}
const RemixUIPanelHeader = (props: RemixPanelProps) => {
  const [plugin, setPlugin] = useState<PluginRecord>()
  const [toggleExpander, setToggleExpander] = useState<boolean>(false)

  useEffect(() => {
    setToggleExpander(false)
    if (props.plugins) {
      const p = Object.values(props.plugins).find((pluginRecord) => {
        return pluginRecord.active === true
      })
      setPlugin(p)
    }
  }, [props])

  const toggleClass = () => {
    setToggleExpander(!toggleExpander)
  }

  // const tooltipChild = (
  //   <i className={`px-1 ml-2 pt-1 pb-2 ${!toggleExpander ? 'fas fa-angle-right' : 'fas fa-angle-down bg-light'}`} aria-hidden="true"></i>
  // )

  return (
    <header className='d-flex flex-column'>
      <div className="swapitHeader px-3 pt-2 pb-0 d-flex flex-row">
        <h6 className="pt-0 mb-1" data-id='sidePanelSwapitTitle'>{plugin?.profile.displayName || plugin?.profile.name}</h6>
        <div className="d-flex flex-row">
          <div className="d-flex flex-row">
            {plugin?.profile?.maintainedBy?.toLowerCase() === "remix" && (
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="maintainedByTooltip" className="text-nowrap">
                    <span>{"Maintained by Remix"}</span>
                  </Tooltip>
                }
              >
                <i aria-hidden="true" className="text-success mt-1 px-1 fas fa-check"></i>
              </OverlayTrigger>
            )}
          </div>
          
        </div>
      </div>
      <div className="d-flex w-100 flex-row py-2 bg-clr">
      <div className="swapitHeaderInfoSection d-flex justify-content-between" data-id='swapitHeaderInfoSectionId' onClick={toggleClass}>
            <div className='pluginInfo'>
              <p style={{color: toggleExpander ? "#0500FF" : "#343841",transition: '.8s'}}>
                Plugin Info
              </p>
              <div >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill='none' style={{transform: toggleExpander ? 'rotateX(180deg)': 'rotateX(0deg)',transition: '.8s'}}>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.33263 0.25529C0.743926 -0.113292 1.37614 -0.078666 1.74472 0.33263L5 3.96515L8.25528 0.33263C8.62386 -0.078666 9.25607 -0.113292 9.66737 0.25529C10.0787 0.623873 10.1133 1.25609 9.74471 1.66738L6.45179 5.34191C5.66546 6.21936 4.33454 6.21936 3.54821 5.34191L0.25529 1.66738C-0.113292 1.25609 -0.078666 0.623873 0.33263 0.25529Z" fill={toggleExpander ? "#0500FF" : "#343841"}/>
                </svg>
              </div>
            </div>
            {/* <CustomTooltip
              placement="right-end"
              tooltipText="Plugin info"
              tooltipId="pluginInfoTooltip"
              tooltipClasses="text-nowrap"
            >
              {tooltipChild}
            </CustomTooltip> */}
          </div>
      </div>
      <div className={`bg-light mx-3 mb-2 pt-1 flex-column ${toggleExpander ? 'maxHeight' : 'noHeight'}`} >
        {plugin?.profile?.author && <span className="d-flex flex-row align-items-center">
          <label className="mb-0 pr-2">Author:</label>
          <span> { plugin?.profile.author } </span>
        </span>}
        {plugin?.profile?.maintainedBy && <span className="d-flex flex-row align-items-center">
          <label className="mb-0 pr-2">Maintained by:</label>
          <span> { plugin?.profile.maintainedBy } </span>
        </span>}
        {plugin?.profile?.documentation && <span className="d-flex flex-row align-items-center">
          <label className="mb-0 pr-2">Documentation:</label>
          <span>
            <a href={plugin?.profile?.documentation} className="titleInfo p-0 mb-2" title="link to documentation" target="_blank" rel="noreferrer"><i aria-hidden="true" className="fas fa-book"></i></a>
          </span>
        </span>}
        {plugin?.profile?.description && <span className="d-flex flex-row align-items-baseline">
          <label className="mb-0 pr-2">Description:</label>
          <span> { plugin?.profile.description } </span>
        </span>}
        {plugin?.profile?.repo && <span className="d-flex flex-row align-items-center">
          <a href={plugin?.profile?.repo} target="_blank" rel="noreferrer">
          Make an issue</a>
        </span>}
      </div>
    </header>)
}

export default RemixUIPanelHeader
