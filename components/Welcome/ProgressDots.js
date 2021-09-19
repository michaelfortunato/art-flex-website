import React from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'


const DotsContainer = styled.span`

`
const Dot = styled.div`
	display: inline-block;
	border: 2px grey solid;
	border-radius: 50%;
	width: 15px;
	height: 15px;
	margin: 50px;

	margin-left: 5%;
	margin-right: 5%;

	&.fill-dot-appear {
		background-color: ""
	}
	&.fill-dot-appear-active {
		background-color: grey;
		transition-property: all;
		transition-duration: 1000ms;
	}
	&.fill-dot-appear-done {
		background-color: grey;
	}
	&.fill-dot-enter {
		background-color: ""
	}
	&.fill-dot-enter-active {
		background-color: grey;
		transition-property: all;
		transition-duration: 1000ms;
	}
	&.fill-dot-enter-done {
		background-color: grey;
	}

`
export default function ProgressDots(props) {
	return (
		<DotsContainer >
			{[...Array(props.numDots)].map((_, ithDot) =>
					<CSSTransition
						classNames="fill-dot"
						timeout={1000}
						appear={ithDot === 0}
						in={props.currentDot >= ithDot}
						key={ithDot}
					>
						<Dot />
					</CSSTransition>
				)
			}
		</DotsContainer>
	)
}
