import React, {createRef} from "react";
import {getColor} from "../swatches/getColor";
import SVG from "./SVG";

const DonorBar = (props) => {
    const barProportion = .8;

    const donor = props.donor;
    const thisBar = createRef(); // we attach this DOM ref to the donor data object and pass it up through props.onChildClick
    donor.barRef = thisBar;

    const barWidth = props.isActive ? 3 * props.barWidth : props.barWidth;
    const barHeight = props.barHeight;
    const category = donor.performance_group;

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
                        height={donor.score * barHeight/100}
                        x={(barWidth-bw)/2}
                        y={barHeight - (donor.score * barHeight/100)}
                    />
                </g>
            </SVG>
            <div className={'donor-label'} style={{height:barWidth.toString()+'px'}}><span>{donor.display_name}</span></div>
        </div>

    );
}
export default DonorBar;