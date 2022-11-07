// eslint-disable-next-line no-use-before-define
import React from 'react'
import { EnvironmentProps } from '../types'
import { CustomTooltip } from '@remix-ui/helper'

export function EnvironmentUI (props: EnvironmentProps) {
  const handleChangeExEnv = () => {
    const provider = props.providers.providerList[0];
    const fork = provider.fork // can be undefined if connected to an external source (External Http Provider / injected)
    let context = provider.value

    context = context.startsWith('vm') ? 'vm' : context

    props.setExecutionContext({ context, fork })
  }

  const currentProvider = props.providers.providerList[0];
  
  return (
    <div className="udapp_crow">
      <label onClick={() => { handleChangeExEnv() }} id="selectExEnv" className="udapp_settingsLabel">
        Connnect to Environment 
      </label>
      <div className="udapp_environment">
        <div id="selectExEnvOptions" data-id="settingsSelectEnvOptions" className='udapp_selectExEnvOptions'>
          <div 
            id="dropdown-custom-components" 
            className="btn btn-light btn-block w-100 d-inline-block border border-dark form-control"
          >
            { currentProvider && currentProvider.content }
          </div>
        </div>
        <CustomTooltip placement={'bottom-start'} tooltipClasses="text-wrap" tooltipId="runAndDeployAddresstooltip"
            tooltipText={"Click for docs about Environment"}>
          <a href="https://remix-ide.readthedocs.io/en/latest/run.html#environment" target="_blank" rel="noreferrer"><i className="udapp_infoDeployAction ml-2 fas fa-info"></i></a>
        </CustomTooltip>
      </div>
    </div>
  )
}
