import React, { useMemo } from 'react'
import { createForm } from '@formily/core'
import { Form } from '@formily/antd'
import { observer } from '@formily/react'
import { SchemaField } from './SchemaField'
import { ISettingFormProps } from './types'
import { SettingsFormContext } from './shared/context'
import { getLocales, getSnapshot } from './effects'
import { Empty } from 'antd'
import cls from 'classnames'
import './styles.less'
import { useWorkbench, useOperation, useCurrentNode, useSelected, usePrefix, IconWidget, NodePathWidget } from '../react'
import { cancelIdle, requestIdle } from '@designable/shared'

const GlobalState = {
  idleRequest: null,
}

export const SettingsForm: React.FC<ISettingFormProps> = observer(
  (props) => {
    const workbench = useWorkbench()
    const currentWorkspace =
      workbench?.activeWorkspace || workbench?.currentWorkspace
    const currentWorkspaceId = currentWorkspace?.id
    const operation = useOperation(currentWorkspaceId)
    const node = useCurrentNode(currentWorkspaceId)
    const selected = useSelected(currentWorkspaceId)
    const prefix = usePrefix('settings-form')
    const schema = node?.designerProps?.propsSchema
    const isEmpty = !(
      node &&
      node.designerProps?.propsSchema &&
      selected.length === 1
    )
    const form = useMemo(() => {
      return createForm({
        initialValues: node?.designerProps?.defaultProps,
        values: node?.props,
        effects(form) {
          getLocales(node)
          getSnapshot(operation)
          props.effects?.(form)
        },
      })
    }, [node, node?.props, schema, operation, isEmpty])

    const render = () => {
      if (!isEmpty) {
        return (
          <div
            className={cls(prefix, props.className)}
            style={props.style}
            key={node.id}
          >
            <SettingsFormContext.Provider value={props}>
              <Form
                form={form}
                colon={false}
                labelWidth={120}
                labelAlign="left"
                wrapperAlign="right"
                feedbackLayout="none"
                tooltipLayout="text"
              >
                <SchemaField
                  schema={schema}
                  components={props.components}
                  scope={{ $node: node, ...props.scope }}
                />
              </Form>
            </SettingsFormContext.Provider>
          </div>
        )
      }
      return (
        <div className={prefix + '-empty'}>
          <Empty />
        </div>
      )
    }
    const IconWidgetProvider = IconWidget.Provider as any
    return (
      <IconWidgetProvider tooltip>
        <div className={prefix + '-wrapper'}>
          {!isEmpty && <NodePathWidget workspaceId={currentWorkspaceId} />}
          <div className={prefix + '-content'}>{render()}</div>
        </div>
      </IconWidgetProvider>
    )
  },
  {
    scheduler: (update) => {
      cancelIdle(GlobalState.idleRequest as any)
      GlobalState.idleRequest = requestIdle(update, {
        timeout: 500,
      }) as any
    },
  }
)
