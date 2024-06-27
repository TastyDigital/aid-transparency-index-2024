import React, {useState, useRef, useLayoutEffect, useEffect} from 'react';
import {getColor, categories} from '../swatches/getColor';
import Bar from "./Bar";
import ReactTooltip from "react-tooltip";
import './barchart.css';
import Legend from './Legend';
import SVG from "./SVG";
import Marker from "./Marker";

// import { exportComponentAsPDF, exportComponentAsPNG } from "react-component-export-image";

const ChartAxis = (props) => {
    const ticks = [];
    const side = props.edge;
    for (let step = 100; step >= 0; step-=10) {
        // Runs 5 times, with values of step 0 through 4.
        //console.log('Walking east one step',step);
        ticks.push(<div key={step} className={'tick tick-'+step} style={{top:(100-step)+'%'}}>{step}</div> )
    }
    return (
        <div className={`yAxis-measure ${side}`}>
            {ticks}
        </div>
    )
}

const BarChart = (props) => {

    const [isActive, setIsActive] = useState({});
    const [chartDimensions, setChartDimensions] = useState({'width':props.dimensions.width});
    const [legendStyles, setLegendStyles] = useState({transform: 'translateX(0)'});


    const catSpacingProportion = 0; // space between performance categories
    const sidePad = 24; // for y axis measure


    const frameRef = useRef();

    const barWidth = ((chartDimensions.width - (sidePad*2) ) / ( props.data.length + (categories.length * catSpacingProportion) + 2 )).toFixed(2); // the extra 2 allows for bar expansion

    useEffect(() => {
        const positionStyles = {
            transform: 'translateX(0)'
        }
        let panelStyles = {};
        if(typeof isActive['performance_group'] !== "undefined") {
            // we have an active bar
            panelStyles = {
                borderColor: getColor(isActive['performance_group'], props.components[2]),
                color: getColor(isActive['performance_group'], props.components[0])
            }

            if(isActive.barRef.current){
                let barx = isActive.barRef.current.getBoundingClientRect().x - chartDimensions.x;
                panelStyles = (barx > chartDimensions.width / 2) ?
                    {
                        ...panelStyles,
                        transform: 'translateX(' + (barx - chartDimensions.width - barWidth).toString() + 'px)'
                    } :
                    {
                        ...panelStyles,
                        transform: 'translateX(' + (barx - chartDimensions.width + (barWidth * 3) + 360).toString() + 'px)'
                    }
            }
        }
        setLegendStyles({
            ...positionStyles,
            ...panelStyles
        })

    }, [isActive, barWidth, chartDimensions, props.components]);

    const childBarClick = (donor) => {
        //console.log('donor', donor)
        if(isActive.id !== donor.id && donor.eventType !== 'blur'){
            //alert('open '+donor.name+' data sheet page');
            setIsActive(donor);
        }else{
            if(donor.eventType === 'click' && donor.link !== undefined){
                // click already opened bar
                window.location = donor.link;
                return;
            }
            setIsActive({});
        }
    }

    let chartClass = ['barchart'];
    if(typeof isActive.id !== "undefined") {
        chartClass.push('active-chart');
    }

    useLayoutEffect(() => {

        const handleResize = () => {
            if (frameRef.current !== undefined) {
                setChartDimensions(frameRef.current.getBoundingClientRect());
            }
        }
        handleResize()
        // window resize causing error in DonorLegend .getBoundingClientRect()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, []);

    // ToDo: support accessibility roaming across bars with arrow keys
    return (
        <div className={chartClass.join(' ')}
             style={{paddingLeft:sidePad+'px', paddingRight:sidePad+'px'}}
             tabIndex="0"
             ref={frameRef}
        >
            <div className='bargroups'>
            {categories.map( (category, k) => {
                let groupData = props.data.filter( donor => donor['performance_group'] === category);
                let flexGrow = groupData.length > 4 ? 1 : 0; // handle collapsing width of groups with very few donors.

                let groupClass = ['category-group', 'category-'+category.replace(/\s+/g, '-').toLowerCase()];
                if(category === isActive.performance_group) {
                    groupClass.push('active-group');
                }

                return (
                    <div key={k}
                         className={groupClass.join(' ')}
                         style={{paddingRight: (barWidth * catSpacingProportion)/2 +'px', paddingLeft: (barWidth * catSpacingProportion)/2 +'px', flexGrow: flexGrow}}
                    >
                        <div
                            className='group-title'
                            style={{ paddingRight: barWidth*.25 +'px' }}
                            data-tip={category}
                        >
                            <span style={{backgroundColor:getColor(category, props.components[0])}}>
                                <span>{category}</span>
                            </span>
                        </div>
                        <div className={'group-bars'}>
                        {groupData.map( (donor, id) => {
                            return (
                                <Bar
                                    key={id}
                                    isActive={donor.id===isActive.id}
                                    data={groupData}
                                    components={props.components}
                                    barWidth={barWidth}
                                    barHeight={props.height}
                                    donor={donor}
                                    onChildClick={childBarClick}
                                />
                            )}
                        )}
                        </div>
                        <div className='category-grid' />
                    </div>
                )
            })}
            </div>
            <ReactTooltip id='pointerdata' getContent={ datumAsText => {
                if (datumAsText === null) {
                    return;
                }
                let d = JSON.parse(datumAsText);
                // console.log('d',d)
                if (isActive.id !== undefined && isActive.id !== d.id) {
                    // not currently activated donor
                    return null;
                }
                if(!d.isActive) {
                    return (<p><strong>{d.name}</strong><br/>Rank: #{d.rank}<br />Score: {d.score}</p>)
                }else{
                    return (<p><strong>{d.label}</strong><br/>{d.component.name}: {d.component.weighted_score.toFixed(1)}/{d.component.out_of}</p>)
                    }
                }

            } />
            <Legend components={props.components} activeDonor={isActive} panelStyles={legendStyles} />
            <ChartAxis edge={"left-side"} />
            <ChartAxis edge={"right-side"} />
            <div className='chart-key'>
                <div className='colour-key'> 
                    <SVG
                        title='colour-keys'
                        description='colour-keys'
                        height={'10'}
                        width={'35'}
                        className={'colour-keys'}
                    >
                        <rect style={{fill:getColor('Very good', props.components[0])}} width="6.26" height="9.95"/><rect style={{fill:getColor('Good', props.components[0])}} x="7.26" y="0" width="6.26" height="9.95"/><rect style={{fill:getColor('Fair', props.components[0])}} x="14.41" y="0" width="6.26" height="9.95"/><rect style={{fill:getColor('Poor', props.components[0])}} x="21.56" y="0" width="6.26" height="9.95"/><rect style={{fill:getColor('Very poor', props.components[0])}} x="28.72" y="0" width="6.26" height="9.95"/>
                    </SVG>
                    <label>2024 Score</label>
                </div>
                <div className='last-year-marker'>
                    <Marker />
                    <label>2022 Score</label></div>
            </div>
        </div>
    );
}

export default BarChart

