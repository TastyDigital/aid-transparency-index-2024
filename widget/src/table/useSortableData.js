import React from 'react';
import {categories} from '../swatches/getColor';

const useSortableData = (items, config = null) => {

    const [sortConfig, setSortConfig] = React.useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            //console.log(sortConfig);
            sortableItems.sort((a, b) => {
                let apos = a[sortConfig.key];
                let bpos = b[sortConfig.key];
                if(sortConfig.key === 'performance_group') {
                    apos = categories.findIndex((e) => e === apos);
                    bpos = categories.findIndex((e) => e === bpos);
                }
                if ( apos < bpos) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if ( apos > bpos ) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });

        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {

        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    return { items: sortedItems, requestSort, sortConfig };
}
export default useSortableData;
