import { RefObject, useRef, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

/*
function determineIfHTMLDivElement(currentRef: HTMLDivElement | null) {
  if ((currentRef as HTMLDivElement).align) {
    return true;
  }
  return false;
}
onMouseLeave={onMouseOut}
onMouseOver={event => onMouseOver(event, index)}
*/

function onMouseOver(
  boxIndex: number,
  parentBoxRefs: RefObject<HTMLDivElement>[],
  underlineTimer: RefObject<NodeJS.Timeout>,
  greybarRef: RefObject<HTMLElement>,
  setUnderlinePos: ({ left, width }: { left: number; width: number }) => void,
  setIsUnderlined: (isUnderlined: true) => void
) {
  try {
    if (
      underlineTimer.current === null ||
      parentBoxRefs[boxIndex].current === null ||
      greybarRef.current === null
    ) {
      throw Error(
        `Null ref: on one of the following` +
          ` ${underlineTimer.current} ${parentBoxRefs[boxIndex].current} ${greybarRef.current}`
      );
    }
    clearTimeout(underlineTimer.current);
    // use event.target.getBoundingClientRect() if you dont want the whole box
    // event.target.getBoundingClientRect();

    const textPos = (
      parentBoxRefs[boxIndex].current as HTMLDivElement
    ).getBoundingClientRect();

    setUnderlinePos({
      left: textPos.x - greybarRef.current.getBoundingClientRect().x,
      width: textPos.width
    });
    setIsUnderlined(true);
  } catch (error) {
    console.log(error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onMouseOut(setIsUnderlined: (isUnderlined: boolean) => void) {
  setIsUnderlined(false);
}

export default function Menubar(props: {
  pages: {
    url: string;
    name: string;
  }[];
}) {
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [underlinePos, setUnderlinePos] = useState({
    left: 0,
    width: 0
  });
  const parentBoxRefs: any[] = []; // props.pages.map(() => useRef<HTMLDivElement>(null));

  const underlineRef = useRef<HTMLSpanElement>(null);
  const underlineTimer = useRef<NodeJS.Timeout>(null);
  const greybarRef = useRef<HTMLDivElement>(null);

  return (
    <Grid container>
      <Grid
        style={{ marginTop: 10 }}
        container
        item
        xs={12}
        justifyContent="space-around"
      >
        {props.pages.map(({ url, name }, index) => (
          <Grid
            ref={parentBoxRefs[index]}
            style={{ textAlign: "", padding: 15, cursor: "pointer" } as any}
            key={index}
            item
            xs
            onMouseLeave={() => setIsUnderlined(false)}
            onMouseOver={() =>
              onMouseOver(
                index,
                parentBoxRefs,
                underlineTimer,
                greybarRef,
                setUnderlinePos,
                setIsUnderlined
              )
            }
          >
            <Link href={url}>
              <Typography variant="button">
                <a>{name}</a>
              </Typography>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Grid
        ref={greybarRef}
        item
        xs={12}
        style={{ height: 2, backgroundColor: "#dedede" }}
      >
        <div style={{ position: "relative", height: "100%" }}>
          <AnimatePresence>
            {isUnderlined && (
              <motion.span
                exit={{ scaleX: 0, transformOrigin: "50% 50%" }}
                initial={{ width: 0 }}
                animate={{
                  width: underlinePos.width,
                  left: underlinePos.left
                }}
                style={{
                  transformOrigin: "50% 50%",
                  scaleX: 1.1,
                  position: "absolute",
                  display: "inline-block",
                  left: underlinePos.left,
                  height: "100%",
                  width: underlinePos.width,
                  backgroundColor: "black"
                }}
              />
            )}
          </AnimatePresence>
          <span
            style={{
              position: "absolute",
              display: "inline-block",
              left: underlinePos.left,
              width: underlinePos.width
            }}
            ref={underlineRef}
          />
        </div>
      </Grid>
    </Grid>
  );
}
