/* eslint-disable @typescript-eslint/no-shadow */
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import {
  Grid,
  GridProps,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from "@material-ui/core";
import { Cancel, Image } from "@material-ui/icons";
import { forwardRef } from "react";
import mergeRefs from "react-merge-refs";
const DragAndDropMenuContainer = styled.div`
  color: #ffffff;
  background-color: rgb(18, 18, 18);
`;

const DragAndDropItemContainer = styled.div`
  padding: 20px;
`;

const MenuItem = styled(Paper)`
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 4px;
`;

// eslint-disable-next-line prefer-arrow-callback
const DraggableMenu = forwardRef(function DraggableMenu(
  props: {
    items: string[];
    onReorder: any;
    selectedItem: string | undefined;
    setSelectedItem: (itemId: string | undefined) => void;
    onRemove: any;
    containerProps?: any;
    itemProps?: any;
  },
  ref
) {
  function onDragEnd(result: DropResult) {
    if (result.destination) {
      props.onReorder(result.source.index, result.destination.index);
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <List
            {...props.containerProps}
            {...provided.droppableProps}
            ref={mergeRefs([provided.innerRef, ref])}
          >
            {props.items.map((item, index) => (
              <Draggable key={item} draggableId={`item-${item}`} index={index}>
                {(provided, snapshot) => (
                  <ListItem
                    component={Paper}
                    selected={props.selectedItem === item}
                    onClick={() => props.setSelectedItem(item)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      ...props.itemProps,
                      width: "fit-content",
                      overflowWrap: "break-word"
                    }}
                  >
                    <ListItemIcon>
                      {
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <Image />
                      }
                    </ListItemIcon>
                    <ListItemText primary={item} />
                    {props.selectedItem === item && (
                      <IconButton
                        edge="end"
                        onClick={e => {
                          e.stopPropagation();
                          props.setSelectedItem(undefined);
                          props.onRemove(index);
                        }}
                      >
                        {
                          // eslint-disable-next-line jsx-a11y/alt-text
                          <Cancel />
                        }
                      </IconButton>
                    )}
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
});

export default DraggableMenu;
