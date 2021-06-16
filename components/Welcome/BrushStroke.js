import React from 'react'
import Lottie from 'lottie-react'
import styled from 'styled-components'

const PaintBrushContainer = styled.div`
	left: ${props => props.left}%;
	top: ${props => props.top}%;
	height: ${props => props.height}%;
	width: ${props => props.width}%;
	position: absolute;
	z-index: -1;
`

export default function BrushStroke(props) {
	return (
		<PaintBrushContainer left={props.left} top={props.top} height={props.height} width={props.width}>
			<Lottie autoplay={false} lottieRef={props.lottieRef} animationData={props.animationData} loop={false} />
		</PaintBrushContainer>
	)
}
