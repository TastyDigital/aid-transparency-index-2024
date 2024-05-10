import Results from './results_2022.json';
//console.log('Results', Results);
const data = [];
//const groups = [];
const components = [
    { index:0, value:'Organisational planning and commitments', weight:'15' },
    { index:1, value:'Joining-up development data', weight:'20'},
    { index:2, value:'Finance and budgets', weight:'25'},
    { index:3, value:'Project attributes', weight:'20'},
    { index:4, value:'Performance', weight:'20'}
];
Object.keys(Results).map((ati,index) => {
    let label = Results[ati].name + ' (' + Results[ati].score.toFixed(1) + ')';

    Results[ati].label = label;
    Results[ati].id = index;

    // surface component weighted scores to help with table sorting...
    for (let i = 0; i<components.length; i++){
        Results[ati]['component_'+components[i].index] = Results[ati]['components'][components[i].value]['weighted_score']
    }

    // using array.filter() so can probably remove this groups export
    // let grp = Results[ati]['performance_group'].replace(/\s+/g, '-').toLowerCase();
    // groups[grp] = groups[grp] || [];

    //return [ data.push(Results[ati]), groups[grp].push(Results[ati])];
    return data.push(Results[ati]);
});
// console.log('data', data);
// console.log('groups', groups);
export { components, data };

