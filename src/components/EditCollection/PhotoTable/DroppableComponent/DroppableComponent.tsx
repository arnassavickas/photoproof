import { TableBody, TableBodyTypeMap } from '@material-ui/core';
import { CommonProps } from '@material-ui/core/OverridableComponent';
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const DroppableComponent =
  (onDragEnd: (result: any, provided: any) => void) =>
  (
    props: JSX.IntrinsicAttributes & {
      component: React.ElementType<any>;
    } & CommonProps<TableBodyTypeMap<{}, 'tbody'>> &
      Pick<any, string | number | symbol>
  ) => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'1'} direction='vertical'>
          {(provided) => {
            return (
              <TableBody
                ref={provided.innerRef}
                {...provided.droppableProps}
                {...props}
              >
                {props.children}
                {provided.placeholder}
              </TableBody>
            );
          }}
        </Droppable>
      </DragDropContext>
    );
  };

export default DroppableComponent;
