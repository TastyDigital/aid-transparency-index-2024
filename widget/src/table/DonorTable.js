import React from 'react';
import useSortableData from './useSortableData';
import './table.css';
import {getColor} from '../swatches/getColor';
import ReactTooltip from "react-tooltip";

const DonorTable = (props) => {
    const { items, requestSort, sortConfig } = useSortableData(props.data);

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return 'sorter';
        }
        return sortConfig.key === name ? sortConfig.direction + ' sorter' : 'sorter';
    };
    const getRowLink = (link) => {
        if (link !== undefined)
            return window.location.href = link;
    }
    const getRowClass = (link) => {
        if (link !== undefined)
            return ['clickable-row'];
    }
    const renderTitle = (donor) => {
        if (donor.title !== undefined){
            // console.log('l',window.location)
            // The bar’s blur event is blocking onCLick and href link, onMouseDown event triggers before blur..
            return (<a href={donor.link} onMouseDown={(e)=>(window.location.href = e.target.href)} title={donor.title.rendered}>{donor.display_name}</a>)
        }else{
            return (<span>{donor.display_name}</span>)
        }
    }
    const renderGroup = (donor) => {
        const perfSlug = donor.performance_group.replace(' ', '-').toLowerCase();
        const thisClass = "group-badge group-" + perfSlug;
        const bgcolor = getColor(donor.performance_group, props.components[1])
        return <div className={thisClass} style={{backgroundColor:bgcolor}}>{donor.performance_group}</div>
    }
    const renderScore = (donor) => {
        const bgcolor = getColor(donor.performance_group, props.components[3])
        const barColor = getColor(donor.performance_group, props.components[0])
        return <div className='score-bar' style={{backgroundColor:bgcolor}} data-tip={donor.score_rounded + ' / 100'} data-for='tabledata'>
            <div className='fill' style={{width:donor.score+'%',backgroundColor:barColor}}/>
        </div>
    }
    let rankCounter = 0;
    let equalRank = 0;
    //console.log('props.data[0].link',props.data[44]['link'])
    return (
        <>
            <div className="table-responsive">
        <table width='100%' cellPadding={0} cellSpacing={0} border={0}>
            <caption>Donor Agencies</caption>

            <colgroup>
                <col span="1" style={{width: '5%', minWidth:'70px'}}/>
                <col span="1" style={{width: '20%'}}/>
                <col span="1" style={{width: '18%'}}/>
                <col span="1" style={{width: '10%', maxWidth: '200px'}}/>
                <col span="1" style={{width: '10%', maxWidth: '200px'}}/>
                <col span="1" style={{width: '10%', maxWidth: '200px'}}/>
                <col span="1" style={{width: '10%', maxWidth: '200px'}}/>
                <col span="1" style={{width: '10%', maxWidth: '200px'}}/>
                <col span="1" style={{width: '7%', minWidth:'96px'}}/>
            </colgroup>

            <thead>
            <tr>
                <th
                    className={getClassNamesFor('rank')}>
                    <button
                        type="button"
                        onClick={() => requestSort('rank')}
                        style={{whiteSpace:'nowrap'}}
                    >
                        Rank
                    </button>
                </th>
                <th
                    className={getClassNamesFor('name')} >
                    <button
                        type="button"
                        onClick={() => requestSort('name')}
                        style={{whiteSpace:'nowrap'}}
                    >
                        Name
                    </button>
                </th>
                <th
                    className={getClassNamesFor('score')} >
                    <button
                        type="button"
                        onClick={() => requestSort('score')}
                        style={{whiteSpace:'nowrap'}}
                    >
                        Score
                    </button>
                </th>
                {props.components.slice(0).reverse().map((component, index) => (
                    <th key={index}
                        className={getClassNamesFor("component_"+component.index)}>
                        <button
                        type="button"
                        onClick={() => requestSort("component_"+component.index)}
                        >
                            {component.value}
                        </button>
                    </th>
                ))}
                <th
                    className={getClassNamesFor('performance_group')}>
                    <button
                        type="button"
                        onClick={() => requestSort('performance_group')}
                        style={{whiteSpace:'nowrap'}}
                    >
                        Category
                    </button>
                </th>
            </tr>
            </thead>
            <tbody>
            {items.map((item) => {
                return (
                    <tr key={item.id} className={getRowClass(item.link)} onClick={() => getRowLink(item.link)}>
                        <td className="centered">{item.rank_combined}</td>
                        <td>{renderTitle(item)}</td>
                        <td className='score-cell'>{renderScore(item)}</td>
                        {props.components.slice(0).reverse().map((component, index) => (
                            <td key={index} className="centered">
                                {item['component_'+component.index].toFixed(1)} / {component.weight}.0
                            </td>
                        ))}
                        <td className='category-cell'>{renderGroup(item)}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
            </div>
            <ReactTooltip id='tabledata'/>
            </>
    );
}
export default DonorTable;