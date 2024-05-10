import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import './App.css';
import BarChart from './barchart/BarChart';
import DonorTable from './table/DonorTable';
import CanvasGraph from './graph/CanvasGraph'
import {data, components} from './data/Data';


const rootComponents =  {
    barchart: BarChart,
    table: DonorTable,
    graph: CanvasGraph
}


function App({ settings }) {

    const frameRef = useRef();

    const [donors, setDonors] = useState(data);
    const [dimensions, setDimensions] = useState({ width:settings.width, height:settings.height });
    const [loading, setLoading] = useState(true);



    useLayoutEffect(() => {
        const handleResize = () => {
            if (frameRef.current) {
                setDimensions({
                    width: frameRef.current.offsetWidth,
                    height: frameRef.current.offsetHeight
                });
            }
        }
        handleResize()
        // window resize causing error in DonorLegend .getBoundingClientRect()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, []);


    // first set up component based on shortcode setting
    let DataComponent = rootComponents.barchart;
    if(rootComponents[settings.display] !== undefined){
        DataComponent = rootComponents[settings.display]
    }

    useEffect(() => {

        // next we gonna add extra data to the donors data array from Wordpress API
        const mergeDonors = (wpdonors) => {
            let donorData = donors; // we are going to augment the extra data onto this
            wpdonors.forEach(d => {
                d.name = d.cmb2.ati_donor_meta_2022_metabox.ati_donor_meta_2022_code.replace(', ', '-');
                d.lang = d.cmb2.ati_page_2022_meta_details.ati_page_2022_meta_language;
                //console.log('d.lang',d.lang)
            })
            let findDonor = name => wpdonors.find(d => (d.name === name && d.lang === 'en'));
            donorData.forEach(donor => {
                let wpdonor = findDonor(donor.name);
                if(wpdonor !== undefined){
                    // console.log('wpdonor', wpdonor);
                    let footnote = wpdonor.cmb2.ati_donor_meta_2022_metabox.ati_donor_meta_2022_footnote;
                    let {link, title} = wpdonor;
                    Object.assign(donor,{link, title, footnote})
                }

            })
            setDonors(donorData);
            setLoading(false);
        }

        async function loadDonors() {
            const response = await fetch('/wp-json/wp/v2/donors2022/?per_page=100');
            if(!response.ok) {
                // oups! something went wrong
                return;
            }
            return await response.json();
        }
        loadDonors().then((wpdonors) => {
            mergeDonors(wpdonors);
        });
    }, [donors])

    return (
        <div className="App" ref={frameRef}>
            <DataComponent data={donors} loading={loading} components={components} dimensions={dimensions} {...settings} />
        </div>
    );
}

export default App;
