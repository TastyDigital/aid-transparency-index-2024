import React, {useRef} from "react";
import {getColor, convertToSentenceCase} from "../swatches/getColor";
import SVG from "./SVG";
import Marker from "./Marker";

const DonorBar = (props) => {
    const barProportion = .8;

    const donor = props.donor;
    //console.log('donor.history', donor.history);
    //const thisBar = createRef(); // we attach this DOM ref to the donor data object and pass it up through props.onChildClick
    const thisBar = useRef(null); // Updated to useRef which is more appropriate for refs in functional components

    let duration = .5;
    donor.barRef = thisBar;

    const barWidth = props.isActive ? 3 * props.barWidth : props.barWidth;
    const barHeight = props.barHeight;
    const category = donor.performance_group;
    const color = getColor(category, props.components[0]);

    // Check if donor.history exists and is an array, then find the 2022 entry
    const prevYearData = Array.isArray(donor.history) ? donor.history.find(entry => entry.year === "2022") : null;
    const prevYearScore = prevYearData ? prevYearData.score : null; // Safeguard in case no data found
    const prevYearCat = prevYearData ? convertToSentenceCase(prevYearData.performance_group) : null; // Safeguard in case no data found
    const prevYearColor = getColor(prevYearCat, props.components[0]);

    if(prevYearScore !== null) {
        // console.log('name', donor.name);
        // console.log('prevYearScore', prevYearScore);
        // console.log('score', donor.score);
        // console.log('prevYearScore - score', Math.abs(prevYearScore - donor.score));
        duration = Math.abs(prevYearScore - donor.score) * 0.05;
        //console.log('duration', duration);
    }

    // Calculate position for the previous year's marker
    const prevYearMarkerPosition = prevYearScore ? barHeight - (prevYearScore * barHeight / 100) : null;

    const animationTargetRef = useRef(null);
    const heightAnimationRef = useRef(null);
    const colorAnimationRef = useRef(null);
    const yAnimationRef = useRef(null);
    const markerAnimationRef = useRef(null);
    //console.log('donor.id', donor.id);
    const donorStringId = donor.name.replace(/\s+/g, '-').toLowerCase();

    const bw = props.isActive ? barWidth : (barWidth * barProportion).toFixed(2);
    let ypos = barHeight;
    let timeOut = null;
    let barClass = ['aid-donor', 'donor-'+donorStringId];

    if(props.isActive) {
        barClass.push('active-bar');
    }


    const barClick = (e) => {
        donor.eventType = e.type; // click, focus, blur
        props.onChildClick(donor);
    }


    const handleMouseEnter = () => {
        if(!heightAnimationRef.current || prevYearMarkerPosition === null) {
            return;
        }
        // Start all animations
        heightAnimationRef.current.beginElement();
        yAnimationRef.current.beginElement();
        markerAnimationRef.current.beginElement();
        clearTimeout(timeOut);
        // Set the initial state immediately
        animationTargetRef.current.setAttribute('fill', prevYearColor);
        timeOut = setTimeout(() => {
            // reset colour
            animationTargetRef.current.setAttribute('fill', color);
            colorAnimationRef.current.beginElement();
        }, duration * 1000);
    };

    return (

        <div className={barClass.join(' ')}
             style={{width:barWidth.toString()+'px',cursor:"pointer"}}
             tabIndex="-1"
             onClick={barClick}
             onBlur={ barClick }
             ref={thisBar}
             onMouseEnter={() => handleMouseEnter()}
        >
            <SVG
                title={donor.display_name}
                description={donor.label}
                height={barHeight.toString()}
                width={barWidth.toString()}
                className={'bar'}
            >
                <rect
                    className='clickbg'
                    width={barWidth.toString()}
                    height={barHeight.toString()}
                    y={0}
                    x={0}
                    style={{fill:'transparent'}}
                />


                <g id={'bar_'+donor.name} className="component-stack-container" >
                    {props.components.map(component => {
                        let componentHeight = donor['component_'+component.index] * barHeight/100;
                        componentHeight = props.isActive ? componentHeight * 100 / donor.score : componentHeight;
                        ypos = ypos - componentHeight - 1;
                        donor.components[component.value].name = component.value;
                        let donorData = {
                            isActive: props.isActive,
                            id: donor.id,
                            name: donor.display_name,
                            label: donor.label,
                            rank: donor.rank,
                            score: donor.score.toFixed(1),
                            component: donor.components[component.value]
                        }

                        return (
                            <rect
                                key={component.index}
                                className={'component-stack'}
                                style={{fill:getColor(category, component)}}
                                name={component.value}
                                width={bw}
                                height={componentHeight}
                                y={ypos+1}
                                x={(barWidth-bw)/2}
                                data-for='pointerdata'
                                data-tip={JSON.stringify(donorData)}
                                data-background-color={color}
                            />
                        )
                    })}
                </g>
                <g id={`score_${donor.name} `} className="score-bar-container">
                    <rect
                        className='total-score-bar'
                        //style={{fill:color}}
                        fill={color}
                        name={donor.label}
                        width={bw}
                        height={donor.score * barHeight / 100}
                        x={(barWidth - bw) / 2}
                        y={barHeight - (donor.score * barHeight / 100)}
                        ref={animationTargetRef}
                    >
                    {/* Animate height */}
                    {prevYearMarkerPosition && (
                    <animate
                        ref={heightAnimationRef}
                        attributeName="height"
                        from={prevYearScore * barHeight / 100}
                        to={donor.score * barHeight / 100}
                        begin="indefinite"
                        dur={duration+ 's'}
                        fill="freeze"
                    />
                    )}
                    {/* Animate y position */}
                    {prevYearMarkerPosition && (
                    <animate
                        ref={yAnimationRef}
                        attributeName="y"
                        from={prevYearMarkerPosition}
                        to={barHeight - (donor.score * barHeight / 100)}
                        begin="indefinite"
                        dur={duration+ 's'}
                    />
                    )}
                    {/* Animate color */}
                    {prevYearMarkerPosition && (
                    <animate
                        ref={colorAnimationRef}
                        attributeName="fill"
      attributeType="XML"
                        from={prevYearColor}
                        to={color}
                        begin="indefinite"
                        dur={'.5s'}
                    />
                    )}
                    </rect>
                         {/* Marker for previous year's score */}
                    {prevYearMarkerPosition && (
                        // <path style={{fill:'#c7d6d7',strokeWidth:0}} d="M0,4.23C8.95-.33,18.86-.69,28.5.97c3.17.64,6.34,1.54,9.5,3.26v.49c-3.17.09-6.34.15-9.5.16-4.74.08-14.27.08-19.01,0-3.17,0-6.34-.07-9.5-.16v-.49Z">
                        <svg
                            width={bw}
                            opacity={1}
                            viewBox="0 0 38 5"
                            x={(barWidth - bw) / 2}
                            y={prevYearMarkerPosition - (barHeight / 2)}>
                                <path 
                                fill="#c7d6d7"
                                width={bw}
                                d="M0,4.23C8.95-.33,18.86-.69,28.5.97c3.17.64,6.34,1.54,9.5,3.26v.49c-3.17.09-6.34.15-9.5.16-4.74.08-14.27.08-19.01,0-3.17,0-6.34-.07-9.5-.16v-.49Z">
                            <animate
                                ref={markerAnimationRef}
                                attributeName="opacity"
                                from="0"
                                to="1"
                                begin="indefinite"
                                dur={duration+ 's'}
                                fill="freeze"
                            />
                            </path>
                        </svg>
                        
                    )}
                    
                </g>
            </SVG>
            <div className={'donor-label'} style={{height:barWidth.toString()+'px'}}><span>{donor.display_name}</span></div>
        </div>

    );
}
export default DonorBar;