/* eslint-disable @typescript-eslint/no-shadow */
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import { List, ListItem } from "@material-ui/core";

const DragAndDropMenuContainer = styled.div`
  color: #ffffff;
  background-color: rgb(18, 18, 18);
`;

const DragAndDropItemContainer = styled.div`
  padding: 20px;
`;

// eslint-disable-next-line react/display-name
export default function DraggableMenu(props: {
  items: string[];
  onReorder: any;
}) {
  function onDragEnd(result: DropResult) {
    if (result.destination) {
      props.onReorder(result.source.index, result.destination.index);
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <List {...provided.droppableProps} ref={provided.innerRef}>
            {props.items.map((item, index) => (
              <Draggable
                key={index}
                draggableId={`item-${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                  >
                    {item}
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}
