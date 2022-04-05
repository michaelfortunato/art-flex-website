import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme
} from "@material-ui/core";
import { Cancel, Image } from "@material-ui/icons";
import { forwardRef } from "react";
import mergeRefs from "react-merge-refs";

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
  const theme = useTheme();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <List
            {...props.containerProps}
            {...provided.droppableProps}
            ref={mergeRefs([provided.innerRef, ref])}
          >
            {props.items.map((item, index) => (
              <Draggable key={item} draggableId={`item-${item}`} index={index}>
                {providedDrag => (
                  <ListItem
                    component={Paper}
                    onMouseDown={() => props.setSelectedItem(item)}
                    ref={providedDrag.innerRef}
                    {...providedDrag.draggableProps}
                    {...providedDrag.dragHandleProps}
                    style={{
                      ...providedDrag.draggableProps.style,
                      ...props.itemProps,
                      width: "fit-content",
                      overflowWrap: "break-word",
                      backgroundColor: `${
                        props.selectedItem === item
                          ? "#ebebeb" // mimicking selected behavior
                          : // but using the rgb (solid) conversion of its rgba
                            theme.palette.background.paper // use paper bg
                      }`
                    }}
                  >
                    <ListItemIcon>
                      {
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <Image />
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        item.length > 30 ? `${item.slice(0, 30)} ...` : item
                      }
                    />
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
