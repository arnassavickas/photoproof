import { TableRow, TableRowTypeMap } from '@material-ui/core'
import { CommonProps } from '@material-ui/core/OverridableComponent'
import React from 'react'
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd'

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: 'rgb(235,235,235)',
  }),
})

const DraggableComponent =
  (id: string, index: number) =>
  (
    props: JSX.IntrinsicAttributes & { component: React.ElementType<any> } & {
      hover?: boolean | undefined
      selected?: boolean | undefined
    } & CommonProps<TableRowTypeMap<{}, 'tr'>> &
      Pick<any, string | number | symbol>,
  ) => {
    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <TableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            {...props}
          >
            {props.children}
          </TableRow>
        )}
      </Draggable>
    )
  }

export default DraggableComponent
