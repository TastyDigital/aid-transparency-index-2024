import React from "react";
import {categories, getColor} from "../swatches/getColor";


const DonorData = (props) => {
    if (props.activeDonor.id !== undefined) {
        let donor = props.activeDonor;
        const ComponentOrder = [ 0, 2, 3, 1, 4 ];
        //     'Organisational planning and commitments',
        //     'Finance and budgets',
        //     'Project attributes',
        //     'Joining-up development data',
        //     'Performance'
        // ];
        const ComponentArray = ComponentOrder.map(index => {
            return props.components.slice(0)[index];
        });
        console.log('components',ComponentArray)
        const components = ComponentArray.map(item => {
            return (<li key={item.index} style={{borderColor:getColor(donor.performance_group, item)}}><strong>{donor.components[item.value].weighted_score.toFixed(0)}/{donor.components[item.value].out_of}</strong> - {item.value}</li>)
        });

        const renderTitle = (donor) => {
            if (donor.title !== undefined){
               // console.log('l',window.location)
                // The bar’s blur event is blocking onCLick and href link, onMouseDown event triggers before blur..
                return (<a href={donor.link} onMouseDown={(e)=>(window.location.href = e.target.href)} dangerouslySetInnerHTML={{__html: donor.title.rendered  }} />)
            }else{
                return (<span>{donor.display_name}</span>)
            }
        }
        const showFootnote = (footnote) => {
            if(footnote !== undefined && footnote !== ''){
                return (<p className='small footnote'>{footnote}</p> )
            }
        }
        return (
            <div>
                <div className='data-title'>
                    <h3>
                        <i className="circle" style={{backgroundColor:getColor(donor.performance_group, props.components[0])}} />
                        {renderTitle(donor)}
                    </h3>
                </div>
                <div className='data-position'>
                    <span className='data-performance'>Performance: <strong>{donor.performance_group}</strong></span>
                    <span className='data-rank'>Rank: <strong>#{donor.rank_combined}</strong></span>
                    <span className='data-score'>Score: <strong>{donor.score_rounded}</strong></span>
                </div>
                <ul className='data-components'>
                    {components}
                </ul>
                {showFootnote(donor.footnote)}
            </div>
        )
    }
    return null;
}

const DonorLegend = (props) => {

    const cats = categories.map( (category, k) => {
        return (
            <div key={k} className='group-title'>
                <h3 style={{borderColor:getColor(category, props.components[0]), color:getColor(category, props.components[0])}}>
                    {category}
                </h3>
            </div>)
    })


    return (
        <div className='legend'>
                <div className='panel datasheet'
                     style={props.panelStyles}
                     //onMouseDown={props.hasClicked}
                >
                    { /* (props.activeDonor.id !== undefined) || cats */ }
                    <DonorData {...props} />
                </div>
        </div>
    )

}
export default DonorLegend