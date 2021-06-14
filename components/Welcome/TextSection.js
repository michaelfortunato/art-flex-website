import React from 'react'

export default function TextSection() {
	return (
                  <div
                    style={{
                      position: "absolute",
                      "text-align": "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h1">{props.text}</Typography>
                  {artComponent}
                  </div>
	)
}
