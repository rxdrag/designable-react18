import React from 'react'
import { Space, Typography, Divider, TypographyProps } from 'antd'
import { observer } from '@formily/reactive-react'
import { usePrefix, useTreeNode, useSelected } from '../../hooks'
import { IconWidget } from '../IconWidget'
import { TextWidget } from '../TextWidget'
import cls from 'classnames'
import './styles.less'

export interface INodeActionsWidgetProps {
  className?: string
  style?: React.CSSProperties
  activeShown?: boolean
  children?: React.ReactNode
}

export interface INodeActionsWidgetActionProps
  extends Omit<React.ComponentProps<'a'>, 'title' | 'type' | 'ref'>,
  Partial<TypographyProps['Link']> {
  className?: string
  style?: React.CSSProperties
  title: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
}

const NodeActionsWidgetInner: React.FC<INodeActionsWidgetProps> & {
  Action?: React.FC<INodeActionsWidgetActionProps>
} = observer((props) => {
  const node = useTreeNode()
  const prefix = usePrefix('node-actions')
  const selected = useSelected()
  if (selected.indexOf(node?.id as any) === -1 && props.activeShown) return null
  return (
    <div className={cls(prefix, props.className)} style={props.style}>
      <div className={prefix + '-content'}>
        <Space split={<Divider type="vertical" />}>{props.children}</Space>
      </div>
    </div>
  )
})

const Action = ({ icon, title, ...props }: any) => {
  const prefix = usePrefix('node-actions-item')
  return (
    <Typography.Link
      {...props}
      className={cls(props.className, prefix)}
      data-click-stop-propagation="true"
    >
      <span className={prefix + '-text'}>
        <IconWidget infer={icon} />
        <TextWidget>{title}</TextWidget>
      </span>
    </Typography.Link>
  )
}

NodeActionsWidgetInner.Action = Action
export const NodeActionsWidget = NodeActionsWidgetInner as React.FC<INodeActionsWidgetProps> & {
  Action: React.FC<INodeActionsWidgetActionProps>
} 
