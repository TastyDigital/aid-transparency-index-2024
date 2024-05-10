import {getColor, categories} from '../swatches/getColor';
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {exportComponentAsPNG} from "react-component-export-image";

const CanvasGraph = (props) => {
    //console.log('props', props);
    // const [hidden, setHidden] = useState({ display:'block' });
    const [chartDimensions, setChartDimensions] = useState(props.dimensions);

    const canvasRef = useRef();

    const data = props.data;
    const spacer = 24;
    //const dimensions = props.dimensions;
    const padding = 10;

    const sizeThreshold = 3;

    const groups = [];

    const agencySlug = (props.agency !== undefined) ? props.agency.replace(', ', '-') : '';
    const graphHeight = (chartDimensions.width*3/4)-(2*padding);

    useLayoutEffect(() => {

        const handleResize = () => {
            if (canvasRef.current !== undefined) {
                setChartDimensions( props.dimensions );
            }
        }
        handleResize()
        // window resize causing error in DonorLegend .getBoundingClientRect()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [props.dimensions]);

    useEffect(() => {
        // if(dimensions.width !== props.width){ // triggers only second time provided correct dimensions not in settings
        const canvas = canvasRef.current

        const ctx = canvas.getContext('2d');

        // console.log('agency',agencySlug);
        // console.log('h',dimensions.height)

        let catCount = categories.length;
        let unitCount = data.length;
        let target = false;

        categories.map( (category, key) => {
            let groupData = data.filter( donor => donor['performance_group'] === category);
            let thisGroup = [];
            thisGroup['label'] = category;
            thisGroup['color'] = getColor(category, props.components[2]); //default
            thisGroup['donors'] = [];
            groupData.map( (donor, id) => {
               // console.log('name',donor.name);
                if(donor.name === agencySlug) {
                    target = {'cat':key, 'donor':donor.id, 'label': donor.label};
                    // console.log('found', donor)
                }
                return thisGroup['donors'].push( {
                    id: donor.id,
                    score: ((donor.score) * (graphHeight/100)).toFixed(2)
                })
            })
            if(thisGroup['donors'].length < sizeThreshold) {
                // threshold for assuring same width as spacer for group
                catCount += 1;
                unitCount = unitCount - (thisGroup['donors'].length);
            }else{
                unitCount -= 1; /* area graph so last element has no width for calculating steps */
            }
             return groups.push(thisGroup);
        })

        const unit = ((chartDimensions.width - ((catCount-1) * spacer) - (2 * padding))/unitCount).toFixed(2);
        // console.log('unit',unit)
        // console.log('unitCount',unitCount)


            // draw background box
            ctx.beginPath();
            ctx.moveTo( 0,0);
            ctx.lineTo( chartDimensions.width ,0);
            ctx.lineTo( chartDimensions.width ,props.height);
            ctx.lineTo( 0 ,props.height);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

        let xPlot = 0;
        let aggregate = padding;
        //console.log('groups', groups);
        groups.forEach((element, index) => {
            //console.log(element.color);
            //console.log(element.label);
            if(target && target.cat !== index){
                // we have a target, if not in this group category soften color
                // element.color = LightenDarkenColor(getColor(element.label, props.components[0]), 25);
                // element.color = getColor(element.label, props.components[0]);
                element.color = "#ececec";
            }

            ctx.beginPath();
            ctx.moveTo( (xPlot * unit) + aggregate ,graphHeight + padding);
            if(element.donors.length < sizeThreshold) {
                ctx.lineTo((xPlot * unit) + aggregate , ((graphHeight + padding)-element.donors[0].score).toFixed(1));
                ctx.lineTo((xPlot * unit) + aggregate + spacer, ((graphHeight + padding)-element.donors[element.donors.length-1].score).toFixed(1));
                ctx.lineTo((xPlot * unit) + aggregate + spacer, (graphHeight + padding));
                ctx.moveTo( (xPlot * unit) + aggregate ,(graphHeight + padding));

                if(target && target.cat === index) {
                    element.donors.forEach((donor, i) => {
                        if (target.donor === donor.id) {
                            target.x = (xPlot * unit) + aggregate;
                            target.y = ((graphHeight + padding) - donor.score).toFixed(1);
                        }
                    })
                }

                aggregate = aggregate + spacer;
            }else{
                element.donors.forEach((donor, i) => {
                    ctx.lineTo((xPlot * unit) + aggregate , ((graphHeight + padding)-donor.score).toFixed(1));

                    if(target && target.donor === donor.id && target.cat === index) {
                        target.x = (xPlot * unit) + aggregate;
                        target.y = ((graphHeight + padding)-donor.score).toFixed(1);

                    }
                    if(i < element.donors.length-1){
                        xPlot += 1;

                        // console.log('xPlot', xPlot)
                        // console.log('i', i)
                    }


                });
                ctx.lineTo((xPlot * unit) + aggregate , (graphHeight + padding));
                //xPlot += 1;
            }
            ctx.fillStyle = element.color;
            ctx.fill();

            aggregate = (xPlot * unit) + aggregate + spacer;
            xPlot = 0;


        });
        // console.log('target',target)
        if(target){
            let color = getColor(categories[target.cat], props.components[4]);
            ctx.beginPath();
            ctx.setLineDash([10, 5]);
            ctx.moveTo( 0 ,target.y);
            ctx.lineTo( target.x ,target.y);
            ctx.strokeStyle = color;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(target.x ,target.y, 4, 0, 2 * Math.PI);
            ctx.setLineDash([]);
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.stroke();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(target.x ,(graphHeight + padding));
            ctx.arc(target.x ,(graphHeight + padding), 4, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            ctx.beginPath();
            ctx.font = '12px sans-serif';
            ctx.fillStyle = color;

            let text = ctx.measureText(target.label);
            let textX = (target.x + text.width + padding > chartDimensions.width) ? chartDimensions.width - text.width - padding : target.x + 6;
            //let textY = (Number(target.y) - 18 < 0 ) ? 'hanging': 'bottom';
            // console.log('textX',textX);
            //console.log('posY',textY);// 56;
            //ctx.moveTo(posX, posY);
            ctx.textBaseline = 'bottom';
            ctx.fillText(target.label, textX, target.y-6)


        }
        // let bitmap = document.getElementById('graph-'+props.selfRef);
        //console.log(document.querySelectorAll("div[data-id="+props.selfRef+"].parentNode"))
        // Canvas2PNG(canvas, bitmap, target.label)

        // }


    }, [props, chartDimensions, agencySlug, data, graphHeight, groups]);

    return (
        <>
            <canvas ref={canvasRef} width={chartDimensions.width} height={graphHeight+(2*padding)} />
            <div className="export-buttons left" style={{maxWidth:chartDimensions.width+'px'}}>
                <button onClick={() => exportComponentAsPNG(canvasRef, 'ati-graph.png', '#FFFFFF')} >
                    Export Graph Image
                </button>
            </div>
        </>
    );

}

export default CanvasGraph