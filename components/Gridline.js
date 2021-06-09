import React from 'react';
import  styled  from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const StyledGridline = styled.span`
    position: absolute;
    z-index: 0;
    background-color: ${props => props.backgroundColor};
    height: ${(props) => props.isDot ? '6px': '0px'};
    &.line-appear {
        left: ${(props) => props.isRow ? `${props.floatingPos}%` : `${props.fixedPos}vh`};
        top: ${(props) => props.isRow ? `${props.fixedPos}vh` : `${props.floatingPos}%`};
        height: ${(props) => props.isDot ? '6px': '0px'};
        width: ${(props) => props.isDot ? '6px': '0px'};
        
        border-radius: ${(props) => props.isDot ? '50%': '0%'};
    }
    
    &.line-appear-active {
        width:  ${(props) => props.isRow ? '100%': '6px'};
        
        left: ${(props) => props.isRow ? '0% !important': ''};
        top: ${(props) => props.isRow ? '': '0% !important'};
        
        border-radius: 0;
      

        transition-property: all;
        transition-duration: ${(props) => props.duration}ms; 
        transition-delay: ${(props) => props.delay}ms;

        transition-property: all;
        transition-duration: ${(props) => props.duration}ms; 
        transition-delay: ${(props) => props.delay}ms;
        
        -webkit-transition-property: all;
        -webkit-transition-duration: ${(props) => props.duration}ms; 
        -webkit-transition-delay: ${(props) => props.delay}ms;

        -webkit-transition-property: all;
        -webkit-transition-duration: ${(props) => props.duration}ms; 
        -webkit-transition-delay: ${(props) => props.delay}ms;
        will-change: all;
        
    }
    &.line-appear-done{
        width:  ${(props) => props.isRow ? '100%': '6px'};
        left: ${(props) => props.isRow ? '0% !important': `${props.fixedPos}vh`};
        top: ${(props) => props.isRow ? `${props.fixedPos}vh`: '0% !important'};
        border-radius: 50px;
    }
`;


const Gridline = (props) => {
    return(
        <CSSTransition
        in
        appear
        classNames = "line"
        timeout={props.duration + props.delay}>
            <StyledGridline {...props}/>
        </CSSTransition>   
    );
};


export default Gridline;