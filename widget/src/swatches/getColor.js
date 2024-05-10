import palette from './palette';
import {components} from '../data/Data';

const categories = ["Very good", "Good", "Fair", "Poor", "Very poor"];

const getColor = (category, component) => {
    const colorGroup = palette.keys();
    let color=[];
    for (const key of colorGroup) {
        if(categories[key] === category){
            color = components
                .filter( comp => {
                    return comp.value === component.value
                })
                .map( comp => {
                    return '#' + escape(palette[key]['entries'][comp.index].color.hex);
                })
        }
    }
    return color[0];
}


export { categories, getColor };