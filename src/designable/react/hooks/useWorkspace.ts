import { useContext } from 'react'
import { useDesigner } from './useDesigner'
import { WorkspaceContext } from '../context'
import { Workspace } from '@designable/core'
import { globalThisPolyfill } from '@designable/shared'

export const useWorkspace = (id?: string): Workspace => {
  const designer = useDesigner()
  const context = useContext(WorkspaceContext)
  const workspaceId = id || context?.id
  if (workspaceId) {
    return designer.workbench.findWorkspaceById(workspaceId)
  }
  if ((globalThisPolyfill as any)['__DESIGNABLE_WORKSPACE__'])
    return (globalThisPolyfill as any)['__DESIGNABLE_WORKSPACE__']
  return designer.workbench.currentWorkspace
}
