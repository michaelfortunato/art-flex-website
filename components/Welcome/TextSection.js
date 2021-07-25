import React from 'react'

export default function TextSection() {
	return (
                  <div
                    style={{
                      "text-align": "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h2">{props.text}</Typography>
                  {artComponent}
                  </div>
	)
}
