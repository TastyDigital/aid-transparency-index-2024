import React, {useRef, useState} from "react";
import {getColor, convertToSentenceCase} from "../swatches/getColor";
import SVG from "./SVG";

const DonorBar = (props) => {
    const barProportion = .8;

    const donor = props.donor;
    console.log('donor.history', donor.history);
    //const thisBar = createRef(); // we attach this DOM ref to the donor data object and pass it up through props.onChildClick
    const thisBar = useRef(); // Updated to useRef which is more appropriate for refs in functional components

    const duration = '.5s';
    donor.barRef = thisBar;

    const barWidth = props.isActive ? 3 * props.barWidth : props.barWidth;
    const barHeight = props.barHeight;
    const category = donor.performance_group;

    // Check if donor.history exists and is an array, then find the 2022 entry
    const prevYearData = Array.isArray(donor.history) ? donor.history.find(entry => entry.year === "2022") : null;
    const prevYearScore = prevYearData ? prevYearData.score : null; // Safeguard in case no data found
    const prevYearCat = prevYearData ? convertToSentenceCase(prevYearData.performance_group) : null; // Safeguard in case no data found

    // Calculate position for the previous year's marker
    const prevYearMarkerPosition = prevYearScore ? barHeight - (prevYearScore * barHeight / 100) : null;

    const bw = props.isActive ? barWidth : (barWidth * barProportion).toFixed(2);
    let ypos = barHeight;

    let barClass = ['aid-donor', 'donor-'+donor.name.replace(/\s+/g, '-').toLowerCase()];

    if(props.isActive) {
        barClass.push('active-bar');
    }


    const barClick = (e) => {
        donor.eventType = e.type; // click, focus, blur
        props.onChildClick(donor);
    }

    return (

        <div className={barClass.join(' ')}
             style={{width:barWidth.toString()+'px',cursor:"pointer"}}
             tabIndex="-1"
             onClick={barClick}
             onBlur={ barClick }
             onMouseEnter={() => thisBar.current.classList.add('animating')}
             onMouseLeave={() => thisBar.current.classList.remove('animating')}
             ref={thisBar}
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
                                data-background-color={getColor(category, props.components[0])}
                            />
                        )
                    })}
                </g>
                <g id={`score_${donor.name} `} className="score-bar-container">
                    <rect
                        className='total-score-bar'
                        style={{fill:getColor(category, props.components[0])}}
                        name={donor.label}
                        width={bw}
                        height={donor.score * barHeight / 100}
                        x={(barWidth - bw) / 2}
                        y={barHeight - (donor.score * barHeight / 100)}>
 {/* Animate height */}
                    <animate
                        attributeName="height"
                        from={prevYearScore * barHeight / 100}
                        to={donor.score * barHeight / 100}
                        begin="mouseover"
                        dur={duration}
                        fill="freeze"
                    />
                    {/* Animate color */}
                    <animate
                        attributeName="fill"
                        from={getColor(prevYearCat, props.components[0])}
                        to={getColor(category, props.components[0])}
                        begin="mouseover"
                        dur={duration}
                        fill="freeze"
                    />
                    {/* Animate y position */}
                    <animate
                        attributeName="y"
                        from={barHeight - (prevYearScore * barHeight / 100)}
                        to={barHeight - (donor.score * barHeight / 100)}
                        begin="mouseover"
                        dur={duration}
                        fill="freeze"
                    />
                    </rect>
                         {/* Marker for previous year's score */}
                    {prevYearMarkerPosition && (
                        <rect
                            fill="white"
                            width={bw}
                            height="1"
                            x={(barWidth - bw) / 2}
                            y={prevYearMarkerPosition}
                        />
                    )}
                    
                </g>
            </SVG>
            <div className={'donor-label'} style={{height:barWidth.toString()+'px'}}><span>{donor.display_name}</span></div>
        </div>

    );
}
export default DonorBar;