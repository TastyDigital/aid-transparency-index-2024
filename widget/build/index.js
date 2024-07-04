/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.css */ "./src/App.css");
/* harmony import */ var _barchart_BarChart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./barchart/BarChart */ "./src/barchart/BarChart.js");
/* harmony import */ var _table_DonorTable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./table/DonorTable */ "./src/table/DonorTable.js");
/* harmony import */ var _graph_CanvasGraph__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./graph/CanvasGraph */ "./src/graph/CanvasGraph.js");
/* harmony import */ var _data_Data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./data/Data */ "./src/data/Data.js");







const rootComponents = {
  barchart: _barchart_BarChart__WEBPACK_IMPORTED_MODULE_2__["default"],
  table: _table_DonorTable__WEBPACK_IMPORTED_MODULE_3__["default"],
  graph: _graph_CanvasGraph__WEBPACK_IMPORTED_MODULE_4__["default"]
};
function App({
  settings
}) {
  const frameRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [donors, setDonors] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_data_Data__WEBPACK_IMPORTED_MODULE_5__.data);
  const [dimensions, setDimensions] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    width: settings.width,
    height: settings.height
  });
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const handleResize = () => {
      if (frameRef.current) {
        setDimensions({
          width: frameRef.current.offsetWidth,
          height: frameRef.current.offsetHeight
        });
      }
    };
    handleResize();
    // window resize causing error in DonorLegend .getBoundingClientRect()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // first set up component based on shortcode setting
  let DataComponent = rootComponents.barchart;
  if (rootComponents[settings.display] !== undefined) {
    DataComponent = rootComponents[settings.display];
  }
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // next we gonna add extra data to the donors data array from Wordpress API
    const mergeDonors = wpdonors => {
      let donorData = donors; // we are going to augment the extra data onto this
      wpdonors.forEach(d => {
        d.name = d.cmb2.ati_donor_meta_2024_metabox.ati_donor_meta_2024_code.replace(', ', '-');
        d.lang = d.cmb2.ati_page_2024_meta_details.ati_page_2024_meta_language;
        // console.log('d.name',d.name);
        // console.log('d.lang',d.lang);
      });
      let findDonor = name => wpdonors.find(d => d.name === name && d.lang === 'en');
      donorData.forEach(donor => {
        let wpdonor = findDonor(donor.name);
        if (wpdonor !== undefined) {
          let footnote = wpdonor.cmb2.ati_donor_meta_2024_metabox.ati_donor_meta_2024_footnote;
          let {
            link,
            title
          } = wpdonor;
          Object.assign(donor, {
            link,
            title,
            footnote
          });
          // console.log('donor', donor);
        }
      });
      setDonors(donorData);
      setLoading(false);
    };
    async function loadDonors() {
      const response = await fetch('/wp-json/wp/v2/donors2024/?per_page=100');
      if (!response.ok) {
        // oups! something went wrong
        return;
      }
      return await response.json();
    }
    loadDonors().then(wpdonors => {
      mergeDonors(wpdonors);
    });
  }, [donors]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "App",
    ref: frameRef
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(DataComponent, {
    data: donors,
    loading: loading,
    components: _data_Data__WEBPACK_IMPORTED_MODULE_5__.components,
    dimensions: dimensions,
    ...settings
  }));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ }),

/***/ "./src/barchart/Bar.js":
/*!*****************************!*\
  !*** ./src/barchart/Bar.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../swatches/getColor */ "./src/swatches/getColor.js");
/* harmony import */ var _SVG__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SVG */ "./src/barchart/SVG.js");
/* harmony import */ var _Marker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Marker */ "./src/barchart/Marker.js");





const DonorBar = props => {
  const barProportion = .8;
  const donor = props.donor;
  //console.log('donor.history', donor.history);
  //const thisBar = createRef(); // we attach this DOM ref to the donor data object and pass it up through props.onChildClick
  const thisBar = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null); // Updated to useRef which is more appropriate for refs in functional components

  let duration = .5;
  donor.barRef = thisBar;
  const barWidth = props.isActive ? 3 * props.barWidth : props.barWidth;
  const barHeight = props.barHeight;
  const category = donor.performance_group;
  const color = (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(category, props.components[0]);

  // Check if donor.history exists and is an array, then find the 2022 entry
  const prevYearData = Array.isArray(donor.history) ? donor.history.find(entry => entry.year === "2022") : null;
  const prevYearScore = prevYearData ? prevYearData.score : null; // Safeguard in case no data found
  const prevYearCat = prevYearData ? (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.convertToSentenceCase)(prevYearData.performance_group) : null; // Safeguard in case no data found
  const prevYearColor = (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(prevYearCat, props.components[0]);
  if (prevYearScore !== null) {
    // console.log('name', donor.name);
    // console.log('prevYearScore', prevYearScore);
    // console.log('score', donor.score);
    // console.log('prevYearScore - score', Math.abs(prevYearScore - donor.score));
    duration = Math.abs(prevYearScore - donor.score) * 0.05;
    //console.log('duration', duration);
  }

  // Calculate position for the previous year's marker
  const prevYearMarkerPosition = prevYearScore ? barHeight - prevYearScore * barHeight / 100 : null;
  const animationTargetRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const heightAnimationRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const colorAnimationRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const yAnimationRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const markerAnimationRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  //console.log('donor.id', donor.id);
  const donorStringId = donor.name.replace(/\s+/g, '-').toLowerCase();
  const bw = props.isActive ? barWidth : (barWidth * barProportion).toFixed(2);
  let ypos = barHeight;
  let timeOut = null;
  let barClass = ['aid-donor', 'donor-' + donorStringId];
  if (props.isActive) {
    barClass.push('active-bar');
  }
  const barClick = e => {
    donor.eventType = e.type; // click, focus, blur
    props.onChildClick(donor);
  };
  const handleMouseEnter = () => {
    if (!heightAnimationRef.current || prevYearMarkerPosition === null) {
      return;
    }
    // Start all animations
    heightAnimationRef.current.beginElement();
    yAnimationRef.current.beginElement();
    markerAnimationRef.current.beginElement();
    clearTimeout(timeOut);
    // Set the initial state immediately
    animationTargetRef.current.setAttribute('fill', prevYearColor);
    timeOut = setTimeout(() => {
      // reset colour
      animationTargetRef.current.setAttribute('fill', color);
      colorAnimationRef.current.beginElement();
    }, duration * 1000);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: barClass.join(' '),
    style: {
      width: barWidth.toString() + 'px',
      cursor: "pointer"
    },
    tabIndex: "-1",
    onClick: barClick,
    onBlur: barClick,
    ref: thisBar,
    onMouseEnter: () => handleMouseEnter()
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_SVG__WEBPACK_IMPORTED_MODULE_2__["default"], {
    title: donor.display_name,
    description: donor.label,
    height: barHeight.toString(),
    width: barWidth.toString(),
    className: 'bar'
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    className: "clickbg",
    width: barWidth.toString(),
    height: barHeight.toString(),
    y: 0,
    x: 0,
    style: {
      fill: 'transparent'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    id: 'bar_' + donor.name,
    className: "component-stack-container"
  }, props.components.map(component => {
    let componentHeight = donor['component_' + component.index] * barHeight / 100;
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
    };
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
      key: component.index,
      className: 'component-stack',
      style: {
        fill: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(category, component)
      },
      name: component.value,
      width: bw,
      height: componentHeight,
      y: ypos + 1,
      x: (barWidth - bw) / 2,
      "data-for": "pointerdata",
      "data-tip": JSON.stringify(donorData),
      "data-background-color": color
    });
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    id: `score_${donor.name} `,
    className: "score-bar-container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    className: "total-score-bar"
    //style={{fill:color}}
    ,
    fill: color,
    name: donor.label,
    width: bw,
    height: donor.score * barHeight / 100,
    x: (barWidth - bw) / 2,
    y: barHeight - donor.score * barHeight / 100,
    ref: animationTargetRef
  }, prevYearMarkerPosition && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    ref: heightAnimationRef,
    attributeName: "height",
    from: prevYearScore * barHeight / 100,
    to: donor.score * barHeight / 100,
    begin: "indefinite",
    dur: duration + 's',
    fill: "freeze"
  }), prevYearMarkerPosition && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    ref: yAnimationRef,
    attributeName: "y",
    from: prevYearMarkerPosition,
    to: barHeight - donor.score * barHeight / 100,
    begin: "indefinite",
    dur: duration + 's'
  }), prevYearMarkerPosition && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    ref: colorAnimationRef,
    attributeName: "fill",
    attributeType: "XML",
    from: prevYearColor,
    to: color,
    begin: "indefinite",
    dur: '.5s'
  })), prevYearMarkerPosition &&
  // <path style={{fill:'#c7d6d7',strokeWidth:0}} d="M0,4.23C8.95-.33,18.86-.69,28.5.97c3.17.64,6.34,1.54,9.5,3.26v.49c-3.17.09-6.34.15-9.5.16-4.74.08-14.27.08-19.01,0-3.17,0-6.34-.07-9.5-.16v-.49Z">
  (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: bw,
    opacity: 1,
    viewBox: "0 0 38 5",
    x: (barWidth - bw) / 2,
    y: prevYearMarkerPosition - barHeight / 2
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: "#c7d6d7",
    width: bw,
    d: "M0,4.23C8.95-.33,18.86-.69,28.5.97c3.17.64,6.34,1.54,9.5,3.26v.49c-3.17.09-6.34.15-9.5.16-4.74.08-14.27.08-19.01,0-3.17,0-6.34-.07-9.5-.16v-.49Z"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    ref: markerAnimationRef,
    attributeName: "opacity",
    from: "0",
    to: "1",
    begin: "indefinite",
    dur: duration + 's',
    fill: "freeze"
  }))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'donor-label',
    style: {
      height: barWidth.toString() + 'px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, donor.display_name)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DonorBar);

/***/ }),

/***/ "./src/barchart/BarChart.js":
/*!**********************************!*\
  !*** ./src/barchart/BarChart.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../swatches/getColor */ "./src/swatches/getColor.js");
/* harmony import */ var _Bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Bar */ "./src/barchart/Bar.js");
/* harmony import */ var react_tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-tooltip */ "./node_modules/react-tooltip/dist/index.es.js");
/* harmony import */ var _barchart_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./barchart.css */ "./src/barchart/barchart.css");
/* harmony import */ var _Legend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Legend */ "./src/barchart/Legend.js");
/* harmony import */ var _SVG__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SVG */ "./src/barchart/SVG.js");
/* harmony import */ var _Marker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Marker */ "./src/barchart/Marker.js");










// import { exportComponentAsPDF, exportComponentAsPNG } from "react-component-export-image";

const ChartAxis = props => {
  const ticks = [];
  const side = props.edge;
  for (let step = 100; step >= 0; step -= 10) {
    // Runs 5 times, with values of step 0 through 4.
    //console.log('Walking east one step',step);
    ticks.push((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: step,
      className: 'tick tick-' + step,
      style: {
        top: 100 - step + '%'
      }
    }, step));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `yAxis-measure ${side}`
  }, ticks);
};
const BarChart = props => {
  const [isActive, setIsActive] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [chartDimensions, setChartDimensions] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    'width': props.dimensions.width
  });
  const [legendStyles, setLegendStyles] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    transform: 'translateX(0)'
  });
  const catSpacingProportion = 0; // space between performance categories
  const sidePad = 24; // for y axis measure

  const frameRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const barWidth = ((chartDimensions.width - sidePad * 2) / (props.data.length + _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.categories.length * catSpacingProportion + 2)).toFixed(2); // the extra 2 allows for bar expansion

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const positionStyles = {
      transform: 'translateX(0)'
    };
    let panelStyles = {};
    if (typeof isActive['performance_group'] !== "undefined") {
      // we have an active bar
      panelStyles = {
        borderColor: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(isActive['performance_group'], props.components[2]),
        color: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(isActive['performance_group'], props.components[0])
      };
      if (isActive.barRef.current) {
        let barx = isActive.barRef.current.getBoundingClientRect().x - chartDimensions.x;
        panelStyles = barx > chartDimensions.width / 2 ? {
          ...panelStyles,
          transform: 'translateX(' + (barx - chartDimensions.width - barWidth).toString() + 'px)'
        } : {
          ...panelStyles,
          transform: 'translateX(' + (barx - chartDimensions.width + barWidth * 3 + 360).toString() + 'px)'
        };
      }
    }
    setLegendStyles({
      ...positionStyles,
      ...panelStyles
    });
  }, [isActive, barWidth, chartDimensions, props.components]);
  const childBarClick = donor => {
    //console.log('donor', donor)
    if (isActive.id !== donor.id && donor.eventType !== 'blur') {
      //alert('open '+donor.name+' data sheet page');
      setIsActive(donor);
    } else {
      if (donor.eventType === 'click' && donor.link !== undefined) {
        // click already opened bar
        window.location = donor.link;
        return;
      }
      setIsActive({});
    }
  };
  let chartClass = ['barchart'];
  if (typeof isActive.id !== "undefined") {
    chartClass.push('active-chart');
  }
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const handleResize = () => {
      if (frameRef.current !== undefined) {
        setChartDimensions(frameRef.current.getBoundingClientRect());
      }
    };
    handleResize();
    // window resize causing error in DonorLegend .getBoundingClientRect()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ToDo: support accessibility roaming across bars with arrow keys
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: chartClass.join(' '),
    style: {
      paddingLeft: sidePad + 'px',
      paddingRight: sidePad + 'px'
    },
    tabIndex: "0",
    ref: frameRef
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bargroups"
  }, _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.categories.map((category, k) => {
    let groupData = props.data.filter(donor => donor['performance_group'] === category);
    let flexGrow = groupData.length > 4 ? 1 : 0; // handle collapsing width of groups with very few donors.

    let groupClass = ['category-group', 'category-' + category.replace(/\s+/g, '-').toLowerCase()];
    if (category === isActive.performance_group) {
      groupClass.push('active-group');
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: k,
      className: groupClass.join(' '),
      style: {
        paddingRight: barWidth * catSpacingProportion / 2 + 'px',
        paddingLeft: barWidth * catSpacingProportion / 2 + 'px',
        flexGrow: flexGrow
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "group-title",
      style: {
        paddingRight: barWidth * .25 + 'px'
      },
      "data-tip": category
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        backgroundColor: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(category, props.components[0])
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, category))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'group-bars'
    }, groupData.map((donor, id) => {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Bar__WEBPACK_IMPORTED_MODULE_2__["default"], {
        key: id,
        isActive: donor.id === isActive.id,
        data: groupData,
        components: props.components,
        barWidth: barWidth,
        barHeight: props.height,
        donor: donor,
        onChildClick: childBarClick
      });
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "category-grid"
    }));
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_tooltip__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: "pointerdata",
    getContent: datumAsText => {
      if (datumAsText === null) {
        return;
      }
      let d = JSON.parse(datumAsText);
      // console.log('d',d)
      if (isActive.id !== undefined && isActive.id !== d.id) {
        // not currently activated donor
        return null;
      }
      if (!d.isActive) {
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, d.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "Rank: #", d.rank, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "Score: ", d.score);
      } else {
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, d.label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), d.component.name, ": ", d.component.weighted_score.toFixed(1), "/", d.component.out_of);
      }
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Legend__WEBPACK_IMPORTED_MODULE_5__["default"], {
    components: props.components,
    activeDonor: isActive,
    panelStyles: legendStyles
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ChartAxis, {
    edge: "left-side"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ChartAxis, {
    edge: "right-side"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "chart-key"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "colour-key"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_SVG__WEBPACK_IMPORTED_MODULE_6__["default"], {
    title: "colour-keys",
    description: "colour-keys",
    height: '10',
    width: '35',
    className: 'colour-keys'
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    style: {
      fill: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)('Very good', props.components[0])
    },
    width: "6.26",
    height: "9.95"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    style: {
      fill: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)('Good', props.components[0])
    },
    x: "7.26",
    y: "0",
    width: "6.26",
    height: "9.95"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    style: {
      fill: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)('Fair', props.components[0])
    },
    x: "14.41",
    y: "0",
    width: "6.26",
    height: "9.95"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    style: {
      fill: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)('Poor', props.components[0])
    },
    x: "21.56",
    y: "0",
    width: "6.26",
    height: "9.95"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    style: {
      fill: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)('Very poor', props.components[0])
    },
    x: "28.72",
    y: "0",
    width: "6.26",
    height: "9.95"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "2024 Score")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "last-year-marker"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Marker__WEBPACK_IMPORTED_MODULE_7__["default"], null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "2022 Score"))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BarChart);

/***/ }),

/***/ "./src/barchart/Legend.js":
/*!********************************!*\
  !*** ./src/barchart/Legend.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../swatches/getColor */ "./src/swatches/getColor.js");



const DonorData = props => {
  if (props.activeDonor.id !== undefined) {
    let donor = props.activeDonor;
    const ComponentOrder = [0, 2, 3, 1, 4];
    //     'Organisational planning and commitments',
    //     'Finance and budgets',
    //     'Project attributes',
    //     'Joining-up development data',
    //     'Performance'
    // ];
    const ComponentArray = ComponentOrder.map(index => {
      return props.components.slice(0)[index];
    });
    console.log('components', ComponentArray);
    const components = ComponentArray.map(item => {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        key: item.index,
        style: {
          borderColor: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(donor.performance_group, item)
        }
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, donor.components[item.value].weighted_score.toFixed(0), "/", donor.components[item.value].out_of), " - ", item.value);
    });
    const renderTitle = donor => {
      if (donor.title !== undefined) {
        // console.log('l',window.location)
        // The bar’s blur event is blocking onCLick and href link, onMouseDown event triggers before blur..
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: donor.link,
          onMouseDown: e => window.location.href = e.target.href,
          dangerouslySetInnerHTML: {
            __html: donor.title.rendered
          }
        });
      } else {
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, donor.display_name);
      }
    };
    const showFootnote = footnote => {
      if (footnote !== undefined && footnote !== '') {
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
          className: "small footnote"
        }, footnote);
      }
    };
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "data-title"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
      className: "circle",
      style: {
        backgroundColor: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(donor.performance_group, props.components[0])
      }
    }), renderTitle(donor))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "data-position"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "data-performance"
    }, "Performance: ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, donor.performance_group)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "data-rank"
    }, "Rank: ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, "#", donor.rank)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "data-score"
    }, "Score: ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, donor.score.toFixed(1)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
      className: "data-components"
    }, components), showFootnote(donor.footnote));
  }
  return null;
};
const DonorLegend = props => {
  const cats = _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.categories.map((category, k) => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: k,
      className: "group-title"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      style: {
        borderColor: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(category, props.components[0]),
        color: (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(category, props.components[0])
      }
    }, category));
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "legend"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "panel datasheet",
    style: props.panelStyles
    //onMouseDown={props.hasClicked}
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(DonorData, {
    ...props
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DonorLegend);

/***/ }),

/***/ "./src/barchart/Marker.js":
/*!********************************!*\
  !*** ./src/barchart/Marker.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const Marker = () => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 38 5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    style: {
      fill: '#c7d6d7',
      strokeWidth: 0
    },
    d: "M0,4.23C8.95-.33,18.86-.69,28.5.97c3.17.64,6.34,1.54,9.5,3.26v.49c-3.17.09-6.34.15-9.5.16-4.74.08-14.27.08-19.01,0-3.17,0-6.34-.07-9.5-.16v-.49Z"
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Marker);

/***/ }),

/***/ "./src/barchart/SVG.js":
/*!*****************************!*\
  !*** ./src/barchart/SVG.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SVG)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);



// Add check for children types, only a limited subset of SVG shapes that it can take
// Sketch SVG to react?
// Path
// Animation
class SVG extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  static propTypes = {
    // Aria Required Properties
    title: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string).isRequired,
    description: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string).isRequired,
    // Sizing
    minx: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
    miny: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
    width: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string).isRequired,
    height: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string).isRequired
  };
  render() {
    const {
      minx,
      miny,
      width,
      height
    } = this.props;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      ...this.props,
      "aria-labelledby": "title desc",
      role: "img",
      preserveAspectRatio: "xMidYMid meet",
      viewBox: `${minx} ${miny} ${width} ${height}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", {
      id: "title"
    }, this.props.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("desc", {
      id: "desc"
    }, this.props.description), this.props.children);
  }
}
SVG.defaultProps = {
  minx: '0',
  miny: '0'
};

/***/ }),

/***/ "./src/data/Data.js":
/*!**************************!*\
  !*** ./src/data/Data.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* binding */ components),
/* harmony export */   data: () => (/* binding */ data)
/* harmony export */ });
/* harmony import */ var _results_2024_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./results_2024.json */ "./src/data/results_2024.json");

//console.log('Results', Results);
const data = [];
//const groups = [];
const components = [{
  index: 0,
  value: 'Organisational planning and commitments',
  weight: '15'
}, {
  index: 1,
  value: 'Joining-up development data',
  weight: '20'
}, {
  index: 2,
  value: 'Finance and budgets',
  weight: '25'
}, {
  index: 3,
  value: 'Project attributes',
  weight: '20'
}, {
  index: 4,
  value: 'Performance',
  weight: '20'
}];
Object.keys(_results_2024_json__WEBPACK_IMPORTED_MODULE_0__).map((ati, index) => {
  _results_2024_json__WEBPACK_IMPORTED_MODULE_0__[ati].label = _results_2024_json__WEBPACK_IMPORTED_MODULE_0__[ati].display_name + ' (' + _results_2024_json__WEBPACK_IMPORTED_MODULE_0__[ati].score.toFixed(1) + ')';
  _results_2024_json__WEBPACK_IMPORTED_MODULE_0__[ati].id = index;

  // surface component weighted scores to help with table sorting...
  for (let i = 0; i < components.length; i++) {
    _results_2024_json__WEBPACK_IMPORTED_MODULE_0__[ati]['component_' + components[i].index] = _results_2024_json__WEBPACK_IMPORTED_MODULE_0__[ati]['components'][components[i].value]['weighted_score'];
  }

  // using array.filter() so can probably remove this groups export
  // let grp = Results[ati]['performance_group'].replace(/\s+/g, '-').toLowerCase();
  // groups[grp] = groups[grp] || [];

  //return [ data.push(Results[ati]), groups[grp].push(Results[ati])];
  return data.push(_results_2024_json__WEBPACK_IMPORTED_MODULE_0__[ati]);
});
console.log('data', data);
// console.log('groups', groups);


/***/ }),

/***/ "./src/graph/CanvasGraph.js":
/*!**********************************!*\
  !*** ./src/graph/CanvasGraph.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../swatches/getColor */ "./src/swatches/getColor.js");
/* harmony import */ var react_component_export_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-component-export-image */ "./node_modules/react-component-export-image/dist/index.js");
/* harmony import */ var react_component_export_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_component_export_image__WEBPACK_IMPORTED_MODULE_2__);




const CanvasGraph = props => {
  //console.log('props', props);
  // const [hidden, setHidden] = useState({ display:'block' });
  const [chartDimensions, setChartDimensions] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(props.dimensions);
  const canvasRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const data = props.data;
  const spacer = 24;
  //const dimensions = props.dimensions;
  const padding = 10;
  const sizeThreshold = 3;
  const groups = [];
  const agencySlug = props.agency !== undefined ? props.agency.replace(', ', '-') : '';
  const graphHeight = chartDimensions.width * 3 / 4 - 2 * padding;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const handleResize = () => {
      if (canvasRef.current !== undefined) {
        setChartDimensions(props.dimensions);
      }
    };
    handleResize();
    // window resize causing error in DonorLegend .getBoundingClientRect()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [props.dimensions]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // if(dimensions.width !== props.width){ // triggers only second time provided correct dimensions not in settings
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // console.log('agency',agencySlug);
    // console.log('h',dimensions.height)

    let catCount = _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.categories.length;
    let unitCount = data.length;
    let target = false;
    _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.categories.map((category, key) => {
      let groupData = data.filter(donor => donor['performance_group'] === category);
      let thisGroup = [];
      thisGroup['label'] = category;
      thisGroup['color'] = (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(category, props.components[2]); //default
      thisGroup['donors'] = [];
      groupData.map((donor, id) => {
        // console.log('name',donor.name);
        if (donor.name === agencySlug) {
          target = {
            'cat': key,
            'donor': donor.id,
            'label': donor.label
          };
          // console.log('found', donor)
        }
        return thisGroup['donors'].push({
          id: donor.id,
          score: (donor.score * (graphHeight / 100)).toFixed(2)
        });
      });
      if (thisGroup['donors'].length < sizeThreshold) {
        // threshold for assuring same width as spacer for group
        catCount += 1;
        unitCount = unitCount - thisGroup['donors'].length;
      } else {
        unitCount -= 1; /* area graph so last element has no width for calculating steps */
      }
      return groups.push(thisGroup);
    });
    const unit = ((chartDimensions.width - (catCount - 1) * spacer - 2 * padding) / unitCount).toFixed(2);
    // console.log('unit',unit)
    // console.log('unitCount',unitCount)

    // draw background box
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(chartDimensions.width, 0);
    ctx.lineTo(chartDimensions.width, props.height);
    ctx.lineTo(0, props.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    let xPlot = 0;
    let aggregate = padding;
    //console.log('groups', groups);
    groups.forEach((element, index) => {
      //console.log(element.color);
      //console.log(element.label);
      if (target && target.cat !== index) {
        // we have a target, if not in this group category soften color
        // element.color = LightenDarkenColor(getColor(element.label, props.components[0]), 25);
        // element.color = getColor(element.label, props.components[0]);
        element.color = "#ececec";
      }
      ctx.beginPath();
      ctx.moveTo(xPlot * unit + aggregate, graphHeight + padding);
      if (element.donors.length < sizeThreshold) {
        ctx.lineTo(xPlot * unit + aggregate, (graphHeight + padding - element.donors[0].score).toFixed(1));
        ctx.lineTo(xPlot * unit + aggregate + spacer, (graphHeight + padding - element.donors[element.donors.length - 1].score).toFixed(1));
        ctx.lineTo(xPlot * unit + aggregate + spacer, graphHeight + padding);
        ctx.moveTo(xPlot * unit + aggregate, graphHeight + padding);
        if (target && target.cat === index) {
          element.donors.forEach((donor, i) => {
            if (target.donor === donor.id) {
              target.x = xPlot * unit + aggregate;
              target.y = (graphHeight + padding - donor.score).toFixed(1);
            }
          });
        }
        aggregate = aggregate + spacer;
      } else {
        element.donors.forEach((donor, i) => {
          ctx.lineTo(xPlot * unit + aggregate, (graphHeight + padding - donor.score).toFixed(1));
          if (target && target.donor === donor.id && target.cat === index) {
            target.x = xPlot * unit + aggregate;
            target.y = (graphHeight + padding - donor.score).toFixed(1);
          }
          if (i < element.donors.length - 1) {
            xPlot += 1;

            // console.log('xPlot', xPlot)
            // console.log('i', i)
          }
        });
        ctx.lineTo(xPlot * unit + aggregate, graphHeight + padding);
        //xPlot += 1;
      }
      ctx.fillStyle = element.color;
      ctx.fill();
      aggregate = xPlot * unit + aggregate + spacer;
      xPlot = 0;
    });
    // console.log('target',target)
    if (target) {
      let color = (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.getColor)(_swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.categories[target.cat], props.components[4]);
      ctx.beginPath();
      ctx.setLineDash([10, 5]);
      ctx.moveTo(0, target.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(target.x, target.y, 4, 0, 2 * Math.PI);
      ctx.setLineDash([]);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(target.x, graphHeight + padding);
      ctx.arc(target.x, graphHeight + padding, 4, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.font = '12px sans-serif';
      ctx.fillStyle = color;
      let text = ctx.measureText(target.label);
      let textX = target.x + text.width + padding > chartDimensions.width ? chartDimensions.width - text.width - padding : target.x + 6;
      //let textY = (Number(target.y) - 18 < 0 ) ? 'hanging': 'bottom';
      // console.log('textX',textX);
      //console.log('posY',textY);// 56;
      //ctx.moveTo(posX, posY);
      ctx.textBaseline = 'bottom';
      ctx.fillText(target.label, textX, target.y - 6);
    }
    // let bitmap = document.getElementById('graph-'+props.selfRef);
    //console.log(document.querySelectorAll("div[data-id="+props.selfRef+"].parentNode"))
    // Canvas2PNG(canvas, bitmap, target.label)

    // }
  }, [props, chartDimensions, agencySlug, data, graphHeight, groups]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("canvas", {
    ref: canvasRef,
    width: chartDimensions.width,
    height: graphHeight + 2 * padding
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "export-buttons left",
    style: {
      maxWidth: chartDimensions.width + 'px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => (0,react_component_export_image__WEBPACK_IMPORTED_MODULE_2__.exportComponentAsPNG)(canvasRef, 'ati-graph.png', '#FFFFFF')
  }, "Export Graph Image")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanvasGraph);

/***/ }),

/***/ "./src/serviceWorker.js":
/*!******************************!*\
  !*** ./src/serviceWorker.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   register: () => (/* binding */ register),
/* harmony export */   unregister: () => (/* binding */ unregister)
/* harmony export */ });
// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
// [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' ||
// 127.0.0.0/8 are considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
function register(config) {
  if (false) {}
}
function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl).then(registration => {
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker == null) {
        return;
      }
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // At this point, the updated precached content has been fetched,
            // but the previous service worker will still serve the older
            // content until all client tabs are closed.
            console.log('New content is available and will be used when all ' + 'tabs for this page are closed. See https://bit.ly/CRA-PWA.');

            // Execute callback
            if (config && config.onUpdate) {
              config.onUpdate(registration);
            }
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a
            // "Content is cached for offline use." message.
            console.log('Content is cached for offline use.');

            // Execute callback
            if (config && config.onSuccess) {
              config.onSuccess(registration);
            }
          }
        }
      };
    };
  }).catch(error => {
    console.error('Error during service worker registration:', error);
  });
}
function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: {
      'Service-Worker': 'script'
    }
  }).then(response => {
    // Ensure service worker exists, and that we really are getting a JS file.
    const contentType = response.headers.get('content-type');
    if (response.status === 404 || contentType != null && contentType.indexOf('javascript') === -1) {
      // No service worker found. Probably a different app. Reload the page.
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister().then(() => {
          window.location.reload();
        });
      });
    } else {
      // Service worker found. Proceed as normal.
      registerValidSW(swUrl, config);
    }
  }).catch(() => {
    console.log('No internet connection found. App is running in offline mode.');
  });
}
function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    }).catch(error => {
      console.error(error.message);
    });
  }
}

/***/ }),

/***/ "./src/swatches/getColor.js":
/*!**********************************!*\
  !*** ./src/swatches/getColor.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   categories: () => (/* binding */ categories),
/* harmony export */   convertToSentenceCase: () => (/* binding */ convertToSentenceCase),
/* harmony export */   getColor: () => (/* binding */ getColor)
/* harmony export */ });
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./palette */ "./src/swatches/palette.js");
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_palette__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _data_Data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/Data */ "./src/data/Data.js");


const categories = ["Very good", "Good", "Fair", "Poor", "Very poor"];
const getColor = (category, component) => {
  const colorGroup = _palette__WEBPACK_IMPORTED_MODULE_0___default().keys();
  let color = [];
  for (const key of colorGroup) {
    if (categories[key] === category) {
      color = _data_Data__WEBPACK_IMPORTED_MODULE_1__.components.filter(comp => {
        return comp.value === component.value;
      }).map(comp => {
        return '#' + escape((_palette__WEBPACK_IMPORTED_MODULE_0___default())[key]['entries'][comp.index].color.hex);
      });
    }
  }
  return color[0];
};
const convertToSentenceCase = theString => {
  const newString = theString.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
    return c.toUpperCase();
  });
  return newString;
};


/***/ }),

/***/ "./src/swatches/palette.js":
/*!*********************************!*\
  !*** ./src/swatches/palette.js ***!
  \*********************************/
/***/ ((module) => {

module.exports = [{
  "type": "group",
  "name": "Blues",
  "entries": [{
    "type": "color",
    "name": "Blue01",
    "color": {
      "model": "RGB",
      "r": 0.1411764770746231,
      "g": 0.7215686440467834,
      "b": 0.9215686321258545,
      "hex": "24B8EB",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=80 G=198 B=239",
    "color": {
      "model": "RGB",
      "r": 0.3137255012989044,
      "g": 0.7764706015586853,
      "b": 0.9372549057006836,
      "hex": "50C6EF",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=124 G=212 B=243",
    "color": {
      "model": "RGB",
      "r": 0.48627451062202454,
      "g": 0.8313725590705872,
      "b": 0.9529411792755127,
      "hex": "7CD4F3",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=167 G=227 B=247",
    "color": {
      "model": "RGB",
      "r": 0.6549019813537598,
      "g": 0.8901960849761963,
      "b": 0.9686274528503418,
      "hex": "A7E3F7",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=204 G=239 B=250",
    "color": {
      "model": "RGB",
      "r": 0.800000011920929,
      "g": 0.9372549057006836,
      "b": 0.9803921580314636,
      "hex": "CCEFFA",
      "type": "global"
    }
  }]
}, {
  "type": "group",
  "name": "Greens",
  "entries": [{
    "type": "color",
    "name": "Green01",
    "color": {
      "model": "RGB",
      "r": 0.5568627715110779,
      "g": 0.7764706015586853,
      "b": 0.250980406999588,
      "hex": "8EC640",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=165 G=209 B=102",
    "color": {
      "model": "RGB",
      "r": 0.6470588445663452,
      "g": 0.8196078538894653,
      "b": 0.4000000059604645,
      "hex": "A5D166",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=187 G=221 B=140",
    "color": {
      "model": "RGB",
      "r": 0.7333333492279053,
      "g": 0.8666666746139526,
      "b": 0.5490196347236633,
      "hex": "BBDD8C",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=210 G=232 B=179",
    "color": {
      "model": "RGB",
      "r": 0.8235294222831726,
      "g": 0.9098039269447327,
      "b": 0.7019608020782471,
      "hex": "D2E8B3",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=229 G=242 B=211",
    "color": {
      "model": "RGB",
      "r": 0.8980392217636108,
      "g": 0.9490196108818054,
      "b": 0.8274509906768799,
      "hex": "E5F2D3",
      "type": "global"
    }
  }]
}, {
  "type": "group",
  "name": "Oranges",
  "entries": [{
    "type": "color",
    "name": "Orange01",
    "color": {
      "model": "RGB",
      "r": 0.9607843160629272,
      "g": 0.5098039507865906,
      "b": 0.125490203499794,
      "hex": "F58220",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=247 G=155 B=77",
    "color": {
      "model": "RGB",
      "r": 0.9686274528503418,
      "g": 0.6078431606292725,
      "b": 0.3019607961177826,
      "hex": "F79B4D",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=249 G=180 B=121",
    "color": {
      "model": "RGB",
      "r": 0.9764705896377563,
      "g": 0.7058823704719543,
      "b": 0.4745098054409027,
      "hex": "F9B479",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=251 G=205 B=166",
    "color": {
      "model": "RGB",
      "r": 0.9843137264251709,
      "g": 0.8039215803146362,
      "b": 0.6509804129600525,
      "hex": "FBCDA6",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=253 G=226 B=203",
    "color": {
      "model": "RGB",
      "r": 0.9921568632125854,
      "g": 0.886274516582489,
      "b": 0.7960784435272217,
      "hex": "FDE2CB",
      "type": "global"
    }
  }]
}, {
  "type": "group",
  "name": "Pinks",
  "entries": [{
    "type": "color",
    "name": "Pink01",
    "color": {
      "model": "RGB",
      "r": 0.9215686321258545,
      "g": 0.03921568766236305,
      "b": 0.5490196347236633,
      "hex": "EB0A8C",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=239 G=59 B=163",
    "color": {
      "model": "RGB",
      "r": 0.9372549057006836,
      "g": 0.23137255012989044,
      "b": 0.6392157077789307,
      "hex": "EF3BA3",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=243 G=108 B=186",
    "color": {
      "model": "RGB",
      "r": 0.9529411792755127,
      "g": 0.42352941632270813,
      "b": 0.729411780834198,
      "hex": "F36CBA",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=247 G=157 B=209",
    "color": {
      "model": "RGB",
      "r": 0.9686274528503418,
      "g": 0.615686297416687,
      "b": 0.8196078538894653,
      "hex": "F79DD1",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=250 G=198 B=228",
    "color": {
      "model": "RGB",
      "r": 0.9803921580314636,
      "g": 0.7764706015586853,
      "b": 0.8941176533699036,
      "hex": "FAC6E4",
      "type": "global"
    }
  }]
}, {
  "type": "group",
  "name": "Purples",
  "entries": [{
    "type": "color",
    "name": "Purple01",
    "color": {
      "model": "RGB",
      "r": 0.4627451002597809,
      "g": 0.43921568989753723,
      "b": 0.7019608020782471,
      "hex": "7670B3",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=145 G=141 B=194 1",
    "color": {
      "model": "RGB",
      "r": 0.5686274766921997,
      "g": 0.5529412031173706,
      "b": 0.7607843279838562,
      "hex": "918DC2",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=173 G=169 B=209",
    "color": {
      "model": "RGB",
      "r": 0.6784313917160034,
      "g": 0.6627451181411743,
      "b": 0.8196078538894653,
      "hex": "ADA9D1",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=200 G=198 B=225",
    "color": {
      "model": "RGB",
      "r": 0.7843137383460999,
      "g": 0.7764706015586853,
      "b": 0.8823529481887817,
      "hex": "C8C6E1",
      "type": "global"
    }
  }, {
    "type": "color",
    "name": "R=228 G=226 B=240",
    "color": {
      "model": "RGB",
      "r": 0.8941176533699036,
      "g": 0.886274516582489,
      "b": 0.9411764740943909,
      "hex": "E4E2F0",
      "type": "global"
    }
  }]
}];

/***/ }),

/***/ "./src/table/DonorTable.js":
/*!*********************************!*\
  !*** ./src/table/DonorTable.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _useSortableData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useSortableData */ "./src/table/useSortableData.js");
/* harmony import */ var _table_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./table.css */ "./src/table/table.css");
/* harmony import */ var _swatches_getColor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../swatches/getColor */ "./src/swatches/getColor.js");
/* harmony import */ var react_tooltip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-tooltip */ "./node_modules/react-tooltip/dist/index.es.js");






const DonorTable = props => {
  const {
    items,
    requestSort,
    sortConfig
  } = (0,_useSortableData__WEBPACK_IMPORTED_MODULE_1__["default"])(props.data);
  const getClassNamesFor = name => {
    if (!sortConfig) {
      return 'sorter';
    }
    return sortConfig.key === name ? sortConfig.direction + ' sorter' : 'sorter';
  };
  const getRowLink = link => {
    if (link !== undefined) return window.location.href = link;
  };
  const getRowClass = link => {
    if (link !== undefined) return ['clickable-row'];
  };
  const renderTitle = donor => {
    if (donor.title !== undefined) {
      // console.log('l',window.location)
      // The bar’s blur event is blocking onCLick and href link, onMouseDown event triggers before blur..
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: donor.link,
        onMouseDown: e => window.location.href = e.target.href,
        title: donor.title.rendered
      }, donor.display_name);
    } else {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, donor.display_name);
    }
  };
  const renderGroup = donor => {
    const perfSlug = donor.performance_group.replace(' ', '-').toLowerCase();
    const thisClass = "group-badge group-" + perfSlug;
    const bgcolor = (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_3__.getColor)(donor.performance_group, props.components[1]);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: thisClass,
      style: {
        backgroundColor: bgcolor
      }
    }, donor.performance_group);
  };
  const renderScore = donor => {
    const bgcolor = (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_3__.getColor)(donor.performance_group, props.components[3]);
    const barColor = (0,_swatches_getColor__WEBPACK_IMPORTED_MODULE_3__.getColor)(donor.performance_group, props.components[0]);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "score-bar",
      style: {
        backgroundColor: bgcolor
      },
      "data-tip": donor.score.toFixed(1) + ' / 100',
      "data-for": "tabledata"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "fill",
      style: {
        width: donor.score + '%',
        backgroundColor: barColor
      }
    }));
  };
  let rankCounter = 0;
  let equalRank = 0;
  //console.log('props.data[0].link',props.data[44]['link'])
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-responsive"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    width: "100%",
    cellPadding: 0,
    cellSpacing: 0,
    border: 0
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("caption", null, "Donor Agencies"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("colgroup", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '5%',
      minWidth: '70px'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '20%'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '18%'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '10%',
      maxWidth: '200px'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '10%',
      maxWidth: '200px'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '10%',
      maxWidth: '200px'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '10%',
      maxWidth: '200px'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '10%',
      maxWidth: '200px'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    span: "1",
    style: {
      width: '7%',
      minWidth: '96px'
    }
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    className: getClassNamesFor('rank')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => requestSort('rank'),
    style: {
      whiteSpace: 'nowrap'
    }
  }, "Rank")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    className: getClassNamesFor('name')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => requestSort('name'),
    style: {
      whiteSpace: 'nowrap'
    }
  }, "Name")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    className: getClassNamesFor('score')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => requestSort('score'),
    style: {
      whiteSpace: 'nowrap'
    }
  }, "Score")), props.components.slice(0).reverse().map((component, index) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    key: index,
    className: getClassNamesFor("component_" + component.index)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => requestSort("component_" + component.index)
  }, component.value))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    className: getClassNamesFor('performance_group')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => requestSort('performance_group'),
    style: {
      whiteSpace: 'nowrap'
    }
  }, "Category")))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, items.map(item => {
    const rank = rankCounter === item.score.toFixed(1) ? equalRank : item.rank;
    equalRank = rank;
    rankCounter = item.score.toFixed(1);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
      key: item.id,
      className: getRowClass(item.link),
      onClick: () => getRowLink(item.link)
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "centered"
    }, rank), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, renderTitle(item)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "score-cell"
    }, renderScore(item)), props.components.slice(0).reverse().map((component, index) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      key: index,
      className: "centered"
    }, item['component_' + component.index].toFixed(1), " / ", component.weight, ".0")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "category-cell"
    }, renderGroup(item)));
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_tooltip__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: "tabledata"
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DonorTable);

/***/ }),

/***/ "./src/table/useSortableData.js":
/*!**************************************!*\
  !*** ./src/table/useSortableData.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../swatches/getColor */ "./src/swatches/getColor.js");


const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = react__WEBPACK_IMPORTED_MODULE_0___default().useState(config);
  const sortedItems = react__WEBPACK_IMPORTED_MODULE_0___default().useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      //console.log(sortConfig);
      sortableItems.sort((a, b) => {
        let apos = a[sortConfig.key];
        let bpos = b[sortConfig.key];
        if (sortConfig.key === 'performance_group') {
          apos = _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.categories.findIndex(e => e === apos);
          bpos = _swatches_getColor__WEBPACK_IMPORTED_MODULE_1__.categories.findIndex(e => e === bpos);
        }
        if (apos < bpos) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (apos > bpos) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);
  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({
      key,
      direction
    });
  };
  return {
    items: sortedItems,
    requestSort,
    sortConfig
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useSortableData);

/***/ }),

/***/ "./src/App.css":
/*!*********************!*\
  !*** ./src/App.css ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/barchart/barchart.css":
/*!***********************************!*\
  !*** ./src/barchart/barchart.css ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/index.css":
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/table/table.css":
/*!*****************************!*\
  !*** ./src/table/table.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/react-component-export-image/dist/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react-component-export-image/dist/index.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports=function(t){var A={};function e(r){if(A[r])return A[r].exports;var n=A[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,e),n.l=!0,n.exports}return e.m=t,e.c=A,e.d=function(t,A,r){e.o(t,A)||Object.defineProperty(t,A,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,A){if(1&A&&(t=e(t)),8&A)return t;if(4&A&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&A&&"string"!=typeof t)for(var n in t)e.d(r,n,function(A){return t[A]}.bind(null,n));return r},e.n=function(t){var A=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(A,"a",A),A},e.o=function(t,A){return Object.prototype.hasOwnProperty.call(t,A)},e.p="",e(e.s=3)}([function(t,A,e){(function(r){var n,i;n=function(){"use strict";
/** @license
   * jsPDF - PDF Document creation from JavaScript
   * Version 1.5.3 Built on 2018-12-27T14:11:42.696Z
   *                      CommitID d93d28db14
   *
   * Copyright (c) 2010-2016 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
   *               2010 Aaron Spike, https://github.com/acspike
   *               2012 Willow Systems Corporation, willow-systems.com
   *               2012 Pablo Hess, https://github.com/pablohess
   *               2012 Florian Jenett, https://github.com/fjenett
   *               2013 Warren Weckesser, https://github.com/warrenweckesser
   *               2013 Youssef Beddad, https://github.com/lifof
   *               2013 Lee Driscoll, https://github.com/lsdriscoll
   *               2013 Stefan Slonevskiy, https://github.com/stefslon
   *               2013 Jeremy Morel, https://github.com/jmorel
   *               2013 Christoph Hartmann, https://github.com/chris-rock
   *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
   *               2014 James Makes, https://github.com/dollaruw
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 Steven Spungin, https://github.com/Flamenco
   *               2014 Kenneth Glassey, https://github.com/Gavvers
   *
   * Licensed under the MIT License
   *
   * Contributor(s):
   *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
   *    kim3er, mfo, alnorth, Flamenco
   */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function(t){if("object"!==n(t.console)){t.console={};for(var A,e,r=t.console,i=function(){},o=["memory"],s="assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn".split(",");A=o.pop();)r[A]||(r[A]={});for(;e=s.pop();)r[e]||(r[e]=i)}var a,c,u,l,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";void 0===t.btoa&&(t.btoa=function(t){var A,e,r,n,i,o=0,s=0,a="",c=[];if(!t)return t;for(;A=(i=t.charCodeAt(o++)<<16|t.charCodeAt(o++)<<8|t.charCodeAt(o++))>>18&63,e=i>>12&63,r=i>>6&63,n=63&i,c[s++]=h.charAt(A)+h.charAt(e)+h.charAt(r)+h.charAt(n),o<t.length;);a=c.join("");var u=t.length%3;return(u?a.slice(0,u-3):a)+"===".slice(u||3)}),void 0===t.atob&&(t.atob=function(t){var A,e,r,n,i,o,s=0,a=0,c=[];if(!t)return t;for(t+="";A=(o=h.indexOf(t.charAt(s++))<<18|h.indexOf(t.charAt(s++))<<12|(n=h.indexOf(t.charAt(s++)))<<6|(i=h.indexOf(t.charAt(s++))))>>16&255,e=o>>8&255,r=255&o,c[a++]=64==n?String.fromCharCode(A):64==i?String.fromCharCode(A,e):String.fromCharCode(A,e,r),s<t.length;);return c.join("")}),Array.prototype.map||(Array.prototype.map=function(t){if(null==this||"function"!=typeof t)throw new TypeError;for(var A=Object(this),e=A.length>>>0,r=new Array(e),n=1<arguments.length?arguments[1]:void 0,i=0;i<e;i++)i in A&&(r[i]=t.call(n,A[i],i,A));return r}),Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),Array.prototype.forEach||(Array.prototype.forEach=function(t,A){if(null==this||"function"!=typeof t)throw new TypeError;for(var e=Object(this),r=e.length>>>0,n=0;n<r;n++)n in e&&t.call(A,e[n],n,e)}),Array.prototype.find||Object.defineProperty(Array.prototype,"find",{value:function(t){if(null==this)throw new TypeError('"this" is null or not defined');var A=Object(this),e=A.length>>>0;if("function"!=typeof t)throw new TypeError("predicate must be a function");for(var r=arguments[1],n=0;n<e;){var i=A[n];if(t.call(r,i,n,A))return i;n++}},configurable:!0,writable:!0}),Object.keys||(Object.keys=(a=Object.prototype.hasOwnProperty,c=!{toString:null}.propertyIsEnumerable("toString"),l=(u=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(t){if("object"!==n(t)&&("function"!=typeof t||null===t))throw new TypeError;var A,e,r=[];for(A in t)a.call(t,A)&&r.push(A);if(c)for(e=0;e<l;e++)a.call(t,u[e])&&r.push(u[e]);return r})),"function"!=typeof Object.assign&&(Object.assign=function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");t=Object(t);for(var A=1;A<arguments.length;A++){var e=arguments[A];if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),String.prototype.trimLeft||(String.prototype.trimLeft=function(){return this.replace(/^\s+/g,"")}),String.prototype.trimRight||(String.prototype.trimRight=function(){return this.replace(/\s+$/g,"")}),Number.isInteger=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0!==r&&r||Function('return typeof this === "object" && this.content')()||Function("return this")());var o,s,a,c,u,l,h,f,d,p,B,g,w,m,Q,C,y,v,F,U,N,E,b,L,H,x,S,I,_,T,R,O,K,M,P,D,k,z,j,q,V,X,G,J,W,Y,Z,$,tt,At,et,rt,nt,it,ot,st,at,ct,ut,lt,ht,ft,dt=function(r){function o(t){if("object"!==n(t))throw new Error("Invalid Context passed to initialize PubSub (jsPDF-module)");var A={};this.subscribe=function(t,e,r){if(r=r||!1,"string"!=typeof t||"function"!=typeof e||"boolean"!=typeof r)throw new Error("Invalid arguments passed to PubSub.subscribe (jsPDF-module)");A.hasOwnProperty(t)||(A[t]={});var n=Math.random().toString(35);return A[t][n]=[e,!!r],n},this.unsubscribe=function(t){for(var e in A)if(A[e][t])return delete A[e][t],0===Object.keys(A[e]).length&&delete A[e],!0;return!1},this.publish=function(e){if(A.hasOwnProperty(e)){var n=Array.prototype.slice.call(arguments,1),i=[];for(var o in A[e]){var s=A[e][o];try{s[0].apply(t,n)}catch(e){r.console&&console.error("jsPDF PubSub Error",e.message,e)}s[1]&&i.push(o)}i.length&&i.forEach(this.unsubscribe)}},this.getTopics=function(){return A}}function s(t,A,e,i){var a={},c=[],u=1;"object"===n(t)&&(t=(a=t).orientation,A=a.unit||A,e=a.format||e,i=a.compress||a.compressPdf||i,c=a.filters||(!0===i?["FlateEncode"]:c),u="number"==typeof a.userUnit?Math.abs(a.userUnit):1),A=A||"mm",t=(""+(t||"P")).toLowerCase();var l=a.putOnlyUsedFonts||!0,h={},f={internal:{},__private__:{}};f.__private__.PubSub=o;var d="1.3",p=f.__private__.getPdfVersion=function(){return d},B=(f.__private__.setPdfVersion=function(t){d=t},{a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]}),g=(f.__private__.getPageFormats=function(){return B},f.__private__.getPageFormat=function(t){return B[t]});"string"==typeof e&&(e=g(e)),e=e||g("a4");var w,m=f.f2=f.__private__.f2=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return t.toFixed(2)},Q=f.__private__.f3=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f3");return t.toFixed(3)},C="00000000000000000000000000000000",y=f.__private__.getFileId=function(){return C},v=f.__private__.setFileId=function(t){return t=t||"12345678901234567890123456789012".split("").map((function(){return"ABCDEF0123456789".charAt(Math.floor(16*Math.random()))})).join(""),C=t};f.setFileId=function(t){return v(t),this},f.getFileId=function(){return y()};var F=f.__private__.convertDateToPDFDate=function(t){var A=t.getTimezoneOffset(),e=A<0?"+":"-",r=Math.floor(Math.abs(A/60)),n=Math.abs(A%60),i=[e,R(r),"'",R(n),"'"].join("");return["D:",t.getFullYear(),R(t.getMonth()+1),R(t.getDate()),R(t.getHours()),R(t.getMinutes()),R(t.getSeconds()),i].join("")},U=f.__private__.convertPDFDateToDate=function(t){var A=parseInt(t.substr(2,4),10),e=parseInt(t.substr(6,2),10)-1,r=parseInt(t.substr(8,2),10),n=parseInt(t.substr(10,2),10),i=parseInt(t.substr(12,2),10),o=parseInt(t.substr(14,2),10);return parseInt(t.substr(16,2),10),parseInt(t.substr(20,2),10),new Date(A,e,r,n,i,o,0)},N=f.__private__.setCreationDate=function(t){var A;if(void 0===t&&(t=new Date),"object"===n(t)&&"[object Date]"===Object.prototype.toString.call(t))A=F(t);else{if(!/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/.test(t))throw new Error("Invalid argument passed to jsPDF.setCreationDate");A=t}return w=A},E=f.__private__.getCreationDate=function(t){var A=w;return"jsDate"===t&&(A=U(w)),A};f.setCreationDate=function(t){return N(t),this},f.getCreationDate=function(t){return E(t)};var b,L,H,x,S,I,_,T,R=f.__private__.padd2=function(t){return("0"+parseInt(t)).slice(-2)},O=!1,K=[],M=[],P=0,D=(f.__private__.setCustomOutputDestination=function(t){L=t},f.__private__.resetCustomOutputDestination=function(t){L=void 0},f.__private__.out=function(t){var A;return t="string"==typeof t?t:t.toString(),(A=void 0===L?O?K[b]:M:L).push(t),O||(P+=t.length+1),A}),k=f.__private__.write=function(t){return D(1===arguments.length?t.toString():Array.prototype.join.call(arguments," "))},z=f.__private__.getArrayBuffer=function(t){for(var A=t.length,e=new ArrayBuffer(A),r=new Uint8Array(e);A--;)r[A]=t.charCodeAt(A);return e},j=[["Helvetica","helvetica","normal","WinAnsiEncoding"],["Helvetica-Bold","helvetica","bold","WinAnsiEncoding"],["Helvetica-Oblique","helvetica","italic","WinAnsiEncoding"],["Helvetica-BoldOblique","helvetica","bolditalic","WinAnsiEncoding"],["Courier","courier","normal","WinAnsiEncoding"],["Courier-Bold","courier","bold","WinAnsiEncoding"],["Courier-Oblique","courier","italic","WinAnsiEncoding"],["Courier-BoldOblique","courier","bolditalic","WinAnsiEncoding"],["Times-Roman","times","normal","WinAnsiEncoding"],["Times-Bold","times","bold","WinAnsiEncoding"],["Times-Italic","times","italic","WinAnsiEncoding"],["Times-BoldItalic","times","bolditalic","WinAnsiEncoding"],["ZapfDingbats","zapfdingbats","normal",null],["Symbol","symbol","normal",null]],q=(f.__private__.getStandardFonts=function(t){return j},a.fontSize||16),V=(f.__private__.setFontSize=f.setFontSize=function(t){return q=t,this},f.__private__.getFontSize=f.getFontSize=function(){return q}),X=a.R2L||!1,G=(f.__private__.setR2L=f.setR2L=function(t){return X=t,this},f.__private__.getR2L=f.getR2L=function(t){return X},f.__private__.setZoomMode=function(t){if(/^\d*\.?\d*\%$/.test(t))H=t;else if(isNaN(t)){if(-1===[void 0,null,"fullwidth","fullheight","fullpage","original"].indexOf(t))throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "'+t+'" is not recognized.');H=t}else H=parseInt(t,10)}),J=(f.__private__.getZoomMode=function(){return H},f.__private__.setPageMode=function(t){if(-1==[void 0,null,"UseNone","UseOutlines","UseThumbs","FullScreen"].indexOf(t))throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "'+t+'" is not recognized.');x=t}),W=(f.__private__.getPageMode=function(){return x},f.__private__.setLayoutMode=function(t){if(-1==[void 0,null,"continuous","single","twoleft","tworight","two"].indexOf(t))throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "'+t+'" is not recognized.');S=t}),Y=(f.__private__.getLayoutMode=function(){return S},f.__private__.setDisplayMode=f.setDisplayMode=function(t,A,e){return G(t),W(A),J(e),this},{title:"",subject:"",author:"",keywords:"",creator:""}),Z=(f.__private__.getDocumentProperty=function(t){if(-1===Object.keys(Y).indexOf(t))throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");return Y[t]},f.__private__.getDocumentProperties=function(t){return Y},f.__private__.setDocumentProperties=f.setProperties=f.setDocumentProperties=function(t){for(var A in Y)Y.hasOwnProperty(A)&&t[A]&&(Y[A]=t[A]);return this},f.__private__.setDocumentProperty=function(t,A){if(-1===Object.keys(Y).indexOf(t))throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");return Y[t]=A},0),$=[],tt={},At={},et=0,rt=[],nt=[],it=new o(f),ot=a.hotfixes||[],st=f.__private__.newObject=function(){var t=at();return ct(t,!0),t},at=f.__private__.newObjectDeferred=function(){return $[++Z]=function(){return P},Z},ct=function(t,A){return A="boolean"==typeof A&&A,$[t]=P,A&&D(t+" 0 obj"),t},ut=f.__private__.newAdditionalObject=function(){var t={objId:at(),content:""};return nt.push(t),t},lt=at(),ht=at(),ft=f.__private__.decodeColorString=function(t){var A=t.split(" ");if(2===A.length&&("g"===A[1]||"G"===A[1])){var e=parseFloat(A[0]);A=[e,e,e,"r"]}for(var r="#",n=0;n<3;n++)r+=("0"+Math.floor(255*parseFloat(A[n])).toString(16)).slice(-2);return r},dt=f.__private__.encodeColorString=function(t){var A;"string"==typeof t&&(t={ch1:t});var e=t.ch1,r=t.ch2,i=t.ch3,o=t.ch4,s=(t.precision,"draw"===t.pdfColorType?["G","RG","K"]:["g","rg","k"]);if("string"==typeof e&&"#"!==e.charAt(0)){var a=new RGBColor(e);if(a.ok)e=a.toHex();else if(!/^\d*\.?\d*$/.test(e))throw new Error('Invalid color "'+e+'" passed to jsPDF.encodeColorString.')}if("string"==typeof e&&/^#[0-9A-Fa-f]{3}$/.test(e)&&(e="#"+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),"string"==typeof e&&/^#[0-9A-Fa-f]{6}$/.test(e)){var c=parseInt(e.substr(1),16);e=c>>16&255,r=c>>8&255,i=255&c}if(void 0===r||void 0===o&&e===r&&r===i)if("string"==typeof e)A=e+" "+s[0];else switch(t.precision){case 2:A=m(e/255)+" "+s[0];break;case 3:default:A=Q(e/255)+" "+s[0]}else if(void 0===o||"object"===n(o)){if(o&&!isNaN(o.a)&&0===o.a)return["1.000","1.000","1.000",s[1]].join(" ");if("string"==typeof e)A=[e,r,i,s[1]].join(" ");else switch(t.precision){case 2:A=[m(e/255),m(r/255),m(i/255),s[1]].join(" ");break;default:case 3:A=[Q(e/255),Q(r/255),Q(i/255),s[1]].join(" ")}}else if("string"==typeof e)A=[e,r,i,o,s[2]].join(" ");else switch(t.precision){case 2:A=[m(e/255),m(r/255),m(i/255),m(o/255),s[2]].join(" ");break;case 3:default:A=[Q(e/255),Q(r/255),Q(i/255),Q(o/255),s[2]].join(" ")}return A},pt=f.__private__.getFilters=function(){return c},Bt=f.__private__.putStream=function(t){var A,e=(t=t||{}).data||"",r=t.filters||pt(),n=t.alreadyAppliedFilters||[],i=t.addLength1||!1,o=e.length;!0===r&&(r=["FlateEncode"]);var a=t.additionalKeyValues||[],c=(A=void 0!==s.API.processDataByFilters?s.API.processDataByFilters(e,r):{data:e,reverseChain:[]}).reverseChain+(Array.isArray(n)?n.join(" "):n.toString());0!==A.data.length&&(a.push({key:"Length",value:A.data.length}),!0===i&&a.push({key:"Length1",value:o})),0!=c.length&&(c.split("/").length-1==1?a.push({key:"Filter",value:c}):a.push({key:"Filter",value:"["+c+"]"})),D("<<");for(var u=0;u<a.length;u++)D("/"+a[u].key+" "+a[u].value);D(">>"),0!==A.data.length&&(D("stream"),D(A.data),D("endstream"))},gt=f.__private__.putPage=function(t){t.mediaBox;var A=t.number,e=t.data,r=t.objId,n=t.contentsObjId;ct(r,!0),rt[b].mediaBox.topRightX,rt[b].mediaBox.bottomLeftX,rt[b].mediaBox.topRightY,rt[b].mediaBox.bottomLeftY,D("<</Type /Page"),D("/Parent "+t.rootDictionaryObjId+" 0 R"),D("/Resources "+t.resourceDictionaryObjId+" 0 R"),D("/MediaBox ["+parseFloat(m(t.mediaBox.bottomLeftX))+" "+parseFloat(m(t.mediaBox.bottomLeftY))+" "+m(t.mediaBox.topRightX)+" "+m(t.mediaBox.topRightY)+"]"),null!==t.cropBox&&D("/CropBox ["+m(t.cropBox.bottomLeftX)+" "+m(t.cropBox.bottomLeftY)+" "+m(t.cropBox.topRightX)+" "+m(t.cropBox.topRightY)+"]"),null!==t.bleedBox&&D("/BleedBox ["+m(t.bleedBox.bottomLeftX)+" "+m(t.bleedBox.bottomLeftY)+" "+m(t.bleedBox.topRightX)+" "+m(t.bleedBox.topRightY)+"]"),null!==t.trimBox&&D("/TrimBox ["+m(t.trimBox.bottomLeftX)+" "+m(t.trimBox.bottomLeftY)+" "+m(t.trimBox.topRightX)+" "+m(t.trimBox.topRightY)+"]"),null!==t.artBox&&D("/ArtBox ["+m(t.artBox.bottomLeftX)+" "+m(t.artBox.bottomLeftY)+" "+m(t.artBox.topRightX)+" "+m(t.artBox.topRightY)+"]"),"number"==typeof t.userUnit&&1!==t.userUnit&&D("/UserUnit "+t.userUnit),it.publish("putPage",{objId:r,pageContext:rt[A],pageNumber:A,page:e}),D("/Contents "+n+" 0 R"),D(">>"),D("endobj");var i=e.join("\n");return ct(n,!0),Bt({data:i,filters:pt()}),D("endobj"),r},wt=f.__private__.putPages=function(){var t,A,e=[];for(t=1;t<=et;t++)rt[t].objId=at(),rt[t].contentsObjId=at();for(t=1;t<=et;t++)e.push(gt({number:t,data:K[t],objId:rt[t].objId,contentsObjId:rt[t].contentsObjId,mediaBox:rt[t].mediaBox,cropBox:rt[t].cropBox,bleedBox:rt[t].bleedBox,trimBox:rt[t].trimBox,artBox:rt[t].artBox,userUnit:rt[t].userUnit,rootDictionaryObjId:lt,resourceDictionaryObjId:ht}));ct(lt,!0),D("<</Type /Pages");var r="/Kids [";for(A=0;A<et;A++)r+=e[A]+" 0 R ";D(r+"]"),D("/Count "+et),D(">>"),D("endobj"),it.publish("postPutPages")},mt=function(t,A,e){At.hasOwnProperty(A)||(At[A]={}),At[A][e]=t},Qt=function(t,A,e,r,n){n=n||!1;var i="F"+(Object.keys(tt).length+1).toString(10),o={id:i,postScriptName:t,fontName:A,fontStyle:e,encoding:r,isStandardFont:n,metadata:{}};return it.publish("addFont",{font:o,instance:this}),void 0!==i&&(tt[i]=o,mt(i,A,e)),i},Ct=f.__private__.pdfEscape=f.pdfEscape=function(t,A){return function(t,A){var e,r,n,i,o,s,a,c,u;if(n=(A=A||{}).sourceEncoding||"Unicode",o=A.outputEncoding,(A.autoencode||o)&&tt[I].metadata&&tt[I].metadata[n]&&tt[I].metadata[n].encoding&&(i=tt[I].metadata[n].encoding,!o&&tt[I].encoding&&(o=tt[I].encoding),!o&&i.codePages&&(o=i.codePages[0]),"string"==typeof o&&(o=i[o]),o)){for(a=!1,s=[],e=0,r=t.length;e<r;e++)(c=o[t.charCodeAt(e)])?s.push(String.fromCharCode(c)):s.push(t[e]),s[e].charCodeAt(0)>>8&&(a=!0);t=s.join("")}for(e=t.length;void 0===a&&0!==e;)t.charCodeAt(e-1)>>8&&(a=!0),e--;if(!a)return t;for(s=A.noBOM?[]:[254,255],e=0,r=t.length;e<r;e++){if((u=(c=t.charCodeAt(e))>>8)>>8)throw new Error("Character at position "+e+" of string '"+t+"' exceeds 16bits. Cannot be encoded into UCS-2 BE");s.push(u),s.push(c-(u<<8))}return String.fromCharCode.apply(void 0,s)}(t,A).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")},yt=f.__private__.beginPage=function(t,A){var r,n="string"==typeof A&&A.toLowerCase();if("string"==typeof t&&(r=g(t.toLowerCase()))&&(t=r[0],A=r[1]),Array.isArray(t)&&(A=t[1],t=t[0]),(isNaN(t)||isNaN(A))&&(t=e[0],A=e[1]),n){switch(n.substr(0,1)){case"l":t<A&&(n="s");break;case"p":A<t&&(n="s")}"s"===n&&(r=t,t=A,A=r)}(14400<t||14400<A)&&(console.warn("A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"),t=Math.min(14400,t),A=Math.min(14400,A)),e=[t,A],O=!0,K[++et]=[],rt[et]={objId:0,contentsObjId:0,userUnit:Number(u),artBox:null,bleedBox:null,cropBox:null,trimBox:null,mediaBox:{bottomLeftX:0,bottomLeftY:0,topRightX:Number(t),topRightY:Number(A)}},Ft(et)},vt=function(){yt.apply(this,arguments),jt(zt),D(Zt),0!==nA&&D(nA+" J"),0!==oA&&D(oA+" j"),it.publish("addPage",{pageNumber:et})},Ft=function(t){0<t&&t<=et&&(b=t)},Ut=f.__private__.getNumberOfPages=f.getNumberOfPages=function(){return K.length-1},Nt=function(t,A,e){var r,n=void 0;return e=e||{},t=void 0!==t?t:tt[I].fontName,A=void 0!==A?A:tt[I].fontStyle,r=t.toLowerCase(),void 0!==At[r]&&void 0!==At[r][A]?n=At[r][A]:void 0!==At[t]&&void 0!==At[t][A]?n=At[t][A]:!1===e.disableWarning&&console.warn("Unable to look up font label for font '"+t+"', '"+A+"'. Refer to getFontList() for available fonts."),n||e.noFallback||null==(n=At.times[A])&&(n=At.times.normal),n},Et=f.__private__.putInfo=function(){for(var t in st(),D("<<"),D("/Producer (jsPDF "+s.version+")"),Y)Y.hasOwnProperty(t)&&Y[t]&&D("/"+t.substr(0,1).toUpperCase()+t.substr(1)+" ("+Ct(Y[t])+")");D("/CreationDate ("+w+")"),D(">>"),D("endobj")},bt=f.__private__.putCatalog=function(t){var A=(t=t||{}).rootDictionaryObjId||lt;switch(st(),D("<<"),D("/Type /Catalog"),D("/Pages "+A+" 0 R"),H||(H="fullwidth"),H){case"fullwidth":D("/OpenAction [3 0 R /FitH null]");break;case"fullheight":D("/OpenAction [3 0 R /FitV null]");break;case"fullpage":D("/OpenAction [3 0 R /Fit]");break;case"original":D("/OpenAction [3 0 R /XYZ null null 1]");break;default:var e=""+H;"%"===e.substr(e.length-1)&&(H=parseInt(H)/100),"number"==typeof H&&D("/OpenAction [3 0 R /XYZ null null "+m(H)+"]")}switch(S||(S="continuous"),S){case"continuous":D("/PageLayout /OneColumn");break;case"single":D("/PageLayout /SinglePage");break;case"two":case"twoleft":D("/PageLayout /TwoColumnLeft");break;case"tworight":D("/PageLayout /TwoColumnRight")}x&&D("/PageMode /"+x),it.publish("putCatalog"),D(">>"),D("endobj")},Lt=f.__private__.putTrailer=function(){D("trailer"),D("<<"),D("/Size "+(Z+1)),D("/Root "+Z+" 0 R"),D("/Info "+(Z-1)+" 0 R"),D("/ID [ <"+C+"> <"+C+"> ]"),D(">>")},xt=f.__private__.putHeader=function(){D("%PDF-"+d),D("%ºß¬à")},St=f.__private__.putXRef=function(){var t=1,A="0000000000";for(D("xref"),D("0 "+(Z+1)),D("0000000000 65535 f "),t=1;t<=Z;t++)"function"==typeof $[t]?D((A+$[t]()).slice(-10)+" 00000 n "):void 0!==$[t]?D((A+$[t]).slice(-10)+" 00000 n "):D("0000000000 00000 n ")},It=f.__private__.buildDocument=function(){O=!1,P=Z=0,M=[],$=[],nt=[],lt=at(),ht=at(),it.publish("buildDocument"),xt(),wt(),function(){it.publish("putAdditionalObjects");for(var t=0;t<nt.length;t++){var A=nt[t];ct(A.objId,!0),D(A.content),D("endobj")}it.publish("postPutAdditionalObjects")}(),function(){for(var t in tt)tt.hasOwnProperty(t)&&(!1===l||!0===l&&h.hasOwnProperty(t))&&(A=tt[t],it.publish("putFont",{font:A,out:D,newObject:st,putStream:Bt}),!0!==A.isAlreadyPutted&&(A.objectNumber=st(),D("<<"),D("/Type /Font"),D("/BaseFont /"+A.postScriptName),D("/Subtype /Type1"),"string"==typeof A.encoding&&D("/Encoding /"+A.encoding),D("/FirstChar 32"),D("/LastChar 255"),D(">>"),D("endobj")));var A}(),it.publish("putResources"),ct(ht,!0),D("<<"),function(){for(var t in D("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"),D("/Font <<"),tt)tt.hasOwnProperty(t)&&(!1===l||!0===l&&h.hasOwnProperty(t))&&D("/"+t+" "+tt[t].objectNumber+" 0 R");D(">>"),D("/XObject <<"),it.publish("putXobjectDict"),D(">>")}(),D(">>"),D("endobj"),it.publish("postPutResources"),Et(),bt();var t=P;return St(),Lt(),D("startxref"),D(""+t),D("%%EOF"),O=!0,M.join("\n")},_t=f.__private__.getBlob=function(t){return new Blob([z(t)],{type:"application/pdf"})},Tt=f.output=f.__private__.output=((T=function(t,A){A=A||{};var e=It();switch("string"==typeof A?A={filename:A}:A.filename=A.filename||"generated.pdf",t){case void 0:return e;case"save":f.save(A.filename);break;case"arraybuffer":return z(e);case"blob":return _t(e);case"bloburi":case"bloburl":if(void 0!==r.URL&&"function"==typeof r.URL.createObjectURL)return r.URL&&r.URL.createObjectURL(_t(e))||void 0;console.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");break;case"datauristring":case"dataurlstring":return"data:application/pdf;filename="+A.filename+";base64,"+btoa(e);case"dataurlnewwindow":var n='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe src="'+this.output("datauristring")+'"></iframe></body></html>',i=r.open();if(null!==i&&i.document.write(n),i||"undefined"==typeof safari)return i;case"datauri":case"dataurl":return r.document.location.href="data:application/pdf;filename="+A.filename+";base64,"+btoa(e);default:return null}}).foo=function(){try{return T.apply(this,arguments)}catch(e){var t=e.stack||"";~t.indexOf(" at ")&&(t=t.split(" at ")[1]);var A="Error in function "+t.split("\n")[0].split("<")[0]+": "+e.message;if(!r.console)throw new Error(A);r.console.error(A,e),r.alert&&alert(A)}},(T.foo.bar=T).foo),Rt=function(t){return!0===Array.isArray(ot)&&-1<ot.indexOf(t)};switch(A){case"pt":_=1;break;case"mm":_=72/25.4;break;case"cm":_=72/2.54;break;case"in":_=72;break;case"px":_=1==Rt("px_scaling")?.75:96/72;break;case"pc":case"em":_=12;break;case"ex":_=6;break;default:throw new Error("Invalid unit: "+A)}N(),v();var Ot=f.__private__.getPageInfo=function(t){if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfo");return{objId:rt[t].objId,pageNumber:t,pageContext:rt[t]}},Kt=f.__private__.getPageInfoByObjId=function(t){for(var A in rt)if(rt[A].objId===t)break;if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");return Ot(A)},Mt=f.__private__.getCurrentPageInfo=function(){return{objId:rt[b].objId,pageNumber:b,pageContext:rt[b]}};f.addPage=function(){return vt.apply(this,arguments),this},f.setPage=function(){return Ft.apply(this,arguments),this},f.insertPage=function(t){return this.addPage(),this.movePage(b,t),this},f.movePage=function(t,A){if(A<t){for(var e=K[t],r=rt[t],n=t;A<n;n--)K[n]=K[n-1],rt[n]=rt[n-1];K[A]=e,rt[A]=r,this.setPage(A)}else if(t<A){for(e=K[t],r=rt[t],n=t;n<A;n++)K[n]=K[n+1],rt[n]=rt[n+1];K[A]=e,rt[A]=r,this.setPage(A)}return this},f.deletePage=function(){return function(t){0<t&&t<=et&&(K.splice(t,1),--et<b&&(b=et),this.setPage(b))}.apply(this,arguments),this},f.__private__.text=f.text=function(t,A,e,r){var i;"number"!=typeof t||"number"!=typeof A||"string"!=typeof e&&!Array.isArray(e)||(i=e,e=A,A=t,t=i);var o=arguments[3],s=arguments[4],a=arguments[5];if("object"===n(o)&&null!==o||("string"==typeof s&&(a=s,s=null),"string"==typeof o&&(a=o,o=null),"number"==typeof o&&(s=o,o=null),r={flags:o,angle:s,align:a}),(o=o||{}).noBOM=o.noBOM||!0,o.autoencode=o.autoencode||!0,isNaN(A)||isNaN(e)||null==t)throw new Error("Invalid arguments passed to jsPDF.text");if(0===t.length)return f;var c,u="",l="number"==typeof r.lineHeightFactor?r.lineHeightFactor:kt,f=r.scope||this;function d(t){for(var A,e=t.concat(),r=[],n=e.length;n--;)"string"==typeof(A=e.shift())?r.push(A):Array.isArray(t)&&1===A.length?r.push(A[0]):r.push([A[0],A[1],A[2]]);return r}function p(t,A){var e;if("string"==typeof t)e=A(t)[0];else if(Array.isArray(t)){for(var r,n,i=t.concat(),o=[],s=i.length;s--;)"string"==typeof(r=i.shift())?o.push(A(r)[0]):Array.isArray(r)&&"string"===r[0]&&(n=A(r[0],r[1],r[2]),o.push([n[0],n[1],n[2]]));e=o}return e}var B=!1,g=!0;if("string"==typeof t)B=!0;else if(Array.isArray(t)){for(var w,C=t.concat(),y=[],v=C.length;v--;)("string"!=typeof(w=C.shift())||Array.isArray(w)&&"string"!=typeof w[0])&&(g=!1);B=g}if(!1===B)throw new Error('Type of text must be string or Array. "'+t+'" is not recognized.');var F=tt[I].encoding;"WinAnsiEncoding"!==F&&"StandardEncoding"!==F||(t=p(t,(function(t,A,e){return[(n=t,n=n.split("\t").join(Array(r.TabLen||9).join(" ")),Ct(n,o)),A,e];var n}))),"string"==typeof t&&(t=t.match(/[\r?\n]/)?t.split(/\r\n|\r|\n/g):[t]);var U=q/f.internal.scaleFactor,N=U*(kt-1);switch(r.baseline){case"bottom":e-=N;break;case"top":e+=U-N;break;case"hanging":e+=U-2*N;break;case"middle":e+=U/2-N}0<(k=r.maxWidth||0)&&("string"==typeof t?t=f.splitTextToSize(t,k):"[object Array]"===Object.prototype.toString.call(t)&&(t=f.splitTextToSize(t.join(" "),k)));var E={text:t,x:A,y:e,options:r,mutex:{pdfEscape:Ct,activeFontKey:I,fonts:tt,activeFontSize:q}};it.publish("preProcessText",E),t=E.text,s=(r=E.options).angle;var b=f.internal.scaleFactor,L=[];if(s){s*=Math.PI/180;var H=Math.cos(s),x=Math.sin(s);L=[m(H),m(x),m(-1*x),m(H)]}void 0!==(P=r.charSpace)&&(u+=Q(P*b)+" Tc\n"),r.lang;var S=-1,_=void 0!==r.renderingMode?r.renderingMode:r.stroke,T=f.internal.getCurrentPageInfo().pageContext;switch(_){case 0:case!1:case"fill":S=0;break;case 1:case!0:case"stroke":S=1;break;case 2:case"fillThenStroke":S=2;break;case 3:case"invisible":S=3;break;case 4:case"fillAndAddForClipping":S=4;break;case 5:case"strokeAndAddPathForClipping":S=5;break;case 6:case"fillThenStrokeAndAddToPathForClipping":S=6;break;case 7:case"addToPathForClipping":S=7}var R=void 0!==T.usedRenderingMode?T.usedRenderingMode:-1;-1!==S?u+=S+" Tr\n":-1!==R&&(u+="0 Tr\n"),-1!==S&&(T.usedRenderingMode=S),a=r.align||"left";var O=q*l,K=f.internal.pageSize.getWidth(),M=(b=f.internal.scaleFactor,tt[I]),P=r.charSpace||eA,k=r.maxWidth||0,z=(o={},[]);if("[object Array]"===Object.prototype.toString.call(t)){var j,V;y=d(t),"left"!==a&&(V=y.map((function(t){return f.getStringUnitWidth(t,{font:M,charSpace:P,fontSize:q})*q/b}))),Math.max.apply(Math,V);var G,J=0;if("right"===a){A-=V[0],t=[];var W=0;for(v=y.length;W<v;W++)V[W],j=0===W?(G=Gt(A),Jt(e)):(G=(J-V[W])*b,-O),t.push([y[W],G,j]),J=V[W]}else if("center"===a)for(A-=V[0]/2,t=[],W=0,v=y.length;W<v;W++)V[W],j=0===W?(G=Gt(A),Jt(e)):(G=(J-V[W])/2*b,-O),t.push([y[W],G,j]),J=V[W];else if("left"===a)for(t=[],W=0,v=y.length;W<v;W++)j=0===W?Jt(e):-O,G=0===W?Gt(A):0,t.push(y[W]);else{if("justify"!==a)throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');for(t=[],k=0!==k?k:K,W=0,v=y.length;W<v;W++)j=0===W?Jt(e):-O,G=0===W?Gt(A):0,W<v-1&&z.push(((k-V[W])/(y[W].split(" ").length-1)*b).toFixed(2)),t.push([y[W],G,j])}}!0===("boolean"==typeof r.R2L?r.R2L:X)&&(t=p(t,(function(t,A,e){return[t.split("").reverse().join(""),A,e]}))),E={text:t,x:A,y:e,options:r,mutex:{pdfEscape:Ct,activeFontKey:I,fonts:tt,activeFontSize:q}},it.publish("postProcessText",E),t=E.text,c=E.mutex.isHex,y=d(t),t=[];var Y,Z,$,At=0,et=(v=y.length,"");for(W=0;W<v;W++)et="",Array.isArray(y[W])?(Y=parseFloat(y[W][1]),Z=parseFloat(y[W][2]),$=(c?"<":"(")+y[W][0]+(c?">":")"),At=1):(Y=Gt(A),Z=Jt(e),$=(c?"<":"(")+y[W]+(c?">":")")),void 0!==z&&void 0!==z[W]&&(et=z[W]+" Tw\n"),0!==L.length&&0===W?t.push(et+L.join(" ")+" "+Y.toFixed(2)+" "+Z.toFixed(2)+" Tm\n"+$):1===At||0===At&&0===W?t.push(et+Y.toFixed(2)+" "+Z.toFixed(2)+" Td\n"+$):t.push(et+$);t=0===At?t.join(" Tj\nT* "):t.join(" Tj\n"),t+=" Tj\n";var rt="BT\n/"+I+" "+q+" Tf\n"+(q*l).toFixed(2)+" TL\n"+tA+"\n";return rt+=u,rt+=t,D(rt+="ET"),h[I]=!0,f},f.__private__.lstext=f.lstext=function(t,A,e,r){return console.warn("jsPDF.lstext is deprecated"),this.text(t,A,e,{charSpace:r})},f.__private__.clip=f.clip=function(t){D("evenodd"===t?"W*":"W"),D("n")},f.__private__.clip_fixed=f.clip_fixed=function(t){console.log("clip_fixed is deprecated"),f.clip(t)};var Pt=f.__private__.isValidStyle=function(t){var A=!1;return-1!==[void 0,null,"S","F","DF","FD","f","f*","B","B*"].indexOf(t)&&(A=!0),A},Dt=f.__private__.getStyle=function(t){var A="S";return"F"===t?A="f":"FD"===t||"DF"===t?A="B":"f"!==t&&"f*"!==t&&"B"!==t&&"B*"!==t||(A=t),A};f.__private__.line=f.line=function(t,A,e,r){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r))throw new Error("Invalid arguments passed to jsPDF.line");return this.lines([[e-t,r-A]],t,A)},f.__private__.lines=f.lines=function(t,A,e,r,n,i){var o,s,a,c,u,l,h,f,d,p,B,g;if("number"==typeof t&&(g=e,e=A,A=t,t=g),r=r||[1,1],i=i||!1,isNaN(A)||isNaN(e)||!Array.isArray(t)||!Array.isArray(r)||!Pt(n)||"boolean"!=typeof i)throw new Error("Invalid arguments passed to jsPDF.lines");for(D(Q(Gt(A))+" "+Q(Jt(e))+" m "),o=r[0],s=r[1],c=t.length,p=A,B=e,a=0;a<c;a++)2===(u=t[a]).length?(p=u[0]*o+p,B=u[1]*s+B,D(Q(Gt(p))+" "+Q(Jt(B))+" l")):(l=u[0]*o+p,h=u[1]*s+B,f=u[2]*o+p,d=u[3]*s+B,p=u[4]*o+p,B=u[5]*s+B,D(Q(Gt(l))+" "+Q(Jt(h))+" "+Q(Gt(f))+" "+Q(Jt(d))+" "+Q(Gt(p))+" "+Q(Jt(B))+" c"));return i&&D(" h"),null!==n&&D(Dt(n)),this},f.__private__.rect=f.rect=function(t,A,e,r,n){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r)||!Pt(n))throw new Error("Invalid arguments passed to jsPDF.rect");return D([m(Gt(t)),m(Jt(A)),m(e*_),m(-r*_),"re"].join(" ")),null!==n&&D(Dt(n)),this},f.__private__.triangle=f.triangle=function(t,A,e,r,n,i,o){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||!Pt(o))throw new Error("Invalid arguments passed to jsPDF.triangle");return this.lines([[e-t,r-A],[n-e,i-r],[t-n,A-i]],t,A,[1,1],o,!0),this},f.__private__.roundedRect=f.roundedRect=function(t,A,e,r,n,i,o){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||!Pt(o))throw new Error("Invalid arguments passed to jsPDF.roundedRect");var s=4/3*(Math.SQRT2-1);return this.lines([[e-2*n,0],[n*s,0,n,i-i*s,n,i],[0,r-2*i],[0,i*s,-n*s,i,-n,i],[2*n-e,0],[-n*s,0,-n,-i*s,-n,-i],[0,2*i-r],[0,-i*s,n*s,-i,n,-i]],t+n,A,[1,1],o),this},f.__private__.ellipse=f.ellipse=function(t,A,e,r,n){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r)||!Pt(n))throw new Error("Invalid arguments passed to jsPDF.ellipse");var i=4/3*(Math.SQRT2-1)*e,o=4/3*(Math.SQRT2-1)*r;return D([m(Gt(t+e)),m(Jt(A)),"m",m(Gt(t+e)),m(Jt(A-o)),m(Gt(t+i)),m(Jt(A-r)),m(Gt(t)),m(Jt(A-r)),"c"].join(" ")),D([m(Gt(t-i)),m(Jt(A-r)),m(Gt(t-e)),m(Jt(A-o)),m(Gt(t-e)),m(Jt(A)),"c"].join(" ")),D([m(Gt(t-e)),m(Jt(A+o)),m(Gt(t-i)),m(Jt(A+r)),m(Gt(t)),m(Jt(A+r)),"c"].join(" ")),D([m(Gt(t+i)),m(Jt(A+r)),m(Gt(t+e)),m(Jt(A+o)),m(Gt(t+e)),m(Jt(A)),"c"].join(" ")),null!==n&&D(Dt(n)),this},f.__private__.circle=f.circle=function(t,A,e,r){if(isNaN(t)||isNaN(A)||isNaN(e)||!Pt(r))throw new Error("Invalid arguments passed to jsPDF.circle");return this.ellipse(t,A,e,e,r)},f.setFont=function(t,A){return I=Nt(t,A,{disableWarning:!1}),this},f.setFontStyle=f.setFontType=function(t){return I=Nt(void 0,t),this},f.__private__.getFontList=f.getFontList=function(){var t,A,e,r={};for(t in At)if(At.hasOwnProperty(t))for(A in r[t]=e=[],At[t])At[t].hasOwnProperty(A)&&e.push(A);return r},f.addFont=function(t,A,e,r){Qt.call(this,t,A,e,r=r||"Identity-H")};var kt,zt=a.lineWidth||.200025,jt=f.__private__.setLineWidth=f.setLineWidth=function(t){return D((t*_).toFixed(2)+" w"),this},qt=(f.__private__.setLineDash=s.API.setLineDash=function(t,A){if(t=t||[],A=A||0,isNaN(A)||!Array.isArray(t))throw new Error("Invalid arguments passed to jsPDF.setLineDash");return t=t.map((function(t){return(t*_).toFixed(3)})).join(" "),A=parseFloat((A*_).toFixed(3)),D("["+t+"] "+A+" d"),this},f.__private__.getLineHeight=f.getLineHeight=function(){return q*kt}),Vt=(qt=f.__private__.getLineHeight=f.getLineHeight=function(){return q*kt},f.__private__.setLineHeightFactor=f.setLineHeightFactor=function(t){return"number"==typeof(t=t||1.15)&&(kt=t),this}),Xt=f.__private__.getLineHeightFactor=f.getLineHeightFactor=function(){return kt};Vt(a.lineHeight);var Gt=f.__private__.getHorizontalCoordinate=function(t){return t*_},Jt=f.__private__.getVerticalCoordinate=function(t){return rt[b].mediaBox.topRightY-rt[b].mediaBox.bottomLeftY-t*_},Wt=f.__private__.getHorizontalCoordinateString=function(t){return m(t*_)},Yt=f.__private__.getVerticalCoordinateString=function(t){return m(rt[b].mediaBox.topRightY-rt[b].mediaBox.bottomLeftY-t*_)},Zt=a.strokeColor||"0 G",$t=(f.__private__.getStrokeColor=f.getDrawColor=function(){return ft(Zt)},f.__private__.setStrokeColor=f.setDrawColor=function(t,A,e,r){return Zt=dt({ch1:t,ch2:A,ch3:e,ch4:r,pdfColorType:"draw",precision:2}),D(Zt),this},a.fillColor||"0 g"),tA=(f.__private__.getFillColor=f.getFillColor=function(){return ft($t)},f.__private__.setFillColor=f.setFillColor=function(t,A,e,r){return $t=dt({ch1:t,ch2:A,ch3:e,ch4:r,pdfColorType:"fill",precision:2}),D($t),this},a.textColor||"0 g"),AA=f.__private__.getTextColor=f.getTextColor=function(){return ft(tA)},eA=(f.__private__.setTextColor=f.setTextColor=function(t,A,e,r){return tA=dt({ch1:t,ch2:A,ch3:e,ch4:r,pdfColorType:"text",precision:3}),this},a.charSpace||0),rA=f.__private__.getCharSpace=f.getCharSpace=function(){return eA},nA=(f.__private__.setCharSpace=f.setCharSpace=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.setCharSpace");return eA=t,this},0);f.CapJoinStyles={0:0,butt:0,but:0,miter:0,1:1,round:1,rounded:1,circle:1,2:2,projecting:2,project:2,square:2,bevel:2},f.__private__.setLineCap=f.setLineCap=function(t){var A=f.CapJoinStyles[t];if(void 0===A)throw new Error("Line cap style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return D((nA=A)+" J"),this};var iA,oA=0;for(var sA in f.__private__.setLineJoin=f.setLineJoin=function(t){var A=f.CapJoinStyles[t];if(void 0===A)throw new Error("Line join style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return D((oA=A)+" j"),this},f.__private__.setMiterLimit=f.setMiterLimit=function(t){if(t=t||0,isNaN(t))throw new Error("Invalid argument passed to jsPDF.setMiterLimit");return iA=parseFloat(m(t*_)),D(iA+" M"),this},f.save=function(t,A){if(t=t||"generated.pdf",(A=A||{}).returnPromise=A.returnPromise||!1,!1!==A.returnPromise)return new Promise((function(A,e){try{var n=Ht(_t(It()),t);"function"==typeof Ht.unload&&r.setTimeout&&setTimeout(Ht.unload,911),A(n)}catch(A){e(A.message)}}));Ht(_t(It()),t),"function"==typeof Ht.unload&&r.setTimeout&&setTimeout(Ht.unload,911)},s.API)s.API.hasOwnProperty(sA)&&("events"===sA&&s.API.events.length?function(t,A){var e,r,n;for(n=A.length-1;-1!==n;n--)e=A[n][0],r=A[n][1],t.subscribe.apply(t,[e].concat("function"==typeof r?[r]:r))}(it,s.API.events):f[sA]=s.API[sA]);return f.internal={pdfEscape:Ct,getStyle:Dt,getFont:function(){return tt[Nt.apply(f,arguments)]},getFontSize:V,getCharSpace:rA,getTextColor:AA,getLineHeight:qt,getLineHeightFactor:Xt,write:k,getHorizontalCoordinate:Gt,getVerticalCoordinate:Jt,getCoordinateString:Wt,getVerticalCoordinateString:Yt,collections:{},newObject:st,newAdditionalObject:ut,newObjectDeferred:at,newObjectDeferredBegin:ct,getFilters:pt,putStream:Bt,events:it,scaleFactor:_,pageSize:{getWidth:function(){return(rt[b].mediaBox.topRightX-rt[b].mediaBox.bottomLeftX)/_},setWidth:function(t){rt[b].mediaBox.topRightX=t*_+rt[b].mediaBox.bottomLeftX},getHeight:function(){return(rt[b].mediaBox.topRightY-rt[b].mediaBox.bottomLeftY)/_},setHeight:function(t){rt[b].mediaBox.topRightY=t*_+rt[b].mediaBox.bottomLeftY}},output:Tt,getNumberOfPages:Ut,pages:K,out:D,f2:m,f3:Q,getPageInfo:Ot,getPageInfoByObjId:Kt,getCurrentPageInfo:Mt,getPDFVersion:p,hasHotfix:Rt},Object.defineProperty(f.internal.pageSize,"width",{get:function(){return(rt[b].mediaBox.topRightX-rt[b].mediaBox.bottomLeftX)/_},set:function(t){rt[b].mediaBox.topRightX=t*_+rt[b].mediaBox.bottomLeftX},enumerable:!0,configurable:!0}),Object.defineProperty(f.internal.pageSize,"height",{get:function(){return(rt[b].mediaBox.topRightY-rt[b].mediaBox.bottomLeftY)/_},set:function(t){rt[b].mediaBox.topRightY=t*_+rt[b].mediaBox.bottomLeftY},enumerable:!0,configurable:!0}),function(t){for(var A=0,e=j.length;A<e;A++){var r=Qt(t[A][0],t[A][1],t[A][2],j[A][3],!0);h[r]=!0;var n=t[A][0].split("-");mt(r,n[0],n[1]||"")}it.publish("addFonts",{fonts:tt,dictionary:At})}(j),I="F1",vt(e,t),it.publish("initialized"),f}return s.API={events:[]},s.version="1.5.3",void 0!==(i=function(){return s}.call(A,e,A,t))&&(t.exports=i),s}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0!==r&&r||Function('return typeof this === "object" && this.content')()||Function("return this")());
/**
   * @license
   * Copyright (c) 2016 Alexander Weidt,
   * https://github.com/BiggA94
   * 
   * Licensed under the MIT License. http://opensource.org/licenses/mit-license
   */(function(t,A){var e,r=1,i=function(t){return t.replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")},o=function(t){return t.replace(/\\\\/g,"\\").replace(/\\\(/g,"(").replace(/\\\)/g,")")},s=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return t.toFixed(2)},a=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return t.toFixed(5)};t.__acroform__={};var c=function(t,A){t.prototype=Object.create(A.prototype),t.prototype.constructor=t},u=function(t){return t*r},l=function(t){return t/r},h=function(t){var A=new _,e=G.internal.getHeight(t)||0,r=G.internal.getWidth(t)||0;return A.BBox=[0,0,Number(s(r)),Number(s(e))],A},f=t.__acroform__.setBit=function(t,A){if(t=t||0,A=A||0,isNaN(t)||isNaN(A))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit");return t|1<<A},d=t.__acroform__.clearBit=function(t,A){if(t=t||0,A=A||0,isNaN(t)||isNaN(A))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit");return t&~(1<<A)},p=t.__acroform__.getBit=function(t,A){if(isNaN(t)||isNaN(A))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit");return 0==(t&1<<A)?0:1},B=t.__acroform__.getBitForPdf=function(t,A){if(isNaN(t)||isNaN(A))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf");return p(t,A-1)},g=t.__acroform__.setBitForPdf=function(t,A){if(isNaN(t)||isNaN(A))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf");return f(t,A-1)},w=t.__acroform__.clearBitForPdf=function(t,A,e){if(isNaN(t)||isNaN(A))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf");return d(t,A-1)},m=t.__acroform__.calculateCoordinates=function(t){var A=this.internal.getHorizontalCoordinate,e=this.internal.getVerticalCoordinate,r=t[0],n=t[1],i=t[2],o=t[3],a={};return a.lowerLeft_X=A(r)||0,a.lowerLeft_Y=e(n+o)||0,a.upperRight_X=A(r+i)||0,a.upperRight_Y=e(n)||0,[Number(s(a.lowerLeft_X)),Number(s(a.lowerLeft_Y)),Number(s(a.upperRight_X)),Number(s(a.upperRight_Y))]},Q=function(t){if(t.appearanceStreamContent)return t.appearanceStreamContent;if(t.V||t.DV){var A=[],r=t.V||t.DV,n=C(t,r),i=e.internal.getFont(t.fontName,t.fontStyle).id;A.push("/Tx BMC"),A.push("q"),A.push("BT"),A.push(e.__private__.encodeColorString(t.color)),A.push("/"+i+" "+s(n.fontSize)+" Tf"),A.push("1 0 0 1 0 0 Tm"),A.push(n.text),A.push("ET"),A.push("Q"),A.push("EMC");var o=new h(t);return o.stream=A.join("\n"),o}},C=function(t,A){var r=t.maxFontSize||12,n=(t.fontName,{text:"",fontSize:""}),o=(A=")"==(A="("==A.substr(0,1)?A.substr(1):A).substr(A.length-1)?A.substr(0,A.length-1):A).split(" "),a=(e.__private__.encodeColorString(t.color),r),c=G.internal.getHeight(t)||0;c=c<0?-c:c;var u=G.internal.getWidth(t)||0;u=u<0?-u:u;var l=function(A,e,r){if(A+1<o.length){var n=e+" "+o[A+1];return y(n,t,r).width<=u-4}return!1};a++;t:for(;;){A="";var h=y("3",t,--a).height,f=t.multiline?c-a:(c-h)/2,d=-2,p=f+=2,B=0,g=0,w=0;if(a<=0){A="(...) Tj\n",A+="% Width of Text: "+y(A,t,a=12).width+", FieldWidth:"+u+"\n";break}w=y(o[0]+" ",t,a).width;var m="",Q=0;for(var C in o)if(o.hasOwnProperty(C)){m=" "==(m+=o[C]+" ").substr(m.length-1)?m.substr(0,m.length-1):m;var v=parseInt(C);w=y(m+" ",t,a).width;var F=l(v,m,a),U=C>=o.length-1;if(F&&!U){m+=" ";continue}if(F||U){if(U)g=v;else if(t.multiline&&c<(h+2)*(Q+2)+2)continue t}else{if(!t.multiline)continue t;if(c<(h+2)*(Q+2)+2)continue t;g=v}for(var N="",E=B;E<=g;E++)N+=o[E]+" ";switch(N=" "==N.substr(N.length-1)?N.substr(0,N.length-1):N,w=y(N,t,a).width,t.textAlign){case"right":d=u-w-2;break;case"center":d=(u-w)/2;break;case"left":default:d=2}A+=s(d)+" "+s(p)+" Td\n",A+="("+i(N)+") Tj\n",A+=-s(d)+" 0 Td\n",p=-(a+2),w=0,B=g+1,Q++,m=""}break}return n.text=A,n.fontSize=a,n},y=function(t,A,r){var n=e.internal.getFont(A.fontName,A.fontStyle),i=e.getStringUnitWidth(t,{font:n,fontSize:parseFloat(r),charSpace:0})*parseFloat(r);return{height:e.getStringUnitWidth("3",{font:n,fontSize:parseFloat(r),charSpace:0})*parseFloat(r)*1.5,width:i}},v={fields:[],xForms:[],acroFormDictionaryRoot:null,printedOut:!1,internal:null,isInitialized:!1},F=function(){e.internal.acroformPlugin.acroFormDictionaryRoot.objId=void 0;var t=e.internal.acroformPlugin.acroFormDictionaryRoot.Fields;for(var A in t)if(t.hasOwnProperty(A)){var r=t[A];r.objId=void 0,r.hasAnnotation&&U.call(e,r)}},U=function(t){var A={type:"reference",object:t};void 0===e.internal.getPageInfo(t.page).pageContext.annotations.find((function(t){return t.type===A.type&&t.object===A.object}))&&e.internal.getPageInfo(t.page).pageContext.annotations.push(A)},N=function(){if(void 0===e.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("putCatalogCallback: Root missing.");e.internal.write("/AcroForm "+e.internal.acroformPlugin.acroFormDictionaryRoot.objId+" 0 R")},E=function(){e.internal.events.unsubscribe(e.internal.acroformPlugin.acroFormDictionaryRoot._eventID),delete e.internal.acroformPlugin.acroFormDictionaryRoot._eventID,e.internal.acroformPlugin.printedOut=!0},b=function(t){var A=!t;for(var r in t||(e.internal.newObjectDeferredBegin(e.internal.acroformPlugin.acroFormDictionaryRoot.objId,!0),e.internal.acroformPlugin.acroFormDictionaryRoot.putStream()),t=t||e.internal.acroformPlugin.acroFormDictionaryRoot.Kids)if(t.hasOwnProperty(r)){var i=t[r],o=[],s=i.Rect;if(i.Rect&&(i.Rect=m.call(this,i.Rect)),e.internal.newObjectDeferredBegin(i.objId,!0),i.DA=G.createDefaultAppearanceStream(i),"object"===n(i)&&"function"==typeof i.getKeyValueListForStream&&(o=i.getKeyValueListForStream()),i.Rect=s,i.hasAppearanceStream&&!i.appearanceStreamContent){var a=Q.call(this,i);o.push({key:"AP",value:"<</N "+a+">>"}),e.internal.acroformPlugin.xForms.push(a)}if(i.appearanceStreamContent){var c="";for(var u in i.appearanceStreamContent)if(i.appearanceStreamContent.hasOwnProperty(u)){var l=i.appearanceStreamContent[u];if(c+="/"+u+" ",c+="<<",1<=Object.keys(l).length||Array.isArray(l))for(var r in l){var h;l.hasOwnProperty(r)&&("function"==typeof(h=l[r])&&(h=h.call(this,i)),c+="/"+r+" "+h+" ",0<=e.internal.acroformPlugin.xForms.indexOf(h)||e.internal.acroformPlugin.xForms.push(h))}else"function"==typeof(h=l)&&(h=h.call(this,i)),c+="/"+r+" "+h,0<=e.internal.acroformPlugin.xForms.indexOf(h)||e.internal.acroformPlugin.xForms.push(h);c+=">>"}o.push({key:"AP",value:"<<\n"+c+">>"})}e.internal.putStream({additionalKeyValues:o}),e.internal.out("endobj")}A&&L.call(this,e.internal.acroformPlugin.xForms)},L=function(t){for(var A in t)if(t.hasOwnProperty(A)){var r=A,i=t[A];e.internal.newObjectDeferredBegin(i&&i.objId,!0),"object"===n(i)&&"function"==typeof i.putStream&&i.putStream(),delete t[r]}},H=function(){if(void 0!==this.internal&&(void 0===this.internal.acroformPlugin||!1===this.internal.acroformPlugin.isInitialized)){if(e=this,R.FieldNum=0,this.internal.acroformPlugin=JSON.parse(JSON.stringify(v)),this.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("Exception while creating AcroformDictionary");r=e.internal.scaleFactor,e.internal.acroformPlugin.acroFormDictionaryRoot=new T,e.internal.acroformPlugin.acroFormDictionaryRoot._eventID=e.internal.events.subscribe("postPutResources",E),e.internal.events.subscribe("buildDocument",F),e.internal.events.subscribe("putCatalog",N),e.internal.events.subscribe("postPutPages",b),e.internal.acroformPlugin.isInitialized=!0}},x=t.__acroform__.arrayToPdfArray=function(t){if(Array.isArray(t)){for(var A="[",e=0;e<t.length;e++)switch(0!==e&&(A+=" "),n(t[e])){case"boolean":case"number":case"object":A+=t[e].toString();break;case"string":"/"!==t[e].substr(0,1)?A+="("+i(t[e].toString())+")":A+=t[e].toString()}return A+"]"}throw new Error("Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray")},S=function(t){return(t=t||"").toString(),"("+i(t)+")"},I=function(){var t;Object.defineProperty(this,"objId",{configurable:!0,get:function(){if(t||(t=e.internal.newObjectDeferred()),!t)throw new Error("AcroFormPDFObject: Couldn't create Object ID");return t},set:function(A){t=A}})};I.prototype.toString=function(){return this.objId+" 0 R"},I.prototype.putStream=function(){var t=this.getKeyValueListForStream();e.internal.putStream({data:this.stream,additionalKeyValues:t}),e.internal.out("endobj")},I.prototype.getKeyValueListForStream=function(){return function(t){var A=[],e=Object.getOwnPropertyNames(t).filter((function(t){return"content"!=t&&"appearanceStreamContent"!=t&&"_"!=t.substring(0,1)}));for(var r in e)if(!1===Object.getOwnPropertyDescriptor(t,e[r]).configurable){var n=e[r],i=t[n];i&&(Array.isArray(i)?A.push({key:n,value:x(i)}):i instanceof I?A.push({key:n,value:i.objId+" 0 R"}):"function"!=typeof i&&A.push({key:n,value:i}))}return A}(this)};var _=function(){I.call(this),Object.defineProperty(this,"Type",{value:"/XObject",configurable:!1,writeable:!0}),Object.defineProperty(this,"Subtype",{value:"/Form",configurable:!1,writeable:!0}),Object.defineProperty(this,"FormType",{value:1,configurable:!1,writeable:!0});var t,A=[];Object.defineProperty(this,"BBox",{configurable:!1,writeable:!0,get:function(){return A},set:function(t){A=t}}),Object.defineProperty(this,"Resources",{value:"2 0 R",configurable:!1,writeable:!0}),Object.defineProperty(this,"stream",{enumerable:!1,configurable:!0,set:function(A){t=A.trim()},get:function(){return t||null}})};c(_,I);var T=function(){I.call(this);var t,A=[];Object.defineProperty(this,"Kids",{enumerable:!1,configurable:!0,get:function(){return 0<A.length?A:void 0}}),Object.defineProperty(this,"Fields",{enumerable:!1,configurable:!1,get:function(){return A}}),Object.defineProperty(this,"DA",{enumerable:!1,configurable:!1,get:function(){if(t)return"("+t+")"},set:function(A){t=A}})};c(T,I);var R=function t(){I.call(this);var A=4;Object.defineProperty(this,"F",{enumerable:!1,configurable:!1,get:function(){return A},set:function(t){if(isNaN(t))throw new Error('Invalid value "'+t+'" for attribute F supplied.');A=t}}),Object.defineProperty(this,"showWhenPrinted",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(A,3))},set:function(t){!0===Boolean(t)?this.F=g(A,3):this.F=w(A,3)}});var e=0;Object.defineProperty(this,"Ff",{enumerable:!1,configurable:!1,get:function(){return e},set:function(t){if(isNaN(t))throw new Error('Invalid value "'+t+'" for attribute Ff supplied.');e=t}});var r=[];Object.defineProperty(this,"Rect",{enumerable:!1,configurable:!1,get:function(){if(0!==r.length)return r},set:function(t){r=void 0!==t?t:[]}}),Object.defineProperty(this,"x",{enumerable:!0,configurable:!0,get:function(){return!r||isNaN(r[0])?0:l(r[0])},set:function(t){r[0]=u(t)}}),Object.defineProperty(this,"y",{enumerable:!0,configurable:!0,get:function(){return!r||isNaN(r[1])?0:l(r[1])},set:function(t){r[1]=u(t)}}),Object.defineProperty(this,"width",{enumerable:!0,configurable:!0,get:function(){return!r||isNaN(r[2])?0:l(r[2])},set:function(t){r[2]=u(t)}}),Object.defineProperty(this,"height",{enumerable:!0,configurable:!0,get:function(){return!r||isNaN(r[3])?0:l(r[3])},set:function(t){r[3]=u(t)}});var n="";Object.defineProperty(this,"FT",{enumerable:!0,configurable:!1,get:function(){return n},set:function(t){switch(t){case"/Btn":case"/Tx":case"/Ch":case"/Sig":n=t;break;default:throw new Error('Invalid value "'+t+'" for attribute FT supplied.')}}});var s=null;Object.defineProperty(this,"T",{enumerable:!0,configurable:!1,get:function(){if(!s||s.length<1){if(this instanceof j)return;s="FieldObject"+t.FieldNum++}return"("+i(s)+")"},set:function(t){s=t.toString()}}),Object.defineProperty(this,"fieldName",{configurable:!0,enumerable:!0,get:function(){return s},set:function(t){s=t}});var a="helvetica";Object.defineProperty(this,"fontName",{enumerable:!0,configurable:!0,get:function(){return a},set:function(t){a=t}});var c="normal";Object.defineProperty(this,"fontStyle",{enumerable:!0,configurable:!0,get:function(){return c},set:function(t){c=t}});var h=0;Object.defineProperty(this,"fontSize",{enumerable:!0,configurable:!0,get:function(){return l(h)},set:function(t){h=u(t)}});var f=50;Object.defineProperty(this,"maxFontSize",{enumerable:!0,configurable:!0,get:function(){return l(f)},set:function(t){f=u(t)}});var d="black";Object.defineProperty(this,"color",{enumerable:!0,configurable:!0,get:function(){return d},set:function(t){d=t}});var p="/F1 0 Tf 0 g";Object.defineProperty(this,"DA",{enumerable:!0,configurable:!1,get:function(){if(!(!p||this instanceof j||this instanceof V))return S(p)},set:function(t){t=t.toString(),p=t}});var m=null;Object.defineProperty(this,"DV",{enumerable:!1,configurable:!1,get:function(){if(m)return this instanceof D==0?S(m):m},set:function(t){t=t.toString(),m=this instanceof D==0?"("===t.substr(0,1)?o(t.substr(1,t.length-2)):o(t):t}}),Object.defineProperty(this,"defaultValue",{enumerable:!0,configurable:!0,get:function(){return this instanceof D==1?o(m.substr(1,m.length-1)):m},set:function(t){t=t.toString(),m=this instanceof D==1?"/"+t:t}});var Q=null;Object.defineProperty(this,"V",{enumerable:!1,configurable:!1,get:function(){if(Q)return this instanceof D==0?S(Q):Q},set:function(t){t=t.toString(),Q=this instanceof D==0?"("===t.substr(0,1)?o(t.substr(1,t.length-2)):o(t):t}}),Object.defineProperty(this,"value",{enumerable:!0,configurable:!0,get:function(){return this instanceof D==1?o(Q.substr(1,Q.length-1)):Q},set:function(t){t=t.toString(),Q=this instanceof D==1?"/"+t:t}}),Object.defineProperty(this,"hasAnnotation",{enumerable:!0,configurable:!0,get:function(){return this.Rect}}),Object.defineProperty(this,"Type",{enumerable:!0,configurable:!1,get:function(){return this.hasAnnotation?"/Annot":null}}),Object.defineProperty(this,"Subtype",{enumerable:!0,configurable:!1,get:function(){return this.hasAnnotation?"/Widget":null}});var C,y=!1;Object.defineProperty(this,"hasAppearanceStream",{enumerable:!0,configurable:!0,writeable:!0,get:function(){return y},set:function(t){t=Boolean(t),y=t}}),Object.defineProperty(this,"page",{enumerable:!0,configurable:!0,writeable:!0,get:function(){if(C)return C},set:function(t){C=t}}),Object.defineProperty(this,"readOnly",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,1))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,1):this.Ff=w(this.Ff,1)}}),Object.defineProperty(this,"required",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,2))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,2):this.Ff=w(this.Ff,2)}}),Object.defineProperty(this,"noExport",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,3))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,3):this.Ff=w(this.Ff,3)}});var v=null;Object.defineProperty(this,"Q",{enumerable:!0,configurable:!1,get:function(){if(null!==v)return v},set:function(t){if(-1===[0,1,2].indexOf(t))throw new Error('Invalid value "'+t+'" for attribute Q supplied.');v=t}}),Object.defineProperty(this,"textAlign",{get:function(){var t="left";switch(v){case 0:default:t="left";break;case 1:t="center";break;case 2:t="right"}return t},configurable:!0,enumerable:!0,set:function(t){switch(t){case"right":case 2:v=2;break;case"center":case 1:v=1;break;case"left":case 0:default:v=0}}})};c(R,I);var O=function(){R.call(this),this.FT="/Ch",this.V="()",this.fontName="zapfdingbats";var t=0;Object.defineProperty(this,"TI",{enumerable:!0,configurable:!1,get:function(){return t},set:function(A){t=A}}),Object.defineProperty(this,"topIndex",{enumerable:!0,configurable:!0,get:function(){return t},set:function(A){t=A}});var A=[];Object.defineProperty(this,"Opt",{enumerable:!0,configurable:!1,get:function(){return x(A)},set:function(t){var e,r;r=[],"string"==typeof(e=t)&&(r=function(t,A,e){e||(e=1);for(var r,n=[];r=A.exec(t);)n.push(r[e]);return n}(e,/\((.*?)\)/g)),A=r}}),this.getOptions=function(){return A},this.setOptions=function(t){A=t,this.sort&&A.sort()},this.addOption=function(t){t=(t=t||"").toString(),A.push(t),this.sort&&A.sort()},this.removeOption=function(t,e){for(e=e||!1,t=(t=t||"").toString();-1!==A.indexOf(t)&&(A.splice(A.indexOf(t),1),!1!==e););},Object.defineProperty(this,"combo",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,18))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,18):this.Ff=w(this.Ff,18)}}),Object.defineProperty(this,"edit",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,19))},set:function(t){!0===this.combo&&(!0===Boolean(t)?this.Ff=g(this.Ff,19):this.Ff=w(this.Ff,19))}}),Object.defineProperty(this,"sort",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,20))},set:function(t){!0===Boolean(t)?(this.Ff=g(this.Ff,20),A.sort()):this.Ff=w(this.Ff,20)}}),Object.defineProperty(this,"multiSelect",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,22))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,22):this.Ff=w(this.Ff,22)}}),Object.defineProperty(this,"doNotSpellCheck",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,23))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,23):this.Ff=w(this.Ff,23)}}),Object.defineProperty(this,"commitOnSelChange",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,27))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,27):this.Ff=w(this.Ff,27)}}),this.hasAppearanceStream=!1};c(O,R);var K=function(){O.call(this),this.fontName="helvetica",this.combo=!1};c(K,O);var M=function(){K.call(this),this.combo=!0};c(M,K);var P=function(){M.call(this),this.edit=!0};c(P,M);var D=function(){R.call(this),this.FT="/Btn",Object.defineProperty(this,"noToggleToOff",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,15))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,15):this.Ff=w(this.Ff,15)}}),Object.defineProperty(this,"radio",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,16))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,16):this.Ff=w(this.Ff,16)}}),Object.defineProperty(this,"pushButton",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,17))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,17):this.Ff=w(this.Ff,17)}}),Object.defineProperty(this,"radioIsUnison",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,26))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,26):this.Ff=w(this.Ff,26)}});var t,A={};Object.defineProperty(this,"MK",{enumerable:!1,configurable:!1,get:function(){if(0!==Object.keys(A).length){var t,e=[];for(t in e.push("<<"),A)e.push("/"+t+" ("+A[t]+")");return e.push(">>"),e.join("\n")}},set:function(t){"object"===n(t)&&(A=t)}}),Object.defineProperty(this,"caption",{enumerable:!0,configurable:!0,get:function(){return A.CA||""},set:function(t){"string"==typeof t&&(A.CA=t)}}),Object.defineProperty(this,"AS",{enumerable:!1,configurable:!1,get:function(){return t},set:function(A){t=A}}),Object.defineProperty(this,"appearanceState",{enumerable:!0,configurable:!0,get:function(){return t.substr(1,t.length-1)},set:function(A){t="/"+A}})};c(D,R);var k=function(){D.call(this),this.pushButton=!0};c(k,D);var z=function(){D.call(this),this.radio=!0,this.pushButton=!1;var t=[];Object.defineProperty(this,"Kids",{enumerable:!0,configurable:!1,get:function(){return t},set:function(A){t=void 0!==A?A:[]}})};c(z,D);var j=function(){var t,A;R.call(this),Object.defineProperty(this,"Parent",{enumerable:!1,configurable:!1,get:function(){return t},set:function(A){t=A}}),Object.defineProperty(this,"optionName",{enumerable:!1,configurable:!0,get:function(){return A},set:function(t){A=t}});var e,r={};Object.defineProperty(this,"MK",{enumerable:!1,configurable:!1,get:function(){var t,A=[];for(t in A.push("<<"),r)A.push("/"+t+" ("+r[t]+")");return A.push(">>"),A.join("\n")},set:function(t){"object"===n(t)&&(r=t)}}),Object.defineProperty(this,"caption",{enumerable:!0,configurable:!0,get:function(){return r.CA||""},set:function(t){"string"==typeof t&&(r.CA=t)}}),Object.defineProperty(this,"AS",{enumerable:!1,configurable:!1,get:function(){return e},set:function(t){e=t}}),Object.defineProperty(this,"appearanceState",{enumerable:!0,configurable:!0,get:function(){return e.substr(1,e.length-1)},set:function(t){e="/"+t}}),this.optionName=name,this.caption="l",this.appearanceState="Off",this._AppearanceType=G.RadioButton.Circle,this.appearanceStreamContent=this._AppearanceType.createAppearanceStream(name)};c(j,R),z.prototype.setAppearance=function(t){if(!("createAppearanceStream"in t)||!("getCA"in t))throw new Error("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");for(var A in this.Kids)if(this.Kids.hasOwnProperty(A)){var e=this.Kids[A];e.appearanceStreamContent=t.createAppearanceStream(e.optionName),e.caption=t.getCA()}},z.prototype.createOption=function(t){this.Kids.length;var A=new j;return A.Parent=this,A.optionName=t,this.Kids.push(A),J.call(this,A),A};var q=function(){D.call(this),this.fontName="zapfdingbats",this.caption="3",this.appearanceState="On",this.value="On",this.textAlign="center",this.appearanceStreamContent=G.CheckBox.createAppearanceStream()};c(q,D);var V=function(){R.call(this),this.FT="/Tx",Object.defineProperty(this,"multiline",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,13))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,13):this.Ff=w(this.Ff,13)}}),Object.defineProperty(this,"fileSelect",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,21))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,21):this.Ff=w(this.Ff,21)}}),Object.defineProperty(this,"doNotSpellCheck",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,23))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,23):this.Ff=w(this.Ff,23)}}),Object.defineProperty(this,"doNotScroll",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,24))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,24):this.Ff=w(this.Ff,24)}}),Object.defineProperty(this,"comb",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,25))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,25):this.Ff=w(this.Ff,25)}}),Object.defineProperty(this,"richText",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,26))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,26):this.Ff=w(this.Ff,26)}});var t=null;Object.defineProperty(this,"MaxLen",{enumerable:!0,configurable:!1,get:function(){return t},set:function(A){t=A}}),Object.defineProperty(this,"maxLength",{enumerable:!0,configurable:!0,get:function(){return t},set:function(A){Number.isInteger(A)&&(t=A)}}),Object.defineProperty(this,"hasAppearanceStream",{enumerable:!0,configurable:!0,get:function(){return this.V||this.DV}})};c(V,R);var X=function(){V.call(this),Object.defineProperty(this,"password",{enumerable:!0,configurable:!0,get:function(){return Boolean(B(this.Ff,14))},set:function(t){!0===Boolean(t)?this.Ff=g(this.Ff,14):this.Ff=w(this.Ff,14)}}),this.password=!0};c(X,V);var G={CheckBox:{createAppearanceStream:function(){return{N:{On:G.CheckBox.YesNormal},D:{On:G.CheckBox.YesPushDown,Off:G.CheckBox.OffPushDown}}},YesPushDown:function(t){var A=h(t),r=[],n=e.internal.getFont(t.fontName,t.fontStyle).id,i=e.__private__.encodeColorString(t.color),o=C(t,t.caption);return r.push("0.749023 g"),r.push("0 0 "+s(G.internal.getWidth(t))+" "+s(G.internal.getHeight(t))+" re"),r.push("f"),r.push("BMC"),r.push("q"),r.push("0 0 1 rg"),r.push("/"+n+" "+s(o.fontSize)+" Tf "+i),r.push("BT"),r.push(o.text),r.push("ET"),r.push("Q"),r.push("EMC"),A.stream=r.join("\n"),A},YesNormal:function(t){var A=h(t),r=e.internal.getFont(t.fontName,t.fontStyle).id,n=e.__private__.encodeColorString(t.color),i=[],o=G.internal.getHeight(t),a=G.internal.getWidth(t),c=C(t,t.caption);return i.push("1 g"),i.push("0 0 "+s(a)+" "+s(o)+" re"),i.push("f"),i.push("q"),i.push("0 0 1 rg"),i.push("0 0 "+s(a-1)+" "+s(o-1)+" re"),i.push("W"),i.push("n"),i.push("0 g"),i.push("BT"),i.push("/"+r+" "+s(c.fontSize)+" Tf "+n),i.push(c.text),i.push("ET"),i.push("Q"),A.stream=i.join("\n"),A},OffPushDown:function(t){var A=h(t),e=[];return e.push("0.749023 g"),e.push("0 0 "+s(G.internal.getWidth(t))+" "+s(G.internal.getHeight(t))+" re"),e.push("f"),A.stream=e.join("\n"),A}},RadioButton:{Circle:{createAppearanceStream:function(t){var A={D:{Off:G.RadioButton.Circle.OffPushDown},N:{}};return A.N[t]=G.RadioButton.Circle.YesNormal,A.D[t]=G.RadioButton.Circle.YesPushDown,A},getCA:function(){return"l"},YesNormal:function(t){var A=h(t),e=[],r=G.internal.getWidth(t)<=G.internal.getHeight(t)?G.internal.getWidth(t)/4:G.internal.getHeight(t)/4;r=Number((.9*r).toFixed(5));var n=G.internal.Bezier_C,i=Number((r*n).toFixed(5));return e.push("q"),e.push("1 0 0 1 "+a(G.internal.getWidth(t)/2)+" "+a(G.internal.getHeight(t)/2)+" cm"),e.push(r+" 0 m"),e.push(r+" "+i+" "+i+" "+r+" 0 "+r+" c"),e.push("-"+i+" "+r+" -"+r+" "+i+" -"+r+" 0 c"),e.push("-"+r+" -"+i+" -"+i+" -"+r+" 0 -"+r+" c"),e.push(i+" -"+r+" "+r+" -"+i+" "+r+" 0 c"),e.push("f"),e.push("Q"),A.stream=e.join("\n"),A},YesPushDown:function(t){var A=h(t),e=[],r=G.internal.getWidth(t)<=G.internal.getHeight(t)?G.internal.getWidth(t)/4:G.internal.getHeight(t)/4,n=(r=Number((.9*r).toFixed(5)),Number((2*r).toFixed(5))),i=Number((n*G.internal.Bezier_C).toFixed(5)),o=Number((r*G.internal.Bezier_C).toFixed(5));return e.push("0.749023 g"),e.push("q"),e.push("1 0 0 1 "+a(G.internal.getWidth(t)/2)+" "+a(G.internal.getHeight(t)/2)+" cm"),e.push(n+" 0 m"),e.push(n+" "+i+" "+i+" "+n+" 0 "+n+" c"),e.push("-"+i+" "+n+" -"+n+" "+i+" -"+n+" 0 c"),e.push("-"+n+" -"+i+" -"+i+" -"+n+" 0 -"+n+" c"),e.push(i+" -"+n+" "+n+" -"+i+" "+n+" 0 c"),e.push("f"),e.push("Q"),e.push("0 g"),e.push("q"),e.push("1 0 0 1 "+a(G.internal.getWidth(t)/2)+" "+a(G.internal.getHeight(t)/2)+" cm"),e.push(r+" 0 m"),e.push(r+" "+o+" "+o+" "+r+" 0 "+r+" c"),e.push("-"+o+" "+r+" -"+r+" "+o+" -"+r+" 0 c"),e.push("-"+r+" -"+o+" -"+o+" -"+r+" 0 -"+r+" c"),e.push(o+" -"+r+" "+r+" -"+o+" "+r+" 0 c"),e.push("f"),e.push("Q"),A.stream=e.join("\n"),A},OffPushDown:function(t){var A=h(t),e=[],r=G.internal.getWidth(t)<=G.internal.getHeight(t)?G.internal.getWidth(t)/4:G.internal.getHeight(t)/4,n=(r=Number((.9*r).toFixed(5)),Number((2*r).toFixed(5))),i=Number((n*G.internal.Bezier_C).toFixed(5));return e.push("0.749023 g"),e.push("q"),e.push("1 0 0 1 "+a(G.internal.getWidth(t)/2)+" "+a(G.internal.getHeight(t)/2)+" cm"),e.push(n+" 0 m"),e.push(n+" "+i+" "+i+" "+n+" 0 "+n+" c"),e.push("-"+i+" "+n+" -"+n+" "+i+" -"+n+" 0 c"),e.push("-"+n+" -"+i+" -"+i+" -"+n+" 0 -"+n+" c"),e.push(i+" -"+n+" "+n+" -"+i+" "+n+" 0 c"),e.push("f"),e.push("Q"),A.stream=e.join("\n"),A}},Cross:{createAppearanceStream:function(t){var A={D:{Off:G.RadioButton.Cross.OffPushDown},N:{}};return A.N[t]=G.RadioButton.Cross.YesNormal,A.D[t]=G.RadioButton.Cross.YesPushDown,A},getCA:function(){return"8"},YesNormal:function(t){var A=h(t),e=[],r=G.internal.calculateCross(t);return e.push("q"),e.push("1 1 "+s(G.internal.getWidth(t)-2)+" "+s(G.internal.getHeight(t)-2)+" re"),e.push("W"),e.push("n"),e.push(s(r.x1.x)+" "+s(r.x1.y)+" m"),e.push(s(r.x2.x)+" "+s(r.x2.y)+" l"),e.push(s(r.x4.x)+" "+s(r.x4.y)+" m"),e.push(s(r.x3.x)+" "+s(r.x3.y)+" l"),e.push("s"),e.push("Q"),A.stream=e.join("\n"),A},YesPushDown:function(t){var A=h(t),e=G.internal.calculateCross(t),r=[];return r.push("0.749023 g"),r.push("0 0 "+s(G.internal.getWidth(t))+" "+s(G.internal.getHeight(t))+" re"),r.push("f"),r.push("q"),r.push("1 1 "+s(G.internal.getWidth(t)-2)+" "+s(G.internal.getHeight(t)-2)+" re"),r.push("W"),r.push("n"),r.push(s(e.x1.x)+" "+s(e.x1.y)+" m"),r.push(s(e.x2.x)+" "+s(e.x2.y)+" l"),r.push(s(e.x4.x)+" "+s(e.x4.y)+" m"),r.push(s(e.x3.x)+" "+s(e.x3.y)+" l"),r.push("s"),r.push("Q"),A.stream=r.join("\n"),A},OffPushDown:function(t){var A=h(t),e=[];return e.push("0.749023 g"),e.push("0 0 "+s(G.internal.getWidth(t))+" "+s(G.internal.getHeight(t))+" re"),e.push("f"),A.stream=e.join("\n"),A}}},createDefaultAppearanceStream:function(t){var A=e.internal.getFont(t.fontName,t.fontStyle).id,r=e.__private__.encodeColorString(t.color);return"/"+A+" "+t.fontSize+" Tf "+r}};G.internal={Bezier_C:.551915024494,calculateCross:function(t){var A=G.internal.getWidth(t),e=G.internal.getHeight(t),r=Math.min(A,e);return{x1:{x:(A-r)/2,y:(e-r)/2+r},x2:{x:(A-r)/2+r,y:(e-r)/2},x3:{x:(A-r)/2,y:(e-r)/2},x4:{x:(A-r)/2+r,y:(e-r)/2+r}}}},G.internal.getWidth=function(t){var A=0;return"object"===n(t)&&(A=u(t.Rect[2])),A},G.internal.getHeight=function(t){var A=0;return"object"===n(t)&&(A=u(t.Rect[3])),A};var J=t.addField=function(t){if(H.call(this),!(t instanceof R))throw new Error("Invalid argument passed to jsPDF.addField.");return function(t){e.internal.acroformPlugin.printedOut&&(e.internal.acroformPlugin.printedOut=!1,e.internal.acroformPlugin.acroFormDictionaryRoot=null),e.internal.acroformPlugin.acroFormDictionaryRoot||H.call(e),e.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(t)}.call(this,t),t.page=e.internal.getCurrentPageInfo().pageNumber,this};t.addButton=function(t){if(t instanceof D==0)throw new Error("Invalid argument passed to jsPDF.addButton.");return J.call(this,t)},t.addTextField=function(t){if(t instanceof V==0)throw new Error("Invalid argument passed to jsPDF.addTextField.");return J.call(this,t)},t.addChoiceField=function(t){if(t instanceof O==0)throw new Error("Invalid argument passed to jsPDF.addChoiceField.");return J.call(this,t)},"object"==n(A)&&void 0===A.ChoiceField&&void 0===A.ListBox&&void 0===A.ComboBox&&void 0===A.EditBox&&void 0===A.Button&&void 0===A.PushButton&&void 0===A.RadioButton&&void 0===A.CheckBox&&void 0===A.TextField&&void 0===A.PasswordField?(A.ChoiceField=O,A.ListBox=K,A.ComboBox=M,A.EditBox=P,A.Button=D,A.PushButton=k,A.RadioButton=z,A.CheckBox=q,A.TextField=V,A.PasswordField=X,A.AcroForm={Appearance:G}):console.warn("AcroForm-Classes are not populated into global-namespace, because the class-Names exist already."),t.AcroFormChoiceField=O,t.AcroFormListBox=K,t.AcroFormComboBox=M,t.AcroFormEditBox=P,t.AcroFormButton=D,t.AcroFormPushButton=k,t.AcroFormRadioButton=z,t.AcroFormCheckBox=q,t.AcroFormTextField=V,t.AcroFormPasswordField=X,t.AcroFormAppearance=G,t.AcroForm={ChoiceField:O,ListBox:K,ComboBox:M,EditBox:P,Button:D,PushButton:k,RadioButton:z,CheckBox:q,TextField:V,PasswordField:X,Appearance:G}})((window.tmp=dt).API,"undefined"!=typeof window&&window||void 0!==r&&r),
/** @license
   * jsPDF addImage plugin
   * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
   *               2013 Chris Dowling, https://github.com/gingerchris
   *               2013 Trinh Ho, https://github.com/ineedfat
   *               2013 Edwin Alejandro Perez, https://github.com/eaparango
   *               2013 Norah Smith, https://github.com/burnburnrocket
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 James Robb, https://github.com/jamesbrobb
   *
   * 
   */
function(t){var A="addImage_",e={PNG:[[137,80,78,71]],TIFF:[[77,77,0,42],[73,73,42,0]],JPEG:[[255,216,255,224,void 0,void 0,74,70,73,70,0],[255,216,255,225,void 0,void 0,69,120,105,102,0,0]],JPEG2000:[[0,0,0,12,106,80,32,32]],GIF87a:[[71,73,70,56,55,97]],GIF89a:[[71,73,70,56,57,97]],BMP:[[66,77],[66,65],[67,73],[67,80],[73,67],[80,84]]},r=t.getImageFileTypeByImageData=function(A,r){var n,i;r=r||"UNKNOWN";var o,s,a,c="UNKNOWN";for(a in t.isArrayBufferView(A)&&(A=t.arrayBufferToBinaryString(A)),e)for(o=e[a],n=0;n<o.length;n+=1){for(s=!0,i=0;i<o[n].length;i+=1)if(void 0!==o[n][i]&&o[n][i]!==A.charCodeAt(i)){s=!1;break}if(!0===s){c=a;break}}return"UNKNOWN"===c&&"UNKNOWN"!==r&&(console.warn('FileType of Image not recognized. Processing image as "'+r+'".'),c=r),c},i=function t(A){for(var e=this.internal.newObject(),r=this.internal.write,n=this.internal.putStream,i=(0,this.internal.getFilters)();-1!==i.indexOf("FlateEncode");)i.splice(i.indexOf("FlateEncode"),1);A.n=e;var o=[];if(o.push({key:"Type",value:"/XObject"}),o.push({key:"Subtype",value:"/Image"}),o.push({key:"Width",value:A.w}),o.push({key:"Height",value:A.h}),A.cs===this.color_spaces.INDEXED?o.push({key:"ColorSpace",value:"[/Indexed /DeviceRGB "+(A.pal.length/3-1)+" "+("smask"in A?e+2:e+1)+" 0 R]"}):(o.push({key:"ColorSpace",value:"/"+A.cs}),A.cs===this.color_spaces.DEVICE_CMYK&&o.push({key:"Decode",value:"[1 0 1 0 1 0 1 0]"})),o.push({key:"BitsPerComponent",value:A.bpc}),"dp"in A&&o.push({key:"DecodeParms",value:"<<"+A.dp+">>"}),"trns"in A&&A.trns.constructor==Array){for(var s="",a=0,c=A.trns.length;a<c;a++)s+=A.trns[a]+" "+A.trns[a]+" ";o.push({key:"Mask",value:"["+s+"]"})}"smask"in A&&o.push({key:"SMask",value:e+1+" 0 R"});var u=void 0!==A.f?["/"+A.f]:void 0;if(n({data:A.data,additionalKeyValues:o,alreadyAppliedFilters:u}),r("endobj"),"smask"in A){var l="/Predictor "+A.p+" /Colors 1 /BitsPerComponent "+A.bpc+" /Columns "+A.w,h={w:A.w,h:A.h,cs:"DeviceGray",bpc:A.bpc,dp:l,data:A.smask};"f"in A&&(h.f=A.f),t.call(this,h)}A.cs===this.color_spaces.INDEXED&&(this.internal.newObject(),n({data:this.arrayBufferToBinaryString(new Uint8Array(A.pal))}),r("endobj"))},o=function(){var t=this.internal.collections[A+"images"];for(var e in t)i.call(this,t[e])},s=function(){var t,e=this.internal.collections[A+"images"],r=this.internal.write;for(var n in e)r("/I"+(t=e[n]).i,t.n,"0","R")},a=function(A){return"function"==typeof t["process"+A.toUpperCase()]},c=function(t){return"object"===n(t)&&1===t.nodeType},u=function(A,e){if("IMG"===A.nodeName&&A.hasAttribute("src")){var r=""+A.getAttribute("src");if(0===r.indexOf("data:image/"))return unescape(r);var n=t.loadFile(r);if(void 0!==n)return btoa(n)}if("CANVAS"===A.nodeName){var i=A;return A.toDataURL("image/jpeg",1)}(i=document.createElement("canvas")).width=A.clientWidth||A.width,i.height=A.clientHeight||A.height;var o=i.getContext("2d");if(!o)throw"addImage requires canvas to be supported by browser.";return o.drawImage(A,0,0,i.width,i.height),i.toDataURL("png"==(""+e).toLowerCase()?"image/png":"image/jpeg")},l=function(t,A){var e;if(A)for(var r in A)if(t===A[r].alias){e=A[r];break}return e};t.color_spaces={DEVICE_RGB:"DeviceRGB",DEVICE_GRAY:"DeviceGray",DEVICE_CMYK:"DeviceCMYK",CAL_GREY:"CalGray",CAL_RGB:"CalRGB",LAB:"Lab",ICC_BASED:"ICCBased",INDEXED:"Indexed",PATTERN:"Pattern",SEPARATION:"Separation",DEVICE_N:"DeviceN"},t.decode={DCT_DECODE:"DCTDecode",FLATE_DECODE:"FlateDecode",LZW_DECODE:"LZWDecode",JPX_DECODE:"JPXDecode",JBIG2_DECODE:"JBIG2Decode",ASCII85_DECODE:"ASCII85Decode",ASCII_HEX_DECODE:"ASCIIHexDecode",RUN_LENGTH_DECODE:"RunLengthDecode",CCITT_FAX_DECODE:"CCITTFaxDecode"},t.image_compression={NONE:"NONE",FAST:"FAST",MEDIUM:"MEDIUM",SLOW:"SLOW"},t.sHashCode=function(t){var A,e=0;if(0===(t=t||"").length)return e;for(A=0;A<t.length;A++)e=(e<<5)-e+t.charCodeAt(A),e|=0;return e},t.isString=function(t){return"string"==typeof t},t.validateStringAsBase64=function(t){(t=t||"").toString().trim();var A=!0;return 0===t.length&&(A=!1),t.length%4!=0&&(A=!1),!1===/^[A-Za-z0-9+\/]+$/.test(t.substr(0,t.length-2))&&(A=!1),!1===/^[A-Za-z0-9\/][A-Za-z0-9+\/]|[A-Za-z0-9+\/]=|==$/.test(t.substr(-2))&&(A=!1),A},t.extractInfoFromBase64DataURI=function(t){return/^data:([\w]+?\/([\w]+?));\S*;*base64,(.+)$/g.exec(t)},t.extractImageFromDataUrl=function(t){var A=(t=t||"").split("base64,"),e=null;if(2===A.length){var r=/^data:(\w*\/\w*);*(charset=[\w=-]*)*;*$/.exec(A[0]);Array.isArray(r)&&(e={mimeType:r[1],charset:r[2],data:A[1]})}return e},t.supportsArrayBuffer=function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array},t.isArrayBuffer=function(t){return!!this.supportsArrayBuffer()&&t instanceof ArrayBuffer},t.isArrayBufferView=function(t){return!!this.supportsArrayBuffer()&&"undefined"!=typeof Uint32Array&&(t instanceof Int8Array||t instanceof Uint8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array)},t.binaryStringToUint8Array=function(t){for(var A=t.length,e=new Uint8Array(A),r=0;r<A;r++)e[r]=t.charCodeAt(r);return e},t.arrayBufferToBinaryString=function(t){if("function"==typeof atob)return atob(this.arrayBufferToBase64(t))},t.arrayBufferToBase64=function(t){for(var A,e="",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=new Uint8Array(t),i=n.byteLength,o=i%3,s=i-o,a=0;a<s;a+=3)e+=r[(16515072&(A=n[a]<<16|n[a+1]<<8|n[a+2]))>>18]+r[(258048&A)>>12]+r[(4032&A)>>6]+r[63&A];return 1==o?e+=r[(252&(A=n[s]))>>2]+r[(3&A)<<4]+"==":2==o&&(e+=r[(64512&(A=n[s]<<8|n[s+1]))>>10]+r[(1008&A)>>4]+r[(15&A)<<2]+"="),e},t.createImageInfo=function(t,A,e,r,n,i,o,s,a,c,u,l,h){var f={alias:s,w:A,h:e,cs:r,bpc:n,i:o,data:t};return i&&(f.f=i),a&&(f.dp=a),c&&(f.trns=c),u&&(f.pal=u),l&&(f.smask=l),h&&(f.p=h),f},t.addImage=function(e,r,i,h,f,d,p,B,g){var w="";if("string"!=typeof r){var m=d;d=f,f=h,h=i,i=r,r=m}if("object"===n(e)&&!c(e)&&"imageData"in e){var Q=e;e=Q.imageData,r=Q.format||r||"UNKNOWN",i=Q.x||i||0,h=Q.y||h||0,f=Q.w||f,d=Q.h||d,p=Q.alias||p,B=Q.compression||B,g=Q.rotation||Q.angle||g}var C=this.internal.getFilters();if(void 0===B&&-1!==C.indexOf("FlateEncode")&&(B="SLOW"),"string"==typeof e&&(e=unescape(e)),isNaN(i)||isNaN(h))throw console.error("jsPDF.addImage: Invalid coordinates",arguments),new Error("Invalid coordinates passed to jsPDF.addImage");var y,v,F,U,N,E,b,L=function(){var t=this.internal.collections[A+"images"];return t||(this.internal.collections[A+"images"]=t={},this.internal.events.subscribe("putResources",o),this.internal.events.subscribe("putXobjectDict",s)),t}.call(this);if(!((y=l(e,L))||(c(e)&&(e=u(e,r)),(null==(b=p)||0===b.length)&&(p="string"==typeof(E=e)?t.sHashCode(E):t.isArrayBufferView(E)?t.sHashCode(t.arrayBufferToBinaryString(E)):null),y=l(p,L)))){if(this.isString(e)&&(""!==(w=this.convertStringToImageData(e))||void 0!==(w=t.loadFile(e)))&&(e=w),r=this.getImageFileTypeByImageData(e,r),!a(r))throw new Error("addImage does not support files of type '"+r+"', please ensure that a plugin for '"+r+"' support is added.");if(this.supportsArrayBuffer()&&(e instanceof Uint8Array||(v=e,e=this.binaryStringToUint8Array(e))),!(y=this["process"+r.toUpperCase()](e,(N=0,(U=L)&&(N=Object.keys?Object.keys(U).length:function(t){var A=0;for(var e in t)t.hasOwnProperty(e)&&A++;return A}(U)),N),p,((F=B)&&"string"==typeof F&&(F=F.toUpperCase()),F in t.image_compression?F:t.image_compression.NONE),v)))throw new Error("An unknown error occurred whilst processing the image")}return function(t,A,e,r,n,i,o,s){var a=function(t,A,e){return t||A||(A=t=-96),t<0&&(t=-1*e.w*72/t/this.internal.scaleFactor),A<0&&(A=-1*e.h*72/A/this.internal.scaleFactor),0===t&&(t=A*e.w/e.h),0===A&&(A=t*e.h/e.w),[t,A]}.call(this,e,r,n),c=this.internal.getCoordinateString,u=this.internal.getVerticalCoordinateString;if(e=a[0],r=a[1],o[i]=n,s){s*=Math.PI/180;var l=Math.cos(s),h=Math.sin(s),f=function(t){return t.toFixed(4)},d=[f(l),f(h),f(-1*h),f(l),0,0,"cm"]}this.internal.write("q"),s?(this.internal.write([1,"0","0",1,c(t),u(A+r),"cm"].join(" ")),this.internal.write(d.join(" ")),this.internal.write([c(e),"0","0",c(r),"0","0","cm"].join(" "))):this.internal.write([c(e),"0","0",c(r),c(t),u(A+r),"cm"].join(" ")),this.internal.write("/I"+n.i+" Do"),this.internal.write("Q")}.call(this,i,h,f,d,y,y.i,L,g),this},t.convertStringToImageData=function(A){var e,r="";if(this.isString(A)){var n;e=null!==(n=this.extractImageFromDataUrl(A))?n.data:A;try{r=atob(e)}catch(A){throw t.validateStringAsBase64(e)?new Error("atob-Error in jsPDF.convertStringToImageData "+A.message):new Error("Supplied Data is not a valid base64-String jsPDF.convertStringToImageData ")}}return r};var h=function(t,A){return t.subarray(A,A+5)};t.processJPEG=function(t,A,e,n,i,o){var s,a=this.decode.DCT_DECODE;if(!this.isString(t)&&!this.isArrayBuffer(t)&&!this.isArrayBufferView(t))return null;if(this.isString(t)&&(s=function(t){var A;if("JPEG"!==r(t))throw new Error("getJpegSize requires a binary string jpeg file");for(var e=256*t.charCodeAt(4)+t.charCodeAt(5),n=4,i=t.length;n<i;){if(n+=e,255!==t.charCodeAt(n))throw new Error("getJpegSize could not find the size of the image");if(192===t.charCodeAt(n+1)||193===t.charCodeAt(n+1)||194===t.charCodeAt(n+1)||195===t.charCodeAt(n+1)||196===t.charCodeAt(n+1)||197===t.charCodeAt(n+1)||198===t.charCodeAt(n+1)||199===t.charCodeAt(n+1))return A=256*t.charCodeAt(n+5)+t.charCodeAt(n+6),[256*t.charCodeAt(n+7)+t.charCodeAt(n+8),A,t.charCodeAt(n+9)];n+=2,e=256*t.charCodeAt(n)+t.charCodeAt(n+1)}}(t)),this.isArrayBuffer(t)&&(t=new Uint8Array(t)),this.isArrayBufferView(t)&&(s=function(t){if(65496!=(t[0]<<8|t[1]))throw new Error("Supplied data is not a JPEG");for(var A,e=t.length,r=(t[4]<<8)+t[5],n=4;n<e;){if(r=((A=h(t,n+=r))[2]<<8)+A[3],(192===A[1]||194===A[1])&&255===A[0]&&7<r)return{width:((A=h(t,n+5))[2]<<8)+A[3],height:(A[0]<<8)+A[1],numcomponents:A[4]};n+=2}throw new Error("getJpegSizeFromBytes could not find the size of the image")}(t),t=i||this.arrayBufferToBinaryString(t)),void 0===o)switch(s.numcomponents){case 1:o=this.color_spaces.DEVICE_GRAY;break;case 4:o=this.color_spaces.DEVICE_CMYK;break;default:case 3:o=this.color_spaces.DEVICE_RGB}return this.createImageInfo(t,s.width,s.height,o,8,a,A,e)},t.processJPG=function(){return this.processJPEG.apply(this,arguments)},t.getImageProperties=function(A){var e,r,n="";if(c(A)&&(A=u(A)),this.isString(A)&&(""!==(n=this.convertStringToImageData(A))||void 0!==(n=t.loadFile(A)))&&(A=n),r=this.getImageFileTypeByImageData(A),!a(r))throw new Error("addImage does not support files of type '"+r+"', please ensure that a plugin for '"+r+"' support is added.");if(this.supportsArrayBuffer()&&(A instanceof Uint8Array||(A=this.binaryStringToUint8Array(A))),!(e=this["process"+r.toUpperCase()](A)))throw new Error("An unknown error occurred whilst processing the image");return{fileType:r,width:e.w,height:e.h,colorSpace:e.cs,compressionMode:e.f,bitsPerComponent:e.bpc}}}(dt.API),
/**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
o=dt.API,dt.API.events.push(["addPage",function(t){this.internal.getPageInfo(t.pageNumber).pageContext.annotations=[]}]),o.events.push(["putPage",function(t){for(var A=this.internal.getPageInfoByObjId(t.objId),e=t.pageContext.annotations,r=function(t){if(void 0!==t&&""!=t)return!0},n=!1,i=0;i<e.length&&!n;i++)switch((a=e[i]).type){case"link":if(r(a.options.url)||r(a.options.pageNumber)){n=!0;break}case"reference":case"text":case"freetext":n=!0}if(0!=n){this.internal.write("/Annots ["),this.internal.pageSize.height;var o=this.internal.getCoordinateString,s=this.internal.getVerticalCoordinateString;for(i=0;i<e.length;i++){var a;switch((a=e[i]).type){case"reference":this.internal.write(" "+a.object.objId+" 0 R ");break;case"text":var c=this.internal.newAdditionalObject(),u=this.internal.newAdditionalObject(),l=a.title||"Note";B="<</Type /Annot /Subtype /Text "+(f="/Rect ["+o(a.bounds.x)+" "+s(a.bounds.y+a.bounds.h)+" "+o(a.bounds.x+a.bounds.w)+" "+s(a.bounds.y)+"] ")+"/Contents ("+a.contents+")",B+=" /Popup "+u.objId+" 0 R",B+=" /P "+A.objId+" 0 R",B+=" /T ("+l+") >>",c.content=B;var h=c.objId+" 0 R";B="<</Type /Annot /Subtype /Popup "+(f="/Rect ["+o(a.bounds.x+30)+" "+s(a.bounds.y+a.bounds.h)+" "+o(a.bounds.x+a.bounds.w+30)+" "+s(a.bounds.y)+"] ")+" /Parent "+h,a.open&&(B+=" /Open true"),B+=" >>",u.content=B,this.internal.write(c.objId,"0 R",u.objId,"0 R");break;case"freetext":var f="/Rect ["+o(a.bounds.x)+" "+s(a.bounds.y)+" "+o(a.bounds.x+a.bounds.w)+" "+s(a.bounds.y+a.bounds.h)+"] ",d=a.color||"#000000";B="<</Type /Annot /Subtype /FreeText "+f+"/Contents ("+a.contents+")",B+=" /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#"+d+")",B+=" /Border [0 0 0]",B+=" >>",this.internal.write(B);break;case"link":if(a.options.name){var p=this.annotations._nameMap[a.options.name];a.options.pageNumber=p.page,a.options.top=p.y}else a.options.top||(a.options.top=0);f="/Rect ["+o(a.x)+" "+s(a.y)+" "+o(a.x+a.w)+" "+s(a.y+a.h)+"] ";var B="";if(a.options.url)B="<</Type /Annot /Subtype /Link "+f+"/Border [0 0 0] /A <</S /URI /URI ("+a.options.url+") >>";else if(a.options.pageNumber)switch(B="<</Type /Annot /Subtype /Link "+f+"/Border [0 0 0] /Dest ["+this.internal.getPageInfo(a.options.pageNumber).objId+" 0 R",a.options.magFactor=a.options.magFactor||"XYZ",a.options.magFactor){case"Fit":B+=" /Fit]";break;case"FitH":B+=" /FitH "+a.options.top+"]";break;case"FitV":a.options.left=a.options.left||0,B+=" /FitV "+a.options.left+"]";break;case"XYZ":default:var g=s(a.options.top);a.options.left=a.options.left||0,void 0===a.options.zoom&&(a.options.zoom=0),B+=" /XYZ "+a.options.left+" "+g+" "+a.options.zoom+"]"}""!=B&&(B+=" >>",this.internal.write(B))}}this.internal.write("]")}}]),o.createAnnotation=function(t){var A=this.internal.getCurrentPageInfo();switch(t.type){case"link":this.link(t.bounds.x,t.bounds.y,t.bounds.w,t.bounds.h,t);break;case"text":case"freetext":A.pageContext.annotations.push(t)}},o.link=function(t,A,e,r,n){this.internal.getCurrentPageInfo().pageContext.annotations.push({x:t,y:A,w:e,h:r,options:n,type:"link"})},o.textWithLink=function(t,A,e,r){var n=this.getTextWidth(t),i=this.internal.getLineHeight()/this.internal.scaleFactor;return this.text(t,A,e),e+=.2*i,this.link(A,e-i,n,i,r),n},o.getTextWidth=function(t){var A=this.internal.getFontSize();return this.getStringUnitWidth(t)*A/this.internal.scaleFactor},
/**
   * @license
   * Copyright (c) 2017 Aras Abbasi 
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){var A={1569:[65152],1570:[65153,65154],1571:[65155,65156],1572:[65157,65158],1573:[65159,65160],1574:[65161,65162,65163,65164],1575:[65165,65166],1576:[65167,65168,65169,65170],1577:[65171,65172],1578:[65173,65174,65175,65176],1579:[65177,65178,65179,65180],1580:[65181,65182,65183,65184],1581:[65185,65186,65187,65188],1582:[65189,65190,65191,65192],1583:[65193,65194],1584:[65195,65196],1585:[65197,65198],1586:[65199,65200],1587:[65201,65202,65203,65204],1588:[65205,65206,65207,65208],1589:[65209,65210,65211,65212],1590:[65213,65214,65215,65216],1591:[65217,65218,65219,65220],1592:[65221,65222,65223,65224],1593:[65225,65226,65227,65228],1594:[65229,65230,65231,65232],1601:[65233,65234,65235,65236],1602:[65237,65238,65239,65240],1603:[65241,65242,65243,65244],1604:[65245,65246,65247,65248],1605:[65249,65250,65251,65252],1606:[65253,65254,65255,65256],1607:[65257,65258,65259,65260],1608:[65261,65262],1609:[65263,65264,64488,64489],1610:[65265,65266,65267,65268],1649:[64336,64337],1655:[64477],1657:[64358,64359,64360,64361],1658:[64350,64351,64352,64353],1659:[64338,64339,64340,64341],1662:[64342,64343,64344,64345],1663:[64354,64355,64356,64357],1664:[64346,64347,64348,64349],1667:[64374,64375,64376,64377],1668:[64370,64371,64372,64373],1670:[64378,64379,64380,64381],1671:[64382,64383,64384,64385],1672:[64392,64393],1676:[64388,64389],1677:[64386,64387],1678:[64390,64391],1681:[64396,64397],1688:[64394,64395],1700:[64362,64363,64364,64365],1702:[64366,64367,64368,64369],1705:[64398,64399,64400,64401],1709:[64467,64468,64469,64470],1711:[64402,64403,64404,64405],1713:[64410,64411,64412,64413],1715:[64406,64407,64408,64409],1722:[64414,64415],1723:[64416,64417,64418,64419],1726:[64426,64427,64428,64429],1728:[64420,64421],1729:[64422,64423,64424,64425],1733:[64480,64481],1734:[64473,64474],1735:[64471,64472],1736:[64475,64476],1737:[64482,64483],1739:[64478,64479],1740:[64508,64509,64510,64511],1744:[64484,64485,64486,64487],1746:[64430,64431],1747:[64432,64433]},e={65247:{65154:65269,65156:65271,65160:65273,65166:65275},65248:{65154:65270,65156:65272,65160:65274,65166:65276},65165:{65247:{65248:{65258:65010}}},1617:{1612:64606,1613:64607,1614:64608,1615:64609,1616:64610}},r={1612:64606,1613:64607,1614:64608,1615:64609,1616:64610},n=[1570,1571,1573,1575];t.__arabicParser__={};var i=t.__arabicParser__.isInArabicSubstitutionA=function(t){return void 0!==A[t.charCodeAt(0)]},o=t.__arabicParser__.isArabicLetter=function(t){return"string"==typeof t&&/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(t)},s=t.__arabicParser__.isArabicEndLetter=function(t){return o(t)&&i(t)&&A[t.charCodeAt(0)].length<=2},a=t.__arabicParser__.isArabicAlfLetter=function(t){return o(t)&&0<=n.indexOf(t.charCodeAt(0))},c=(t.__arabicParser__.arabicLetterHasIsolatedForm=function(t){return o(t)&&i(t)&&1<=A[t.charCodeAt(0)].length},t.__arabicParser__.arabicLetterHasFinalForm=function(t){return o(t)&&i(t)&&2<=A[t.charCodeAt(0)].length}),u=(t.__arabicParser__.arabicLetterHasInitialForm=function(t){return o(t)&&i(t)&&3<=A[t.charCodeAt(0)].length},t.__arabicParser__.arabicLetterHasMedialForm=function(t){return o(t)&&i(t)&&4==A[t.charCodeAt(0)].length}),l=t.__arabicParser__.resolveLigatures=function(t){var A=0,r=e,n=0,i="",o=0;for(A=0;A<t.length;A+=1)void 0!==r[t.charCodeAt(A)]?(o++,"number"==typeof(r=r[t.charCodeAt(A)])&&(n=-1!==(n=h(t.charAt(A),t.charAt(A-o),t.charAt(A+1)))?n:0,i+=String.fromCharCode(r),r=e,o=0),A===t.length-1&&(r=e,i+=t.charAt(A-(o-1)),A-=o-1,o=0)):(r=e,i+=t.charAt(A-o),A-=o,o=0);return i},h=(t.__arabicParser__.isArabicDiacritic=function(t){return void 0!==t&&void 0!==r[t.charCodeAt(0)]},t.__arabicParser__.getCorrectForm=function(t,A,e){return o(t)?!1===i(t)?-1:!c(t)||!o(A)&&!o(e)||!o(e)&&s(A)||s(t)&&!o(A)||s(t)&&a(A)||s(t)&&s(A)?0:u(t)&&o(A)&&!s(A)&&o(e)&&c(e)?3:s(t)||!o(e)?1:2:-1}),f=t.__arabicParser__.processArabic=t.processArabic=function(t){var e=0,r=0,n=0,i="",s="",a="",c=(t=t||"").split("\\s+"),u=[];for(e=0;e<c.length;e+=1){for(u.push(""),r=0;r<c[e].length;r+=1)i=c[e][r],s=c[e][r-1],a=c[e][r+1],o(i)?(n=h(i,s,a),u[e]+=-1!==n?String.fromCharCode(A[i.charCodeAt(0)][n]):i):u[e]+=i;u[e]=l(u[e])}return u.join(" ")};t.events.push(["preProcessText",function(t){var A=t.text,e=(t.x,t.y,t.options||{}),r=(t.mutex,e.lang,[]);if("[object Array]"===Object.prototype.toString.call(A)){var n=0;for(r=[],n=0;n<A.length;n+=1)"[object Array]"===Object.prototype.toString.call(A[n])?r.push([f(A[n][0]),A[n][1],A[n][2]]):r.push([f(A[n])]);t.text=r}else t.text=f(A)}])}(dt.API),dt.API.autoPrint=function(t){var A;switch((t=t||{}).variant=t.variant||"non-conform",t.variant){case"javascript":this.addJS("print({});");break;case"non-conform":default:this.internal.events.subscribe("postPutResources",(function(){A=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/S /Named"),this.internal.out("/Type /Action"),this.internal.out("/N /Print"),this.internal.out(">>"),this.internal.out("endobj")})),this.internal.events.subscribe("putCatalog",(function(){this.internal.out("/OpenAction "+A+" 0 R")}))}return this},
/**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
s=dt.API,(a=function(){var t=void 0;Object.defineProperty(this,"pdf",{get:function(){return t},set:function(A){t=A}});var A=150;Object.defineProperty(this,"width",{get:function(){return A},set:function(t){A=isNaN(t)||!1===Number.isInteger(t)||t<0?150:t,this.getContext("2d").pageWrapXEnabled&&(this.getContext("2d").pageWrapX=A+1)}});var e=300;Object.defineProperty(this,"height",{get:function(){return e},set:function(t){e=isNaN(t)||!1===Number.isInteger(t)||t<0?300:t,this.getContext("2d").pageWrapYEnabled&&(this.getContext("2d").pageWrapY=e+1)}});var r=[];Object.defineProperty(this,"childNodes",{get:function(){return r},set:function(t){r=t}});var n={};Object.defineProperty(this,"style",{get:function(){return n},set:function(t){n=t}}),Object.defineProperty(this,"parentNode",{get:function(){return!1}})}).prototype.getContext=function(t,A){var e;if("2d"!==(t=t||"2d"))return null;for(e in A)this.pdf.context2d.hasOwnProperty(e)&&(this.pdf.context2d[e]=A[e]);return(this.pdf.context2d._canvas=this).pdf.context2d},a.prototype.toDataURL=function(){throw new Error("toDataURL is not implemented.")},s.events.push(["initialized",function(){this.canvas=new a,this.canvas.pdf=this}]),
/** 
   * @license
   * ====================================================================
   * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
   *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
   *               2013 Lee Driscoll, https://github.com/lsdriscoll
   *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
   *               2014 James Hall, james@parall.ax
   *               2014 Diego Casorran, https://github.com/diegocr
   *
   * 
   * ====================================================================
   */
c=dt.API,l={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0},h=1,f=function(t,A,e,r,n){l={x:t,y:A,w:e,h:r,ln:n}},d=function(){return l},p={left:0,top:0,bottom:0},c.setHeaderFunction=function(t){u=t},c.getTextDimensions=function(t,A){var e=this.table_font_size||this.internal.getFontSize(),r=(this.internal.getFont().fontStyle,(A=A||{}).scaleFactor||this.internal.scaleFactor),n=0,i=0,o=0;if("string"==typeof t)0!=(n=this.getStringUnitWidth(t)*e)&&(i=1);else{if("[object Array]"!==Object.prototype.toString.call(t))throw new Error("getTextDimensions expects text-parameter to be of type String or an Array of Strings.");for(var s=0;s<t.length;s++)n<(o=this.getStringUnitWidth(t[s])*e)&&(n=o);0!==n&&(i=t.length)}return{w:n/=r,h:Math.max((i*e*this.getLineHeightFactor()-e*(this.getLineHeightFactor()-1))/r,0)}},c.cellAddPage=function(){var t=this.margins||p;this.addPage(),f(t.left,t.top,void 0,void 0),h+=1},c.cellInitialize=function(){l={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0},h=1},c.cell=function(t,A,e,r,n,i,o){var s=d(),a=!1;if(void 0!==s.ln)if(s.ln===i)t=s.x+s.w,A=s.y;else{var c=this.margins||p;s.y+s.h+r+13>=this.internal.pageSize.getHeight()-c.bottom&&(this.cellAddPage(),a=!0,this.printHeaders&&this.tableHeaderRow&&this.printHeaderRow(i,!0)),A=d().y+d().h,a&&(A=23)}if(void 0!==n[0])if(this.printingHeaderRow?this.rect(t,A,e,r,"FD"):this.rect(t,A,e,r),"right"===o){n instanceof Array||(n=[n]);for(var u=0;u<n.length;u++){var l=n[u],h=this.getStringUnitWidth(l)*this.internal.getFontSize()/this.internal.scaleFactor;this.text(l,t+e-h-3,A+this.internal.getLineHeight()*(u+1))}}else this.text(n,t+3,A+this.internal.getLineHeight());return f(t,A,e,r,i),this},c.arrayMax=function(t,A){var e,r,n,i=t[0];for(e=0,r=t.length;e<r;e+=1)n=t[e],A?-1===A(i,n)&&(i=n):i<n&&(i=n);return i},c.table=function(t,A,e,r,n){if(!e)throw"No data for PDF table";var i,o,s,a,u,f,d,B,g,w,m=[],Q=[],C={},y={},v=[],F=[],U=!1,N=!0,E=12,b=p;if(b.width=this.internal.pageSize.getWidth(),n&&(!0===n.autoSize&&(U=!0),!1===n.printHeaders&&(N=!1),n.fontSize&&(E=n.fontSize),n.css&&void 0!==n.css["font-size"]&&(E=16*n.css["font-size"]),n.margins&&(b=n.margins)),this.lnMod=0,l={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0},h=1,this.printHeaders=N,this.margins=b,this.setFontSize(E),this.table_font_size=E,null==r)m=Object.keys(e[0]);else if(r[0]&&"string"!=typeof r[0])for(o=0,s=r.length;o<s;o+=1)i=r[o],m.push(i.name),Q.push(i.prompt),y[i.name]=i.width*(19.049976/25.4);else m=r;if(U)for(w=function(t){return t[i]},o=0,s=m.length;o<s;o+=1){for(C[i=m[o]]=e.map(w),v.push(this.getTextDimensions(Q[o]||i,{scaleFactor:1}).w),d=0,a=(f=C[i]).length;d<a;d+=1)u=f[d],v.push(this.getTextDimensions(u,{scaleFactor:1}).w);y[i]=c.arrayMax(v),v=[]}if(N){var L=this.calculateLineHeight(m,y,Q.length?Q:m);for(o=0,s=m.length;o<s;o+=1)i=m[o],F.push([t,A,y[i],L,String(Q.length?Q[o]:i)]);this.setTableHeaderRow(F),this.printHeaderRow(1,!1)}for(o=0,s=e.length;o<s;o+=1)for(B=e[o],L=this.calculateLineHeight(m,y,B),d=0,g=m.length;d<g;d+=1)i=m[d],this.cell(t,A,y[i],L,B[i],o+2,i.align);return this.lastCellPos=l,this.table_x=t,this.table_y=A,this},c.calculateLineHeight=function(t,A,e){for(var r,n=0,i=0;i<t.length;i++){e[r=t[i]]=this.splitTextToSize(String(e[r]),A[r]-3);var o=this.internal.getLineHeight()*e[r].length+3;n<o&&(n=o)}return n},c.setTableHeaderRow=function(t){this.tableHeaderRow=t},c.printHeaderRow=function(t,A){if(!this.tableHeaderRow)throw"Property tableHeaderRow does not exist.";var e,r,n,i;if(this.printingHeaderRow=!0,void 0!==u){var o=u(this,h);f(o[0],o[1],o[2],o[3],-1)}this.setFontStyle("bold");var s=[];for(n=0,i=this.tableHeaderRow.length;n<i;n+=1)this.setFillColor(200,200,200),e=this.tableHeaderRow[n],A&&(this.margins.top=13,e[1]=this.margins&&this.margins.top||0,s.push(e)),r=[].concat(e),this.cell.apply(this,r.concat(t));0<s.length&&this.setTableHeaderRow(s),this.setFontStyle("normal"),this.printingHeaderRow=!1},function(t,A){var e,r,i,o,s,a=function(t){return t=t||{},this.isStrokeTransparent=t.isStrokeTransparent||!1,this.strokeOpacity=t.strokeOpacity||1,this.strokeStyle=t.strokeStyle||"#000000",this.fillStyle=t.fillStyle||"#000000",this.isFillTransparent=t.isFillTransparent||!1,this.fillOpacity=t.fillOpacity||1,this.font=t.font||"10px sans-serif",this.textBaseline=t.textBaseline||"alphabetic",this.textAlign=t.textAlign||"left",this.lineWidth=t.lineWidth||1,this.lineJoin=t.lineJoin||"miter",this.lineCap=t.lineCap||"butt",this.path=t.path||[],this.transform=void 0!==t.transform?t.transform.clone():new T,this.globalCompositeOperation=t.globalCompositeOperation||"normal",this.globalAlpha=t.globalAlpha||1,this.clip_path=t.clip_path||[],this.currentPoint=t.currentPoint||new I,this.miterLimit=t.miterLimit||10,this.lastPoint=t.lastPoint||new I,this.ignoreClearRect="boolean"!=typeof t.ignoreClearRect||t.ignoreClearRect,this};t.events.push(["initialized",function(){this.context2d=new c(this),e=this.internal.f2,this.internal.f3,r=this.internal.getCoordinateString,i=this.internal.getVerticalCoordinateString,o=this.internal.getHorizontalCoordinate,s=this.internal.getVerticalCoordinate}]);var c=function(t){Object.defineProperty(this,"canvas",{get:function(){return{parentNode:!1,style:!1}}}),Object.defineProperty(this,"pdf",{get:function(){return t}});var A=!1;Object.defineProperty(this,"pageWrapXEnabled",{get:function(){return A},set:function(t){A=Boolean(t)}});var e=!1;Object.defineProperty(this,"pageWrapYEnabled",{get:function(){return e},set:function(t){e=Boolean(t)}});var r=0;Object.defineProperty(this,"posX",{get:function(){return r},set:function(t){isNaN(t)||(r=t)}});var n=0;Object.defineProperty(this,"posY",{get:function(){return n},set:function(t){isNaN(t)||(n=t)}});var i=!1;Object.defineProperty(this,"autoPaging",{get:function(){return i},set:function(t){i=Boolean(t)}});var o=0;Object.defineProperty(this,"lastBreak",{get:function(){return o},set:function(t){o=t}});var s=[];Object.defineProperty(this,"pageBreaks",{get:function(){return s},set:function(t){s=t}});var c=new a;Object.defineProperty(this,"ctx",{get:function(){return c},set:function(t){t instanceof a&&(c=t)}}),Object.defineProperty(this,"path",{get:function(){return c.path},set:function(t){c.path=t}});var l=[];Object.defineProperty(this,"ctxStack",{get:function(){return l},set:function(t){l=t}}),Object.defineProperty(this,"fillStyle",{get:function(){return this.ctx.fillStyle},set:function(t){var A;A=u(t),this.ctx.fillStyle=A.style,this.ctx.isFillTransparent=0===A.a,this.ctx.fillOpacity=A.a,this.pdf.setFillColor(A.r,A.g,A.b,{a:A.a}),this.pdf.setTextColor(A.r,A.g,A.b,{a:A.a})}}),Object.defineProperty(this,"strokeStyle",{get:function(){return this.ctx.strokeStyle},set:function(t){var A=u(t);this.ctx.strokeStyle=A.style,this.ctx.isStrokeTransparent=0===A.a,this.ctx.strokeOpacity=A.a,0===A.a?this.pdf.setDrawColor(255,255,255):(A.a,this.pdf.setDrawColor(A.r,A.g,A.b))}}),Object.defineProperty(this,"lineCap",{get:function(){return this.ctx.lineCap},set:function(t){-1!==["butt","round","square"].indexOf(t)&&(this.ctx.lineCap=t,this.pdf.setLineCap(t))}}),Object.defineProperty(this,"lineWidth",{get:function(){return this.ctx.lineWidth},set:function(t){isNaN(t)||(this.ctx.lineWidth=t,this.pdf.setLineWidth(t))}}),Object.defineProperty(this,"lineJoin",{get:function(){return this.ctx.lineJoin},set:function(t){-1!==["bevel","round","miter"].indexOf(t)&&(this.ctx.lineJoin=t,this.pdf.setLineJoin(t))}}),Object.defineProperty(this,"miterLimit",{get:function(){return this.ctx.miterLimit},set:function(t){isNaN(t)||(this.ctx.miterLimit=t,this.pdf.setMiterLimit(t))}}),Object.defineProperty(this,"textBaseline",{get:function(){return this.ctx.textBaseline},set:function(t){this.ctx.textBaseline=t}}),Object.defineProperty(this,"textAlign",{get:function(){return this.ctx.textAlign},set:function(t){-1!==["right","end","center","left","start"].indexOf(t)&&(this.ctx.textAlign=t)}}),Object.defineProperty(this,"font",{get:function(){return this.ctx.font},set:function(t){var A;if(this.ctx.font=t,null!==(A=/^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i.exec(t))){var e=A[1],r=(A[2],A[3]),n=A[4],i=A[5],o=A[6];n="px"===i?Math.floor(parseFloat(n)):"em"===i?Math.floor(parseFloat(n)*this.pdf.getFontSize()):Math.floor(parseFloat(n)),this.pdf.setFontSize(n);var s="";("bold"===r||700<=parseInt(r,10)||"bold"===e)&&(s="bold"),"italic"===e&&(s+="italic"),0===s.length&&(s="normal");for(var a="",c=o.toLowerCase().replace(/"|'/g,"").split(/\s*,\s*/),u={arial:"Helvetica",verdana:"Helvetica",helvetica:"Helvetica","sans-serif":"Helvetica",fixed:"Courier",monospace:"Courier",terminal:"Courier",courier:"Courier",times:"Times",cursive:"Times",fantasy:"Times",serif:"Times"},l=0;l<c.length;l++){if(void 0!==this.pdf.internal.getFont(c[l],s,{noFallback:!0,disableWarning:!0})){a=c[l];break}if("bolditalic"===s&&void 0!==this.pdf.internal.getFont(c[l],"bold",{noFallback:!0,disableWarning:!0}))a=c[l],s="bold";else if(void 0!==this.pdf.internal.getFont(c[l],"normal",{noFallback:!0,disableWarning:!0})){a=c[l],s="normal";break}}if(""===a)for(l=0;l<c.length;l++)if(u[c[l]]){a=u[c[l]];break}a=""===a?"Times":a,this.pdf.setFont(a,s)}}}),Object.defineProperty(this,"globalCompositeOperation",{get:function(){return this.ctx.globalCompositeOperation},set:function(t){this.ctx.globalCompositeOperation=t}}),Object.defineProperty(this,"globalAlpha",{get:function(){return this.ctx.globalAlpha},set:function(t){this.ctx.globalAlpha=t}}),Object.defineProperty(this,"ignoreClearRect",{get:function(){return this.ctx.ignoreClearRect},set:function(t){this.ctx.ignoreClearRect=Boolean(t)}})};c.prototype.fill=function(){B.call(this,"fill",!1)},c.prototype.stroke=function(){B.call(this,"stroke",!1)},c.prototype.beginPath=function(){this.path=[{type:"begin"}]},c.prototype.moveTo=function(t,A){if(isNaN(t)||isNaN(A))throw console.error("jsPDF.context2d.moveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.moveTo");var e=this.ctx.transform.applyToPoint(new I(t,A));this.path.push({type:"mt",x:e.x,y:e.y}),this.ctx.lastPoint=new I(t,A)},c.prototype.closePath=function(){var t=new I(0,0),A=0;for(A=this.path.length-1;-1!==A;A--)if("begin"===this.path[A].type&&"object"===n(this.path[A+1])&&"number"==typeof this.path[A+1].x){t=new I(this.path[A+1].x,this.path[A+1].y),this.path.push({type:"lt",x:t.x,y:t.y});break}"object"===n(this.path[A+2])&&"number"==typeof this.path[A+2].x&&this.path.push(JSON.parse(JSON.stringify(this.path[A+2]))),this.path.push({type:"close"}),this.ctx.lastPoint=new I(t.x,t.y)},c.prototype.lineTo=function(t,A){if(isNaN(t)||isNaN(A))throw console.error("jsPDF.context2d.lineTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.lineTo");var e=this.ctx.transform.applyToPoint(new I(t,A));this.path.push({type:"lt",x:e.x,y:e.y}),this.ctx.lastPoint=new I(e.x,e.y)},c.prototype.clip=function(){this.ctx.clip_path=JSON.parse(JSON.stringify(this.path)),B.call(this,null,!0)},c.prototype.quadraticCurveTo=function(t,A,e,r){if(isNaN(e)||isNaN(r)||isNaN(t)||isNaN(A))throw console.error("jsPDF.context2d.quadraticCurveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo");var n=this.ctx.transform.applyToPoint(new I(e,r)),i=this.ctx.transform.applyToPoint(new I(t,A));this.path.push({type:"qct",x1:i.x,y1:i.y,x:n.x,y:n.y}),this.ctx.lastPoint=new I(n.x,n.y)},c.prototype.bezierCurveTo=function(t,A,e,r,n,i){if(isNaN(n)||isNaN(i)||isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r))throw console.error("jsPDF.context2d.bezierCurveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo");var o=this.ctx.transform.applyToPoint(new I(n,i)),s=this.ctx.transform.applyToPoint(new I(t,A)),a=this.ctx.transform.applyToPoint(new I(e,r));this.path.push({type:"bct",x1:s.x,y1:s.y,x2:a.x,y2:a.y,x:o.x,y:o.y}),this.ctx.lastPoint=new I(o.x,o.y)},c.prototype.arc=function(t,A,e,r,n,i){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r)||isNaN(n))throw console.error("jsPDF.context2d.arc: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.arc");if(i=Boolean(i),!this.ctx.transform.isIdentity){var o=this.ctx.transform.applyToPoint(new I(t,A));t=o.x,A=o.y;var s=this.ctx.transform.applyToPoint(new I(0,e)),a=this.ctx.transform.applyToPoint(new I(0,0));e=Math.sqrt(Math.pow(s.x-a.x,2)+Math.pow(s.y-a.y,2))}Math.abs(n-r)>=2*Math.PI&&(r=0,n=2*Math.PI),this.path.push({type:"arc",x:t,y:A,radius:e,startAngle:r,endAngle:n,counterclockwise:i})},c.prototype.arcTo=function(t,A,e,r,n){throw new Error("arcTo not implemented.")},c.prototype.rect=function(t,A,e,r){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r))throw console.error("jsPDF.context2d.rect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.rect");this.moveTo(t,A),this.lineTo(t+e,A),this.lineTo(t+e,A+r),this.lineTo(t,A+r),this.lineTo(t,A),this.lineTo(t+e,A),this.lineTo(t,A)},c.prototype.fillRect=function(t,A,e,r){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r))throw console.error("jsPDF.context2d.fillRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.fillRect");if(!l.call(this)){var n={};"butt"!==this.lineCap&&(n.lineCap=this.lineCap,this.lineCap="butt"),"miter"!==this.lineJoin&&(n.lineJoin=this.lineJoin,this.lineJoin="miter"),this.beginPath(),this.rect(t,A,e,r),this.fill(),n.hasOwnProperty("lineCap")&&(this.lineCap=n.lineCap),n.hasOwnProperty("lineJoin")&&(this.lineJoin=n.lineJoin)}},c.prototype.strokeRect=function(t,A,e,r){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r))throw console.error("jsPDF.context2d.strokeRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");h.call(this)||(this.beginPath(),this.rect(t,A,e,r),this.stroke())},c.prototype.clearRect=function(t,A,e,r){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r))throw console.error("jsPDF.context2d.clearRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.clearRect");this.ignoreClearRect||(this.fillStyle="#ffffff",this.fillRect(t,A,e,r))},c.prototype.save=function(t){t="boolean"!=typeof t||t;for(var A=this.pdf.internal.getCurrentPageInfo().pageNumber,e=0;e<this.pdf.internal.getNumberOfPages();e++)this.pdf.setPage(e+1),this.pdf.internal.out("q");if(this.pdf.setPage(A),t){this.ctx.fontSize=this.pdf.internal.getFontSize();var r=new a(this.ctx);this.ctxStack.push(this.ctx),this.ctx=r}},c.prototype.restore=function(t){t="boolean"!=typeof t||t;for(var A=this.pdf.internal.getCurrentPageInfo().pageNumber,e=0;e<this.pdf.internal.getNumberOfPages();e++)this.pdf.setPage(e+1),this.pdf.internal.out("Q");this.pdf.setPage(A),t&&0!==this.ctxStack.length&&(this.ctx=this.ctxStack.pop(),this.fillStyle=this.ctx.fillStyle,this.strokeStyle=this.ctx.strokeStyle,this.font=this.ctx.font,this.lineCap=this.ctx.lineCap,this.lineWidth=this.ctx.lineWidth,this.lineJoin=this.ctx.lineJoin)},c.prototype.toDataURL=function(){throw new Error("toDataUrl not implemented.")};var u=function(t){var A,e,r,n;if(!0===t.isCanvasGradient&&(t=t.getColor()),!t)return{r:0,g:0,b:0,a:0,style:t};if(/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/.test(t))n=r=e=A=0;else{var i=/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(t);if(null!==i)A=parseInt(i[1]),e=parseInt(i[2]),r=parseInt(i[3]),n=1;else if(null!==(i=/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/.exec(t)))A=parseInt(i[1]),e=parseInt(i[2]),r=parseInt(i[3]),n=parseFloat(i[4]);else{if(n=1,"string"==typeof t&&"#"!==t.charAt(0)){var o=new RGBColor(t);t=o.ok?o.toHex():"#000000"}4===t.length?(A=t.substring(1,2),A+=A,e=t.substring(2,3),e+=e,r=t.substring(3,4),r+=r):(A=t.substring(1,3),e=t.substring(3,5),r=t.substring(5,7)),A=parseInt(A,16),e=parseInt(e,16),r=parseInt(r,16)}}return{r:A,g:e,b:r,a:n,style:t}},l=function(){return this.ctx.isFillTransparent||0==this.globalAlpha},h=function(){return Boolean(this.ctx.isStrokeTransparent||0==this.globalAlpha)};c.prototype.fillText=function(t,A,e,r){if(isNaN(A)||isNaN(e)||"string"!=typeof t)throw console.error("jsPDF.context2d.fillText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.fillText");if(r=isNaN(r)?void 0:r,!l.call(this)){e=w.call(this,e);var n=L(this.ctx.transform.rotation),i=this.ctx.transform.scaleX;v.call(this,{text:t,x:A,y:e,scale:i,angle:n,align:this.textAlign,maxWidth:r})}},c.prototype.strokeText=function(t,A,e,r){if(isNaN(A)||isNaN(e)||"string"!=typeof t)throw console.error("jsPDF.context2d.strokeText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.strokeText");if(!h.call(this)){r=isNaN(r)?void 0:r,e=w.call(this,e);var n=L(this.ctx.transform.rotation),i=this.ctx.transform.scaleX;v.call(this,{text:t,x:A,y:e,scale:i,renderingMode:"stroke",angle:n,align:this.textAlign,maxWidth:r})}},c.prototype.measureText=function(t){if("string"!=typeof t)throw console.error("jsPDF.context2d.measureText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.measureText");var A=this.pdf,e=this.pdf.internal.scaleFactor,r=A.internal.getFontSize(),n=A.getStringUnitWidth(t)*r/A.internal.scaleFactor;return new function(t){var A=(t=t||{}).width||0;return Object.defineProperty(this,"width",{get:function(){return A}}),this}({width:n*=Math.round(96*e/72*1e4)/1e4})},c.prototype.scale=function(t,A){if(isNaN(t)||isNaN(A))throw console.error("jsPDF.context2d.scale: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.scale");var e=new T(t,0,0,A,0,0);this.ctx.transform=this.ctx.transform.multiply(e)},c.prototype.rotate=function(t){if(isNaN(t))throw console.error("jsPDF.context2d.rotate: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.rotate");var A=new T(Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0);this.ctx.transform=this.ctx.transform.multiply(A)},c.prototype.translate=function(t,A){if(isNaN(t)||isNaN(A))throw console.error("jsPDF.context2d.translate: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.translate");var e=new T(1,0,0,1,t,A);this.ctx.transform=this.ctx.transform.multiply(e)},c.prototype.transform=function(t,A,e,r,n,i){if(isNaN(t)||isNaN(A)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i))throw console.error("jsPDF.context2d.transform: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.transform");var o=new T(t,A,e,r,n,i);this.ctx.transform=this.ctx.transform.multiply(o)},c.prototype.setTransform=function(t,A,e,r,n,i){t=isNaN(t)?1:t,A=isNaN(A)?0:A,e=isNaN(e)?0:e,r=isNaN(r)?1:r,n=isNaN(n)?0:n,i=isNaN(i)?0:i,this.ctx.transform=new T(t,A,e,r,n,i)},c.prototype.drawImage=function(t,A,e,r,n,i,o,s,a){var c=this.pdf.getImageProperties(t),u=1,l=1,h=1,d=1;void 0!==r&&void 0!==s&&(h=s/r,d=a/n,u=c.width/r*s/r,l=c.height/n*a/n),void 0===i&&(i=A,o=e,e=A=0),void 0!==r&&void 0===s&&(s=r,a=n),void 0===r&&void 0===s&&(s=c.width,a=c.height);var B=this.ctx.transform.decompose(),w=L(B.rotate.shx);B.scale.sx,B.scale.sy;for(var m,Q=new T,C=((Q=(Q=(Q=Q.multiply(B.translate)).multiply(B.skew)).multiply(B.scale)).applyToPoint(new I(s,a)),Q.applyToRectangle(new _(i-A*h,o-e*d,r*u,n*l))),y=f.call(this,C),v=[],F=0;F<y.length;F+=1)-1===v.indexOf(y[F])&&v.push(y[F]);if(v.sort(),this.autoPaging)for(var U=v[0],N=v[v.length-1],E=U;E<N+1;E++){if(this.pdf.setPage(E),0!==this.ctx.clip_path.length){var b=this.path;m=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=p(m,this.posX,-1*this.pdf.internal.pageSize.height*(E-1)+this.posY),g.call(this,"fill",!0),this.path=b}var H=JSON.parse(JSON.stringify(C));H=p([H],this.posX,-1*this.pdf.internal.pageSize.height*(E-1)+this.posY)[0],this.pdf.addImage(t,"jpg",H.x,H.y,H.w,H.h,null,null,w)}else this.pdf.addImage(t,"jpg",C.x,C.y,C.w,C.h,null,null,w)};var f=function(t,A,e){var r=[];switch(A=A||this.pdf.internal.pageSize.width,e=e||this.pdf.internal.pageSize.height,t.type){default:case"mt":case"lt":r.push(Math.floor((t.y+this.posY)/e)+1);break;case"arc":r.push(Math.floor((t.y+this.posY-t.radius)/e)+1),r.push(Math.floor((t.y+this.posY+t.radius)/e)+1);break;case"qct":var n=x(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x,t.y);r.push(Math.floor(n.y/e)+1),r.push(Math.floor((n.y+n.h)/e)+1);break;case"bct":var i=S(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x2,t.y2,t.x,t.y);r.push(Math.floor(i.y/e)+1),r.push(Math.floor((i.y+i.h)/e)+1);break;case"rect":r.push(Math.floor((t.y+this.posY)/e)+1),r.push(Math.floor((t.y+t.h+this.posY)/e)+1)}for(var o=0;o<r.length;o+=1)for(;this.pdf.internal.getNumberOfPages()<r[o];)d.call(this);return r},d=function(){var t=this.fillStyle,A=this.strokeStyle,e=this.font,r=this.lineCap,n=this.lineWidth,i=this.lineJoin;this.pdf.addPage(),this.fillStyle=t,this.strokeStyle=A,this.font=e,this.lineCap=r,this.lineWidth=n,this.lineJoin=i},p=function(t,A,e){for(var r=0;r<t.length;r++)switch(t[r].type){case"bct":t[r].x2+=A,t[r].y2+=e;case"qct":t[r].x1+=A,t[r].y1+=e;case"mt":case"lt":case"arc":default:t[r].x+=A,t[r].y+=e}return t},B=function(t,A){for(var e,r,n=this.fillStyle,i=this.strokeStyle,o=(this.font,this.lineCap),s=this.lineWidth,a=this.lineJoin,c=JSON.parse(JSON.stringify(this.path)),u=JSON.parse(JSON.stringify(this.path)),l=[],h=0;h<u.length;h++)if(void 0!==u[h].x)for(var B=f.call(this,u[h]),w=0;w<B.length;w+=1)-1===l.indexOf(B[w])&&l.push(B[w]);for(h=0;h<l.length;h++)for(;this.pdf.internal.getNumberOfPages()<l[h];)d.call(this);if(l.sort(),this.autoPaging){var m=l[0],Q=l[l.length-1];for(h=m;h<Q+1;h++){if(this.pdf.setPage(h),this.fillStyle=n,this.strokeStyle=i,this.lineCap=o,this.lineWidth=s,this.lineJoin=a,0!==this.ctx.clip_path.length){var C=this.path;e=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=p(e,this.posX,-1*this.pdf.internal.pageSize.height*(h-1)+this.posY),g.call(this,t,!0),this.path=C}r=JSON.parse(JSON.stringify(c)),this.path=p(r,this.posX,-1*this.pdf.internal.pageSize.height*(h-1)+this.posY),!1!==A&&0!==h||g.call(this,t,A)}}else g.call(this,t,A);this.path=c},g=function(t,A){if(("stroke"!==t||A||!h.call(this))&&("stroke"===t||A||!l.call(this))){var e=[];this.ctx.globalAlpha,this.ctx.fillOpacity<1&&this.ctx.fillOpacity;for(var r,n=this.path,i=0;i<n.length;i++){var o=n[i];switch(o.type){case"begin":e.push({begin:!0});break;case"close":e.push({close:!0});break;case"mt":e.push({start:o,deltas:[],abs:[]});break;case"lt":var s=e.length;if(!isNaN(n[i-1].x)){var a=[o.x-n[i-1].x,o.y-n[i-1].y];if(0<s)for(;0<=s;s--)if(!0!==e[s-1].close&&!0!==e[s-1].begin){e[s-1].deltas.push(a),e[s-1].abs.push(o);break}}break;case"bct":a=[o.x1-n[i-1].x,o.y1-n[i-1].y,o.x2-n[i-1].x,o.y2-n[i-1].y,o.x-n[i-1].x,o.y-n[i-1].y],e[e.length-1].deltas.push(a);break;case"qct":var c=n[i-1].x+2/3*(o.x1-n[i-1].x),u=n[i-1].y+2/3*(o.y1-n[i-1].y),f=o.x+2/3*(o.x1-o.x),d=o.y+2/3*(o.y1-o.y),p=o.x,B=o.y;a=[c-n[i-1].x,u-n[i-1].y,f-n[i-1].x,d-n[i-1].y,p-n[i-1].x,B-n[i-1].y],e[e.length-1].deltas.push(a);break;case"arc":e.push({deltas:[],abs:[],arc:!0}),Array.isArray(e[e.length-1].abs)&&e[e.length-1].abs.push(o)}}for(r=A?null:"stroke"===t?"stroke":"fill",i=0;i<e.length;i++){if(e[i].arc)for(var g=e[i].abs,w=0;w<g.length;w++){var y=g[w];if(void 0!==y.startAngle){var v=L(y.startAngle),N=L(y.endAngle),E=y.x,b=y.y;m.call(this,E,b,y.radius,v,N,y.counterclockwise,r,A)}else F.call(this,y.x,y.y)}e[i].arc||!0===e[i].close||!0===e[i].begin||(E=e[i].start.x,b=e[i].start.y,U.call(this,e[i].deltas,E,b,null,null))}r&&Q.call(this,r),A&&C.call(this)}},w=function(t){var A=this.pdf.internal.getFontSize()/this.pdf.internal.scaleFactor,e=A*(this.pdf.internal.getLineHeightFactor()-1);switch(this.ctx.textBaseline){case"bottom":return t-e;case"top":return t+A-e;case"hanging":return t+A-2*e;case"middle":return t+A/2-e;case"ideographic":return t;case"alphabetic":default:return t}};c.prototype.createLinearGradient=function(){var t=function(){};return t.colorStops=[],t.addColorStop=function(t,A){this.colorStops.push([t,A])},t.getColor=function(){return 0===this.colorStops.length?"#000000":this.colorStops[0][1]},t.isCanvasGradient=!0,t},c.prototype.createPattern=function(){return this.createLinearGradient()},c.prototype.createRadialGradient=function(){return this.createLinearGradient()};var m=function(t,A,e,r,n,i,o,s){this.pdf.internal.scaleFactor;for(var a=H(r),c=H(n),u=E.call(this,e,a,c,i),l=0;l<u.length;l++){var h=u[l];0===l&&y.call(this,h.x1+t,h.y1+A),N.call(this,t,A,h.x2,h.y2,h.x3,h.y3,h.x4,h.y4)}s?C.call(this):Q.call(this,o)},Q=function(t){switch(t){case"stroke":this.pdf.internal.out("S");break;case"fill":this.pdf.internal.out("f")}},C=function(){this.pdf.clip()},y=function(t,A){this.pdf.internal.out(r(t)+" "+i(A)+" m")},v=function(t){var A;switch(t.align){case"right":case"end":A="right";break;case"center":A="center";break;case"left":case"start":default:A="left"}var e=this.ctx.transform.applyToPoint(new I(t.x,t.y)),r=this.ctx.transform.decompose(),n=new T;n=(n=(n=n.multiply(r.translate)).multiply(r.skew)).multiply(r.scale);for(var i,o=this.pdf.getTextDimensions(t.text),s=this.ctx.transform.applyToRectangle(new _(t.x,t.y,o.w,o.h)),a=n.applyToRectangle(new _(t.x,t.y-o.h,o.w,o.h)),c=f.call(this,a),u=[],l=0;l<c.length;l+=1)-1===u.indexOf(c[l])&&u.push(c[l]);if(u.sort(),!0===this.autoPaging)for(var h=u[0],d=u[u.length-1],B=h;B<d+1;B++){if(this.pdf.setPage(B),0!==this.ctx.clip_path.length){var w=this.path;i=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=p(i,this.posX,-1*this.pdf.internal.pageSize.height*(B-1)+this.posY),g.call(this,"fill",!0),this.path=w}var m=JSON.parse(JSON.stringify(s));if(m=p([m],this.posX,-1*this.pdf.internal.pageSize.height*(B-1)+this.posY)[0],.01<=t.scale){var Q=this.pdf.internal.getFontSize();this.pdf.setFontSize(Q*t.scale)}this.pdf.text(t.text,m.x,m.y,{angle:t.angle,align:A,renderingMode:t.renderingMode,maxWidth:t.maxWidth}),.01<=t.scale&&this.pdf.setFontSize(Q)}else.01<=t.scale&&(Q=this.pdf.internal.getFontSize(),this.pdf.setFontSize(Q*t.scale)),this.pdf.text(t.text,e.x+this.posX,e.y+this.posY,{angle:t.angle,align:A,renderingMode:t.renderingMode,maxWidth:t.maxWidth}),.01<=t.scale&&this.pdf.setFontSize(Q)},F=function(t,A,e,n){e=e||0,n=n||0,this.pdf.internal.out(r(t+e)+" "+i(A+n)+" l")},U=function(t,A,e){return this.pdf.lines(t,A,e,null,null)},N=function(t,A,r,n,i,a,c,u){this.pdf.internal.out([e(o(r+t)),e(s(n+A)),e(o(i+t)),e(s(a+A)),e(o(c+t)),e(s(u+A)),"c"].join(" "))},E=function(t,A,e,r){var n=2*Math.PI,i=A;(i<n||n<i)&&(i%=n);var o=e;(o<n||n<o)&&(o%=n);for(var s=[],a=Math.PI/2,c=r?-1:1,u=A,l=Math.min(n,Math.abs(o-i));1e-5<l;){var h=u+c*Math.min(l,a);s.push(b.call(this,t,u,h)),l-=Math.abs(h-u),u=h}return s},b=function(t,A,e){var r=(e-A)/2,n=t*Math.cos(r),i=t*Math.sin(r),o=n,s=-i,a=o*o+s*s,c=a+o*n+s*i,u=4/3*(Math.sqrt(2*a*c)-c)/(o*i-s*n),l=o-u*s,h=s+u*o,f=l,d=-h,p=r+A,B=Math.cos(p),g=Math.sin(p);return{x1:t*Math.cos(A),y1:t*Math.sin(A),x2:l*B-h*g,y2:l*g+h*B,x3:f*B-d*g,y3:f*g+d*B,x4:t*Math.cos(e),y4:t*Math.sin(e)}},L=function(t){return 180*t/Math.PI},H=function(t){return t*Math.PI/180},x=function(t,A,e,r,n,i){var o=t+.5*(e-t),s=A+.5*(r-A),a=n+.5*(e-n),c=i+.5*(r-i),u=Math.min(t,n,o,a),l=Math.max(t,n,o,a),h=Math.min(A,i,s,c),f=Math.max(A,i,s,c);return new _(u,h,l-u,f-h)},S=function(t,A,e,r,n,i,o,s){for(var a,c,u,l,h,f,d,p,B,g,w,m,Q,C=e-t,y=r-A,v=n-e,F=i-r,U=o-n,N=s-i,E=0;E<41;E++)p=(f=(c=t+(a=E/40)*C)+a*((l=e+a*v)-c))+a*(l+a*(n+a*U-l)-f),B=(d=(u=A+a*y)+a*((h=r+a*F)-u))+a*(h+a*(i+a*N-h)-d),Q=0==E?(m=g=p,w=B):(g=Math.min(g,p),w=Math.min(w,B),m=Math.max(m,p),Math.max(Q,B));return new _(Math.round(g),Math.round(w),Math.round(m-g),Math.round(Q-w))},I=function(t,A){var e=t||0;Object.defineProperty(this,"x",{enumerable:!0,get:function(){return e},set:function(t){isNaN(t)||(e=parseFloat(t))}});var r=A||0;Object.defineProperty(this,"y",{enumerable:!0,get:function(){return r},set:function(t){isNaN(t)||(r=parseFloat(t))}});var n="pt";return Object.defineProperty(this,"type",{enumerable:!0,get:function(){return n},set:function(t){n=t.toString()}}),this},_=function(t,A,e,r){I.call(this,t,A),this.type="rect";var n=e||0;Object.defineProperty(this,"w",{enumerable:!0,get:function(){return n},set:function(t){isNaN(t)||(n=parseFloat(t))}});var i=r||0;return Object.defineProperty(this,"h",{enumerable:!0,get:function(){return i},set:function(t){isNaN(t)||(i=parseFloat(t))}}),this},T=function(t,A,e,r,n,i){var o=[];return Object.defineProperty(this,"sx",{get:function(){return o[0]},set:function(t){o[0]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"shy",{get:function(){return o[1]},set:function(t){o[1]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"shx",{get:function(){return o[2]},set:function(t){o[2]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"sy",{get:function(){return o[3]},set:function(t){o[3]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"tx",{get:function(){return o[4]},set:function(t){o[4]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"ty",{get:function(){return o[5]},set:function(t){o[5]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"rotation",{get:function(){return Math.atan2(this.shx,this.sx)}}),Object.defineProperty(this,"scaleX",{get:function(){return this.decompose().scale.sx}}),Object.defineProperty(this,"scaleY",{get:function(){return this.decompose().scale.sy}}),Object.defineProperty(this,"isIdentity",{get:function(){return 1===this.sx&&0===this.shy&&0===this.shx&&1===this.sy&&0===this.tx&&0===this.ty}}),this.sx=isNaN(t)?1:t,this.shy=isNaN(A)?0:A,this.shx=isNaN(e)?0:e,this.sy=isNaN(r)?1:r,this.tx=isNaN(n)?0:n,this.ty=isNaN(i)?0:i,this};T.prototype.multiply=function(t){var A=t.sx*this.sx+t.shy*this.shx,e=t.sx*this.shy+t.shy*this.sy,r=t.shx*this.sx+t.sy*this.shx,n=t.shx*this.shy+t.sy*this.sy,i=t.tx*this.sx+t.ty*this.shx+this.tx,o=t.tx*this.shy+t.ty*this.sy+this.ty;return new T(A,e,r,n,i,o)},T.prototype.decompose=function(){var t=this.sx,A=this.shy,e=this.shx,r=this.sy,n=this.tx,i=this.ty,o=Math.sqrt(t*t+A*A),s=(t/=o)*e+(A/=o)*r;e-=t*s,r-=A*s;var a=Math.sqrt(e*e+r*r);return s/=a,t*(r/=a)<A*(e/=a)&&(t=-t,A=-A,s=-s,o=-o),{scale:new T(o,0,0,a,0,0),translate:new T(1,0,0,1,n,i),rotate:new T(t,A,-A,t,0,0),skew:new T(1,0,s,1,0,0)}},T.prototype.applyToPoint=function(t){var A=t.x*this.sx+t.y*this.shx+this.tx,e=t.x*this.shy+t.y*this.sy+this.ty;return new I(A,e)},T.prototype.applyToRectangle=function(t){var A=this.applyToPoint(t),e=this.applyToPoint(new I(t.x+t.w,t.y+t.h));return new _(A.x,A.y,e.x-A.x,e.y-A.y)},T.prototype.clone=function(){var t=this.sx,A=this.shy,e=this.shx,r=this.sy,n=this.tx,i=this.ty;return new T(t,A,e,r,n,i)}}(dt.API,"undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0!==r&&r||Function('return typeof this === "object" && this.content')()||Function("return this")()),B=dt.API,g=function(t){var A,e,r,n,i,o,s,a,c,u;for(/[^\x00-\xFF]/.test(t),e=[],r=0,n=(t+=A="\0\0\0\0".slice(t.length%4||4)).length;r<n;r+=4)0!==(i=(t.charCodeAt(r)<<24)+(t.charCodeAt(r+1)<<16)+(t.charCodeAt(r+2)<<8)+t.charCodeAt(r+3))?(o=(i=((i=((i=((i=(i-(u=i%85))/85)-(c=i%85))/85)-(a=i%85))/85)-(s=i%85))/85)%85,e.push(o+33,s+33,a+33,c+33,u+33)):e.push(122);return function(t,e){for(var r=A.length;0<r;r--)t.pop()}(e),String.fromCharCode.apply(String,e)+"~>"},w=function(t){var A,e,r,n,i,o=String,s="length",a="charCodeAt",c="slice",u="replace";for(t[c](-2),t=t[c](0,-2)[u](/\s/g,"")[u]("z","!!!!!"),r=[],n=0,i=(t+=A="uuuuu"[c](t[s]%5||5))[s];n<i;n+=5)e=52200625*(t[a](n)-33)+614125*(t[a](n+1)-33)+7225*(t[a](n+2)-33)+85*(t[a](n+3)-33)+(t[a](n+4)-33),r.push(255&e>>24,255&e>>16,255&e>>8,255&e);return function(t,e){for(var r=A[s];0<r;r--)t.pop()}(r),o.fromCharCode.apply(o,r)},m=function(t){for(var A="",e=0;e<t.length;e+=1)A+=("0"+t.charCodeAt(e).toString(16)).slice(-2);return A+">"},Q=function(t){var A=new RegExp(/^([0-9A-Fa-f]{2})+$/);if(-1!==(t=t.replace(/\s/g,"")).indexOf(">")&&(t=t.substr(0,t.indexOf(">"))),t.length%2&&(t+="0"),!1===A.test(t))return"";for(var e="",r=0;r<t.length;r+=2)e+=String.fromCharCode("0x"+(t[r]+t[r+1]));return e},C=function(t,A){A=Object.assign({predictor:1,colors:1,bitsPerComponent:8,columns:1},A);for(var e,r,n=[],i=t.length;i--;)n[i]=t.charCodeAt(i);return e=B.adler32cs.from(t),(r=new Deflater(6)).append(new Uint8Array(n)),t=r.flush(),(n=new Uint8Array(t.length+6)).set(new Uint8Array([120,156])),n.set(t,2),n.set(new Uint8Array([255&e,e>>8&255,e>>16&255,e>>24&255]),t.length+2),String.fromCharCode.apply(null,n)},B.processDataByFilters=function(t,A){var e=0,r=t||"",n=[];for("string"==typeof(A=A||[])&&(A=[A]),e=0;e<A.length;e+=1)switch(A[e]){case"ASCII85Decode":case"/ASCII85Decode":r=w(r),n.push("/ASCII85Encode");break;case"ASCII85Encode":case"/ASCII85Encode":r=g(r),n.push("/ASCII85Decode");break;case"ASCIIHexDecode":case"/ASCIIHexDecode":r=Q(r),n.push("/ASCIIHexEncode");break;case"ASCIIHexEncode":case"/ASCIIHexEncode":r=m(r),n.push("/ASCIIHexDecode");break;case"FlateEncode":case"/FlateEncode":r=C(r),n.push("/FlateDecode");break;default:throw'The filter: "'+A[e]+'" is not implemented'}return{data:r,reverseChain:n.reverse().join(" ")}},(y=dt.API).loadFile=function(t,A,e){var r;A=A||!0,e=e||function(){};try{r=function(t,A,e){var r=new XMLHttpRequest,n=[],i=0,o=function(t){var A=t.length,e=String.fromCharCode;for(i=0;i<A;i+=1)n.push(e(255&t.charCodeAt(i)));return n.join("")};if(r.open("GET",t,!A),r.overrideMimeType("text/plain; charset=x-user-defined"),!1===A&&(r.onload=function(){return o(this.responseText)}),r.send(null),200===r.status)return A?o(r.responseText):void 0;console.warn('Unable to load file "'+t+'"')}(t,A)}catch(t){r=void 0}return r},y.loadImageFile=y.loadFile,v=dt.API,F="undefined"!=typeof window&&window||void 0!==r&&r,U=function(t){var A=n(t);return"undefined"===A?"undefined":"string"===A||t instanceof String?"string":"number"===A||t instanceof Number?"number":"function"===A||t instanceof Function?"function":t&&t.constructor===Array?"array":t&&1===t.nodeType?"element":"object"===A?"object":"unknown"},N=function(t,A){var e=document.createElement(t);if(A.className&&(e.className=A.className),A.innerHTML){e.innerHTML=A.innerHTML;for(var r=e.getElementsByTagName("script"),n=r.length;0<n--;null)r[n].parentNode.removeChild(r[n])}for(var i in A.style)e.style[i]=A.style[i];return e},(((E=function t(A){var e=Object.assign(t.convert(Promise.resolve()),JSON.parse(JSON.stringify(t.template))),r=t.convert(Promise.resolve(),e);return(r=r.setProgress(1,t,1,[t])).set(A)}).prototype=Object.create(Promise.prototype)).constructor=E).convert=function(t,A){return t.__proto__=A||E.prototype,t},E.template={prop:{src:null,container:null,overlay:null,canvas:null,img:null,pdf:null,pageSize:null,callback:function(){}},progress:{val:0,state:null,n:0,stack:[]},opt:{filename:"file.pdf",margin:[0,0,0,0],enableLinks:!0,x:0,y:0,html2canvas:{},jsPDF:{}}},E.prototype.from=function(t,A){return this.then((function(){switch(A=A||function(t){switch(U(t)){case"string":return"string";case"element":return"canvas"===t.nodeName.toLowerCase?"canvas":"element";default:return"unknown"}}(t)){case"string":return this.set({src:N("div",{innerHTML:t})});case"element":return this.set({src:t});case"canvas":return this.set({canvas:t});case"img":return this.set({img:t});default:return this.error("Unknown source type.")}}))},E.prototype.to=function(t){switch(t){case"container":return this.toContainer();case"canvas":return this.toCanvas();case"img":return this.toImg();case"pdf":return this.toPdf();default:return this.error("Invalid target.")}},E.prototype.toContainer=function(){return this.thenList([function(){return this.prop.src||this.error("Cannot duplicate - no source HTML.")},function(){return this.prop.pageSize||this.setPageSize()}]).then((function(){var t={position:"relative",display:"inline-block",width:Math.max(this.prop.src.clientWidth,this.prop.src.scrollWidth,this.prop.src.offsetWidth)+"px",left:0,right:0,top:0,margin:"auto",backgroundColor:"white"},A=function t(A,e){for(var r=3===A.nodeType?document.createTextNode(A.nodeValue):A.cloneNode(!1),n=A.firstChild;n;n=n.nextSibling)!0!==e&&1===n.nodeType&&"SCRIPT"===n.nodeName||r.appendChild(t(n,e));return 1===A.nodeType&&("CANVAS"===A.nodeName?(r.width=A.width,r.height=A.height,r.getContext("2d").drawImage(A,0,0)):"TEXTAREA"!==A.nodeName&&"SELECT"!==A.nodeName||(r.value=A.value),r.addEventListener("load",(function(){r.scrollTop=A.scrollTop,r.scrollLeft=A.scrollLeft}),!0)),r}(this.prop.src,this.opt.html2canvas.javascriptEnabled);"BODY"===A.tagName&&(t.height=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight)+"px"),this.prop.overlay=N("div",{className:"html2pdf__overlay",style:{position:"fixed",overflow:"hidden",zIndex:1e3,left:"-100000px",right:0,bottom:0,top:0}}),this.prop.container=N("div",{className:"html2pdf__container",style:t}),this.prop.container.appendChild(A),this.prop.container.firstChild.appendChild(N("div",{style:{clear:"both",border:"0 none transparent",margin:0,padding:0,height:0}})),this.prop.container.style.float="none",this.prop.overlay.appendChild(this.prop.container),document.body.appendChild(this.prop.overlay),this.prop.container.firstChild.style.position="relative",this.prop.container.height=Math.max(this.prop.container.firstChild.clientHeight,this.prop.container.firstChild.scrollHeight,this.prop.container.firstChild.offsetHeight)+"px"}))},E.prototype.toCanvas=function(){var t=[function(){return document.body.contains(this.prop.container)||this.toContainer()}];return this.thenList(t).then((function(){var t=Object.assign({},this.opt.html2canvas);if(delete t.onrendered,this.isHtml2CanvasLoaded())return html2canvas(this.prop.container,t)})).then((function(t){(this.opt.html2canvas.onrendered||function(){})(t),this.prop.canvas=t,document.body.removeChild(this.prop.overlay)}))},E.prototype.toContext2d=function(){var t=[function(){return document.body.contains(this.prop.container)||this.toContainer()}];return this.thenList(t).then((function(){var t=this.opt.jsPDF,A=Object.assign({async:!0,allowTaint:!0,backgroundColor:"#ffffff",imageTimeout:15e3,logging:!0,proxy:null,removeContainer:!0,foreignObjectRendering:!1,useCORS:!1},this.opt.html2canvas);if(delete A.onrendered,t.context2d.autoPaging=!0,t.context2d.posX=this.opt.x,t.context2d.posY=this.opt.y,A.windowHeight=A.windowHeight||0,A.windowHeight=0==A.windowHeight?Math.max(this.prop.container.clientHeight,this.prop.container.scrollHeight,this.prop.container.offsetHeight):A.windowHeight,this.isHtml2CanvasLoaded())return html2canvas(this.prop.container,A)})).then((function(t){(this.opt.html2canvas.onrendered||function(){})(t),this.prop.canvas=t,document.body.removeChild(this.prop.overlay)}))},E.prototype.toImg=function(){return this.thenList([function(){return this.prop.canvas||this.toCanvas()}]).then((function(){var t=this.prop.canvas.toDataURL("image/"+this.opt.image.type,this.opt.image.quality);this.prop.img=document.createElement("img"),this.prop.img.src=t}))},E.prototype.toPdf=function(){return this.thenList([function(){return this.toContext2d()}]).then((function(){this.prop.pdf=this.prop.pdf||this.opt.jsPDF}))},E.prototype.output=function(t,A,e){return"img"===(e=e||"pdf").toLowerCase()||"image"===e.toLowerCase()?this.outputImg(t,A):this.outputPdf(t,A)},E.prototype.outputPdf=function(t,A){return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).then((function(){return this.prop.pdf.output(t,A)}))},E.prototype.outputImg=function(t,A){return this.thenList([function(){return this.prop.img||this.toImg()}]).then((function(){switch(t){case void 0:case"img":return this.prop.img;case"datauristring":case"dataurlstring":return this.prop.img.src;case"datauri":case"dataurl":return document.location.href=this.prop.img.src;default:throw'Image output type "'+t+'" is not supported.'}}))},E.prototype.isHtml2CanvasLoaded=function(){var t=void 0!==F.html2canvas;return t||console.error("html2canvas not loaded."),t},E.prototype.save=function(t){if(this.isHtml2CanvasLoaded())return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).set(t?{filename:t}:null).then((function(){this.prop.pdf.save(this.opt.filename)}))},E.prototype.doCallback=function(t){if(this.isHtml2CanvasLoaded())return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).then((function(){this.prop.callback(this.prop.pdf)}))},E.prototype.set=function(t){if("object"!==U(t))return this;var A=Object.keys(t||{}).map((function(A){if(A in E.template.prop)return function(){this.prop[A]=t[A]};switch(A){case"margin":return this.setMargin.bind(this,t.margin);case"jsPDF":return function(){return this.opt.jsPDF=t.jsPDF,this.setPageSize()};case"pageSize":return this.setPageSize.bind(this,t.pageSize);default:return function(){this.opt[A]=t[A]}}}),this);return this.then((function(){return this.thenList(A)}))},E.prototype.get=function(t,A){return this.then((function(){var e=t in E.template.prop?this.prop[t]:this.opt[t];return A?A(e):e}))},E.prototype.setMargin=function(t){return this.then((function(){switch(U(t)){case"number":t=[t,t,t,t];case"array":if(2===t.length&&(t=[t[0],t[1],t[0],t[1]]),4===t.length)break;default:return this.error("Invalid margin array.")}this.opt.margin=t})).then(this.setPageSize)},E.prototype.setPageSize=function(t){function A(t,A){return Math.floor(t*A/72*96)}return this.then((function(){(t=t||dt.getPageSize(this.opt.jsPDF)).hasOwnProperty("inner")||(t.inner={width:t.width-this.opt.margin[1]-this.opt.margin[3],height:t.height-this.opt.margin[0]-this.opt.margin[2]},t.inner.px={width:A(t.inner.width,t.k),height:A(t.inner.height,t.k)},t.inner.ratio=t.inner.height/t.inner.width),this.prop.pageSize=t}))},E.prototype.setProgress=function(t,A,e,r){return null!=t&&(this.progress.val=t),null!=A&&(this.progress.state=A),null!=e&&(this.progress.n=e),null!=r&&(this.progress.stack=r),this.progress.ratio=this.progress.val/this.progress.state,this},E.prototype.updateProgress=function(t,A,e,r){return this.setProgress(t?this.progress.val+t:null,A||null,e?this.progress.n+e:null,r?this.progress.stack.concat(r):null)},E.prototype.then=function(t,A){var e=this;return this.thenCore(t,A,(function(t,A){return e.updateProgress(null,null,1,[t]),Promise.prototype.then.call(this,(function(A){return e.updateProgress(null,t),A})).then(t,A).then((function(t){return e.updateProgress(1),t}))}))},E.prototype.thenCore=function(t,A,e){e=e||Promise.prototype.then;var r=this;t&&(t=t.bind(r)),A&&(A=A.bind(r));var n=-1!==Promise.toString().indexOf("[native code]")&&"Promise"===Promise.name?r:E.convert(Object.assign({},r),Promise.prototype),i=e.call(n,t,A);return E.convert(i,r.__proto__)},E.prototype.thenExternal=function(t,A){return Promise.prototype.then.call(this,t,A)},E.prototype.thenList=function(t){var A=this;return t.forEach((function(t){A=A.thenCore(t)})),A},E.prototype.catch=function(t){t&&(t=t.bind(this));var A=Promise.prototype.catch.call(this,t);return E.convert(A,this)},E.prototype.catchExternal=function(t){return Promise.prototype.catch.call(this,t)},E.prototype.error=function(t){return this.then((function(){throw new Error(t)}))},E.prototype.using=E.prototype.set,E.prototype.saveAs=E.prototype.save,E.prototype.export=E.prototype.output,E.prototype.run=E.prototype.then,dt.getPageSize=function(t,A,e){if("object"===n(t)){var r=t;t=r.orientation,A=r.unit||A,e=r.format||e}A=A||"mm",e=e||"a4",t=(""+(t||"P")).toLowerCase();var i=(""+e).toLowerCase(),o={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]};switch(A){case"pt":var s=1;break;case"mm":s=72/25.4;break;case"cm":s=72/2.54;break;case"in":s=72;break;case"px":s=.75;break;case"pc":case"em":s=12;break;case"ex":s=6;break;default:throw"Invalid unit: "+A}if(o.hasOwnProperty(i))var a=o[i][1]/s,c=o[i][0]/s;else try{a=e[1],c=e[0]}catch(t){throw new Error("Invalid format: "+e)}if("p"===t||"portrait"===t){if(t="p",a<c){var u=c;c=a,a=u}}else{if("l"!==t&&"landscape"!==t)throw"Invalid orientation: "+t;t="l",c<a&&(u=c,c=a,a=u)}return{width:c,height:a,unit:A,k:s}},v.html=function(t,A){(A=A||{}).callback=A.callback||function(){},A.html2canvas=A.html2canvas||{},A.html2canvas.canvas=A.html2canvas.canvas||this.canvas,A.jsPDF=A.jsPDF||this,A.jsPDF;var e=new E(A);return A.worker?e:e.from(t).doCallback()},dt.API.addJS=function(t){return H=t,this.internal.events.subscribe("postPutResources",(function(t){b=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/Names [(EmbeddedJS) "+(b+1)+" 0 R]"),this.internal.out(">>"),this.internal.out("endobj"),L=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/S /JavaScript"),this.internal.out("/JS ("+H+")"),this.internal.out(">>"),this.internal.out("endobj")})),this.internal.events.subscribe("putCatalog",(function(){void 0!==b&&void 0!==L&&this.internal.out("/Names <</JavaScript "+b+" 0 R>>")})),this},
/**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */(x=dt.API).events.push(["postPutResources",function(){var t=this,A=/^(\d+) 0 obj$/;if(0<this.outline.root.children.length)for(var e=t.outline.render().split(/\r\n/),r=0;r<e.length;r++){var n=e[r],i=A.exec(n);if(null!=i){var o=i[1];t.internal.newObjectDeferredBegin(o,!1)}t.internal.write(n)}if(this.outline.createNamedDestinations){var s=this.internal.pages.length,a=[];for(r=0;r<s;r++){var c=t.internal.newObject();a.push(c);var u=t.internal.getPageInfo(r+1);t.internal.write("<< /D["+u.objId+" 0 R /XYZ null null null]>> endobj")}var l=t.internal.newObject();for(t.internal.write("<< /Names [ "),r=0;r<a.length;r++)t.internal.write("(page_"+(r+1)+")"+a[r]+" 0 R");t.internal.write(" ] >>","endobj"),t.internal.newObject(),t.internal.write("<< /Dests "+l+" 0 R"),t.internal.write(">>","endobj")}}]),x.events.push(["putCatalog",function(){0<this.outline.root.children.length&&(this.internal.write("/Outlines",this.outline.makeRef(this.outline.root)),this.outline.createNamedDestinations&&this.internal.write("/Names "+namesOid+" 0 R"))}]),x.events.push(["initialized",function(){var t=this;t.outline={createNamedDestinations:!1,root:{children:[]}},t.outline.add=function(t,A,e){var r={title:A,options:e,children:[]};return null==t&&(t=this.root),t.children.push(r),r},t.outline.render=function(){return this.ctx={},this.ctx.val="",this.ctx.pdf=t,this.genIds_r(this.root),this.renderRoot(this.root),this.renderItems(this.root),this.ctx.val},t.outline.genIds_r=function(A){A.id=t.internal.newObjectDeferred();for(var e=0;e<A.children.length;e++)this.genIds_r(A.children[e])},t.outline.renderRoot=function(t){this.objStart(t),this.line("/Type /Outlines"),0<t.children.length&&(this.line("/First "+this.makeRef(t.children[0])),this.line("/Last "+this.makeRef(t.children[t.children.length-1]))),this.line("/Count "+this.count_r({count:0},t)),this.objEnd()},t.outline.renderItems=function(A){this.ctx.pdf.internal.getCoordinateString;for(var e=this.ctx.pdf.internal.getVerticalCoordinateString,r=0;r<A.children.length;r++){var n=A.children[r];this.objStart(n),this.line("/Title "+this.makeString(n.title)),this.line("/Parent "+this.makeRef(A)),0<r&&this.line("/Prev "+this.makeRef(A.children[r-1])),r<A.children.length-1&&this.line("/Next "+this.makeRef(A.children[r+1])),0<n.children.length&&(this.line("/First "+this.makeRef(n.children[0])),this.line("/Last "+this.makeRef(n.children[n.children.length-1])));var i=this.count=this.count_r({count:0},n);if(0<i&&this.line("/Count "+i),n.options&&n.options.pageNumber){var o=t.internal.getPageInfo(n.options.pageNumber);this.line("/Dest ["+o.objId+" 0 R /XYZ 0 "+e(0)+" 0]")}this.objEnd()}for(r=0;r<A.children.length;r++)n=A.children[r],this.renderItems(n)},t.outline.line=function(t){this.ctx.val+=t+"\r\n"},t.outline.makeRef=function(t){return t.id+" 0 R"},t.outline.makeString=function(A){return"("+t.internal.pdfEscape(A)+")"},t.outline.objStart=function(t){this.ctx.val+="\r\n"+t.id+" 0 obj\r\n<<\r\n"},t.outline.objEnd=function(t){this.ctx.val+=">> \r\nendobj\r\n"},t.outline.count_r=function(t,A){for(var e=0;e<A.children.length;e++)t.count++,this.count_r(t,A.children[e]);return t.count}}]),
/**
   * @license
   * 
   * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
   *
   * 
   * ====================================================================
   */
S=dt.API,I=function(){var t="function"==typeof Deflater;if(!t)throw new Error("requires deflate.js for compression");return t},_=function(t,A,e,r){var n=5,i=P;switch(r){case S.image_compression.FAST:n=3,i=M;break;case S.image_compression.MEDIUM:n=6,i=D;break;case S.image_compression.SLOW:n=9,i=k}t=O(t,A,e,i);var o=new Uint8Array(T(n)),s=R(t),a=new Deflater(n),c=a.append(t),u=a.flush(),l=o.length+c.length+u.length,h=new Uint8Array(l+4);return h.set(o),h.set(c,o.length),h.set(u,o.length+c.length),h[l++]=s>>>24&255,h[l++]=s>>>16&255,h[l++]=s>>>8&255,h[l++]=255&s,S.arrayBufferToBinaryString(h)},T=function(t,A){var e=Math.LOG2E*Math.log(32768)-8<<4|8,r=e<<8;return r|=Math.min(3,(A-1&255)>>1)<<6,r|=0,[e,255&(r+=31-r%31)]},R=function(t,A){for(var e,r=1,n=0,i=t.length,o=0;0<i;){for(i-=e=A<i?A:i;n+=r+=t[o++],--e;);r%=65521,n%=65521}return(n<<16|r)>>>0},O=function(t,A,e,r){for(var n,i,o,s=t.length/A,a=new Uint8Array(t.length+s),c=j(),u=0;u<s;u++){if(o=u*A,n=t.subarray(o,o+A),r)a.set(r(n,e,i),o+u);else{for(var l=0,h=c.length,f=[];l<h;l++)f[l]=c[l](n,e,i);var d=q(f.concat());a.set(f[d],o+u)}i=n}return a},K=function(t,A,e){var r=Array.apply([],t);return r.unshift(0),r},M=function(t,A,e){var r,n=[],i=0,o=t.length;for(n[0]=1;i<o;i++)r=t[i-A]||0,n[i+1]=t[i]-r+256&255;return n},P=function(t,A,e){var r,n=[],i=0,o=t.length;for(n[0]=2;i<o;i++)r=e&&e[i]||0,n[i+1]=t[i]-r+256&255;return n},D=function(t,A,e){var r,n,i=[],o=0,s=t.length;for(i[0]=3;o<s;o++)r=t[o-A]||0,n=e&&e[o]||0,i[o+1]=t[o]+256-(r+n>>>1)&255;return i},k=function(t,A,e){var r,n,i,o,s=[],a=0,c=t.length;for(s[0]=4;a<c;a++)r=t[a-A]||0,n=e&&e[a]||0,i=e&&e[a-A]||0,o=z(r,n,i),s[a+1]=t[a]-o+256&255;return s},z=function(t,A,e){var r=t+A-e,n=Math.abs(r-t),i=Math.abs(r-A),o=Math.abs(r-e);return n<=i&&n<=o?t:i<=o?A:e},j=function(){return[K,M,P,D,k]},q=function(t){for(var A,e,r,n=0,i=t.length;n<i;)((A=V(t[n].slice(1)))<e||!e)&&(e=A,r=n),n++;return r},V=function(t){for(var A=0,e=t.length,r=0;A<e;)r+=Math.abs(t[A++]);return r},S.processPNG=function(t,A,e,r,n){var i,o,s,a,c,u,l=this.color_spaces.DEVICE_RGB,h=this.decode.FLATE_DECODE,f=8;if(this.isArrayBuffer(t)&&(t=new Uint8Array(t)),this.isArrayBufferView(t)){if("function"!=typeof PNG||"function"!=typeof Rt)throw new Error("PNG support requires png.js and zlib.js");if(t=(i=new PNG(t)).imgData,f=i.bits,l=i.colorSpace,a=i.colors,-1!==[4,6].indexOf(i.colorType)){if(8===i.bits)for(var d,p=(N=32==i.pixelBitlength?new Uint32Array(i.decodePixels().buffer):16==i.pixelBitlength?new Uint16Array(i.decodePixels().buffer):new Uint8Array(i.decodePixels().buffer)).length,B=new Uint8Array(p*i.colors),g=new Uint8Array(p),w=i.pixelBitlength-i.bits,m=0,Q=0;m<p;m++){for(C=N[m],d=0;d<w;)B[Q++]=C>>>d&255,d+=i.bits;g[m]=C>>>d&255}if(16===i.bits){p=(N=new Uint32Array(i.decodePixels().buffer)).length,B=new Uint8Array(p*(32/i.pixelBitlength)*i.colors),g=new Uint8Array(p*(32/i.pixelBitlength));for(var C,y=1<i.colors,v=Q=m=0;m<p;)C=N[m++],B[Q++]=C>>>0&255,y&&(B[Q++]=C>>>16&255,C=N[m++],B[Q++]=C>>>0&255),g[v++]=C>>>16&255;f=8}r!==S.image_compression.NONE&&I()?(t=_(B,i.width*i.colors,i.colors,r),u=_(g,i.width,1,r)):(t=B,u=g,h=null)}if(3===i.colorType&&(l=this.color_spaces.INDEXED,c=i.palette,i.transparency.indexed)){var F=i.transparency.indexed,U=0;for(m=0,p=F.length;m<p;++m)U+=F[m];if((U/=255)==p-1&&-1!==F.indexOf(0))s=[F.indexOf(0)];else if(U!==p){var N=i.decodePixels();for(g=new Uint8Array(N.length),m=0,p=N.length;m<p;m++)g[m]=F[N[m]];u=_(g,i.width,1)}}var E=function(t){var A;switch(t){case S.image_compression.FAST:A=11;break;case S.image_compression.MEDIUM:A=13;break;case S.image_compression.SLOW:A=14;break;default:A=12}return A}(r);return o=h===this.decode.FLATE_DECODE?"/Predictor "+E+" /Colors "+a+" /BitsPerComponent "+f+" /Columns "+i.width:"/Colors "+a+" /BitsPerComponent "+f+" /Columns "+i.width,(this.isArrayBuffer(t)||this.isArrayBufferView(t))&&(t=this.arrayBufferToBinaryString(t)),(u&&this.isArrayBuffer(u)||this.isArrayBufferView(u))&&(u=this.arrayBufferToBinaryString(u)),this.createImageInfo(t,i.width,i.height,l,f,h,A,e,o,s,c,u,E)}throw new Error("Unsupported PNG image data, try using JPEG instead.")},
/**
   * @license
   * Copyright (c) 2017 Aras Abbasi 
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */(X=dt.API).processGIF89A=function(t,A,e,r,n){var i=new xt(t),o=i.width,s=i.height,a=[];i.decodeAndBlitFrameRGBA(0,a);var c={data:a,width:o,height:s},u=new It(100).encode(c,100);return X.processJPEG.call(this,u,A,e,r)},X.processGIF87A=X.processGIF89A,(G=dt.API).processBMP=function(t,A,e,r,n){var i=new _t(t,!1),o=i.width,s=i.height,a={data:i.getData(),width:o,height:s},c=new It(100).encode(a,100);return G.processJPEG.call(this,c,A,e,r)},dt.API.setLanguage=function(t){return void 0===this.internal.languageSettings&&(this.internal.languageSettings={},this.internal.languageSettings.isSubscribed=!1),void 0!=={af:"Afrikaans",sq:"Albanian",ar:"Arabic (Standard)","ar-DZ":"Arabic (Algeria)","ar-BH":"Arabic (Bahrain)","ar-EG":"Arabic (Egypt)","ar-IQ":"Arabic (Iraq)","ar-JO":"Arabic (Jordan)","ar-KW":"Arabic (Kuwait)","ar-LB":"Arabic (Lebanon)","ar-LY":"Arabic (Libya)","ar-MA":"Arabic (Morocco)","ar-OM":"Arabic (Oman)","ar-QA":"Arabic (Qatar)","ar-SA":"Arabic (Saudi Arabia)","ar-SY":"Arabic (Syria)","ar-TN":"Arabic (Tunisia)","ar-AE":"Arabic (U.A.E.)","ar-YE":"Arabic (Yemen)",an:"Aragonese",hy:"Armenian",as:"Assamese",ast:"Asturian",az:"Azerbaijani",eu:"Basque",be:"Belarusian",bn:"Bengali",bs:"Bosnian",br:"Breton",bg:"Bulgarian",my:"Burmese",ca:"Catalan",ch:"Chamorro",ce:"Chechen",zh:"Chinese","zh-HK":"Chinese (Hong Kong)","zh-CN":"Chinese (PRC)","zh-SG":"Chinese (Singapore)","zh-TW":"Chinese (Taiwan)",cv:"Chuvash",co:"Corsican",cr:"Cree",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch (Standard)","nl-BE":"Dutch (Belgian)",en:"English","en-AU":"English (Australia)","en-BZ":"English (Belize)","en-CA":"English (Canada)","en-IE":"English (Ireland)","en-JM":"English (Jamaica)","en-NZ":"English (New Zealand)","en-PH":"English (Philippines)","en-ZA":"English (South Africa)","en-TT":"English (Trinidad & Tobago)","en-GB":"English (United Kingdom)","en-US":"English (United States)","en-ZW":"English (Zimbabwe)",eo:"Esperanto",et:"Estonian",fo:"Faeroese",fj:"Fijian",fi:"Finnish",fr:"French (Standard)","fr-BE":"French (Belgium)","fr-CA":"French (Canada)","fr-FR":"French (France)","fr-LU":"French (Luxembourg)","fr-MC":"French (Monaco)","fr-CH":"French (Switzerland)",fy:"Frisian",fur:"Friulian",gd:"Gaelic (Scots)","gd-IE":"Gaelic (Irish)",gl:"Galacian",ka:"Georgian",de:"German (Standard)","de-AT":"German (Austria)","de-DE":"German (Germany)","de-LI":"German (Liechtenstein)","de-LU":"German (Luxembourg)","de-CH":"German (Switzerland)",el:"Greek",gu:"Gujurati",ht:"Haitian",he:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",iu:"Inuktitut",ga:"Irish",it:"Italian (Standard)","it-CH":"Italian (Switzerland)",ja:"Japanese",kn:"Kannada",ks:"Kashmiri",kk:"Kazakh",km:"Khmer",ky:"Kirghiz",tlh:"Klingon",ko:"Korean","ko-KP":"Korean (North Korea)","ko-KR":"Korean (South Korea)",la:"Latin",lv:"Latvian",lt:"Lithuanian",lb:"Luxembourgish",mk:"FYRO Macedonian",ms:"Malay",ml:"Malayalam",mt:"Maltese",mi:"Maori",mr:"Marathi",mo:"Moldavian",nv:"Navajo",ng:"Ndonga",ne:"Nepali",no:"Norwegian",nb:"Norwegian (Bokmal)",nn:"Norwegian (Nynorsk)",oc:"Occitan",or:"Oriya",om:"Oromo",fa:"Persian","fa-IR":"Persian/Iran",pl:"Polish",pt:"Portuguese","pt-BR":"Portuguese (Brazil)",pa:"Punjabi","pa-IN":"Punjabi (India)","pa-PK":"Punjabi (Pakistan)",qu:"Quechua",rm:"Rhaeto-Romanic",ro:"Romanian","ro-MO":"Romanian (Moldavia)",ru:"Russian","ru-MO":"Russian (Moldavia)",sz:"Sami (Lappish)",sg:"Sango",sa:"Sanskrit",sc:"Sardinian",sd:"Sindhi",si:"Singhalese",sr:"Serbian",sk:"Slovak",sl:"Slovenian",so:"Somani",sb:"Sorbian",es:"Spanish","es-AR":"Spanish (Argentina)","es-BO":"Spanish (Bolivia)","es-CL":"Spanish (Chile)","es-CO":"Spanish (Colombia)","es-CR":"Spanish (Costa Rica)","es-DO":"Spanish (Dominican Republic)","es-EC":"Spanish (Ecuador)","es-SV":"Spanish (El Salvador)","es-GT":"Spanish (Guatemala)","es-HN":"Spanish (Honduras)","es-MX":"Spanish (Mexico)","es-NI":"Spanish (Nicaragua)","es-PA":"Spanish (Panama)","es-PY":"Spanish (Paraguay)","es-PE":"Spanish (Peru)","es-PR":"Spanish (Puerto Rico)","es-ES":"Spanish (Spain)","es-UY":"Spanish (Uruguay)","es-VE":"Spanish (Venezuela)",sx:"Sutu",sw:"Swahili",sv:"Swedish","sv-FI":"Swedish (Finland)","sv-SV":"Swedish (Sweden)",ta:"Tamil",tt:"Tatar",te:"Teluga",th:"Thai",tig:"Tigre",ts:"Tsonga",tn:"Tswana",tr:"Turkish",tk:"Turkmen",uk:"Ukrainian",hsb:"Upper Sorbian",ur:"Urdu",ve:"Venda",vi:"Vietnamese",vo:"Volapuk",wa:"Walloon",cy:"Welsh",xh:"Xhosa",ji:"Yiddish",zu:"Zulu"}[t]&&(this.internal.languageSettings.languageCode=t,!1===this.internal.languageSettings.isSubscribed&&(this.internal.events.subscribe("putCatalog",(function(){this.internal.write("/Lang ("+this.internal.languageSettings.languageCode+")")})),this.internal.languageSettings.isSubscribed=!0)),this
/** @license
   * MIT license.
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   *               2014 Diego Casorran, https://github.com/diegocr
   *
   * 
   * ====================================================================
   */},J=dt.API,W=J.getCharWidthsArray=function(t,A){var e,r,n,i=(A=A||{}).font||this.internal.getFont(),o=A.fontSize||this.internal.getFontSize(),s=A.charSpace||this.internal.getCharSpace(),a=A.widths?A.widths:i.metadata.Unicode.widths,c=a.fof?a.fof:1,u=A.kerning?A.kerning:i.metadata.Unicode.kerning,l=u.fof?u.fof:1,h=0,f=a[0]||c,d=[];for(e=0,r=t.length;e<r;e++)n=t.charCodeAt(e),"function"==typeof i.metadata.widthOfString?d.push((i.metadata.widthOfGlyph(i.metadata.characterToGlyph(n))+s*(1e3/o)||0)/1e3):d.push((a[n]||f)/c+(u[n]&&u[n][h]||0)/l),h=n;return d},Y=J.getArraySum=function(t){for(var A=t.length,e=0;A;)e+=t[--A];return e},Z=J.getStringUnitWidth=function(t,A){var e=(A=A||{}).fontSize||this.internal.getFontSize(),r=A.font||this.internal.getFont(),n=A.charSpace||this.internal.getCharSpace();return"function"==typeof r.metadata.widthOfString?r.metadata.widthOfString(t,e,n)/e:Y(W.apply(this,arguments))},$=function(t,A,e,r){for(var n=[],i=0,o=t.length,s=0;i!==o&&s+A[i]<e;)s+=A[i],i++;n.push(t.slice(0,i));var a=i;for(s=0;i!==o;)s+A[i]>r&&(n.push(t.slice(a,i)),s=0,a=i),s+=A[i],i++;return a!==i&&n.push(t.slice(a,i)),n},tt=function(t,A,e){e||(e={});var r,n,i,o,s,a,c=[],u=[c],l=e.textIndent||0,h=0,f=0,d=t.split(" "),p=W.apply(this,[" ",e])[0];if(a=-1===e.lineIndent?d[0].length+2:e.lineIndent||0){var B=Array(a).join(" "),g=[];d.map((function(t){1<(t=t.split(/\s*\n/)).length?g=g.concat(t.map((function(t,A){return(A&&t.length?"\n":"")+t}))):g.push(t[0])})),d=g,a=Z.apply(this,[B,e])}for(i=0,o=d.length;i<o;i++){var w=0;if(r=d[i],a&&"\n"==r[0]&&(r=r.substr(1),w=1),n=W.apply(this,[r,e]),A<l+h+(f=Y(n))||w){if(A<f){for(s=$.apply(this,[r,n,A-(l+h),A]),c.push(s.shift()),c=[s.pop()];s.length;)u.push([s.shift()]);f=Y(n.slice(r.length-(c[0]?c[0].length:0)))}else c=[r];u.push(c),l=f+a,h=p}else c.push(r),l+=h+f,h=p}if(a)var m=function(t,A){return(A?B:"")+t.join(" ")};else m=function(t){return t.join(" ")};return u.map(m)},J.splitTextToSize=function(t,A,e){var r,n=(e=e||{}).fontSize||this.internal.getFontSize(),i=function(t){if(t.widths&&t.kerning)return{widths:t.widths,kerning:t.kerning};var A=this.internal.getFont(t.fontName,t.fontStyle),e="Unicode";return A.metadata[e]?{widths:A.metadata[e].widths||{0:1},kerning:A.metadata[e].kerning||{}}:{font:A.metadata,fontSize:this.internal.getFontSize(),charSpace:this.internal.getCharSpace()}}.call(this,e);r=Array.isArray(t)?t:t.split(/\r?\n/);var o=1*this.internal.scaleFactor*A/n;i.textIndent=e.textIndent?1*e.textIndent*this.internal.scaleFactor/n:0,i.lineIndent=e.lineIndent;var s,a,c=[];for(s=0,a=r.length;s<a;s++)c=c.concat(tt.apply(this,[r[s],o,i]));return c},
/** @license
   jsPDF standard_fonts_metrics plugin
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   * MIT license.
   * 
   * ====================================================================
   */
At=dt.API,rt={codePages:["WinAnsiEncoding"],WinAnsiEncoding:(et=function(t){for(var A="klmnopqrstuvwxyz",e={},r=0;r<A.length;r++)e[A[r]]="0123456789abcdef"[r];var n,i,o,s,a,c={},u=1,l=c,h=[],f="",d="",p=t.length-1;for(r=1;r!=p;)a=t[r],r+=1,"'"==a?i=i?(s=i.join(""),n):[]:i?i.push(a):"{"==a?(h.push([l,s]),l={},s=n):"}"==a?((o=h.pop())[0][o[1]]=l,s=n,l=o[0]):"-"==a?u=-1:s===n?e.hasOwnProperty(a)?(f+=e[a],s=parseInt(f,16)*u,u=1,f=""):f+=a:e.hasOwnProperty(a)?(d+=e[a],l[s]=parseInt(d,16)*u,u=1,s=n,d=""):d+=a;return c})("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")},nt={Unicode:{Courier:rt,"Courier-Bold":rt,"Courier-BoldOblique":rt,"Courier-Oblique":rt,Helvetica:rt,"Helvetica-Bold":rt,"Helvetica-BoldOblique":rt,"Helvetica-Oblique":rt,"Times-Roman":rt,"Times-Bold":rt,"Times-BoldItalic":rt,"Times-Italic":rt}},it={Unicode:{"Courier-Oblique":et("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-BoldItalic":et("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),"Helvetica-Bold":et("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),Courier:et("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-BoldOblique":et("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Bold":et("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),Symbol:et("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"),Helvetica:et("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),"Helvetica-BoldOblique":et("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),ZapfDingbats:et("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-Bold":et("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Italic":et("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),"Times-Roman":et("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),"Helvetica-Oblique":et("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")}},At.events.push(["addFont",function(t){var A,e,r,n=t.font,i="Unicode";(A=it[i][n.postScriptName])&&((e=n.metadata[i]?n.metadata[i]:n.metadata[i]={}).widths=A.widths,e.kerning=A.kerning),(r=nt[i][n.postScriptName])&&((e=n.metadata[i]?n.metadata[i]:n.metadata[i]={}).encoding=r).codePages&&r.codePages.length&&(n.encoding=r.codePages[0])}]),
/**
   * @license
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
ot=dt,"undefined"!=typeof self&&self||void 0!==r&&r||"undefined"!=typeof window&&window||Function("return this")(),ot.API.events.push(["addFont",function(t){var A=t.font,e=t.instance;if(void 0!==e&&e.existsFileInVFS(A.postScriptName)){var r=e.getFileFromVFS(A.postScriptName);if("string"!=typeof r)throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('"+A.postScriptName+"').");A.metadata=ot.API.TTFFont.open(A.postScriptName,A.fontName,r,A.encoding),A.metadata.Unicode=A.metadata.Unicode||{encoding:{},kerning:{},widths:[]},A.metadata.glyIdsUsed=[0]}else if(!1===A.isStandardFont)throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('"+A.postScriptName+"').")}]),
/** @license
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   * 
   * 
   * ====================================================================
   */(st=dt.API).addSvg=function(t,A,e,r,n){if(void 0===A||void 0===e)throw new Error("addSVG needs values for 'x' and 'y'");function i(t){for(var A=parseFloat(t[1]),e=parseFloat(t[2]),r=[],n=3,i=t.length;n<i;)"c"===t[n]?(r.push([parseFloat(t[n+1]),parseFloat(t[n+2]),parseFloat(t[n+3]),parseFloat(t[n+4]),parseFloat(t[n+5]),parseFloat(t[n+6])]),n+=7):"l"===t[n]?(r.push([parseFloat(t[n+1]),parseFloat(t[n+2])]),n+=3):n+=1;return[A,e,r]}var o,s,a,c,u,l,h,f,d=(o=t,(a=((f=(c=document).createElement("iframe"),u=".jsPDF_sillysvg_iframe {display:none;position:absolute;}",(h=(l=c).createElement("style")).type="text/css",h.styleSheet?h.styleSheet.cssText=u:h.appendChild(l.createTextNode(u)),l.getElementsByTagName("head")[0].appendChild(h),f.name="childframe",f.setAttribute("width",0),f.setAttribute("height",0),f.setAttribute("frameborder","0"),f.setAttribute("scrolling","no"),f.setAttribute("seamless","seamless"),f.setAttribute("class","jsPDF_sillysvg_iframe"),c.body.appendChild(f),s=f).contentWindow||s.contentDocument).document).write(o),a.close(),a.getElementsByTagName("svg")[0]),p=[1,1],B=parseFloat(d.getAttribute("width")),g=parseFloat(d.getAttribute("height"));B&&g&&(r&&n?p=[r/B,n/g]:r?p=[r/B,r/B]:n&&(p=[n/g,n/g]));var w,m,Q,C,y=d.childNodes;for(w=0,m=y.length;w<m;w++)(Q=y[w]).tagName&&"PATH"===Q.tagName.toUpperCase()&&((C=i(Q.getAttribute("d").split(" ")))[0]=C[0]*p[0]+A,C[1]=C[1]*p[1]+e,this.lines.call(this,C[2],C[0],C[1],p));return this},st.addSVG=st.addSvg,st.addSvgAsImage=function(t,A,e,r,n,i,o,s){if(isNaN(A)||isNaN(e))throw console.error("jsPDF.addSvgAsImage: Invalid coordinates",arguments),new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");if(isNaN(r)||isNaN(n))throw console.error("jsPDF.addSvgAsImage: Invalid measurements",arguments),new Error("Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage");var a=document.createElement("canvas");a.width=r,a.height=n;var c=a.getContext("2d");return c.fillStyle="#fff",c.fillRect(0,0,a.width,a.height),canvg(a,t,{ignoreMouse:!0,ignoreAnimation:!0,ignoreDimensions:!0,ignoreClear:!0}),this.addImage(a.toDataURL("image/jpeg",1),A,e,r,n,o,s),this},dt.API.putTotalPages=function(t){var A,e;e=parseInt(this.internal.getFont().id.substr(1),10)<15?(A=new RegExp(t,"g"),this.internal.getNumberOfPages()):(A=new RegExp(this.pdfEscape16(t,this.internal.getFont()),"g"),this.pdfEscape16(this.internal.getNumberOfPages()+"",this.internal.getFont()));for(var r=1;r<=this.internal.getNumberOfPages();r++)for(var n=0;n<this.internal.pages[r].length;n++)this.internal.pages[r][n]=this.internal.pages[r][n].replace(A,e);return this},dt.API.viewerPreferences=function(t,A){var e;t=t||{},A=A||!1;var r,i,o={HideToolbar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideMenubar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideWindowUI:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},FitWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},CenterWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},DisplayDocTitle:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.4},NonFullScreenPageMode:{defaultValue:"UseNone",value:"UseNone",type:"name",explicitSet:!1,valueSet:["UseNone","UseOutlines","UseThumbs","UseOC"],pdfVersion:1.3},Direction:{defaultValue:"L2R",value:"L2R",type:"name",explicitSet:!1,valueSet:["L2R","R2L"],pdfVersion:1.3},ViewArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},ViewClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintScaling:{defaultValue:"AppDefault",value:"AppDefault",type:"name",explicitSet:!1,valueSet:["AppDefault","None"],pdfVersion:1.6},Duplex:{defaultValue:"",value:"none",type:"name",explicitSet:!1,valueSet:["Simplex","DuplexFlipShortEdge","DuplexFlipLongEdge","none"],pdfVersion:1.7},PickTrayByPDFSize:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.7},PrintPageRange:{defaultValue:"",value:"",type:"array",explicitSet:!1,valueSet:null,pdfVersion:1.7},NumCopies:{defaultValue:1,value:1,type:"integer",explicitSet:!1,valueSet:null,pdfVersion:1.7}},s=Object.keys(o),a=[],c=0,u=0,l=0,h=!0;function f(t,A){var e,r=!1;for(e=0;e<t.length;e+=1)t[e]===A&&(r=!0);return r}if(void 0===this.internal.viewerpreferences&&(this.internal.viewerpreferences={},this.internal.viewerpreferences.configuration=JSON.parse(JSON.stringify(o)),this.internal.viewerpreferences.isSubscribed=!1),e=this.internal.viewerpreferences.configuration,"reset"===t||!0===A){var d=s.length;for(l=0;l<d;l+=1)e[s[l]].value=e[s[l]].defaultValue,e[s[l]].explicitSet=!1}if("object"===n(t))for(r in t)if(i=t[r],f(s,r)&&void 0!==i){if("boolean"===e[r].type&&"boolean"==typeof i)e[r].value=i;else if("name"===e[r].type&&f(e[r].valueSet,i))e[r].value=i;else if("integer"===e[r].type&&Number.isInteger(i))e[r].value=i;else if("array"===e[r].type){for(c=0;c<i.length;c+=1)if(h=!0,1===i[c].length&&"number"==typeof i[c][0])a.push(String(i[c]-1));else if(1<i[c].length){for(u=0;u<i[c].length;u+=1)"number"!=typeof i[c][u]&&(h=!1);!0===h&&a.push([i[c][0]-1,i[c][1]-1].join(" "))}e[r].value="["+a.join(" ")+"]"}else e[r].value=e[r].defaultValue;e[r].explicitSet=!0}return!1===this.internal.viewerpreferences.isSubscribed&&(this.internal.events.subscribe("putCatalog",(function(){var t,A=[];for(t in e)!0===e[t].explicitSet&&("name"===e[t].type?A.push("/"+t+" /"+e[t].value):A.push("/"+t+" "+e[t].value));0!==A.length&&this.internal.write("/ViewerPreferences\n<<\n"+A.join("\n")+"\n>>")})),this.internal.viewerpreferences.isSubscribed=!0),this.internal.viewerpreferences.configuration=e,this},at=dt.API,lt=ut=ct="",at.addMetadata=function(t,A){return ut=A||"http://jspdf.default.namespaceuri/",ct=t,this.internal.events.subscribe("postPutResources",(function(){if(ct){var t='<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="'+ut+'"><jspdf:metadata>',A=unescape(encodeURIComponent('<x:xmpmeta xmlns:x="adobe:ns:meta/">')),e=unescape(encodeURIComponent(t)),r=unescape(encodeURIComponent(ct)),n=unescape(encodeURIComponent("</jspdf:metadata></rdf:Description></rdf:RDF>")),i=unescape(encodeURIComponent("</x:xmpmeta>")),o=e.length+r.length+n.length+A.length+i.length;lt=this.internal.newObject(),this.internal.write("<< /Type /Metadata /Subtype /XML /Length "+o+" >>"),this.internal.write("stream"),this.internal.write(A+e+r+n+i),this.internal.write("endstream"),this.internal.write("endobj")}else lt=""})),this.internal.events.subscribe("putCatalog",(function(){lt&&this.internal.write("/Metadata "+lt+" 0 R")})),this},function(t,A){var e=t.API,r=e.pdfEscape16=function(t,A){for(var e,r=A.metadata.Unicode.widths,n=["","0","00","000","0000"],i=[""],o=0,s=t.length;o<s;++o){if(e=A.metadata.characterToGlyph(t.charCodeAt(o)),A.metadata.glyIdsUsed.push(e),A.metadata.toUnicode[e]=t.charCodeAt(o),-1==r.indexOf(e)&&(r.push(e),r.push([parseInt(A.metadata.widthOfGlyph(e),10)])),"0"==e)return i.join("");e=e.toString(16),i.push(n[4-e.length],e)}return i.join("")},n=function(t){var A,e,r,n,i,o,s;for(i="/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange",r=[],o=0,s=(e=Object.keys(t).sort((function(t,A){return t-A}))).length;o<s;o++)A=e[o],100<=r.length&&(i+="\n"+r.length+" beginbfchar\n"+r.join("\n")+"\nendbfchar",r=[]),n=("0000"+t[A].toString(16)).slice(-4),A=("0000"+(+A).toString(16)).slice(-4),r.push("<"+A+"><"+n+">");return r.length&&(i+="\n"+r.length+" beginbfchar\n"+r.join("\n")+"\nendbfchar\n"),i+"endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend"};e.events.push(["putFont",function(A){!function(A,e,r,i){if(A.metadata instanceof t.API.TTFFont&&"Identity-H"===A.encoding){for(var o=A.metadata.Unicode.widths,s=A.metadata.subset.encode(A.metadata.glyIdsUsed,1),a="",c=0;c<s.length;c++)a+=String.fromCharCode(s[c]);var u=r();i({data:a,addLength1:!0}),e("endobj");var l=r();i({data:n(A.metadata.toUnicode),addLength1:!0}),e("endobj");var h=r();e("<<"),e("/Type /FontDescriptor"),e("/FontName /"+A.fontName),e("/FontFile2 "+u+" 0 R"),e("/FontBBox "+t.API.PDFObject.convert(A.metadata.bbox)),e("/Flags "+A.metadata.flags),e("/StemV "+A.metadata.stemV),e("/ItalicAngle "+A.metadata.italicAngle),e("/Ascent "+A.metadata.ascender),e("/Descent "+A.metadata.decender),e("/CapHeight "+A.metadata.capHeight),e(">>"),e("endobj");var f=r();e("<<"),e("/Type /Font"),e("/BaseFont /"+A.fontName),e("/FontDescriptor "+h+" 0 R"),e("/W "+t.API.PDFObject.convert(o)),e("/CIDToGIDMap /Identity"),e("/DW 1000"),e("/Subtype /CIDFontType2"),e("/CIDSystemInfo"),e("<<"),e("/Supplement 0"),e("/Registry (Adobe)"),e("/Ordering ("+A.encoding+")"),e(">>"),e(">>"),e("endobj"),A.objectNumber=r(),e("<<"),e("/Type /Font"),e("/Subtype /Type0"),e("/ToUnicode "+l+" 0 R"),e("/BaseFont /"+A.fontName),e("/Encoding /"+A.encoding),e("/DescendantFonts ["+f+" 0 R]"),e(">>"),e("endobj"),A.isAlreadyPutted=!0}}(A.font,A.out,A.newObject,A.putStream)}]),e.events.push(["putFont",function(A){!function(A,e,r,i){if(A.metadata instanceof t.API.TTFFont&&"WinAnsiEncoding"===A.encoding){A.metadata.Unicode.widths;for(var o=A.metadata.rawData,s="",a=0;a<o.length;a++)s+=String.fromCharCode(o[a]);var c=r();i({data:s,addLength1:!0}),e("endobj");var u=r();i({data:n(A.metadata.toUnicode),addLength1:!0}),e("endobj");var l=r();for(e("<<"),e("/Descent "+A.metadata.decender),e("/CapHeight "+A.metadata.capHeight),e("/StemV "+A.metadata.stemV),e("/Type /FontDescriptor"),e("/FontFile2 "+c+" 0 R"),e("/Flags 96"),e("/FontBBox "+t.API.PDFObject.convert(A.metadata.bbox)),e("/FontName /"+A.fontName),e("/ItalicAngle "+A.metadata.italicAngle),e("/Ascent "+A.metadata.ascender),e(">>"),e("endobj"),A.objectNumber=r(),a=0;a<A.metadata.hmtx.widths.length;a++)A.metadata.hmtx.widths[a]=parseInt(A.metadata.hmtx.widths[a]*(1e3/A.metadata.head.unitsPerEm));e("<</Subtype/TrueType/Type/Font/ToUnicode "+u+" 0 R/BaseFont/"+A.fontName+"/FontDescriptor "+l+" 0 R/Encoding/"+A.encoding+" /FirstChar 29 /LastChar 255 /Widths "+t.API.PDFObject.convert(A.metadata.hmtx.widths)+">>"),e("endobj"),A.isAlreadyPutted=!0}}(A.font,A.out,A.newObject,A.putStream)}]);var i=function(t){var A,e,n=t.text||"",i=t.x,o=t.y,s=t.options||{},a=t.mutex||{},c=a.pdfEscape,u=a.activeFontKey,l=a.fonts,h=(a.activeFontSize,""),f=0,d="",p=l[e=u].encoding;if("Identity-H"!==l[e].encoding)return{text:n,x:i,y:o,options:s,mutex:a};for(d=n,e=u,"[object Array]"===Object.prototype.toString.call(n)&&(d=n[0]),f=0;f<d.length;f+=1)l[e].metadata.hasOwnProperty("cmap")&&(A=l[e].metadata.cmap.unicode.codeMap[d[f].charCodeAt(0)]),A||d[f].charCodeAt(0)<256&&l[e].metadata.hasOwnProperty("Unicode")?h+=d[f]:h+="";var B="";return parseInt(e.slice(1))<14||"WinAnsiEncoding"===p?B=function(t){for(var A="",e=0;e<t.length;e++)A+=""+t.charCodeAt(e).toString(16);return A}(c(h,e)):"Identity-H"===p&&(B=r(h,l[e])),a.isHex=!0,{text:B,x:i,y:o,options:s,mutex:a}};e.events.push(["postProcessText",function(t){var A=t.text||"",e=t.x,r=t.y,n=t.options,o=t.mutex,s=(n.lang,[]),a={text:A,x:e,y:r,options:n,mutex:o};if("[object Array]"===Object.prototype.toString.call(A)){var c=0;for(c=0;c<A.length;c+=1)"[object Array]"===Object.prototype.toString.call(A[c])&&3===A[c].length?s.push([i(Object.assign({},a,{text:A[c][0]})).text,A[c][1],A[c][2]]):s.push(i(Object.assign({},a,{text:A[c]})).text);t.text=s}else t.text=i(Object.assign({},a,{text:A})).text}])}(dt,"undefined"!=typeof self&&self||void 0!==r&&r||"undefined"!=typeof window&&window||Function("return this")()),ht=dt.API,ft=function(t){return void 0!==t&&(void 0===t.vFS&&(t.vFS={}),!0)},ht.existsFileInVFS=function(t){return!!ft(this.internal)&&void 0!==this.internal.vFS[t]},ht.addFileToVFS=function(t,A){return ft(this.internal),this.internal.vFS[t]=A,this},ht.getFileFromVFS=function(t){return ft(this.internal),void 0!==this.internal.vFS[t]?this.internal.vFS[t]:null},dt.API.addHTML=function(t,A,e,r,n){if("undefined"==typeof html2canvas&&"undefined"==typeof rasterizeHTML)throw new Error("You need either https://github.com/niklasvh/html2canvas or https://github.com/cburgmer/rasterizeHTML.js");"number"!=typeof A&&(r=A,n=e),"function"==typeof r&&(n=r,r=null),"function"!=typeof n&&(n=function(){});var i=this.internal,o=i.scaleFactor,s=i.pageSize.getWidth(),a=i.pageSize.getHeight();if((r=r||{}).onrendered=function(t){A=parseInt(A)||0,e=parseInt(e)||0;var i=r.dim||{},c=Object.assign({top:0,right:0,bottom:0,left:0,useFor:"content"},r.margin),u=i.h||Math.min(a,t.height/o),l=i.w||Math.min(s,t.width/o)-A,h=r.format||"JPEG",f=r.imageCompression||"SLOW";if(t.height>a-c.top-c.bottom&&r.pagesplit){var d=function(t,A,e,n,i){var o=document.createElement("canvas");o.height=i,o.width=n;var s=o.getContext("2d");return s.mozImageSmoothingEnabled=!1,s.webkitImageSmoothingEnabled=!1,s.msImageSmoothingEnabled=!1,s.imageSmoothingEnabled=!1,s.fillStyle=r.backgroundColor||"#ffffff",s.fillRect(0,0,n,i),s.drawImage(t,A,e,n,i,0,0,n,i),o},p=function(){for(var r,i,u=0,p=0,B={},g=!1;;){var w;if(p=0,B.top=0!==u?c.top:e,B.left=0!==u?c.left:A,g=(s-c.left-c.right)*o<t.width,"content"===c.useFor?0===u?(r=Math.min((s-c.left)*o,t.width),i=Math.min((a-c.top)*o,t.height-u)):(r=Math.min(s*o,t.width),i=Math.min(a*o,t.height-u),B.top=0):(r=Math.min((s-c.left-c.right)*o,t.width),i=Math.min((a-c.bottom-c.top)*o,t.height-u)),g)for(;;){"content"===c.useFor&&(0===p?r=Math.min((s-c.left)*o,t.width):(r=Math.min(s*o,t.width-p),B.left=0));var m=[w=d(t,p,u,r,i),B.left,B.top,w.width/o,w.height/o,h,null,f];if(this.addImage.apply(this,m),(p+=r)>=t.width)break;this.addPage()}else m=[w=d(t,0,u,r,i),B.left,B.top,w.width/o,w.height/o,h,null,f],this.addImage.apply(this,m);if((u+=i)>=t.height)break;this.addPage()}n(l,u,null,m)}.bind(this);if("CANVAS"===t.nodeName){var B=new Image;B.onload=p,B.src=t.toDataURL("image/png"),t=B}else p()}else{var g=Math.random().toString(35),w=[t,A,e,l,u,h,g,f];this.addImage.apply(this,w),n(l,u,g,w)}}.bind(this),"undefined"!=typeof html2canvas&&!r.rstz)return html2canvas(t,r);if("undefined"==typeof rasterizeHTML)return null;var c="drawDocument";return"string"==typeof t&&(c=/^http/.test(t)?"drawURL":"drawHTML"),r.width=r.width||s*o,rasterizeHTML[c](t,void 0,r).then((function(t){r.onrendered(t.image)}),(function(t){n(null,t)}))
/**
   * jsPDF fromHTML plugin. BETA stage. API subject to change. Needs browser
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 Daniel Husar, https://github.com/danielhusar
   *               2014 Wolfgang Gassler, https://github.com/woolfg
   *               2014 Steven Spungin, https://github.com/flamenco
   *
   * @license
   * 
   * ====================================================================
   */},function(t){var A,e,r,i,o,s,a,c,u,l,h,f,d,p,B,g,w,m,Q,C;A=function(){return function(A){return t.prototype=A,new t};function t(){}}(),l=function(t){var A,e,r,n,i,o,s;for(e=0,r=t.length,A=void 0,o=n=!1;!n&&e!==r;)(A=t[e]=t[e].trimLeft())&&(n=!0),e++;for(e=r-1;r&&!o&&-1!==e;)(A=t[e]=t[e].trimRight())&&(o=!0),e--;for(i=/\s+$/g,s=!0,e=0;e!==r;)"\u2028"!=t[e]&&(A=t[e].replace(/\s+/g," "),s&&(A=A.trimLeft()),A&&(s=i.test(A)),t[e]=A),e++;return t},f=function(t){var A,e,n;for(A=void 0,e=(n=t.split(",")).shift();!A&&e;)A=r[e.trim().toLowerCase()],e=n.shift();return A},d=function(t){var A;return-1<(t="auto"===t?"0px":t).indexOf("em")&&!isNaN(Number(t.replace("em","")))&&(t=18.719*Number(t.replace("em",""))+"px"),-1<t.indexOf("pt")&&!isNaN(Number(t.replace("pt","")))&&(t=1.333*Number(t.replace("pt",""))+"px"),(A=p[t])?A:void 0!==(A={"xx-small":9,"x-small":11,small:13,medium:16,large:19,"x-large":23,"xx-large":28,auto:0}[t])||(A=parseFloat(t))?p[t]=A/16:(A=t.match(/([\d\.]+)(px)/),Array.isArray(A)&&3===A.length?p[t]=parseFloat(A[1])/16:p[t]=1)},u=function(t){var A,e,r,n,u;return u=t,n=document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(u,null):u.currentStyle?u.currentStyle:u.style,e=void 0,(A={})["font-family"]=f((r=function(t){return t=t.replace(/-\D/g,(function(t){return t.charAt(1).toUpperCase()})),n[t]})("font-family"))||"times",A["font-style"]=i[r("font-style")]||"normal",A["text-align"]=o[r("text-align")]||"left","bold"===(e=s[r("font-weight")]||"normal")&&("normal"===A["font-style"]?A["font-style"]=e:A["font-style"]=e+A["font-style"]),A["font-size"]=d(r("font-size"))||1,A["line-height"]=d(r("line-height"))||1,A.display="inline"===r("display")?"inline":"block",e="block"===A.display,A["margin-top"]=e&&d(r("margin-top"))||0,A["margin-bottom"]=e&&d(r("margin-bottom"))||0,A["padding-top"]=e&&d(r("padding-top"))||0,A["padding-bottom"]=e&&d(r("padding-bottom"))||0,A["margin-left"]=e&&d(r("margin-left"))||0,A["margin-right"]=e&&d(r("margin-right"))||0,A["padding-left"]=e&&d(r("padding-left"))||0,A["padding-right"]=e&&d(r("padding-right"))||0,A["page-break-before"]=r("page-break-before")||"auto",A.float=a[r("cssFloat")]||"none",A.clear=c[r("clear")]||"none",A.color=r("color"),A},B=function(t,A,e){var r,n,i,o,s;if(i=!1,o=n=void 0,r=e["#"+t.id])if("function"==typeof r)i=r(t,A);else for(n=0,o=r.length;!i&&n!==o;)i=r[n](t,A),n++;if(r=e[t.nodeName],!i&&r)if("function"==typeof r)i=r(t,A);else for(n=0,o=r.length;!i&&n!==o;)i=r[n](t,A),n++;for(s="string"==typeof t.className?t.className.split(" "):[],n=0;n<s.length;n++)if(r=e["."+s[n]],!i&&r)if("function"==typeof r)i=r(t,A);else for(n=0,o=r.length;!i&&n!==o;)i=r[n](t,A),n++;return i},C=function(t,A){var e,r,n,i,o,s,a,c,u;for(e=[],r=[],n=0,u=t.rows[0].cells.length,a=t.clientWidth;n<u;)c=t.rows[0].cells[n],r[n]={name:c.textContent.toLowerCase().replace(/\s+/g,""),prompt:c.textContent.replace(/\r?\n/g,""),width:c.clientWidth/a*A.pdf.internal.pageSize.getWidth()},n++;for(n=1;n<t.rows.length;){for(s=t.rows[n],o={},i=0;i<s.cells.length;)o[r[i].name]=s.cells[i].textContent.replace(/\r?\n/g,""),i++;e.push(o),n++}return{rows:e,headers:r}};var y={SCRIPT:1,STYLE:1,NOSCRIPT:1,OBJECT:1,EMBED:1,SELECT:1},v=1;e=function(t,r,i){var o,s,a,c,l,h,f,d;for(s=t.childNodes,o=void 0,(l="block"===(a=u(t)).display)&&(r.setBlockBoundary(),r.setBlockStyle(a)),c=0,h=s.length;c<h;){if("object"===n(o=s[c])){if(r.executeWatchFunctions(o),1===o.nodeType&&"HEADER"===o.nodeName){var p=o,w=r.pdf.margins_doc.top;r.pdf.internal.events.subscribe("addPage",(function(t){r.y=w,e(p,r,i),r.pdf.margins_doc.top=r.y+10,r.y+=10}),!1)}if(8===o.nodeType&&"#comment"===o.nodeName)~o.textContent.indexOf("ADD_PAGE")&&(r.pdf.addPage(),r.y=r.pdf.margins_doc.top);else if(1!==o.nodeType||y[o.nodeName])if(3===o.nodeType){var m=o.nodeValue;if(o.nodeValue&&"LI"===o.parentNode.nodeName)if("OL"===o.parentNode.parentNode.nodeName)m=v+++". "+m;else{var Q=a["font-size"],F=(3-.75*Q)*r.pdf.internal.scaleFactor,U=.75*Q*r.pdf.internal.scaleFactor,N=1.74*Q/r.pdf.internal.scaleFactor;d=function(t,A){this.pdf.circle(t+F,A+U,N,"FD")}}16&o.ownerDocument.body.compareDocumentPosition(o)&&r.addText(m,a)}else"string"==typeof o&&r.addText(o,a);else{var E;if("IMG"===o.nodeName){var b=o.getAttribute("src");E=g[r.pdf.sHashCode(b)||b]}if(E){r.pdf.internal.pageSize.getHeight()-r.pdf.margins_doc.bottom<r.y+o.height&&r.y>r.pdf.margins_doc.top&&(r.pdf.addPage(),r.y=r.pdf.margins_doc.top,r.executeWatchFunctions(o));var L=u(o),H=r.x,x=12/r.pdf.internal.scaleFactor,S=(L["margin-left"]+L["padding-left"])*x,I=(L["margin-right"]+L["padding-right"])*x,_=(L["margin-top"]+L["padding-top"])*x,T=(L["margin-bottom"]+L["padding-bottom"])*x;void 0!==L.float&&"right"===L.float?H+=r.settings.width-o.width-I:H+=S,r.pdf.addImage(E,H,r.y+_,o.width,o.height),E=void 0,"right"===L.float||"left"===L.float?(r.watchFunctions.push(function(t,A,e,n){return r.y>=A?(r.x+=t,r.settings.width+=e,!0):!!(n&&1===n.nodeType&&!y[n.nodeName]&&r.x+n.width>r.pdf.margins_doc.left+r.pdf.margins_doc.width)&&(r.x+=t,r.y=A,r.settings.width+=e,!0)}.bind(this,"left"===L.float?-o.width-S-I:0,r.y+o.height+_+T,o.width)),r.watchFunctions.push(function(t,A,e){return!(r.y<t&&A===r.pdf.internal.getNumberOfPages())||1===e.nodeType&&"both"===u(e).clear&&(r.y=t,!0)}.bind(this,r.y+o.height,r.pdf.internal.getNumberOfPages())),r.settings.width-=o.width+S+I,"left"===L.float&&(r.x+=o.width+S+I)):r.y+=o.height+_+T}else if("TABLE"===o.nodeName)f=C(o,r),r.y+=10,r.pdf.table(r.x,r.y,f.rows,f.headers,{autoSize:!1,printHeaders:i.printHeaders,margins:r.pdf.margins_doc,css:u(o)}),r.y=r.pdf.lastCellPos.y+r.pdf.lastCellPos.h+20;else if("OL"===o.nodeName||"UL"===o.nodeName)v=1,B(o,r,i)||e(o,r,i),r.y+=10;else if("LI"===o.nodeName){var R=r.x;r.x+=20/r.pdf.internal.scaleFactor,r.y+=3,B(o,r,i)||e(o,r,i),r.x=R}else"BR"===o.nodeName?(r.y+=a["font-size"]*r.pdf.internal.scaleFactor,r.addText("\u2028",A(a))):B(o,r,i)||e(o,r,i)}}c++}if(i.outY=r.y,l)return r.setBlockBoundary(d)},g={},w=function(t,A,e,r){var n,i=t.getElementsByTagName("img"),o=i.length,s=0;function a(){A.pdf.internal.events.publish("imagesLoaded"),r(n)}function c(t,e,r){if(t){var i=new Image;n=++s,i.crossOrigin="",i.onerror=i.onload=function(){if(i.complete&&(0===i.src.indexOf("data:image/")&&(i.width=e||i.width||0,i.height=r||i.height||0),i.width+i.height)){var n=A.pdf.sHashCode(t)||t;g[n]=g[n]||i}--s||a()},i.src=t}}for(;o--;)c(i[o].getAttribute("src"),i[o].width,i[o].height);return s||a()},m=function(t,A,r){var n=t.getElementsByTagName("footer");if(0<n.length){n=n[0];var i=A.pdf.internal.write,o=A.y;A.pdf.internal.write=function(){},e(n,A,r);var s=Math.ceil(A.y-o)+5;A.y=o,A.pdf.internal.write=i,A.pdf.margins_doc.bottom+=s;for(var a=function(t){var i=void 0!==t?t.pageNumber:1,o=A.y;A.y=A.pdf.internal.pageSize.getHeight()-A.pdf.margins_doc.bottom,A.pdf.margins_doc.bottom-=s;for(var a=n.getElementsByTagName("span"),c=0;c<a.length;++c)-1<(" "+a[c].className+" ").replace(/[\n\t]/g," ").indexOf(" pageCounter ")&&(a[c].innerHTML=i),-1<(" "+a[c].className+" ").replace(/[\n\t]/g," ").indexOf(" totalPages ")&&(a[c].innerHTML="###jsPDFVarTotalPages###");e(n,A,r),A.pdf.margins_doc.bottom+=s,A.y=o},c=n.getElementsByTagName("span"),u=0;u<c.length;++u)-1<(" "+c[u].className+" ").replace(/[\n\t]/g," ").indexOf(" totalPages ")&&A.pdf.internal.events.subscribe("htmlRenderingFinished",A.pdf.putTotalPages.bind(A.pdf,"###jsPDFVarTotalPages###"),!0);A.pdf.internal.events.subscribe("addPage",a,!1),a(),y.FOOTER=1}},Q=function(t,A,r,n,i,o){if(!A)return!1;var s,a,c,u;"string"==typeof A||A.parentNode||(A=""+A.innerHTML),"string"==typeof A&&(s=A.replace(/<\/?script[^>]*?>/gi,""),u="jsPDFhtmlText"+Date.now().toString()+(1e3*Math.random()).toFixed(0),(c=document.createElement("div")).style.cssText="position: absolute !important;clip: rect(1px 1px 1px 1px); /* IE6, IE7 */clip: rect(1px, 1px, 1px, 1px);padding:0 !important;border:0 !important;height: 1px !important;width: 1px !important; top:auto;left:-100px;overflow: hidden;",c.innerHTML='<iframe style="height:1px;width:1px" name="'+u+'" />',document.body.appendChild(c),(a=window.frames[u]).document.open(),a.document.writeln(s),a.document.close(),A=a.document.body);var l,f=new h(t,r,n,i);return w.call(this,A,f,i.elementHandlers,(function(t){m(A,f,i.elementHandlers),e(A,f,i.elementHandlers),f.pdf.internal.events.publish("htmlRenderingFinished"),l=f.dispose(),"function"==typeof o?o(l):t&&console.error("jsPDF Warning: rendering issues? provide a callback to fromHTML!")})),l||{x:f.x,y:f.y}},(h=function(t,A,e,r){return this.pdf=t,this.x=A,this.y=e,this.settings=r,this.watchFunctions=[],this.init(),this}).prototype.init=function(){return this.paragraph={text:[],style:[]},this.pdf.internal.write("q")},h.prototype.dispose=function(){return this.pdf.internal.write("Q"),{x:this.x,y:this.y,ready:!0}},h.prototype.executeWatchFunctions=function(t){var A=!1,e=[];if(0<this.watchFunctions.length){for(var r=0;r<this.watchFunctions.length;++r)!0===this.watchFunctions[r](t)?A=!0:e.push(this.watchFunctions[r]);this.watchFunctions=e}return A},h.prototype.splitFragmentsIntoLines=function(t,e){var r,n,i,o,s,a,c,u,l,h,f,d,p,B;for(h=this.pdf.internal.scaleFactor,o={},a=c=u=B=s=i=l=n=void 0,d=[f=[]],r=0,p=this.settings.width;t.length;)if(s=t.shift(),B=e.shift(),s)if((i=o[(n=B["font-family"])+(l=B["font-style"])])||(i=this.pdf.internal.getFont(n,l).metadata.Unicode,o[n+l]=i),u={widths:i.widths,kerning:i.kerning,fontSize:12*B["font-size"],textIndent:r},c=this.pdf.getStringUnitWidth(s,u)*u.fontSize/h,"\u2028"==s)f=[],d.push(f);else if(p<r+c){for(a=this.pdf.splitTextToSize(s,p,u),f.push([a.shift(),B]);a.length;)f=[[a.shift(),B]],d.push(f);r=this.pdf.getStringUnitWidth(f[0][0],u)*u.fontSize/h}else f.push([s,B]),r+=c;if(void 0!==B["text-align"]&&("center"===B["text-align"]||"right"===B["text-align"]||"justify"===B["text-align"]))for(var g=0;g<d.length;++g){var w=this.pdf.getStringUnitWidth(d[g][0][0],u)*u.fontSize/h;0<g&&(d[g][0][1]=A(d[g][0][1]));var m=p-w;if("right"===B["text-align"])d[g][0][1]["margin-left"]=m;else if("center"===B["text-align"])d[g][0][1]["margin-left"]=m/2;else if("justify"===B["text-align"]){var Q=d[g][0][0].split(" ").length-1;d[g][0][1]["word-spacing"]=m/Q,g===d.length-1&&(d[g][0][1]["word-spacing"]=0)}}return d},h.prototype.RenderTextFragment=function(t,A){var e,r;r=0,this.pdf.internal.pageSize.getHeight()-this.pdf.margins_doc.bottom<this.y+this.pdf.internal.getFontSize()&&(this.pdf.internal.write("ET","Q"),this.pdf.addPage(),this.y=this.pdf.margins_doc.top,this.pdf.internal.write("q","BT",this.getPdfColor(A.color),this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td"),r=Math.max(r,A["line-height"],A["font-size"]),this.pdf.internal.write(0,(-12*r).toFixed(2),"Td")),e=this.pdf.internal.getFont(A["font-family"],A["font-style"]);var n=this.getPdfColor(A.color);n!==this.lastTextColor&&(this.pdf.internal.write(n),this.lastTextColor=n),void 0!==A["word-spacing"]&&0<A["word-spacing"]&&this.pdf.internal.write(A["word-spacing"].toFixed(2),"Tw"),this.pdf.internal.write("/"+e.id,(12*A["font-size"]).toFixed(2),"Tf","("+this.pdf.internal.pdfEscape(t)+") Tj"),void 0!==A["word-spacing"]&&this.pdf.internal.write(0,"Tw")},h.prototype.getPdfColor=function(t){var A,e,r,n=/rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/.exec(t);if(null!=n)A=parseInt(n[1]),e=parseInt(n[2]),r=parseInt(n[3]);else{if("string"==typeof t&&"#"!=t.charAt(0)){var i=new RGBColor(t);t=i.ok?i.toHex():"#000000"}A=t.substring(1,3),A=parseInt(A,16),e=t.substring(3,5),e=parseInt(e,16),r=t.substring(5,7),r=parseInt(r,16)}if("string"==typeof A&&/^#[0-9A-Fa-f]{6}$/.test(A)){var o=parseInt(A.substr(1),16);A=o>>16&255,e=o>>8&255,r=255&o}var s=this.f3;return 0===A&&0===e&&0===r||void 0===e?s(A/255)+" g":[s(A/255),s(e/255),s(r/255),"rg"].join(" ")},h.prototype.f3=function(t){return t.toFixed(3)},h.prototype.renderParagraph=function(t){var A,e,r,n,i,o,s,a,c,u,h,f,d;if(r=l(this.paragraph.text),f=this.paragraph.style,A=this.paragraph.blockstyle,this.paragraph.priorblockstyle,this.paragraph={text:[],style:[],blockstyle:{},priorblockstyle:A},r.join("").trim()){s=this.splitFragmentsIntoLines(r,f),a=o=void 0,e=12/this.pdf.internal.scaleFactor,this.priorMarginBottom=this.priorMarginBottom||0,h=(Math.max((A["margin-top"]||0)-this.priorMarginBottom,0)+(A["padding-top"]||0))*e,u=((A["margin-bottom"]||0)+(A["padding-bottom"]||0))*e,this.priorMarginBottom=A["margin-bottom"]||0,"always"===A["page-break-before"]&&(this.pdf.addPage(),this.y=0,h=((A["margin-top"]||0)+(A["padding-top"]||0))*e),c=this.pdf.internal.write,i=n=void 0,this.y+=h,c("q","BT 0 g",this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td");for(var p=0;s.length;){for(n=a=0,i=(o=s.shift()).length;n!==i;)o[n][0].trim()&&(a=Math.max(a,o[n][1]["line-height"],o[n][1]["font-size"]),d=7*o[n][1]["font-size"]),n++;var B=0,g=0;for(void 0!==o[0][1]["margin-left"]&&0<o[0][1]["margin-left"]&&(B=(g=this.pdf.internal.getCoordinateString(o[0][1]["margin-left"]))-p,p=g),c(B+Math.max(A["margin-left"]||0,0)*e,(-12*a).toFixed(2),"Td"),n=0,i=o.length;n!==i;)o[n][0]&&this.RenderTextFragment(o[n][0],o[n][1]),n++;if(this.y+=a*e,this.executeWatchFunctions(o[0][1])&&0<s.length){var w=[],m=[];s.forEach((function(t){for(var A=0,e=t.length;A!==e;)t[A][0]&&(w.push(t[A][0]+" "),m.push(t[A][1])),++A})),s=this.splitFragmentsIntoLines(l(w),m),c("ET","Q"),c("q","BT 0 g",this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td")}}return t&&"function"==typeof t&&t.call(this,this.x-9,this.y-d/2),c("ET","Q"),this.y+=u}},h.prototype.setBlockBoundary=function(t){return this.renderParagraph(t)},h.prototype.setBlockStyle=function(t){return this.paragraph.blockstyle=t},h.prototype.addText=function(t,A){return this.paragraph.text.push(t),this.paragraph.style.push(A)},r={helvetica:"helvetica","sans-serif":"helvetica","times new roman":"times",serif:"times",times:"times",monospace:"courier",courier:"courier"},s={100:"normal",200:"normal",300:"normal",400:"normal",500:"bold",600:"bold",700:"bold",800:"bold",900:"bold",normal:"normal",bold:"bold",bolder:"bold",lighter:"normal"},i={normal:"normal",italic:"italic",oblique:"italic"},o={left:"left",right:"right",center:"center",justify:"justify"},a={none:"none",right:"right",left:"left"},c={none:"none",both:"both"},p={normal:1},t.fromHTML=function(t,A,e,r,n,i){return this.margins_doc=i||{top:0,bottom:0},r||(r={}),r.elementHandlers||(r.elementHandlers={}),Q(this,t,isNaN(A)?4:A,isNaN(e)?4:e,r,n)}}(dt.API),dt.API,("undefined"!=typeof window&&window||void 0!==r&&r).html2pdf=function(t,A,e){var r=A.canvas;if(r){var n,i;if((r.pdf=A).annotations={_nameMap:[],createAnnotation:function(t,e){var r,n=A.context2d._wrapX(e.left),i=A.context2d._wrapY(e.top),o=(A.context2d._page(e.top),t.indexOf("#"));r=0<=o?{name:t.substring(o+1)}:{url:t},A.link(n,i,e.right-e.left,e.bottom-e.top,r)},setName:function(t,e){var r=A.context2d._wrapX(e.left),n=A.context2d._wrapY(e.top),i=A.context2d._page(e.top);this._nameMap[t]={page:i,x:r,y:n}}},r.annotations=A.annotations,A.context2d._pageBreakAt=function(t){this.pageBreaks.push(t)},A.context2d._gotoPage=function(t){for(;A.internal.getNumberOfPages()<t;)A.addPage();A.setPage(t)},"string"==typeof t){t=t.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");var o,s,a=document.createElement("iframe");document.body.appendChild(a),null!=(o=a.contentDocument)&&null!=o||(o=a.contentWindow.document),o.open(),o.write(t),o.close(),n=o.body,s=o.body||{},t=o.documentElement||{},i=Math.max(s.scrollHeight,s.offsetHeight,t.clientHeight,t.scrollHeight,t.offsetHeight)}else s=(n=t).body||{},i=Math.max(s.scrollHeight,s.offsetHeight,t.clientHeight,t.scrollHeight,t.offsetHeight);var c={async:!0,allowTaint:!0,backgroundColor:"#ffffff",canvas:r,imageTimeout:15e3,logging:!0,proxy:null,removeContainer:!0,foreignObjectRendering:!1,useCORS:!1,windowHeight:i=A.internal.pageSize.getHeight(),scrollY:i};A.context2d.pageWrapYEnabled=!0,A.context2d.pageWrapY=A.internal.pageSize.getHeight(),html2canvas(n,c).then((function(t){e&&(a&&a.parentElement.removeChild(a),e(A))}))}else alert("jsPDF canvas plugin not installed")},window.tmp=html2pdf,function(t){var A=t.BlobBuilder||t.WebKitBlobBuilder||t.MSBlobBuilder||t.MozBlobBuilder;t.URL=t.URL||t.webkitURL||function(t,A){return(A=document.createElement("a")).href=t,A};var e=t.Blob,r=URL.createObjectURL,n=URL.revokeObjectURL,i=t.Symbol&&t.Symbol.toStringTag,o=!1,s=!1,a=!!t.ArrayBuffer,c=A&&A.prototype.append&&A.prototype.getBlob;try{o=2===new Blob(["ä"]).size,s=2===new Blob([new Uint8Array([1,2])]).size}catch(o){}function u(t){return t.map((function(t){if(t.buffer instanceof ArrayBuffer){var A=t.buffer;if(t.byteLength!==A.byteLength){var e=new Uint8Array(t.byteLength);e.set(new Uint8Array(A,t.byteOffset,t.byteLength)),A=e.buffer}return A}return t}))}function l(t,e){e=e||{};var r=new A;return u(t).forEach((function(t){r.append(t)})),e.type?r.getBlob(e.type):r.getBlob()}function h(t,A){return new e(u(t),A||{})}if(t.Blob&&(l.prototype=Blob.prototype,h.prototype=Blob.prototype),i)try{File.prototype[i]="File",Blob.prototype[i]="Blob",FileReader.prototype[i]="FileReader"}catch(o){}function f(){var A=!!t.ActiveXObject||"-ms-scroll-limit"in document.documentElement.style&&"-ms-ime-align"in document.documentElement.style,e=t.XMLHttpRequest&&t.XMLHttpRequest.prototype.send;A&&e&&(XMLHttpRequest.prototype.send=function(t){t instanceof Blob&&this.setRequestHeader("Content-Type",t.type),e.call(this,t)});try{new File([],"")}catch(A){try{var r=new Function('class File extends Blob {constructor(chunks, name, opts) {opts = opts || {};super(chunks, opts || {});this.name = name;this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date;this.lastModified = +this.lastModifiedDate;}};return new File([], ""), File')();t.File=r}catch(A){r=function(t,A,e){var r=new Blob(t,e),n=e&&void 0!==e.lastModified?new Date(e.lastModified):new Date;return r.name=A,r.lastModifiedDate=n,r.lastModified=+n,r.toString=function(){return"[object File]"},i&&(r[i]="File"),r},t.File=r}}}o?(f(),t.Blob=s?t.Blob:h):c?(f(),t.Blob=l):function(){function A(t){for(var A=[],e=0;e<t.length;e++){var r=t.charCodeAt(e);r<128?A.push(r):r<2048?A.push(192|r>>6,128|63&r):r<55296||57344<=r?A.push(224|r>>12,128|r>>6&63,128|63&r):(e++,r=65536+((1023&r)<<10|1023&t.charCodeAt(e)),A.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|63&r))}return A}function e(t){var A,e,r,n,i,o;for(A="",r=t.length,e=0;e<r;)switch((n=t[e++])>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:A+=String.fromCharCode(n);break;case 12:case 13:i=t[e++],A+=String.fromCharCode((31&n)<<6|63&i);break;case 14:i=t[e++],o=t[e++],A+=String.fromCharCode((15&n)<<12|(63&i)<<6|(63&o)<<0)}return A}function i(t){for(var A=new Array(t.byteLength),e=new Uint8Array(t),r=A.length;r--;)A[r]=e[r];return A}function o(t){for(var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=[],r=0;r<t.length;r+=3){var n=t[r],i=r+1<t.length,o=i?t[r+1]:0,s=r+2<t.length,a=s?t[r+2]:0,c=n>>2,u=(3&n)<<4|o>>4,l=(15&o)<<2|a>>6,h=63&a;s||(h=64,i||(l=64)),e.push(A[c],A[u],A[l],A[h])}return e.join("")}var s=Object.create||function(t){function A(){}return A.prototype=t,new A};if(a)var c=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],u=ArrayBuffer.isView||function(t){return t&&-1<c.indexOf(Object.prototype.toString.call(t))};function l(t,e){for(var r=0,n=(t=t||[]).length;r<n;r++){var o=t[r];o instanceof l?t[r]=o._buffer:"string"==typeof o?t[r]=A(o):a&&(ArrayBuffer.prototype.isPrototypeOf(o)||u(o))?t[r]=i(o):a&&(s=o)&&DataView.prototype.isPrototypeOf(s)?t[r]=i(o.buffer):t[r]=A(String(o))}var s;this._buffer=[].concat.apply([],t),this.size=this._buffer.length,this.type=e&&e.type||""}function h(t,A,e){var r=l.call(this,t,e=e||{})||this;return r.name=A,r.lastModifiedDate=e.lastModified?new Date(e.lastModified):new Date,r.lastModified=+r.lastModifiedDate,r}if(l.prototype.slice=function(t,A,e){return new l([this._buffer.slice(t||0,A||this._buffer.length)],{type:e})},l.prototype.toString=function(){return"[object Blob]"},(h.prototype=s(l.prototype)).constructor=h,Object.setPrototypeOf)Object.setPrototypeOf(h,l);else try{h.__proto__=l}catch(s){}function f(){if(!(this instanceof f))throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");var t=document.createDocumentFragment();this.addEventListener=t.addEventListener,this.dispatchEvent=function(A){var e=this["on"+A.type];"function"==typeof e&&e(A),t.dispatchEvent(A)},this.removeEventListener=t.removeEventListener}function d(t,A,e){if(!(A instanceof l))throw new TypeError("Failed to execute '"+e+"' on 'FileReader': parameter 1 is not of type 'Blob'.");t.result="",setTimeout((function(){this.readyState=f.LOADING,t.dispatchEvent(new Event("load")),t.dispatchEvent(new Event("loadend"))}))}h.prototype.toString=function(){return"[object File]"},f.EMPTY=0,f.LOADING=1,f.DONE=2,f.prototype.error=null,f.prototype.onabort=null,f.prototype.onerror=null,f.prototype.onload=null,f.prototype.onloadend=null,f.prototype.onloadstart=null,f.prototype.onprogress=null,f.prototype.readAsDataURL=function(t){d(this,t,"readAsDataURL"),this.result="data:"+t.type+";base64,"+o(t._buffer)},f.prototype.readAsText=function(t){d(this,t,"readAsText"),this.result=e(t._buffer)},f.prototype.readAsArrayBuffer=function(t){d(this,t,"readAsText"),this.result=t._buffer.slice()},f.prototype.abort=function(){},URL.createObjectURL=function(t){return t instanceof l?"data:"+t.type+";base64,"+o(t._buffer):r.call(URL,t)},URL.revokeObjectURL=function(t){n&&n.call(URL,t)};var p=t.XMLHttpRequest&&t.XMLHttpRequest.prototype.send;p&&(XMLHttpRequest.prototype.send=function(t){t instanceof l?(this.setRequestHeader("Content-Type",t.type),p.call(this,e(t._buffer))):p.call(this,t)}),t.FileReader=f,t.File=h,t.Blob=l}()}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0!==r&&r||Function('return typeof this === "object" && this.content')()||Function("return this")());var pt,Bt,gt,wt,mt,Qt,Ct,yt,vt,Ft,Ut,Nt,Et,bt,Lt,Ht=Ht||function(t){if(!(void 0===t||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var A=t.document,e=function(){return t.URL||t.webkitURL||t},r=A.createElementNS("http://www.w3.org/1999/xhtml","a"),n="download"in r,i=/constructor/i.test(t.HTMLElement)||t.safari,o=/CriOS\/[\d]+/.test(navigator.userAgent),s=t.setImmediate||t.setTimeout,a=function(t){s((function(){throw t}),0)},c=function(t){setTimeout((function(){"string"==typeof t?e().revokeObjectURL(t):t.remove()}),4e4)},u=function(t){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t},l=function(A,l,h){h||(A=u(A));var f,d=this,p="application/octet-stream"===A.type,B=function(){!function(t,A,e){for(var r=(A=[].concat(A)).length;r--;){var n=t["on"+A[r]];if("function"==typeof n)try{n.call(t,t)}catch(t){a(t)}}}(d,"writestart progress write writeend".split(" "))};if(d.readyState=d.INIT,n)return f=e().createObjectURL(A),void s((function(){var t,A;r.href=f,r.download=l,t=r,A=new MouseEvent("click"),t.dispatchEvent(A),B(),c(f),d.readyState=d.DONE}),0);!function(){if((o||p&&i)&&t.FileReader){var r=new FileReader;return r.onloadend=function(){var A=o?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");t.open(A,"_blank")||(t.location.href=A),A=void 0,d.readyState=d.DONE,B()},r.readAsDataURL(A),d.readyState=d.INIT}f||(f=e().createObjectURL(A)),p?t.location.href=f:t.open(f,"_blank")||(t.location.href=f),d.readyState=d.DONE,B(),c(f)}()},h=l.prototype;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(t,A,e){return A=A||t.name||"download",e||(t=u(t)),navigator.msSaveOrOpenBlob(t,A)}:(h.abort=function(){},h.readyState=h.INIT=0,h.WRITING=1,h.DONE=2,h.error=h.onwritestart=h.onprogress=h.onwrite=h.onabort=h.onerror=h.onwriteend=null,function(t,A,e){return new l(t,A||t.name||"download",e)})}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0);function xt(t){var A=0;if(71!==t[A++]||73!==t[A++]||70!==t[A++]||56!==t[A++]||56!=(t[A++]+1&253)||97!==t[A++])throw"Invalid GIF 87a/89a header.";var e=t[A++]|t[A++]<<8,r=t[A++]|t[A++]<<8,n=t[A++],i=n>>7,o=1<<1+(7&n);t[A++],t[A++];var s=null;i&&(s=A,A+=3*o);var a=!0,c=[],u=0,l=null,h=0,f=null;for(this.width=e,this.height=r;a&&A<t.length;)switch(t[A++]){case 33:switch(t[A++]){case 255:if(11!==t[A]||78==t[A+1]&&69==t[A+2]&&84==t[A+3]&&83==t[A+4]&&67==t[A+5]&&65==t[A+6]&&80==t[A+7]&&69==t[A+8]&&50==t[A+9]&&46==t[A+10]&&48==t[A+11]&&3==t[A+12]&&1==t[A+13]&&0==t[A+16])A+=14,f=t[A++]|t[A++]<<8,A++;else for(A+=12;0!==(F=t[A++]);)A+=F;break;case 249:if(4!==t[A++]||0!==t[A+4])throw"Invalid graphics extension block.";var d=t[A++];u=t[A++]|t[A++]<<8,l=t[A++],0==(1&d)&&(l=null),h=d>>2&7,A++;break;case 254:for(;0!==(F=t[A++]);)A+=F;break;default:throw"Unknown graphic control label: 0x"+t[A-1].toString(16)}break;case 44:var p=t[A++]|t[A++]<<8,B=t[A++]|t[A++]<<8,g=t[A++]|t[A++]<<8,w=t[A++]|t[A++]<<8,m=t[A++],Q=m>>6&1,C=s,y=!1;m>>7&&(y=!0,C=A,A+=3*(1<<1+(7&m)));var v=A;for(A++;;){var F;if(0===(F=t[A++]))break;A+=F}c.push({x:p,y:B,width:g,height:w,has_local_palette:y,palette_offset:C,data_offset:v,data_length:A-v,transparent_index:l,interlaced:!!Q,delay:u,disposal:h});break;case 59:a=!1;break;default:throw"Unknown gif block: 0x"+t[A-1].toString(16)}this.numFrames=function(){return c.length},this.loopCount=function(){return f},this.frameInfo=function(t){if(t<0||t>=c.length)throw"Frame index out of range.";return c[t]},this.decodeAndBlitFrameBGRA=function(A,r){var n=this.frameInfo(A),i=n.width*n.height,o=new Uint8Array(i);St(t,n.data_offset,o,i);var s=n.palette_offset,a=n.transparent_index;null===a&&(a=256);var c=n.width,u=e-c,l=c,h=4*(n.y*e+n.x),f=4*((n.y+n.height)*e+n.x),d=h,p=4*u;!0===n.interlaced&&(p+=4*(c+u)*7);for(var B=8,g=0,w=o.length;g<w;++g){var m=o[g];if(0===l&&(l=c,f<=(d+=p)&&(p=u+4*(c+u)*(B-1),d=h+(c+u)*(B<<1),B>>=1)),m===a)d+=4;else{var Q=t[s+3*m],C=t[s+3*m+1],y=t[s+3*m+2];r[d++]=y,r[d++]=C,r[d++]=Q,r[d++]=255}--l}},this.decodeAndBlitFrameRGBA=function(A,r){var n=this.frameInfo(A),i=n.width*n.height,o=new Uint8Array(i);St(t,n.data_offset,o,i);var s=n.palette_offset,a=n.transparent_index;null===a&&(a=256);var c=n.width,u=e-c,l=c,h=4*(n.y*e+n.x),f=4*((n.y+n.height)*e+n.x),d=h,p=4*u;!0===n.interlaced&&(p+=4*(c+u)*7);for(var B=8,g=0,w=o.length;g<w;++g){var m=o[g];if(0===l&&(l=c,f<=(d+=p)&&(p=u+4*(c+u)*(B-1),d=h+(c+u)*(B<<1),B>>=1)),m===a)d+=4;else{var Q=t[s+3*m],C=t[s+3*m+1],y=t[s+3*m+2];r[d++]=Q,r[d++]=C,r[d++]=y,r[d++]=255}--l}}}function St(t,A,e,r){for(var n=t[A++],i=1<<n,o=i+1,s=o+1,a=n+1,c=(1<<a)-1,u=0,l=0,h=0,f=t[A++],d=new Int32Array(4096),p=null;;){for(;u<16&&0!==f;)l|=t[A++]<<u,u+=8,1===f?f=t[A++]:--f;if(u<a)break;var B=l&c;if(l>>=a,u-=a,B!==i){if(B===o)break;for(var g=B<s?B:p,w=0,m=g;i<m;)m=d[m]>>8,++w;var Q=m;if(r<h+w+(g!==B?1:0))return void console.log("Warning, gif stream longer than expected.");e[h++]=Q;var C=h+=w;for(g!==B&&(e[h++]=Q),m=g;w--;)m=d[m],e[--C]=255&m,m>>=8;null!==p&&s<4096&&(d[s++]=p<<8|Q,c+1<=s&&a<12&&(++a,c=c<<1|1)),p=B}else s=o+1,c=(1<<(a=n+1))-1,p=null}return h!==r&&console.log("Warning, gif stream shorter than expected."),e}try{A.GifWriter=function(t,A,e,r){var n=0,i=void 0===(r=void 0===r?{}:r).loop?null:r.loop,o=void 0===r.palette?null:r.palette;if(A<=0||e<=0||65535<A||65535<e)throw"Width/Height invalid.";function s(t){var A=t.length;if(A<2||256<A||A&A-1)throw"Invalid code/color length, must be power of 2 and 2 .. 256.";return A}t[n++]=71,t[n++]=73,t[n++]=70,t[n++]=56,t[n++]=57,t[n++]=97;var a=0,c=0;if(null!==o){for(var u=s(o);u>>=1;)++a;if(u=1<<a,--a,void 0!==r.background){if(u<=(c=r.background))throw"Background index out of range.";if(0===c)throw"Background index explicitly passed as 0."}}if(t[n++]=255&A,t[n++]=A>>8&255,t[n++]=255&e,t[n++]=e>>8&255,t[n++]=(null!==o?128:0)|a,t[n++]=c,t[n++]=0,null!==o)for(var l=0,h=o.length;l<h;++l){var f=o[l];t[n++]=f>>16&255,t[n++]=f>>8&255,t[n++]=255&f}if(null!==i){if(i<0||65535<i)throw"Loop count invalid.";t[n++]=33,t[n++]=255,t[n++]=11,t[n++]=78,t[n++]=69,t[n++]=84,t[n++]=83,t[n++]=67,t[n++]=65,t[n++]=80,t[n++]=69,t[n++]=50,t[n++]=46,t[n++]=48,t[n++]=3,t[n++]=1,t[n++]=255&i,t[n++]=i>>8&255,t[n++]=0}var d=!1;this.addFrame=function(A,e,r,i,a,c){if(!0===d&&(--n,d=!1),c=void 0===c?{}:c,A<0||e<0||65535<A||65535<e)throw"x/y invalid.";if(r<=0||i<=0||65535<r||65535<i)throw"Width/Height invalid.";if(a.length<r*i)throw"Not enough pixels for the frame size.";var u=!0,l=c.palette;if(null==l&&(u=!1,l=o),null==l)throw"Must supply either a local or global palette.";for(var h=s(l),f=0;h>>=1;)++f;h=1<<f;var p=void 0===c.delay?0:c.delay,B=void 0===c.disposal?0:c.disposal;if(B<0||3<B)throw"Disposal out of range.";var g=!1,w=0;if(void 0!==c.transparent&&null!==c.transparent&&(g=!0,(w=c.transparent)<0||h<=w))throw"Transparent color index.";if((0!==B||g||0!==p)&&(t[n++]=33,t[n++]=249,t[n++]=4,t[n++]=B<<2|(!0===g?1:0),t[n++]=255&p,t[n++]=p>>8&255,t[n++]=w,t[n++]=0),t[n++]=44,t[n++]=255&A,t[n++]=A>>8&255,t[n++]=255&e,t[n++]=e>>8&255,t[n++]=255&r,t[n++]=r>>8&255,t[n++]=255&i,t[n++]=i>>8&255,t[n++]=!0===u?128|f-1:0,!0===u)for(var m=0,Q=l.length;m<Q;++m){var C=l[m];t[n++]=C>>16&255,t[n++]=C>>8&255,t[n++]=255&C}n=function(t,A,e,r){t[A++]=e;var n=A++,i=1<<e,o=i-1,s=i+1,a=s+1,c=e+1,u=0,l=0;function h(e){for(;e<=u;)t[A++]=255&l,l>>=8,u-=8,A===n+256&&(t[n]=255,n=A++)}function f(t){l|=t<<u,u+=c,h(8)}var d=r[0]&o,p={};f(i);for(var B=1,g=r.length;B<g;++B){var w=r[B]&o,m=d<<8|w,Q=p[m];if(void 0===Q){for(l|=d<<u,u+=c;8<=u;)t[A++]=255&l,l>>=8,u-=8,A===n+256&&(t[n]=255,n=A++);4096===a?(f(i),a=s+1,c=e+1,p={}):(1<<c<=a&&++c,p[m]=a++),d=w}else d=Q}return f(d),f(s),h(1),n+1===A?t[n]=0:(t[n]=A-n-1,t[A++]=0),A}(t,n,f<2?2:f,a)},this.end=function(){return!1===d&&(t[n++]=59,d=!0),n}},A.GifReader=xt}catch(o){}function It(t){var A,e,r,n,i,o=Math.floor,s=new Array(64),a=new Array(64),c=new Array(64),u=new Array(64),l=new Array(65535),h=new Array(65535),f=new Array(64),d=new Array(64),p=[],B=0,g=7,w=new Array(64),m=new Array(64),Q=new Array(64),C=new Array(256),y=new Array(2048),v=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],F=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],U=[0,1,2,3,4,5,6,7,8,9,10,11],N=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],E=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],b=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],L=[0,1,2,3,4,5,6,7,8,9,10,11],H=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],x=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];function S(t,A){for(var e=0,r=0,n=new Array,i=1;i<=16;i++){for(var o=1;o<=t[i];o++)n[A[r]]=[],n[A[r]][0]=e,n[A[r]][1]=i,r++,e++;e*=2}return n}function I(t){for(var A=t[0],e=t[1]-1;0<=e;)A&1<<e&&(B|=1<<g),e--,--g<0&&(255==B?(_(255),_(0)):_(B),g=7,B=0)}function _(t){p.push(t)}function T(t){_(t>>8&255),_(255&t)}function R(t,A,e,r,n){for(var i,o=n[0],s=n[240],a=function(t,A){var e,r,n,i,o,s,a,c,u,l,h=0;for(u=0;u<8;++u){e=t[h],r=t[h+1],n=t[h+2],i=t[h+3],o=t[h+4],s=t[h+5],a=t[h+6];var d=e+(c=t[h+7]),p=e-c,B=r+a,g=r-a,w=n+s,m=n-s,Q=i+o,C=i-o,y=d+Q,v=d-Q,F=B+w,U=B-w;t[h]=y+F,t[h+4]=y-F;var N=.707106781*(U+v);t[h+2]=v+N,t[h+6]=v-N;var E=.382683433*((y=C+m)-(U=g+p)),b=.5411961*y+E,L=1.306562965*U+E,H=.707106781*(F=m+g),x=p+H,S=p-H;t[h+5]=S+b,t[h+3]=S-b,t[h+1]=x+L,t[h+7]=x-L,h+=8}for(u=h=0;u<8;++u){e=t[h],r=t[h+8],n=t[h+16],i=t[h+24],o=t[h+32],s=t[h+40],a=t[h+48];var I=e+(c=t[h+56]),_=e-c,T=r+a,R=r-a,O=n+s,K=n-s,M=i+o,P=i-o,D=I+M,k=I-M,z=T+O,j=T-O;t[h]=D+z,t[h+32]=D-z;var q=.707106781*(j+k);t[h+16]=k+q,t[h+48]=k-q;var V=.382683433*((D=P+K)-(j=R+_)),X=.5411961*D+V,G=1.306562965*j+V,J=.707106781*(z=K+R),W=_+J,Y=_-J;t[h+40]=Y+X,t[h+24]=Y-X,t[h+8]=W+G,t[h+56]=W-G,h++}for(u=0;u<64;++u)l=t[u]*A[u],f[u]=0<l?l+.5|0:l-.5|0;return f}(t,A),c=0;c<64;++c)d[v[c]]=a[c];var u=d[0]-e;e=d[0],0==u?I(r[0]):(I(r[h[i=32767+u]]),I(l[i]));for(var p=63;0<p&&0==d[p];p--);if(0==p)return I(o),e;for(var B,g=1;g<=p;){for(var w=g;0==d[g]&&g<=p;++g);var m=g-w;if(16<=m){B=m>>4;for(var Q=1;Q<=B;++Q)I(s);m&=15}i=32767+d[g],I(n[(m<<4)+h[i]]),I(l[i]),g++}return 63!=p&&I(o),e}function O(t){t<=0&&(t=1),100<t&&(t=100),i!=t&&(function(t){for(var A=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],e=0;e<64;e++){var r=o((A[e]*t+50)/100);r<1?r=1:255<r&&(r=255),s[v[e]]=r}for(var n=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],i=0;i<64;i++){var l=o((n[i]*t+50)/100);l<1?l=1:255<l&&(l=255),a[v[i]]=l}for(var h=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],f=0,d=0;d<8;d++)for(var p=0;p<8;p++)c[f]=1/(s[v[f]]*h[d]*h[p]*8),u[f]=1/(a[v[f]]*h[d]*h[p]*8),f++}(t<50?Math.floor(5e3/t):Math.floor(200-2*t)),i=t)}this.encode=function(t,i){var o,l;(new Date).getTime(),i&&O(i),p=new Array,B=0,g=7,T(65496),T(65504),T(16),_(74),_(70),_(73),_(70),_(0),_(1),_(1),_(0),T(1),T(1),_(0),_(0),function(){T(65499),T(132),_(0);for(var t=0;t<64;t++)_(s[t]);_(1);for(var A=0;A<64;A++)_(a[A])}(),o=t.width,l=t.height,T(65472),T(17),_(8),T(l),T(o),_(3),_(1),_(17),_(0),_(2),_(17),_(1),_(3),_(17),_(1),function(){T(65476),T(418),_(0);for(var t=0;t<16;t++)_(F[t+1]);for(var A=0;A<=11;A++)_(U[A]);_(16);for(var e=0;e<16;e++)_(N[e+1]);for(var r=0;r<=161;r++)_(E[r]);_(1);for(var n=0;n<16;n++)_(b[n+1]);for(var i=0;i<=11;i++)_(L[i]);_(17);for(var o=0;o<16;o++)_(H[o+1]);for(var s=0;s<=161;s++)_(x[s])}(),T(65498),T(12),_(3),_(1),_(0),_(2),_(17),_(3),_(17),_(0),_(63),_(0);var h=0,f=0,d=0;B=0,g=7,this.encode.displayName="_encode_";for(var C,v,S,K,M,P,D,k,z,j=t.data,q=t.width,V=t.height,X=4*q,G=0;G<V;){for(C=0;C<X;){for(P=M=X*G+C,D=-1,z=k=0;z<64;z++)P=M+(k=z>>3)*X+(D=4*(7&z)),V<=G+k&&(P-=X*(G+1+k-V)),X<=C+D&&(P-=C+D-X+4),v=j[P++],S=j[P++],K=j[P++],w[z]=(y[v]+y[S+256>>0]+y[K+512>>0]>>16)-128,m[z]=(y[v+768>>0]+y[S+1024>>0]+y[K+1280>>0]>>16)-128,Q[z]=(y[v+1280>>0]+y[S+1536>>0]+y[K+1792>>0]>>16)-128;h=R(w,c,h,A,r),f=R(m,u,f,e,n),d=R(Q,u,d,e,n),C+=32}G+=8}if(0<=g){var J=[];J[1]=g+1,J[0]=(1<<g+1)-1,I(J)}return T(65497),new Uint8Array(p)},(new Date).getTime(),t||(t=50),function(){for(var t=String.fromCharCode,A=0;A<256;A++)C[A]=t(A)}(),A=S(F,U),e=S(b,L),r=S(N,E),n=S(H,x),function(){for(var t=1,A=2,e=1;e<=15;e++){for(var r=t;r<A;r++)h[32767+r]=e,l[32767+r]=[],l[32767+r][1]=e,l[32767+r][0]=r;for(var n=-(A-1);n<=-t;n++)h[32767+n]=e,l[32767+n]=[],l[32767+n][1]=e,l[32767+n][0]=A-1+n;t<<=1,A<<=1}}(),function(){for(var t=0;t<256;t++)y[t]=19595*t,y[t+256>>0]=38470*t,y[t+512>>0]=7471*t+32768,y[t+768>>0]=-11059*t,y[t+1024>>0]=-21709*t,y[t+1280>>0]=32768*t+8421375,y[t+1536>>0]=-27439*t,y[t+1792>>0]=-5329*t}(),O(t),(new Date).getTime()}function _t(t,A){if(this.pos=0,this.buffer=t,this.datav=new DataView(t.buffer),this.is_with_alpha=!!A,this.bottom_up=!0,this.flag=String.fromCharCode(this.buffer[0])+String.fromCharCode(this.buffer[1]),this.pos+=2,-1===["BM","BA","CI","CP","IC","PT"].indexOf(this.flag))throw new Error("Invalid BMP File");this.parseHeader(),this.parseBGR()}window.tmp=xt,dt.API.adler32cs=(Qt="function"==typeof ArrayBuffer&&"function"==typeof Uint8Array,Ct=null,yt=function(){if(!Qt)return function(){return!1};try{var t={};"function"==typeof t.Buffer&&(Ct=t.Buffer)}catch(t){}return function(t){return t instanceof ArrayBuffer||null!==Ct&&t instanceof Ct}}(),vt=null!==Ct?function(t){return new Ct(t,"utf8").toString("binary")}:function(t){return unescape(encodeURIComponent(t))},Ft=function(t,A){for(var e=65535&t,r=t>>>16,n=0,i=A.length;n<i;n++)r=(r+(e=(e+(255&A.charCodeAt(n)))%65521))%65521;return(r<<16|e)>>>0},Ut=function(t,A){for(var e=65535&t,r=t>>>16,n=0,i=A.length;n<i;n++)r=(r+(e=(e+A[n])%65521))%65521;return(r<<16|e)>>>0},Et=(Nt={}).Adler32=(((mt=(wt=function(t){if(!(this instanceof wt))throw new TypeError("Constructor cannot called be as a function.");if(!isFinite(t=null==t?1:+t))throw new Error("First arguments needs to be a finite number.");this.checksum=t>>>0}).prototype={}).constructor=wt).from=((pt=function(t){if(!(this instanceof wt))throw new TypeError("Constructor cannot called be as a function.");if(null==t)throw new Error("First argument needs to be a string.");this.checksum=Ft(1,t.toString())}).prototype=mt,pt),wt.fromUtf8=((Bt=function(t){if(!(this instanceof wt))throw new TypeError("Constructor cannot called be as a function.");if(null==t)throw new Error("First argument needs to be a string.");var A=vt(t.toString());this.checksum=Ft(1,A)}).prototype=mt,Bt),Qt&&(wt.fromBuffer=((gt=function(t){if(!(this instanceof wt))throw new TypeError("Constructor cannot called be as a function.");if(!yt(t))throw new Error("First argument needs to be ArrayBuffer.");var A=new Uint8Array(t);return this.checksum=Ut(1,A)}).prototype=mt,gt)),mt.update=function(t){if(null==t)throw new Error("First argument needs to be a string.");return t=t.toString(),this.checksum=Ft(this.checksum,t)},mt.updateUtf8=function(t){if(null==t)throw new Error("First argument needs to be a string.");var A=vt(t.toString());return this.checksum=Ft(this.checksum,A)},Qt&&(mt.updateBuffer=function(t){if(!yt(t))throw new Error("First argument needs to be ArrayBuffer.");var A=new Uint8Array(t);return this.checksum=Ut(this.checksum,A)}),mt.clone=function(){return new Et(this.checksum)},wt),Nt.from=function(t){if(null==t)throw new Error("First argument needs to be a string.");return Ft(1,t.toString())},Nt.fromUtf8=function(t){if(null==t)throw new Error("First argument needs to be a string.");var A=vt(t.toString());return Ft(1,A)},Qt&&(Nt.fromBuffer=function(t){if(!yt(t))throw new Error("First argument need to be ArrayBuffer.");var A=new Uint8Array(t);return Ut(1,A)}),Nt),function(t){t.__bidiEngine__=t.prototype.__bidiEngine__=function(t){var e,r,n,i,o,s,a,c=A,u=[[0,3,0,1,0,0,0],[0,3,0,1,2,2,0],[0,3,0,17,2,0,1],[0,3,5,5,4,1,0],[0,3,21,21,4,0,1],[0,3,5,5,4,2,0]],l=[[2,0,1,1,0,1,0],[2,0,1,1,0,2,0],[2,0,2,1,3,2,0],[2,0,2,33,3,1,1]],h={L:0,R:1,EN:2,AN:3,N:4,B:5,S:6},f={0:0,5:1,6:2,7:3,32:4,251:5,254:6,255:7},d=["(",")","(","<",">","<","[","]","[","{","}","{","«","»","«","‹","›","‹","⁅","⁆","⁅","⁽","⁾","⁽","₍","₎","₍","≤","≥","≤","〈","〉","〈","﹙","﹚","﹙","﹛","﹜","﹛","﹝","﹞","﹝","﹤","﹥","﹤"],p=new RegExp(/^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/),B=!1,g=0;this.__bidiEngine__={};var w=function(t){var A=t.charCodeAt(),e=A>>8,r=f[e];return void 0!==r?c[256*r+(255&A)]:252===e||253===e?"AL":p.test(e)?"L":8===e?"R":"N"},m=function(t){for(var A,e=0;e<t.length;e++){if("L"===(A=w(t.charAt(e))))return!1;if("R"===A)return!0}return!1},Q=function(t,A,o,s){var a,c,u,l,h=A[s];switch(h){case"L":case"R":B=!1;break;case"N":case"AN":break;case"EN":B&&(h="AN");break;case"AL":B=!0,h="R";break;case"WS":h="N";break;case"CS":s<1||s+1>=A.length||"EN"!==(a=o[s-1])&&"AN"!==a||"EN"!==(c=A[s+1])&&"AN"!==c?h="N":B&&(c="AN"),h=c===a?c:"N";break;case"ES":h="EN"===(a=0<s?o[s-1]:"B")&&s+1<A.length&&"EN"===A[s+1]?"EN":"N";break;case"ET":if(0<s&&"EN"===o[s-1]){h="EN";break}if(B){h="N";break}for(u=s+1,l=A.length;u<l&&"ET"===A[u];)u++;h=u<l&&"EN"===A[u]?"EN":"N";break;case"NSM":if(n&&!i){for(l=A.length,u=s+1;u<l&&"NSM"===A[u];)u++;if(u<l){var f=t[s],d=1425<=f&&f<=2303||64286===f;if(a=A[u],d&&("R"===a||"AL"===a)){h="R";break}}}h=s<1||"B"===(a=A[s-1])?"N":o[s-1];break;case"B":e=!(B=!1),h=g;break;case"S":r=!0,h="N";break;case"LRE":case"RLE":case"LRO":case"RLO":case"PDF":B=!1;break;case"BN":h="N"}return h},C=function(t,A,e){var r=t.split("");return e&&y(r,e,{hiLevel:g}),r.reverse(),A&&A.reverse(),r.join("")},y=function(t,A,n){var i,o,s,a,c,f=-1,d=t.length,p=0,m=[],C=g?l:u,y=[];for(r=e=B=!1,o=0;o<d;o++)y[o]=w(t[o]);for(s=0;s<d;s++){if(c=p,m[s]=Q(t,y,m,s),i=240&(p=C[c][h[m[s]]]),p&=15,A[s]=a=C[p][5],0<i)if(16===i){for(o=f;o<s;o++)A[o]=1;f=-1}else f=-1;if(C[p][6])-1===f&&(f=s);else if(-1<f){for(o=f;o<s;o++)A[o]=a;f=-1}"B"===y[s]&&(A[s]=0),n.hiLevel|=a}r&&function(t,A,e){for(var r=0;r<e;r++)if("S"===t[r]){A[r]=g;for(var n=r-1;0<=n&&"WS"===t[n];n--)A[n]=g}}(y,A,d)},v=function(t,A,r,n,i){if(!(i.hiLevel<t)){if(1===t&&1===g&&!e)return A.reverse(),void(r&&r.reverse());for(var o,s,a,c,u=A.length,l=0;l<u;){if(n[l]>=t){for(a=l+1;a<u&&n[a]>=t;)a++;for(c=l,s=a-1;c<s;c++,s--)o=A[c],A[c]=A[s],A[s]=o,r&&(o=r[c],r[c]=r[s],r[s]=o);l=a}l++}}},F=function(t,A,e){var r=t.split(""),n={hiLevel:g};return e||(e=[]),y(r,e,n),function(t,A,e){if(0!==e.hiLevel&&a)for(var r,n=0;n<t.length;n++)1===A[n]&&0<=(r=d.indexOf(t[n]))&&(t[n]=d[r+1])}(r,e,n),v(2,r,A,e,n),v(1,r,A,e,n),r.join("")};return this.__bidiEngine__.doBidiReorder=function(t,A,e){if(function(t,A){if(A)for(var e=0;e<t.length;e++)A[e]=e;void 0===i&&(i=m(t)),void 0===s&&(s=m(t))}(t,A),n||!o||s)if(n&&o&&i^s)g=i?1:0,t=C(t,A,e);else if(!n&&o&&s)g=i?1:0,t=F(t,A,e),t=C(t,A);else if(!n||i||o||s){if(n&&!o&&i^s)t=C(t,A),t=i?(g=0,F(t,A,e)):(g=1,t=F(t,A,e),C(t,A));else if(n&&i&&!o&&s)g=1,t=F(t,A,e),t=C(t,A);else if(!n&&!o&&i^s){var r=a;i?(g=1,t=F(t,A,e),g=0,a=!1,t=F(t,A,e),a=r):(g=0,t=F(t,A,e),t=C(t,A),a=!(g=1),t=F(t,A,e),a=r,t=C(t,A))}}else g=0,t=F(t,A,e);else g=i?1:0,t=F(t,A,e);return t},this.__bidiEngine__.setOptions=function(t){t&&(n=t.isInputVisual,o=t.isOutputVisual,i=t.isInputRtl,s=t.isOutputRtl,a=t.isSymmetricSwapping)},this.__bidiEngine__.setOptions(t),this.__bidiEngine__};var A=["BN","BN","BN","BN","BN","BN","BN","BN","BN","S","B","S","WS","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","B","B","B","S","WS","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","BN","BN","BN","BN","BN","BN","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","CS","N","ET","ET","ET","ET","N","N","N","N","L","N","N","BN","N","N","ET","ET","EN","EN","N","L","N","N","N","EN","L","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","N","N","N","N","N","ET","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","NSM","R","NSM","NSM","R","NSM","NSM","R","NSM","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","N","N","N","N","N","R","R","R","R","R","N","N","N","N","N","N","N","N","N","N","N","AN","AN","AN","AN","AN","AN","N","N","AL","ET","ET","AL","CS","AL","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","AN","AN","AN","AN","AN","AN","AN","AN","AN","ET","AN","AN","AL","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","N","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","NSM","NSM","N","NSM","NSM","NSM","NSM","AL","AL","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","R","N","N","N","N","R","N","N","N","N","N","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","BN","BN","BN","L","R","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","B","LRE","RLE","PDF","LRO","RLO","CS","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","BN","BN","BN","BN","BN","N","LRI","RLI","FSI","PDI","BN","BN","BN","BN","BN","BN","EN","L","N","N","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","L","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","N","N","N","N","N","R","NSM","R","R","R","R","R","R","R","R","R","R","ES","R","R","R","R","R","R","R","R","R","R","R","R","R","N","R","R","R","R","R","N","R","N","R","R","N","R","R","N","R","R","R","R","R","R","R","R","R","R","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","CS","N","N","CS","N","N","N","N","N","N","N","N","N","ET","N","N","ES","ES","N","N","N","N","N","ET","ET","N","N","N","N","N","AL","AL","AL","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","BN","N","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","N","N","N","ET","ET","N","N","N","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N"],e=new t.__bidiEngine__({isInputVisual:!0});t.API.events.push(["postProcessText",function(t){var A=t.text,r=(t.x,t.y,t.options||{}),n=(t.mutex,r.lang,[]);if("[object Array]"===Object.prototype.toString.call(A)){var i=0;for(n=[],i=0;i<A.length;i+=1)"[object Array]"===Object.prototype.toString.call(A[i])?n.push([e.doBidiReorder(A[i][0]),A[i][1],A[i][2]]):n.push([e.doBidiReorder(A[i])]);t.text=n}else t.text=e.doBidiReorder(A)}])}(dt),window.tmp=It,_t.prototype.parseHeader=function(){if(this.fileSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.reserved=this.datav.getUint32(this.pos,!0),this.pos+=4,this.offset=this.datav.getUint32(this.pos,!0),this.pos+=4,this.headerSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.width=this.datav.getUint32(this.pos,!0),this.pos+=4,this.height=this.datav.getInt32(this.pos,!0),this.pos+=4,this.planes=this.datav.getUint16(this.pos,!0),this.pos+=2,this.bitPP=this.datav.getUint16(this.pos,!0),this.pos+=2,this.compress=this.datav.getUint32(this.pos,!0),this.pos+=4,this.rawSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.hr=this.datav.getUint32(this.pos,!0),this.pos+=4,this.vr=this.datav.getUint32(this.pos,!0),this.pos+=4,this.colors=this.datav.getUint32(this.pos,!0),this.pos+=4,this.importantColors=this.datav.getUint32(this.pos,!0),this.pos+=4,16===this.bitPP&&this.is_with_alpha&&(this.bitPP=15),this.bitPP<15){var t=0===this.colors?1<<this.bitPP:this.colors;this.palette=new Array(t);for(var A=0;A<t;A++){var e=this.datav.getUint8(this.pos++,!0),r=this.datav.getUint8(this.pos++,!0),n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0);this.palette[A]={red:n,green:r,blue:e,quad:i}}}this.height<0&&(this.height*=-1,this.bottom_up=!1)},_t.prototype.parseBGR=function(){this.pos=this.offset;try{var t="bit"+this.bitPP,A=this.width*this.height*4;this.data=new Uint8Array(A),this[t]()}catch(t){console.log("bit decode error:"+t)}},_t.prototype.bit1=function(){var t=Math.ceil(this.width/8),A=t%4,e=0<=this.height?this.height-1:-this.height;for(e=this.height-1;0<=e;e--){for(var r=this.bottom_up?e:this.height-1-e,n=0;n<t;n++)for(var i=this.datav.getUint8(this.pos++,!0),o=r*this.width*4+8*n*4,s=0;s<8&&8*n+s<this.width;s++){var a=this.palette[i>>7-s&1];this.data[o+4*s]=a.blue,this.data[o+4*s+1]=a.green,this.data[o+4*s+2]=a.red,this.data[o+4*s+3]=255}0!=A&&(this.pos+=4-A)}},_t.prototype.bit4=function(){for(var t=Math.ceil(this.width/2),A=t%4,e=this.height-1;0<=e;e--){for(var r=this.bottom_up?e:this.height-1-e,n=0;n<t;n++){var i=this.datav.getUint8(this.pos++,!0),o=r*this.width*4+2*n*4,s=i>>4,a=15&i,c=this.palette[s];if(this.data[o]=c.blue,this.data[o+1]=c.green,this.data[o+2]=c.red,this.data[o+3]=255,2*n+1>=this.width)break;c=this.palette[a],this.data[o+4]=c.blue,this.data[o+4+1]=c.green,this.data[o+4+2]=c.red,this.data[o+4+3]=255}0!=A&&(this.pos+=4-A)}},_t.prototype.bit8=function(){for(var t=this.width%4,A=this.height-1;0<=A;A--){for(var e=this.bottom_up?A:this.height-1-A,r=0;r<this.width;r++){var n=this.datav.getUint8(this.pos++,!0),i=e*this.width*4+4*r;if(n<this.palette.length){var o=this.palette[n];this.data[i]=o.red,this.data[i+1]=o.green,this.data[i+2]=o.blue,this.data[i+3]=255}else this.data[i]=255,this.data[i+1]=255,this.data[i+2]=255,this.data[i+3]=255}0!=t&&(this.pos+=4-t)}},_t.prototype.bit15=function(){for(var t=this.width%3,A=parseInt("11111",2),e=this.height-1;0<=e;e--){for(var r=this.bottom_up?e:this.height-1-e,n=0;n<this.width;n++){var i=this.datav.getUint16(this.pos,!0);this.pos+=2;var o=(i&A)/A*255|0,s=(i>>5&A)/A*255|0,a=(i>>10&A)/A*255|0,c=i>>15?255:0,u=r*this.width*4+4*n;this.data[u]=a,this.data[u+1]=s,this.data[u+2]=o,this.data[u+3]=c}this.pos+=t}},_t.prototype.bit16=function(){for(var t=this.width%3,A=parseInt("11111",2),e=parseInt("111111",2),r=this.height-1;0<=r;r--){for(var n=this.bottom_up?r:this.height-1-r,i=0;i<this.width;i++){var o=this.datav.getUint16(this.pos,!0);this.pos+=2;var s=(o&A)/A*255|0,a=(o>>5&e)/e*255|0,c=(o>>11)/A*255|0,u=n*this.width*4+4*i;this.data[u]=c,this.data[u+1]=a,this.data[u+2]=s,this.data[u+3]=255}this.pos+=t}},_t.prototype.bit24=function(){for(var t=this.height-1;0<=t;t--){for(var A=this.bottom_up?t:this.height-1-t,e=0;e<this.width;e++){var r=this.datav.getUint8(this.pos++,!0),n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),o=A*this.width*4+4*e;this.data[o]=i,this.data[o+1]=n,this.data[o+2]=r,this.data[o+3]=255}this.pos+=this.width%4}},_t.prototype.bit32=function(){for(var t=this.height-1;0<=t;t--)for(var A=this.bottom_up?t:this.height-1-t,e=0;e<this.width;e++){var r=this.datav.getUint8(this.pos++,!0),n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),o=this.datav.getUint8(this.pos++,!0),s=A*this.width*4+4*e;this.data[s]=i,this.data[s+1]=n,this.data[s+2]=r,this.data[s+3]=o}},_t.prototype.getData=function(){return this.data},window.tmp=_t,function(t){var A=[0,1,2,3,4,4,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0,0,16,17,18,18,19,19,20,20,20,20,21,21,21,21,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29];function e(){var t=this;function A(t,A){for(var e=0;e|=1&t,t>>>=1,e<<=1,0<--A;);return e>>>1}t.build_tree=function(e){var r,n,i,o=t.dyn_tree,s=t.stat_desc.static_tree,a=t.stat_desc.elems,c=-1;for(e.heap_len=0,e.heap_max=573,r=0;r<a;r++)0!==o[2*r]?(e.heap[++e.heap_len]=c=r,e.depth[r]=0):o[2*r+1]=0;for(;e.heap_len<2;)o[2*(i=e.heap[++e.heap_len]=c<2?++c:0)]=1,e.depth[i]=0,e.opt_len--,s&&(e.static_len-=s[2*i+1]);for(t.max_code=c,r=Math.floor(e.heap_len/2);1<=r;r--)e.pqdownheap(o,r);for(i=a;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],e.pqdownheap(o,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,o[2*i]=o[2*r]+o[2*n],e.depth[i]=Math.max(e.depth[r],e.depth[n])+1,o[2*r+1]=o[2*n+1]=i,e.heap[1]=i++,e.pqdownheap(o,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(A){var e,r,n,i,o,s,a=t.dyn_tree,c=t.stat_desc.static_tree,u=t.stat_desc.extra_bits,l=t.stat_desc.extra_base,h=t.stat_desc.max_length,f=0;for(i=0;i<=15;i++)A.bl_count[i]=0;for(a[2*A.heap[A.heap_max]+1]=0,e=A.heap_max+1;e<573;e++)h<(i=a[2*a[2*(r=A.heap[e])+1]+1]+1)&&(i=h,f++),a[2*r+1]=i,r>t.max_code||(A.bl_count[i]++,o=0,l<=r&&(o=u[r-l]),s=a[2*r],A.opt_len+=s*(i+o),c&&(A.static_len+=s*(c[2*r+1]+o)));if(0!==f){do{for(i=h-1;0===A.bl_count[i];)i--;A.bl_count[i]--,A.bl_count[i+1]+=2,A.bl_count[h]--,f-=2}while(0<f);for(i=h;0!==i;i--)for(r=A.bl_count[i];0!==r;)(n=A.heap[--e])>t.max_code||(a[2*n+1]!=i&&(A.opt_len+=(i-a[2*n+1])*a[2*n],a[2*n+1]=i),r--)}}(e),function(t,e,r){var n,i,o,s=[],a=0;for(n=1;n<=15;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=e;i++)0!==(o=t[2*i+1])&&(t[2*i]=A(s[o]++,o))}(o,t.max_code,e.bl_count)}}function r(t,A,e,r,n){this.static_tree=t,this.extra_bits=A,this.extra_base=e,this.elems=r,this.max_length=n}function n(t,A,e,r,n){this.good_length=t,this.max_lazy=A,this.nice_length=e,this.max_chain=r,this.func=n}e._length_code=[0,1,2,3,4,5,6,7,8,8,9,9,10,10,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28],e.base_length=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],e.base_dist=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],e.d_code=function(t){return t<256?A[t]:A[256+(t>>>7)]},e.extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],e.extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],e.extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],e.bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],r.static_ltree=[12,8,140,8,76,8,204,8,44,8,172,8,108,8,236,8,28,8,156,8,92,8,220,8,60,8,188,8,124,8,252,8,2,8,130,8,66,8,194,8,34,8,162,8,98,8,226,8,18,8,146,8,82,8,210,8,50,8,178,8,114,8,242,8,10,8,138,8,74,8,202,8,42,8,170,8,106,8,234,8,26,8,154,8,90,8,218,8,58,8,186,8,122,8,250,8,6,8,134,8,70,8,198,8,38,8,166,8,102,8,230,8,22,8,150,8,86,8,214,8,54,8,182,8,118,8,246,8,14,8,142,8,78,8,206,8,46,8,174,8,110,8,238,8,30,8,158,8,94,8,222,8,62,8,190,8,126,8,254,8,1,8,129,8,65,8,193,8,33,8,161,8,97,8,225,8,17,8,145,8,81,8,209,8,49,8,177,8,113,8,241,8,9,8,137,8,73,8,201,8,41,8,169,8,105,8,233,8,25,8,153,8,89,8,217,8,57,8,185,8,121,8,249,8,5,8,133,8,69,8,197,8,37,8,165,8,101,8,229,8,21,8,149,8,85,8,213,8,53,8,181,8,117,8,245,8,13,8,141,8,77,8,205,8,45,8,173,8,109,8,237,8,29,8,157,8,93,8,221,8,61,8,189,8,125,8,253,8,19,9,275,9,147,9,403,9,83,9,339,9,211,9,467,9,51,9,307,9,179,9,435,9,115,9,371,9,243,9,499,9,11,9,267,9,139,9,395,9,75,9,331,9,203,9,459,9,43,9,299,9,171,9,427,9,107,9,363,9,235,9,491,9,27,9,283,9,155,9,411,9,91,9,347,9,219,9,475,9,59,9,315,9,187,9,443,9,123,9,379,9,251,9,507,9,7,9,263,9,135,9,391,9,71,9,327,9,199,9,455,9,39,9,295,9,167,9,423,9,103,9,359,9,231,9,487,9,23,9,279,9,151,9,407,9,87,9,343,9,215,9,471,9,55,9,311,9,183,9,439,9,119,9,375,9,247,9,503,9,15,9,271,9,143,9,399,9,79,9,335,9,207,9,463,9,47,9,303,9,175,9,431,9,111,9,367,9,239,9,495,9,31,9,287,9,159,9,415,9,95,9,351,9,223,9,479,9,63,9,319,9,191,9,447,9,127,9,383,9,255,9,511,9,0,7,64,7,32,7,96,7,16,7,80,7,48,7,112,7,8,7,72,7,40,7,104,7,24,7,88,7,56,7,120,7,4,7,68,7,36,7,100,7,20,7,84,7,52,7,116,7,3,8,131,8,67,8,195,8,35,8,163,8,99,8,227,8],r.static_dtree=[0,5,16,5,8,5,24,5,4,5,20,5,12,5,28,5,2,5,18,5,10,5,26,5,6,5,22,5,14,5,30,5,1,5,17,5,9,5,25,5,5,5,21,5,13,5,29,5,3,5,19,5,11,5,27,5,7,5,23,5],r.static_l_desc=new r(r.static_ltree,e.extra_lbits,257,286,15),r.static_d_desc=new r(r.static_dtree,e.extra_dbits,0,30,15),r.static_bl_desc=new r(null,e.extra_blbits,0,19,7);var i=[new n(0,0,0,0,0),new n(4,4,8,4,1),new n(4,5,16,8,1),new n(4,6,32,32,1),new n(4,4,16,16,2),new n(8,16,32,32,2),new n(8,16,128,128,2),new n(8,32,128,256,2),new n(32,128,258,1024,2),new n(32,258,258,4096,2)],o=["need dictionary","stream end","","","stream error","data error","","buffer error","",""];function s(t,A,e,r){var n=t[2*A],i=t[2*e];return n<i||n==i&&r[A]<=r[e]}function a(){var t,A,n,a,c,u,l,h,f,d,p,B,g,w,m,Q,C,y,v,F,U,N,E,b,L,H,x,S,I,_,T,R,O,K,M,P,D,k,z,j,q,V=this,X=new e,G=new e,J=new e;function W(){var t;for(t=0;t<286;t++)T[2*t]=0;for(t=0;t<30;t++)R[2*t]=0;for(t=0;t<19;t++)O[2*t]=0;T[512]=1,V.opt_len=V.static_len=0,P=k=0}function Y(t,A){var e,r,n=-1,i=t[1],o=0,s=7,a=4;for(0===i&&(s=138,a=3),t[2*(A+1)+1]=65535,e=0;e<=A;e++)r=i,i=t[2*(e+1)+1],++o<s&&r==i||(o<a?O[2*r]+=o:0!==r?(r!=n&&O[2*r]++,O[32]++):o<=10?O[34]++:O[36]++,n=r,a=(o=0)===i?(s=138,3):r==i?(s=6,3):(s=7,4))}function Z(t){V.pending_buf[V.pending++]=t}function $(t){Z(255&t),Z(t>>>8&255)}function tt(t,A){var e,r=A;16-r<q?($(j|=(e=t)<<q&65535),j=e>>>16-q,q+=r-16):(j|=t<<q&65535,q+=r)}function At(t,A){var e=2*t;tt(65535&A[e],65535&A[e+1])}function et(t,A){var e,r,n=-1,i=t[1],o=0,s=7,a=4;for(0===i&&(s=138,a=3),e=0;e<=A;e++)if(r=i,i=t[2*(e+1)+1],!(++o<s&&r==i)){if(o<a)for(;At(r,O),0!=--o;);else 0!==r?(r!=n&&(At(r,O),o--),At(16,O),tt(o-3,2)):o<=10?(At(17,O),tt(o-3,3)):(At(18,O),tt(o-11,7));n=r,a=(o=0)===i?(s=138,3):r==i?(s=6,3):(s=7,4)}}function rt(){16==q?($(j),q=j=0):8<=q&&(Z(255&j),j>>>=8,q-=8)}function nt(t,A){var r,n,i;if(V.pending_buf[D+2*P]=t>>>8&255,V.pending_buf[D+2*P+1]=255&t,V.pending_buf[K+P]=255&A,P++,0===t?T[2*A]++:(k++,t--,T[2*(e._length_code[A]+256+1)]++,R[2*e.d_code(t)]++),0==(8191&P)&&2<x){for(r=8*P,n=U-C,i=0;i<30;i++)r+=R[2*i]*(5+e.extra_dbits[i]);if(r>>>=3,k<Math.floor(P/2)&&r<Math.floor(n/2))return!0}return P==M-1}function it(t,A){var r,n,i,o,s=0;if(0!==P)for(;r=V.pending_buf[D+2*s]<<8&65280|255&V.pending_buf[D+2*s+1],n=255&V.pending_buf[K+s],s++,0===r?At(n,t):(At((i=e._length_code[n])+256+1,t),0!==(o=e.extra_lbits[i])&&tt(n-=e.base_length[i],o),At(i=e.d_code(--r),A),0!==(o=e.extra_dbits[i])&&tt(r-=e.base_dist[i],o)),s<P;);At(256,t),z=t[513]}function ot(){8<q?$(j):0<q&&Z(255&j),q=j=0}function st(t,A,e){var r,n;tt(0+(e?1:0),3),r=t,n=A,ot(),z=8,$(n),$(~n),V.pending_buf.set(h.subarray(r,r+n),V.pending),V.pending+=n}function at(A){(function(t,A,n){var i,o,s=0;0<x?(X.build_tree(V),G.build_tree(V),s=function(){var t;for(Y(T,X.max_code),Y(R,G.max_code),J.build_tree(V),t=18;3<=t&&0===O[2*e.bl_order[t]+1];t--);return V.opt_len+=3*(t+1)+5+5+4,t}(),i=V.opt_len+3+7>>>3,(o=V.static_len+3+7>>>3)<=i&&(i=o)):i=o=A+5,A+4<=i&&-1!=t?st(t,A,n):o==i?(tt(2+(n?1:0),3),it(r.static_ltree,r.static_dtree)):(tt(4+(n?1:0),3),function(t,A,r){var n;for(tt(t-257,5),tt(A-1,5),tt(r-4,4),n=0;n<r;n++)tt(O[2*e.bl_order[n]+1],3);et(T,t-1),et(R,A-1)}(X.max_code+1,G.max_code+1,s+1),it(T,R)),W(),n&&ot()})(0<=C?C:-1,U-C,A),C=U,t.flush_pending()}function ct(){var A,e,r,n;do{if(0==(n=f-E-U)&&0===U&&0===E)n=c;else if(-1==n)n--;else if(c+c-262<=U){for(h.set(h.subarray(c,c+c),0),N-=c,U-=c,C-=c,r=A=g;e=65535&p[--r],p[r]=c<=e?e-c:0,0!=--A;);for(r=A=c;e=65535&d[--r],d[r]=c<=e?e-c:0,0!=--A;);n+=c}if(0===t.avail_in)return;A=t.read_buf(h,U+E,n),3<=(E+=A)&&(B=((B=255&h[U])<<Q^255&h[U+1])&m)}while(E<262&&0!==t.avail_in)}function ut(t){var A,e,r=L,n=U,i=b,o=c-262<U?U-(c-262):0,s=_,a=l,u=U+258,f=h[n+i-1],p=h[n+i];I<=b&&(r>>=2),E<s&&(s=E);do{if(h[(A=t)+i]==p&&h[A+i-1]==f&&h[A]==h[n]&&h[++A]==h[n+1]){n+=2,A++;do{}while(h[++n]==h[++A]&&h[++n]==h[++A]&&h[++n]==h[++A]&&h[++n]==h[++A]&&h[++n]==h[++A]&&h[++n]==h[++A]&&h[++n]==h[++A]&&h[++n]==h[++A]&&n<u);if(e=258-(u-n),n=u-258,i<e){if(N=t,s<=(i=e))break;f=h[n+i-1],p=h[n+i]}}}while((t=65535&d[t&a])>o&&0!=--r);return i<=E?i:E}function lt(t){return t.total_in=t.total_out=0,t.msg=null,V.pending=0,V.pending_out=0,A=113,a=0,X.dyn_tree=T,X.stat_desc=r.static_l_desc,G.dyn_tree=R,G.stat_desc=r.static_d_desc,J.dyn_tree=O,J.stat_desc=r.static_bl_desc,q=j=0,z=8,W(),function(){var t;for(f=2*c,t=p[g-1]=0;t<g-1;t++)p[t]=0;H=i[x].max_lazy,I=i[x].good_length,_=i[x].nice_length,L=i[x].max_chain,y=b=2,B=F=E=C=U=0}(),0}V.depth=[],V.bl_count=[],V.heap=[],T=[],R=[],O=[],V.pqdownheap=function(t,A){for(var e=V.heap,r=e[A],n=A<<1;n<=V.heap_len&&(n<V.heap_len&&s(t,e[n+1],e[n],V.depth)&&n++,!s(t,r,e[n],V.depth));)e[A]=e[n],A=n,n<<=1;e[A]=r},V.deflateInit=function(t,A,e,r,i,o){return r||(r=8),i||(i=8),o||(o=0),t.msg=null,-1==A&&(A=6),i<1||9<i||8!=r||e<9||15<e||A<0||9<A||o<0||2<o?-2:(t.dstate=V,l=(c=1<<(u=e))-1,m=(g=1<<(w=i+7))-1,Q=Math.floor((w+3-1)/3),h=new Uint8Array(2*c),d=[],p=[],M=1<<i+6,V.pending_buf=new Uint8Array(4*M),n=4*M,D=Math.floor(M/2),K=3*M,x=A,S=o,lt(t))},V.deflateEnd=function(){return 42!=A&&113!=A&&666!=A?-2:(V.pending_buf=null,h=d=p=null,V.dstate=null,113==A?-3:0)},V.deflateParams=function(t,A,e){var r=0;return-1==A&&(A=6),A<0||9<A||e<0||2<e?-2:(i[x].func!=i[A].func&&0!==t.total_in&&(r=t.deflate(1)),x!=A&&(H=i[x=A].max_lazy,I=i[x].good_length,_=i[x].nice_length,L=i[x].max_chain),S=e,r)},V.deflateSetDictionary=function(t,e,r){var n,i=r,o=0;if(!e||42!=A)return-2;if(i<3)return 0;for(c-262<i&&(o=r-(i=c-262)),h.set(e.subarray(o,o+i),0),C=U=i,B=((B=255&h[0])<<Q^255&h[1])&m,n=0;n<=i-3;n++)B=(B<<Q^255&h[n+2])&m,d[n&l]=p[B],p[B]=n;return 0},V.deflate=function(e,s){var f,w,L,I,_,T;if(4<s||s<0)return-2;if(!e.next_out||!e.next_in&&0!==e.avail_in||666==A&&4!=s)return e.msg=o[4],-2;if(0===e.avail_out)return e.msg=o[7],-5;if(t=e,I=a,a=s,42==A&&(w=8+(u-8<<4)<<8,3<(L=(x-1&255)>>1)&&(L=3),w|=L<<6,0!==U&&(w|=32),A=113,Z((T=w+=31-w%31)>>8&255),Z(255&T)),0!==V.pending){if(t.flush_pending(),0===t.avail_out)return a=-1,0}else if(0===t.avail_in&&s<=I&&4!=s)return t.msg=o[7],-5;if(666==A&&0!==t.avail_in)return e.msg=o[7],-5;if(0!==t.avail_in||0!==E||0!=s&&666!=A){switch(_=-1,i[x].func){case 0:_=function(A){var e,r=65535;for(n-5<r&&(r=n-5);;){if(E<=1){if(ct(),0===E&&0==A)return 0;if(0===E)break}if(U+=E,e=C+r,((E=0)===U||e<=U)&&(E=U-e,U=e,at(!1),0===t.avail_out))return 0;if(c-262<=U-C&&(at(!1),0===t.avail_out))return 0}return at(4==A),0===t.avail_out?4==A?2:0:4==A?3:1}(s);break;case 1:_=function(A){for(var e,r=0;;){if(E<262){if(ct(),E<262&&0==A)return 0;if(0===E)break}if(3<=E&&(B=(B<<Q^255&h[U+2])&m,r=65535&p[B],d[U&l]=p[B],p[B]=U),0!==r&&(U-r&65535)<=c-262&&2!=S&&(y=ut(r)),3<=y)if(e=nt(U-N,y-3),E-=y,y<=H&&3<=E){for(y--;B=(B<<Q^255&h[2+ ++U])&m,r=65535&p[B],d[U&l]=p[B],p[B]=U,0!=--y;);U++}else U+=y,y=0,B=((B=255&h[U])<<Q^255&h[U+1])&m;else e=nt(0,255&h[U]),E--,U++;if(e&&(at(!1),0===t.avail_out))return 0}return at(4==A),0===t.avail_out?4==A?2:0:4==A?3:1}(s);break;case 2:_=function(A){for(var e,r,n=0;;){if(E<262){if(ct(),E<262&&0==A)return 0;if(0===E)break}if(3<=E&&(B=(B<<Q^255&h[U+2])&m,n=65535&p[B],d[U&l]=p[B],p[B]=U),b=y,v=N,y=2,0!==n&&b<H&&(U-n&65535)<=c-262&&(2!=S&&(y=ut(n)),y<=5&&(1==S||3==y&&4096<U-N)&&(y=2)),3<=b&&y<=b){for(r=U+E-3,e=nt(U-1-v,b-3),E-=b-1,b-=2;++U<=r&&(B=(B<<Q^255&h[U+2])&m,n=65535&p[B],d[U&l]=p[B],p[B]=U),0!=--b;);if(F=0,y=2,U++,e&&(at(!1),0===t.avail_out))return 0}else if(0!==F){if((e=nt(0,255&h[U-1]))&&at(!1),U++,E--,0===t.avail_out)return 0}else F=1,U++,E--}return 0!==F&&(e=nt(0,255&h[U-1]),F=0),at(4==A),0===t.avail_out?4==A?2:0:4==A?3:1}(s)}if(2!=_&&3!=_||(A=666),0==_||2==_)return 0===t.avail_out&&(a=-1),0;if(1==_){if(1==s)tt(2,3),At(256,r.static_ltree),rt(),1+z+10-q<9&&(tt(2,3),At(256,r.static_ltree),rt()),z=7;else if(st(0,0,!1),3==s)for(f=0;f<g;f++)p[f]=0;if(t.flush_pending(),0===t.avail_out)return a=-1,0}}return 4!=s?0:1}}function c(){this.next_in_index=0,this.next_out_index=0,this.avail_in=0,this.total_in=0,this.avail_out=0,this.total_out=0}c.prototype={deflateInit:function(t,A){return this.dstate=new a,A||(A=15),this.dstate.deflateInit(this,t,A)},deflate:function(t){return this.dstate?this.dstate.deflate(this,t):-2},deflateEnd:function(){if(!this.dstate)return-2;var t=this.dstate.deflateEnd();return this.dstate=null,t},deflateParams:function(t,A){return this.dstate?this.dstate.deflateParams(this,t,A):-2},deflateSetDictionary:function(t,A){return this.dstate?this.dstate.deflateSetDictionary(this,t,A):-2},read_buf:function(t,A,e){var r=this.avail_in;return e<r&&(r=e),0===r?0:(this.avail_in-=r,t.set(this.next_in.subarray(this.next_in_index,this.next_in_index+r),A),this.next_in_index+=r,this.total_in+=r,r)},flush_pending:function(){var t=this,A=t.dstate.pending;A>t.avail_out&&(A=t.avail_out),0!==A&&(t.next_out.set(t.dstate.pending_buf.subarray(t.dstate.pending_out,t.dstate.pending_out+A),t.next_out_index),t.next_out_index+=A,t.dstate.pending_out+=A,t.total_out+=A,t.avail_out-=A,t.dstate.pending-=A,0===t.dstate.pending&&(t.dstate.pending_out=0))}};var u=t.zip||t;u.Deflater=u._jzlib_Deflater=function(t){var A=new c,e=new Uint8Array(512),r=t?t.level:-1;void 0===r&&(r=-1),A.deflateInit(r),A.next_out=e,this.append=function(t,r){var n,i=[],o=0,s=0,a=0;if(t.length){A.next_in_index=0,A.next_in=t,A.avail_in=t.length;do{if(A.next_out_index=0,A.avail_out=512,0!=A.deflate(0))throw new Error("deflating: "+A.msg);A.next_out_index&&(512==A.next_out_index?i.push(new Uint8Array(e)):i.push(new Uint8Array(e.subarray(0,A.next_out_index)))),a+=A.next_out_index,r&&0<A.next_in_index&&A.next_in_index!=o&&(r(A.next_in_index),o=A.next_in_index)}while(0<A.avail_in||0===A.avail_out);return n=new Uint8Array(a),i.forEach((function(t){n.set(t,s),s+=t.length})),n}},this.flush=function(){var t,r,n=[],i=0,o=0;do{if(A.next_out_index=0,A.avail_out=512,1!=(t=A.deflate(4))&&0!=t)throw new Error("deflating: "+A.msg);0<512-A.avail_out&&n.push(new Uint8Array(e.subarray(0,A.next_out_index))),o+=A.next_out_index}while(0<A.avail_in||0===A.avail_out);return A.deflateEnd(),r=new Uint8Array(o),n.forEach((function(t){r.set(t,i),i+=t.length})),r}}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0!==r&&r||Function('return typeof this === "object" && this.content')()||Function("return this")()),("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0!==r&&r||Function('return typeof this === "object" && this.content')()||Function("return this")()).RGBColor=function(t){var A;t=t||"",this.ok=!1,"#"==t.charAt(0)&&(t=t.substr(1,6)),t=(t=t.replace(/ /g,"")).toLowerCase();var e={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"};for(var r in e)t==r&&(t=e[r]);for(var n=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(t){return[parseInt(t[1]),parseInt(t[2]),parseInt(t[3])]}},{re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}}],i=0;i<n.length;i++){var o=n[i].re,s=n[i].process,a=o.exec(t);a&&(A=s(a),this.r=A[0],this.g=A[1],this.b=A[2],this.ok=!0)}this.r=this.r<0||isNaN(this.r)?0:255<this.r?255:this.r,this.g=this.g<0||isNaN(this.g)?0:255<this.g?255:this.g,this.b=this.b<0||isNaN(this.b)?0:255<this.b?255:this.b,this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"},this.toHex=function(){var t=this.r.toString(16),A=this.g.toString(16),e=this.b.toString(16);return 1==t.length&&(t="0"+t),1==A.length&&(A="0"+A),1==e.length&&(e="0"+e),"#"+t+A+e}},function(t){var A="+".charCodeAt(0),e="/".charCodeAt(0),r="0".charCodeAt(0),n="a".charCodeAt(0),i="A".charCodeAt(0),o="-".charCodeAt(0),s="_".charCodeAt(0),a=function(t){var a=t.charCodeAt(0);return a===A||a===o?62:a===e||a===s?63:a<r?-1:a<r+10?a-r+26+26:a<i+26?a-i:a<n+26?a-n+26:void 0};t.API.TTFFont=function(){function t(t,A,e){var r;if(this.rawData=t,r=this.contents=new u(t),this.contents.pos=4,"ttcf"===r.readString(4)){if(!A)throw new Error("Must specify a font name for TTC files.");throw new Error("Font "+A+" not found in TTC file.")}r.pos=0,this.parse(),this.subset=new L(this),this.registerTTF()}return t.open=function(A,e,r,n){if("string"!=typeof r)throw new Error("Invalid argument supplied in TTFFont.open");return new t(function(t){var A,e,r,n,i,o;if(0<t.length%4)throw new Error("Invalid string. Length must be a multiple of 4");var s=t.length;i="="===t.charAt(s-2)?2:"="===t.charAt(s-1)?1:0,o=new Uint8Array(3*t.length/4-i),r=0<i?t.length-4:t.length;var c=0;function u(t){o[c++]=t}for(e=A=0;A<r;A+=4,e+=3)u((16711680&(n=a(t.charAt(A))<<18|a(t.charAt(A+1))<<12|a(t.charAt(A+2))<<6|a(t.charAt(A+3))))>>16),u((65280&n)>>8),u(255&n);return 2===i?u(255&(n=a(t.charAt(A))<<2|a(t.charAt(A+1))>>4)):1===i&&(u((n=a(t.charAt(A))<<10|a(t.charAt(A+1))<<4|a(t.charAt(A+2))>>2)>>8&255),u(255&n)),o}(r),e,n)},t.prototype.parse=function(){return this.directory=new l(this.contents),this.head=new d(this),this.name=new C(this),this.cmap=new B(this),this.toUnicode=new Map,this.hhea=new g(this),this.maxp=new y(this),this.hmtx=new v(this),this.post=new m(this),this.os2=new w(this),this.loca=new b(this),this.glyf=new U(this),this.ascender=this.os2.exists&&this.os2.ascender||this.hhea.ascender,this.decender=this.os2.exists&&this.os2.decender||this.hhea.decender,this.lineGap=this.os2.exists&&this.os2.lineGap||this.hhea.lineGap,this.bbox=[this.head.xMin,this.head.yMin,this.head.xMax,this.head.yMax]},t.prototype.registerTTF=function(){var t,A,e,r,n;if(this.scaleFactor=1e3/this.head.unitsPerEm,this.bbox=function(){var A,e,r,n;for(n=[],A=0,e=(r=this.bbox).length;A<e;A++)t=r[A],n.push(Math.round(t*this.scaleFactor));return n}.call(this),this.stemV=0,this.post.exists?(e=255&(r=this.post.italic_angle),!0&(A=r>>16)&&(A=-(1+(65535^A))),this.italicAngle=+(A+"."+e)):this.italicAngle=0,this.ascender=Math.round(this.ascender*this.scaleFactor),this.decender=Math.round(this.decender*this.scaleFactor),this.lineGap=Math.round(this.lineGap*this.scaleFactor),this.capHeight=this.os2.exists&&this.os2.capHeight||this.ascender,this.xHeight=this.os2.exists&&this.os2.xHeight||0,this.familyClass=(this.os2.exists&&this.os2.familyClass||0)>>8,this.isSerif=1===(n=this.familyClass)||2===n||3===n||4===n||5===n||7===n,this.isScript=10===this.familyClass,this.flags=0,this.post.isFixedPitch&&(this.flags|=1),this.isSerif&&(this.flags|=2),this.isScript&&(this.flags|=8),0!==this.italicAngle&&(this.flags|=64),this.flags|=32,!this.cmap.unicode)throw new Error("No unicode cmap for font")},t.prototype.characterToGlyph=function(t){var A;return(null!=(A=this.cmap.unicode)?A.codeMap[t]:void 0)||0},t.prototype.widthOfGlyph=function(t){var A;return A=1e3/this.head.unitsPerEm,this.hmtx.forGlyph(t).advance*A},t.prototype.widthOfString=function(t,A,e){var r,n,i,o,s;for(n=o=i=0,s=(t=""+t).length;0<=s?o<s:s<o;n=0<=s?++o:--o)r=t.charCodeAt(n),i+=this.widthOfGlyph(this.characterToGlyph(r))+e*(1e3/A)||0;return i*(A/1e3)},t.prototype.lineHeight=function(t,A){var e;return null==A&&(A=!1),e=A?this.lineGap:0,(this.ascender+e-this.decender)/1e3*t},t}();var c,u=function(){function t(t){this.data=null!=t?t:[],this.pos=0,this.length=this.data.length}return t.prototype.readByte=function(){return this.data[this.pos++]},t.prototype.writeByte=function(t){return this.data[this.pos++]=t},t.prototype.readUInt32=function(){return 16777216*this.readByte()+(this.readByte()<<16)+(this.readByte()<<8)+this.readByte()},t.prototype.writeUInt32=function(t){return this.writeByte(t>>>24&255),this.writeByte(t>>16&255),this.writeByte(t>>8&255),this.writeByte(255&t)},t.prototype.readInt32=function(){var t;return 2147483648<=(t=this.readUInt32())?t-4294967296:t},t.prototype.writeInt32=function(t){return t<0&&(t+=4294967296),this.writeUInt32(t)},t.prototype.readUInt16=function(){return this.readByte()<<8|this.readByte()},t.prototype.writeUInt16=function(t){return this.writeByte(t>>8&255),this.writeByte(255&t)},t.prototype.readInt16=function(){var t;return 32768<=(t=this.readUInt16())?t-65536:t},t.prototype.writeInt16=function(t){return t<0&&(t+=65536),this.writeUInt16(t)},t.prototype.readString=function(t){var A,e,r;for(e=[],A=r=0;0<=t?r<t:t<r;A=0<=t?++r:--r)e[A]=String.fromCharCode(this.readByte());return e.join("")},t.prototype.writeString=function(t){var A,e,r,n;for(n=[],A=e=0,r=t.length;0<=r?e<r:r<e;A=0<=r?++e:--e)n.push(this.writeByte(t.charCodeAt(A)));return n},t.prototype.readShort=function(){return this.readInt16()},t.prototype.writeShort=function(t){return this.writeInt16(t)},t.prototype.readLongLong=function(){var t,A,e,r,n,i,o,s;return t=this.readByte(),A=this.readByte(),e=this.readByte(),r=this.readByte(),n=this.readByte(),i=this.readByte(),o=this.readByte(),s=this.readByte(),128&t?-1*(72057594037927940*(255^t)+281474976710656*(255^A)+1099511627776*(255^e)+4294967296*(255^r)+16777216*(255^n)+65536*(255^i)+256*(255^o)+(255^s)+1):72057594037927940*t+281474976710656*A+1099511627776*e+4294967296*r+16777216*n+65536*i+256*o+s},t.prototype.writeLongLong=function(t){var A,e;return A=Math.floor(t/4294967296),e=4294967295&t,this.writeByte(A>>24&255),this.writeByte(A>>16&255),this.writeByte(A>>8&255),this.writeByte(255&A),this.writeByte(e>>24&255),this.writeByte(e>>16&255),this.writeByte(e>>8&255),this.writeByte(255&e)},t.prototype.readInt=function(){return this.readInt32()},t.prototype.writeInt=function(t){return this.writeInt32(t)},t.prototype.read=function(t){var A,e;for(A=[],e=0;0<=t?e<t:t<e;0<=t?++e:--e)A.push(this.readByte());return A},t.prototype.write=function(t){var A,e,r,n;for(n=[],e=0,r=t.length;e<r;e++)A=t[e],n.push(this.writeByte(A));return n},t}(),l=function(){var t;function A(t){var A,e,r;for(this.scalarType=t.readInt(),this.tableCount=t.readShort(),this.searchRange=t.readShort(),this.entrySelector=t.readShort(),this.rangeShift=t.readShort(),this.tables={},e=0,r=this.tableCount;0<=r?e<r:r<e;0<=r?++e:--e)A={tag:t.readString(4),checksum:t.readInt(),offset:t.readInt(),length:t.readInt()},this.tables[A.tag]=A}return A.prototype.encode=function(A){var e,r,n,i,o,s,a,c,l,h,f,d,p;for(p in f=Object.keys(A).length,s=Math.log(2),l=16*Math.floor(Math.log(f)/s),i=Math.floor(l/s),c=16*f-l,(r=new u).writeInt(this.scalarType),r.writeShort(f),r.writeShort(l),r.writeShort(i),r.writeShort(c),n=16*f,a=r.pos+n,o=null,d=[],A)for(h=A[p],r.writeString(p),r.writeInt(t(h)),r.writeInt(a),r.writeInt(h.length),d=d.concat(h),"head"===p&&(o=a),a+=h.length;a%4;)d.push(0),a++;return r.write(d),e=2981146554-t(r.data),r.pos=o+8,r.writeUInt32(e),r.data},t=function(t){var A,e,r,n;for(t=F.call(t);t.length%4;)t.push(0);for(e=new u(t),r=A=0,n=t.length;r<n;r+=4)A+=e.readUInt32();return 4294967295&A},A}(),h={}.hasOwnProperty,f=function(t,A){for(var e in A)h.call(A,e)&&(t[e]=A[e]);function r(){this.constructor=t}return r.prototype=A.prototype,t.prototype=new r,t.__super__=A.prototype,t};c=function(){function t(t){var A;this.file=t,A=this.file.directory.tables[this.tag],this.exists=!!A,A&&(this.offset=A.offset,this.length=A.length,this.parse(this.file.contents))}return t.prototype.parse=function(){},t.prototype.encode=function(){},t.prototype.raw=function(){return this.exists?(this.file.contents.pos=this.offset,this.file.contents.read(this.length)):null},t}();var d=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="head",A.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.revision=t.readInt(),this.checkSumAdjustment=t.readInt(),this.magicNumber=t.readInt(),this.flags=t.readShort(),this.unitsPerEm=t.readShort(),this.created=t.readLongLong(),this.modified=t.readLongLong(),this.xMin=t.readShort(),this.yMin=t.readShort(),this.xMax=t.readShort(),this.yMax=t.readShort(),this.macStyle=t.readShort(),this.lowestRecPPEM=t.readShort(),this.fontDirectionHint=t.readShort(),this.indexToLocFormat=t.readShort(),this.glyphDataFormat=t.readShort()},A.prototype.encode=function(t){var A;return(A=new u).writeInt(this.version),A.writeInt(this.revision),A.writeInt(this.checkSumAdjustment),A.writeInt(this.magicNumber),A.writeShort(this.flags),A.writeShort(this.unitsPerEm),A.writeLongLong(this.created),A.writeLongLong(this.modified),A.writeShort(this.xMin),A.writeShort(this.yMin),A.writeShort(this.xMax),A.writeShort(this.yMax),A.writeShort(this.macStyle),A.writeShort(this.lowestRecPPEM),A.writeShort(this.fontDirectionHint),A.writeShort(t),A.writeShort(this.glyphDataFormat),A.data},A}(),p=function(){function t(t,A){var e,r,n,i,o,s,a,c,u,l,h,f,d,p,B,g,w,m;switch(this.platformID=t.readUInt16(),this.encodingID=t.readShort(),this.offset=A+t.readInt(),u=t.pos,t.pos=this.offset,this.format=t.readUInt16(),this.length=t.readUInt16(),this.language=t.readUInt16(),this.isUnicode=3===this.platformID&&1===this.encodingID&&4===this.format||0===this.platformID&&4===this.format,this.codeMap={},this.format){case 0:for(s=B=0;B<256;s=++B)this.codeMap[s]=t.readByte();break;case 4:for(h=t.readUInt16(),l=h/2,t.pos+=6,n=function(){var A,e;for(e=[],s=A=0;0<=l?A<l:l<A;s=0<=l?++A:--A)e.push(t.readUInt16());return e}(),t.pos+=2,d=function(){var A,e;for(e=[],s=A=0;0<=l?A<l:l<A;s=0<=l?++A:--A)e.push(t.readUInt16());return e}(),a=function(){var A,e;for(e=[],s=A=0;0<=l?A<l:l<A;s=0<=l?++A:--A)e.push(t.readUInt16());return e}(),c=function(){var A,e;for(e=[],s=A=0;0<=l?A<l:l<A;s=0<=l?++A:--A)e.push(t.readUInt16());return e}(),r=(this.length-t.pos+this.offset)/2,o=function(){var A,e;for(e=[],s=A=0;0<=r?A<r:r<A;s=0<=r?++A:--A)e.push(t.readUInt16());return e}(),s=g=0,m=n.length;g<m;s=++g)for(p=n[s],e=w=f=d[s];f<=p?w<=p:p<=w;e=f<=p?++w:--w)0===c[s]?i=e+a[s]:0!==(i=o[c[s]/2+(e-f)-(l-s)]||0)&&(i+=a[s]),this.codeMap[e]=65535&i}t.pos=u}return t.encode=function(t,A){var e,r,n,i,o,s,a,c,l,h,f,d,p,B,g,w,m,Q,C,y,v,F,U,N,E,b,L,H,x,S,I,_,T,R,O,K,M,P,D,k,z,j,q,V,X,G;switch(H=new u,i=Object.keys(t).sort((function(t,A){return t-A})),A){case"macroman":for(p=0,B=function(){var t,A;for(A=[],d=t=0;t<256;d=++t)A.push(0);return A}(),w={0:0},n={},x=0,T=i.length;x<T;x++)null==w[q=t[r=i[x]]]&&(w[q]=++p),n[r]={old:t[r],new:w[t[r]]},B[r]=w[t[r]];return H.writeUInt16(1),H.writeUInt16(0),H.writeUInt32(12),H.writeUInt16(0),H.writeUInt16(262),H.writeUInt16(0),H.write(B),{charMap:n,subtable:H.data,maxGlyphID:p+1};case"unicode":for(b=[],l=[],w={},e={},g=a=null,S=m=0,R=i.length;S<R;S++)null==w[C=t[r=i[S]]]&&(w[C]=++m),e[r]={old:C,new:w[C]},o=w[C]-r,null!=g&&o===a||(g&&l.push(g),b.push(r),a=o),g=r;for(g&&l.push(g),l.push(65535),b.push(65535),N=2*(U=b.length),F=2*Math.pow(Math.log(U)/Math.LN2,2),h=Math.log(F/2)/Math.LN2,v=2*U-F,s=[],y=[],f=[],d=I=0,O=b.length;I<O;d=++I){if(E=b[d],c=l[d],65535===E){s.push(0),y.push(0);break}if(32768<=E-(L=e[E].new))for(s.push(0),y.push(2*(f.length+U-d)),r=_=E;E<=c?_<=c:c<=_;r=E<=c?++_:--_)f.push(e[r].new);else s.push(L-E),y.push(0)}for(H.writeUInt16(3),H.writeUInt16(1),H.writeUInt32(12),H.writeUInt16(4),H.writeUInt16(16+8*U+2*f.length),H.writeUInt16(0),H.writeUInt16(N),H.writeUInt16(F),H.writeUInt16(h),H.writeUInt16(v),z=0,K=l.length;z<K;z++)r=l[z],H.writeUInt16(r);for(H.writeUInt16(0),j=0,M=b.length;j<M;j++)r=b[j],H.writeUInt16(r);for(V=0,P=s.length;V<P;V++)o=s[V],H.writeUInt16(o);for(X=0,D=y.length;X<D;X++)Q=y[X],H.writeUInt16(Q);for(G=0,k=f.length;G<k;G++)p=f[G],H.writeUInt16(p);return{charMap:e,subtable:H.data,maxGlyphID:m+1}}},t}(),B=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="cmap",A.prototype.parse=function(t){var A,e,r;for(t.pos=this.offset,this.version=t.readUInt16(),e=t.readUInt16(),this.tables=[],this.unicode=null,r=0;0<=e?r<e:e<r;0<=e?++r:--r)A=new p(t,this.offset),this.tables.push(A),A.isUnicode&&null==this.unicode&&(this.unicode=A);return!0},A.encode=function(t,A){var e,r;return null==A&&(A="macroman"),e=p.encode(t,A),(r=new u).writeUInt16(0),r.writeUInt16(1),e.table=r.data.concat(e.subtable),e},A}(),g=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="hhea",A.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.ascender=t.readShort(),this.decender=t.readShort(),this.lineGap=t.readShort(),this.advanceWidthMax=t.readShort(),this.minLeftSideBearing=t.readShort(),this.minRightSideBearing=t.readShort(),this.xMaxExtent=t.readShort(),this.caretSlopeRise=t.readShort(),this.caretSlopeRun=t.readShort(),this.caretOffset=t.readShort(),t.pos+=8,this.metricDataFormat=t.readShort(),this.numberOfMetrics=t.readUInt16()},A}(),w=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="OS/2",A.prototype.parse=function(t){if(t.pos=this.offset,this.version=t.readUInt16(),this.averageCharWidth=t.readShort(),this.weightClass=t.readUInt16(),this.widthClass=t.readUInt16(),this.type=t.readShort(),this.ySubscriptXSize=t.readShort(),this.ySubscriptYSize=t.readShort(),this.ySubscriptXOffset=t.readShort(),this.ySubscriptYOffset=t.readShort(),this.ySuperscriptXSize=t.readShort(),this.ySuperscriptYSize=t.readShort(),this.ySuperscriptXOffset=t.readShort(),this.ySuperscriptYOffset=t.readShort(),this.yStrikeoutSize=t.readShort(),this.yStrikeoutPosition=t.readShort(),this.familyClass=t.readShort(),this.panose=function(){var A,e;for(e=[],A=0;A<10;++A)e.push(t.readByte());return e}(),this.charRange=function(){var A,e;for(e=[],A=0;A<4;++A)e.push(t.readInt());return e}(),this.vendorID=t.readString(4),this.selection=t.readShort(),this.firstCharIndex=t.readShort(),this.lastCharIndex=t.readShort(),0<this.version&&(this.ascent=t.readShort(),this.descent=t.readShort(),this.lineGap=t.readShort(),this.winAscent=t.readShort(),this.winDescent=t.readShort(),this.codePageRange=function(){var A,e;for(e=[],A=0;A<2;++A)e.push(t.readInt());return e}(),1<this.version))return this.xHeight=t.readShort(),this.capHeight=t.readShort(),this.defaultChar=t.readShort(),this.breakChar=t.readShort(),this.maxContext=t.readShort()},A}(),m=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="post",A.prototype.parse=function(t){var A,e,r,n;switch(t.pos=this.offset,this.format=t.readInt(),this.italicAngle=t.readInt(),this.underlinePosition=t.readShort(),this.underlineThickness=t.readShort(),this.isFixedPitch=t.readInt(),this.minMemType42=t.readInt(),this.maxMemType42=t.readInt(),this.minMemType1=t.readInt(),this.maxMemType1=t.readInt(),this.format){case 65536:break;case 131072:for(e=t.readUInt16(),this.glyphNameIndex=[],r=0;0<=e?r<e:e<r;0<=e?++r:--r)this.glyphNameIndex.push(t.readUInt16());for(this.names=[],n=[];t.pos<this.offset+this.length;)A=t.readByte(),n.push(this.names.push(t.readString(A)));return n;case 151552:return e=t.readUInt16(),this.offsets=t.read(e);case 196608:break;case 262144:return this.map=function(){var A,e,r;for(r=[],A=0,e=this.file.maxp.numGlyphs;0<=e?A<e:e<A;0<=e?++A:--A)r.push(t.readUInt32());return r}.call(this)}},A}(),Q=function(t,A){this.raw=t,this.length=t.length,this.platformID=A.platformID,this.encodingID=A.encodingID,this.languageID=A.languageID},C=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="name",A.prototype.parse=function(t){var A,e,r,n,i,o,s,a,c,u,l,h;for(t.pos=this.offset,t.readShort(),A=t.readShort(),o=t.readShort(),e=[],n=c=0;0<=A?c<A:A<c;n=0<=A?++c:--c)e.push({platformID:t.readShort(),encodingID:t.readShort(),languageID:t.readShort(),nameID:t.readShort(),length:t.readShort(),offset:this.offset+o+t.readShort()});for(s={},n=u=0,l=e.length;u<l;n=++u)r=e[n],t.pos=r.offset,a=t.readString(r.length),i=new Q(a,r),null==s[h=r.nameID]&&(s[h]=[]),s[r.nameID].push(i);this.strings=s,this.copyright=s[0],this.fontFamily=s[1],this.fontSubfamily=s[2],this.uniqueSubfamily=s[3],this.fontName=s[4],this.version=s[5];try{this.postscriptName=s[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"")}catch(t){this.postscriptName=s[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"")}return this.trademark=s[7],this.manufacturer=s[8],this.designer=s[9],this.description=s[10],this.vendorUrl=s[11],this.designerUrl=s[12],this.license=s[13],this.licenseUrl=s[14],this.preferredFamily=s[15],this.preferredSubfamily=s[17],this.compatibleFull=s[18],this.sampleText=s[19]},A}(),y=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="maxp",A.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.numGlyphs=t.readUInt16(),this.maxPoints=t.readUInt16(),this.maxContours=t.readUInt16(),this.maxCompositePoints=t.readUInt16(),this.maxComponentContours=t.readUInt16(),this.maxZones=t.readUInt16(),this.maxTwilightPoints=t.readUInt16(),this.maxStorage=t.readUInt16(),this.maxFunctionDefs=t.readUInt16(),this.maxInstructionDefs=t.readUInt16(),this.maxStackElements=t.readUInt16(),this.maxSizeOfInstructions=t.readUInt16(),this.maxComponentElements=t.readUInt16(),this.maxComponentDepth=t.readUInt16()},A}(),v=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="hmtx",A.prototype.parse=function(t){var A,e,r,n,i,o,s;for(t.pos=this.offset,this.metrics=[],n=0,o=this.file.hhea.numberOfMetrics;0<=o?n<o:o<n;0<=o?++n:--n)this.metrics.push({advance:t.readUInt16(),lsb:t.readInt16()});for(e=this.file.maxp.numGlyphs-this.file.hhea.numberOfMetrics,this.leftSideBearings=function(){var A,r;for(r=[],A=0;0<=e?A<e:e<A;0<=e?++A:--A)r.push(t.readInt16());return r}(),this.widths=function(){var t,A,e,n;for(n=[],t=0,A=(e=this.metrics).length;t<A;t++)r=e[t],n.push(r.advance);return n}.call(this),A=this.widths[this.widths.length-1],s=[],i=0;0<=e?i<e:e<i;0<=e?++i:--i)s.push(this.widths.push(A));return s},A.prototype.forGlyph=function(t){return t in this.metrics?this.metrics[t]:{advance:this.metrics[this.metrics.length-1].advance,lsb:this.leftSideBearings[t-this.metrics.length]}},A}(),F=[].slice,U=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="glyf",A.prototype.parse=function(t){return this.cache={}},A.prototype.glyphFor=function(t){var A,e,r,n,i,o,s,a,c,l;return(t=t)in this.cache?this.cache[t]:(n=this.file.loca,A=this.file.contents,e=n.indexOf(t),0===(r=n.lengthOf(t))?this.cache[t]=null:(A.pos=this.offset+e,i=(o=new u(A.read(r))).readShort(),a=o.readShort(),l=o.readShort(),s=o.readShort(),c=o.readShort(),this.cache[t]=-1===i?new E(o,a,l,s,c):new N(o,i,a,l,s,c),this.cache[t]))},A.prototype.encode=function(t,A,e){var r,n,i,o,s;for(i=[],n=[],o=0,s=A.length;o<s;o++)r=t[A[o]],n.push(i.length),r&&(i=i.concat(r.encode(e)));return n.push(i.length),{table:i,offsets:n}},A}(),N=function(){function t(t,A,e,r,n,i){this.raw=t,this.numberOfContours=A,this.xMin=e,this.yMin=r,this.xMax=n,this.yMax=i,this.compound=!1}return t.prototype.encode=function(){return this.raw.data},t}(),E=function(){function t(t,A,e,r,n){var i,o;for(this.raw=t,this.xMin=A,this.yMin=e,this.xMax=r,this.yMax=n,this.compound=!0,this.glyphIDs=[],this.glyphOffsets=[],i=this.raw;o=i.readShort(),this.glyphOffsets.push(i.pos),this.glyphIDs.push(i.readShort()),32&o;)i.pos+=1&o?4:2,128&o?i.pos+=8:64&o?i.pos+=4:8&o&&(i.pos+=2)}return t.prototype.encode=function(t){var A,e,r,n,i;for(e=new u(F.call(this.raw.data)),A=r=0,n=(i=this.glyphIDs).length;r<n;A=++r)i[A],e.pos=this.glyphOffsets[A];return e.data},t}(),b=function(t){function A(){return A.__super__.constructor.apply(this,arguments)}return f(A,c),A.prototype.tag="loca",A.prototype.parse=function(t){var A;return t.pos=this.offset,A=this.file.head.indexToLocFormat,this.offsets=0===A?function(){var A,e,r;for(r=[],A=0,e=this.length;A<e;A+=2)r.push(2*t.readUInt16());return r}.call(this):function(){var A,e,r;for(r=[],A=0,e=this.length;A<e;A+=4)r.push(t.readUInt32());return r}.call(this)},A.prototype.indexOf=function(t){return this.offsets[t]},A.prototype.lengthOf=function(t){return this.offsets[t+1]-this.offsets[t]},A.prototype.encode=function(t,A){for(var e=new Uint32Array(this.offsets.length),r=0,n=0,i=0;i<e.length;++i)if(e[i]=r,n<A.length&&A[n]==i){++n,e[i]=r;var o=this.offsets[i],s=this.offsets[i+1]-o;0<s&&(r+=s)}for(var a=new Array(4*e.length),c=0;c<e.length;++c)a[4*c+3]=255&e[c],a[4*c+2]=(65280&e[c])>>8,a[4*c+1]=(16711680&e[c])>>16,a[4*c]=(4278190080&e[c])>>24;return a},A}(),L=function(){function t(t){this.font=t,this.subset={},this.unicodes={},this.next=33}return t.prototype.generateCmap=function(){var t,A,e,r,n;for(A in r=this.font.cmap.tables[0].codeMap,t={},n=this.subset)e=n[A],t[A]=r[e];return t},t.prototype.glyphsFor=function(t){var A,e,r,n,i,o,s;for(r={},i=0,o=t.length;i<o;i++)r[n=t[i]]=this.font.glyf.glyphFor(n);for(n in A=[],r)(null!=(e=r[n])?e.compound:void 0)&&A.push.apply(A,e.glyphIDs);if(0<A.length)for(n in s=this.glyphsFor(A))e=s[n],r[n]=e;return r},t.prototype.encode=function(t,A){var e,r,n,i,o,s,a,c,u,l,h,f,d,p,g;for(r in e=B.encode(this.generateCmap(),"unicode"),i=this.glyphsFor(t),h={0:0},g=e.charMap)h[(s=g[r]).old]=s.new;for(f in l=e.maxGlyphID,i)f in h||(h[f]=l++);return c=function(t){var A,e;for(A in e={},t)e[t[A]]=A;return e}(h),u=Object.keys(c).sort((function(t,A){return t-A})),d=function(){var t,A,e;for(e=[],t=0,A=u.length;t<A;t++)o=u[t],e.push(c[o]);return e}(),n=this.font.glyf.encode(i,d,h),a=this.font.loca.encode(n.offsets,d),p={cmap:this.font.cmap.raw(),glyf:n.table,loca:a,hmtx:this.font.hmtx.raw(),hhea:this.font.hhea.raw(),maxp:this.font.maxp.raw(),post:this.font.post.raw(),name:this.font.name.raw(),head:this.font.head.encode(A)},this.font.os2.exists&&(p["OS/2"]=this.font.os2.raw()),this.font.directory.encode(p)},t}();t.API.PDFObject=function(){var t;function A(){}return t=function(t,A){return(Array(A+1).join("0")+t).slice(-A)},A.convert=function(e){var r,n,i,o;if(Array.isArray(e))return"["+function(){var t,n,i;for(i=[],t=0,n=e.length;t<n;t++)r=e[t],i.push(A.convert(r));return i}().join(" ")+"]";if("string"==typeof e)return"/"+e;if(null!=e?e.isString:void 0)return"("+e+")";if(e instanceof Date)return"(D:"+t(e.getUTCFullYear(),4)+t(e.getUTCMonth(),2)+t(e.getUTCDate(),2)+t(e.getUTCHours(),2)+t(e.getUTCMinutes(),2)+t(e.getUTCSeconds(),2)+"Z)";if("[object Object]"!=={}.toString.call(e))return""+e;for(n in i=["<<"],e)o=e[n],i.push("/"+n+" "+A.convert(o));return i.push(">>"),i.join("\n")},A}()}(dt),bt="undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0!==r&&r||Function('return typeof this === "object" && this.content')()||Function("return this")(),Lt=function(){var t,A,e;function r(t){var A,e,r,n,i,o,s,a,c,u,l,h,f,d;for(this.data=t,this.pos=8,this.palette=[],this.imgData=[],this.transparency={},this.animation=null,this.text={},o=null;;){switch(A=this.readUInt32(),c=function(){var t,A;for(A=[],t=0;t<4;++t)A.push(String.fromCharCode(this.data[this.pos++]));return A}.call(this).join("")){case"IHDR":this.width=this.readUInt32(),this.height=this.readUInt32(),this.bits=this.data[this.pos++],this.colorType=this.data[this.pos++],this.compressionMethod=this.data[this.pos++],this.filterMethod=this.data[this.pos++],this.interlaceMethod=this.data[this.pos++];break;case"acTL":this.animation={numFrames:this.readUInt32(),numPlays:this.readUInt32()||1/0,frames:[]};break;case"PLTE":this.palette=this.read(A);break;case"fcTL":o&&this.animation.frames.push(o),this.pos+=4,o={width:this.readUInt32(),height:this.readUInt32(),xOffset:this.readUInt32(),yOffset:this.readUInt32()},i=this.readUInt16(),n=this.readUInt16()||100,o.delay=1e3*i/n,o.disposeOp=this.data[this.pos++],o.blendOp=this.data[this.pos++],o.data=[];break;case"IDAT":case"fdAT":for("fdAT"===c&&(this.pos+=4,A-=4),t=(null!=o?o.data:void 0)||this.imgData,h=0;0<=A?h<A:A<h;0<=A?++h:--h)t.push(this.data[this.pos++]);break;case"tRNS":switch(this.transparency={},this.colorType){case 3:if(r=this.palette.length/3,this.transparency.indexed=this.read(A),this.transparency.indexed.length>r)throw new Error("More transparent colors than palette size");if(0<(u=r-this.transparency.indexed.length))for(f=0;0<=u?f<u:u<f;0<=u?++f:--f)this.transparency.indexed.push(255);break;case 0:this.transparency.grayscale=this.read(A)[0];break;case 2:this.transparency.rgb=this.read(A)}break;case"tEXt":s=(l=this.read(A)).indexOf(0),a=String.fromCharCode.apply(String,l.slice(0,s)),this.text[a]=String.fromCharCode.apply(String,l.slice(s+1));break;case"IEND":return o&&this.animation.frames.push(o),this.colors=function(){switch(this.colorType){case 0:case 3:case 4:return 1;case 2:case 6:return 3}}.call(this),this.hasAlphaChannel=4===(d=this.colorType)||6===d,e=this.colors+(this.hasAlphaChannel?1:0),this.pixelBitlength=this.bits*e,this.colorSpace=function(){switch(this.colors){case 1:return"DeviceGray";case 3:return"DeviceRGB"}}.call(this),void(this.imgData=new Uint8Array(this.imgData));default:this.pos+=A}if(this.pos+=4,this.pos>this.data.length)throw new Error("Incomplete or corrupt PNG file")}}r.load=function(t,A,e){var n;return"function"==typeof A&&(e=A),(n=new XMLHttpRequest).open("GET",t,!0),n.responseType="arraybuffer",n.onload=function(){var t;return t=new r(new Uint8Array(n.response||n.mozResponseArrayBuffer)),"function"==typeof(null!=A?A.getContext:void 0)&&t.render(A),"function"==typeof e?e(t):void 0},n.send(null)},r.prototype.read=function(t){var A,e;for(e=[],A=0;0<=t?A<t:t<A;0<=t?++A:--A)e.push(this.data[this.pos++]);return e},r.prototype.readUInt32=function(){return this.data[this.pos++]<<24|this.data[this.pos++]<<16|this.data[this.pos++]<<8|this.data[this.pos++]},r.prototype.readUInt16=function(){return this.data[this.pos++]<<8|this.data[this.pos++]},r.prototype.decodePixels=function(t){var A=this.pixelBitlength/8,e=new Uint8Array(this.width*this.height*A),r=0,n=this;if(null==t&&(t=this.imgData),0===t.length)return new Uint8Array(0);function i(i,o,s,a){var c,u,l,h,f,d,p,B,g,w,m,Q,C,y,v,F,U,N,E,b,L,H=Math.ceil((n.width-i)/s),x=Math.ceil((n.height-o)/a),S=n.width==H&&n.height==x;for(y=A*H,Q=S?e:new Uint8Array(y*x),d=t.length,u=C=0;C<x&&r<d;){switch(t[r++]){case 0:for(h=U=0;U<y;h=U+=1)Q[u++]=t[r++];break;case 1:for(h=N=0;N<y;h=N+=1)c=t[r++],f=h<A?0:Q[u-A],Q[u++]=(c+f)%256;break;case 2:for(h=E=0;E<y;h=E+=1)c=t[r++],l=(h-h%A)/A,v=C&&Q[(C-1)*y+l*A+h%A],Q[u++]=(v+c)%256;break;case 3:for(h=b=0;b<y;h=b+=1)c=t[r++],l=(h-h%A)/A,f=h<A?0:Q[u-A],v=C&&Q[(C-1)*y+l*A+h%A],Q[u++]=(c+Math.floor((f+v)/2))%256;break;case 4:for(h=L=0;L<y;h=L+=1)c=t[r++],l=(h-h%A)/A,f=h<A?0:Q[u-A],0===C?v=F=0:(v=Q[(C-1)*y+l*A+h%A],F=l&&Q[(C-1)*y+(l-1)*A+h%A]),p=f+v-F,B=Math.abs(p-f),w=Math.abs(p-v),m=Math.abs(p-F),g=B<=w&&B<=m?f:w<=m?v:F,Q[u++]=(c+g)%256;break;default:throw new Error("Invalid filter algorithm: "+t[r-1])}if(!S){var I=((o+C*a)*n.width+i)*A,_=C*y;for(h=0;h<H;h+=1){for(var T=0;T<A;T+=1)e[I++]=Q[_++];I+=(s-1)*A}}C++}}return t=(t=new Rt(t)).getBytes(),1==n.interlaceMethod?(i(0,0,8,8),i(4,0,8,8),i(0,4,4,8),i(2,0,4,4),i(0,2,2,4),i(1,0,2,2),i(0,1,1,2)):i(0,0,1,1),e},r.prototype.decodePalette=function(){var t,A,e,r,n,i,o,s,a;for(e=this.palette,i=this.transparency.indexed||[],n=new Uint8Array((i.length||0)+e.length),r=0,e.length,A=o=t=0,s=e.length;o<s;A=o+=3)n[r++]=e[A],n[r++]=e[A+1],n[r++]=e[A+2],n[r++]=null!=(a=i[t++])?a:255;return n},r.prototype.copyToImageData=function(t,A){var e,r,n,i,o,s,a,c,u,l,h;if(r=this.colors,u=null,e=this.hasAlphaChannel,this.palette.length&&(u=null!=(h=this._decodedPalette)?h:this._decodedPalette=this.decodePalette(),r=4,e=!0),c=(n=t.data||t).length,o=u||A,i=s=0,1===r)for(;i<c;)a=u?4*A[i/4]:s,l=o[a++],n[i++]=l,n[i++]=l,n[i++]=l,n[i++]=e?o[a++]:255,s=a;else for(;i<c;)a=u?4*A[i/4]:s,n[i++]=o[a++],n[i++]=o[a++],n[i++]=o[a++],n[i++]=e?o[a++]:255,s=a},r.prototype.decode=function(){var t;return t=new Uint8Array(this.width*this.height*4),this.copyToImageData(t,this.decodePixels()),t};try{A=bt.document.createElement("canvas"),e=A.getContext("2d")}catch(t){return-1}return t=function(t){var r;return e.width=t.width,e.height=t.height,e.clearRect(0,0,t.width,t.height),e.putImageData(t,0,0),(r=new Image).src=A.toDataURL(),r},r.prototype.decodeFrames=function(A){var e,r,n,i,o,s,a,c;if(this.animation){for(c=[],r=o=0,s=(a=this.animation.frames).length;o<s;r=++o)e=a[r],n=A.createImageData(e.width,e.height),i=this.decodePixels(new Uint8Array(e.data)),this.copyToImageData(n,i),e.imageData=n,c.push(e.image=t(n));return c}},r.prototype.renderFrame=function(t,A){var e,r,n;return e=(r=this.animation.frames)[A],n=r[A-1],0===A&&t.clearRect(0,0,this.width,this.height),1===(null!=n?n.disposeOp:void 0)?t.clearRect(n.xOffset,n.yOffset,n.width,n.height):2===(null!=n?n.disposeOp:void 0)&&t.putImageData(n.imageData,n.xOffset,n.yOffset),0===e.blendOp&&t.clearRect(e.xOffset,e.yOffset,e.width,e.height),t.drawImage(e.image,e.xOffset,e.yOffset)},r.prototype.animate=function(t){var A,e,r,n,i,o,s=this;return e=0,o=this.animation,n=o.numFrames,r=o.frames,i=o.numPlays,(A=function(){var o,a;if(o=e++%n,a=r[o],s.renderFrame(t,o),1<n&&e/n<i)return s.animation._timeout=setTimeout(A,a.delay)})()},r.prototype.stopAnimation=function(){var t;return clearTimeout(null!=(t=this.animation)?t._timeout:void 0)},r.prototype.render=function(t){var A,e;return t._png&&t._png.stopAnimation(),t._png=this,t.width=this.width,t.height=this.height,A=t.getContext("2d"),this.animation?(this.decodeFrames(A),this.animate(A)):(e=A.createImageData(this.width,this.height),this.copyToImageData(e,this.decodePixels()),A.putImageData(e,0,0))},r}(),bt.PNG=Lt;var Tt=function(){function t(){this.pos=0,this.bufferLength=0,this.eof=!1,this.buffer=null}return t.prototype={ensureBuffer:function(t){var A=this.buffer,e=A?A.byteLength:0;if(t<e)return A;for(var r=512;r<t;)r<<=1;for(var n=new Uint8Array(r),i=0;i<e;++i)n[i]=A[i];return this.buffer=n},getByte:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock()}return this.buffer[this.pos++]},getBytes:function(t){var A=this.pos;if(t){this.ensureBuffer(A+t);for(var e=A+t;!this.eof&&this.bufferLength<e;)this.readBlock();var r=this.bufferLength;r<e&&(e=r)}else{for(;!this.eof;)this.readBlock();e=this.bufferLength}return this.pos=e,this.buffer.subarray(A,e)},lookChar:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock()}return String.fromCharCode(this.buffer[this.pos])},getChar:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock()}return String.fromCharCode(this.buffer[this.pos++])},makeSubStream:function(t,A,e){for(var r=t+A;this.bufferLength<=r&&!this.eof;)this.readBlock();return new Stream(this.buffer,t,A,e)},skip:function(t){t||(t=1),this.pos+=t},reset:function(){this.pos=0}},t}(),Rt=function(){if("undefined"!=typeof Uint32Array){var t=new Uint32Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),A=new Uint32Array([3,4,5,6,7,8,9,10,65547,65549,65551,65553,131091,131095,131099,131103,196643,196651,196659,196667,262211,262227,262243,262259,327811,327843,327875,327907,258,258,258]),e=new Uint32Array([1,2,3,4,65541,65543,131081,131085,196625,196633,262177,262193,327745,327777,393345,393409,459009,459137,524801,525057,590849,591361,657409,658433,724993,727041,794625,798721,868353,876545]),r=[new Uint32Array([459008,524368,524304,524568,459024,524400,524336,590016,459016,524384,524320,589984,524288,524416,524352,590048,459012,524376,524312,589968,459028,524408,524344,590032,459020,524392,524328,59e4,524296,524424,524360,590064,459010,524372,524308,524572,459026,524404,524340,590024,459018,524388,524324,589992,524292,524420,524356,590056,459014,524380,524316,589976,459030,524412,524348,590040,459022,524396,524332,590008,524300,524428,524364,590072,459009,524370,524306,524570,459025,524402,524338,590020,459017,524386,524322,589988,524290,524418,524354,590052,459013,524378,524314,589972,459029,524410,524346,590036,459021,524394,524330,590004,524298,524426,524362,590068,459011,524374,524310,524574,459027,524406,524342,590028,459019,524390,524326,589996,524294,524422,524358,590060,459015,524382,524318,589980,459031,524414,524350,590044,459023,524398,524334,590012,524302,524430,524366,590076,459008,524369,524305,524569,459024,524401,524337,590018,459016,524385,524321,589986,524289,524417,524353,590050,459012,524377,524313,589970,459028,524409,524345,590034,459020,524393,524329,590002,524297,524425,524361,590066,459010,524373,524309,524573,459026,524405,524341,590026,459018,524389,524325,589994,524293,524421,524357,590058,459014,524381,524317,589978,459030,524413,524349,590042,459022,524397,524333,590010,524301,524429,524365,590074,459009,524371,524307,524571,459025,524403,524339,590022,459017,524387,524323,589990,524291,524419,524355,590054,459013,524379,524315,589974,459029,524411,524347,590038,459021,524395,524331,590006,524299,524427,524363,590070,459011,524375,524311,524575,459027,524407,524343,590030,459019,524391,524327,589998,524295,524423,524359,590062,459015,524383,524319,589982,459031,524415,524351,590046,459023,524399,524335,590014,524303,524431,524367,590078,459008,524368,524304,524568,459024,524400,524336,590017,459016,524384,524320,589985,524288,524416,524352,590049,459012,524376,524312,589969,459028,524408,524344,590033,459020,524392,524328,590001,524296,524424,524360,590065,459010,524372,524308,524572,459026,524404,524340,590025,459018,524388,524324,589993,524292,524420,524356,590057,459014,524380,524316,589977,459030,524412,524348,590041,459022,524396,524332,590009,524300,524428,524364,590073,459009,524370,524306,524570,459025,524402,524338,590021,459017,524386,524322,589989,524290,524418,524354,590053,459013,524378,524314,589973,459029,524410,524346,590037,459021,524394,524330,590005,524298,524426,524362,590069,459011,524374,524310,524574,459027,524406,524342,590029,459019,524390,524326,589997,524294,524422,524358,590061,459015,524382,524318,589981,459031,524414,524350,590045,459023,524398,524334,590013,524302,524430,524366,590077,459008,524369,524305,524569,459024,524401,524337,590019,459016,524385,524321,589987,524289,524417,524353,590051,459012,524377,524313,589971,459028,524409,524345,590035,459020,524393,524329,590003,524297,524425,524361,590067,459010,524373,524309,524573,459026,524405,524341,590027,459018,524389,524325,589995,524293,524421,524357,590059,459014,524381,524317,589979,459030,524413,524349,590043,459022,524397,524333,590011,524301,524429,524365,590075,459009,524371,524307,524571,459025,524403,524339,590023,459017,524387,524323,589991,524291,524419,524355,590055,459013,524379,524315,589975,459029,524411,524347,590039,459021,524395,524331,590007,524299,524427,524363,590071,459011,524375,524311,524575,459027,524407,524343,590031,459019,524391,524327,589999,524295,524423,524359,590063,459015,524383,524319,589983,459031,524415,524351,590047,459023,524399,524335,590015,524303,524431,524367,590079]),9],n=[new Uint32Array([327680,327696,327688,327704,327684,327700,327692,327708,327682,327698,327690,327706,327686,327702,327694,0,327681,327697,327689,327705,327685,327701,327693,327709,327683,327699,327691,327707,327687,327703,327695,0]),5];return(o.prototype=Object.create(Tt.prototype)).getBits=function(t){for(var A,e=this.codeSize,r=this.codeBuf,n=this.bytes,o=this.bytesPos;e<t;)void 0===(A=n[o++])&&i("Bad encoding in flate stream"),r|=A<<e,e+=8;return A=r&(1<<t)-1,this.codeBuf=r>>t,this.codeSize=e-=t,this.bytesPos=o,A},o.prototype.getCode=function(t){for(var A=t[0],e=t[1],r=this.codeSize,n=this.codeBuf,o=this.bytes,s=this.bytesPos;r<e;){var a;void 0===(a=o[s++])&&i("Bad encoding in flate stream"),n|=a<<r,r+=8}var c=A[n&(1<<e)-1],u=c>>16,l=65535&c;return(0==r||r<u||0==u)&&i("Bad encoding in flate stream"),this.codeBuf=n>>u,this.codeSize=r-u,this.bytesPos=s,l},o.prototype.generateHuffmanTable=function(t){for(var A=t.length,e=0,r=0;r<A;++r)t[r]>e&&(e=t[r]);for(var n=1<<e,i=new Uint32Array(n),o=1,s=0,a=2;o<=e;++o,s<<=1,a<<=1)for(var c=0;c<A;++c)if(t[c]==o){var u=0,l=s;for(r=0;r<o;++r)u=u<<1|1&l,l>>=1;for(r=u;r<n;r+=a)i[r]=o<<16|c;++s}return[i,e]},o.prototype.readBlock=function(){function o(t,A,e,r,n){for(var i=t.getBits(e)+r;0<i--;)A[d++]=n}var s=this.getBits(3);if(1&s&&(this.eof=!0),0!=(s>>=1)){var a,c;if(1==s)a=r,c=n;else if(2==s){for(var u=this.getBits(5)+257,l=this.getBits(5)+1,h=this.getBits(4)+4,f=Array(t.length),d=0;d<h;)f[t[d++]]=this.getBits(3);for(var p=this.generateHuffmanTable(f),B=0,g=(d=0,u+l),w=new Array(g);d<g;){var m=this.getCode(p);16==m?o(this,w,2,3,B):17==m?o(this,w,3,3,B=0):18==m?o(this,w,7,11,B=0):w[d++]=B=m}a=this.generateHuffmanTable(w.slice(0,u)),c=this.generateHuffmanTable(w.slice(u,g))}else i("Unknown block type in flate stream");for(var Q=(S=this.buffer)?S.length:0,C=this.bufferLength;;){var y=this.getCode(a);if(y<256)Q<=C+1&&(Q=(S=this.ensureBuffer(C+1)).length),S[C++]=y;else{if(256==y)return void(this.bufferLength=C);var v=(y=A[y-=257])>>16;0<v&&(v=this.getBits(v)),B=(65535&y)+v,y=this.getCode(c),0<(v=(y=e[y])>>16)&&(v=this.getBits(v));var F=(65535&y)+v;Q<=C+B&&(Q=(S=this.ensureBuffer(C+B)).length);for(var U=0;U<B;++U,++C)S[C]=S[C-F]}}}else{var N,E=this.bytes,b=this.bytesPos;void 0===(N=E[b++])&&i("Bad block header in flate stream");var L=N;void 0===(N=E[b++])&&i("Bad block header in flate stream"),L|=N<<8,void 0===(N=E[b++])&&i("Bad block header in flate stream");var H=N;void 0===(N=E[b++])&&i("Bad block header in flate stream"),(H|=N<<8)!=(65535&~L)&&i("Bad uncompressed block length in flate stream"),this.codeBuf=0,this.codeSize=0;var x=this.bufferLength,S=this.ensureBuffer(x+L),I=x+L;this.bufferLength=I;for(var _=x;_<I;++_){if(void 0===(N=E[b++])){this.eof=!0;break}S[_]=N}this.bytesPos=b}},o}function i(t){throw new Error(t)}function o(t){var A=0,e=t[A++],r=t[A++];-1!=e&&-1!=r||i("Invalid header in flate stream"),8!=(15&e)&&i("Unknown compression method in flate stream"),((e<<8)+r)%31!=0&&i("Bad FCHECK in flate stream"),32&r&&i("FDICT bit set in flate stream"),this.bytes=t,this.bytesPos=2,this.codeSize=0,this.codeBuf=0,Tt.call(this)}}();window.tmp=Rt},void 0===(i="function"==typeof n?n.call(A,e,A,t):n)||(t.exports=i);try{t.exports=jsPDF}catch(t){}}).call(this,e(4))},function(t,A,e){
/*!
 * html2canvas 1.0.0-rc.5 <https://html2canvas.hertzen.com>
 * Copyright (c) 2019 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
t.exports=function(){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */var t=function(A,e){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,A){t.__proto__=A}||function(t,A){for(var e in A)A.hasOwnProperty(e)&&(t[e]=A[e])})(A,e)};function A(A,e){function r(){this.constructor=A}t(A,e),A.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}var e=function(){return(e=Object.assign||function(t){for(var A,e=1,r=arguments.length;e<r;e++)for(var n in A=arguments[e])Object.prototype.hasOwnProperty.call(A,n)&&(t[n]=A[n]);return t}).apply(this,arguments)};function r(t,A,e,r){return new(e||(e=Promise))((function(n,i){function o(t){try{a(r.next(t))}catch(t){i(t)}}function s(t){try{a(r.throw(t))}catch(t){i(t)}}function a(t){t.done?n(t.value):new e((function(A){A(t.value)})).then(o,s)}a((r=r.apply(t,A||[])).next())}))}function n(t,A){var e,r,n,i,o={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;o;)try{if(e=1,r&&(n=2&i[0]?r.return:i[0]?r.throw||((n=r.return)&&n.call(r),0):r.next)&&!(n=n.call(r,i[1])).done)return n;switch(r=0,n&&(i=[2&i[0],n.value]),i[0]){case 0:case 1:n=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,r=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!((n=(n=o.trys).length>0&&n[n.length-1])||6!==i[0]&&2!==i[0])){o=0;continue}if(3===i[0]&&(!n||i[1]>n[0]&&i[1]<n[3])){o.label=i[1];break}if(6===i[0]&&o.label<n[1]){o.label=n[1],n=i;break}if(n&&o.label<n[2]){o.label=n[2],o.ops.push(i);break}n[2]&&o.ops.pop(),o.trys.pop();continue}i=A.call(t,o)}catch(t){i=[6,t],r=0}finally{e=n=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}}for(var i=function(){function t(t,A,e,r){this.left=t,this.top=A,this.width=e,this.height=r}return t.prototype.add=function(A,e,r,n){return new t(this.left+A,this.top+e,this.width+r,this.height+n)},t.fromClientRect=function(A){return new t(A.left,A.top,A.width,A.height)},t}(),o=function(t){return i.fromClientRect(t.getBoundingClientRect())},s=function(t){for(var A=[],e=0,r=t.length;e<r;){var n=t.charCodeAt(e++);if(n>=55296&&n<=56319&&e<r){var i=t.charCodeAt(e++);56320==(64512&i)?A.push(((1023&n)<<10)+(1023&i)+65536):(A.push(n),e--)}else A.push(n)}return A},a=function(){for(var t=[],A=0;A<arguments.length;A++)t[A]=arguments[A];if(String.fromCodePoint)return String.fromCodePoint.apply(String,t);var e=t.length;if(!e)return"";for(var r=[],n=-1,i="";++n<e;){var o=t[n];o<=65535?r.push(o):(o-=65536,r.push(55296+(o>>10),o%1024+56320)),(n+1===e||r.length>16384)&&(i+=String.fromCharCode.apply(String,r),r.length=0)}return i},c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",u="undefined"==typeof Uint8Array?[]:new Uint8Array(256),l=0;l<c.length;l++)u[c.charCodeAt(l)]=l;var h,f=function(t,A,e){return t.slice?t.slice(A,e):new Uint16Array(Array.prototype.slice.call(t,A,e))},d=function(){function t(t,A,e,r,n,i){this.initialValue=t,this.errorValue=A,this.highStart=e,this.highValueIndex=r,this.index=n,this.data=i}return t.prototype.get=function(t){var A;if(t>=0){if(t<55296||t>56319&&t<=65535)return A=((A=this.index[t>>5])<<2)+(31&t),this.data[A];if(t<=65535)return A=((A=this.index[2048+(t-55296>>5)])<<2)+(31&t),this.data[A];if(t<this.highStart)return A=2080+(t>>11),A=this.index[A],A+=t>>5&63,A=((A=this.index[A])<<2)+(31&t),this.data[A];if(t<=1114111)return this.data[this.highValueIndex]}return this.errorValue},t}(),p=10,B=13,g=15,w=17,m=18,Q=19,C=20,y=21,v=22,F=24,U=25,N=26,E=27,b=28,L=30,H=32,x=33,S=34,I=35,_=37,T=38,R=39,O=40,K=42,M=function(t){var A,e,r,n=function(t){var A,e,r,n,i,o=.75*t.length,s=t.length,a=0;"="===t[t.length-1]&&(o--,"="===t[t.length-2]&&o--);var c="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array&&void 0!==Uint8Array.prototype.slice?new ArrayBuffer(o):new Array(o),l=Array.isArray(c)?c:new Uint8Array(c);for(A=0;A<s;A+=4)e=u[t.charCodeAt(A)],r=u[t.charCodeAt(A+1)],n=u[t.charCodeAt(A+2)],i=u[t.charCodeAt(A+3)],l[a++]=e<<2|r>>4,l[a++]=(15&r)<<4|n>>2,l[a++]=(3&n)<<6|63&i;return c}(t),i=Array.isArray(n)?function(t){for(var A=t.length,e=[],r=0;r<A;r+=4)e.push(t[r+3]<<24|t[r+2]<<16|t[r+1]<<8|t[r]);return e}(n):new Uint32Array(n),o=Array.isArray(n)?function(t){for(var A=t.length,e=[],r=0;r<A;r+=2)e.push(t[r+1]<<8|t[r]);return e}(n):new Uint16Array(n),s=f(o,12,i[4]/2),a=2===i[5]?f(o,(24+i[4])/2):(A=i,e=Math.ceil((24+i[4])/4),A.slice?A.slice(e,r):new Uint32Array(Array.prototype.slice.call(A,e,r)));return new d(i[0],i[1],i[2],i[3],s,a)}("KwAAAAAAAAAACA4AIDoAAPAfAAACAAAAAAAIABAAGABAAEgAUABYAF4AZgBeAGYAYABoAHAAeABeAGYAfACEAIAAiACQAJgAoACoAK0AtQC9AMUAXgBmAF4AZgBeAGYAzQDVAF4AZgDRANkA3gDmAOwA9AD8AAQBDAEUARoBIgGAAIgAJwEvATcBPwFFAU0BTAFUAVwBZAFsAXMBewGDATAAiwGTAZsBogGkAawBtAG8AcIBygHSAdoB4AHoAfAB+AH+AQYCDgIWAv4BHgImAi4CNgI+AkUCTQJTAlsCYwJrAnECeQKBAk0CiQKRApkCoQKoArACuALAAsQCzAIwANQC3ALkAjAA7AL0AvwCAQMJAxADGAMwACADJgMuAzYDPgOAAEYDSgNSA1IDUgNaA1oDYANiA2IDgACAAGoDgAByA3YDfgOAAIQDgACKA5IDmgOAAIAAogOqA4AAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAK8DtwOAAIAAvwPHA88D1wPfAyAD5wPsA/QD/AOAAIAABAQMBBIEgAAWBB4EJgQuBDMEIAM7BEEEXgBJBCADUQRZBGEEaQQwADAAcQQ+AXkEgQSJBJEEgACYBIAAoASoBK8EtwQwAL8ExQSAAIAAgACAAIAAgACgAM0EXgBeAF4AXgBeAF4AXgBeANUEXgDZBOEEXgDpBPEE+QQBBQkFEQUZBSEFKQUxBTUFPQVFBUwFVAVcBV4AYwVeAGsFcwV7BYMFiwWSBV4AmgWgBacFXgBeAF4AXgBeAKsFXgCyBbEFugW7BcIFwgXIBcIFwgXQBdQF3AXkBesF8wX7BQMGCwYTBhsGIwYrBjMGOwZeAD8GRwZNBl4AVAZbBl4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAGMGXgBqBnEGXgBeAF4AXgBeAF4AXgBeAF4AXgB5BoAG4wSGBo4GkwaAAIADHgR5AF4AXgBeAJsGgABGA4AAowarBrMGswagALsGwwbLBjAA0wbaBtoG3QbaBtoG2gbaBtoG2gblBusG8wb7BgMHCwcTBxsHCwcjBysHMAc1BzUHOgdCB9oGSgdSB1oHYAfaBloHaAfaBlIH2gbaBtoG2gbaBtoG2gbaBjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHbQdeAF4ANQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQd1B30HNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B4MH2gaKB68EgACAAIAAgACAAIAAgACAAI8HlwdeAJ8HpweAAIAArwe3B14AXgC/B8UHygcwANAH2AfgB4AA6AfwBz4B+AcACFwBCAgPCBcIogEYAR8IJwiAAC8INwg/CCADRwhPCFcIXwhnCEoDGgSAAIAAgABvCHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIhAiLCI4IMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAANQc1BzUHNQc1BzUHNQc1BzUHNQc1B54INQc1B6II2gaqCLIIugiAAIAAvgjGCIAAgACAAIAAgACAAIAAgACAAIAAywiHAYAA0wiAANkI3QjlCO0I9Aj8CIAAgACAAAIJCgkSCRoJIgknCTYHLwk3CZYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiAAIAAAAFAAXgBeAGAAcABeAHwAQACQAKAArQC9AJ4AXgBeAE0A3gBRAN4A7AD8AMwBGgEAAKcBNwEFAUwBXAF4QkhCmEKnArcCgAHHAsABz4LAAcABwAHAAd+C6ABoAG+C/4LAAcABwAHAAc+DF4MAAcAB54M3gweDV4Nng3eDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEeDqABVg6WDqABoQ6gAaABoAHXDvcONw/3DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DncPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB7cPPwlGCU4JMACAAIAAgABWCV4JYQmAAGkJcAl4CXwJgAkwADAAMAAwAIgJgACLCZMJgACZCZ8JowmrCYAAswkwAF4AXgB8AIAAuwkABMMJyQmAAM4JgADVCTAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAqwYWBNkIMAAwADAAMADdCeAJ6AnuCR4E9gkwAP4JBQoNCjAAMACAABUK0wiAAB0KJAosCjQKgAAwADwKQwqAAEsKvQmdCVMKWwowADAAgACAALcEMACAAGMKgABrCjAAMAAwADAAMAAwADAAMAAwADAAMAAeBDAAMAAwADAAMAAwADAAMAAwADAAMAAwAIkEPQFzCnoKiQSCCooKkAqJBJgKoAqkCokEGAGsCrQKvArBCjAAMADJCtEKFQHZCuEK/gHpCvEKMAAwADAAMACAAIwE+QowAIAAPwEBCzAAMAAwADAAMACAAAkLEQswAIAAPwEZCyELgAAOCCkLMAAxCzkLMAAwADAAMAAwADAAXgBeAEELMAAwADAAMAAwADAAMAAwAEkLTQtVC4AAXAtkC4AAiQkwADAAMAAwADAAMAAwADAAbAtxC3kLgAuFC4sLMAAwAJMLlwufCzAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAApwswADAAMACAAIAAgACvC4AAgACAAIAAgACAALcLMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAvwuAAMcLgACAAIAAgACAAIAAyguAAIAAgACAAIAA0QswADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAANkLgACAAIAA4AswADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACJCR4E6AswADAAhwHwC4AA+AsADAgMEAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMACAAIAAGAwdDCUMMAAwAC0MNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQw1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHPQwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADUHNQc1BzUHNQc1BzUHNQc2BzAAMAA5DDUHNQc1BzUHNQc1BzUHNQc1BzUHNQdFDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAATQxSDFoMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAF4AXgBeAF4AXgBeAF4AYgxeAGoMXgBxDHkMfwxeAIUMXgBeAI0MMAAwADAAMAAwAF4AXgCVDJ0MMAAwADAAMABeAF4ApQxeAKsMswy7DF4Awgy9DMoMXgBeAF4AXgBeAF4AXgBeAF4AXgDRDNkMeQBqCeAM3Ax8AOYM7Az0DPgMXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgCgAAANoAAHDQ4NFg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAeDSYNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAC4NMABeAF4ANg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAD4NRg1ODVYNXg1mDTAAbQ0wADAAMAAwADAAMAAwADAA2gbaBtoG2gbaBtoG2gbaBnUNeg3CBYANwgWFDdoGjA3aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gaUDZwNpA2oDdoG2gawDbcNvw3HDdoG2gbPDdYN3A3fDeYN2gbsDfMN2gbaBvoN/g3aBgYODg7aBl4AXgBeABYOXgBeACUG2gYeDl4AJA5eACwO2w3aBtoGMQ45DtoG2gbaBtoGQQ7aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B1EO2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQdZDjUHNQc1BzUHNQc1B2EONQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHaA41BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B3AO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B2EO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBkkOeA6gAKAAoAAwADAAMAAwAKAAoACgAKAAoACgAKAAgA4wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAD//wQABAAEAAQABAAEAAQABAAEAA0AAwABAAEAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAKABMAFwAeABsAGgAeABcAFgASAB4AGwAYAA8AGAAcAEsASwBLAEsASwBLAEsASwBLAEsAGAAYAB4AHgAeABMAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAFgAbABIAHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYADQARAB4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkAFgAaABsAGwAbAB4AHQAdAB4ATwAXAB4ADQAeAB4AGgAbAE8ATwAOAFAAHQAdAB0ATwBPABcATwBPAE8AFgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwArAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAAQABAANAA0ASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAUAArACsAKwArACsAKwArACsABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAGgAaAFAAUABQAFAAUABMAB4AGwBQAB4AKwArACsABAAEAAQAKwBQAFAAUABQAFAAUAArACsAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUAArAFAAUAArACsABAArAAQABAAEAAQABAArACsAKwArAAQABAArACsABAAEAAQAKwArACsABAArACsAKwArACsAKwArAFAAUABQAFAAKwBQACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwAEAAQAUABQAFAABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQAKwArAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeABsAKwArACsAKwArACsAKwBQAAQABAAEAAQABAAEACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAKwArACsAKwArACsAKwArAAQABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwAEAFAAKwBQAFAAUABQAFAAUAArACsAKwBQAFAAUAArAFAAUABQAFAAKwArACsAUABQACsAUAArAFAAUAArACsAKwBQAFAAKwArACsAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQAKwArACsABAAEAAQAKwAEAAQABAAEACsAKwBQACsAKwArACsAKwArAAQAKwArACsAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAB4AHgAeAB4AHgAeABsAHgArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArAFAAUABQACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAB4AUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArACsAKwArACsAKwArAFAAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwArAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAKwBcAFwAKwBcACsAKwBcACsAKwArACsAKwArAFwAXABcAFwAKwBcAFwAXABcAFwAXABcACsAXABcAFwAKwBcACsAXAArACsAXABcACsAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgArACoAKgBcACsAKwBcAFwAXABcAFwAKwBcACsAKgAqACoAKgAqACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAFwAXABcAFwAUAAOAA4ADgAOAB4ADgAOAAkADgAOAA0ACQATABMAEwATABMACQAeABMAHgAeAB4ABAAEAB4AHgAeAB4AHgAeAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUAANAAQAHgAEAB4ABAAWABEAFgARAAQABABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAAQABAAEAAQABAANAAQABABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsADQANAB4AHgAeAB4AHgAeAAQAHgAeAB4AHgAeAB4AKwAeAB4ADgAOAA0ADgAeAB4AHgAeAB4ACQAJACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgAeAB4AHgBcAFwAXABcAFwAXAAqACoAKgAqAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAKgAqACoAKgAqACoAKgBcAFwAXAAqACoAKgAqAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAXAAqAEsASwBLAEsASwBLAEsASwBLAEsAKgAqACoAKgAqACoAUABQAFAAUABQAFAAKwBQACsAKwArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQACsAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwAEAAQABAAeAA0AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAEQArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAADQANAA0AUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAA0ADQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoADQANABUAXAANAB4ADQAbAFwAKgArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAB4AHgATABMADQANAA4AHgATABMAHgAEAAQABAAJACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAUABQAFAAUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwAeACsAKwArABMAEwBLAEsASwBLAEsASwBLAEsASwBLAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwBcAFwAXABcAFwAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcACsAKwArACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwAeAB4AXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsABABLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKgAqACoAKgAqACoAKgBcACoAKgAqACoAKgAqACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAUABQAFAAUABQAFAAUAArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4ADQANAA0ADQAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAHgAeAB4AHgBQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwANAA0ADQANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwBQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsABAAEAAQAHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAABABQAFAAUABQAAQABAAEAFAAUAAEAAQABAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAKwBQACsAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAKwArAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAKwAeAB4AHgAeAB4AHgAeAA4AHgArAA0ADQANAA0ADQANAA0ACQANAA0ADQAIAAQACwAEAAQADQAJAA0ADQAMAB0AHQAeABcAFwAWABcAFwAXABYAFwAdAB0AHgAeABQAFAAUAA0AAQABAAQABAAEAAQABAAJABoAGgAaABoAGgAaABoAGgAeABcAFwAdABUAFQAeAB4AHgAeAB4AHgAYABYAEQAVABUAFQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgANAB4ADQANAA0ADQAeAA0ADQANAAcAHgAeAB4AHgArAAQABAAEAAQABAAEAAQABAAEAAQAUABQACsAKwBPAFAAUABQAFAAUAAeAB4AHgAWABEATwBQAE8ATwBPAE8AUABQAFAAUABQAB4AHgAeABYAEQArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGgAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgBQABoAHgAdAB4AUAAeABoAHgAeAB4AHgAeAB4AHgAeAB4ATwAeAFAAGwAeAB4AUABQAFAAUABQAB4AHgAeAB0AHQAeAFAAHgBQAB4AUAAeAFAATwBQAFAAHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AUABQAFAAUABPAE8AUABQAFAAUABQAE8AUABQAE8AUABPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAE8ATwBPAE8ATwBPAE8ATwBPAE8AUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAATwAeAB4AKwArACsAKwAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB0AHQAeAB4AHgAdAB0AHgAeAB0AHgAeAB4AHQAeAB0AGwAbAB4AHQAeAB4AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB0AHgAdAB4AHQAdAB0AHQAdAB0AHgAdAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAdAB0AHQAdAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAlACUAHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB0AHQAeAB4AHgAeAB0AHQAdAB4AHgAdAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB0AHQAeAB4AHQAeAB4AHgAeAB0AHQAeAB4AHgAeACUAJQAdAB0AJQAeACUAJQAlACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHQAdAB0AHgAdACUAHQAdAB4AHQAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHQAdAB0AHQAlAB4AJQAlACUAHQAlACUAHQAdAB0AJQAlAB0AHQAlAB0AHQAlACUAJQAeAB0AHgAeAB4AHgAdAB0AJQAdAB0AHQAdAB0AHQAlACUAJQAlACUAHQAlACUAIAAlAB0AHQAlACUAJQAlACUAJQAlACUAHgAeAB4AJQAlACAAIAAgACAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeABcAFwAXABcAFwAXAB4AEwATACUAHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACUAJQBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwArACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAE8ATwBPAE8ATwBPAE8ATwAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeACsAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUAArACsAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQBQAFAAUABQACsAKwArACsAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAABAAEAAQAKwAEAAQAKwArACsAKwArAAQABAAEAAQAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsABAAEAAQAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsADQANAA0ADQANAA0ADQANAB4AKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAUABQAFAAUABQAA0ADQANAA0ADQANABQAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwANAA0ADQANAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAeAAQABAAEAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLACsADQArAB4AKwArAAQABAAEAAQAUABQAB4AUAArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwAEAAQABAAEAAQABAAEAAQABAAOAA0ADQATABMAHgAeAB4ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0AUABQAFAAUAAEAAQAKwArAAQADQANAB4AUAArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXABcAA0ADQANACoASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUAArACsAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANACsADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEcARwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwAeAAQABAANAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAEAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUAArACsAUAArACsAUABQACsAKwBQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAeAB4ADQANAA0ADQAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAArAAQABAArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAEAAQABAAEAAQABAAEACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAFgAWAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAKwBQACsAKwArACsAKwArAFAAKwArACsAKwBQACsAUAArAFAAKwBQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQACsAUAArAFAAKwBQACsAUABQACsAUAArACsAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAUABQAFAAUAArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUAArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAlACUAJQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeACUAJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeACUAJQAlACUAJQAeACUAJQAlACUAJQAgACAAIAAlACUAIAAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIQAhACEAIQAhACUAJQAgACAAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAIAAlACUAJQAlACAAJQAgACAAIAAgACAAIAAgACAAIAAlACUAJQAgACUAJQAlACUAIAAgACAAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeACUAHgAlAB4AJQAlACUAJQAlACAAJQAlACUAJQAeACUAHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAIAAgACAAIAAgAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFwAXABcAFQAVABUAHgAeAB4AHgAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAlACAAIAAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsA"),P=[L,36],D=[1,2,3,5],k=[p,8],z=[E,N],j=D.concat(k),q=[T,R,O,S,I],V=[g,B],X=function(t,A,e,r){var n=r[e];if(Array.isArray(t)?-1!==t.indexOf(n):t===n)for(var i=e;i<=r.length;){if((a=r[++i])===A)return!0;if(a!==p)break}if(n===p)for(i=e;i>0;){var o=r[--i];if(Array.isArray(t)?-1!==t.indexOf(o):t===o)for(var s=e;s<=r.length;){var a;if((a=r[++s])===A)return!0;if(a!==p)break}if(o!==p)break}return!1},G=function(t,A){for(var e=t;e>=0;){var r=A[e];if(r!==p)return r;e--}return 0},J=function(t,A,e,r,n){if(0===e[r])return"×";var i=r-1;if(Array.isArray(n)&&!0===n[i])return"×";var o=i-1,s=i+1,a=A[i],c=o>=0?A[o]:0,u=A[s];if(2===a&&3===u)return"×";if(-1!==D.indexOf(a))return"!";if(-1!==D.indexOf(u))return"×";if(-1!==k.indexOf(u))return"×";if(8===G(i,A))return"÷";if(11===M.get(t[i])&&(u===_||u===H||u===x))return"×";if(7===a||7===u)return"×";if(9===a)return"×";if(-1===[p,B,g].indexOf(a)&&9===u)return"×";if(-1!==[w,m,Q,F,b].indexOf(u))return"×";if(G(i,A)===v)return"×";if(X(23,v,i,A))return"×";if(X([w,m],y,i,A))return"×";if(X(12,12,i,A))return"×";if(a===p)return"÷";if(23===a||23===u)return"×";if(16===u||16===a)return"÷";if(-1!==[B,g,y].indexOf(u)||14===a)return"×";if(36===c&&-1!==V.indexOf(a))return"×";if(a===b&&36===u)return"×";if(u===C&&-1!==P.concat(C,Q,U,_,H,x).indexOf(a))return"×";if(-1!==P.indexOf(u)&&a===U||-1!==P.indexOf(a)&&u===U)return"×";if(a===E&&-1!==[_,H,x].indexOf(u)||-1!==[_,H,x].indexOf(a)&&u===N)return"×";if(-1!==P.indexOf(a)&&-1!==z.indexOf(u)||-1!==z.indexOf(a)&&-1!==P.indexOf(u))return"×";if(-1!==[E,N].indexOf(a)&&(u===U||-1!==[v,g].indexOf(u)&&A[s+1]===U)||-1!==[v,g].indexOf(a)&&u===U||a===U&&-1!==[U,b,F].indexOf(u))return"×";if(-1!==[U,b,F,w,m].indexOf(u))for(var l=i;l>=0;){if((h=A[l])===U)return"×";if(-1===[b,F].indexOf(h))break;l--}if(-1!==[E,N].indexOf(u))for(l=-1!==[w,m].indexOf(a)?o:i;l>=0;){var h;if((h=A[l])===U)return"×";if(-1===[b,F].indexOf(h))break;l--}if(T===a&&-1!==[T,R,S,I].indexOf(u)||-1!==[R,S].indexOf(a)&&-1!==[R,O].indexOf(u)||-1!==[O,I].indexOf(a)&&u===O)return"×";if(-1!==q.indexOf(a)&&-1!==[C,N].indexOf(u)||-1!==q.indexOf(u)&&a===E)return"×";if(-1!==P.indexOf(a)&&-1!==P.indexOf(u))return"×";if(a===F&&-1!==P.indexOf(u))return"×";if(-1!==P.concat(U).indexOf(a)&&u===v||-1!==P.concat(U).indexOf(u)&&a===m)return"×";if(41===a&&41===u){for(var f=e[i],d=1;f>0&&41===A[--f];)d++;if(d%2!=0)return"×"}return a===H&&u===x?"×":"÷"},W=function(t,A){A||(A={lineBreak:"normal",wordBreak:"normal"});var e=function(t,A){void 0===A&&(A="strict");var e=[],r=[],n=[];return t.forEach((function(t,i){var o=M.get(t);if(o>50?(n.push(!0),o-=50):n.push(!1),-1!==["normal","auto","loose"].indexOf(A)&&-1!==[8208,8211,12316,12448].indexOf(t))return r.push(i),e.push(16);if(4===o||11===o){if(0===i)return r.push(i),e.push(L);var s=e[i-1];return-1===j.indexOf(s)?(r.push(r[i-1]),e.push(s)):(r.push(i),e.push(L))}return r.push(i),31===o?e.push("strict"===A?y:_):o===K||29===o?e.push(L):43===o?t>=131072&&t<=196605||t>=196608&&t<=262141?e.push(_):e.push(L):void e.push(o)})),[r,e,n]}(t,A.lineBreak),r=e[0],n=e[1],i=e[2];return"break-all"!==A.wordBreak&&"break-word"!==A.wordBreak||(n=n.map((function(t){return-1!==[U,L,K].indexOf(t)?_:t}))),[r,n,"keep-all"===A.wordBreak?i.map((function(A,e){return A&&t[e]>=19968&&t[e]<=40959})):void 0]},Y=function(){function t(t,A,e,r){this.codePoints=t,this.required="!"===A,this.start=e,this.end=r}return t.prototype.slice=function(){return a.apply(void 0,this.codePoints.slice(this.start,this.end))},t}();!function(t){t[t.STRING_TOKEN=0]="STRING_TOKEN",t[t.BAD_STRING_TOKEN=1]="BAD_STRING_TOKEN",t[t.LEFT_PARENTHESIS_TOKEN=2]="LEFT_PARENTHESIS_TOKEN",t[t.RIGHT_PARENTHESIS_TOKEN=3]="RIGHT_PARENTHESIS_TOKEN",t[t.COMMA_TOKEN=4]="COMMA_TOKEN",t[t.HASH_TOKEN=5]="HASH_TOKEN",t[t.DELIM_TOKEN=6]="DELIM_TOKEN",t[t.AT_KEYWORD_TOKEN=7]="AT_KEYWORD_TOKEN",t[t.PREFIX_MATCH_TOKEN=8]="PREFIX_MATCH_TOKEN",t[t.DASH_MATCH_TOKEN=9]="DASH_MATCH_TOKEN",t[t.INCLUDE_MATCH_TOKEN=10]="INCLUDE_MATCH_TOKEN",t[t.LEFT_CURLY_BRACKET_TOKEN=11]="LEFT_CURLY_BRACKET_TOKEN",t[t.RIGHT_CURLY_BRACKET_TOKEN=12]="RIGHT_CURLY_BRACKET_TOKEN",t[t.SUFFIX_MATCH_TOKEN=13]="SUFFIX_MATCH_TOKEN",t[t.SUBSTRING_MATCH_TOKEN=14]="SUBSTRING_MATCH_TOKEN",t[t.DIMENSION_TOKEN=15]="DIMENSION_TOKEN",t[t.PERCENTAGE_TOKEN=16]="PERCENTAGE_TOKEN",t[t.NUMBER_TOKEN=17]="NUMBER_TOKEN",t[t.FUNCTION=18]="FUNCTION",t[t.FUNCTION_TOKEN=19]="FUNCTION_TOKEN",t[t.IDENT_TOKEN=20]="IDENT_TOKEN",t[t.COLUMN_TOKEN=21]="COLUMN_TOKEN",t[t.URL_TOKEN=22]="URL_TOKEN",t[t.BAD_URL_TOKEN=23]="BAD_URL_TOKEN",t[t.CDC_TOKEN=24]="CDC_TOKEN",t[t.CDO_TOKEN=25]="CDO_TOKEN",t[t.COLON_TOKEN=26]="COLON_TOKEN",t[t.SEMICOLON_TOKEN=27]="SEMICOLON_TOKEN",t[t.LEFT_SQUARE_BRACKET_TOKEN=28]="LEFT_SQUARE_BRACKET_TOKEN",t[t.RIGHT_SQUARE_BRACKET_TOKEN=29]="RIGHT_SQUARE_BRACKET_TOKEN",t[t.UNICODE_RANGE_TOKEN=30]="UNICODE_RANGE_TOKEN",t[t.WHITESPACE_TOKEN=31]="WHITESPACE_TOKEN",t[t.EOF_TOKEN=32]="EOF_TOKEN"}(h||(h={}));var Z=function(t){return t>=48&&t<=57},$=function(t){return Z(t)||t>=65&&t<=70||t>=97&&t<=102},tt=function(t){return 10===t||9===t||32===t},At=function(t){return function(t){return function(t){return t>=97&&t<=122}(t)||function(t){return t>=65&&t<=90}(t)}(t)||function(t){return t>=128}(t)||95===t},et=function(t){return At(t)||Z(t)||45===t},rt=function(t){return t>=0&&t<=8||11===t||t>=14&&t<=31||127===t},nt=function(t,A){return 92===t&&10!==A},it=function(t,A,e){return 45===t?At(A)||nt(A,e):!!At(t)||!(92!==t||!nt(t,A))},ot=function(t,A,e){return 43===t||45===t?!!Z(A)||46===A&&Z(e):Z(46===t?A:t)},st=function(t){var A=0,e=1;43!==t[A]&&45!==t[A]||(45===t[A]&&(e=-1),A++);for(var r=[];Z(t[A]);)r.push(t[A++]);var n=r.length?parseInt(a.apply(void 0,r),10):0;46===t[A]&&A++;for(var i=[];Z(t[A]);)i.push(t[A++]);var o=i.length,s=o?parseInt(a.apply(void 0,i),10):0;69!==t[A]&&101!==t[A]||A++;var c=1;43!==t[A]&&45!==t[A]||(45===t[A]&&(c=-1),A++);for(var u=[];Z(t[A]);)u.push(t[A++]);var l=u.length?parseInt(a.apply(void 0,u),10):0;return e*(n+s*Math.pow(10,-o))*Math.pow(10,c*l)},at={type:h.LEFT_PARENTHESIS_TOKEN},ct={type:h.RIGHT_PARENTHESIS_TOKEN},ut={type:h.COMMA_TOKEN},lt={type:h.SUFFIX_MATCH_TOKEN},ht={type:h.PREFIX_MATCH_TOKEN},ft={type:h.COLUMN_TOKEN},dt={type:h.DASH_MATCH_TOKEN},pt={type:h.INCLUDE_MATCH_TOKEN},Bt={type:h.LEFT_CURLY_BRACKET_TOKEN},gt={type:h.RIGHT_CURLY_BRACKET_TOKEN},wt={type:h.SUBSTRING_MATCH_TOKEN},mt={type:h.BAD_URL_TOKEN},Qt={type:h.BAD_STRING_TOKEN},Ct={type:h.CDO_TOKEN},yt={type:h.CDC_TOKEN},vt={type:h.COLON_TOKEN},Ft={type:h.SEMICOLON_TOKEN},Ut={type:h.LEFT_SQUARE_BRACKET_TOKEN},Nt={type:h.RIGHT_SQUARE_BRACKET_TOKEN},Et={type:h.WHITESPACE_TOKEN},bt={type:h.EOF_TOKEN},Lt=function(){function t(){this._value=[]}return t.prototype.write=function(t){this._value=this._value.concat(s(t))},t.prototype.read=function(){for(var t=[],A=this.consumeToken();A!==bt;)t.push(A),A=this.consumeToken();return t},t.prototype.consumeToken=function(){var t=this.consumeCodePoint();switch(t){case 34:return this.consumeStringToken(34);case 35:var A=this.peekCodePoint(0),e=this.peekCodePoint(1),r=this.peekCodePoint(2);if(et(A)||nt(e,r)){var n=it(A,e,r)?2:1,i=this.consumeName();return{type:h.HASH_TOKEN,value:i,flags:n}}break;case 36:if(61===this.peekCodePoint(0))return this.consumeCodePoint(),lt;break;case 39:return this.consumeStringToken(39);case 40:return at;case 41:return ct;case 42:if(61===this.peekCodePoint(0))return this.consumeCodePoint(),wt;break;case 43:if(ot(t,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(t),this.consumeNumericToken();break;case 44:return ut;case 45:var o=t,s=this.peekCodePoint(0),c=this.peekCodePoint(1);if(ot(o,s,c))return this.reconsumeCodePoint(t),this.consumeNumericToken();if(it(o,s,c))return this.reconsumeCodePoint(t),this.consumeIdentLikeToken();if(45===s&&62===c)return this.consumeCodePoint(),this.consumeCodePoint(),yt;break;case 46:if(ot(t,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(t),this.consumeNumericToken();break;case 47:if(42===this.peekCodePoint(0))for(this.consumeCodePoint();;){var u=this.consumeCodePoint();if(42===u&&47===(u=this.consumeCodePoint()))return this.consumeToken();if(-1===u)return this.consumeToken()}break;case 58:return vt;case 59:return Ft;case 60:if(33===this.peekCodePoint(0)&&45===this.peekCodePoint(1)&&45===this.peekCodePoint(2))return this.consumeCodePoint(),this.consumeCodePoint(),Ct;break;case 64:var l=this.peekCodePoint(0),f=this.peekCodePoint(1),d=this.peekCodePoint(2);if(it(l,f,d))return i=this.consumeName(),{type:h.AT_KEYWORD_TOKEN,value:i};break;case 91:return Ut;case 92:if(nt(t,this.peekCodePoint(0)))return this.reconsumeCodePoint(t),this.consumeIdentLikeToken();break;case 93:return Nt;case 61:if(61===this.peekCodePoint(0))return this.consumeCodePoint(),ht;break;case 123:return Bt;case 125:return gt;case 117:case 85:var p=this.peekCodePoint(0),B=this.peekCodePoint(1);return 43!==p||!$(B)&&63!==B||(this.consumeCodePoint(),this.consumeUnicodeRangeToken()),this.reconsumeCodePoint(t),this.consumeIdentLikeToken();case 124:if(61===this.peekCodePoint(0))return this.consumeCodePoint(),dt;if(124===this.peekCodePoint(0))return this.consumeCodePoint(),ft;break;case 126:if(61===this.peekCodePoint(0))return this.consumeCodePoint(),pt;break;case-1:return bt}return tt(t)?(this.consumeWhiteSpace(),Et):Z(t)?(this.reconsumeCodePoint(t),this.consumeNumericToken()):At(t)?(this.reconsumeCodePoint(t),this.consumeIdentLikeToken()):{type:h.DELIM_TOKEN,value:a(t)}},t.prototype.consumeCodePoint=function(){var t=this._value.shift();return void 0===t?-1:t},t.prototype.reconsumeCodePoint=function(t){this._value.unshift(t)},t.prototype.peekCodePoint=function(t){return t>=this._value.length?-1:this._value[t]},t.prototype.consumeUnicodeRangeToken=function(){for(var t=[],A=this.consumeCodePoint();$(A)&&t.length<6;)t.push(A),A=this.consumeCodePoint();for(var e=!1;63===A&&t.length<6;)t.push(A),A=this.consumeCodePoint(),e=!0;if(e){var r=parseInt(a.apply(void 0,t.map((function(t){return 63===t?48:t}))),16),n=parseInt(a.apply(void 0,t.map((function(t){return 63===t?70:t}))),16);return{type:h.UNICODE_RANGE_TOKEN,start:r,end:n}}var i=parseInt(a.apply(void 0,t),16);if(45===this.peekCodePoint(0)&&$(this.peekCodePoint(1))){this.consumeCodePoint(),A=this.consumeCodePoint();for(var o=[];$(A)&&o.length<6;)o.push(A),A=this.consumeCodePoint();return n=parseInt(a.apply(void 0,o),16),{type:h.UNICODE_RANGE_TOKEN,start:i,end:n}}return{type:h.UNICODE_RANGE_TOKEN,start:i,end:i}},t.prototype.consumeIdentLikeToken=function(){var t=this.consumeName();return"url"===t.toLowerCase()&&40===this.peekCodePoint(0)?(this.consumeCodePoint(),this.consumeUrlToken()):40===this.peekCodePoint(0)?(this.consumeCodePoint(),{type:h.FUNCTION_TOKEN,value:t}):{type:h.IDENT_TOKEN,value:t}},t.prototype.consumeUrlToken=function(){var t=[];if(this.consumeWhiteSpace(),-1===this.peekCodePoint(0))return{type:h.URL_TOKEN,value:""};var A=this.peekCodePoint(0);if(39===A||34===A){var e=this.consumeStringToken(this.consumeCodePoint());return e.type===h.STRING_TOKEN&&(this.consumeWhiteSpace(),-1===this.peekCodePoint(0)||41===this.peekCodePoint(0))?(this.consumeCodePoint(),{type:h.URL_TOKEN,value:e.value}):(this.consumeBadUrlRemnants(),mt)}for(;;){var r=this.consumeCodePoint();if(-1===r||41===r)return{type:h.URL_TOKEN,value:a.apply(void 0,t)};if(tt(r))return this.consumeWhiteSpace(),-1===this.peekCodePoint(0)||41===this.peekCodePoint(0)?(this.consumeCodePoint(),{type:h.URL_TOKEN,value:a.apply(void 0,t)}):(this.consumeBadUrlRemnants(),mt);if(34===r||39===r||40===r||rt(r))return this.consumeBadUrlRemnants(),mt;if(92===r){if(!nt(r,this.peekCodePoint(0)))return this.consumeBadUrlRemnants(),mt;t.push(this.consumeEscapedCodePoint())}else t.push(r)}},t.prototype.consumeWhiteSpace=function(){for(;tt(this.peekCodePoint(0));)this.consumeCodePoint()},t.prototype.consumeBadUrlRemnants=function(){for(;;){var t=this.consumeCodePoint();if(41===t||-1===t)return;nt(t,this.peekCodePoint(0))&&this.consumeEscapedCodePoint()}},t.prototype.consumeStringSlice=function(t){for(var A="";t>0;){var e=Math.min(6e4,t);A+=a.apply(void 0,this._value.splice(0,e)),t-=e}return this._value.shift(),A},t.prototype.consumeStringToken=function(t){for(var A="",e=0;;){var r=this._value[e];if(-1===r||void 0===r||r===t)return A+=this.consumeStringSlice(e),{type:h.STRING_TOKEN,value:A};if(10===r)return this._value.splice(0,e),Qt;if(92===r){var n=this._value[e+1];-1!==n&&void 0!==n&&(10===n?(A+=this.consumeStringSlice(e),e=-1,this._value.shift()):nt(r,n)&&(A+=this.consumeStringSlice(e),A+=a(this.consumeEscapedCodePoint()),e=-1))}e++}},t.prototype.consumeNumber=function(){var t=[],A=4,e=this.peekCodePoint(0);for(43!==e&&45!==e||t.push(this.consumeCodePoint());Z(this.peekCodePoint(0));)t.push(this.consumeCodePoint());e=this.peekCodePoint(0);var r=this.peekCodePoint(1);if(46===e&&Z(r))for(t.push(this.consumeCodePoint(),this.consumeCodePoint()),A=8;Z(this.peekCodePoint(0));)t.push(this.consumeCodePoint());e=this.peekCodePoint(0),r=this.peekCodePoint(1);var n=this.peekCodePoint(2);if((69===e||101===e)&&((43===r||45===r)&&Z(n)||Z(r)))for(t.push(this.consumeCodePoint(),this.consumeCodePoint()),A=8;Z(this.peekCodePoint(0));)t.push(this.consumeCodePoint());return[st(t),A]},t.prototype.consumeNumericToken=function(){var t=this.consumeNumber(),A=t[0],e=t[1],r=this.peekCodePoint(0),n=this.peekCodePoint(1),i=this.peekCodePoint(2);if(it(r,n,i)){var o=this.consumeName();return{type:h.DIMENSION_TOKEN,number:A,flags:e,unit:o}}return 37===r?(this.consumeCodePoint(),{type:h.PERCENTAGE_TOKEN,number:A,flags:e}):{type:h.NUMBER_TOKEN,number:A,flags:e}},t.prototype.consumeEscapedCodePoint=function(){var t=this.consumeCodePoint();if($(t)){for(var A=a(t);$(this.peekCodePoint(0))&&A.length<6;)A+=a(this.consumeCodePoint());tt(this.peekCodePoint(0))&&this.consumeCodePoint();var e=parseInt(A,16);return 0===e||function(t){return t>=55296&&t<=57343}(e)||e>1114111?65533:e}return-1===t?65533:t},t.prototype.consumeName=function(){for(var t="";;){var A=this.consumeCodePoint();if(et(A))t+=a(A);else{if(!nt(A,this.peekCodePoint(0)))return this.reconsumeCodePoint(A),t;t+=a(this.consumeEscapedCodePoint())}}},t}(),Ht=function(){function t(t){this._tokens=t}return t.create=function(A){var e=new Lt;return e.write(A),new t(e.read())},t.parseValue=function(A){return t.create(A).parseComponentValue()},t.parseValues=function(A){return t.create(A).parseComponentValues()},t.prototype.parseComponentValue=function(){for(var t=this.consumeToken();t.type===h.WHITESPACE_TOKEN;)t=this.consumeToken();if(t.type===h.EOF_TOKEN)throw new SyntaxError("Error parsing CSS component value, unexpected EOF");this.reconsumeToken(t);var A=this.consumeComponentValue();do{t=this.consumeToken()}while(t.type===h.WHITESPACE_TOKEN);if(t.type===h.EOF_TOKEN)return A;throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one")},t.prototype.parseComponentValues=function(){for(var t=[];;){var A=this.consumeComponentValue();if(A.type===h.EOF_TOKEN)return t;t.push(A),t.push()}},t.prototype.consumeComponentValue=function(){var t=this.consumeToken();switch(t.type){case h.LEFT_CURLY_BRACKET_TOKEN:case h.LEFT_SQUARE_BRACKET_TOKEN:case h.LEFT_PARENTHESIS_TOKEN:return this.consumeSimpleBlock(t.type);case h.FUNCTION_TOKEN:return this.consumeFunction(t)}return t},t.prototype.consumeSimpleBlock=function(t){for(var A={type:t,values:[]},e=this.consumeToken();;){if(e.type===h.EOF_TOKEN||Mt(e,t))return A;this.reconsumeToken(e),A.values.push(this.consumeComponentValue()),e=this.consumeToken()}},t.prototype.consumeFunction=function(t){for(var A={name:t.value,values:[],type:h.FUNCTION};;){var e=this.consumeToken();if(e.type===h.EOF_TOKEN||e.type===h.RIGHT_PARENTHESIS_TOKEN)return A;this.reconsumeToken(e),A.values.push(this.consumeComponentValue())}},t.prototype.consumeToken=function(){var t=this._tokens.shift();return void 0===t?bt:t},t.prototype.reconsumeToken=function(t){this._tokens.unshift(t)},t}(),xt=function(t){return t.type===h.DIMENSION_TOKEN},St=function(t){return t.type===h.NUMBER_TOKEN},It=function(t){return t.type===h.IDENT_TOKEN},_t=function(t){return t.type===h.STRING_TOKEN},Tt=function(t,A){return It(t)&&t.value===A},Rt=function(t){return t.type!==h.WHITESPACE_TOKEN},Ot=function(t){return t.type!==h.WHITESPACE_TOKEN&&t.type!==h.COMMA_TOKEN},Kt=function(t){var A=[],e=[];return t.forEach((function(t){if(t.type===h.COMMA_TOKEN){if(0===e.length)throw new Error("Error parsing function args, zero tokens for arg");return A.push(e),void(e=[])}t.type!==h.WHITESPACE_TOKEN&&e.push(t)})),e.length&&A.push(e),A},Mt=function(t,A){return A===h.LEFT_CURLY_BRACKET_TOKEN&&t.type===h.RIGHT_CURLY_BRACKET_TOKEN||A===h.LEFT_SQUARE_BRACKET_TOKEN&&t.type===h.RIGHT_SQUARE_BRACKET_TOKEN||A===h.LEFT_PARENTHESIS_TOKEN&&t.type===h.RIGHT_PARENTHESIS_TOKEN},Pt=function(t){return t.type===h.NUMBER_TOKEN||t.type===h.DIMENSION_TOKEN},Dt=function(t){return t.type===h.PERCENTAGE_TOKEN||Pt(t)},kt=function(t){return t.length>1?[t[0],t[1]]:[t[0]]},zt={type:h.NUMBER_TOKEN,number:0,flags:4},jt={type:h.PERCENTAGE_TOKEN,number:50,flags:4},qt={type:h.PERCENTAGE_TOKEN,number:100,flags:4},Vt=function(t,A,e){var r=t[0],n=t[1];return[Xt(r,A),Xt(void 0!==n?n:r,e)]},Xt=function(t,A){if(t.type===h.PERCENTAGE_TOKEN)return t.number/100*A;if(xt(t))switch(t.unit){case"rem":case"em":return 16*t.number;case"px":default:return t.number}return t.number},Gt=function(t){if(t.type===h.DIMENSION_TOKEN)switch(t.unit){case"deg":return Math.PI*t.number/180;case"grad":return Math.PI/200*t.number;case"rad":return t.number;case"turn":return 2*Math.PI*t.number}throw new Error("Unsupported angle type")},Jt=function(t){return t.type===h.DIMENSION_TOKEN&&("deg"===t.unit||"grad"===t.unit||"rad"===t.unit||"turn"===t.unit)},Wt=function(t){switch(t.filter(It).map((function(t){return t.value})).join(" ")){case"to bottom right":case"to right bottom":case"left top":case"top left":return[zt,zt];case"to top":case"bottom":return Yt(0);case"to bottom left":case"to left bottom":case"right top":case"top right":return[zt,qt];case"to right":case"left":return Yt(90);case"to top left":case"to left top":case"right bottom":case"bottom right":return[qt,qt];case"to bottom":case"top":return Yt(180);case"to top right":case"to right top":case"left bottom":case"bottom left":return[qt,zt];case"to left":case"right":return Yt(270)}return 0},Yt=function(t){return Math.PI*t/180},Zt=function(t){if(t.type===h.FUNCTION){var A=aA[t.name];if(void 0===A)throw new Error('Attempting to parse an unsupported color function "'+t.name+'"');return A(t.values)}if(t.type===h.HASH_TOKEN){if(3===t.value.length){var e=t.value.substring(0,1),r=t.value.substring(1,2),n=t.value.substring(2,3);return AA(parseInt(e+e,16),parseInt(r+r,16),parseInt(n+n,16),1)}if(4===t.value.length){e=t.value.substring(0,1),r=t.value.substring(1,2),n=t.value.substring(2,3);var i=t.value.substring(3,4);return AA(parseInt(e+e,16),parseInt(r+r,16),parseInt(n+n,16),parseInt(i+i,16)/255)}if(6===t.value.length)return e=t.value.substring(0,2),r=t.value.substring(2,4),n=t.value.substring(4,6),AA(parseInt(e,16),parseInt(r,16),parseInt(n,16),1);if(8===t.value.length)return e=t.value.substring(0,2),r=t.value.substring(2,4),n=t.value.substring(4,6),i=t.value.substring(6,8),AA(parseInt(e,16),parseInt(r,16),parseInt(n,16),parseInt(i,16)/255)}if(t.type===h.IDENT_TOKEN){var o=cA[t.value.toUpperCase()];if(void 0!==o)return o}return cA.TRANSPARENT},$t=function(t){return 0==(255&t)},tA=function(t){var A=255&t,e=255&t>>8,r=255&t>>16,n=255&t>>24;return A<255?"rgba("+n+","+r+","+e+","+A/255+")":"rgb("+n+","+r+","+e+")"},AA=function(t,A,e,r){return(t<<24|A<<16|e<<8|Math.round(255*r)<<0)>>>0},eA=function(t,A){if(t.type===h.NUMBER_TOKEN)return t.number;if(t.type===h.PERCENTAGE_TOKEN){var e=3===A?1:255;return 3===A?t.number/100*e:Math.round(t.number/100*e)}return 0},rA=function(t){var A=t.filter(Ot);if(3===A.length){var e=A.map(eA),r=e[0],n=e[1],i=e[2];return AA(r,n,i,1)}if(4===A.length){var o=A.map(eA),s=(r=o[0],n=o[1],i=o[2],o[3]);return AA(r,n,i,s)}return 0};function nA(t,A,e){return e<0&&(e+=1),e>=1&&(e-=1),e<1/6?(A-t)*e*6+t:e<.5?A:e<2/3?6*(A-t)*(2/3-e)+t:t}var iA,oA,sA=function(t){var A=t.filter(Ot),e=A[0],r=A[1],n=A[2],i=A[3],o=(e.type===h.NUMBER_TOKEN?Yt(e.number):Gt(e))/(2*Math.PI),s=Dt(r)?r.number/100:0,a=Dt(n)?n.number/100:0,c=void 0!==i&&Dt(i)?Xt(i,1):1;if(0===s)return AA(255*a,255*a,255*a,1);var u=a<=.5?a*(s+1):a+s-a*s,l=2*a-u,f=nA(l,u,o+1/3),d=nA(l,u,o),p=nA(l,u,o-1/3);return AA(255*f,255*d,255*p,c)},aA={hsl:sA,hsla:sA,rgb:rA,rgba:rA},cA={ALICEBLUE:4042850303,ANTIQUEWHITE:4209760255,AQUA:16777215,AQUAMARINE:2147472639,AZURE:4043309055,BEIGE:4126530815,BISQUE:4293182719,BLACK:255,BLANCHEDALMOND:4293643775,BLUE:65535,BLUEVIOLET:2318131967,BROWN:2771004159,BURLYWOOD:3736635391,CADETBLUE:1604231423,CHARTREUSE:2147418367,CHOCOLATE:3530104575,CORAL:4286533887,CORNFLOWERBLUE:1687547391,CORNSILK:4294499583,CRIMSON:3692313855,CYAN:16777215,DARKBLUE:35839,DARKCYAN:9145343,DARKGOLDENROD:3095837695,DARKGRAY:2846468607,DARKGREEN:6553855,DARKGREY:2846468607,DARKKHAKI:3182914559,DARKMAGENTA:2332068863,DARKOLIVEGREEN:1433087999,DARKORANGE:4287365375,DARKORCHID:2570243327,DARKRED:2332033279,DARKSALMON:3918953215,DARKSEAGREEN:2411499519,DARKSLATEBLUE:1211993087,DARKSLATEGRAY:793726975,DARKSLATEGREY:793726975,DARKTURQUOISE:13554175,DARKVIOLET:2483082239,DEEPPINK:4279538687,DEEPSKYBLUE:12582911,DIMGRAY:1768516095,DIMGREY:1768516095,DODGERBLUE:512819199,FIREBRICK:2988581631,FLORALWHITE:4294635775,FORESTGREEN:579543807,FUCHSIA:4278255615,GAINSBORO:3705462015,GHOSTWHITE:4177068031,GOLD:4292280575,GOLDENROD:3668254975,GRAY:2155905279,GREEN:8388863,GREENYELLOW:2919182335,GREY:2155905279,HONEYDEW:4043305215,HOTPINK:4285117695,INDIANRED:3445382399,INDIGO:1258324735,IVORY:4294963455,KHAKI:4041641215,LAVENDER:3873897215,LAVENDERBLUSH:4293981695,LAWNGREEN:2096890111,LEMONCHIFFON:4294626815,LIGHTBLUE:2916673279,LIGHTCORAL:4034953471,LIGHTCYAN:3774873599,LIGHTGOLDENRODYELLOW:4210742015,LIGHTGRAY:3553874943,LIGHTGREEN:2431553791,LIGHTGREY:3553874943,LIGHTPINK:4290167295,LIGHTSALMON:4288707327,LIGHTSEAGREEN:548580095,LIGHTSKYBLUE:2278488831,LIGHTSLATEGRAY:2005441023,LIGHTSLATEGREY:2005441023,LIGHTSTEELBLUE:2965692159,LIGHTYELLOW:4294959359,LIME:16711935,LIMEGREEN:852308735,LINEN:4210091775,MAGENTA:4278255615,MAROON:2147483903,MEDIUMAQUAMARINE:1724754687,MEDIUMBLUE:52735,MEDIUMORCHID:3126187007,MEDIUMPURPLE:2473647103,MEDIUMSEAGREEN:1018393087,MEDIUMSLATEBLUE:2070474495,MEDIUMSPRINGGREEN:16423679,MEDIUMTURQUOISE:1221709055,MEDIUMVIOLETRED:3340076543,MIDNIGHTBLUE:421097727,MINTCREAM:4127193855,MISTYROSE:4293190143,MOCCASIN:4293178879,NAVAJOWHITE:4292783615,NAVY:33023,OLDLACE:4260751103,OLIVE:2155872511,OLIVEDRAB:1804477439,ORANGE:4289003775,ORANGERED:4282712319,ORCHID:3664828159,PALEGOLDENROD:4008225535,PALEGREEN:2566625535,PALETURQUOISE:2951671551,PALEVIOLETRED:3681588223,PAPAYAWHIP:4293907967,PEACHPUFF:4292524543,PERU:3448061951,PINK:4290825215,PLUM:3718307327,POWDERBLUE:2967529215,PURPLE:2147516671,REBECCAPURPLE:1714657791,RED:4278190335,ROSYBROWN:3163525119,ROYALBLUE:1097458175,SADDLEBROWN:2336560127,SALMON:4202722047,SANDYBROWN:4104413439,SEAGREEN:780883967,SEASHELL:4294307583,SIENNA:2689740287,SILVER:3233857791,SKYBLUE:2278484991,SLATEBLUE:1784335871,SLATEGRAY:1887473919,SLATEGREY:1887473919,SNOW:4294638335,SPRINGGREEN:16744447,STEELBLUE:1182971135,TAN:3535047935,TEAL:8421631,THISTLE:3636451583,TOMATO:4284696575,TRANSPARENT:0,TURQUOISE:1088475391,VIOLET:4001558271,WHEAT:4125012991,WHITE:4294967295,WHITESMOKE:4126537215,YELLOW:4294902015,YELLOWGREEN:2597139199};(function(t){t[t.VALUE=0]="VALUE",t[t.LIST=1]="LIST",t[t.IDENT_VALUE=2]="IDENT_VALUE",t[t.TYPE_VALUE=3]="TYPE_VALUE",t[t.TOKEN_VALUE=4]="TOKEN_VALUE"})(iA||(iA={})),function(t){t[t.BORDER_BOX=0]="BORDER_BOX",t[t.PADDING_BOX=1]="PADDING_BOX",t[t.CONTENT_BOX=2]="CONTENT_BOX"}(oA||(oA={}));var uA,lA,hA,fA={name:"background-clip",initialValue:"border-box",prefix:!1,type:iA.LIST,parse:function(t){return t.map((function(t){if(It(t))switch(t.value){case"padding-box":return oA.PADDING_BOX;case"content-box":return oA.CONTENT_BOX}return oA.BORDER_BOX}))}},dA={name:"background-color",initialValue:"transparent",prefix:!1,type:iA.TYPE_VALUE,format:"color"},pA=function(t){var A=Zt(t[0]),e=t[1];return e&&Dt(e)?{color:A,stop:e}:{color:A,stop:null}},BA=function(t,A){var e=t[0],r=t[t.length-1];null===e.stop&&(e.stop=zt),null===r.stop&&(r.stop=qt);for(var n=[],i=0,o=0;o<t.length;o++){var s=t[o].stop;if(null!==s){var a=Xt(s,A);a>i?n.push(a):n.push(i),i=a}else n.push(null)}var c=null;for(o=0;o<n.length;o++){var u=n[o];if(null===u)null===c&&(c=o);else if(null!==c){for(var l=o-c,h=(u-n[c-1])/(l+1),f=1;f<=l;f++)n[c+f-1]=h*f;c=null}}return t.map((function(t,e){return{color:t.color,stop:Math.max(Math.min(1,n[e]/A),0)}}))},gA=function(t,A,e){var r="number"==typeof t?t:function(t,A,e){var r=A/2,n=e/2,i=Xt(t[0],A)-r,o=n-Xt(t[1],e);return(Math.atan2(o,i)+2*Math.PI)%(2*Math.PI)}(t,A,e),n=Math.abs(A*Math.sin(r))+Math.abs(e*Math.cos(r)),i=A/2,o=e/2,s=n/2,a=Math.sin(r-Math.PI/2)*s,c=Math.cos(r-Math.PI/2)*s;return[n,i-c,i+c,o-a,o+a]},wA=function(t,A){return Math.sqrt(t*t+A*A)},mA=function(t,A,e,r,n){return[[0,0],[0,A],[t,0],[t,A]].reduce((function(t,A){var i=A[0],o=A[1],s=wA(e-i,r-o);return(n?s<t.optimumDistance:s>t.optimumDistance)?{optimumCorner:A,optimumDistance:s}:t}),{optimumDistance:n?1/0:-1/0,optimumCorner:null}).optimumCorner},QA=function(t){var A=Yt(180),e=[];return Kt(t).forEach((function(t,r){if(0===r){var n=t[0];if(n.type===h.IDENT_TOKEN&&-1!==["top","left","right","bottom"].indexOf(n.value))return void(A=Wt(t));if(Jt(n))return void(A=(Gt(n)+Yt(270))%Yt(360))}var i=pA(t);e.push(i)})),{angle:A,stops:e,type:uA.LINEAR_GRADIENT}},CA=function(t){return 0===t[0]&&255===t[1]&&0===t[2]&&255===t[3]},yA=function(t,A,e,r,n){var i="http://www.w3.org/2000/svg",o=document.createElementNS(i,"svg"),s=document.createElementNS(i,"foreignObject");return o.setAttributeNS(null,"width",t.toString()),o.setAttributeNS(null,"height",A.toString()),s.setAttributeNS(null,"width","100%"),s.setAttributeNS(null,"height","100%"),s.setAttributeNS(null,"x",e.toString()),s.setAttributeNS(null,"y",r.toString()),s.setAttributeNS(null,"externalResourcesRequired","true"),o.appendChild(s),s.appendChild(n),o},vA=function(t){return new Promise((function(A,e){var r=new Image;r.onload=function(){return A(r)},r.onerror=e,r.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent((new XMLSerializer).serializeToString(t))}))},FA={get SUPPORT_RANGE_BOUNDS(){var t=function(t){if(t.createRange){var A=t.createRange();if(A.getBoundingClientRect){var e=t.createElement("boundtest");e.style.height="123px",e.style.display="block",t.body.appendChild(e),A.selectNode(e);var r=A.getBoundingClientRect(),n=Math.round(r.height);if(t.body.removeChild(e),123===n)return!0}}return!1}(document);return Object.defineProperty(FA,"SUPPORT_RANGE_BOUNDS",{value:t}),t},get SUPPORT_SVG_DRAWING(){var t=function(t){var A=new Image,e=t.createElement("canvas"),r=e.getContext("2d");if(!r)return!1;A.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try{r.drawImage(A,0,0),e.toDataURL()}catch(t){return!1}return!0}(document);return Object.defineProperty(FA,"SUPPORT_SVG_DRAWING",{value:t}),t},get SUPPORT_FOREIGNOBJECT_DRAWING(){var t="function"==typeof Array.from&&"function"==typeof window.fetch?function(t){var A=t.createElement("canvas");A.width=100,A.height=100;var e=A.getContext("2d");if(!e)return Promise.reject(!1);e.fillStyle="rgb(0, 255, 0)",e.fillRect(0,0,100,100);var r=new Image,n=A.toDataURL();r.src=n;var i=yA(100,100,0,0,r);return e.fillStyle="red",e.fillRect(0,0,100,100),vA(i).then((function(A){e.drawImage(A,0,0);var r=e.getImageData(0,0,100,100).data;e.fillStyle="red",e.fillRect(0,0,100,100);var i=t.createElement("div");return i.style.backgroundImage="url("+n+")",i.style.height="100px",CA(r)?vA(yA(100,100,0,0,i)):Promise.reject(!1)})).then((function(t){return e.drawImage(t,0,0),CA(e.getImageData(0,0,100,100).data)})).catch((function(){return!1}))}(document):Promise.resolve(!1);return Object.defineProperty(FA,"SUPPORT_FOREIGNOBJECT_DRAWING",{value:t}),t},get SUPPORT_CORS_IMAGES(){var t=void 0!==(new Image).crossOrigin;return Object.defineProperty(FA,"SUPPORT_CORS_IMAGES",{value:t}),t},get SUPPORT_RESPONSE_TYPE(){var t="string"==typeof(new XMLHttpRequest).responseType;return Object.defineProperty(FA,"SUPPORT_RESPONSE_TYPE",{value:t}),t},get SUPPORT_CORS_XHR(){var t="withCredentials"in new XMLHttpRequest;return Object.defineProperty(FA,"SUPPORT_CORS_XHR",{value:t}),t}},UA=function(){function t(t){var A=t.id,e=t.enabled;this.id=A,this.enabled=e,this.start=Date.now()}return t.prototype.debug=function(){for(var t=[],A=0;A<arguments.length;A++)t[A]=arguments[A];this.enabled&&("undefined"!=typeof window&&window.console&&"function"==typeof console.debug?console.debug.apply(console,[this.id,this.getTime()+"ms"].concat(t)):this.info.apply(this,t))},t.prototype.getTime=function(){return Date.now()-this.start},t.create=function(A){t.instances[A.id]=new t(A)},t.destroy=function(A){delete t.instances[A]},t.getInstance=function(A){var e=t.instances[A];if(void 0===e)throw new Error("No logger instance found with id "+A);return e},t.prototype.info=function(){for(var t=[],A=0;A<arguments.length;A++)t[A]=arguments[A];this.enabled&&"undefined"!=typeof window&&window.console&&"function"==typeof console.info&&console.info.apply(console,[this.id,this.getTime()+"ms"].concat(t))},t.prototype.error=function(){for(var t=[],A=0;A<arguments.length;A++)t[A]=arguments[A];this.enabled&&("undefined"!=typeof window&&window.console&&"function"==typeof console.error?console.error.apply(console,[this.id,this.getTime()+"ms"].concat(t)):this.info.apply(this,t))},t.instances={},t}(),NA=function(){function t(){}return t.create=function(A,e){return t._caches[A]=new EA(A,e)},t.destroy=function(A){delete t._caches[A]},t.open=function(A){var e=t._caches[A];if(void 0!==e)return e;throw new Error('Cache with key "'+A+'" not found')},t.getOrigin=function(A){var e=t._link;return e?(e.href=A,e.href=e.href,e.protocol+e.hostname+e.port):"about:blank"},t.isSameOrigin=function(A){return t.getOrigin(A)===t._origin},t.setContext=function(A){t._link=A.document.createElement("a"),t._origin=t.getOrigin(A.location.href)},t.getInstance=function(){var A=t._current;if(null===A)throw new Error("No cache instance attached");return A},t.attachInstance=function(A){t._current=A},t.detachInstance=function(){t._current=null},t._caches={},t._origin="about:blank",t._current=null,t}(),EA=function(){function t(t,A){this.id=t,this._options=A,this._cache={}}return t.prototype.addImage=function(t){var A=Promise.resolve();return this.has(t)?A:_A(t)||xA(t)?(this._cache[t]=this.loadImage(t),A):A},t.prototype.match=function(t){return this._cache[t]},t.prototype.loadImage=function(t){return r(this,void 0,void 0,(function(){var A,e,r,i,o=this;return n(this,(function(n){switch(n.label){case 0:return A=NA.isSameOrigin(t),e=!SA(t)&&!0===this._options.useCORS&&FA.SUPPORT_CORS_IMAGES&&!A,r=!SA(t)&&!A&&"string"==typeof this._options.proxy&&FA.SUPPORT_CORS_XHR&&!e,A||!1!==this._options.allowTaint||SA(t)||r||e?(i=t,r?[4,this.proxy(i)]:[3,2]):[2];case 1:i=n.sent(),n.label=2;case 2:return UA.getInstance(this.id).debug("Added image "+t.substring(0,256)),[4,new Promise((function(t,A){var r=new Image;r.onload=function(){return t(r)},r.onerror=A,(IA(i)||e)&&(r.crossOrigin="anonymous"),r.src=i,!0===r.complete&&setTimeout((function(){return t(r)}),500),o._options.imageTimeout>0&&setTimeout((function(){return A("Timed out ("+o._options.imageTimeout+"ms) loading image")}),o._options.imageTimeout)}))];case 3:return[2,n.sent()]}}))}))},t.prototype.has=function(t){return void 0!==this._cache[t]},t.prototype.keys=function(){return Promise.resolve(Object.keys(this._cache))},t.prototype.proxy=function(t){var A=this,e=this._options.proxy;if(!e)throw new Error("No proxy defined");var r=t.substring(0,256);return new Promise((function(n,i){var o=FA.SUPPORT_RESPONSE_TYPE?"blob":"text",s=new XMLHttpRequest;if(s.onload=function(){if(200===s.status)if("text"===o)n(s.response);else{var t=new FileReader;t.addEventListener("load",(function(){return n(t.result)}),!1),t.addEventListener("error",(function(t){return i(t)}),!1),t.readAsDataURL(s.response)}else i("Failed to proxy resource "+r+" with status code "+s.status)},s.onerror=i,s.open("GET",e+"?url="+encodeURIComponent(t)+"&responseType="+o),"text"!==o&&s instanceof XMLHttpRequest&&(s.responseType=o),A._options.imageTimeout){var a=A._options.imageTimeout;s.timeout=a,s.ontimeout=function(){return i("Timed out ("+a+"ms) proxying "+r)}}s.send()}))},t}(),bA=/^data:image\/svg\+xml/i,LA=/^data:image\/.*;base64,/i,HA=/^data:image\/.*/i,xA=function(t){return FA.SUPPORT_SVG_DRAWING||!TA(t)},SA=function(t){return HA.test(t)},IA=function(t){return LA.test(t)},_A=function(t){return"blob"===t.substr(0,4)},TA=function(t){return"svg"===t.substr(-3).toLowerCase()||bA.test(t)},RA=function(t){var A=lA.CIRCLE,e=hA.FARTHEST_CORNER,r=[],n=[];return Kt(t).forEach((function(t,i){var o=!0;if(0===i?o=t.reduce((function(t,A){if(It(A))switch(A.value){case"center":return n.push(jt),!1;case"top":case"left":return n.push(zt),!1;case"right":case"bottom":return n.push(qt),!1}else if(Dt(A)||Pt(A))return n.push(A),!1;return t}),o):1===i&&(o=t.reduce((function(t,r){if(It(r))switch(r.value){case"circle":return A=lA.CIRCLE,!1;case"ellipse":return A=lA.ELLIPSE,!1;case"contain":case"closest-side":return e=hA.CLOSEST_SIDE,!1;case"farthest-side":return e=hA.FARTHEST_SIDE,!1;case"closest-corner":return e=hA.CLOSEST_CORNER,!1;case"cover":case"farthest-corner":return e=hA.FARTHEST_CORNER,!1}else if(Pt(r)||Dt(r))return Array.isArray(e)||(e=[]),e.push(r),!1;return t}),o)),o){var s=pA(t);r.push(s)}})),{size:e,shape:A,stops:r,position:n,type:uA.RADIAL_GRADIENT}};!function(t){t[t.URL=0]="URL",t[t.LINEAR_GRADIENT=1]="LINEAR_GRADIENT",t[t.RADIAL_GRADIENT=2]="RADIAL_GRADIENT"}(uA||(uA={})),function(t){t[t.CIRCLE=0]="CIRCLE",t[t.ELLIPSE=1]="ELLIPSE"}(lA||(lA={})),function(t){t[t.CLOSEST_SIDE=0]="CLOSEST_SIDE",t[t.FARTHEST_SIDE=1]="FARTHEST_SIDE",t[t.CLOSEST_CORNER=2]="CLOSEST_CORNER",t[t.FARTHEST_CORNER=3]="FARTHEST_CORNER"}(hA||(hA={}));var OA,KA=function(t){if(t.type===h.URL_TOKEN){var A={url:t.value,type:uA.URL};return NA.getInstance().addImage(t.value),A}if(t.type===h.FUNCTION){var e=MA[t.name];if(void 0===e)throw new Error('Attempting to parse an unsupported image function "'+t.name+'"');return e(t.values)}throw new Error("Unsupported image type")},MA={"linear-gradient":function(t){var A=Yt(180),e=[];return Kt(t).forEach((function(t,r){if(0===r){var n=t[0];if(n.type===h.IDENT_TOKEN&&"to"===n.value)return void(A=Wt(t));if(Jt(n))return void(A=Gt(n))}var i=pA(t);e.push(i)})),{angle:A,stops:e,type:uA.LINEAR_GRADIENT}},"-moz-linear-gradient":QA,"-ms-linear-gradient":QA,"-o-linear-gradient":QA,"-webkit-linear-gradient":QA,"radial-gradient":function(t){var A=lA.CIRCLE,e=hA.FARTHEST_CORNER,r=[],n=[];return Kt(t).forEach((function(t,i){var o=!0;if(0===i){var s=!1;o=t.reduce((function(t,r){if(s)if(It(r))switch(r.value){case"center":return n.push(jt),t;case"top":case"left":return n.push(zt),t;case"right":case"bottom":return n.push(qt),t}else(Dt(r)||Pt(r))&&n.push(r);else if(It(r))switch(r.value){case"circle":return A=lA.CIRCLE,!1;case"ellipse":return A=lA.ELLIPSE,!1;case"at":return s=!0,!1;case"closest-side":return e=hA.CLOSEST_SIDE,!1;case"cover":case"farthest-side":return e=hA.FARTHEST_SIDE,!1;case"contain":case"closest-corner":return e=hA.CLOSEST_CORNER,!1;case"farthest-corner":return e=hA.FARTHEST_CORNER,!1}else if(Pt(r)||Dt(r))return Array.isArray(e)||(e=[]),e.push(r),!1;return t}),o)}if(o){var a=pA(t);r.push(a)}})),{size:e,shape:A,stops:r,position:n,type:uA.RADIAL_GRADIENT}},"-moz-radial-gradient":RA,"-ms-radial-gradient":RA,"-o-radial-gradient":RA,"-webkit-radial-gradient":RA,"-webkit-gradient":function(t){var A=Yt(180),e=[],r=uA.LINEAR_GRADIENT,n=lA.CIRCLE,i=hA.FARTHEST_CORNER;return Kt(t).forEach((function(t,A){var n=t[0];if(0===A){if(It(n)&&"linear"===n.value)return void(r=uA.LINEAR_GRADIENT);if(It(n)&&"radial"===n.value)return void(r=uA.RADIAL_GRADIENT)}if(n.type===h.FUNCTION)if("from"===n.name){var i=Zt(n.values[0]);e.push({stop:zt,color:i})}else if("to"===n.name)i=Zt(n.values[0]),e.push({stop:qt,color:i});else if("color-stop"===n.name){var o=n.values.filter(Ot);if(2===o.length){i=Zt(o[1]);var s=o[0];St(s)&&e.push({stop:{type:h.PERCENTAGE_TOKEN,number:100*s.number,flags:s.flags},color:i})}}})),r===uA.LINEAR_GRADIENT?{angle:(A+Yt(180))%Yt(360),stops:e,type:r}:{size:i,shape:n,stops:e,position:[],type:r}}},PA={name:"background-image",initialValue:"none",type:iA.LIST,prefix:!1,parse:function(t){if(0===t.length)return[];var A=t[0];return A.type===h.IDENT_TOKEN&&"none"===A.value?[]:t.filter((function(t){return Ot(t)&&function(t){return t.type!==h.FUNCTION||MA[t.name]}(t)})).map(KA)}},DA={name:"background-origin",initialValue:"border-box",prefix:!1,type:iA.LIST,parse:function(t){return t.map((function(t){if(It(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0}))}},kA={name:"background-position",initialValue:"0% 0%",type:iA.LIST,prefix:!1,parse:function(t){return Kt(t).map((function(t){return t.filter(Dt)})).map(kt)}};!function(t){t[t.REPEAT=0]="REPEAT",t[t.NO_REPEAT=1]="NO_REPEAT",t[t.REPEAT_X=2]="REPEAT_X",t[t.REPEAT_Y=3]="REPEAT_Y"}(OA||(OA={}));var zA,jA={name:"background-repeat",initialValue:"repeat",prefix:!1,type:iA.LIST,parse:function(t){return Kt(t).map((function(t){return t.filter(It).map((function(t){return t.value})).join(" ")})).map(qA)}},qA=function(t){switch(t){case"no-repeat":return OA.NO_REPEAT;case"repeat-x":case"repeat no-repeat":return OA.REPEAT_X;case"repeat-y":case"no-repeat repeat":return OA.REPEAT_Y;case"repeat":default:return OA.REPEAT}};!function(t){t.AUTO="auto",t.CONTAIN="contain",t.COVER="cover"}(zA||(zA={}));var VA,XA={name:"background-size",initialValue:"0",prefix:!1,type:iA.LIST,parse:function(t){return Kt(t).map((function(t){return t.filter(GA)}))}},GA=function(t){return It(t)||Dt(t)},JA=function(t){return{name:"border-"+t+"-color",initialValue:"transparent",prefix:!1,type:iA.TYPE_VALUE,format:"color"}},WA=JA("top"),YA=JA("right"),ZA=JA("bottom"),$A=JA("left"),te=function(t){return{name:"border-radius-"+t,initialValue:"0 0",prefix:!1,type:iA.LIST,parse:function(t){return kt(t.filter(Dt))}}},Ae=te("top-left"),ee=te("top-right"),re=te("bottom-right"),ne=te("bottom-left");!function(t){t[t.NONE=0]="NONE",t[t.SOLID=1]="SOLID"}(VA||(VA={}));var ie,oe=function(t){return{name:"border-"+t+"-style",initialValue:"solid",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"none":return VA.NONE}return VA.SOLID}}},se=oe("top"),ae=oe("right"),ce=oe("bottom"),ue=oe("left"),le=function(t){return{name:"border-"+t+"-width",initialValue:"0",type:iA.VALUE,prefix:!1,parse:function(t){return xt(t)?t.number:0}}},he=le("top"),fe=le("right"),de=le("bottom"),pe=le("left"),Be={name:"color",initialValue:"transparent",prefix:!1,type:iA.TYPE_VALUE,format:"color"},ge={name:"display",initialValue:"inline-block",prefix:!1,type:iA.LIST,parse:function(t){return t.filter(It).reduce((function(t,A){return t|we(A.value)}),0)}},we=function(t){switch(t){case"block":return 2;case"inline":return 4;case"run-in":return 8;case"flow":return 16;case"flow-root":return 32;case"table":return 64;case"flex":case"-webkit-flex":return 128;case"grid":case"-ms-grid":return 256;case"ruby":return 512;case"subgrid":return 1024;case"list-item":return 2048;case"table-row-group":return 4096;case"table-header-group":return 8192;case"table-footer-group":return 16384;case"table-row":return 32768;case"table-cell":return 65536;case"table-column-group":return 131072;case"table-column":return 262144;case"table-caption":return 524288;case"ruby-base":return 1048576;case"ruby-text":return 2097152;case"ruby-base-container":return 4194304;case"ruby-text-container":return 8388608;case"contents":return 16777216;case"inline-block":return 33554432;case"inline-list-item":return 67108864;case"inline-table":return 134217728;case"inline-flex":return 268435456;case"inline-grid":return 536870912}return 0};!function(t){t[t.NONE=0]="NONE",t[t.LEFT=1]="LEFT",t[t.RIGHT=2]="RIGHT",t[t.INLINE_START=3]="INLINE_START",t[t.INLINE_END=4]="INLINE_END"}(ie||(ie={}));var me,Qe={name:"float",initialValue:"none",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"left":return ie.LEFT;case"right":return ie.RIGHT;case"inline-start":return ie.INLINE_START;case"inline-end":return ie.INLINE_END}return ie.NONE}},Ce={name:"letter-spacing",initialValue:"0",prefix:!1,type:iA.VALUE,parse:function(t){return t.type===h.IDENT_TOKEN&&"normal"===t.value?0:t.type===h.NUMBER_TOKEN||t.type===h.DIMENSION_TOKEN?t.number:0}};!function(t){t.NORMAL="normal",t.STRICT="strict"}(me||(me={}));var ye,ve={name:"line-break",initialValue:"normal",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"strict":return me.STRICT;case"normal":default:return me.NORMAL}}},Fe={name:"line-height",initialValue:"normal",prefix:!1,type:iA.TOKEN_VALUE},Ue={name:"list-style-image",initialValue:"none",type:iA.VALUE,prefix:!1,parse:function(t){return t.type===h.IDENT_TOKEN&&"none"===t.value?null:KA(t)}};!function(t){t[t.INSIDE=0]="INSIDE",t[t.OUTSIDE=1]="OUTSIDE"}(ye||(ye={}));var Ne,Ee={name:"list-style-position",initialValue:"outside",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"inside":return ye.INSIDE;case"outside":default:return ye.OUTSIDE}}};!function(t){t[t.NONE=-1]="NONE",t[t.DISC=0]="DISC",t[t.CIRCLE=1]="CIRCLE",t[t.SQUARE=2]="SQUARE",t[t.DECIMAL=3]="DECIMAL",t[t.CJK_DECIMAL=4]="CJK_DECIMAL",t[t.DECIMAL_LEADING_ZERO=5]="DECIMAL_LEADING_ZERO",t[t.LOWER_ROMAN=6]="LOWER_ROMAN",t[t.UPPER_ROMAN=7]="UPPER_ROMAN",t[t.LOWER_GREEK=8]="LOWER_GREEK",t[t.LOWER_ALPHA=9]="LOWER_ALPHA",t[t.UPPER_ALPHA=10]="UPPER_ALPHA",t[t.ARABIC_INDIC=11]="ARABIC_INDIC",t[t.ARMENIAN=12]="ARMENIAN",t[t.BENGALI=13]="BENGALI",t[t.CAMBODIAN=14]="CAMBODIAN",t[t.CJK_EARTHLY_BRANCH=15]="CJK_EARTHLY_BRANCH",t[t.CJK_HEAVENLY_STEM=16]="CJK_HEAVENLY_STEM",t[t.CJK_IDEOGRAPHIC=17]="CJK_IDEOGRAPHIC",t[t.DEVANAGARI=18]="DEVANAGARI",t[t.ETHIOPIC_NUMERIC=19]="ETHIOPIC_NUMERIC",t[t.GEORGIAN=20]="GEORGIAN",t[t.GUJARATI=21]="GUJARATI",t[t.GURMUKHI=22]="GURMUKHI",t[t.HEBREW=22]="HEBREW",t[t.HIRAGANA=23]="HIRAGANA",t[t.HIRAGANA_IROHA=24]="HIRAGANA_IROHA",t[t.JAPANESE_FORMAL=25]="JAPANESE_FORMAL",t[t.JAPANESE_INFORMAL=26]="JAPANESE_INFORMAL",t[t.KANNADA=27]="KANNADA",t[t.KATAKANA=28]="KATAKANA",t[t.KATAKANA_IROHA=29]="KATAKANA_IROHA",t[t.KHMER=30]="KHMER",t[t.KOREAN_HANGUL_FORMAL=31]="KOREAN_HANGUL_FORMAL",t[t.KOREAN_HANJA_FORMAL=32]="KOREAN_HANJA_FORMAL",t[t.KOREAN_HANJA_INFORMAL=33]="KOREAN_HANJA_INFORMAL",t[t.LAO=34]="LAO",t[t.LOWER_ARMENIAN=35]="LOWER_ARMENIAN",t[t.MALAYALAM=36]="MALAYALAM",t[t.MONGOLIAN=37]="MONGOLIAN",t[t.MYANMAR=38]="MYANMAR",t[t.ORIYA=39]="ORIYA",t[t.PERSIAN=40]="PERSIAN",t[t.SIMP_CHINESE_FORMAL=41]="SIMP_CHINESE_FORMAL",t[t.SIMP_CHINESE_INFORMAL=42]="SIMP_CHINESE_INFORMAL",t[t.TAMIL=43]="TAMIL",t[t.TELUGU=44]="TELUGU",t[t.THAI=45]="THAI",t[t.TIBETAN=46]="TIBETAN",t[t.TRAD_CHINESE_FORMAL=47]="TRAD_CHINESE_FORMAL",t[t.TRAD_CHINESE_INFORMAL=48]="TRAD_CHINESE_INFORMAL",t[t.UPPER_ARMENIAN=49]="UPPER_ARMENIAN",t[t.DISCLOSURE_OPEN=50]="DISCLOSURE_OPEN",t[t.DISCLOSURE_CLOSED=51]="DISCLOSURE_CLOSED"}(Ne||(Ne={}));var be,Le={name:"list-style-type",initialValue:"none",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"disc":return Ne.DISC;case"circle":return Ne.CIRCLE;case"square":return Ne.SQUARE;case"decimal":return Ne.DECIMAL;case"cjk-decimal":return Ne.CJK_DECIMAL;case"decimal-leading-zero":return Ne.DECIMAL_LEADING_ZERO;case"lower-roman":return Ne.LOWER_ROMAN;case"upper-roman":return Ne.UPPER_ROMAN;case"lower-greek":return Ne.LOWER_GREEK;case"lower-alpha":return Ne.LOWER_ALPHA;case"upper-alpha":return Ne.UPPER_ALPHA;case"arabic-indic":return Ne.ARABIC_INDIC;case"armenian":return Ne.ARMENIAN;case"bengali":return Ne.BENGALI;case"cambodian":return Ne.CAMBODIAN;case"cjk-earthly-branch":return Ne.CJK_EARTHLY_BRANCH;case"cjk-heavenly-stem":return Ne.CJK_HEAVENLY_STEM;case"cjk-ideographic":return Ne.CJK_IDEOGRAPHIC;case"devanagari":return Ne.DEVANAGARI;case"ethiopic-numeric":return Ne.ETHIOPIC_NUMERIC;case"georgian":return Ne.GEORGIAN;case"gujarati":return Ne.GUJARATI;case"gurmukhi":return Ne.GURMUKHI;case"hebrew":return Ne.HEBREW;case"hiragana":return Ne.HIRAGANA;case"hiragana-iroha":return Ne.HIRAGANA_IROHA;case"japanese-formal":return Ne.JAPANESE_FORMAL;case"japanese-informal":return Ne.JAPANESE_INFORMAL;case"kannada":return Ne.KANNADA;case"katakana":return Ne.KATAKANA;case"katakana-iroha":return Ne.KATAKANA_IROHA;case"khmer":return Ne.KHMER;case"korean-hangul-formal":return Ne.KOREAN_HANGUL_FORMAL;case"korean-hanja-formal":return Ne.KOREAN_HANJA_FORMAL;case"korean-hanja-informal":return Ne.KOREAN_HANJA_INFORMAL;case"lao":return Ne.LAO;case"lower-armenian":return Ne.LOWER_ARMENIAN;case"malayalam":return Ne.MALAYALAM;case"mongolian":return Ne.MONGOLIAN;case"myanmar":return Ne.MYANMAR;case"oriya":return Ne.ORIYA;case"persian":return Ne.PERSIAN;case"simp-chinese-formal":return Ne.SIMP_CHINESE_FORMAL;case"simp-chinese-informal":return Ne.SIMP_CHINESE_INFORMAL;case"tamil":return Ne.TAMIL;case"telugu":return Ne.TELUGU;case"thai":return Ne.THAI;case"tibetan":return Ne.TIBETAN;case"trad-chinese-formal":return Ne.TRAD_CHINESE_FORMAL;case"trad-chinese-informal":return Ne.TRAD_CHINESE_INFORMAL;case"upper-armenian":return Ne.UPPER_ARMENIAN;case"disclosure-open":return Ne.DISCLOSURE_OPEN;case"disclosure-closed":return Ne.DISCLOSURE_CLOSED;case"none":default:return Ne.NONE}}},He=function(t){return{name:"margin-"+t,initialValue:"0",prefix:!1,type:iA.TOKEN_VALUE}},xe=He("top"),Se=He("right"),Ie=He("bottom"),_e=He("left");!function(t){t[t.VISIBLE=0]="VISIBLE",t[t.HIDDEN=1]="HIDDEN",t[t.SCROLL=2]="SCROLL",t[t.AUTO=3]="AUTO"}(be||(be={}));var Te,Re={name:"overflow",initialValue:"visible",prefix:!1,type:iA.LIST,parse:function(t){return t.filter(It).map((function(t){switch(t.value){case"hidden":return be.HIDDEN;case"scroll":return be.SCROLL;case"auto":return be.AUTO;case"visible":default:return be.VISIBLE}}))}};!function(t){t.NORMAL="normal",t.BREAK_WORD="break-word"}(Te||(Te={}));var Oe,Ke={name:"overflow-wrap",initialValue:"normal",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"break-word":return Te.BREAK_WORD;case"normal":default:return Te.NORMAL}}},Me=function(t){return{name:"padding-"+t,initialValue:"0",prefix:!1,type:iA.TYPE_VALUE,format:"length-percentage"}},Pe=Me("top"),De=Me("right"),ke=Me("bottom"),ze=Me("left");!function(t){t[t.LEFT=0]="LEFT",t[t.CENTER=1]="CENTER",t[t.RIGHT=2]="RIGHT"}(Oe||(Oe={}));var je,qe={name:"text-align",initialValue:"left",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"right":return Oe.RIGHT;case"center":case"justify":return Oe.CENTER;case"left":default:return Oe.LEFT}}};!function(t){t[t.STATIC=0]="STATIC",t[t.RELATIVE=1]="RELATIVE",t[t.ABSOLUTE=2]="ABSOLUTE",t[t.FIXED=3]="FIXED",t[t.STICKY=4]="STICKY"}(je||(je={}));var Ve,Xe={name:"position",initialValue:"static",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"relative":return je.RELATIVE;case"absolute":return je.ABSOLUTE;case"fixed":return je.FIXED;case"sticky":return je.STICKY}return je.STATIC}},Ge={name:"text-shadow",initialValue:"none",type:iA.LIST,prefix:!1,parse:function(t){return 1===t.length&&Tt(t[0],"none")?[]:Kt(t).map((function(t){for(var A={color:cA.TRANSPARENT,offsetX:zt,offsetY:zt,blur:zt},e=0,r=0;r<t.length;r++){var n=t[r];Pt(n)?(0===e?A.offsetX=n:1===e?A.offsetY=n:A.blur=n,e++):A.color=Zt(n)}return A}))}};!function(t){t[t.NONE=0]="NONE",t[t.LOWERCASE=1]="LOWERCASE",t[t.UPPERCASE=2]="UPPERCASE",t[t.CAPITALIZE=3]="CAPITALIZE"}(Ve||(Ve={}));var Je,We={name:"text-transform",initialValue:"none",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"uppercase":return Ve.UPPERCASE;case"lowercase":return Ve.LOWERCASE;case"capitalize":return Ve.CAPITALIZE}return Ve.NONE}},Ye={name:"transform",initialValue:"none",prefix:!0,type:iA.VALUE,parse:function(t){if(t.type===h.IDENT_TOKEN&&"none"===t.value)return null;if(t.type===h.FUNCTION){var A=Ze[t.name];if(void 0===A)throw new Error('Attempting to parse an unsupported transform function "'+t.name+'"');return A(t.values)}return null}},Ze={matrix:function(t){var A=t.filter((function(t){return t.type===h.NUMBER_TOKEN})).map((function(t){return t.number}));return 6===A.length?A:null},matrix3d:function(t){var A=t.filter((function(t){return t.type===h.NUMBER_TOKEN})).map((function(t){return t.number})),e=A[0],r=A[1],n=(A[2],A[3],A[4]),i=A[5],o=(A[6],A[7],A[8],A[9],A[10],A[11],A[12]),s=A[13];return A[14],A[15],16===A.length?[e,r,n,i,o,s]:null}},$e={type:h.PERCENTAGE_TOKEN,number:50,flags:4},tr=[$e,$e],Ar={name:"transform-origin",initialValue:"50% 50%",prefix:!0,type:iA.LIST,parse:function(t){var A=t.filter(Dt);return 2!==A.length?tr:[A[0],A[1]]}};!function(t){t[t.VISIBLE=0]="VISIBLE",t[t.HIDDEN=1]="HIDDEN",t[t.COLLAPSE=2]="COLLAPSE"}(Je||(Je={}));var er,rr={name:"visible",initialValue:"none",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"hidden":return Je.HIDDEN;case"collapse":return Je.COLLAPSE;case"visible":default:return Je.VISIBLE}}};!function(t){t.NORMAL="normal",t.BREAK_ALL="break-all",t.KEEP_ALL="keep-all"}(er||(er={}));var nr,ir={name:"word-break",initialValue:"normal",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"break-all":return er.BREAK_ALL;case"keep-all":return er.KEEP_ALL;case"normal":default:return er.NORMAL}}},or={name:"z-index",initialValue:"auto",prefix:!1,type:iA.VALUE,parse:function(t){if(t.type===h.IDENT_TOKEN)return{auto:!0,order:0};if(St(t))return{auto:!1,order:t.number};throw new Error("Invalid z-index number parsed")}},sr={name:"opacity",initialValue:"1",type:iA.VALUE,prefix:!1,parse:function(t){return St(t)?t.number:1}},ar={name:"text-decoration-color",initialValue:"transparent",prefix:!1,type:iA.TYPE_VALUE,format:"color"},cr={name:"text-decoration-line",initialValue:"none",prefix:!1,type:iA.LIST,parse:function(t){return t.filter(It).map((function(t){switch(t.value){case"underline":return 1;case"overline":return 2;case"line-through":return 3;case"none":return 4}return 0})).filter((function(t){return 0!==t}))}},ur={name:"font-family",initialValue:"",prefix:!1,type:iA.LIST,parse:function(t){return t.filter(lr).map((function(t){return t.value}))}},lr=function(t){return t.type===h.STRING_TOKEN||t.type===h.IDENT_TOKEN},hr={name:"font-size",initialValue:"0",prefix:!1,type:iA.TYPE_VALUE,format:"length"},fr={name:"font-weight",initialValue:"normal",type:iA.VALUE,prefix:!1,parse:function(t){if(St(t))return t.number;if(It(t))switch(t.value){case"bold":return 700;case"normal":default:return 400}return 400}},dr={name:"font-variant",initialValue:"none",type:iA.LIST,prefix:!1,parse:function(t){return t.filter(It).map((function(t){return t.value}))}};!function(t){t.NORMAL="normal",t.ITALIC="italic",t.OBLIQUE="oblique"}(nr||(nr={}));var pr,Br={name:"font-style",initialValue:"normal",prefix:!1,type:iA.IDENT_VALUE,parse:function(t){switch(t){case"oblique":return nr.OBLIQUE;case"italic":return nr.ITALIC;case"normal":default:return nr.NORMAL}}},gr=function(t,A){return 0!=(t&A)},wr={name:"content",initialValue:"none",type:iA.LIST,prefix:!1,parse:function(t){if(0===t.length)return[];var A=t[0];return A.type===h.IDENT_TOKEN&&"none"===A.value?[]:t}},mr={name:"counter-increment",initialValue:"none",prefix:!0,type:iA.LIST,parse:function(t){if(0===t.length)return null;var A=t[0];if(A.type===h.IDENT_TOKEN&&"none"===A.value)return null;for(var e=[],r=t.filter(Rt),n=0;n<r.length;n++){var i=r[n],o=r[n+1];if(i.type===h.IDENT_TOKEN){var s=o&&St(o)?o.number:1;e.push({counter:i.value,increment:s})}}return e}},Qr={name:"counter-reset",initialValue:"none",prefix:!0,type:iA.LIST,parse:function(t){if(0===t.length)return[];for(var A=[],e=t.filter(Rt),r=0;r<e.length;r++){var n=e[r],i=e[r+1];if(It(n)&&"none"!==n.value){var o=i&&St(i)?i.number:0;A.push({counter:n.value,reset:o})}}return A}},Cr={name:"quotes",initialValue:"none",prefix:!0,type:iA.LIST,parse:function(t){if(0===t.length)return null;var A=t[0];if(A.type===h.IDENT_TOKEN&&"none"===A.value)return null;var e=[],r=t.filter(_t);if(r.length%2!=0)return null;for(var n=0;n<r.length;n+=2){var i=r[n].value,o=r[n+1].value;e.push({open:i,close:o})}return e}},yr=function(t,A,e){if(!t)return"";var r=t[Math.min(A,t.length-1)];return r?e?r.open:r.close:""},vr={name:"box-shadow",initialValue:"none",type:iA.LIST,prefix:!1,parse:function(t){return 1===t.length&&Tt(t[0],"none")?[]:Kt(t).map((function(t){for(var A={color:255,offsetX:zt,offsetY:zt,blur:zt,spread:zt,inset:!1},e=0,r=0;r<t.length;r++){var n=t[r];Tt(n,"inset")?A.inset=!0:Pt(n)?(0===e?A.offsetX=n:1===e?A.offsetY=n:2===e?A.blur=n:A.spread=n,e++):A.color=Zt(n)}return A}))}},Fr=function(){function t(t){this.backgroundClip=Er(fA,t.backgroundClip),this.backgroundColor=Er(dA,t.backgroundColor),this.backgroundImage=Er(PA,t.backgroundImage),this.backgroundOrigin=Er(DA,t.backgroundOrigin),this.backgroundPosition=Er(kA,t.backgroundPosition),this.backgroundRepeat=Er(jA,t.backgroundRepeat),this.backgroundSize=Er(XA,t.backgroundSize),this.borderTopColor=Er(WA,t.borderTopColor),this.borderRightColor=Er(YA,t.borderRightColor),this.borderBottomColor=Er(ZA,t.borderBottomColor),this.borderLeftColor=Er($A,t.borderLeftColor),this.borderTopLeftRadius=Er(Ae,t.borderTopLeftRadius),this.borderTopRightRadius=Er(ee,t.borderTopRightRadius),this.borderBottomRightRadius=Er(re,t.borderBottomRightRadius),this.borderBottomLeftRadius=Er(ne,t.borderBottomLeftRadius),this.borderTopStyle=Er(se,t.borderTopStyle),this.borderRightStyle=Er(ae,t.borderRightStyle),this.borderBottomStyle=Er(ce,t.borderBottomStyle),this.borderLeftStyle=Er(ue,t.borderLeftStyle),this.borderTopWidth=Er(he,t.borderTopWidth),this.borderRightWidth=Er(fe,t.borderRightWidth),this.borderBottomWidth=Er(de,t.borderBottomWidth),this.borderLeftWidth=Er(pe,t.borderLeftWidth),this.boxShadow=Er(vr,t.boxShadow),this.color=Er(Be,t.color),this.display=Er(ge,t.display),this.float=Er(Qe,t.cssFloat),this.fontFamily=Er(ur,t.fontFamily),this.fontSize=Er(hr,t.fontSize),this.fontStyle=Er(Br,t.fontStyle),this.fontVariant=Er(dr,t.fontVariant),this.fontWeight=Er(fr,t.fontWeight),this.letterSpacing=Er(Ce,t.letterSpacing),this.lineBreak=Er(ve,t.lineBreak),this.lineHeight=Er(Fe,t.lineHeight),this.listStyleImage=Er(Ue,t.listStyleImage),this.listStylePosition=Er(Ee,t.listStylePosition),this.listStyleType=Er(Le,t.listStyleType),this.marginTop=Er(xe,t.marginTop),this.marginRight=Er(Se,t.marginRight),this.marginBottom=Er(Ie,t.marginBottom),this.marginLeft=Er(_e,t.marginLeft),this.opacity=Er(sr,t.opacity);var A=Er(Re,t.overflow);this.overflowX=A[0],this.overflowY=A[A.length>1?1:0],this.overflowWrap=Er(Ke,t.overflowWrap),this.paddingTop=Er(Pe,t.paddingTop),this.paddingRight=Er(De,t.paddingRight),this.paddingBottom=Er(ke,t.paddingBottom),this.paddingLeft=Er(ze,t.paddingLeft),this.position=Er(Xe,t.position),this.textAlign=Er(qe,t.textAlign),this.textDecorationColor=Er(ar,t.textDecorationColor||t.color),this.textDecorationLine=Er(cr,t.textDecorationLine),this.textShadow=Er(Ge,t.textShadow),this.textTransform=Er(We,t.textTransform),this.transform=Er(Ye,t.transform),this.transformOrigin=Er(Ar,t.transformOrigin),this.visibility=Er(rr,t.visibility),this.wordBreak=Er(ir,t.wordBreak),this.zIndex=Er(or,t.zIndex)}return t.prototype.isVisible=function(){return this.display>0&&this.opacity>0&&this.visibility===Je.VISIBLE},t.prototype.isTransparent=function(){return $t(this.backgroundColor)},t.prototype.isTransformed=function(){return null!==this.transform},t.prototype.isPositioned=function(){return this.position!==je.STATIC},t.prototype.isPositionedWithZIndex=function(){return this.isPositioned()&&!this.zIndex.auto},t.prototype.isFloating=function(){return this.float!==ie.NONE},t.prototype.isInlineLevel=function(){return gr(this.display,4)||gr(this.display,33554432)||gr(this.display,268435456)||gr(this.display,536870912)||gr(this.display,67108864)||gr(this.display,134217728)},t}(),Ur=function(t){this.content=Er(wr,t.content),this.quotes=Er(Cr,t.quotes)},Nr=function(t){this.counterIncrement=Er(mr,t.counterIncrement),this.counterReset=Er(Qr,t.counterReset)},Er=function(t,A){var e=new Lt,r=null!=A?A.toString():t.initialValue;e.write(r);var n=new Ht(e.read());switch(t.type){case iA.IDENT_VALUE:var i=n.parseComponentValue();return t.parse(It(i)?i.value:t.initialValue);case iA.VALUE:return t.parse(n.parseComponentValue());case iA.LIST:return t.parse(n.parseComponentValues());case iA.TOKEN_VALUE:return n.parseComponentValue();case iA.TYPE_VALUE:switch(t.format){case"angle":return Gt(n.parseComponentValue());case"color":return Zt(n.parseComponentValue());case"image":return KA(n.parseComponentValue());case"length":var o=n.parseComponentValue();return Pt(o)?o:zt;case"length-percentage":var s=n.parseComponentValue();return Dt(s)?s:zt}}throw new Error("Attempting to parse unsupported css format type "+t.format)},br=function(t){this.styles=new Fr(window.getComputedStyle(t,null)),this.textNodes=[],this.elements=[],null!==this.styles.transform&&on(t)&&(t.style.transform="none"),this.bounds=o(t),this.flags=0},Lr=function(t,A){this.text=t,this.bounds=A},Hr=function(t){var A=t.ownerDocument;if(A){var e=A.createElement("html2canvaswrapper");e.appendChild(t.cloneNode(!0));var r=t.parentNode;if(r){r.replaceChild(e,t);var n=o(e);return e.firstChild&&r.replaceChild(e.firstChild,e),n}}return new i(0,0,0,0)},xr=function(t,A,e){var r=t.ownerDocument;if(!r)throw new Error("Node has no owner document");var n=r.createRange();return n.setStart(t,A),n.setEnd(t,A+e),i.fromClientRect(n.getBoundingClientRect())},Sr=function(t,A){return 0!==A.letterSpacing?s(t).map((function(t){return a(t)})):Ir(t,A)},Ir=function(t,A){for(var e,r=function(t,A){var e=s(t),r=W(e,A),n=r[0],i=r[1],o=r[2],a=e.length,c=0,u=0;return{next:function(){if(u>=a)return{done:!0,value:null};for(var t="×";u<a&&"×"===(t=J(e,i,n,++u,o)););if("×"!==t||u===a){var A=new Y(e,t,c,u);return c=u,{value:A,done:!1}}return{done:!0,value:null}}}}(t,{lineBreak:A.lineBreak,wordBreak:A.overflowWrap===Te.BREAK_WORD?"break-word":A.wordBreak}),n=[];!(e=r.next()).done;)e.value&&n.push(e.value.slice());return n},_r=function(t,A){this.text=Tr(t.data,A.textTransform),this.textBounds=function(t,A,e){var r=Sr(t,A),n=[],i=0;return r.forEach((function(t){if(A.textDecorationLine.length||t.trim().length>0)if(FA.SUPPORT_RANGE_BOUNDS)n.push(new Lr(t,xr(e,i,t.length)));else{var r=e.splitText(t.length);n.push(new Lr(t,Hr(e))),e=r}else FA.SUPPORT_RANGE_BOUNDS||(e=e.splitText(t.length));i+=t.length})),n}(this.text,A,t)},Tr=function(t,A){switch(A){case Ve.LOWERCASE:return t.toLowerCase();case Ve.CAPITALIZE:return t.replace(Rr,Or);case Ve.UPPERCASE:return t.toUpperCase();default:return t}},Rr=/(^|\s|:|-|\(|\))([a-z])/g,Or=function(t,A,e){return t.length>0?A+e.toUpperCase():t},Kr=function(t){function e(A){var e=t.call(this,A)||this;return e.src=A.currentSrc||A.src,e.intrinsicWidth=A.naturalWidth,e.intrinsicHeight=A.naturalHeight,NA.getInstance().addImage(e.src),e}return A(e,t),e}(br),Mr=function(t){function e(A){var e=t.call(this,A)||this;return e.canvas=A,e.intrinsicWidth=A.width,e.intrinsicHeight=A.height,e}return A(e,t),e}(br),Pr=function(t){function e(A){var e=t.call(this,A)||this,r=new XMLSerializer;return e.svg="data:image/svg+xml,"+encodeURIComponent(r.serializeToString(A)),e.intrinsicWidth=A.width.baseVal.value,e.intrinsicHeight=A.height.baseVal.value,NA.getInstance().addImage(e.svg),e}return A(e,t),e}(br),Dr=function(t){function e(A){var e=t.call(this,A)||this;return e.value=A.value,e}return A(e,t),e}(br),kr=function(t){function e(A){var e=t.call(this,A)||this;return e.start=A.start,e.reversed="boolean"==typeof A.reversed&&!0===A.reversed,e}return A(e,t),e}(br),zr=[{type:h.DIMENSION_TOKEN,flags:0,unit:"px",number:3}],jr=[{type:h.PERCENTAGE_TOKEN,flags:0,number:50}],qr="password",Vr=function(t){function e(A){var e,r,n,o=t.call(this,A)||this;switch(o.type=A.type.toLowerCase(),o.checked=A.checked,o.value=0===(r=(e=A).type===qr?new Array(e.value.length+1).join("•"):e.value).length?e.placeholder||"":r,"checkbox"!==o.type&&"radio"!==o.type||(o.styles.backgroundColor=3739148031,o.styles.borderTopColor=o.styles.borderRightColor=o.styles.borderBottomColor=o.styles.borderLeftColor=2779096575,o.styles.borderTopWidth=o.styles.borderRightWidth=o.styles.borderBottomWidth=o.styles.borderLeftWidth=1,o.styles.borderTopStyle=o.styles.borderRightStyle=o.styles.borderBottomStyle=o.styles.borderLeftStyle=VA.SOLID,o.styles.backgroundClip=[oA.BORDER_BOX],o.styles.backgroundOrigin=[0],o.bounds=(n=o.bounds).width>n.height?new i(n.left+(n.width-n.height)/2,n.top,n.height,n.height):n.width<n.height?new i(n.left,n.top+(n.height-n.width)/2,n.width,n.width):n),o.type){case"checkbox":o.styles.borderTopRightRadius=o.styles.borderTopLeftRadius=o.styles.borderBottomRightRadius=o.styles.borderBottomLeftRadius=zr;break;case"radio":o.styles.borderTopRightRadius=o.styles.borderTopLeftRadius=o.styles.borderBottomRightRadius=o.styles.borderBottomLeftRadius=jr}return o}return A(e,t),e}(br),Xr=function(t){function e(A){var e=t.call(this,A)||this,r=A.options[A.selectedIndex||0];return e.value=r&&r.text||"",e}return A(e,t),e}(br),Gr=function(t){function e(A){var e=t.call(this,A)||this;return e.value=A.value,e}return A(e,t),e}(br),Jr=function(t){return Zt(Ht.create(t).parseComponentValue())},Wr=function(t){function e(A){var e=t.call(this,A)||this;e.src=A.src,e.width=parseInt(A.width,10)||0,e.height=parseInt(A.height,10)||0,e.backgroundColor=e.styles.backgroundColor;try{if(A.contentWindow&&A.contentWindow.document&&A.contentWindow.document.documentElement){e.tree=tn(A.contentWindow.document.documentElement);var r=A.contentWindow.document.documentElement?Jr(getComputedStyle(A.contentWindow.document.documentElement).backgroundColor):cA.TRANSPARENT,n=A.contentWindow.document.body?Jr(getComputedStyle(A.contentWindow.document.body).backgroundColor):cA.TRANSPARENT;e.backgroundColor=$t(r)?$t(n)?e.styles.backgroundColor:n:r}}catch(t){}return e}return A(e,t),e}(br),Yr=["OL","UL","MENU"],Zr=function(t,A,e){for(var r=t.firstChild,n=void 0;r;r=n)if(n=r.nextSibling,rn(r)&&r.data.trim().length>0)A.textNodes.push(new _r(r,A.styles));else if(nn(r)){var i=$r(r);i.styles.isVisible()&&(An(r,i,e)?i.flags|=4:en(i.styles)&&(i.flags|=2),-1!==Yr.indexOf(r.tagName)&&(i.flags|=8),A.elements.push(i),gn(r)||un(r)||wn(r)||Zr(r,i,e))}},$r=function(t){return fn(t)?new Kr(t):hn(t)?new Mr(t):un(t)?new Pr(t):sn(t)?new Dr(t):an(t)?new kr(t):cn(t)?new Vr(t):wn(t)?new Xr(t):gn(t)?new Gr(t):dn(t)?new Wr(t):new br(t)},tn=function(t){var A=$r(t);return A.flags|=4,Zr(t,A,A),A},An=function(t,A,e){return A.styles.isPositionedWithZIndex()||A.styles.opacity<1||A.styles.isTransformed()||ln(t)&&e.styles.isTransparent()},en=function(t){return t.isPositioned()||t.isFloating()},rn=function(t){return t.nodeType===Node.TEXT_NODE},nn=function(t){return t.nodeType===Node.ELEMENT_NODE},on=function(t){return void 0!==t.style},sn=function(t){return"LI"===t.tagName},an=function(t){return"OL"===t.tagName},cn=function(t){return"INPUT"===t.tagName},un=function(t){return"svg"===t.tagName},ln=function(t){return"BODY"===t.tagName},hn=function(t){return"CANVAS"===t.tagName},fn=function(t){return"IMG"===t.tagName},dn=function(t){return"IFRAME"===t.tagName},pn=function(t){return"STYLE"===t.tagName},Bn=function(t){return"SCRIPT"===t.tagName},gn=function(t){return"TEXTAREA"===t.tagName},wn=function(t){return"SELECT"===t.tagName},mn=function(){function t(){this.counters={}}return t.prototype.getCounterValue=function(t){var A=this.counters[t];return A&&A.length?A[A.length-1]:1},t.prototype.getCounterValues=function(t){var A=this.counters[t];return A||[]},t.prototype.pop=function(t){var A=this;t.forEach((function(t){return A.counters[t].pop()}))},t.prototype.parse=function(t){var A=this,e=t.counterIncrement,r=t.counterReset,n=!0;null!==e&&e.forEach((function(t){var e=A.counters[t.counter];e&&0!==t.increment&&(n=!1,e[Math.max(0,e.length-1)]+=t.increment)}));var i=[];return n&&r.forEach((function(t){var e=A.counters[t.counter];i.push(t.counter),e||(e=A.counters[t.counter]=[]),e.push(t.reset)})),i},t}(),Qn={integers:[1e3,900,500,400,100,90,50,40,10,9,5,4,1],values:["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]},Cn={integers:[9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["Ք","Փ","Ւ","Ց","Ր","Տ","Վ","Ս","Ռ","Ջ","Պ","Չ","Ո","Շ","Ն","Յ","Մ","Ճ","Ղ","Ձ","Հ","Կ","Ծ","Խ","Լ","Ի","Ժ","Թ","Ը","Է","Զ","Ե","Դ","Գ","Բ","Ա"]},yn={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,400,300,200,100,90,80,70,60,50,40,30,20,19,18,17,16,15,10,9,8,7,6,5,4,3,2,1],values:["י׳","ט׳","ח׳","ז׳","ו׳","ה׳","ד׳","ג׳","ב׳","א׳","ת","ש","ר","ק","צ","פ","ע","ס","נ","מ","ל","כ","יט","יח","יז","טז","טו","י","ט","ח","ז","ו","ה","ד","ג","ב","א"]},vn={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["ჵ","ჰ","ჯ","ჴ","ხ","ჭ","წ","ძ","ც","ჩ","შ","ყ","ღ","ქ","ფ","ჳ","ტ","ს","რ","ჟ","პ","ო","ჲ","ნ","მ","ლ","კ","ი","თ","ჱ","ზ","ვ","ე","დ","გ","ბ","ა"]},Fn=function(t,A,e,r,n,i){return t<A||t>e?Ln(t,n,i.length>0):r.integers.reduce((function(A,e,n){for(;t>=e;)t-=e,A+=r.values[n];return A}),"")+i},Un=function(t,A,e,r){var n="";do{e||t--,n=r(t)+n,t/=A}while(t*A>=A);return n},Nn=function(t,A,e,r,n){var i=e-A+1;return(t<0?"-":"")+(Un(Math.abs(t),i,r,(function(t){return a(Math.floor(t%i)+A)}))+n)},En=function(t,A,e){void 0===e&&(e=". ");var r=A.length;return Un(Math.abs(t),r,!1,(function(t){return A[Math.floor(t%r)]}))+e},bn=function(t,A,e,r,n,i){if(t<-9999||t>9999)return Ln(t,Ne.CJK_DECIMAL,n.length>0);var o=Math.abs(t),s=n;if(0===o)return A[0]+s;for(var a=0;o>0&&a<=4;a++){var c=o%10;0===c&&gr(i,1)&&""!==s?s=A[c]+s:c>1||1===c&&0===a||1===c&&1===a&&gr(i,2)||1===c&&1===a&&gr(i,4)&&t>100||1===c&&a>1&&gr(i,8)?s=A[c]+(a>0?e[a-1]:"")+s:1===c&&a>0&&(s=e[a-1]+s),o=Math.floor(o/10)}return(t<0?r:"")+s},Ln=function(t,A,e){var r=e?". ":"",n=e?"、":"",i=e?", ":"",o=e?" ":"";switch(A){case Ne.DISC:return"•"+o;case Ne.CIRCLE:return"◦"+o;case Ne.SQUARE:return"◾"+o;case Ne.DECIMAL_LEADING_ZERO:var s=Nn(t,48,57,!0,r);return s.length<4?"0"+s:s;case Ne.CJK_DECIMAL:return En(t,"〇一二三四五六七八九",n);case Ne.LOWER_ROMAN:return Fn(t,1,3999,Qn,Ne.DECIMAL,r).toLowerCase();case Ne.UPPER_ROMAN:return Fn(t,1,3999,Qn,Ne.DECIMAL,r);case Ne.LOWER_GREEK:return Nn(t,945,969,!1,r);case Ne.LOWER_ALPHA:return Nn(t,97,122,!1,r);case Ne.UPPER_ALPHA:return Nn(t,65,90,!1,r);case Ne.ARABIC_INDIC:return Nn(t,1632,1641,!0,r);case Ne.ARMENIAN:case Ne.UPPER_ARMENIAN:return Fn(t,1,9999,Cn,Ne.DECIMAL,r);case Ne.LOWER_ARMENIAN:return Fn(t,1,9999,Cn,Ne.DECIMAL,r).toLowerCase();case Ne.BENGALI:return Nn(t,2534,2543,!0,r);case Ne.CAMBODIAN:case Ne.KHMER:return Nn(t,6112,6121,!0,r);case Ne.CJK_EARTHLY_BRANCH:return En(t,"子丑寅卯辰巳午未申酉戌亥",n);case Ne.CJK_HEAVENLY_STEM:return En(t,"甲乙丙丁戊己庚辛壬癸",n);case Ne.CJK_IDEOGRAPHIC:case Ne.TRAD_CHINESE_INFORMAL:return bn(t,"零一二三四五六七八九","十百千萬","負",n,14);case Ne.TRAD_CHINESE_FORMAL:return bn(t,"零壹貳參肆伍陸柒捌玖","拾佰仟萬","負",n,15);case Ne.SIMP_CHINESE_INFORMAL:return bn(t,"零一二三四五六七八九","十百千萬","负",n,14);case Ne.SIMP_CHINESE_FORMAL:return bn(t,"零壹贰叁肆伍陆柒捌玖","拾佰仟萬","负",n,15);case Ne.JAPANESE_INFORMAL:return bn(t,"〇一二三四五六七八九","十百千万","マイナス",n,0);case Ne.JAPANESE_FORMAL:return bn(t,"零壱弐参四伍六七八九","拾百千万","マイナス",n,7);case Ne.KOREAN_HANGUL_FORMAL:return bn(t,"영일이삼사오육칠팔구","십백천만","마이너스",i,7);case Ne.KOREAN_HANJA_INFORMAL:return bn(t,"零一二三四五六七八九","十百千萬","마이너스",i,0);case Ne.KOREAN_HANJA_FORMAL:return bn(t,"零壹貳參四五六七八九","拾百千","마이너스",i,7);case Ne.DEVANAGARI:return Nn(t,2406,2415,!0,r);case Ne.GEORGIAN:return Fn(t,1,19999,vn,Ne.DECIMAL,r);case Ne.GUJARATI:return Nn(t,2790,2799,!0,r);case Ne.GURMUKHI:return Nn(t,2662,2671,!0,r);case Ne.HEBREW:return Fn(t,1,10999,yn,Ne.DECIMAL,r);case Ne.HIRAGANA:return En(t,"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");case Ne.HIRAGANA_IROHA:return En(t,"いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");case Ne.KANNADA:return Nn(t,3302,3311,!0,r);case Ne.KATAKANA:return En(t,"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン",n);case Ne.KATAKANA_IROHA:return En(t,"イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス",n);case Ne.LAO:return Nn(t,3792,3801,!0,r);case Ne.MONGOLIAN:return Nn(t,6160,6169,!0,r);case Ne.MYANMAR:return Nn(t,4160,4169,!0,r);case Ne.ORIYA:return Nn(t,2918,2927,!0,r);case Ne.PERSIAN:return Nn(t,1776,1785,!0,r);case Ne.TAMIL:return Nn(t,3046,3055,!0,r);case Ne.TELUGU:return Nn(t,3174,3183,!0,r);case Ne.THAI:return Nn(t,3664,3673,!0,r);case Ne.TIBETAN:return Nn(t,3872,3881,!0,r);case Ne.DECIMAL:default:return Nn(t,48,57,!0,r)}},Hn=function(){function t(t,A){if(this.options=A,this.scrolledElements=[],this.referenceElement=t,this.counters=new mn,this.quoteDepth=0,!t.ownerDocument)throw new Error("Cloned element does not have an owner document");this.documentElement=this.cloneNode(t.ownerDocument.documentElement)}return t.prototype.toIFrame=function(t,A){var e=this,i=Sn(t,A);if(!i.contentWindow)return Promise.reject("Unable to find iframe window");var o=t.defaultView.pageXOffset,s=t.defaultView.pageYOffset,a=i.contentWindow,c=a.document,u=In(i).then((function(){return r(e,void 0,void 0,(function(){var t;return n(this,(function(e){switch(e.label){case 0:return this.scrolledElements.forEach(On),a&&(a.scrollTo(A.left,A.top),!/(iPad|iPhone|iPod)/g.test(navigator.userAgent)||a.scrollY===A.top&&a.scrollX===A.left||(c.documentElement.style.top=-A.top+"px",c.documentElement.style.left=-A.left+"px",c.documentElement.style.position="absolute")),t=this.options.onclone,void 0===this.clonedReferenceElement?[2,Promise.reject("Error finding the "+this.referenceElement.nodeName+" in the cloned document")]:c.fonts&&c.fonts.ready?[4,c.fonts.ready]:[3,2];case 1:e.sent(),e.label=2;case 2:return"function"==typeof t?[2,Promise.resolve().then((function(){return t(c)})).then((function(){return i}))]:[2,i]}}))}))}));return c.open(),c.write(Tn(document.doctype)+"<html></html>"),Rn(this.referenceElement.ownerDocument,o,s),c.replaceChild(c.adoptNode(this.documentElement),c.documentElement),c.close(),u},t.prototype.createElementClone=function(t){return hn(t)?this.createCanvasClone(t):pn(t)?this.createStyleClone(t):t.cloneNode(!1)},t.prototype.createStyleClone=function(t){try{var A=t.sheet;if(A&&A.cssRules){var e=[].slice.call(A.cssRules,0).reduce((function(t,A){return A&&"string"==typeof A.cssText?t+A.cssText:t}),""),r=t.cloneNode(!1);return r.textContent=e,r}}catch(t){if(UA.getInstance(this.options.id).error("Unable to access cssRules property",t),"SecurityError"!==t.name)throw t}return t.cloneNode(!1)},t.prototype.createCanvasClone=function(t){if(this.options.inlineImages&&t.ownerDocument){var A=t.ownerDocument.createElement("img");try{return A.src=t.toDataURL(),A}catch(t){UA.getInstance(this.options.id).info("Unable to clone canvas contents, canvas is tainted")}}var e=t.cloneNode(!1);try{e.width=t.width,e.height=t.height;var r=t.getContext("2d"),n=e.getContext("2d");return n&&(r?n.putImageData(r.getImageData(0,0,t.width,t.height),0,0):n.drawImage(t,0,0)),e}catch(t){}return e},t.prototype.cloneNode=function(t){if(rn(t))return document.createTextNode(t.data);if(!t.ownerDocument)return t.cloneNode(!1);var A=t.ownerDocument.defaultView;if(on(t)&&A){var e=this.createElementClone(t),r=A.getComputedStyle(t),n=A.getComputedStyle(t,":before"),i=A.getComputedStyle(t,":after");this.referenceElement===t&&(this.clonedReferenceElement=e),ln(e)&&Pn(e);for(var o=this.counters.parse(new Nr(r)),s=this.resolvePseudoContent(t,e,n,pr.BEFORE),a=t.firstChild;a;a=a.nextSibling)nn(a)&&(Bn(a)||a.hasAttribute("data-html2canvas-ignore")||"function"==typeof this.options.ignoreElements&&this.options.ignoreElements(a))||this.options.copyStyles&&nn(a)&&pn(a)||e.appendChild(this.cloneNode(a));s&&e.insertBefore(s,e.firstChild);var c=this.resolvePseudoContent(t,e,i,pr.AFTER);return c&&e.appendChild(c),this.counters.pop(o),r&&this.options.copyStyles&&!dn(t)&&_n(r,e),0===t.scrollTop&&0===t.scrollLeft||this.scrolledElements.push([e,t.scrollLeft,t.scrollTop]),(gn(t)||wn(t))&&(gn(e)||wn(e))&&(e.value=t.value),e}return t.cloneNode(!1)},t.prototype.resolvePseudoContent=function(t,A,e,r){var n=this;if(e){var i=e.content,o=A.ownerDocument;if(o&&i&&"none"!==i&&"-moz-alt-content"!==i&&"none"!==e.display){this.counters.parse(new Nr(e));var s=new Ur(e),a=o.createElement("html2canvaspseudoelement");return _n(e,a),s.content.forEach((function(A){if(A.type===h.STRING_TOKEN)a.appendChild(o.createTextNode(A.value));else if(A.type===h.URL_TOKEN){var e=o.createElement("img");e.src=A.value,e.style.opacity="1",a.appendChild(e)}else if(A.type===h.FUNCTION){if("attr"===A.name){var r=A.values.filter(It);r.length&&a.appendChild(o.createTextNode(t.getAttribute(r[0].value)||""))}else if("counter"===A.name){var i=A.values.filter(Ot),c=i[0],u=i[1];if(c&&It(c)){var l=n.counters.getCounterValue(c.value),f=u&&It(u)?Le.parse(u.value):Ne.DECIMAL;a.appendChild(o.createTextNode(Ln(l,f,!1)))}}else if("counters"===A.name){var d=A.values.filter(Ot),p=(c=d[0],d[1]);if(u=d[2],c&&It(c)){var B=n.counters.getCounterValues(c.value),g=u&&It(u)?Le.parse(u.value):Ne.DECIMAL,w=p&&p.type===h.STRING_TOKEN?p.value:"",m=B.map((function(t){return Ln(t,g,!1)})).join(w);a.appendChild(o.createTextNode(m))}}}else if(A.type===h.IDENT_TOKEN)switch(A.value){case"open-quote":a.appendChild(o.createTextNode(yr(s.quotes,n.quoteDepth++,!0)));break;case"close-quote":a.appendChild(o.createTextNode(yr(s.quotes,--n.quoteDepth,!1)));break;default:a.appendChild(o.createTextNode(A.value))}})),a.className=Kn+" "+Mn,A.className+=r===pr.BEFORE?" "+Kn:" "+Mn,a}}},t.destroy=function(t){return!!t.parentNode&&(t.parentNode.removeChild(t),!0)},t}();!function(t){t[t.BEFORE=0]="BEFORE",t[t.AFTER=1]="AFTER"}(pr||(pr={}));var xn,Sn=function(t,A){var e=t.createElement("iframe");return e.className="html2canvas-container",e.style.visibility="hidden",e.style.position="fixed",e.style.left="-10000px",e.style.top="0px",e.style.border="0",e.width=A.width.toString(),e.height=A.height.toString(),e.scrolling="no",e.setAttribute("data-html2canvas-ignore","true"),t.body.appendChild(e),e},In=function(t){return new Promise((function(A,e){var r=t.contentWindow;if(!r)return e("No window assigned for iframe");var n=r.document;r.onload=t.onload=n.onreadystatechange=function(){r.onload=t.onload=n.onreadystatechange=null;var e=setInterval((function(){n.body.childNodes.length>0&&"complete"===n.readyState&&(clearInterval(e),A(t))}),50)}}))},_n=function(t,A){for(var e=t.length-1;e>=0;e--){var r=t.item(e);"content"!==r&&A.style.setProperty(r,t.getPropertyValue(r))}return A},Tn=function(t){var A="";return t&&(A+="<!DOCTYPE ",t.name&&(A+=t.name),t.internalSubset&&(A+=t.internalSubset),t.publicId&&(A+='"'+t.publicId+'"'),t.systemId&&(A+='"'+t.systemId+'"'),A+=">"),A},Rn=function(t,A,e){t&&t.defaultView&&(A!==t.defaultView.pageXOffset||e!==t.defaultView.pageYOffset)&&t.defaultView.scrollTo(A,e)},On=function(t){var A=t[0],e=t[1],r=t[2];A.scrollLeft=e,A.scrollTop=r},Kn="___html2canvas___pseudoelement_before",Mn="___html2canvas___pseudoelement_after",Pn=function(t){Dn(t,"."+Kn+':before{\n    content: "" !important;\n    display: none !important;\n}\n         .'+Mn+':after{\n    content: "" !important;\n    display: none !important;\n}')},Dn=function(t,A){var e=t.ownerDocument;if(e){var r=e.createElement("style");r.textContent=A,t.appendChild(r)}};!function(t){t[t.VECTOR=0]="VECTOR",t[t.BEZIER_CURVE=1]="BEZIER_CURVE"}(xn||(xn={}));var kn,zn=function(t,A){return t.length===A.length&&t.some((function(t,e){return t===A[e]}))},jn=function(){function t(t,A){this.type=xn.VECTOR,this.x=t,this.y=A}return t.prototype.add=function(A,e){return new t(this.x+A,this.y+e)},t}(),qn=function(t,A,e){return new jn(t.x+(A.x-t.x)*e,t.y+(A.y-t.y)*e)},Vn=function(){function t(t,A,e,r){this.type=xn.BEZIER_CURVE,this.start=t,this.startControl=A,this.endControl=e,this.end=r}return t.prototype.subdivide=function(A,e){var r=qn(this.start,this.startControl,A),n=qn(this.startControl,this.endControl,A),i=qn(this.endControl,this.end,A),o=qn(r,n,A),s=qn(n,i,A),a=qn(o,s,A);return e?new t(this.start,r,o,a):new t(a,s,i,this.end)},t.prototype.add=function(A,e){return new t(this.start.add(A,e),this.startControl.add(A,e),this.endControl.add(A,e),this.end.add(A,e))},t.prototype.reverse=function(){return new t(this.end,this.endControl,this.startControl,this.start)},t}(),Xn=function(t){return t.type===xn.BEZIER_CURVE},Gn=function(t){var A=t.styles,e=t.bounds,r=Vt(A.borderTopLeftRadius,e.width,e.height),n=r[0],i=r[1],o=Vt(A.borderTopRightRadius,e.width,e.height),s=o[0],a=o[1],c=Vt(A.borderBottomRightRadius,e.width,e.height),u=c[0],l=c[1],h=Vt(A.borderBottomLeftRadius,e.width,e.height),f=h[0],d=h[1],p=[];p.push((n+s)/e.width),p.push((f+u)/e.width),p.push((i+d)/e.height),p.push((a+l)/e.height);var B=Math.max.apply(Math,p);B>1&&(n/=B,i/=B,s/=B,a/=B,u/=B,l/=B,f/=B,d/=B);var g=e.width-s,w=e.height-l,m=e.width-u,Q=e.height-d,C=A.borderTopWidth,y=A.borderRightWidth,v=A.borderBottomWidth,F=A.borderLeftWidth,U=Xt(A.paddingTop,t.bounds.width),N=Xt(A.paddingRight,t.bounds.width),E=Xt(A.paddingBottom,t.bounds.width),b=Xt(A.paddingLeft,t.bounds.width);this.topLeftBorderBox=n>0||i>0?Jn(e.left,e.top,n,i,kn.TOP_LEFT):new jn(e.left,e.top),this.topRightBorderBox=s>0||a>0?Jn(e.left+g,e.top,s,a,kn.TOP_RIGHT):new jn(e.left+e.width,e.top),this.bottomRightBorderBox=u>0||l>0?Jn(e.left+m,e.top+w,u,l,kn.BOTTOM_RIGHT):new jn(e.left+e.width,e.top+e.height),this.bottomLeftBorderBox=f>0||d>0?Jn(e.left,e.top+Q,f,d,kn.BOTTOM_LEFT):new jn(e.left,e.top+e.height),this.topLeftPaddingBox=n>0||i>0?Jn(e.left+F,e.top+C,Math.max(0,n-F),Math.max(0,i-C),kn.TOP_LEFT):new jn(e.left+F,e.top+C),this.topRightPaddingBox=s>0||a>0?Jn(e.left+Math.min(g,e.width+F),e.top+C,g>e.width+F?0:s-F,a-C,kn.TOP_RIGHT):new jn(e.left+e.width-y,e.top+C),this.bottomRightPaddingBox=u>0||l>0?Jn(e.left+Math.min(m,e.width-F),e.top+Math.min(w,e.height+C),Math.max(0,u-y),l-v,kn.BOTTOM_RIGHT):new jn(e.left+e.width-y,e.top+e.height-v),this.bottomLeftPaddingBox=f>0||d>0?Jn(e.left+F,e.top+Q,Math.max(0,f-F),d-v,kn.BOTTOM_LEFT):new jn(e.left+F,e.top+e.height-v),this.topLeftContentBox=n>0||i>0?Jn(e.left+F+b,e.top+C+U,Math.max(0,n-(F+b)),Math.max(0,i-(C+U)),kn.TOP_LEFT):new jn(e.left+F+b,e.top+C+U),this.topRightContentBox=s>0||a>0?Jn(e.left+Math.min(g,e.width+F+b),e.top+C+U,g>e.width+F+b?0:s-F+b,a-(C+U),kn.TOP_RIGHT):new jn(e.left+e.width-(y+N),e.top+C+U),this.bottomRightContentBox=u>0||l>0?Jn(e.left+Math.min(m,e.width-(F+b)),e.top+Math.min(w,e.height+C+U),Math.max(0,u-(y+N)),l-(v+E),kn.BOTTOM_RIGHT):new jn(e.left+e.width-(y+N),e.top+e.height-(v+E)),this.bottomLeftContentBox=f>0||d>0?Jn(e.left+F+b,e.top+Q,Math.max(0,f-(F+b)),d-(v+E),kn.BOTTOM_LEFT):new jn(e.left+F+b,e.top+e.height-(v+E))};!function(t){t[t.TOP_LEFT=0]="TOP_LEFT",t[t.TOP_RIGHT=1]="TOP_RIGHT",t[t.BOTTOM_RIGHT=2]="BOTTOM_RIGHT",t[t.BOTTOM_LEFT=3]="BOTTOM_LEFT"}(kn||(kn={}));var Jn=function(t,A,e,r,n){var i=(Math.sqrt(2)-1)/3*4,o=e*i,s=r*i,a=t+e,c=A+r;switch(n){case kn.TOP_LEFT:return new Vn(new jn(t,c),new jn(t,c-s),new jn(a-o,A),new jn(a,A));case kn.TOP_RIGHT:return new Vn(new jn(t,A),new jn(t+o,A),new jn(a,c-s),new jn(a,c));case kn.BOTTOM_RIGHT:return new Vn(new jn(a,A),new jn(a,A+s),new jn(t+o,c),new jn(t,c));case kn.BOTTOM_LEFT:default:return new Vn(new jn(a,c),new jn(a-o,c),new jn(t,A+s),new jn(t,A))}},Wn=function(t){return[t.topLeftBorderBox,t.topRightBorderBox,t.bottomRightBorderBox,t.bottomLeftBorderBox]},Yn=function(t){return[t.topLeftPaddingBox,t.topRightPaddingBox,t.bottomRightPaddingBox,t.bottomLeftPaddingBox]},Zn=function(t,A,e){this.type=0,this.offsetX=t,this.offsetY=A,this.matrix=e,this.target=6},$n=function(t,A){this.type=1,this.target=A,this.path=t},ti=function(t){this.element=t,this.inlineLevel=[],this.nonInlineLevel=[],this.negativeZIndex=[],this.zeroOrAutoZIndexOrTransformedOrOpacity=[],this.positiveZIndex=[],this.nonPositionedFloats=[],this.nonPositionedInlineLevel=[]},Ai=function(){function t(t,A){if(this.container=t,this.effects=A.slice(0),this.curves=new Gn(t),null!==t.styles.transform){var e=t.bounds.left+t.styles.transformOrigin[0].number,r=t.bounds.top+t.styles.transformOrigin[1].number,n=t.styles.transform;this.effects.push(new Zn(e,r,n))}if(t.styles.overflowX!==be.VISIBLE){var i=Wn(this.curves),o=Yn(this.curves);zn(i,o)?this.effects.push(new $n(i,6)):(this.effects.push(new $n(i,2)),this.effects.push(new $n(o,4)))}}return t.prototype.getParentEffects=function(){var t=this.effects.slice(0);if(this.container.styles.overflowX!==be.VISIBLE){var A=Wn(this.curves),e=Yn(this.curves);zn(A,e)||t.push(new $n(e,6))}return t},t}(),ei=function(t,A,e,r){t.container.elements.forEach((function(n){var i=gr(n.flags,4),o=gr(n.flags,2),s=new Ai(n,t.getParentEffects());gr(n.styles.display,2048)&&r.push(s);var a=gr(n.flags,8)?[]:r;if(i||o){var c=i||n.styles.isPositioned()?e:A,u=new ti(s);if(n.styles.isPositioned()||n.styles.opacity<1||n.styles.isTransformed()){var l=n.styles.zIndex.order;if(l<0){var h=0;c.negativeZIndex.some((function(t,A){return l>t.element.container.styles.zIndex.order?(h=A,!1):h>0})),c.negativeZIndex.splice(h,0,u)}else if(l>0){var f=0;c.positiveZIndex.some((function(t,A){return l>t.element.container.styles.zIndex.order?(f=A+1,!1):f>0})),c.positiveZIndex.splice(f,0,u)}else c.zeroOrAutoZIndexOrTransformedOrOpacity.push(u)}else n.styles.isFloating()?c.nonPositionedFloats.push(u):c.nonPositionedInlineLevel.push(u);ei(s,u,i?u:e,a)}else n.styles.isInlineLevel()?A.inlineLevel.push(s):A.nonInlineLevel.push(s),ei(s,A,e,a);gr(n.flags,8)&&ri(n,a)}))},ri=function(t,A){for(var e=t instanceof kr?t.start:1,r=t instanceof kr&&t.reversed,n=0;n<A.length;n++){var i=A[n];i.container instanceof Dr&&"number"==typeof i.container.value&&0!==i.container.value&&(e=i.container.value),i.listValue=Ln(e,i.container.styles.listStyleType,!0),e+=r?-1:1}},ni=function(t,A,e,r){var n=[];return Xn(t)?n.push(t.subdivide(.5,!1)):n.push(t),Xn(e)?n.push(e.subdivide(.5,!0)):n.push(e),Xn(r)?n.push(r.subdivide(.5,!0).reverse()):n.push(r),Xn(A)?n.push(A.subdivide(.5,!1).reverse()):n.push(A),n},ii=function(t){var A=t.bounds,e=t.styles;return A.add(e.borderLeftWidth,e.borderTopWidth,-(e.borderRightWidth+e.borderLeftWidth),-(e.borderTopWidth+e.borderBottomWidth))},oi=function(t){var A=t.styles,e=t.bounds,r=Xt(A.paddingLeft,e.width),n=Xt(A.paddingRight,e.width),i=Xt(A.paddingTop,e.width),o=Xt(A.paddingBottom,e.width);return e.add(r+A.borderLeftWidth,i+A.borderTopWidth,-(A.borderRightWidth+A.borderLeftWidth+r+n),-(A.borderTopWidth+A.borderBottomWidth+i+o))},si=function(t,A,e){var r=function(t,A){return 0===t?A.bounds:2===t?oi(A):ii(A)}(li(t.styles.backgroundOrigin,A),t),n=function(t,A){return t===oA.BORDER_BOX?A.bounds:t===oA.CONTENT_BOX?oi(A):ii(A)}(li(t.styles.backgroundClip,A),t),i=ui(li(t.styles.backgroundSize,A),e,r),o=i[0],s=i[1],a=Vt(li(t.styles.backgroundPosition,A),r.width-o,r.height-s);return[hi(li(t.styles.backgroundRepeat,A),a,i,r,n),Math.round(r.left+a[0]),Math.round(r.top+a[1]),o,s]},ai=function(t){return It(t)&&t.value===zA.AUTO},ci=function(t){return"number"==typeof t},ui=function(t,A,e){var r=A[0],n=A[1],i=A[2],o=t[0],s=t[1];if(Dt(o)&&s&&Dt(s))return[Xt(o,e.width),Xt(s,e.height)];var a=ci(i);if(It(o)&&(o.value===zA.CONTAIN||o.value===zA.COVER))return ci(i)?e.width/e.height<i!=(o.value===zA.COVER)?[e.width,e.width/i]:[e.height*i,e.height]:[e.width,e.height];var c=ci(r),u=ci(n),l=c||u;if(ai(o)&&(!s||ai(s)))return c&&u?[r,n]:a||l?l&&a?[c?r:n*i,u?n:r/i]:[c?r:e.width,u?n:e.height]:[e.width,e.height];if(a){var h=0,f=0;return Dt(o)?h=Xt(o,e.width):Dt(s)&&(f=Xt(s,e.height)),ai(o)?h=f*i:s&&!ai(s)||(f=h/i),[h,f]}var d=null,p=null;if(Dt(o)?d=Xt(o,e.width):s&&Dt(s)&&(p=Xt(s,e.height)),null===d||s&&!ai(s)||(p=c&&u?d/r*n:e.height),null!==p&&ai(o)&&(d=c&&u?p/n*r:e.width),null!==d&&null!==p)return[d,p];throw new Error("Unable to calculate background-size for element")},li=function(t,A){var e=t[A];return void 0===e?t[0]:e},hi=function(t,A,e,r,n){var i=A[0],o=A[1],s=e[0],a=e[1];switch(t){case OA.REPEAT_X:return[new jn(Math.round(r.left),Math.round(r.top+o)),new jn(Math.round(r.left+r.width),Math.round(r.top+o)),new jn(Math.round(r.left+r.width),Math.round(a+r.top+o)),new jn(Math.round(r.left),Math.round(a+r.top+o))];case OA.REPEAT_Y:return[new jn(Math.round(r.left+i),Math.round(r.top)),new jn(Math.round(r.left+i+s),Math.round(r.top)),new jn(Math.round(r.left+i+s),Math.round(r.height+r.top)),new jn(Math.round(r.left+i),Math.round(r.height+r.top))];case OA.NO_REPEAT:return[new jn(Math.round(r.left+i),Math.round(r.top+o)),new jn(Math.round(r.left+i+s),Math.round(r.top+o)),new jn(Math.round(r.left+i+s),Math.round(r.top+o+a)),new jn(Math.round(r.left+i),Math.round(r.top+o+a))];default:return[new jn(Math.round(n.left),Math.round(n.top)),new jn(Math.round(n.left+n.width),Math.round(n.top)),new jn(Math.round(n.left+n.width),Math.round(n.height+n.top)),new jn(Math.round(n.left),Math.round(n.height+n.top))]}},fi=function(){function t(t){this._data={},this._document=t}return t.prototype.parseMetrics=function(t,A){var e=this._document.createElement("div"),r=this._document.createElement("img"),n=this._document.createElement("span"),i=this._document.body;e.style.visibility="hidden",e.style.fontFamily=t,e.style.fontSize=A,e.style.margin="0",e.style.padding="0",i.appendChild(e),r.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",r.width=1,r.height=1,r.style.margin="0",r.style.padding="0",r.style.verticalAlign="baseline",n.style.fontFamily=t,n.style.fontSize=A,n.style.margin="0",n.style.padding="0",n.appendChild(this._document.createTextNode("Hidden Text")),e.appendChild(n),e.appendChild(r);var o=r.offsetTop-n.offsetTop+2;e.removeChild(n),e.appendChild(this._document.createTextNode("Hidden Text")),e.style.lineHeight="normal",r.style.verticalAlign="super";var s=r.offsetTop-e.offsetTop+2;return i.removeChild(e),{baseline:o,middle:s}},t.prototype.getMetrics=function(t,A){var e=t+" "+A;return void 0===this._data[e]&&(this._data[e]=this.parseMetrics(t,A)),this._data[e]},t}(),di=function(){function t(t){this._activeEffects=[],this.canvas=t.canvas?t.canvas:document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.options=t,t.canvas||(this.canvas.width=Math.floor(t.width*t.scale),this.canvas.height=Math.floor(t.height*t.scale),this.canvas.style.width=t.width+"px",this.canvas.style.height=t.height+"px"),this.fontMetrics=new fi(document),this.ctx.scale(this.options.scale,this.options.scale),this.ctx.translate(-t.x+t.scrollX,-t.y+t.scrollY),this.ctx.textBaseline="bottom",this._activeEffects=[],UA.getInstance(t.id).debug("Canvas renderer initialized ("+t.width+"x"+t.height+" at "+t.x+","+t.y+") with scale "+t.scale)}return t.prototype.applyEffects=function(t,A){for(var e=this;this._activeEffects.length;)this.popEffect();t.filter((function(t){return gr(t.target,A)})).forEach((function(t){return e.applyEffect(t)}))},t.prototype.applyEffect=function(t){this.ctx.save(),function(t){return 0===t.type}(t)&&(this.ctx.translate(t.offsetX,t.offsetY),this.ctx.transform(t.matrix[0],t.matrix[1],t.matrix[2],t.matrix[3],t.matrix[4],t.matrix[5]),this.ctx.translate(-t.offsetX,-t.offsetY)),function(t){return 1===t.type}(t)&&(this.path(t.path),this.ctx.clip()),this._activeEffects.push(t)},t.prototype.popEffect=function(){this._activeEffects.pop(),this.ctx.restore()},t.prototype.renderStack=function(t){return r(this,void 0,void 0,(function(){var A;return n(this,(function(e){switch(e.label){case 0:return(A=t.element.container.styles).isVisible()?(this.ctx.globalAlpha=A.opacity,[4,this.renderStackContent(t)]):[3,2];case 1:e.sent(),e.label=2;case 2:return[2]}}))}))},t.prototype.renderNode=function(t){return r(this,void 0,void 0,(function(){return n(this,(function(A){switch(A.label){case 0:return t.container.styles.isVisible()?[4,this.renderNodeBackgroundAndBorders(t)]:[3,3];case 1:return A.sent(),[4,this.renderNodeContent(t)];case 2:A.sent(),A.label=3;case 3:return[2]}}))}))},t.prototype.renderTextWithLetterSpacing=function(t,A){var e=this;0===A?this.ctx.fillText(t.text,t.bounds.left,t.bounds.top+t.bounds.height):s(t.text).map((function(t){return a(t)})).reduce((function(A,r){return e.ctx.fillText(r,A,t.bounds.top+t.bounds.height),A+e.ctx.measureText(r).width}),t.bounds.left)},t.prototype.createFontStyle=function(t){var A=t.fontVariant.filter((function(t){return"normal"===t||"small-caps"===t})).join(""),e=t.fontFamily.join(", "),r=xt(t.fontSize)?""+t.fontSize.number+t.fontSize.unit:t.fontSize.number+"px";return[[t.fontStyle,A,t.fontWeight,r,e].join(" "),e,r]},t.prototype.renderTextNode=function(t,A){return r(this,void 0,void 0,(function(){var e,r,i,o,s=this;return n(this,(function(n){return e=this.createFontStyle(A),r=e[0],i=e[1],o=e[2],this.ctx.font=r,t.textBounds.forEach((function(t){s.ctx.fillStyle=tA(A.color),s.renderTextWithLetterSpacing(t,A.letterSpacing);var e=A.textShadow;e.length&&t.text.trim().length&&(e.slice(0).reverse().forEach((function(A){s.ctx.shadowColor=tA(A.color),s.ctx.shadowOffsetX=A.offsetX.number*s.options.scale,s.ctx.shadowOffsetY=A.offsetY.number*s.options.scale,s.ctx.shadowBlur=A.blur.number,s.ctx.fillText(t.text,t.bounds.left,t.bounds.top+t.bounds.height)})),s.ctx.shadowColor="",s.ctx.shadowOffsetX=0,s.ctx.shadowOffsetY=0,s.ctx.shadowBlur=0),A.textDecorationLine.length&&(s.ctx.fillStyle=tA(A.textDecorationColor||A.color),A.textDecorationLine.forEach((function(A){switch(A){case 1:var e=s.fontMetrics.getMetrics(i,o).baseline;s.ctx.fillRect(t.bounds.left,Math.round(t.bounds.top+e),t.bounds.width,1);break;case 2:s.ctx.fillRect(t.bounds.left,Math.round(t.bounds.top),t.bounds.width,1);break;case 3:var r=s.fontMetrics.getMetrics(i,o).middle;s.ctx.fillRect(t.bounds.left,Math.ceil(t.bounds.top+r),t.bounds.width,1)}})))})),[2]}))}))},t.prototype.renderReplacedElement=function(t,A,e){if(e&&t.intrinsicWidth>0&&t.intrinsicHeight>0){var r=oi(t),n=Yn(A);this.path(n),this.ctx.save(),this.ctx.clip(),this.ctx.drawImage(e,0,0,t.intrinsicWidth,t.intrinsicHeight,r.left,r.top,r.width,r.height),this.ctx.restore()}},t.prototype.renderNodeContent=function(A){return r(this,void 0,void 0,(function(){var e,r,o,s,a,c,u,l,f,d,p,B,g,w;return n(this,(function(n){switch(n.label){case 0:this.applyEffects(A.effects,4),e=A.container,r=A.curves,o=e.styles,s=0,a=e.textNodes,n.label=1;case 1:return s<a.length?(c=a[s],[4,this.renderTextNode(c,o)]):[3,4];case 2:n.sent(),n.label=3;case 3:return s++,[3,1];case 4:if(!(e instanceof Kr))return[3,8];n.label=5;case 5:return n.trys.push([5,7,,8]),[4,this.options.cache.match(e.src)];case 6:return B=n.sent(),this.renderReplacedElement(e,r,B),[3,8];case 7:return n.sent(),UA.getInstance(this.options.id).error("Error loading image "+e.src),[3,8];case 8:if(e instanceof Mr&&this.renderReplacedElement(e,r,e.canvas),!(e instanceof Pr))return[3,12];n.label=9;case 9:return n.trys.push([9,11,,12]),[4,this.options.cache.match(e.svg)];case 10:return B=n.sent(),this.renderReplacedElement(e,r,B),[3,12];case 11:return n.sent(),UA.getInstance(this.options.id).error("Error loading svg "+e.svg.substring(0,255)),[3,12];case 12:return e instanceof Wr&&e.tree?[4,new t({id:this.options.id,scale:this.options.scale,backgroundColor:e.backgroundColor,x:0,y:0,scrollX:0,scrollY:0,width:e.width,height:e.height,cache:this.options.cache,windowWidth:e.width,windowHeight:e.height}).render(e.tree)]:[3,14];case 13:u=n.sent(),e.width&&e.height&&this.ctx.drawImage(u,0,0,e.width,e.height,e.bounds.left,e.bounds.top,e.bounds.width,e.bounds.height),n.label=14;case 14:if(e instanceof Vr&&(l=Math.min(e.bounds.width,e.bounds.height),"checkbox"===e.type?e.checked&&(this.ctx.save(),this.path([new jn(e.bounds.left+.39363*l,e.bounds.top+.79*l),new jn(e.bounds.left+.16*l,e.bounds.top+.5549*l),new jn(e.bounds.left+.27347*l,e.bounds.top+.44071*l),new jn(e.bounds.left+.39694*l,e.bounds.top+.5649*l),new jn(e.bounds.left+.72983*l,e.bounds.top+.23*l),new jn(e.bounds.left+.84*l,e.bounds.top+.34085*l),new jn(e.bounds.left+.39363*l,e.bounds.top+.79*l)]),this.ctx.fillStyle=tA(707406591),this.ctx.fill(),this.ctx.restore()):"radio"===e.type&&e.checked&&(this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(e.bounds.left+l/2,e.bounds.top+l/2,l/4,0,2*Math.PI,!0),this.ctx.fillStyle=tA(707406591),this.ctx.fill(),this.ctx.restore())),pi(e)&&e.value.length){switch(this.ctx.font=this.createFontStyle(o)[0],this.ctx.fillStyle=tA(o.color),this.ctx.textBaseline="middle",this.ctx.textAlign=gi(e.styles.textAlign),w=oi(e),f=0,e.styles.textAlign){case Oe.CENTER:f+=w.width/2;break;case Oe.RIGHT:f+=w.width}d=w.add(f,0,0,-w.height/2+1),this.ctx.save(),this.path([new jn(w.left,w.top),new jn(w.left+w.width,w.top),new jn(w.left+w.width,w.top+w.height),new jn(w.left,w.top+w.height)]),this.ctx.clip(),this.renderTextWithLetterSpacing(new Lr(e.value,d),o.letterSpacing),this.ctx.restore(),this.ctx.textBaseline="bottom",this.ctx.textAlign="left"}if(!gr(e.styles.display,2048))return[3,20];if(null===e.styles.listStyleImage)return[3,19];if((p=e.styles.listStyleImage).type!==uA.URL)return[3,18];B=void 0,g=p.url,n.label=15;case 15:return n.trys.push([15,17,,18]),[4,this.options.cache.match(g)];case 16:return B=n.sent(),this.ctx.drawImage(B,e.bounds.left-(B.width+10),e.bounds.top),[3,18];case 17:return n.sent(),UA.getInstance(this.options.id).error("Error loading list-style-image "+g),[3,18];case 18:return[3,20];case 19:A.listValue&&e.styles.listStyleType!==Ne.NONE&&(this.ctx.font=this.createFontStyle(o)[0],this.ctx.fillStyle=tA(o.color),this.ctx.textBaseline="middle",this.ctx.textAlign="right",w=new i(e.bounds.left,e.bounds.top+Xt(e.styles.paddingTop,e.bounds.width),e.bounds.width,function(t,A){return It(t)&&"normal"===t.value?1.2*A:t.type===h.NUMBER_TOKEN?A*t.number:Dt(t)?Xt(t,A):A}(o.lineHeight,o.fontSize.number)/2+1),this.renderTextWithLetterSpacing(new Lr(A.listValue,w),o.letterSpacing),this.ctx.textBaseline="bottom",this.ctx.textAlign="left"),n.label=20;case 20:return[2]}}))}))},t.prototype.renderStackContent=function(t){return r(this,void 0,void 0,(function(){var A,e,r,i,o,s,a,c,u,l,h,f,d,p,B;return n(this,(function(n){switch(n.label){case 0:return[4,this.renderNodeBackgroundAndBorders(t.element)];case 1:n.sent(),A=0,e=t.negativeZIndex,n.label=2;case 2:return A<e.length?(B=e[A],[4,this.renderStack(B)]):[3,5];case 3:n.sent(),n.label=4;case 4:return A++,[3,2];case 5:return[4,this.renderNodeContent(t.element)];case 6:n.sent(),r=0,i=t.nonInlineLevel,n.label=7;case 7:return r<i.length?(B=i[r],[4,this.renderNode(B)]):[3,10];case 8:n.sent(),n.label=9;case 9:return r++,[3,7];case 10:o=0,s=t.nonPositionedFloats,n.label=11;case 11:return o<s.length?(B=s[o],[4,this.renderStack(B)]):[3,14];case 12:n.sent(),n.label=13;case 13:return o++,[3,11];case 14:a=0,c=t.nonPositionedInlineLevel,n.label=15;case 15:return a<c.length?(B=c[a],[4,this.renderStack(B)]):[3,18];case 16:n.sent(),n.label=17;case 17:return a++,[3,15];case 18:u=0,l=t.inlineLevel,n.label=19;case 19:return u<l.length?(B=l[u],[4,this.renderNode(B)]):[3,22];case 20:n.sent(),n.label=21;case 21:return u++,[3,19];case 22:h=0,f=t.zeroOrAutoZIndexOrTransformedOrOpacity,n.label=23;case 23:return h<f.length?(B=f[h],[4,this.renderStack(B)]):[3,26];case 24:n.sent(),n.label=25;case 25:return h++,[3,23];case 26:d=0,p=t.positiveZIndex,n.label=27;case 27:return d<p.length?(B=p[d],[4,this.renderStack(B)]):[3,30];case 28:n.sent(),n.label=29;case 29:return d++,[3,27];case 30:return[2]}}))}))},t.prototype.mask=function(t){this.ctx.beginPath(),this.ctx.moveTo(0,0),this.ctx.lineTo(this.canvas.width,0),this.ctx.lineTo(this.canvas.width,this.canvas.height),this.ctx.lineTo(0,this.canvas.height),this.ctx.lineTo(0,0),this.formatPath(t.slice(0).reverse()),this.ctx.closePath()},t.prototype.path=function(t){this.ctx.beginPath(),this.formatPath(t),this.ctx.closePath()},t.prototype.formatPath=function(t){var A=this;t.forEach((function(t,e){var r=Xn(t)?t.start:t;0===e?A.ctx.moveTo(r.x,r.y):A.ctx.lineTo(r.x,r.y),Xn(t)&&A.ctx.bezierCurveTo(t.startControl.x,t.startControl.y,t.endControl.x,t.endControl.y,t.end.x,t.end.y)}))},t.prototype.renderRepeat=function(t,A,e,r){this.path(t),this.ctx.fillStyle=A,this.ctx.translate(e,r),this.ctx.fill(),this.ctx.translate(-e,-r)},t.prototype.resizeImage=function(t,A,e){if(t.width===A&&t.height===e)return t;var r=this.canvas.ownerDocument.createElement("canvas");return r.width=A,r.height=e,r.getContext("2d").drawImage(t,0,0,t.width,t.height,0,0,A,e),r},t.prototype.renderBackgroundImage=function(t){return r(this,void 0,void 0,(function(){var A,e,r,i,o,s;return n(this,(function(a){switch(a.label){case 0:A=t.styles.backgroundImage.length-1,e=function(e){var i,o,s,a,c,u,l,h,f,d,p,B,g,w,m,Q,C,y,v,F,U,N,E,b,L,H,x,S,I,_,T;return n(this,(function(n){switch(n.label){case 0:if(e.type!==uA.URL)return[3,5];i=void 0,o=e.url,n.label=1;case 1:return n.trys.push([1,3,,4]),[4,r.options.cache.match(o)];case 2:return i=n.sent(),[3,4];case 3:return n.sent(),UA.getInstance(r.options.id).error("Error loading background-image "+o),[3,4];case 4:return i&&(s=si(t,A,[i.width,i.height,i.width/i.height]),Q=s[0],N=s[1],E=s[2],v=s[3],F=s[4],w=r.ctx.createPattern(r.resizeImage(i,v,F),"repeat"),r.renderRepeat(Q,w,N,E)),[3,6];case 5:e.type===uA.LINEAR_GRADIENT?(a=si(t,A,[null,null,null]),Q=a[0],N=a[1],E=a[2],v=a[3],F=a[4],c=gA(e.angle,v,F),u=c[0],l=c[1],h=c[2],f=c[3],d=c[4],(p=document.createElement("canvas")).width=v,p.height=F,B=p.getContext("2d"),g=B.createLinearGradient(l,f,h,d),BA(e.stops,u).forEach((function(t){return g.addColorStop(t.stop,tA(t.color))})),B.fillStyle=g,B.fillRect(0,0,v,F),v>0&&F>0&&(w=r.ctx.createPattern(p,"repeat"),r.renderRepeat(Q,w,N,E))):function(t){return t.type===uA.RADIAL_GRADIENT}(e)&&(m=si(t,A,[null,null,null]),Q=m[0],C=m[1],y=m[2],v=m[3],F=m[4],U=0===e.position.length?[jt]:e.position,N=Xt(U[0],v),E=Xt(U[U.length-1],F),b=function(t,A,e,r,n){var i=0,o=0;switch(t.size){case hA.CLOSEST_SIDE:t.shape===lA.CIRCLE?i=o=Math.min(Math.abs(A),Math.abs(A-r),Math.abs(e),Math.abs(e-n)):t.shape===lA.ELLIPSE&&(i=Math.min(Math.abs(A),Math.abs(A-r)),o=Math.min(Math.abs(e),Math.abs(e-n)));break;case hA.CLOSEST_CORNER:if(t.shape===lA.CIRCLE)i=o=Math.min(wA(A,e),wA(A,e-n),wA(A-r,e),wA(A-r,e-n));else if(t.shape===lA.ELLIPSE){var s=Math.min(Math.abs(e),Math.abs(e-n))/Math.min(Math.abs(A),Math.abs(A-r)),a=mA(r,n,A,e,!0),c=a[0],u=a[1];o=s*(i=wA(c-A,(u-e)/s))}break;case hA.FARTHEST_SIDE:t.shape===lA.CIRCLE?i=o=Math.max(Math.abs(A),Math.abs(A-r),Math.abs(e),Math.abs(e-n)):t.shape===lA.ELLIPSE&&(i=Math.max(Math.abs(A),Math.abs(A-r)),o=Math.max(Math.abs(e),Math.abs(e-n)));break;case hA.FARTHEST_CORNER:if(t.shape===lA.CIRCLE)i=o=Math.max(wA(A,e),wA(A,e-n),wA(A-r,e),wA(A-r,e-n));else if(t.shape===lA.ELLIPSE){s=Math.max(Math.abs(e),Math.abs(e-n))/Math.max(Math.abs(A),Math.abs(A-r));var l=mA(r,n,A,e,!1);c=l[0],u=l[1],o=s*(i=wA(c-A,(u-e)/s))}}return Array.isArray(t.size)&&(i=Xt(t.size[0],r),o=2===t.size.length?Xt(t.size[1],n):i),[i,o]}(e,N,E,v,F),L=b[0],H=b[1],L>0&&L>0&&(x=r.ctx.createRadialGradient(C+N,y+E,0,C+N,y+E,L),BA(e.stops,2*L).forEach((function(t){return x.addColorStop(t.stop,tA(t.color))})),r.path(Q),r.ctx.fillStyle=x,L!==H?(S=t.bounds.left+.5*t.bounds.width,I=t.bounds.top+.5*t.bounds.height,T=1/(_=H/L),r.ctx.save(),r.ctx.translate(S,I),r.ctx.transform(1,0,0,_,0,0),r.ctx.translate(-S,-I),r.ctx.fillRect(C,T*(y-I)+I,v,F*T),r.ctx.restore()):r.ctx.fill())),n.label=6;case 6:return A--,[2]}}))},r=this,i=0,o=t.styles.backgroundImage.slice(0).reverse(),a.label=1;case 1:return i<o.length?(s=o[i],[5,e(s)]):[3,4];case 2:a.sent(),a.label=3;case 3:return i++,[3,1];case 4:return[2]}}))}))},t.prototype.renderBorder=function(t,A,e){return r(this,void 0,void 0,(function(){return n(this,(function(r){return this.path(function(t,A){switch(A){case 0:return ni(t.topLeftBorderBox,t.topLeftPaddingBox,t.topRightBorderBox,t.topRightPaddingBox);case 1:return ni(t.topRightBorderBox,t.topRightPaddingBox,t.bottomRightBorderBox,t.bottomRightPaddingBox);case 2:return ni(t.bottomRightBorderBox,t.bottomRightPaddingBox,t.bottomLeftBorderBox,t.bottomLeftPaddingBox);case 3:default:return ni(t.bottomLeftBorderBox,t.bottomLeftPaddingBox,t.topLeftBorderBox,t.topLeftPaddingBox)}}(e,A)),this.ctx.fillStyle=tA(t),this.ctx.fill(),[2]}))}))},t.prototype.renderNodeBackgroundAndBorders=function(t){return r(this,void 0,void 0,(function(){var A,e,r,i,o,s,a,c,u=this;return n(this,(function(n){switch(n.label){case 0:return this.applyEffects(t.effects,2),A=t.container.styles,e=!$t(A.backgroundColor)||A.backgroundImage.length,r=[{style:A.borderTopStyle,color:A.borderTopColor},{style:A.borderRightStyle,color:A.borderRightColor},{style:A.borderBottomStyle,color:A.borderBottomColor},{style:A.borderLeftStyle,color:A.borderLeftColor}],i=Bi(li(A.backgroundClip,0),t.curves),e||A.boxShadow.length?(this.ctx.save(),this.path(i),this.ctx.clip(),$t(A.backgroundColor)||(this.ctx.fillStyle=tA(A.backgroundColor),this.ctx.fill()),[4,this.renderBackgroundImage(t.container)]):[3,2];case 1:n.sent(),this.ctx.restore(),A.boxShadow.slice(0).reverse().forEach((function(A){u.ctx.save();var e,r,n,i,o,s=Wn(t.curves),a=A.inset?0:1e4,c=(e=s,r=-a+(A.inset?1:-1)*A.spread.number,n=(A.inset?1:-1)*A.spread.number,i=A.spread.number*(A.inset?-2:2),o=A.spread.number*(A.inset?-2:2),e.map((function(t,A){switch(A){case 0:return t.add(r,n);case 1:return t.add(r+i,n);case 2:return t.add(r+i,n+o);case 3:return t.add(r,n+o)}return t})));A.inset?(u.path(s),u.ctx.clip(),u.mask(c)):(u.mask(s),u.ctx.clip(),u.path(c)),u.ctx.shadowOffsetX=A.offsetX.number+a,u.ctx.shadowOffsetY=A.offsetY.number,u.ctx.shadowColor=tA(A.color),u.ctx.shadowBlur=A.blur.number,u.ctx.fillStyle=A.inset?tA(A.color):"rgba(0,0,0,1)",u.ctx.fill(),u.ctx.restore()})),n.label=2;case 2:o=0,s=0,a=r,n.label=3;case 3:return s<a.length?(c=a[s]).style===VA.NONE||$t(c.color)?[3,5]:[4,this.renderBorder(c.color,o,t.curves)]:[3,7];case 4:n.sent(),n.label=5;case 5:o++,n.label=6;case 6:return s++,[3,3];case 7:return[2]}}))}))},t.prototype.render=function(t){return r(this,void 0,void 0,(function(){var A;return n(this,(function(e){switch(e.label){case 0:return this.options.backgroundColor&&(this.ctx.fillStyle=tA(this.options.backgroundColor),this.ctx.fillRect(this.options.x-this.options.scrollX,this.options.y-this.options.scrollY,this.options.width,this.options.height)),r=new Ai(t,[]),n=new ti(r),ei(r,n,n,i=[]),ri(r.container,i),A=n,[4,this.renderStack(A)];case 1:return e.sent(),this.applyEffects([],2),[2,this.canvas]}var r,n,i}))}))},t}(),pi=function(t){return t instanceof Gr||t instanceof Xr||t instanceof Vr&&"radio"!==t.type&&"checkbox"!==t.type},Bi=function(t,A){switch(t){case oA.BORDER_BOX:return Wn(A);case oA.CONTENT_BOX:return function(t){return[t.topLeftContentBox,t.topRightContentBox,t.bottomRightContentBox,t.bottomLeftContentBox]}(A);case oA.PADDING_BOX:default:return Yn(A)}},gi=function(t){switch(t){case Oe.CENTER:return"center";case Oe.RIGHT:return"right";case Oe.LEFT:default:return"left"}},wi=function(){function t(t){this.canvas=t.canvas?t.canvas:document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.options=t,this.canvas.width=Math.floor(t.width*t.scale),this.canvas.height=Math.floor(t.height*t.scale),this.canvas.style.width=t.width+"px",this.canvas.style.height=t.height+"px",this.ctx.scale(this.options.scale,this.options.scale),this.ctx.translate(-t.x+t.scrollX,-t.y+t.scrollY),UA.getInstance(t.id).debug("EXPERIMENTAL ForeignObject renderer initialized ("+t.width+"x"+t.height+" at "+t.x+","+t.y+") with scale "+t.scale)}return t.prototype.render=function(t){return r(this,void 0,void 0,(function(){var A,e;return n(this,(function(r){switch(r.label){case 0:return A=yA(Math.max(this.options.windowWidth,this.options.width)*this.options.scale,Math.max(this.options.windowHeight,this.options.height)*this.options.scale,this.options.scrollX*this.options.scale,this.options.scrollY*this.options.scale,t),[4,mi(A)];case 1:return e=r.sent(),this.options.backgroundColor&&(this.ctx.fillStyle=tA(this.options.backgroundColor),this.ctx.fillRect(0,0,this.options.width*this.options.scale,this.options.height*this.options.scale)),this.ctx.drawImage(e,-this.options.x*this.options.scale,-this.options.y*this.options.scale),[2,this.canvas]}}))}))},t}(),mi=function(t){return new Promise((function(A,e){var r=new Image;r.onload=function(){A(r)},r.onerror=e,r.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent((new XMLSerializer).serializeToString(t))}))},Qi=function(t){return Zt(Ht.create(t).parseComponentValue())};NA.setContext(window);var Ci=function(t,A){return r(void 0,void 0,void 0,(function(){var r,s,a,c,u,l,h,f,d,p,B,g,w,m,Q,C,y,v,F,U,N,E,b;return n(this,(function(n){switch(n.label){case 0:if(!(r=t.ownerDocument))throw new Error("Element is not attached to a Document");if(!(s=r.defaultView))throw new Error("Document is not attached to a Window");return a=(Math.round(1e3*Math.random())+Date.now()).toString(16),c=ln(t)||"HTML"===t.tagName?function(t){var A=t.body,e=t.documentElement;if(!A||!e)throw new Error("Unable to get document size");var r=Math.max(Math.max(A.scrollWidth,e.scrollWidth),Math.max(A.offsetWidth,e.offsetWidth),Math.max(A.clientWidth,e.clientWidth)),n=Math.max(Math.max(A.scrollHeight,e.scrollHeight),Math.max(A.offsetHeight,e.offsetHeight),Math.max(A.clientHeight,e.clientHeight));return new i(0,0,r,n)}(r):o(t),u=c.width,l=c.height,h=c.left,f=c.top,d=e({},{allowTaint:!1,imageTimeout:15e3,proxy:void 0,useCORS:!1},A),p={backgroundColor:"#ffffff",cache:A.cache?A.cache:NA.create(a,d),logging:!0,removeContainer:!0,foreignObjectRendering:!1,scale:s.devicePixelRatio||1,windowWidth:s.innerWidth,windowHeight:s.innerHeight,scrollX:s.pageXOffset,scrollY:s.pageYOffset,x:h,y:f,width:Math.ceil(u),height:Math.ceil(l),id:a},B=e({},p,d,A),g=new i(B.scrollX,B.scrollY,B.windowWidth,B.windowHeight),UA.create({id:a,enabled:B.logging}),UA.getInstance(a).debug("Starting document clone"),w=new Hn(t,{id:a,onclone:B.onclone,ignoreElements:B.ignoreElements,inlineImages:B.foreignObjectRendering,copyStyles:B.foreignObjectRendering}),(m=w.clonedReferenceElement)?[4,w.toIFrame(r,g)]:[2,Promise.reject("Unable to find element in cloned iframe")];case 1:return Q=n.sent(),C=r.documentElement?Qi(getComputedStyle(r.documentElement).backgroundColor):cA.TRANSPARENT,y=r.body?Qi(getComputedStyle(r.body).backgroundColor):cA.TRANSPARENT,v=A.backgroundColor,F="string"==typeof v?Qi(v):null===v?cA.TRANSPARENT:4294967295,U=t===r.documentElement?$t(C)?$t(y)?F:y:C:F,N={id:a,cache:B.cache,canvas:B.canvas,backgroundColor:U,scale:B.scale,x:B.x,y:B.y,scrollX:B.scrollX,scrollY:B.scrollY,width:B.width,height:B.height,windowWidth:B.windowWidth,windowHeight:B.windowHeight},B.foreignObjectRendering?(UA.getInstance(a).debug("Document cloned, using foreign object rendering"),[4,new wi(N).render(m)]):[3,3];case 2:return E=n.sent(),[3,5];case 3:return UA.getInstance(a).debug("Document cloned, using computed rendering"),NA.attachInstance(B.cache),UA.getInstance(a).debug("Starting DOM parsing"),b=tn(m),NA.detachInstance(),U===b.styles.backgroundColor&&(b.styles.backgroundColor=cA.TRANSPARENT),UA.getInstance(a).debug("Starting renderer"),[4,new di(N).render(b)];case 4:E=n.sent(),n.label=5;case 5:return!0===B.removeContainer&&(Hn.destroy(Q)||UA.getInstance(a).error("Cannot detach cloned iframe as it is not in the DOM anymore")),UA.getInstance(a).debug("Finished rendering"),UA.destroy(a),NA.destroy(a),[2,E]}}))}))};return function(t,A){return void 0===A&&(A={}),Ci(t,A)}}()},function(t,A){t.exports=__webpack_require__(/*! react-dom */ "react-dom")},function(t,A,e){"use strict";e.r(A),e.d(A,"exportComponentAsJPEG",(function(){return d})),e.d(A,"exportComponentAsPDF",(function(){return p})),e.d(A,"exportComponentAsPNG",(function(){return f}));var r=e(1),n=e.n(r),i=e(0),o=e.n(i),s=e(2),a=e.n(s);const c="image/png",u="image/jpeg",l="application/pdf",h=(t,A,e,r,i)=>{const s=a.a.findDOMNode(t.current);return n()(s,{backgroundColor:e,scrollY:-window.scrollY,useCORS:!0,...i}).then(t=>{if(r===l){const e=t.width>t.height?new o.a("l","mm",[t.width,t.height]):new o.a("p","mm",[t.height,t.width]);e.addImage(t.toDataURL(c,1),"PNG",0,0),e.save(A)}else((t,A)=>{const e=document.createElement("a");"string"==typeof e.download?(e.href=t,e.download=A,document.body.appendChild(e),e.click(),document.body.removeChild(e)):window.open(t)})(t.toDataURL(r,1),A)})},f=(t,A="component.png",e=null,r=c,n=null)=>h(t,A,e,r,n),d=(t,A="component.jpeg",e=null,r=u,n=null)=>h(t,A,e,r,n),p=(t,A="component.pdf",e=null,r=l,n=null)=>h(t,A,e,r,n)},function(t,A){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(t){"object"==typeof window&&(e=window)}t.exports=e}]);

/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/react-tooltip/dist/index.es.js":
/*!*****************************************************!*\
  !*** ./node_modules/react-tooltip/dist/index.es.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ReactTooltip)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ "./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/v4.js");




function ownKeys$2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$a =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var objectGetOwnPropertyDescriptor = {};

var fails$9 = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var fails$8 = fails$9;

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails$8(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var fails$7 = fails$9;

var functionBindNative = !fails$7(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

var NATIVE_BIND$2 = functionBindNative;

var call$4 = Function.prototype.call;

var functionCall = NATIVE_BIND$2 ? call$4.bind(call$4) : function () {
  return call$4.apply(call$4, arguments);
};

var objectPropertyIsEnumerable = {};

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$1(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var createPropertyDescriptor$2 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var NATIVE_BIND$1 = functionBindNative;

var FunctionPrototype$1 = Function.prototype;
var call$3 = FunctionPrototype$1.call;
var uncurryThisWithBind = NATIVE_BIND$1 && FunctionPrototype$1.bind.bind(call$3, call$3);

var functionUncurryThisRaw = function (fn) {
  return NATIVE_BIND$1 ? uncurryThisWithBind(fn) : function () {
    return call$3.apply(fn, arguments);
  };
};

var uncurryThisRaw$1 = functionUncurryThisRaw;

var toString$1 = uncurryThisRaw$1({}.toString);
var stringSlice = uncurryThisRaw$1(''.slice);

var classofRaw$2 = function (it) {
  return stringSlice(toString$1(it), 8, -1);
};

var classofRaw$1 = classofRaw$2;
var uncurryThisRaw = functionUncurryThisRaw;

var functionUncurryThis = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw$1(fn) === 'Function') return uncurryThisRaw(fn);
};

var uncurryThis$9 = functionUncurryThis;
var fails$6 = fails$9;
var classof$3 = classofRaw$2;

var $Object$3 = Object;
var split = uncurryThis$9(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails$6(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object$3('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof$3(it) == 'String' ? split(it, '') : $Object$3(it);
} : $Object$3;

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
var isNullOrUndefined$2 = function (it) {
  return it === null || it === undefined;
};

var isNullOrUndefined$1 = isNullOrUndefined$2;

var $TypeError$5 = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible$2 = function (it) {
  if (isNullOrUndefined$1(it)) throw $TypeError$5("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings
var IndexedObject$1 = indexedObject;
var requireObjectCoercible$1 = requireObjectCoercible$2;

var toIndexedObject$4 = function (it) {
  return IndexedObject$1(requireObjectCoercible$1(it));
};

var documentAll$2 = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;

var documentAll_1 = {
  all: documentAll$2,
  IS_HTMLDDA: IS_HTMLDDA
};

var $documentAll$1 = documentAll_1;

var documentAll$1 = $documentAll$1.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
var isCallable$c = $documentAll$1.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll$1;
} : function (argument) {
  return typeof argument == 'function';
};

var isCallable$b = isCallable$c;
var $documentAll = documentAll_1;

var documentAll = $documentAll.all;

var isObject$6 = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable$b(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable$b(it);
};

var global$9 = global$a;
var isCallable$a = isCallable$c;

var aFunction = function (argument) {
  return isCallable$a(argument) ? argument : undefined;
};

var getBuiltIn$5 = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global$9[namespace]) : global$9[namespace] && global$9[namespace][method];
};

var uncurryThis$8 = functionUncurryThis;

var objectIsPrototypeOf = uncurryThis$8({}.isPrototypeOf);

var getBuiltIn$4 = getBuiltIn$5;

var engineUserAgent = getBuiltIn$4('navigator', 'userAgent') || '';

var global$8 = global$a;
var userAgent = engineUserAgent;

var process = global$8.process;
var Deno = global$8.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

var engineV8Version = version;

/* eslint-disable es/no-symbol -- required for testing */

var V8_VERSION = engineV8Version;
var fails$5 = fails$9;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$5(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/* eslint-disable es/no-symbol -- required for testing */

var NATIVE_SYMBOL$1 = symbolConstructorDetection;

var useSymbolAsUid = NATIVE_SYMBOL$1
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var getBuiltIn$3 = getBuiltIn$5;
var isCallable$9 = isCallable$c;
var isPrototypeOf = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

var $Object$2 = Object;

var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn$3('Symbol');
  return isCallable$9($Symbol) && isPrototypeOf($Symbol.prototype, $Object$2(it));
};

var $String$1 = String;

var tryToString$1 = function (argument) {
  try {
    return $String$1(argument);
  } catch (error) {
    return 'Object';
  }
};

var isCallable$8 = isCallable$c;
var tryToString = tryToString$1;

var $TypeError$4 = TypeError;

// `Assert: IsCallable(argument) is true`
var aCallable$2 = function (argument) {
  if (isCallable$8(argument)) return argument;
  throw $TypeError$4(tryToString(argument) + ' is not a function');
};

var aCallable$1 = aCallable$2;
var isNullOrUndefined = isNullOrUndefined$2;

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
var getMethod$1 = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable$1(func);
};

var call$2 = functionCall;
var isCallable$7 = isCallable$c;
var isObject$5 = isObject$6;

var $TypeError$3 = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive$1 = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable$7(fn = input.toString) && !isObject$5(val = call$2(fn, input))) return val;
  if (isCallable$7(fn = input.valueOf) && !isObject$5(val = call$2(fn, input))) return val;
  if (pref !== 'string' && isCallable$7(fn = input.toString) && !isObject$5(val = call$2(fn, input))) return val;
  throw $TypeError$3("Can't convert object to primitive value");
};

var shared$3 = {exports: {}};

var global$7 = global$a;

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty$2 = Object.defineProperty;

var defineGlobalProperty$3 = function (key, value) {
  try {
    defineProperty$2(global$7, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global$7[key] = value;
  } return value;
};

var global$6 = global$a;
var defineGlobalProperty$2 = defineGlobalProperty$3;

var SHARED = '__core-js_shared__';
var store$3 = global$6[SHARED] || defineGlobalProperty$2(SHARED, {});

var sharedStore = store$3;

var store$2 = sharedStore;

(shared$3.exports = function (key, value) {
  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.25.5',
  mode: 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.25.5/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

var requireObjectCoercible = requireObjectCoercible$2;

var $Object$1 = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject$2 = function (argument) {
  return $Object$1(requireObjectCoercible(argument));
};

var uncurryThis$7 = functionUncurryThis;
var toObject$1 = toObject$2;

var hasOwnProperty = uncurryThis$7({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject$1(it), key);
};

var uncurryThis$6 = functionUncurryThis;

var id = 0;
var postfix = Math.random();
var toString = uncurryThis$6(1.0.toString);

var uid$2 = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

var global$5 = global$a;
var shared$2 = shared$3.exports;
var hasOwn$6 = hasOwnProperty_1;
var uid$1 = uid$2;
var NATIVE_SYMBOL = symbolConstructorDetection;
var USE_SYMBOL_AS_UID = useSymbolAsUid;

var WellKnownSymbolsStore = shared$2('wks');
var Symbol$1 = global$5.Symbol;
var symbolFor = Symbol$1 && Symbol$1['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

var wellKnownSymbol$5 = function (name) {
  if (!hasOwn$6(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn$6(Symbol$1, name)) {
      WellKnownSymbolsStore[name] = Symbol$1[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};

var call$1 = functionCall;
var isObject$4 = isObject$6;
var isSymbol$1 = isSymbol$2;
var getMethod = getMethod$1;
var ordinaryToPrimitive = ordinaryToPrimitive$1;
var wellKnownSymbol$4 = wellKnownSymbol$5;

var $TypeError$2 = TypeError;
var TO_PRIMITIVE = wellKnownSymbol$4('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive$1 = function (input, pref) {
  if (!isObject$4(input) || isSymbol$1(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call$1(exoticToPrim, input, pref);
    if (!isObject$4(result) || isSymbol$1(result)) return result;
    throw $TypeError$2("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

var toPrimitive = toPrimitive$1;
var isSymbol = isSymbol$2;

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey$2 = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

var global$4 = global$a;
var isObject$3 = isObject$6;

var document$1 = global$4.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject$3(document$1) && isObject$3(document$1.createElement);

var documentCreateElement$1 = function (it) {
  return EXISTS$1 ? document$1.createElement(it) : {};
};

var DESCRIPTORS$7 = descriptors;
var fails$4 = fails$9;
var createElement = documentCreateElement$1;

// Thanks to IE8 for its funny defineProperty
var ie8DomDefine = !DESCRIPTORS$7 && !fails$4(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var DESCRIPTORS$6 = descriptors;
var call = functionCall;
var propertyIsEnumerableModule = objectPropertyIsEnumerable;
var createPropertyDescriptor$1 = createPropertyDescriptor$2;
var toIndexedObject$3 = toIndexedObject$4;
var toPropertyKey$1 = toPropertyKey$2;
var hasOwn$5 = hasOwnProperty_1;
var IE8_DOM_DEFINE$1 = ie8DomDefine;

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
objectGetOwnPropertyDescriptor.f = DESCRIPTORS$6 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject$3(O);
  P = toPropertyKey$1(P);
  if (IE8_DOM_DEFINE$1) try {
    return $getOwnPropertyDescriptor$1(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn$5(O, P)) return createPropertyDescriptor$1(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

var objectDefineProperty = {};

var DESCRIPTORS$5 = descriptors;
var fails$3 = fails$9;

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
var v8PrototypeDefineBug = DESCRIPTORS$5 && fails$3(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

var isObject$2 = isObject$6;

var $String = String;
var $TypeError$1 = TypeError;

// `Assert: Type(argument) is Object`
var anObject$4 = function (argument) {
  if (isObject$2(argument)) return argument;
  throw $TypeError$1($String(argument) + ' is not an object');
};

var DESCRIPTORS$4 = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
var anObject$3 = anObject$4;
var toPropertyKey = toPropertyKey$2;

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE$1 = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
objectDefineProperty.f = DESCRIPTORS$4 ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
  anObject$3(O);
  P = toPropertyKey(P);
  anObject$3(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject$3(O);
  P = toPropertyKey(P);
  anObject$3(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var DESCRIPTORS$3 = descriptors;
var definePropertyModule$3 = objectDefineProperty;
var createPropertyDescriptor = createPropertyDescriptor$2;

var createNonEnumerableProperty$2 = DESCRIPTORS$3 ? function (object, key, value) {
  return definePropertyModule$3.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var makeBuiltIn$2 = {exports: {}};

var DESCRIPTORS$2 = descriptors;
var hasOwn$4 = hasOwnProperty_1;

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS$2 && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn$4(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS$2 || (DESCRIPTORS$2 && getDescriptor(FunctionPrototype, 'name').configurable));

var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var uncurryThis$5 = functionUncurryThis;
var isCallable$6 = isCallable$c;
var store$1 = sharedStore;

var functionToString = uncurryThis$5(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable$6(store$1.inspectSource)) {
  store$1.inspectSource = function (it) {
    return functionToString(it);
  };
}

var inspectSource$2 = store$1.inspectSource;

var global$3 = global$a;
var isCallable$5 = isCallable$c;

var WeakMap$1 = global$3.WeakMap;

var weakMapBasicDetection = isCallable$5(WeakMap$1) && /native code/.test(String(WeakMap$1));

var shared$1 = shared$3.exports;
var uid = uid$2;

var keys = shared$1('keys');

var sharedKey$2 = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys$4 = {};

var NATIVE_WEAK_MAP = weakMapBasicDetection;
var global$2 = global$a;
var isObject$1 = isObject$6;
var createNonEnumerableProperty$1 = createNonEnumerableProperty$2;
var hasOwn$3 = hasOwnProperty_1;
var shared = sharedStore;
var sharedKey$1 = sharedKey$2;
var hiddenKeys$3 = hiddenKeys$4;

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError$1 = global$2.TypeError;
var WeakMap = global$2.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject$1(it) || (state = get(it)).type !== TYPE) {
      throw TypeError$1('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey$1('state');
  hiddenKeys$3[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn$3(it, STATE)) throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty$1(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn$3(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn$3(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

var fails$2 = fails$9;
var isCallable$4 = isCallable$c;
var hasOwn$2 = hasOwnProperty_1;
var DESCRIPTORS$1 = descriptors;
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
var inspectSource$1 = inspectSource$2;
var InternalStateModule = internalState;

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty$1 = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS$1 && !fails$2(function () {
  return defineProperty$1(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn$1 = makeBuiltIn$2.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn$2(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS$1) defineProperty$1(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn$2(options, 'arity') && value.length !== options.arity) {
    defineProperty$1(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn$2(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS$1) defineProperty$1(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn$2(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn$1(function toString() {
  return isCallable$4(this) && getInternalState(this).source || inspectSource$1(this);
}, 'toString');

var isCallable$3 = isCallable$c;
var definePropertyModule$2 = objectDefineProperty;
var makeBuiltIn = makeBuiltIn$2.exports;
var defineGlobalProperty$1 = defineGlobalProperty$3;

var defineBuiltIn$1 = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable$3(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty$1(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule$2.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

var objectGetOwnPropertyNames = {};

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
var mathTrunc = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};

var trunc = mathTrunc;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
var toIntegerOrInfinity$2 = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex$1 = function (index, length) {
  var integer = toIntegerOrInfinity$1(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

var toIntegerOrInfinity = toIntegerOrInfinity$2;

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength$1 = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var toLength = toLength$1;

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
var lengthOfArrayLike$2 = function (obj) {
  return toLength(obj.length);
};

var toIndexedObject$2 = toIndexedObject$4;
var toAbsoluteIndex = toAbsoluteIndex$1;
var lengthOfArrayLike$1 = lengthOfArrayLike$2;

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$1 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject$2($this);
    var length = lengthOfArrayLike$1(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod$1(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$1(false)
};

var uncurryThis$4 = functionUncurryThis;
var hasOwn$1 = hasOwnProperty_1;
var toIndexedObject$1 = toIndexedObject$4;
var indexOf = arrayIncludes.indexOf;
var hiddenKeys$2 = hiddenKeys$4;

var push$1 = uncurryThis$4([].push);

var objectKeysInternal = function (object, names) {
  var O = toIndexedObject$1(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn$1(hiddenKeys$2, key) && hasOwn$1(O, key) && push$1(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn$1(O, key = names[i++])) {
    ~indexOf(result, key) || push$1(result, key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys$3 = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var internalObjectKeys$1 = objectKeysInternal;
var enumBugKeys$2 = enumBugKeys$3;

var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys$1(O, hiddenKeys$1);
};

var objectGetOwnPropertySymbols = {};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

var getBuiltIn$2 = getBuiltIn$5;
var uncurryThis$3 = functionUncurryThis;
var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
var anObject$2 = anObject$4;

var concat = uncurryThis$3([].concat);

// all object keys, includes non-enumerable and symbols
var ownKeys$1 = getBuiltIn$2('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject$2(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

var hasOwn = hasOwnProperty_1;
var ownKeys = ownKeys$1;
var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
var definePropertyModule$1 = objectDefineProperty;

var copyConstructorProperties$1 = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule$1.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

var fails$1 = fails$9;
var isCallable$2 = isCallable$c;

var replacement = /#|\.prototype\./;

var isForced$1 = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable$2(detection) ? fails$1(detection)
    : !!detection;
};

var normalize = isForced$1.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced$1.data = {};
var NATIVE = isForced$1.NATIVE = 'N';
var POLYFILL = isForced$1.POLYFILL = 'P';

var isForced_1 = isForced$1;

var global$1 = global$a;
var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var createNonEnumerableProperty = createNonEnumerableProperty$2;
var defineBuiltIn = defineBuiltIn$1;
var defineGlobalProperty = defineGlobalProperty$3;
var copyConstructorProperties = copyConstructorProperties$1;
var isForced = isForced_1;

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global$1;
  } else if (STATIC) {
    target = global$1[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global$1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

var uncurryThis$2 = functionUncurryThis;
var aCallable = aCallable$2;
var NATIVE_BIND = functionBindNative;

var bind$1 = uncurryThis$2(uncurryThis$2.bind);

// optional / simple context binding
var functionBindContext = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind$1(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var classof$2 = classofRaw$2;

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray$1 = Array.isArray || function isArray(argument) {
  return classof$2(argument) == 'Array';
};

var wellKnownSymbol$3 = wellKnownSymbol$5;

var TO_STRING_TAG$1 = wellKnownSymbol$3('toStringTag');
var test = {};

test[TO_STRING_TAG$1] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG_SUPPORT = toStringTagSupport;
var isCallable$1 = isCallable$c;
var classofRaw = classofRaw$2;
var wellKnownSymbol$2 = wellKnownSymbol$5;

var TO_STRING_TAG = wellKnownSymbol$2('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof$1 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable$1(O.callee) ? 'Arguments' : result;
};

var uncurryThis$1 = functionUncurryThis;
var fails = fails$9;
var isCallable = isCallable$c;
var classof = classof$1;
var getBuiltIn$1 = getBuiltIn$5;
var inspectSource = inspectSource$2;

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn$1('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis$1(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
var isConstructor$1 = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

var isArray = isArray$1;
var isConstructor = isConstructor$1;
var isObject = isObject$6;
var wellKnownSymbol$1 = wellKnownSymbol$5;

var SPECIES = wellKnownSymbol$1('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor$1 = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};

var arraySpeciesConstructor = arraySpeciesConstructor$1;

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate$1 = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var bind = functionBindContext;
var uncurryThis = functionUncurryThis;
var IndexedObject = indexedObject;
var toObject = toObject$2;
var lengthOfArrayLike = lengthOfArrayLike$2;
var arraySpeciesCreate = arraySpeciesCreate$1;

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};

var objectDefineProperties = {};

var internalObjectKeys = objectKeysInternal;
var enumBugKeys$1 = enumBugKeys$3;

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys$1 = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys$1);
};

var DESCRIPTORS = descriptors;
var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
var definePropertyModule = objectDefineProperty;
var anObject$1 = anObject$4;
var toIndexedObject = toIndexedObject$4;
var objectKeys = objectKeys$1;

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject$1(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

var getBuiltIn = getBuiltIn$5;

var html$1 = getBuiltIn('document', 'documentElement');

/* global ActiveXObject -- old IE, WSH */

var anObject = anObject$4;
var definePropertiesModule = objectDefineProperties;
var enumBugKeys = enumBugKeys$3;
var hiddenKeys = hiddenKeys$4;
var html = html$1;
var documentCreateElement = documentCreateElement$1;
var sharedKey = sharedKey$2;

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

var wellKnownSymbol = wellKnownSymbol$5;
var create = objectCreate;
var defineProperty = objectDefineProperty.f;

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables$1 = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var $ = _export;
var $find = arrayIteration.find;
var addToUnscopables = addToUnscopables$1;

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);

var CONSTANT = {
  GLOBAL: {
    HIDE: '__react_tooltip_hide_event',
    REBUILD: '__react_tooltip_rebuild_event',
    SHOW: '__react_tooltip_show_event'
  }
};

/**
 * Static methods for react-tooltip
 */
var dispatchGlobalEvent = function dispatchGlobalEvent(eventName, opts) {
  // Compatible with IE
  // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
  // @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
  var event;
  if (typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(eventName, {
      detail: opts
    });
  } else {
    event = document.createEvent('Event');
    event.initEvent(eventName, false, true, opts);
  }
  window.dispatchEvent(event);
};
function staticMethods (target) {
  /**
   * Hide all tooltip
   * @trigger ReactTooltip.hide()
   */
  target.hide = function (target) {
    dispatchGlobalEvent(CONSTANT.GLOBAL.HIDE, {
      target: target
    });
  };

  /**
   * Rebuild all tooltip
   * @trigger ReactTooltip.rebuild()
   */
  target.rebuild = function () {
    dispatchGlobalEvent(CONSTANT.GLOBAL.REBUILD);
  };

  /**
   * Show specific tooltip
   * @trigger ReactTooltip.show()
   */
  target.show = function (target) {
    dispatchGlobalEvent(CONSTANT.GLOBAL.SHOW, {
      target: target
    });
  };
  target.prototype.globalRebuild = function () {
    if (this.mount) {
      this.unbindListener();
      this.bindListener();
    }
  };
  target.prototype.globalShow = function (event) {
    if (this.mount) {
      var hasTarget = event && event.detail && event.detail.target && true || false;
      // Create a fake event, specific show will limit the type to `solid`
      // only `float` type cares e.clientX e.clientY
      this.showTooltip({
        currentTarget: hasTarget && event.detail.target
      }, true);
    }
  };
  target.prototype.globalHide = function (event) {
    if (this.mount) {
      var hasTarget = event && event.detail && event.detail.target && true || false;
      this.hideTooltip({
        currentTarget: hasTarget && event.detail.target
      }, hasTarget);
    }
  };
}

/**
 * Events that should be bound to the window
 */
function windowListener (target) {
  target.prototype.bindWindowEvents = function (resizeHide) {
    // ReactTooltip.hide
    window.removeEventListener(CONSTANT.GLOBAL.HIDE, this.globalHide);
    window.addEventListener(CONSTANT.GLOBAL.HIDE, this.globalHide, false);

    // ReactTooltip.rebuild
    window.removeEventListener(CONSTANT.GLOBAL.REBUILD, this.globalRebuild);
    window.addEventListener(CONSTANT.GLOBAL.REBUILD, this.globalRebuild, false);

    // ReactTooltip.show
    window.removeEventListener(CONSTANT.GLOBAL.SHOW, this.globalShow);
    window.addEventListener(CONSTANT.GLOBAL.SHOW, this.globalShow, false);

    // Resize
    if (resizeHide) {
      window.removeEventListener('resize', this.onWindowResize);
      window.addEventListener('resize', this.onWindowResize, false);
    }
  };
  target.prototype.unbindWindowEvents = function () {
    window.removeEventListener(CONSTANT.GLOBAL.HIDE, this.globalHide);
    window.removeEventListener(CONSTANT.GLOBAL.REBUILD, this.globalRebuild);
    window.removeEventListener(CONSTANT.GLOBAL.SHOW, this.globalShow);
    window.removeEventListener('resize', this.onWindowResize);
  };

  /**
   * invoked by resize event of window
   */
  target.prototype.onWindowResize = function () {
    if (!this.mount) return;
    this.hideTooltip();
  };
}

/**
 * Custom events to control showing and hiding of tooltip
 *
 * @attributes
 * - `event` {String}
 * - `eventOff` {String}
 */

var checkStatus = function checkStatus(dataEventOff, e) {
  var show = this.state.show;
  var id = this.props.id;
  var isCapture = this.isCapture(e.currentTarget);
  var currentItem = e.currentTarget.getAttribute('currentItem');
  if (!isCapture) e.stopPropagation();
  if (show && currentItem === 'true') {
    if (!dataEventOff) this.hideTooltip(e);
  } else {
    e.currentTarget.setAttribute('currentItem', 'true');
    setUntargetItems(e.currentTarget, this.getTargetArray(id));
    this.showTooltip(e);
  }
};
var setUntargetItems = function setUntargetItems(currentTarget, targetArray) {
  for (var i = 0; i < targetArray.length; i++) {
    if (currentTarget !== targetArray[i]) {
      targetArray[i].setAttribute('currentItem', 'false');
    } else {
      targetArray[i].setAttribute('currentItem', 'true');
    }
  }
};
var customListeners = {
  id: '9b69f92e-d3fe-498b-b1b4-c5e63a51b0cf',
  set: function set(target, event, listener) {
    if (this.id in target) {
      var map = target[this.id];
      map[event] = listener;
    } else {
      // this is workaround for WeakMap, which is not supported in older browsers, such as IE
      Object.defineProperty(target, this.id, {
        configurable: true,
        value: _defineProperty({}, event, listener)
      });
    }
  },
  get: function get(target, event) {
    var map = target[this.id];
    if (map !== undefined) {
      return map[event];
    }
  }
};
function customEvent (target) {
  target.prototype.isCustomEvent = function (ele) {
    var event = this.state.event;
    return event || !!ele.getAttribute('data-event');
  };

  /* Bind listener for custom event */
  target.prototype.customBindListener = function (ele) {
    var _this = this;
    var _this$state = this.state,
      event = _this$state.event,
      eventOff = _this$state.eventOff;
    var dataEvent = ele.getAttribute('data-event') || event;
    var dataEventOff = ele.getAttribute('data-event-off') || eventOff;
    dataEvent.split(' ').forEach(function (event) {
      ele.removeEventListener(event, customListeners.get(ele, event));
      var customListener = checkStatus.bind(_this, dataEventOff);
      customListeners.set(ele, event, customListener);
      ele.addEventListener(event, customListener, false);
    });
    if (dataEventOff) {
      dataEventOff.split(' ').forEach(function (event) {
        ele.removeEventListener(event, _this.hideTooltip);
        ele.addEventListener(event, _this.hideTooltip, false);
      });
    }
  };

  /* Unbind listener for custom event */
  target.prototype.customUnbindListener = function (ele) {
    var _this$state2 = this.state,
      event = _this$state2.event,
      eventOff = _this$state2.eventOff;
    var dataEvent = event || ele.getAttribute('data-event');
    var dataEventOff = eventOff || ele.getAttribute('data-event-off');
    ele.removeEventListener(dataEvent, customListeners.get(ele, event));
    if (dataEventOff) ele.removeEventListener(dataEventOff, this.hideTooltip);
  };
}

/**
 * Util method to judge if it should follow capture model
 */

function isCapture (target) {
  target.prototype.isCapture = function (currentTarget) {
    return currentTarget && currentTarget.getAttribute('data-iscapture') === 'true' || this.props.isCapture || false;
  };
}

/**
 * Util method to get effect
 */

function getEffect (target) {
  target.prototype.getEffect = function (currentTarget) {
    var dataEffect = currentTarget.getAttribute('data-effect');
    return dataEffect || this.props.effect || 'float';
  };
}

/**
 * Util method to get effect
 */
var makeProxy = function makeProxy(e) {
  var proxy = {};
  for (var key in e) {
    if (typeof e[key] === 'function') {
      proxy[key] = e[key].bind(e);
    } else {
      proxy[key] = e[key];
    }
  }
  return proxy;
};
var bodyListener = function bodyListener(callback, options, e) {
  var _options$respectEffec = options.respectEffect,
    respectEffect = _options$respectEffec === void 0 ? false : _options$respectEffec,
    _options$customEvent = options.customEvent,
    customEvent = _options$customEvent === void 0 ? false : _options$customEvent;
  var id = this.props.id;
  var tip = null;
  var forId;
  var target = e.target;
  var lastTarget;
  // walk up parent chain until tip is found
  // there is no match if parent visible area is matched by mouse position, so some corner cases might not work as expected
  while (tip === null && target !== null) {
    lastTarget = target;
    tip = target.getAttribute('data-tip') || null;
    forId = target.getAttribute('data-for') || null;
    target = target.parentElement;
  }
  target = lastTarget || e.target;
  if (this.isCustomEvent(target) && !customEvent) {
    return;
  }
  var isTargetBelongsToTooltip = id == null && forId == null || forId === id;
  if (tip != null && (!respectEffect || this.getEffect(target) === 'float') && isTargetBelongsToTooltip) {
    var proxy = makeProxy(e);
    proxy.currentTarget = target;
    callback(proxy);
  }
};
var findCustomEvents = function findCustomEvents(targetArray, dataAttribute) {
  var events = {};
  targetArray.forEach(function (target) {
    var event = target.getAttribute(dataAttribute);
    if (event) event.split(' ').forEach(function (event) {
      return events[event] = true;
    });
  });
  return events;
};
var getBody = function getBody() {
  return document.getElementsByTagName('body')[0];
};
function bodyMode (target) {
  target.prototype.isBodyMode = function () {
    return !!this.props.bodyMode;
  };
  target.prototype.bindBodyListener = function (targetArray) {
    var _this = this;
    var _this$state = this.state,
      event = _this$state.event,
      eventOff = _this$state.eventOff,
      possibleCustomEvents = _this$state.possibleCustomEvents,
      possibleCustomEventsOff = _this$state.possibleCustomEventsOff;
    var body = getBody();
    var customEvents = findCustomEvents(targetArray, 'data-event');
    var customEventsOff = findCustomEvents(targetArray, 'data-event-off');
    if (event != null) customEvents[event] = true;
    if (eventOff != null) customEventsOff[eventOff] = true;
    possibleCustomEvents.split(' ').forEach(function (event) {
      return customEvents[event] = true;
    });
    possibleCustomEventsOff.split(' ').forEach(function (event) {
      return customEventsOff[event] = true;
    });
    this.unbindBodyListener(body);
    var listeners = this.bodyModeListeners = {};
    if (event == null) {
      listeners.mouseover = bodyListener.bind(this, this.showTooltip, {});
      listeners.mousemove = bodyListener.bind(this, this.updateTooltip, {
        respectEffect: true
      });
      listeners.mouseout = bodyListener.bind(this, this.hideTooltip, {});
    }
    for (var _event in customEvents) {
      listeners[_event] = bodyListener.bind(this, function (e) {
        var targetEventOff = e.currentTarget.getAttribute('data-event-off') || eventOff;
        checkStatus.call(_this, targetEventOff, e);
      }, {
        customEvent: true
      });
    }
    for (var _event2 in customEventsOff) {
      listeners[_event2] = bodyListener.bind(this, this.hideTooltip, {
        customEvent: true
      });
    }
    for (var _event3 in listeners) {
      body.addEventListener(_event3, listeners[_event3]);
    }
  };
  target.prototype.unbindBodyListener = function (body) {
    body = body || getBody();
    var listeners = this.bodyModeListeners;
    for (var event in listeners) {
      body.removeEventListener(event, listeners[event]);
    }
  };
}

/**
 * Tracking target removing from DOM.
 * It's necessary to hide tooltip when it's target disappears.
 * Otherwise, the tooltip would be shown forever until another target
 * is triggered.
 *
 * If MutationObserver is not available, this feature just doesn't work.
 */

// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
var getMutationObserverClass = function getMutationObserverClass() {
  return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
};
function trackRemoval (target) {
  target.prototype.bindRemovalTracker = function () {
    var _this = this;
    var MutationObserver = getMutationObserverClass();
    if (MutationObserver == null) return;
    var observer = new MutationObserver(function (mutations) {
      for (var m1 = 0; m1 < mutations.length; m1++) {
        var mutation = mutations[m1];
        for (var m2 = 0; m2 < mutation.removedNodes.length; m2++) {
          var element = mutation.removedNodes[m2];
          if (element === _this.state.currentTarget) {
            _this.hideTooltip();
            return;
          }
        }
      }
    });
    observer.observe(window.document, {
      childList: true,
      subtree: true
    });
    this.removalTracker = observer;
  };
  target.prototype.unbindRemovalTracker = function () {
    if (this.removalTracker) {
      this.removalTracker.disconnect();
      this.removalTracker = null;
    }
  };
}

/**
 * Calculate the position of tooltip
 *
 * @params
 * - `e` {Event} the event of current mouse
 * - `target` {Element} the currentTarget of the event
 * - `node` {DOM} the react-tooltip object
 * - `place` {String} top / right / bottom / left
 * - `effect` {String} float / solid
 * - `offset` {Object} the offset to default position
 *
 * @return {Object}
 * - `isNewState` {Bool} required
 * - `newState` {Object}
 * - `position` {Object} {left: {Number}, top: {Number}}
 */
function getPosition (e, target, node, place, desiredPlace, effect, offset) {
  var _getDimensions = getDimensions(node),
    tipWidth = _getDimensions.width,
    tipHeight = _getDimensions.height;
  var _getDimensions2 = getDimensions(target),
    targetWidth = _getDimensions2.width,
    targetHeight = _getDimensions2.height;
  var _getCurrentOffset = getCurrentOffset(e, target, effect),
    mouseX = _getCurrentOffset.mouseX,
    mouseY = _getCurrentOffset.mouseY;
  var defaultOffset = getDefaultPosition(effect, targetWidth, targetHeight, tipWidth, tipHeight);
  var _calculateOffset = calculateOffset(offset),
    extraOffsetX = _calculateOffset.extraOffsetX,
    extraOffsetY = _calculateOffset.extraOffsetY;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var _getParent = getParent(node),
    parentTop = _getParent.parentTop,
    parentLeft = _getParent.parentLeft;

  // Get the edge offset of the tooltip
  var getTipOffsetLeft = function getTipOffsetLeft(place) {
    var offsetX = defaultOffset[place].l;
    return mouseX + offsetX + extraOffsetX;
  };
  var getTipOffsetRight = function getTipOffsetRight(place) {
    var offsetX = defaultOffset[place].r;
    return mouseX + offsetX + extraOffsetX;
  };
  var getTipOffsetTop = function getTipOffsetTop(place) {
    var offsetY = defaultOffset[place].t;
    return mouseY + offsetY + extraOffsetY;
  };
  var getTipOffsetBottom = function getTipOffsetBottom(place) {
    var offsetY = defaultOffset[place].b;
    return mouseY + offsetY + extraOffsetY;
  };

  //
  // Functions to test whether the tooltip's sides are inside
  // the client window for a given orientation p
  //
  //  _____________
  // |             | <-- Right side
  // | p = 'left'  |\
  // |             |/  |\
  // |_____________|   |_\  <-- Mouse
  //      / \           |
  //       |
  //       |
  //  Bottom side
  //
  var outsideLeft = function outsideLeft(p) {
    return getTipOffsetLeft(p) < 0;
  };
  var outsideRight = function outsideRight(p) {
    return getTipOffsetRight(p) > windowWidth;
  };
  var outsideTop = function outsideTop(p) {
    return getTipOffsetTop(p) < 0;
  };
  var outsideBottom = function outsideBottom(p) {
    return getTipOffsetBottom(p) > windowHeight;
  };

  // Check whether the tooltip with orientation p is completely inside the client window
  var outside = function outside(p) {
    return outsideLeft(p) || outsideRight(p) || outsideTop(p) || outsideBottom(p);
  };
  var inside = function inside(p) {
    return !outside(p);
  };
  var placeIsInside = {
    top: inside('top'),
    bottom: inside('bottom'),
    left: inside('left'),
    right: inside('right')
  };
  function choose() {
    var allPlaces = desiredPlace.split(',').concat(place, ['top', 'bottom', 'left', 'right']);
    var _iterator = _createForOfIteratorHelper(allPlaces),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var d = _step.value;
        if (placeIsInside[d]) return d;
      }
      // if nothing is inside, just use the old place.
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return place;
  }
  var chosen = choose();
  var isNewState = false;
  var newPlace;
  if (chosen && chosen !== place) {
    isNewState = true;
    newPlace = chosen;
  }
  if (isNewState) {
    return {
      isNewState: true,
      newState: {
        place: newPlace
      }
    };
  }
  return {
    isNewState: false,
    position: {
      left: parseInt(getTipOffsetLeft(place) - parentLeft, 10),
      top: parseInt(getTipOffsetTop(place) - parentTop, 10)
    }
  };
}
var getDimensions = function getDimensions(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(),
    height = _node$getBoundingClie.height,
    width = _node$getBoundingClie.width;
  return {
    height: parseInt(height, 10),
    width: parseInt(width, 10)
  };
};

// Get current mouse offset
var getCurrentOffset = function getCurrentOffset(e, currentTarget, effect) {
  var boundingClientRect = currentTarget.getBoundingClientRect();
  var targetTop = boundingClientRect.top;
  var targetLeft = boundingClientRect.left;
  var _getDimensions3 = getDimensions(currentTarget),
    targetWidth = _getDimensions3.width,
    targetHeight = _getDimensions3.height;
  if (effect === 'float') {
    return {
      mouseX: e.clientX,
      mouseY: e.clientY
    };
  }
  return {
    mouseX: targetLeft + targetWidth / 2,
    mouseY: targetTop + targetHeight / 2
  };
};

// List all possibility of tooltip final offset
// This is useful in judging if it is necessary for tooltip to switch position when out of window
var getDefaultPosition = function getDefaultPosition(effect, targetWidth, targetHeight, tipWidth, tipHeight) {
  var top;
  var right;
  var bottom;
  var left;
  var disToMouse = 3;
  var triangleHeight = 2;
  var cursorHeight = 12; // Optimize for float bottom only, cause the cursor will hide the tooltip

  if (effect === 'float') {
    top = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: -(tipHeight + disToMouse + triangleHeight),
      b: -disToMouse
    };
    bottom = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: disToMouse + cursorHeight,
      b: tipHeight + disToMouse + triangleHeight + cursorHeight
    };
    left = {
      l: -(tipWidth + disToMouse + triangleHeight),
      r: -disToMouse,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
    right = {
      l: disToMouse,
      r: tipWidth + disToMouse + triangleHeight,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
  } else if (effect === 'solid') {
    top = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: -(targetHeight / 2 + tipHeight + triangleHeight),
      b: -(targetHeight / 2)
    };
    bottom = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: targetHeight / 2,
      b: targetHeight / 2 + tipHeight + triangleHeight
    };
    left = {
      l: -(tipWidth + targetWidth / 2 + triangleHeight),
      r: -(targetWidth / 2),
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
    right = {
      l: targetWidth / 2,
      r: tipWidth + targetWidth / 2 + triangleHeight,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
  }
  return {
    top: top,
    bottom: bottom,
    left: left,
    right: right
  };
};

// Consider additional offset into position calculation
var calculateOffset = function calculateOffset(offset) {
  var extraOffsetX = 0;
  var extraOffsetY = 0;
  if (Object.prototype.toString.apply(offset) === '[object String]') {
    offset = JSON.parse(offset.toString().replace(/'/g, '"'));
  }
  for (var key in offset) {
    if (key === 'top') {
      extraOffsetY -= parseInt(offset[key], 10);
    } else if (key === 'bottom') {
      extraOffsetY += parseInt(offset[key], 10);
    } else if (key === 'left') {
      extraOffsetX -= parseInt(offset[key], 10);
    } else if (key === 'right') {
      extraOffsetX += parseInt(offset[key], 10);
    }
  }
  return {
    extraOffsetX: extraOffsetX,
    extraOffsetY: extraOffsetY
  };
};

// Get the offset of the parent elements
var getParent = function getParent(currentTarget) {
  var currentParent = currentTarget;
  while (currentParent) {
    var computedStyle = window.getComputedStyle(currentParent);
    // transform and will-change: transform change the containing block
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_Block
    if (computedStyle.getPropertyValue('transform') !== 'none' || computedStyle.getPropertyValue('will-change') === 'transform') break;
    currentParent = currentParent.parentElement;
  }
  var parentTop = currentParent && currentParent.getBoundingClientRect().top || 0;
  var parentLeft = currentParent && currentParent.getBoundingClientRect().left || 0;
  return {
    parentTop: parentTop,
    parentLeft: parentLeft
  };
};

/**
 * To get the tooltip content
 * it may comes from data-tip or this.props.children
 * it should support multiline
 *
 * @params
 * - `tip` {String} value of data-tip
 * - `children` {ReactElement} this.props.children
 * - `multiline` {Any} could be Bool(true/false) or String('true'/'false')
 *
 * @return
 * - String or react component
 */
function TipContent(tip, children, getContent, multiline) {
  if (children) return children;
  if (getContent !== undefined && getContent !== null) return getContent; // getContent can be 0, '', etc.
  if (getContent === null) return null; // Tip not exist and children is null or undefined

  var regexp = /<br\s*\/?>/;
  if (!multiline || multiline === 'false' || !regexp.test(tip)) {
    // No trim(), so that user can keep their input
    return tip;
  }

  // Multiline tooltip content
  return tip.split(regexp).map(function (d, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      key: i,
      className: "multi-line"
    }, d);
  });
}

/**
 * Support aria- and role in ReactTooltip
 *
 * @params props {Object}
 * @return {Object}
 */
function parseAria(props) {
  var ariaObj = {};
  Object.keys(props).filter(function (prop) {
    // aria-xxx and role is acceptable
    return /(^aria-\w+$|^role$)/.test(prop);
  }).forEach(function (prop) {
    ariaObj[prop] = props[prop];
  });
  return ariaObj;
}

/**
 * Convert nodelist to array
 * @see https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/core/createArrayFromMixed.js#L24
 * NodeLists are functions in Safari
 */

function nodeListToArray (nodeList) {
  var length = nodeList.length;
  if (nodeList.hasOwnProperty) {
    return Array.prototype.slice.call(nodeList);
  }
  return new Array(length).fill().map(function (index) {
    return nodeList[index];
  });
}

function generateUUID() {
  return 't' + (0,uuid__WEBPACK_IMPORTED_MODULE_1__["default"])();
}

var baseCss = ".__react_component_tooltip {\n  border-radius: 3px;\n  display: inline-block;\n  font-size: 13px;\n  left: -999em;\n  opacity: 0;\n  position: fixed;\n  pointer-events: none;\n  transition: opacity 0.3s ease-out;\n  top: -999em;\n  visibility: hidden;\n  z-index: 999;\n}\n.__react_component_tooltip.allow_hover, .__react_component_tooltip.allow_click {\n  pointer-events: auto;\n}\n.__react_component_tooltip::before, .__react_component_tooltip::after {\n  content: \"\";\n  width: 0;\n  height: 0;\n  position: absolute;\n}\n.__react_component_tooltip.show {\n  opacity: 0.9;\n  margin-top: 0;\n  margin-left: 0;\n  visibility: visible;\n}\n.__react_component_tooltip.place-top::before {\n  bottom: 0;\n  left: 50%;\n  margin-left: -11px;\n}\n.__react_component_tooltip.place-bottom::before {\n  top: 0;\n  left: 50%;\n  margin-left: -11px;\n}\n.__react_component_tooltip.place-left::before {\n  right: 0;\n  top: 50%;\n  margin-top: -9px;\n}\n.__react_component_tooltip.place-right::before {\n  left: 0;\n  top: 50%;\n  margin-top: -9px;\n}\n.__react_component_tooltip .multi-line {\n  display: block;\n  padding: 2px 0;\n  text-align: center;\n}";

/**
 * Default pop-up style values (text color, background color).
 */
var defaultColors = {
  dark: {
    text: '#fff',
    background: '#222',
    border: 'transparent',
    arrow: '#222'
  },
  success: {
    text: '#fff',
    background: '#8DC572',
    border: 'transparent',
    arrow: '#8DC572'
  },
  warning: {
    text: '#fff',
    background: '#F0AD4E',
    border: 'transparent',
    arrow: '#F0AD4E'
  },
  error: {
    text: '#fff',
    background: '#BE6464',
    border: 'transparent',
    arrow: '#BE6464'
  },
  info: {
    text: '#fff',
    background: '#337AB7',
    border: 'transparent',
    arrow: '#337AB7'
  },
  light: {
    text: '#222',
    background: '#fff',
    border: 'transparent',
    arrow: '#fff'
  }
};
function getDefaultPopupColors(type) {
  return defaultColors[type] ? _objectSpread2({}, defaultColors[type]) : undefined;
}
var DEFAULT_PADDING = '8px 21px';
var DEFAULT_RADIUS = {
  tooltip: 3,
  arrow: 0
};

/**
 * Generates the specific tooltip style for use on render.
 */
function generateTooltipStyle(uuid, customColors, type, hasBorder, padding, radius) {
  return generateStyle(uuid, getPopupColors(customColors, type, hasBorder), padding, radius);
}

/**
 * Generates the tooltip style rules based on the element-specified "data-type" property.
 */
function generateStyle(uuid, colors) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_PADDING;
  var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_RADIUS;
  var textColor = colors.text;
  var backgroundColor = colors.background;
  var borderColor = colors.border;
  var arrowColor = colors.arrow;
  var arrowRadius = radius.arrow;
  var tooltipRadius = radius.tooltip;
  return "\n  \t.".concat(uuid, " {\n\t    color: ").concat(textColor, ";\n\t    background: ").concat(backgroundColor, ";\n\t    border: 1px solid ").concat(borderColor, ";\n\t    border-radius: ").concat(tooltipRadius, "px;\n\t    padding: ").concat(padding, ";\n  \t}\n\n  \t.").concat(uuid, ".place-top {\n        margin-top: -10px;\n    }\n    .").concat(uuid, ".place-top::before {\n        content: \"\";\n        background-color: inherit;\n        position: absolute;\n        z-index: 2;\n        width: 20px;\n        height: 12px;\n    }\n    .").concat(uuid, ".place-top::after {\n        content: \"\";\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        border-top-right-radius: ").concat(arrowRadius, "px;\n        border: 1px solid ").concat(borderColor, ";\n        background-color: ").concat(arrowColor, ";\n        z-index: -2;\n        bottom: -6px;\n        left: 50%;\n        margin-left: -6px;\n        transform: rotate(135deg);\n    }\n\n    .").concat(uuid, ".place-bottom {\n        margin-top: 10px;\n    }\n    .").concat(uuid, ".place-bottom::before {\n        content: \"\";\n        background-color: inherit;\n        position: absolute;\n        z-index: -1;\n        width: 18px;\n        height: 10px;\n    }\n    .").concat(uuid, ".place-bottom::after {\n        content: \"\";\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        border-top-right-radius: ").concat(arrowRadius, "px;\n        border: 1px solid ").concat(borderColor, ";\n        background-color: ").concat(arrowColor, ";\n        z-index: -2;\n        top: -6px;\n        left: 50%;\n        margin-left: -6px;\n        transform: rotate(45deg);\n    }\n\n    .").concat(uuid, ".place-left {\n        margin-left: -10px;\n    }\n    .").concat(uuid, ".place-left::before {\n        content: \"\";\n        background-color: inherit;\n        position: absolute;\n        z-index: -1;\n        width: 10px;\n        height: 18px;\n    }\n    .").concat(uuid, ".place-left::after {\n        content: \"\";\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        border-top-right-radius: ").concat(arrowRadius, "px;\n        border: 1px solid ").concat(borderColor, ";\n        background-color: ").concat(arrowColor, ";\n        z-index: -2;\n        right: -6px;\n        top: 50%;\n        margin-top: -6px;\n        transform: rotate(45deg);\n    }\n\n    .").concat(uuid, ".place-right {\n        margin-left: 10px;\n    }\n    .").concat(uuid, ".place-right::before {\n        content: \"\";\n        background-color: inherit;\n        position: absolute;\n        z-index: -1;\n        width: 10px;\n        height: 18px;\n    }\n    .").concat(uuid, ".place-right::after {\n        content: \"\";\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        border-top-right-radius: ").concat(arrowRadius, "px;\n        border: 1px solid ").concat(borderColor, ";\n        background-color: ").concat(arrowColor, ";\n        z-index: -2;\n        left: -6px;\n        top: 50%;\n        margin-top: -6px;\n        transform: rotate(-135deg);\n    }\n  ");
}
function getPopupColors(customColors, type, hasBorder) {
  var textColor = customColors.text;
  var backgroundColor = customColors.background;
  var borderColor = customColors.border;
  var arrowColor = customColors.arrow ? customColors.arrow : customColors.background;
  var colors = getDefaultPopupColors(type);
  if (textColor) {
    colors.text = textColor;
  }
  if (backgroundColor) {
    colors.background = backgroundColor;
  }
  if (hasBorder) {
    if (borderColor) {
      colors.border = borderColor;
    } else {
      colors.border = type === 'light' ? 'black' : 'white';
    }
  }
  if (arrowColor) {
    colors.arrow = arrowColor;
  }
  return colors;
}

var _class, _class2;

/* Polyfill */
var ReactTooltip = staticMethods(_class = windowListener(_class = customEvent(_class = isCapture(_class = getEffect(_class = bodyMode(_class = trackRemoval(_class = (_class2 = /*#__PURE__*/function (_React$Component) {
  _inherits(ReactTooltip, _React$Component);
  var _super = _createSuper(ReactTooltip);
  function ReactTooltip(props) {
    var _this;
    _classCallCheck(this, ReactTooltip);
    _this = _super.call(this, props);
    _this.state = {
      uuid: props.uuid || generateUUID(),
      place: props.place || 'top',
      // Direction of tooltip
      desiredPlace: props.place || 'top',
      type: props.type || 'dark',
      // Color theme of tooltip
      effect: props.effect || 'float',
      // float or fixed
      show: false,
      border: false,
      borderClass: 'border',
      customColors: {},
      customRadius: {},
      offset: {},
      padding: props.padding,
      extraClass: '',
      html: false,
      delayHide: 0,
      delayShow: 0,
      event: props.event || null,
      eventOff: props.eventOff || null,
      currentEvent: null,
      // Current mouse event
      currentTarget: null,
      // Current target of mouse event
      ariaProps: parseAria(props),
      // aria- and role attributes
      isEmptyTip: false,
      disable: false,
      possibleCustomEvents: props.possibleCustomEvents || '',
      possibleCustomEventsOff: props.possibleCustomEventsOff || '',
      originTooltip: null,
      isMultiline: false
    };
    _this.bind(['showTooltip', 'updateTooltip', 'hideTooltip', 'hideTooltipOnScroll', 'getTooltipContent', 'globalRebuild', 'globalShow', 'globalHide', 'onWindowResize', 'mouseOnToolTip']);
    _this.mount = true;
    _this.delayShowLoop = null;
    _this.delayHideLoop = null;
    _this.delayReshow = null;
    _this.intervalUpdateContent = null;
    return _this;
  }

  /**
   * For unify the bind and unbind listener
   */
  _createClass(ReactTooltip, [{
    key: "bind",
    value: function bind(methodArray) {
      var _this2 = this;
      methodArray.forEach(function (method) {
        _this2[method] = _this2[method].bind(_this2);
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props;
        _this$props.insecure;
        var resizeHide = _this$props.resizeHide,
        disableInternalStyle = _this$props.disableInternalStyle;
      this.mount = true;
      this.bindListener(); // Bind listener for tooltip
      this.bindWindowEvents(resizeHide); // Bind global event for static method

      if (!disableInternalStyle) {
        this.injectStyles(); // Inject styles for each DOM root having tooltip.
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mount = false;
      this.clearTimer();
      this.unbindListener();
      this.removeScrollListener(this.state.currentTarget);
      this.unbindWindowEvents();
    }

    /* Look for the closest DOM root having tooltip and inject styles. */
  }, {
    key: "injectStyles",
    value: function injectStyles() {
      var tooltipRef = this.tooltipRef;
      if (!tooltipRef) {
        return;
      }
      var parentNode = tooltipRef.parentNode;
      while (parentNode.parentNode) {
        parentNode = parentNode.parentNode;
      }
      var domRoot;
      switch (parentNode.constructor.name) {
        case 'Document':
        case 'HTMLDocument':
        case undefined:
          domRoot = parentNode.head;
          break;
        case 'ShadowRoot':
        default:
          domRoot = parentNode;
          break;
      }

      // Prevent styles duplication.
      if (!domRoot.querySelector('style[data-react-tooltip]')) {
        var style = document.createElement('style');
        style.textContent = baseCss;
        style.setAttribute('data-react-tooltip', 'true');
        domRoot.appendChild(style);
      }
    }

    /**
     * Return if the mouse is on the tooltip.
     * @returns {boolean} true - mouse is on the tooltip
     */
  }, {
    key: "mouseOnToolTip",
    value: function mouseOnToolTip() {
      var show = this.state.show;
      if (show && this.tooltipRef) {
        /* old IE or Firefox work around */
        if (!this.tooltipRef.matches) {
          /* old IE work around */
          if (this.tooltipRef.msMatchesSelector) {
            this.tooltipRef.matches = this.tooltipRef.msMatchesSelector;
          } else {
            /* old Firefox work around */
            this.tooltipRef.matches = this.tooltipRef.mozMatchesSelector;
          }
        }
        return this.tooltipRef.matches(':hover');
      }
      return false;
    }

    /**
     * Pick out corresponded target elements
     */
  }, {
    key: "getTargetArray",
    value: function getTargetArray(id) {
      var targetArray = [];
      var selector;
      if (!id) {
        selector = '[data-tip]:not([data-for])';
      } else {
        var escaped = id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        selector = "[data-tip][data-for=\"".concat(escaped, "\"]");
      }

      // Scan document for shadow DOM elements
      nodeListToArray(document.getElementsByTagName('*')).filter(function (element) {
        return element.shadowRoot;
      }).forEach(function (element) {
        targetArray = targetArray.concat(nodeListToArray(element.shadowRoot.querySelectorAll(selector)));
      });
      return targetArray.concat(nodeListToArray(document.querySelectorAll(selector)));
    }

    /**
     * Bind listener to the target elements
     * These listeners used to trigger showing or hiding the tooltip
     */
  }, {
    key: "bindListener",
    value: function bindListener() {
      var _this3 = this;
      var _this$props2 = this.props,
        id = _this$props2.id,
        globalEventOff = _this$props2.globalEventOff,
        isCapture = _this$props2.isCapture;
      var targetArray = this.getTargetArray(id);
      targetArray.forEach(function (target) {
        if (target.getAttribute('currentItem') === null) {
          target.setAttribute('currentItem', 'false');
        }
        _this3.unbindBasicListener(target);
        if (_this3.isCustomEvent(target)) {
          _this3.customUnbindListener(target);
        }
      });
      if (this.isBodyMode()) {
        this.bindBodyListener(targetArray);
      } else {
        targetArray.forEach(function (target) {
          var isCaptureMode = _this3.isCapture(target);
          var effect = _this3.getEffect(target);
          if (_this3.isCustomEvent(target)) {
            _this3.customBindListener(target);
            return;
          }
          target.addEventListener('mouseenter', _this3.showTooltip, isCaptureMode);
          target.addEventListener('focus', _this3.showTooltip, isCaptureMode);
          if (effect === 'float') {
            target.addEventListener('mousemove', _this3.updateTooltip, isCaptureMode);
          }
          target.addEventListener('mouseleave', _this3.hideTooltip, isCaptureMode);
          target.addEventListener('blur', _this3.hideTooltip, isCaptureMode);
        });
      }

      // Global event to hide tooltip
      if (globalEventOff) {
        window.removeEventListener(globalEventOff, this.hideTooltip);
        window.addEventListener(globalEventOff, this.hideTooltip, isCapture);
      }

      // Track removal of targetArray elements from DOM
      this.bindRemovalTracker();
    }

    /**
     * Unbind listeners on target elements
     */
  }, {
    key: "unbindListener",
    value: function unbindListener() {
      var _this4 = this;
      var _this$props3 = this.props,
        id = _this$props3.id,
        globalEventOff = _this$props3.globalEventOff;
      if (this.isBodyMode()) {
        this.unbindBodyListener();
      } else {
        var targetArray = this.getTargetArray(id);
        targetArray.forEach(function (target) {
          _this4.unbindBasicListener(target);
          if (_this4.isCustomEvent(target)) _this4.customUnbindListener(target);
        });
      }
      if (globalEventOff) window.removeEventListener(globalEventOff, this.hideTooltip);
      this.unbindRemovalTracker();
    }

    /**
     * Invoke this before bind listener and unmount the component
     * it is necessary to invoke this even when binding custom event
     * so that the tooltip can switch between custom and default listener
     */
  }, {
    key: "unbindBasicListener",
    value: function unbindBasicListener(target) {
      var isCaptureMode = this.isCapture(target);
      target.removeEventListener('mouseenter', this.showTooltip, isCaptureMode);
      target.removeEventListener('mousemove', this.updateTooltip, isCaptureMode);
      target.removeEventListener('mouseleave', this.hideTooltip, isCaptureMode);
    }
  }, {
    key: "getTooltipContent",
    value: function getTooltipContent() {
      var _this$props4 = this.props,
        getContent = _this$props4.getContent,
        children = _this$props4.children;

      // Generate tooltip content
      var content;
      if (getContent) {
        if (Array.isArray(getContent)) {
          content = getContent[0] && getContent[0](this.state.originTooltip);
        } else {
          content = getContent(this.state.originTooltip);
        }
      }
      return TipContent(this.state.originTooltip, children, content, this.state.isMultiline);
    }
  }, {
    key: "isEmptyTip",
    value: function isEmptyTip(placeholder) {
      return typeof placeholder === 'string' && placeholder === '' || placeholder === null;
    }

    /**
     * When mouse enter, show the tooltip
     */
  }, {
    key: "showTooltip",
    value: function showTooltip(e, isGlobalCall) {
      if (!this.tooltipRef) {
        return;
      }
      if (isGlobalCall) {
        // Don't trigger other elements belongs to other ReactTooltip
        var targetArray = this.getTargetArray(this.props.id);
        var isMyElement = targetArray.some(function (ele) {
          return ele === e.currentTarget;
        });
        if (!isMyElement) return;
      }
      // Get the tooltip content
      // calculate in this phrase so that tip width height can be detected
      var _this$props5 = this.props,
        multiline = _this$props5.multiline,
        getContent = _this$props5.getContent;
      var originTooltip = e.currentTarget.getAttribute('data-tip');
      var isMultiline = e.currentTarget.getAttribute('data-multiline') || multiline || false;

      // If it is focus event or called by ReactTooltip.show, switch to `solid` effect
      var switchToSolid = e instanceof window.FocusEvent || isGlobalCall;

      // if it needs to skip adding hide listener to scroll
      var scrollHide = true;
      if (e.currentTarget.getAttribute('data-scroll-hide')) {
        scrollHide = e.currentTarget.getAttribute('data-scroll-hide') === 'true';
      } else if (this.props.scrollHide != null) {
        scrollHide = this.props.scrollHide;
      }

      // adding aria-describedby to target to make tooltips read by screen readers
      if (e && e.currentTarget && e.currentTarget.setAttribute) {
        e.currentTarget.setAttribute('aria-describedby', this.props.id || this.state.uuid);
      }

      // Make sure the correct place is set
      var desiredPlace = e.currentTarget.getAttribute('data-place') || this.props.place || 'top';
      var effect = switchToSolid && 'solid' || this.getEffect(e.currentTarget);
      var offset = e.currentTarget.getAttribute('data-offset') || this.props.offset || {};
      var result = getPosition(e, e.currentTarget, this.tooltipRef, desiredPlace.split(',')[0], desiredPlace, effect, offset);
      if (result.position && this.props.overridePosition) {
        result.position = this.props.overridePosition(result.position, e, e.currentTarget, this.tooltipRef, desiredPlace, desiredPlace, effect, offset);
      }
      var place = result.isNewState ? result.newState.place : desiredPlace.split(',')[0];

      // To prevent previously created timers from triggering
      this.clearTimer();
      var target = e.currentTarget;
      var reshowDelay = this.state.show ? target.getAttribute('data-delay-update') || this.props.delayUpdate : 0;
      var self = this;
      var updateState = function updateState() {
        self.setState({
          originTooltip: originTooltip,
          isMultiline: isMultiline,
          desiredPlace: desiredPlace,
          place: place,
          type: target.getAttribute('data-type') || self.props.type || 'dark',
          customColors: {
            text: target.getAttribute('data-text-color') || self.props.textColor || null,
            background: target.getAttribute('data-background-color') || self.props.backgroundColor || null,
            border: target.getAttribute('data-border-color') || self.props.borderColor || null,
            arrow: target.getAttribute('data-arrow-color') || self.props.arrowColor || null
          },
          customRadius: {
            tooltip: target.getAttribute('data-tooltip-radius') || self.props.tooltipRadius || '3',
            arrow: target.getAttribute('data-arrow-radius') || self.props.arrowRadius || '0'
          },
          effect: effect,
          offset: offset,
          padding: target.getAttribute('data-padding') || self.props.padding,
          html: (target.getAttribute('data-html') ? target.getAttribute('data-html') === 'true' : self.props.html) || false,
          delayShow: target.getAttribute('data-delay-show') || self.props.delayShow || 0,
          delayHide: target.getAttribute('data-delay-hide') || self.props.delayHide || 0,
          delayUpdate: target.getAttribute('data-delay-update') || self.props.delayUpdate || 0,
          border: (target.getAttribute('data-border') ? target.getAttribute('data-border') === 'true' : self.props.border) || false,
          borderClass: target.getAttribute('data-border-class') || self.props.borderClass || 'border',
          extraClass: target.getAttribute('data-class') || self.props["class"] || self.props.className || '',
          disable: (target.getAttribute('data-tip-disable') ? target.getAttribute('data-tip-disable') === 'true' : self.props.disable) || false,
          currentTarget: target
        }, function () {
          if (scrollHide) {
            self.addScrollListener(self.state.currentTarget);
          }
          self.updateTooltip(e);
          if (getContent && Array.isArray(getContent)) {
            self.intervalUpdateContent = setInterval(function () {
              if (self.mount) {
                var _getContent = self.props.getContent;
                var placeholder = TipContent(originTooltip, '', _getContent[0](), isMultiline);
                var isEmptyTip = self.isEmptyTip(placeholder);
                self.setState({
                  isEmptyTip: isEmptyTip
                });
                self.updatePosition();
              }
            }, getContent[1]);
          }
        });
      };

      // If there is no delay call immediately, don't allow events to get in first.
      if (reshowDelay) {
        this.delayReshow = setTimeout(updateState, reshowDelay);
      } else {
        updateState();
      }
    }

    /**
     * When mouse hover, update tool tip
     */
  }, {
    key: "updateTooltip",
    value: function updateTooltip(e) {
      var _this5 = this;
      var _this$state = this.state,
        delayShow = _this$state.delayShow,
        disable = _this$state.disable;
      var _this$props6 = this.props,
        afterShow = _this$props6.afterShow,
        disableProp = _this$props6.disable;
      var placeholder = this.getTooltipContent();
      var eventTarget = e.currentTarget || e.target;

      // Check if the mouse is actually over the tooltip, if so don't hide the tooltip
      if (this.mouseOnToolTip()) {
        return;
      }

      // if the tooltip is empty, disable the tooltip
      if (this.isEmptyTip(placeholder) || disable || disableProp) {
        return;
      }
      var delayTime = !this.state.show ? parseInt(delayShow, 10) : 0;
      var updateState = function updateState() {
        if (Array.isArray(placeholder) && placeholder.length > 0 || placeholder) {
          var isInvisible = !_this5.state.show;
          _this5.setState({
            currentEvent: e,
            currentTarget: eventTarget,
            show: true
          }, function () {
            _this5.updatePosition(function () {
              if (isInvisible && afterShow) {
                afterShow(e);
              }
            });
          });
        }
      };
      if (this.delayShowLoop) {
        clearTimeout(this.delayShowLoop);
      }
      if (delayTime) {
        this.delayShowLoop = setTimeout(updateState, delayTime);
      } else {
        this.delayShowLoop = null;
        updateState();
      }
    }

    /*
     * If we're mousing over the tooltip remove it when we leave.
     */
  }, {
    key: "listenForTooltipExit",
    value: function listenForTooltipExit() {
      var show = this.state.show;
      if (show && this.tooltipRef) {
        this.tooltipRef.addEventListener('mouseleave', this.hideTooltip);
      }
    }
  }, {
    key: "removeListenerForTooltipExit",
    value: function removeListenerForTooltipExit() {
      var show = this.state.show;
      if (show && this.tooltipRef) {
        this.tooltipRef.removeEventListener('mouseleave', this.hideTooltip);
      }
    }

    /**
     * When mouse leave, hide tooltip
     */
  }, {
    key: "hideTooltip",
    value: function hideTooltip(e, hasTarget) {
      var _this6 = this;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        isScroll: false
      };
      var disable = this.state.disable;
      var isScroll = options.isScroll;
      var delayHide = isScroll ? 0 : this.state.delayHide;
      var _this$props7 = this.props,
        afterHide = _this$props7.afterHide,
        disableProp = _this$props7.disable;
      var placeholder = this.getTooltipContent();
      if (!this.mount) return;
      if (this.isEmptyTip(placeholder) || disable || disableProp) return; // if the tooltip is empty, disable the tooltip
      if (hasTarget) {
        // Don't trigger other elements belongs to other ReactTooltip
        var targetArray = this.getTargetArray(this.props.id);
        var isMyElement = targetArray.some(function (ele) {
          return ele === e.currentTarget;
        });
        if (!isMyElement || !this.state.show) return;
      }

      // clean up aria-describedby when hiding tooltip
      if (e && e.currentTarget && e.currentTarget.removeAttribute) {
        e.currentTarget.removeAttribute('aria-describedby');
      }
      var resetState = function resetState() {
        var isVisible = _this6.state.show;
        // Check if the mouse is actually over the tooltip, if so don't hide the tooltip
        if (_this6.mouseOnToolTip()) {
          _this6.listenForTooltipExit();
          return;
        }
        _this6.removeListenerForTooltipExit();
        _this6.setState({
          show: false
        }, function () {
          _this6.removeScrollListener(_this6.state.currentTarget);
          if (isVisible && afterHide) {
            afterHide(e);
          }
        });
      };
      this.clearTimer();
      if (delayHide) {
        this.delayHideLoop = setTimeout(resetState, parseInt(delayHide, 10));
      } else {
        resetState();
      }
    }

    /**
     * When scroll, hide tooltip
     */
  }, {
    key: "hideTooltipOnScroll",
    value: function hideTooltipOnScroll(event, hasTarget) {
      this.hideTooltip(event, hasTarget, {
        isScroll: true
      });
    }

    /**
     * Add scroll event listener when tooltip show
     * automatically hide the tooltip when scrolling
     */
  }, {
    key: "addScrollListener",
    value: function addScrollListener(currentTarget) {
      var isCaptureMode = this.isCapture(currentTarget);
      window.addEventListener('scroll', this.hideTooltipOnScroll, isCaptureMode);
    }
  }, {
    key: "removeScrollListener",
    value: function removeScrollListener(currentTarget) {
      var isCaptureMode = this.isCapture(currentTarget);
      window.removeEventListener('scroll', this.hideTooltipOnScroll, isCaptureMode);
    }

    // Calculation the position
  }, {
    key: "updatePosition",
    value: function updatePosition(callbackAfter) {
      var _this7 = this;
      var _this$state2 = this.state,
        currentEvent = _this$state2.currentEvent,
        currentTarget = _this$state2.currentTarget,
        place = _this$state2.place,
        desiredPlace = _this$state2.desiredPlace,
        effect = _this$state2.effect,
        offset = _this$state2.offset;
      var node = this.tooltipRef;
      var result = getPosition(currentEvent, currentTarget, node, place, desiredPlace, effect, offset);
      if (result.position && this.props.overridePosition) {
        result.position = this.props.overridePosition(result.position, currentEvent, currentTarget, node, place, desiredPlace, effect, offset);
      }
      if (result.isNewState) {
        // Switch to reverse placement
        return this.setState(result.newState, function () {
          _this7.updatePosition(callbackAfter);
        });
      }
      if (callbackAfter && typeof callbackAfter === 'function') {
        callbackAfter();
      }

      // Set tooltip position
      node.style.left = result.position.left + 'px';
      node.style.top = result.position.top + 'px';
    }

    /**
     * CLear all kinds of timeout of interval
     */
  }, {
    key: "clearTimer",
    value: function clearTimer() {
      if (this.delayShowLoop) {
        clearTimeout(this.delayShowLoop);
        this.delayShowLoop = null;
      }
      if (this.delayHideLoop) {
        clearTimeout(this.delayHideLoop);
        this.delayHideLoop = null;
      }
      if (this.delayReshow) {
        clearTimeout(this.delayReshow);
        this.delayReshow = null;
      }
      if (this.intervalUpdateContent) {
        clearInterval(this.intervalUpdateContent);
        this.intervalUpdateContent = null;
      }
    }
  }, {
    key: "hasCustomColors",
    value: function hasCustomColors() {
      var _this8 = this;
      return Boolean(Object.keys(this.state.customColors).find(function (color) {
        return color !== 'border' && _this8.state.customColors[color];
      }) || this.state.border && this.state.customColors['border']);
    }
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;
      var _this$state3 = this.state,
        extraClass = _this$state3.extraClass,
        html = _this$state3.html,
        ariaProps = _this$state3.ariaProps,
        disable = _this$state3.disable,
        uuid = _this$state3.uuid;
      var content = this.getTooltipContent();
      var isEmptyTip = this.isEmptyTip(content);
      var style = this.props.disableInternalStyle ? '' : generateTooltipStyle(this.state.uuid, this.state.customColors, this.state.type, this.state.border, this.state.padding, this.state.customRadius);
      var tooltipClass = '__react_component_tooltip' + " ".concat(this.state.uuid) + (this.state.show && !disable && !isEmptyTip ? ' show' : '') + (this.state.border ? ' ' + this.state.borderClass : '') + " place-".concat(this.state.place) + // top, bottom, left, right
      " type-".concat(this.hasCustomColors() ? 'custom' : this.state.type) + (
      // dark, success, warning, error, info, light, custom
      this.props.delayUpdate ? ' allow_hover' : '') + (this.props.clickable ? ' allow_click' : '');
      var Wrapper = this.props.wrapper;
      if (ReactTooltip.supportedWrappers.indexOf(Wrapper) < 0) {
        Wrapper = ReactTooltip.defaultProps.wrapper;
      }
      var wrapperClassName = [tooltipClass, extraClass].filter(Boolean).join(' ');
      if (html) {
        var htmlContent = "".concat(content).concat(style ? "\n<style aria-hidden=\"true\">".concat(style, "</style>") : '');
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Wrapper, _extends({
          className: "".concat(wrapperClassName),
          id: this.props.id || uuid,
          ref: function ref(_ref) {
            return _this9.tooltipRef = _ref;
          }
        }, ariaProps, {
          "data-id": "tooltip",
          dangerouslySetInnerHTML: {
            __html: htmlContent
          }
        }));
      } else {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Wrapper, _extends({
          className: "".concat(wrapperClassName),
          id: this.props.id || uuid
        }, ariaProps, {
          ref: function ref(_ref2) {
            return _this9.tooltipRef = _ref2;
          },
          "data-id": "tooltip"
        }), style && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("style", {
          dangerouslySetInnerHTML: {
            __html: style
          },
          "aria-hidden": "true"
        }), content);
      }
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return {
        uuid: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        children: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().any),
        place: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        type: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        effect: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        offset: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object),
        padding: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        multiline: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        border: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        borderClass: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        textColor: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        backgroundColor: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        borderColor: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        arrowColor: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        arrowRadius: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        tooltipRadius: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        insecure: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        "class": (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        className: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        id: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        html: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        delayHide: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
        delayUpdate: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
        delayShow: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
        event: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        eventOff: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        isCapture: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        globalEventOff: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        getContent: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().any),
        afterShow: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
        afterHide: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
        overridePosition: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
        disable: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        scrollHide: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        resizeHide: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        wrapper: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        bodyMode: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        possibleCustomEvents: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        possibleCustomEventsOff: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
        clickable: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
        disableInternalStyle: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool)
      };
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var ariaProps = prevState.ariaProps;
      var newAriaProps = parseAria(nextProps);
      var isChanged = Object.keys(newAriaProps).some(function (props) {
        return newAriaProps[props] !== ariaProps[props];
      });
      if (!isChanged) {
        return null;
      }
      return _objectSpread2(_objectSpread2({}, prevState), {}, {
        ariaProps: newAriaProps
      });
    }
  }]);
  return ReactTooltip;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component)), _defineProperty(_class2, "defaultProps", {
  insecure: true,
  resizeHide: true,
  wrapper: 'div',
  clickable: false
}), _defineProperty(_class2, "supportedWrappers", ['div', 'span']), _defineProperty(_class2, "displayName", 'ReactTooltip'), _class2)) || _class) || _class) || _class) || _class) || _class) || _class) || _class;


//# sourceMappingURL=index.es.js.map


/***/ }),

/***/ "./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/bytesToUuid.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/bytesToUuid.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

  return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (bytesToUuid);

/***/ }),

/***/ "./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/rng.js":
/*!******************************************************************************!*\
  !*** ./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/rng.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

function rng() {
  if (!getRandomValues) {
    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/v4.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/v4.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _bytesToUuid_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bytesToUuid.js */ "./node_modules/react-tooltip/node_modules/uuid/dist/esm-browser/bytesToUuid.js");



function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof options == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }

  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || (0,_bytesToUuid_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = window["ReactDOM"];

/***/ }),

/***/ "./src/data/results_2024.json":
/*!************************************!*\
  !*** ./src/data/results_2024.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"afdb---sovereign":{"display_name":"AfDB - Sovereign","name":"AfDB - Sovereign","performance_group":"Very good","rank":1,"score":98.83622314899999,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.adb.org/documents/access-information-policy"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://projectsportal.afdb.org/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":98.57822695,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.347904255},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":98.35057613,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":24.930580658999997},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":19.999333335},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":79.39683375,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["",""],"sources":[[],[]],"score":99.05449643,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":19.559071568},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":19.999333332}},"history":[{"score":98.5,"performance_group":"Very Good","year":"2022"},{"score":95.52126468,"performance_group":"Very good","year":"2020"}]},"iadb":{"display_name":"IADB","name":"IADB","performance_group":"Very good","rank":2,"score":96.32069370099998,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.iadb.org/document.cfm?id=35167427"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.iadb.org/en/project-search"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":13.7495625},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":97.4325641,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":96.31342541,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.18928489,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":97.22850058,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.37938272,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":24.629794374},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.70831603,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":97.86045225,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":98.5832391,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":99.82365629,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":19.913795344},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":37.11600823,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":98.97860201,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["",""],"sources":[[],[]],"score":99.99666667000001,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":18.731539517999998},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":96.53645905,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":96.53987654,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"","sources":[],"score":99.5337037,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":93.31,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":19.296001965000002}},"history":[{"score":96.3,"performance_group":"Very Good","year":"2022"},{"score":95.41508564,"performance_group":"Very good","year":"2020"},{"score":83.47838008,"performance_group":"Very good","year":"2018"},{"score":85.6,"performance_group":"Very good","year":"2016"},{"score":73.9,"performance_group":"Good","year":"2014"},{"score":57.1,"performance_group":"Fair","year":"2013"}]},"us-mcc":{"display_name":"US-MCC","name":"US-MCC","performance_group":"Very good","rank":3,"score":92.99330196200002,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://foreignassistance.gov/data"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.3745},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":87.83943396,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":97.53,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":97.53,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":97.53,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":85.39463415,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":77.77444444,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":22.934599581},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":97.53,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":97.53,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":97.53,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":97.53,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":97.53,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":19.506},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":97.53,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":97.53,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":97.53,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":97.53,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":97.53,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":97.53,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["",""],"sources":[[],[]],"score":88.01888889,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":19.220666667},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":97.53,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":97.53,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Always","sources":["https://www.mcc.gov/our-impact/independent-evaluations/"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"","sources":[],"score":94.09071429,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":16.957535714000002}},"history":[{"score":92,"performance_group":"Very Good","year":"2022"},{"score":92.05134895,"performance_group":"Very good","year":"2020"},{"score":87.04563642,"performance_group":"Very good","year":"2018"},{"score":89.6,"performance_group":"Very good","year":"2016"},{"score":null,"performance_group":"Very good","year":"2015"},{"score":86.9,"performance_group":"Very good","year":"2014"},{"score":88.9,"performance_group":"Very good","year":"2013"}]},"world-bank-ida":{"display_name":"World Bank-IDA","name":"World Bank-IDA","performance_group":"Very good","rank":4,"score":92.245804987,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://maps.worldbank.org/locations"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Always","sources":["https://www.worldbank.org/en/country/afghanistan"],"score":50,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.812125},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":76.55678843,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":97.29790664,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":99.94955241,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.86088934,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":94.11298258,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":90.80938751,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":23.424085618},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.97403711,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":98.57100475,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":90.06229237,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":99.17811278,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":98.86518896,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":19.639726718000002},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.86088934,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.86088934,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":92.619432,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["",""],"sources":[[],[]],"score":99.99666667000001,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":16.843742},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.95140756,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":96.06674242,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"","sources":[],"score":99.10149588,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":95.40286716,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":19.526125651}},"history":[{"score":97.1,"performance_group":"Very Good","year":"2022"},{"score":97.13614467,"performance_group":"Very good","year":"2020"},{"score":86.09875965,"performance_group":"Very good","year":"2018"},{"score":86.1,"performance_group":"Very good","year":"2016"},{"score":82.3,"performance_group":"Very good","year":"2014"},{"score":73.8,"performance_group":"Good","year":"2013"}]},"un-ocha":{"display_name":"UN OCHA","name":"UN OCHA","performance_group":"Very good","rank":5,"score":92.20711671,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://fts.unocha.org/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":13.7495625},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":79.25592593,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":24.134970209},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":19.999333335},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.033333,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":99.45571747,"weight":0.016667,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0,"format":""},"Project procurement":{"status":["Always","Always"],"sources":[["https://www.ungm.org/"],["https://www.un.org/Depts/ptd/contract-awards/343?field_date_3_value%5Bvalue%5D%5Byear%5D=2024&field_date_3_value_1%5Bvalue%5D%5Bmonth%5D=&field_text_20_2_value=&field_country_tid_selective=All&field_text_75_2_value=&field_commodity_group_ca_tid_selective=All&items_per_page=10"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":18.490417333},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Always","sources":["https://reliefweb.int/updates?list=UN%20Office%20for%20the%20Coordination%20of%20Humanitarian%20Affairs%20Updates&advanced-search=%28S1503%29"],"score":50,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":66.66333333,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":15.832833333}},"history":[{"score":85.9,"performance_group":"Very Good","year":"2022"},{"score":73.95101793,"performance_group":"Good","year":"2020"},{"score":32.7168301,"performance_group":"Poor","year":"2018"},{"score":37,"performance_group":"Poor","year":"2016"},{"score":41.3,"performance_group":"Fair","year":"2014"},{"score":41.7,"performance_group":"Fair","year":"2013"}]},"undp":{"display_name":"UNDP","name":"UNDP","performance_group":"Very good","rank":6,"score":91.49013745299997,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://open.undp.org/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.52047619,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.365571429},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":67.21064972,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":96.86084911,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":98.87230414,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":98.70364976,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":94.23937306,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":23.529284108},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.86553048,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":98.81891528,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":93.20551096,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":82.79718252,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":19.123017037},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99171813,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":68.34765565,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.96867898,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["",""],"sources":[[],[]],"score":71.28560985666667,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":18.504642561999997},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":93.20918279,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":51.68335641,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"","sources":[],"score":97.53029895,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":76.92960819,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":15.967622316999998}},"history":[{"score":88.1,"performance_group":"Very Good","year":"2022"},{"score":96.64467643,"performance_group":"Very good","year":"2020"},{"score":95.48009968,"performance_group":"Very good","year":"2018"},{"score":93.3,"performance_group":"Very good","year":"2016"},{"score":90.6,"performance_group":"Very good","year":"2014"},{"score":83.4,"performance_group":"Very good","year":"2013"}]},"asdb---sovereign":{"display_name":"AsDB - Sovereign","name":"AsDB - Sovereign","performance_group":"Very good","rank":7,"score":91.051463841,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://data.adb.org/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Always","sources":["https://www.adb.org/documents/series/country-partnership-strategies"],"score":50,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.812125},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":96.57786325,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":98.40261778,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.96834608,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.05794899,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":24.771348043},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":34.0946559,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"","sources":[],"score":99.74178137,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":17.683841974},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.20369017,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":42.77862605,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.96834608,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["","Always"],"sources":[[],["https://www.adb.org/business/operational-procurement/goods-contracts-awarded-archive"]],"score":66.46482347333334,"weight":0.03,"format":["IATI","Document"]}},"out_of":20,"weighted_score":17.832874488999998},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":98.80720193,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":98.40261778,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"","sources":[],"score":95.78954693,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":66.02612008,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":17.951274335}},"history":[{"score":94.8,"performance_group":"Very Good","year":"2022"},{"score":98.0371834,"performance_group":"Very good","year":"2020"}]},"unicef":{"display_name":"UNICEF","name":"UNICEF","performance_group":"Very good","rank":8,"score":86.21468635,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://open.unicef.org/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.42195402,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":13.738786638},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":99.47583333,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":24.977466378},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"Always","sources":["https://open.unicef.org/country-output?output-id=0990A007006004000"],"score":33.33,"weight":0.03,"format":"Website"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":17.999333335},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Machine readable"},"Project procurement":{"status":["",""],"sources":[[],[]],"score":99.99666667000001,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":16.999433333},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Always","sources":["https://www.unicef.org/evaluation/reports#/"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":12.499666666}},"history":[{"score":89.1,"performance_group":"Very Good","year":"2022"},{"score":92.87429826,"performance_group":"Very good","year":"2020"},{"score":78.14470024,"performance_group":"Good","year":"2018"},{"score":89.5,"performance_group":"Very good","year":"2016"},{"score":64.7,"performance_group":"Good","year":"2014"},{"score":44.3,"performance_group":"Fair","year":"2013"}]},"wfp":{"display_name":"WFP","name":"WFP","performance_group":"Very good","rank":9,"score":84.536744551,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://docs.wfp.org/api/documents/08ed0919a7f64acc80cf58c93c04ad6d/download/"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.wfp.org/countries"],"score":33.33,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.14196581,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.483474359},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":99.20301587,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":99.84851852,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":95.92259259,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":95.70037037,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":24.682148351},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.89493727,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":66.66333333,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":15.329731453999997},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":45.36192681,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always",""],"sources":[["https://www.wfp.org/do-business-with-wfp;","https://www.ungm.org/"],[]],"score":83.33111111333334,"weight":0.03,"format":["Document","IATI"]}},"out_of":20,"weighted_score":17.406705201999998},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.84851852,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":92.84851852,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":14.634685185}}},"ec-intpa":{"display_name":"EC-INTPA","name":"EC-INTPA","performance_group":"Very good","rank":10,"score":82.92614831899999,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/international-institutions/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://euaidexplorer.ec.europa.eu/explore/recipients_en"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":91.14710914,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.833695795999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":98.2657261,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":70.50894139,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.41213565,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":93.43852168,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":89.35265951,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":23.365656052},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99392454,"weight":0.01,"format":"IATI"},"Description":{"status":"Sometimes","sources":[],"score":0,"weight":0.03,"format":"Website"},"Planned dates":{"status":"","sources":[],"score":99.88423933,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":97.78893778,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.61276845,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":66.66333333,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":52.26455099,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":14.12931618},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.98105204,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":56.13081453,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":98.70603265,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always",""],"sources":[["https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals?freeTextSearchKeyword=&matchWholeText=true&programmePeriod=2021%20-%202027&destinationGroup=null&missionGroup=null&programmeDivisionProspect=null&cpvCode=null&performanceOfDelivery=null&sortQuery=sortStatus&orderBy=asc&onlyTenders=false&topicListKey=topicSearchTablePageState&type=0,1,2,8&callIdentifier=null&status=31094501,31094502,31094503&frameworkProgramme=111111&programmeDivision=null&focusArea=null&geographicalZones=null&crossCuttingPriorities=null&isExactMatch=true&order=DESC&pageNumber=1&pageSize=50&sortBy=startDate"],[]],"score":82.80619944,"weight":0.03,"format":["Document","IATI"]}},"out_of":20,"weighted_score":18.593083642},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":70.56390189,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":71.20803669,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"","sources":[],"score":98.3159944,"weight":0.05,"format":"IATI"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":12.004396649}},"history":[{"score":65.87408622,"performance_group":"Good","year":"2018"},{"score":68.7,"performance_group":"Good","year":"2016"},{"score":null,"performance_group":"Good","year":"2015"},{"score":68.2,"performance_group":"Good","year":"2014"},{"score":52.1,"performance_group":"Fair","year":"2013"},{"score":72.4,"performance_group":"Good","year":"2022"},{"score":76.49426193,"performance_group":"Good","year":"2020"}]},"uk-fcdo":{"display_name":"UK-FCDO","name":"UK-FCDO","performance_group":"Very good","rank":11,"score":82.89010308400002,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://devtracker.fcdo.gov.uk/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.999624999999998},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":74.96312248,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":91.72487937,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":83.63624745,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":87.50177079,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":80.48295096,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":20.424836975999998},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.94901358,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":98.94730224,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":63.86435115,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"","sources":[],"score":89.90894737,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":18.369708879},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":84.86123724,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":95.6683694,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":80.47849598,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":84.65426628,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":78.47445684,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.57516404,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["",""],"sources":[[],[]],"score":48.736924053333325,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":16.550576903999996},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":93.5044186,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"","sources":[],"score":96.21416076,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":61.18852713,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":12.545355325}},"history":[{"score":71.9,"performance_group":"Good","year":"2022"},{"score":85.43050565,"performance_group":"Very good","year":"2020"},{"score":90.93241589,"performance_group":"Very good","year":"2018"},{"score":88.3,"performance_group":"Very good","year":"2016"},{"score":null,"performance_group":"Very good","year":"2015"},{"score":88.3,"performance_group":"Very good","year":"2014"},{"score":83.5,"performance_group":"Very good","year":"2013"}]},"gavi":{"display_name":"GAVI","name":"GAVI","performance_group":"Very good","rank":12,"score":81.349425535,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.gavi.org/programmes-impact/country-hub"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":11.874625},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":96.72869281,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":98.10850399,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":99.66165829,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":98.76830262,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":21.414728619999998},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":99.89701545,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"","sources":[],"score":95.75322725,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":19.847325164},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":70.32568221,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always",""],"sources":[["https://www.gavi.org/our-alliance/work-us/rfps-and-consulting-opportunities"],[]],"score":71.27080960666667,"weight":0.03,"format":["Document","IATI"]}},"out_of":20,"weighted_score":17.544171265},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":96.70817638,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Always","sources":["https://www.gavi.org/news-resources/document-library/evaluations"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"","sources":[],"score":66.66333333,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":10.668575486}},"history":[{"score":87.1,"performance_group":"Very Good","year":"2022"},{"score":80.77960657,"performance_group":"Very good","year":"2020"},{"score":75.26426203,"performance_group":"Good","year":"2018"},{"score":78,"performance_group":"Good","year":"2016"},{"score":86.8,"performance_group":"Very good","year":"2014"},{"score":87.3,"performance_group":"Very good","year":"2013"}]},"afdb---non-sov":{"display_name":"AfDB - Non-Sov.","name":"AfDB - Non-Sov.","performance_group":"Good","rank":13,"score":78.82519391800001,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.afdb.org/fileadmin/uploads/afdb/Documents/Policy-Documents/Bank_Group_Policy_on_Disclosure_and_Acess_to_Infomation.pdf"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://projectsportal.afdb.org/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":98.57822695,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.347904255},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":98.35057613,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":46.66333333,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":19.819580403},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":76.66333333,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":16.266116668},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.033333,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":50.57242424,"weight":0,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.016667,"format":"IATI"},"Project procurement":{"status":["",""],"sources":[[],[]],"score":46.41641975,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":18.391925926},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":9.999666666}},"history":[{"score":78.6,"performance_group":"Good","year":"2022"}]},"global-fund":{"display_name":"Global Fund","name":"Global Fund","performance_group":"Good","rank":14,"score":78.392820309,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.theglobalfund.org/media/5715/core_s_policy_en.pdf?u=637066556920000000"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://data.theglobalfund.org/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.28744681,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":13.736264628},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":76.08132275,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.43800745,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.43800745,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":77.77444444,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":23.039525167},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.9035568,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":98.78623836,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":72.54568627,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":16.18769625},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always","Not Published"],"sources":[["https://fa-enmo-saasfaprod1.fa.ocs.oraclecloud.com/fscmUI/faces/NegotiationAbstracts?prcBuId=300000003071579&_adf.ctrl-state=1cheiu8ik7_1&_afrLoop=74705267971809978&_afrWindowMode=0&_afrWindowId=null&_afrFS=16&_afrMT=screen&_afrMFW=1536&_afrMFH=707&_afrMFDW=1536&_afrMFDH=864&_afrMFC=8&_afrMFCI=0&_afrMFM=0&_afrMFR=120&_afrMFG=0&_afrMFS=0&_afrMFO=0"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document",""]}},"out_of":20,"weighted_score":15.4995},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"","sources":[],"score":98.60001862,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":9.929834264}},"history":[{"score":67.9,"performance_group":"Good","year":"2022"},{"score":86.52655198,"performance_group":"Very good","year":"2020"},{"score":74.54661985,"performance_group":"Good","year":"2018"},{"score":86.9,"performance_group":"Very good","year":"2016"},{"score":73.3,"performance_group":"Good","year":"2014"},{"score":70.7,"performance_group":"Good","year":"2013"}]},"ec-echo":{"display_name":"EC-ECHO","name":"EC-ECHO","performance_group":"Good","rank":15,"score":75.897987645,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/international-institutions/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://euaidexplorer.ec.europa.eu/explore/recipients_en","https://civil-protection-humanitarian-aid.ec.europa.eu/index_en"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"Always","sources":["https://civil-protection-humanitarian-aid.ec.europa.eu/funding-evaluations/funding-humanitarian-aid/financing-decisions-hips_en","https://ec.europa.eu/echo/files/funding/hip2023/c_2022_9255_f1_commission_implementing_decision_en_v3_p1_2290349.pdf"],"score":50,"weight":0.01875,"format":"Document"},"Procurement policy":{"status":"Always","sources":["https://civil-protection-humanitarian-aid.ec.europa.eu/funding-evaluations/procurement_en"],"score":50,"weight":0.01875,"format":"Document"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":77.33,"weight":0.01875,"format":"IATI"},"Audit":{"status":"Always","sources":["https://commission.europa.eu/system/files/2023-06/ECHO_AAR_2022_en.pdf"],"score":50,"weight":0.01875,"format":"Document"}},"out_of":15,"weighted_score":11.7623125},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":41.33800801,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":95.66062331,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":97.12066478,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.15902193,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.92594531,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":22.284376519},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.94951909,"weight":0.01,"format":"IATI"},"Description":{"status":"Sometimes","sources":[],"score":0,"weight":0.03,"format":"Website"},"Planned dates":{"status":"","sources":[],"score":99.97309288,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.92594531,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Website"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":13.498135573999999},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":79.25264104,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["","Always"],"sources":[[],["https://etendering.ted.europa.eu/cft/cft-search.html?text=&caList=20&_caList=1&status=&startDateFrom=01%2F01%2F2023&startDateTo=31%2F12%2F2023&closingDateFrom=&closingDateTo=&procedureTypeOngoing=&_procedureTypeOngoing=1&procedureTypeForthcoming=cft.procedure_type.ex_ante_publicity&_procedureTypeForthcoming=1&confirm=Search#"]],"score":66.66555555666667,"weight":0.03,"format":["IATI","Document"]}},"out_of":20,"weighted_score":18.584519487999998},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":95.37620462,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":9.768643564}},"history":[{"score":77.1,"performance_group":"Good","year":"2022"},{"score":68.16658828,"performance_group":"Good","year":"2020"},{"score":77.561834,"performance_group":"Good","year":"2018"},{"score":71.9,"performance_group":"Good","year":"2016"},{"score":null,"performance_group":"Fair","year":"2015"},{"score":59.9,"performance_group":"Fair","year":"2014"},{"score":54.2,"performance_group":"Fair","year":"2013"}]},"sweden-sida":{"display_name":"Sweden-Sida","name":"Sweden-Sida","performance_group":"Good","rank":16,"score":75.436526513,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://openaid.se/en"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.37361371,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.987942756999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":81.88275444,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":49.50395553,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Always","sources":["https://cdn.openaid.se/app/uploads/2023/04/13115247/Strategirapport-DRK-2021-2025-SLUTGILTIG.pdf"],"score":50,"weight":0.033333335,"format":"Document"},"Commitments":{"status":"","sources":[],"score":99.20852309,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":98.2661775,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":82.70352041,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":20.234382639999996},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.84974911,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":97.52732158,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":92.38266002,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Website"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"","sources":[],"score":43.38991013,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":14.366523928},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.97953311,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.77393044,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.97953311,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":53.74564792,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always",""],"sources":[["https://www.kommersannons.se/eLite/Notice/NoticeList.aspx"],[]],"score":54.396734900000006,"weight":0.03,"format":["Document","IATI"]}},"out_of":20,"weighted_score":16.698809573},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":83.40504907,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Always","sources":["https://openaid.se/en/activities/SE-0-SE-6-14442A0201-H10547"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"","sources":[],"score":49.57230321,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":9.148867615}},"history":[{"score":68,"performance_group":"Good","year":"2022"},{"score":63.74142644,"performance_group":"Good","year":"2020"},{"score":71.2205083,"performance_group":"Good","year":"2018"},{"score":80.7,"performance_group":"Very good","year":"2016"},{"score":null,"performance_group":"Very good","year":"2015"},{"score":83.3,"performance_group":"Very good","year":"2014"},{"score":60.4,"performance_group":"Good","year":"2013"}]},"germany-bmz-giz":{"display_name":"Germany-BMZ-GIZ","name":"Germany-BMZ-GIZ","performance_group":"Good","rank":17,"score":75.18488992099998,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.giz.de/projektdaten/region/-1/countries/]","https://www.transparenzportal.bund.de/de;]"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":97.94538462,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":13.711100962},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":75.08084175,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":61.97775997,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":53.41757526,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":17.807852561999997},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":98.02622332,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":86.35295506,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":19.462690129000002},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.94193213,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":35.25038127,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["","Always"],"sources":[[],["https://www.giz.de/en/workingwithgiz/awarded_contracts.html"]],"score":66.66555555666667,"weight":0.03,"format":["IATI","Document"]}},"out_of":20,"weighted_score":16.703412935},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Always","sources":["https://www.giz.de/en/aboutgiz/monitoring_and_evaluation.html"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":7.499833333}},"history":[{"score":79.3,"performance_group":"Good","year":"2022"},{"score":72.34032417,"performance_group":"Good","year":"2020"},{"score":60.8982238,"performance_group":"Good","year":"2018"},{"score":63.2,"performance_group":"Good","year":"2016"},{"score":null,"performance_group":"Fair","year":"2015"},{"score":53.9,"performance_group":"Fair","year":"2014"},{"score":45.9,"performance_group":"Fair","year":"2013"}]},"asdb---non-sov":{"display_name":"AsDB - Non-Sov.","name":"AsDB - Non-Sov.","performance_group":"Good","rank":18,"score":74.40031450299999,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.adb.org/documents/access-information-policy"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://data.adb.org/"],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Always","sources":["https://www.adb.org/documents/series/country-partnership-strategies"],"score":50,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.187},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":["https://www.adb.org/sites/default/files/institutional-document/938521/adb-budget-2024.pdf"],"score":16.665,"weight":0.041666668,"format":"PDF"},"Project budget":{"status":"Always","sources":["https://www.adb.org/projects/56293-001/main"],"score":50,"weight":0.033333335,"format":"Machine readable"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":16.527236849999998},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.87719235,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":33.84282051,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Document"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":14.182870644000001},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.48384615,"weight":0.033333,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":34.77404332,"weight":0,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.016667,"format":"IATI"},"Project procurement":{"status":["Not Published","Not Published"],"sources":[[],[]],"score":0,"weight":0.03,"format":["",""]}},"out_of":20,"weighted_score":16.982339486999997},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.48384615,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":95.38128205,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"","sources":[],"score":95.55222222,"weight":0.05,"format":"IATI"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":14.520867522}},"history":[{"score":82.3,"performance_group":"Very Good","year":"2022"}]},"belgium-dgd":{"display_name":"Belgium-DGD","name":"Belgium-DGD","performance_group":"Good","rank":19,"score":74.216885624,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.law-democracy.org/live/rti-rating/global/"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://openaid.be/en/active-projects"],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Always","sources":[],"score":50,"weight":0.01875,"format":"Document"},"Audit":{"status":"Always","sources":["https://diplomatie.belgium.be/en/policy"],"score":50,"weight":0.01875,"format":"Document"}},"out_of":15,"weighted_score":11.2495625},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":78.8326455,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":54.33,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":80.79760895,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":97.61571429,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":94.66786848,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":84.33117786,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":["https://diplomatie.belgium.be/en/policy/world-regions"],"score":11.11,"weight":0.041666668,"format":"PDF"}},"out_of":25,"weighted_score":17.472356687999998},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":89.02823435,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":96.35835741,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":96.12289494,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":98.01699839,"weight":0.025,"format":"IATI"},"Location":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":94.52402985,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":15.854242226},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.88328798,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.88328798,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":84.00096082,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always",""],"sources":[["https://www.publicprocurement.be/"],[]],"score":77.18708558,"weight":0.03,"format":["Document","IATI"]}},"out_of":20,"weighted_score":18.988329060999998},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":88.02483568,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"","sources":[],"score":84.88555556,"weight":0.05,"format":"IATI"},"Results":{"status":"","sources":[],"score":40.13751174,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":10.652395149}},"history":[{"score":63.3,"performance_group":"Good","year":"2022"},{"score":63.39037041,"performance_group":"Good","year":"2020"},{"score":63.41899035,"performance_group":"Good","year":"2018"},{"score":47.7,"performance_group":"Fair","year":"2016"},{"score":null,"performance_group":"Poor","year":"2015"},{"score":18.9,"performance_group":"Very poor","year":"2014"},{"score":23.4,"performance_group":"Poor","year":"2013"}]},"who":{"display_name":"WHO","name":"WHO","performance_group":"Good","rank":20,"score":73.71127219499999,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://cdn.who.int/media/docs/default-source/documents/about-us/infodisclosurepolicy.pdf?sfvrsn=c1520275_11&download=true"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["http://open.who.int/2020-21/home"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"Always","sources":["https://www.who.int/about/accountability/procurement/principles-and-processes#:~:text=As%20a%20public%20organization%2C%20WHO,from%20WHO%20pre%2Dqualified%20manufacturers."],"score":50,"weight":0.01875,"format":"Document"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Audit":{"status":"Always","sources":["https://apps.who.int/gb/ebwha/pdf_files/WHA76/A76_22-en.pdf"],"score":50,"weight":0.01875,"format":"Document"}},"out_of":15,"weighted_score":9.99975},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":76.48992293,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.28990486,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":79.23553857,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":77.77444444,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":22.378197759},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":99.99666667,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":16.999433335},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":91.66333333,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":33.45911012,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always","Always"],"sources":[["https://ungm.in-tend.co.uk/who/aspx/Home"],["https://www.who.int/about/accountability/procurement/contract-awards"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":17.667391101},"Performance":{"indicators":{"Objectives":{"status":"Always","sources":["http://open.who.int/2022-23/country/NGA"],"score":50,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Always","sources":["https://www.who.int/about/what-we-do/evaluation/corporate-evaluations/programmatic-evaluations"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"Always","sources":["http://open.who.int/2022-23/country/NGA"],"score":33.33,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":6.6665}},"history":[{"score":69.3,"performance_group":"Good","year":"2022"}]},"ec-near":{"display_name":"EC-NEAR","name":"EC-NEAR","performance_group":"Good","rank":21,"score":73.27833315399998,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/international-institutions/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://euaidexplorer.ec.europa.eu/explore/recipients_en"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Always","sources":["https://commission.europa.eu/publications/strategic-plan-2020-2024-neighbourhood-and-enlargement-negotiations_en"],"score":50,"weight":0.01875,"format":"Document"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.187249999999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":84.96714439,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":54.4274611,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":92.23019928,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":92.66613376,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":85.58694444,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":21.995652604999997},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.48965802,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.82766378,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":98.25754651,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.43498061,"weight":0.025,"format":"IATI"},"Location":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Website"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":77.46838334,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":15.662626444},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.94724734,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":48.79901102,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":98.98040779,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["",""],"sources":[[],[]],"score":98.57086502666667,"weight":0.03,"format":["IATI","IATI"]}},"out_of":20,"weighted_score":18.921455196},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":54.91878505,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"","sources":[],"score":35.30819315,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":4.511348909}},"history":[{"score":64,"performance_group":"Good","year":"2022"},{"score":78.72528951,"performance_group":"Good","year":"2020"},{"score":76.46641366,"performance_group":"Good","year":"2018"},{"score":74.1,"performance_group":"Good","year":"2016"},{"score":null,"performance_group":"Good","year":"2015"},{"score":61.8,"performance_group":"Good","year":"2014"},{"score":48.1,"performance_group":"Fair","year":"2013"}]},"korea-koica":{"display_name":"Korea-KOICA","name":"Korea-KOICA","performance_group":"Good","rank":22,"score":71.794064604,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.oda.go.kr/opo/nmasc/main.do"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.999624999999998},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":["http://stat.koica.go.kr/ipm/os/acms/smrizeAreaList.do?lang=en"],"score":11.11,"weight":0.041666668,"format":"PDF"},"Project budget":{"status":"Always","sources":["https://www.oda.go.kr/opo/nnada/opoNnadaKoicaSportCurstatList.do"],"score":33.33,"weight":0.033333335,"format":"Website"},"Project budget document":{"status":"Always","sources":["https://www.oda.go.kr/opo/nnada/opoNnadaKoicaSportCurstatList.do"],"score":50,"weight":0.033333335,"format":"Document"},"Commitments":{"status":"","sources":[],"score":83.1070404,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":94.99666667,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":85.91473096,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":16.207726439},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":94.95358831,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":94.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":94.99666667,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":64.02720383,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":94.95358831,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":17.913032826},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":94.91050995,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":54.86625954,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":94.52949495,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always","Always"],"sources":[["https://www.koica.go.kr/koica_en/3501/subview.do#n"],["https://nebid.koica.go.kr/oep/elcn/pricPymntSttusList.do"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":16.840430338999997},"Performance":{"indicators":{"Objectives":{"status":"Always","sources":["https://www.oda.go.kr/opo/nnada/opoNnadaKoicaSportCurstatList.do"],"score":50,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"Always","sources":["https://www.koica.go.kr/koica_kr/976/subview.do]"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"Always","sources":["https://www.oda.go.kr/opo/ndaro/opoNdaroOdaSeMnList_60101.do"],"score":16.665,"weight":0.05,"format":"PDF"}},"out_of":20,"weighted_score":5.83325}},"history":[{"score":77.7,"performance_group":"Good","year":"2022"},{"score":70.7070545,"performance_group":"Good","year":"2020"},{"score":36.95046521,"performance_group":"Poor","year":"2018"},{"score":26.1,"performance_group":"Poor","year":"2016"},{"score":36.9,"performance_group":"Poor","year":"2014"},{"score":27.9,"performance_group":"Poor","year":"2013"}]},"ebrd---non-sov":{"display_name":"EBRD - Non-Sov.","name":"EBRD - Non-Sov.","performance_group":"Good","rank":23,"score":68.448820537,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.ebrd.com/project-finder"],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":98.03588235,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.462735294},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"PDF"},"Project budget":{"status":"Always","sources":["https://www.ebrd.com/work-with-us/projects/psd/54772.html"],"score":33.33,"weight":0.033333335,"format":"Website"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":99.89433871,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":39.93015349,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":65.35865183,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":12.116966444},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":96.51751599,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.74221374,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":97.5407956,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Document"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":16.376158478},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.89433871,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.89433871,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.033333,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0,"format":""},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.016667,"format":"IATI"},"Project procurement":{"status":["Always","Not Published"],"sources":[["https://www.ebrd.com/work-with-us/procurement/notices.html"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document",""]}},"out_of":20,"weighted_score":17.493293655000002},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":9.999666666}},"history":[{"score":60.6,"performance_group":"Good","year":"2022"}]},"ebrd---sovereign":{"display_name":"EBRD - Sovereign","name":"EBRD - Sovereign","performance_group":"Good","rank":24,"score":67.08878879100001,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.ebrd.com/project-finder"],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":78.42803922,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.095088235},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Website"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":99.10777778,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":91.70037037,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":62.51518519,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":12.610639444},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":98.21888889,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Document"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":16.43722778},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.10777778,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.10777778,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["","Always"],"sources":[[],["https://www.ebrd.com/work-with-us/projects/psd/51827.html"]],"score":66.66555555666667,"weight":0.03,"format":["IATI","Document"]}},"out_of":20,"weighted_score":15.946166666},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":9.999666666}},"history":[{"score":66.6,"performance_group":"Good","year":"2022"},{"score":69.10812354,"performance_group":"Good","year":"2020"}]},"us-usaid":{"display_name":"US-USAID","name":"US-USAID","performance_group":"Good","rank":25,"score":66.082414351,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://foreignassistance.gov/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.31639456,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.361744898},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":54.87195011,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"Always","sources":["https://www.foreignassistance.gov/"],"score":50,"weight":0.033333335,"format":"Machine readable"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":95.77628311,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":93.5527781,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":58.54187049,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":14.530038882000001},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.34671905,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":95.30165031,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":87.71197132,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":34.55990676,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":13.938966482999998},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":55.19712883,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":54.53538701,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always","Always"],"sources":[["https://www.usaid.gov/procurement-announcements"],["https://sam.gov/content/home"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":17.14882978},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":34.12473985,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":37.9319463,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Always","sources":["https://dec.usaid.gov/dec/content/evaluations.aspx"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":6.102834308}},"history":[{"score":65.2,"performance_group":"Good","year":"2022"},{"score":76.68375102,"performance_group":"Good","year":"2020"},{"score":68.78521379,"performance_group":"Good","year":"2018"},{"score":59.1,"performance_group":"Fair","year":"2016"},{"score":null,"performance_group":"Good","year":"2015"},{"score":40.3,"performance_group":"Fair","year":"2014"},{"score":44.3,"performance_group":"Fair","year":"2013"}]},"gates-foundation":{"display_name":"Gates Foundation","name":"Gates Foundation","performance_group":"Good","rank":26,"score":64.340355598,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.gatesfoundation.org/about/committed-grants"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"Always","sources":["https://www.gatesfoundation.org/about/how-we-work/grant-applicant-faq"],"score":50,"weight":0.01875,"format":"Document"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Always","sources":["https://www.gatesfoundation.org/our-work/places/africa/south-africa"],"score":50,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.499625},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.91321163,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":98.48752139,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":77.77444444,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":16.520404832},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":66.66333333,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":15.332783335999999},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":74.40378816,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["","Not Published"],"sources":[[],[]],"score":33.33222222333333,"weight":0.03,"format":["IATI",""]}},"out_of":20,"weighted_score":17.487542429999998},"Performance":{"indicators":{"Objectives":{"status":"Always","sources":["https://www.gatesfoundation.org/about/committed-grants/2023/11/inv-035199"],"score":50,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":2.5}},"history":[{"score":62,"performance_group":"Good","year":"2022"},{"score":57.8776568,"performance_group":"Fair","year":"2020"},{"score":47.31905059,"performance_group":"Fair","year":"2018"},{"score":46,"performance_group":"Fair","year":"2016"},{"score":46.6,"performance_group":"Fair","year":"2014"},{"score":18.1,"performance_group":"Very poor","year":"2013"}]},"netherlands-mfa":{"display_name":"Netherlands-MFA","name":"Netherlands-MFA","performance_group":"Good","rank":27,"score":63.50373801100001,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.nlontwikkelingssamenwerking.nl"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.4995625},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":["https://www.rijksoverheid.nl/documenten/begrotingen/2023/09/19/xvii-buitenlandse-handel-en-ontwikkelingssamenwerking-rijksbegroting-2024"],"score":5.555,"weight":0.041666668,"format":"PDF"},"Project budget":{"status":"","sources":[],"score":81.90660044,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":77.14257545,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":87.53,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":86.79573006,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":55.53618712,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":77.77444444,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":16.435764047},"Project attributes":{"indicators":{"Title":{"status":"Always","sources":["https://www.nlontwikkelingssamenwerking.nl/#/countries/et?tab=activities&countries=ET"],"score":50,"weight":0.01,"format":"Machine readable"},"Description":{"status":"","sources":[],"score":77.95729553,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":87.53,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":87.39650246,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":87.53,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":87.53,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":87.53,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":40.82985735,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":87.53,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":12.144128898000002},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":87.53,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":87.53,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":87.53,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":84.21218766,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":87.53,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":42.98913655,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":87.53,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always","Sometimes"],"sources":[["https://www.tenderned.nl/tenderned-tap/aankondigingen"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":14.389748361},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":77.3606841,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Always","sources":["https://www.nlontwikkelingssamenwerking.nl/en/#/activities/XM-DAC-7-PPR-4000006516?tab=documents&countries=ET"],"score":50,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Always","sources":["https://www.nlontwikkelingssamenwerking.nl/#/results/country-results/ethiopia"],"score":33.33,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":8.034534205}},"history":[{"score":67.2,"performance_group":"Good","year":"2022"},{"score":71.19931359,"performance_group":"Good","year":"2020"},{"score":70.14349832,"performance_group":"Good","year":"2018"},{"score":66.6,"performance_group":"Good","year":"2016"},{"score":null,"performance_group":"Good","year":"2015"},{"score":53.8,"performance_group":"Fair","year":"2014"},{"score":49.4,"performance_group":"Fair","year":"2013"}]},"unhcr":{"display_name":"UNHCR","name":"UNHCR","performance_group":"Good","rank":28,"score":63.364733320999996,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://data.unhcr.org/"],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.4995},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":54.55719735,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":66.66333333,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":71.95433862,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":96.29296296,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":15.751469907},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"Always","sources":["https://data.unhcr.org/en/country/afg"],"score":16.665,"weight":0.03,"format":"PDF"},"Planned dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"Always","sources":["https://data.unhcr.org/en/country/ssd"],"score":50,"weight":0.035,"format":"Machine readable"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":12.249616668999998},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":51.07899149,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always","Always"],"sources":[["https://www.ungm.org/Public/Notice"],["https://www.ungm.org/Public/ContractAward"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":16.521113163},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":60.19567164,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"Always","sources":["https://www.unhcr.org/uk/search?sm_tags[]=2023ce&sm_site_name[]=Global%20site"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"Always","sources":["https://data.unhcr.org/en/country/afg"],"score":16.665,"weight":0.05,"format":"PDF"}},"out_of":20,"weighted_score":6.343033582}}},"italy-aics":{"display_name":"Italy-AICS","name":"Italy-AICS","performance_group":"Good","rank":29,"score":61.38871547999999,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["http://openaid.aics.gov.it/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"Always","sources":["https://www.esteri.it/wp-content/uploads/2023/07/Delibere_IV_Riunione_CC_19072023.pdf"],"score":50,"weight":0.01875,"format":"Document"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":11.562125},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":39.07712644,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":37.38092593,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"","sources":[],"score":33.79296296,"weight":0.033333335,"format":"IATI"},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":93.77025157,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":93.41597884,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":77.77444444,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":16.814042406000002},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.96524976,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.27407791,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.17982721,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":72.11229988,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":50.84412429,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":14.470107123999998},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":95.27968553,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.68220126,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":43.9375217,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.68220126,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["","Not Published"],"sources":[[],[]],"score":11.132111663333333,"weight":0.03,"format":["IATI",""]}},"out_of":20,"weighted_score":16.061270388},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":49.62341123,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":2.481170562}},"history":[{"score":53.9,"performance_group":"Fair","year":"2022"},{"score":49.32726874,"performance_group":"Fair","year":"2020"},{"score":45.57170522,"performance_group":"Fair","year":"2018"},{"score":16,"performance_group":"Very poor","year":"2016"},{"score":null,"performance_group":"Very poor","year":"2015"},{"score":15.7,"performance_group":"Very poor","year":"2014"},{"score":10,"performance_group":"Very poor","year":"2013"}]},"new-zealand-mfat":{"display_name":"New Zealand-MFAT","name":"New Zealand-MFAT","performance_group":"Good","rank":30,"score":60.38764013,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.mfat.govt.nz/en/aid-and-development/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":87.87545455,"weight":0.01875,"format":"IATI"},"Audit":{"status":"Always","sources":["https://www.mfat.govt.nz/assets/About-us-Corporate/MFAT-corporate-publications/MFAT-Annual-Report-2023/MFAT-Annual-Report-2023.pdf"],"score":50,"weight":0.01875,"format":"Document"}},"out_of":15,"weighted_score":13.834914773},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":46.46131313,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":67.86608247,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":59.36380079,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":99.92475009,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":65.96565891,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":14.021241007},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.40577338,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":99.96190824,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":89.779553,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":35.14069959,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":14.109245633999997},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.70900036,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.63708378,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":63.17537936,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Sometimes","sources":[],"score":0,"weight":0.02,"format":"Website"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always","Sometimes"],"sources":[["https://www.gets.govt.nz/ExternalIndex.htm"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":13.743690111},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":58.43917031,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"","sources":[],"score":35.1318018,"weight":0.05,"format":"IATI"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":4.678548605}},"history":[{"score":64.4,"performance_group":"Good","year":"2022"},{"score":77.60272225,"performance_group":"Good","year":"2020"},{"score":31.071,"performance_group":"Poor","year":"2018"},{"score":45.1,"performance_group":"Fair","year":"2014"},{"score":47.8,"performance_group":"Fair","year":"2013"}]},"canada-gac":{"display_name":"Canada-GAC","name":"Canada-GAC","performance_group":"Good","rank":31,"score":60.083522101000014,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://w05.international.gc.ca/projectbrowser-banqueprojets/filter-filtre"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":46.77086022,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.001641128999998},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":47.398745,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":52.60175844,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":84.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":81.3555164,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":57.22109617,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":13.495458822},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":84.98097205,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":84.98097205,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":59.16333333,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":84.94958283,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":52.00896799,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":84.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":12.609742335},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":84.96527744,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":84.98097205,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":84.49443904,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":52.38918908,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":59.10531014,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always",""],"sources":[["https://canadabuys.canada.ca/en/tender-opportunities?search_filter=&status%5B87%5D=87&status%5B1920%5D=1920&record_per_page=50&current_tab=t&words=Global+affairs+Canada"],[]],"score":73.33111111333332,"weight":0.03,"format":["Document","IATI"]}},"out_of":20,"weighted_score":15.726846482000001},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":84.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":4.249833333}},"history":[{"score":71.1,"performance_group":"Good","year":"2022"},{"score":80.88461527,"performance_group":"Very good","year":"2020"},{"score":79.65586583,"performance_group":"Good","year":"2018"},{"score":76.3,"performance_group":"Good","year":"2016"},{"score":71.7,"performance_group":"Good","year":"2014"},{"score":62.6,"performance_group":"Good","year":"2013"}]},"world-bank-ifc":{"display_name":"World Bank-IFC","name":"World Bank-IFC","performance_group":"Fair","rank":32,"score":59.775871425000005,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://disclosures.ifc.org/project-mapping"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Always","sources":["https://documents.worldbank.org/en/publication/documents-reports/documentlist?docty_key=540613&srt=docdt&order=desc"],"score":50,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.812125},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"PDF"},"Project budget":{"status":"Always","sources":["https://disclosures.ifc.org/project-detail/SII/48249/dcm-aavas-green-housing"],"score":50,"weight":0.033333335,"format":"Machine readable"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":98.64506849,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"","sources":[],"score":34.00579909,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"PDF"}},"out_of":25,"weighted_score":6.088362557},"Project attributes":{"indicators":{"Title":{"status":"Always","sources":["https://disclosures.ifc.org/enterprise-search-results-home"],"score":50,"weight":0.01,"format":"Machine readable"},"Description":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":66.66333333,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":65.16561644,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":66.66333333,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":66.66333333,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"","sources":[],"score":66.66333333,"weight":0.035,"format":"IATI"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":15.651056165},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.0103653,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.033333,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Always","sources":[],"score":33.33,"weight":0,"format":"Website"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.016667,"format":""},"Project procurement":{"status":["Not Published","Sometimes"],"sources":[[],[]],"score":0,"weight":0.03,"format":["","Document"]}},"out_of":20,"weighted_score":15.303199849},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":98.42589041,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":9.921127854}},"history":[{"score":53,"performance_group":"Fair","year":"2022"},{"score":58.13292577,"performance_group":"Fair","year":"2020"},{"score":52.08483746,"performance_group":"Fair","year":"2018"},{"score":30.9,"performance_group":"Poor","year":"2016"},{"score":30.6,"performance_group":"Poor","year":"2014"},{"score":30.1,"performance_group":"Poor","year":"2013"}]},"finland-mfa":{"display_name":"Finland-MFA","name":"Finland-MFA","performance_group":"Fair","rank":33,"score":58.377900485,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://um.fi/development-cooperation-appropriations"],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.3745},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"","sources":[],"score":51.93119048,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":61.27673929,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":93.99273264,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":93.80189141,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":16.514622874},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.93311696,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":96.33196701,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":85.77817673,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":41.07398547,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":42.68469183,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":13.651542683999999},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"Always","sources":["https://um.fi/latest-funding-decisions/-/asset_publisher/SYmYYmTYh0sD/ahaKytInterventionType/id/102258779"],"score":33.33,"weight":0.02,"format":"Website"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":33.55174633,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always","Not Published"],"sources":[["https://www.hankintailmoitukset.fi/en/search"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document",""]}},"out_of":20,"weighted_score":13.837234927},"Performance":{"indicators":{"Objectives":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":0}},"history":[{"score":50.8,"performance_group":"Fair","year":"2022"},{"score":58.61382691,"performance_group":"Fair","year":"2020"},{"score":54.14210715,"performance_group":"Fair","year":"2018"},{"score":38.5,"performance_group":"Poor","year":"2016"},{"score":null,"performance_group":"Fair","year":"2015"},{"score":46.3,"performance_group":"Fair","year":"2014"},{"score":23,"performance_group":"Poor","year":"2013"}]},"idb-invest":{"display_name":"IDB Invest","name":"IDB Invest","performance_group":"Fair","rank":34,"score":57.65435015500001,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://idbinvest.org/en/access-information-policy"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://idbinvest.org/en/projects"],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":13.749374999999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"PDF"},"Project budget":{"status":"Always","sources":["https://idbinvest.org/en/projects/ruba-inmobiliaria"],"score":33.33,"weight":0.033333335,"format":"Website"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":77.65671082,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"","sources":[],"score":44.36752759,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":7.493150872999999},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":96.53175439,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":93.37385965,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":66.66333333,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.90836645,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":66.66333333,"weight":0.025,"format":"IATI"},"Location":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":11.598683664},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":77.12690949,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.033333,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0,"format":""},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":99.99666667,"weight":0.016667,"format":"IATI"},"Project procurement":{"status":["","Not Published"],"sources":[[],[]],"score":33.33222222333333,"weight":0.03,"format":["IATI",""]}},"out_of":20,"weighted_score":17.313307285},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Always","sources":["https://idbinvest.org/en/projects/ruba-inmobiliaria"],"score":50,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":7.499833333}},"history":[{"score":34.1,"performance_group":"Poor","year":"2022"}]},"france-afd":{"display_name":"France-AFD","name":"France-AFD","performance_group":"Fair","rank":35,"score":57.099969161,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://opendata.afd.fr/page/accueil/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":72.64623932,"weight":0.01875,"format":"IATI"},"Audit":{"status":"Always","sources":["https://www.afd.fr/en/ressources/2022-universal-registration-document"],"score":50,"weight":0.01875,"format":"Document"}},"out_of":15,"weighted_score":9.174366986999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":["https://www.budget.gouv.fr/budget-etat/ministere?ministere=62778&programme=63867"],"score":16.66666667,"weight":0.041666668,"format":"Machine readable"},"Project budget":{"status":"","sources":[],"score":97.53,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Always","sources":["https://opendata.afd.fr/explore/dataset/donnees-aide-au-developpement-afd/table/?disjunctive.pays_de_realisation&refine.region=Afrique+Sub-saharienne&location=2,14.40843,12.83908&basemap=6827db"],"score":50,"weight":0.033333335,"format":"Document"},"Commitments":{"status":"","sources":[],"score":70.73523013,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":63.88543933,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":78.50839958,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":["https://www.budget.gouv.fr/budget-etat/ministere?ministere=62778&programme=63867"],"score":16.66666667,"weight":0.041666668,"format":"Machine readable"}},"out_of":25,"weighted_score":13.410858504},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":97.17743724,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":94.91096234,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":96.7275,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":97.53,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":97.53,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":52.2508682,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":97.53,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":14.417558629},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":71.1717364,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":71.1717364,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":71.1717364,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":71.1717364,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":71.1717364,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":35.28756276,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always","Always"],"sources":[["https://afd.dgmarket.com/tenders/brandedNoticeList.do"],["https://tenders-afd.dgmarket.com/tenders/buyerList.do?showLocal=t"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":12.169794351},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":71.1717364,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Always","sources":["https://opendata.afd.fr/explore/dataset/evaluations-retrospectives-publiques-projet/table/"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"","sources":[],"score":37.37607741,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":7.92739069}},"history":[{"score":63.5,"performance_group":"Good","year":"2022"},{"score":58.51407109,"performance_group":"Fair","year":"2020"},{"score":46.45855074,"performance_group":"Fair","year":"2018"},{"score":45.2,"performance_group":"Fair","year":"2016"},{"score":null,"performance_group":"Fair","year":"2015"},{"score":24.7,"performance_group":"Poor","year":"2014"},{"score":16.3,"performance_group":"Very poor","year":"2013"}]},"eib---sovereign":{"display_name":"EIB - Sovereign","name":"EIB - Sovereign","performance_group":"Fair","rank":36,"score":55.051347287,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.eib.org/en/projects/loans/index."],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":11.874437499999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":["https://www.eib.org/attachments/lucalli/20220289_eib_group_operational_plan_2023_en.pdf"],"score":11.11,"weight":0.041666668,"format":"PDF"},"Project budget":{"status":"","sources":[],"score":66.66333333,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Document"},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":40.66830846,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Total organisation budget":{"status":"","sources":["https://www.eib.org/attachments/lucalli/20220289_eib_group_operational_plan_2023_en.pdf"],"score":11.11,"weight":0.041666668,"format":"PDF"}},"out_of":25,"weighted_score":7.836777323},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.81044693,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":98.81727498,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":39.84769088,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":66.66333333,"weight":0.025,"format":"IATI"},"Location":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Website"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Document"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":11.527499628999998},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":65.66830846,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always","Not Published"],"sources":[["https://etendering.ted.europa.eu/cft/cft-search.html?text=&caList=61&_caList=1&status=&startDateFrom=&startDateTo=&closingDateFrom=&closingDateTo=&procedureTypeOngoing=&_procedureTypeOngoing=1&procedureTypeForthcoming=&_procedureTypeForthcoming=1&confirm=Search#"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document",""]}},"out_of":20,"weighted_score":13.812966169},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":9.999666666}},"history":[{"score":56.2,"performance_group":"Fair","year":"2022"},{"score":58.8700221,"performance_group":"Fair","year":"2020"}]},"japan-jica":{"display_name":"Japan-JICA","name":"Japan-JICA","performance_group":"Fair","rank":37,"score":54.843458384000016,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www2.jica.go.jp/ja/oda/index.php?grant_aid[]=%E7%84%A1%E5%84%9F%E8%B3%87%E9%87%91%E5%8D%94%E5%8A%9B&search=%E6%A4%9C%E7%B4%A2]"],"score":33.33,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":13.124437499999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"","sources":[],"score":44.90407407,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":72.89834532,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"","sources":[],"score":67.94286089,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":10.358037564},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":74.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":74.99666667,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":68.85158273,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"Always","sources":["https://www2.jica.go.jp/ja/oda/index.php?grant_aid[]=%E7%84%A1%E5%84%9F%E8%B3%87%E9%87%91%E5%8D%94%E5%8A%9B&search=%E6%A4%9C%E7%B4%A2"],"score":33.33,"weight":0.01,"format":"Website"},"Current status":{"status":"","sources":[],"score":74.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":74.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":74.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":47.67178744,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"","sources":[],"score":0,"weight":0.035,"format":"IATI"},"Conditions":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Document"},"Unique ID":{"status":"","sources":[],"score":74.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":10.939961722},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":72.89834532,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":72.89834532,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":74.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":46.81920863,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":74.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Sometimes","sources":[],"score":0,"weight":0.02,"format":"Website"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always","Always"],"sources":[["https://www.jica.go.jp/Resource/announce/notice/"],["https://www.jica.go.jp/about/announce/proper/domestic/index.html]"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":11.028310312},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":74.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"","sources":[],"score":62.85755906,"weight":0.05,"format":"IATI"},"Reviews and evaluations":{"status":"Always","sources":["https://www.jica.go.jp/english/activities/evaluation/reports/2022/index.html"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"PDF"}},"out_of":20,"weighted_score":9.392711286}},"history":[{"score":22.9,"performance_group":"Poor","year":"2022"},{"score":49.32408238,"performance_group":"Fair","year":"2020"},{"score":38.80460827,"performance_group":"Poor","year":"2018"},{"score":44.2,"performance_group":"Fair","year":"2016"},{"score":37.2,"performance_group":"Poor","year":"2014"},{"score":23.5,"performance_group":"Poor","year":"2013"}]},"denmark-mfa":{"display_name":"Denmark-MFA","name":"Denmark-MFA","performance_group":"Fair","rank":38,"score":50.895732218000006,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://openaid.um.dk/","https://um.dk/om-os/kontakt/udenrigsministeriets-privatlivspolitik"],"score":33.33,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Audit":{"status":"Always","sources":["https://um.dk/en/-/media/websites/umdk/danish-site/danida/baeredygtig-vaekst/partnerskaber/danida-innovation-og-business-explorer/5-auditors-report-dibe-2022.ashx"],"score":50,"weight":0.01875,"format":"Document"}},"out_of":15,"weighted_score":6.562187499999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":["https://amg.um.dk/policies-and-strategies/priorities-of-the-danish-government"],"score":16.665,"weight":0.041666668,"format":"PDF"},"Project budget":{"status":"","sources":[],"score":55.99666667,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Document"},"Commitments":{"status":"","sources":[],"score":88.7081832,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":96.5759141,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":60.97988458,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":14.936258388999999},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":96.30399615,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":90.41434184,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":96.17507005,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":97.0412639,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.59947186,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":88.42216161,"weight":0.025,"format":"IATI"},"Location":{"status":"Always","sources":["https://um.dk/en/-/media/websites/umen/danida/about-danida/danida-transparency/council-for-development-policy/climate-change-adaption-and-stability-in-fragile-border-areas-of-mali.ashx"],"score":16.665,"weight":0.035,"format":"PDF"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Document"},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":12.89734065},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":96.54603674,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":76.01602991,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"Always","sources":["https://openaid.um.dk/organisations"],"score":33.33,"weight":0.02,"format":"Website"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":70.51497385,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":73.01901846,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always","Not Published"],"sources":[["https://um.dk/en/about-us/procurement/contracts/long/contract-opportunities"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document",""]}},"out_of":20,"weighted_score":14.483751661000001},"Performance":{"indicators":{"Objectives":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"","sources":[],"score":40.32388035,"weight":0.05,"format":"IATI"}},"out_of":20,"weighted_score":2.016194018}},"history":[{"score":52.9,"performance_group":"Fair","year":"2022"},{"score":48.56736035,"performance_group":"Fair","year":"2020"},{"score":49.25333991,"performance_group":"Fair","year":"2018"},{"score":64.7,"performance_group":"Good","year":"2016"},{"score":null,"performance_group":"Good","year":"2015"},{"score":49.6,"performance_group":"Fair","year":"2014"},{"score":50.7,"performance_group":"Fair","year":"2013"}]},"norway-mfa":{"display_name":"Norway-MFA","name":"Norway-MFA","performance_group":"Fair","rank":39,"score":50.518365295999985,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://resultater.norad.no/geography"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"Always","sources":["http://udtilskudd.regjeringen.no/#/en/country/details?country=51&year=2023"],"score":50,"weight":0.01875,"format":"Document"},"Procurement policy":{"status":"Always","sources":["https://www.regjeringen.no/no/dokumenter/veileder-offentlige-anskaffelser/id2581234/"],"score":50,"weight":0.01875,"format":"Document"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":10.624687499999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":["https://www.regjeringen.no/no/dokumenter/prop.-1-s-20232024/id2997797/"],"score":11.11,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"","sources":[],"score":71.76047433,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Document"},"Commitments":{"status":"","sources":[],"score":94.42149456,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":94.30851432,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":61.05000447,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":13.495609473},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":94.67826782,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":88.18703975,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":72.55583826,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":94.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":94.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":11.917685589000001},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":92.9527515,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":94.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":37.10834278,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always","Sometimes"],"sources":[["https://doffin.no/"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":14.480382734},"Performance":{"indicators":{"Objectives":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":0}},"history":[{"score":36.2,"performance_group":"Poor","year":"2022"},{"score":43.5239426,"performance_group":"Fair","year":"2020"},{"score":43.3298122,"performance_group":"Fair","year":"2018"},{"score":41.9,"performance_group":"Fair","year":"2016"},{"score":27.7,"performance_group":"Poor","year":"2014"},{"score":26.9,"performance_group":"Poor","year":"2013"}]},"us-state":{"display_name":"US-State","name":"US-State","performance_group":"Fair","rank":40,"score":48.642147601000005,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://foreignassistance.gov/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"","sources":[],"score":99.39606607,"weight":0.01875,"format":"IATI"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":14.363238739},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":54.47695341,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Machine readable"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":57.17231296,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":70.76617621,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":50.87342255,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":10.544946486},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"Always","sources":["https://www.foreignassistance.gov/agencies"],"score":33.33,"weight":0.03,"format":"Website"},"Planned dates":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":83.48623742,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":84.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":84.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":9.484462376},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":84.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always","Always"],"sources":[["https://grants.gov/search-grants","https://sam.gov/search/?index=_all&page=1&pageSize=25&sort=-modifiedDate&sfm%5BsimpleSearch%5D%5BkeywordRadio%5D=ALL&sfm%5BsimpleSearch%5D%5BkeywordTags%5D%5B0%5D%5Bkey%5D=%22department%20of%20state%22&sfm%5BsimpleSearch%5D%5BkeywordTags%5D%5B0%5D%5Bvalue%5D=%22department%20of%20state%22&sfm%5Bstatus%5D%5Bis_active%5D=true"],["https://sam.gov/search/?page=1&pageSize=25&sort=-modifiedDate&sfm%5BsimpleSearch%5D%5BkeywordRadio%5D=ALL&sfm%5Bstatus%5D%5Bis_active%5D=true&sfm%5BagencyPicker%5D%5B0%5D%5BorgKey%5D=100012062&sfm%5BagencyPicker%5D%5B0%5D%5BorgText%5D=019%20-%20STATE,%20DEPARTMENT%20OF&sfm%5BagencyPicker%5D%5B0%5D%5BlevelText%5D=Dept%20%2F%20Ind.%20Agency"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":14.249500000000001},"Performance":{"indicators":{"Objectives":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":0}},"history":[{"score":58,"performance_group":"Fair","year":"2022"},{"score":63.23712731,"performance_group":"Good","year":"2020"},{"score":58.25448269,"performance_group":"Fair","year":"2018"},{"score":53.9,"performance_group":"Fair","year":"2016"},{"score":null,"performance_group":"Fair","year":"2015"},{"score":38.8,"performance_group":"Poor","year":"2014"},{"score":22.1,"performance_group":"Poor","year":"2013"}]},"eib---non-sov":{"display_name":"EIB - Non-Sov.","name":"EIB - Non-Sov.","performance_group":"Fair","rank":41,"score":48.29914392700001,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.eib.org/attachments/strategies/eib_group_transparency_policy_2021_en.pdf"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.eib.org/en/projects/loans/index."],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":11.874437499999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"Always","sources":["https://euaidexplorer.ec.europa.eu/explore/recipients_en"],"score":33.33,"weight":0.033333335,"format":"Website"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":99.99666667,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Total organisation budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"PDF"}},"out_of":25,"weighted_score":4.444222444999999},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.38316973,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.58766871,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Website"},"Actual dates":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":66.66333333,"weight":0.025,"format":"IATI"},"Location":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Website"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":11.147861758999998},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":99.99666667,"weight":0.033333,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Always","sources":[],"score":33.33,"weight":0,"format":"Website"},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.016667,"format":""},"Project procurement":{"status":["Always","Not Published"],"sources":[["https://etendering.ted.europa.eu/cft/cft-search.html?text=&caList=61&_caList=1&status=&startDateFrom=&startDateTo=&closingDateFrom=&closingDateTo=&procedureTypeOngoing=&_procedureTypeOngoing=1&procedureTypeForthcoming=&_procedureTypeForthcoming=1&confirm=Search#"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document",""]}},"out_of":20,"weighted_score":15.83278889},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":99.99666667,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":4.999833333}},"history":[{"score":52.3,"performance_group":"Fair","year":"2022"}]},"ireland-irish-aid":{"display_name":"Ireland-Irish Aid","name":"Ireland-Irish Aid","performance_group":"Fair","rank":42,"score":47.892310865000006,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":100,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Organisation strategy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Always","sources":["https://www.irishaid.ie/what-we-do/countries-where-we-work/our-partner-countries/"],"score":50,"weight":0.01875,"format":"Document"},"Audit":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"}},"out_of":15,"weighted_score":12.187187499999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":99.99666667,"weight":0.041666668,"format":"IATI"},"Project budget":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Disbursements and expenditures":{"status":"","sources":[],"score":84.38470953,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":47.74927666,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":55.55222222,"weight":0.041666668,"format":"IATI"}},"out_of":25,"weighted_score":10.885670338},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":84.24536167,"weight":0.01,"format":"IATI"},"Description":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Planned dates":{"status":"","sources":[],"score":84.59211782,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":70.62044126,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":84.59211782,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":84.79439224,"weight":0.025,"format":"IATI"},"Location":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":84.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":8.335243526},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":33.73454884,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Always","Not Published"],"sources":[["https://www.etenders.gov.ie/epps/home.do]","https://www.irishaid.ie/about-us/procurement-opportunities/]"],[]],"score":16.666666666666668,"weight":0.03,"format":["Document",""]}},"out_of":20,"weighted_score":12.224257644000001},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":50.84118568,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"","sources":[],"score":34.35785146,"weight":0.05,"format":"IATI"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":4.259951857}},"history":[{"score":48,"performance_group":"Fair","year":"2022"},{"score":42.61343412,"performance_group":"Fair","year":"2020"},{"score":41.98553851,"performance_group":"Fair","year":"2018"},{"score":37,"performance_group":"Poor","year":"2016"},{"score":42.5,"performance_group":"Fair","year":"2014"},{"score":26.7,"performance_group":"Poor","year":"2013"}]},"switzerland-sdc":{"display_name":"Switzerland-SDC","name":"Switzerland-SDC","performance_group":"Fair","rank":43,"score":46.55646245000001,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://www.eda.admin.ch/deza/en/home/projekte/projekte.html"],"score":33.33,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Always","sources":[],"score":99.99666667,"weight":0.01875,"format":"Document"},"Annual report":{"status":"Always","sources":[],"score":99.99666667,"weight":0.01875,"format":"Document"},"Allocation policy":{"status":"Always","sources":["https://www.eda.admin.ch/content/dam/deza/en/documents/publikationen/Diverses/Broschuere_Strategie_IZA_Web_EN.pdf","https://www.eda.admin.ch/deza/en/home/strategie-21-24/finanzen.html"],"score":50,"weight":0.01875,"format":"Document"},"Procurement policy":{"status":"Always","sources":[],"score":99.99666667,"weight":0.01875,"format":"Document"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":57.57,"weight":0.01875,"format":""},"Audit":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""}},"out_of":15,"weighted_score":11.391499999999999},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Website"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"Not Published","sources":[],"score":44.59100676,"weight":0.033333335,"format":""},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":61.52907593,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"Not Published","sources":[],"score":47.16219167,"weight":0.033333335,"format":""},"Total organisation budget":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.041666668,"format":""}},"out_of":25,"weighted_score":9.275937311},"Project attributes":{"indicators":{"Title":{"status":"Not Published","sources":[],"score":62.29599203,"weight":0.01,"format":""},"Description":{"status":"Not Published","sources":[],"score":47.74498845,"weight":0.03,"format":""},"Planned dates":{"status":"Not Published","sources":[],"score":65.89725425,"weight":0.01,"format":""},"Actual dates":{"status":"Not Published","sources":[],"score":51.38914775,"weight":0.01,"format":""},"Current status":{"status":"Not Published","sources":[],"score":74.99666667,"weight":0.01,"format":""},"Contact details":{"status":"Not Published","sources":[],"score":74.99666667,"weight":0.01,"format":""},"Sectors":{"status":"Not Published","sources":[],"score":74.99666667,"weight":0.025,"format":""},"Location":{"status":"Not Published","sources":[],"score":33.51149197,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"Not Published","sources":[],"score":74.99352786,"weight":0.025,"format":""}},"out_of":24,"weighted_score":9.65076401},"Joining-up development data":{"indicators":{"Flow type":{"status":"Not Published","sources":[],"score":74.99666667,"weight":0.03,"format":""},"Aid type":{"status":"Not Published","sources":[],"score":74.99666667,"weight":0.03,"format":""},"Finance type":{"status":"Not Published","sources":[],"score":74.99666667,"weight":0.03,"format":""},"Tied aid status":{"status":"Not Published","sources":[],"score":74.89308591,"weight":0.03,"format":""},"Networked Data - Implementors":{"status":"Not Published","sources":[],"score":69.4482955,"weight":0.02,"format":""},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":42.64013209,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Sometimes","Sometimes"],"sources":[[],[]],"score":0,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":11.238261128999998},"Performance":{"indicators":{"Objectives":{"status":"Always","sources":["https://www.eda.admin.ch/deza/en/home/projekte/projekte.filterResults.html/content/dezaprojects/SDC/en/2018/7F10049/phase2?oldPagePath=/content/deza/en/home/projekte/projekte.html"],"score":50,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Always","sources":["https://www.eda.admin.ch/deza/en/home/results-impact/berichte/evaluationsberichte.html#"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":5}},"history":[{"score":47,"performance_group":"Fair","year":"2022"},{"score":61.11414984,"performance_group":"Good","year":"2020"},{"score":50.90336546,"performance_group":"Fair","year":"2018"},{"score":45.4,"performance_group":"Fair","year":"2016"},{"score":53.8,"performance_group":"Fair","year":"2014"},{"score":18.1,"performance_group":"Very poor","year":"2013"}]},"uae-mofaic":{"display_name":"UAE-MOFAIC","name":"UAE-MOFAIC","performance_group":"Fair","rank":44,"score":44.117043364999994,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://bayanat.ae/ar-ae","https://bayanat.ae/ar-AE/Data?themeid=12"],"score":33.33,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Annual report":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Allocation policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Procurement policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Audit":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""}},"out_of":15,"weighted_score":6.24975},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":63.08146199,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":92.83292398,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":72.4518638,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"}},"out_of":25,"weighted_score":7.612208706},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":87.42356725,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":94.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":94.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":12.122373687},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":94.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":94.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":69.16054859,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":94.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Not Published","Not Published"],"sources":[[],[]],"score":0,"weight":0.03,"format":["",""]}},"out_of":20,"weighted_score":15.632710972},"Performance":{"indicators":{"Objectives":{"status":"Always","sources":["https://bayanat.ae/ar-AE/Data"],"score":50,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":2.5}},"history":[{"score":1.1,"performance_group":"Very Poor","year":"2022"},{"score":17.729125,"performance_group":"Very poor","year":"2020"},{"score":1.875,"performance_group":"Very poor","year":"2018"},{"score":0,"performance_group":"Very poor","year":"2016"}]},"saudi-arabia-ksrelief":{"display_name":"Saudi Arabia-KSRelief","name":"Saudi Arabia-KSRelief","performance_group":"Fair","rank":45,"score":43.755061341,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://data.ksrelief.org/Projects/Search"],"score":66.66,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Annual report":{"status":"Always","sources":["https://www.ksrelief.org/Doc/PDF/1111"],"score":50,"weight":0.01875,"format":"Document"},"Allocation policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Procurement policy":{"status":"Always","sources":["https://www.mof.gov.sa/en/Documents/Government_Tenders_and_Procurement_Law.pdf"],"score":50,"weight":0.01875,"format":"Document"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Audit":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""}},"out_of":15,"weighted_score":3.7498125},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"","sources":[],"score":62.95962963,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Document"},"Commitments":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Disbursements and expenditures":{"status":"","sources":[],"score":99.18695007,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":59.15826234,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"}},"out_of":25,"weighted_score":7.3768284369999995},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":99.9302656,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":53.38312085,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":99.72676113,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":99.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"Always","sources":["https://data.ksrelief.org/Pages/contact"],"score":33.33,"weight":0.01,"format":"Website"},"Sectors":{"status":"","sources":[],"score":97.80543161,"weight":0.025,"format":"IATI"},"Location":{"status":"Always","sources":["https://data.ksrelief.org/Projects/ProjectDetails/8229"],"score":33.33,"weight":0.035,"format":"Website"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":99.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":12.973842578},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":97.29761134,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":99.18695007,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":98.647139,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":99.18695007,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":97.70246964,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":47.60536232,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Website"},"Project procurement":{"status":["Not Published","Not Published"],"sources":[[],[]],"score":0,"weight":0.03,"format":["",""]}},"out_of":20,"weighted_score":14.735716153},"Performance":{"indicators":{"Objectives":{"status":"","sources":[],"score":98.37723347,"weight":0.05,"format":"IATI"},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Results":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":4.918861673}},"history":[{"score":38.7,"performance_group":"Poor","year":"2022"},{"score":42.04365235,"performance_group":"Fair","year":"2020"}]},"us-hhs":{"display_name":"US-HHS","name":"US-HHS","performance_group":"Poor","rank":46,"score":34.756429143000005,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":["https://foreignassistance.gov/"],"score":100,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Always","sources":["https://www.hhs.gov/about/strategic-plan/2022-2026/index.html","https://www.state.gov/wp-content/uploads/2023/02/PEPFAR-2023-Country-and-Regional-Operational-Plan.pdf"],"score":50,"weight":0.01875,"format":"Document"},"Annual report":{"status":"Always","sources":["https://www.hhs.gov/about/strategic-plan/2022-2026/index.html","https://www.state.gov/wp-content/uploads/2023/02/PEPFAR-2023-Country-and-Regional-Operational-Plan.pdf"],"score":50,"weight":0.01875,"format":"Document"},"Allocation policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Procurement policy":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Audit":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"}},"out_of":15,"weighted_score":4.999875},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Website"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":68.22657916,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":79.48884381,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":59.16333333,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"PDF"}},"out_of":25,"weighted_score":6.895958887999999},"Project attributes":{"indicators":{"Title":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Website"},"Description":{"status":"Always","sources":["https://www.foreignassistance.gov/agencies"],"score":33.33,"weight":0.03,"format":"Website"},"Planned dates":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"","sources":[],"score":64.40398568,"weight":0.01,"format":"IATI"},"Current status":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":84.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":84.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":8.443673192},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":84.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":84.99666667,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"","sources":[],"score":33.37110316,"weight":0.02,"format":"IATI"},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":84.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Not Published","Always"],"sources":[[],["https://sam.gov/search/?index=_all&page=1&pageSize=25&sort=-modifiedDate&sfm%5BsimpleSearch%5D%5BkeywordRadio%5D=ALL&sfm%5BsimpleSearch%5D%5BkeywordTags%5D%5B0%5D%5Bkey%5D=%22US%20HHS%22&sfm%5BsimpleSearch%5D%5BkeywordTags%5D%5B0%5D%5Bvalue%5D=%22US%20HHS%22&sfm%5Bstatus%5D%5Bis_active%5D=true"]],"score":33.333333333333336,"weight":0.03,"format":["","Document"]}},"out_of":20,"weighted_score":14.416922063000001},"Performance":{"indicators":{"Objectives":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":0}}},"germany-ffo":{"display_name":"Germany-FFO","name":"Germany-FFO","performance_group":"Poor","rank":47,"score":27.898707957999996,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":33.33,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Annual report":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Allocation policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Procurement policy":{"status":"Always","sources":["https://www.auswaertiges-amt.de/de/newsroom/vergabeverfahren-des-auswaertigen-amts/216554"],"score":50,"weight":0.01875,"format":"Document"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Audit":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""}},"out_of":15,"weighted_score":1.5624375000000001},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"","sources":[],"score":46.42055118,"weight":0.033333335,"format":"IATI"},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"","sources":[],"score":59.84270772,"weight":0.033333335,"format":"IATI"},"Disbursements and expenditures":{"status":"","sources":[],"score":59.93557185,"weight":0.033333335,"format":"IATI"},"Budget Alignment":{"status":"","sources":[],"score":47.54481481,"weight":0.033333335,"format":"IATI"},"Total organisation budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"}},"out_of":25,"weighted_score":7.124788542},"Project attributes":{"indicators":{"Title":{"status":"","sources":[],"score":64.96128492,"weight":0.01,"format":"IATI"},"Description":{"status":"","sources":[],"score":63.28065177,"weight":0.03,"format":"IATI"},"Planned dates":{"status":"","sources":[],"score":64.99666667,"weight":0.01,"format":"IATI"},"Actual dates":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Current status":{"status":"","sources":[],"score":64.99666667,"weight":0.01,"format":"IATI"},"Contact details":{"status":"","sources":[],"score":64.99666667,"weight":0.01,"format":"IATI"},"Sectors":{"status":"","sources":[],"score":64.99666667,"weight":0.025,"format":"IATI"},"Location":{"status":"","sources":[],"score":49.16333333,"weight":0.035,"format":"IATI"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"","sources":[],"score":64.99666667,"weight":0.025,"format":"IATI"}},"out_of":24,"weighted_score":9.468482404},"Joining-up development data":{"indicators":{"Flow type":{"status":"","sources":[],"score":64.99666667,"weight":0.03,"format":"IATI"},"Aid type":{"status":"","sources":[],"score":64.99666667,"weight":0.03,"format":"IATI"},"Finance type":{"status":"","sources":[],"score":64.99666667,"weight":0.03,"format":"IATI"},"Tied aid status":{"status":"","sources":[],"score":64.99666667,"weight":0.03,"format":"IATI"},"Networked Data - Implementors":{"status":"","sources":[],"score":64.67164223,"weight":0.02,"format":"IATI"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"","sources":[],"score":64.99666667,"weight":0.01,"format":"IATI"},"Project procurement":{"status":["Sometimes","Not Published"],"sources":[[],[]],"score":0,"weight":0.03,"format":["Document",""]}},"out_of":20,"weighted_score":9.742999511999999},"Performance":{"indicators":{"Objectives":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":0}},"history":[{"score":37.2,"performance_group":"Poor","year":"2022"}]},"australia-dfat":{"display_name":"Australia-DFAT","name":"Australia-DFAT","performance_group":"Poor","rank":48,"score":27.167334923000006,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Annual report":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Allocation policy":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Procurement policy":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Always","sources":["https://www.dfat.gov.au/development/where-we-deliver-australias-development-program"],"score":50,"weight":0.01875,"format":"Document"},"Audit":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.01875,"format":""}},"out_of":15,"weighted_score":11.5620625},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"Not Published","sources":[],"score":50.53666667,"weight":0.041666668,"format":""},"Project budget":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"PDF"},"Project budget document":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Document"},"Commitments":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"Sometimes","sources":[],"score":0,"weight":0.033333335,"format":"Website"},"Total organisation budget":{"status":"Not Published","sources":[],"score":99.99666667,"weight":0.041666668,"format":""}},"out_of":25,"weighted_score":6.2722224230000005},"Project attributes":{"indicators":{"Title":{"status":"Always","sources":["https://www.dfat.gov.au/sites/default/files/partnerships-for-recovery-australias-covid-19-development-response.pdf"],"score":33.33,"weight":0.01,"format":"Website"},"Description":{"status":"Always","sources":["https://www.dfat.gov.au/sites/default/files/partnerships-for-recovery-australias-covid-19-development-response.pdf"],"score":16.665,"weight":0.03,"format":"PDF"},"Planned dates":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"PDF"},"Actual dates":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"PDF"},"Current status":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Contact details":{"status":"Always","sources":["https://www.dfat.gov.au/about-us"],"score":33.33,"weight":0.01,"format":"Website"},"Sectors":{"status":"Sometimes","sources":[],"score":0,"weight":0.025,"format":"Website"},"Location":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Website"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"Not Published","sources":[],"score":0,"weight":0.025,"format":""}},"out_of":24,"weighted_score":1.16655},"Joining-up development data":{"indicators":{"Flow type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Aid type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Finance type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Tied aid status":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Networked Data - Implementors":{"status":"Sometimes","sources":[],"score":0,"weight":0.02,"format":"Website"},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Always","Always"],"sources":[["https://www.tenders.gov.au/"],["https://www.tenders.gov.au/App/Show?Id=83394f7c-f573-36cf-38e8-b1d9f143682d"]],"score":50,"weight":0.03,"format":["Document","Document"]}},"out_of":20,"weighted_score":1.5},"Performance":{"indicators":{"Objectives":{"status":"Always","sources":["https://www.dfat.gov.au/development/topics/development-issues"],"score":50,"weight":0.05,"format":"Document"},"Pre-project impact appraisals":{"status":"Sometimes","sources":[],"score":0,"weight":0.05,"format":"Document"},"Reviews and evaluations":{"status":"Always","sources":["https://www.dfat.gov.au/development/performance-assessment/development-evaluation/program-evaluations"],"score":50,"weight":0.05,"format":"Document"},"Results":{"status":"Always","sources":["https://www.dfat.gov.au/publications/development/australias-development-program-tier-2-results-2021-2023"],"score":33.33,"weight":0.05,"format":"Website"}},"out_of":20,"weighted_score":6.6665}},"history":[{"score":41.9,"performance_group":"Fair","year":"2022"},{"score":51.82147421,"performance_group":"Fair","year":"2020"},{"score":57.3794051,"performance_group":"Fair","year":"2018"},{"score":49.9,"performance_group":"Fair","year":"2016"},{"score":45.9,"performance_group":"Fair","year":"2014"},{"score":43.1,"performance_group":"Fair","year":"2013"}]},"spain-aecid":{"display_name":"Spain-AECID","name":"Spain-AECID","performance_group":"Very poor","rank":49,"score":4.99975,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Annual report":{"status":"Sometimes","sources":[],"score":0,"weight":0.01875,"format":"Document"},"Allocation policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Procurement policy":{"status":"","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Sometimes","sources":[],"score":99.99666667,"weight":0.01875,"format":"IATI"},"Audit":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""}},"out_of":15,"weighted_score":4.99975},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Total organisation budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"}},"out_of":25,"weighted_score":0},"Project attributes":{"indicators":{"Title":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Description":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Planned dates":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Actual dates":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Current status":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Contact details":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Sectors":{"status":"Not Published","sources":[],"score":0,"weight":0.025,"format":""},"Location":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"","sources":[],"score":0,"weight":0.035,"format":"Document"},"Unique ID":{"status":"Not Published","sources":[],"score":0,"weight":0.025,"format":""}},"out_of":24,"weighted_score":0},"Joining-up development data":{"indicators":{"Flow type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Aid type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Finance type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Tied aid status":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Networked Data - Implementors":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Not Published","Not Published"],"sources":[[],[]],"score":0,"weight":0.03,"format":["",""]}},"out_of":20,"weighted_score":0},"Performance":{"indicators":{"Objectives":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":0}},"history":[{"score":41.1,"performance_group":"Fair","year":"2022"},{"score":57.81400834,"performance_group":"Fair","year":"2020"},{"score":35.09427517,"performance_group":"Poor","year":"2018"},{"score":46.2,"performance_group":"Fair","year":"2016"},{"score":null,"performance_group":"Fair","year":"2015"},{"score":50.6,"performance_group":"Fair","year":"2014"},{"score":17.4,"performance_group":"Very poor","year":"2013"}]},"china-mofcom":{"display_name":"China-CIDCA","name":"China-MOFCOM","performance_group":"Very poor","rank":50,"score":2.1873750000000003,"components":{"Organisational planning and commitments":{"indicators":{"Quality of FOI legislation":{"status":"","sources":["https://www.rti-rating.org/"],"score":66.66,"weight":0.01875,"format":""},"Accessibility":{"status":"","sources":[],"score":0,"weight":0.01875,"format":""},"Organisation strategy":{"status":"Always","sources":["http://en.cidca.gov.cn/2021-01/10/c_581228.htm"],"score":50,"weight":0.01875,"format":"Document"},"Annual report":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Allocation policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Procurement policy":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Strategy (country/sector) or Memorandum of Understanding":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""},"Audit":{"status":"Not Published","sources":[],"score":0,"weight":0.01875,"format":""}},"out_of":15,"weighted_score":2.1873750000000003},"Finance and budgets":{"indicators":{"Disaggregated budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"},"Project budget":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Project budget document":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Commitments":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Disbursements and expenditures":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Budget Alignment":{"status":"Not Published","sources":[],"score":0,"weight":0.033333335,"format":""},"Total organisation budget":{"status":"","sources":[],"score":0,"weight":0.041666668,"format":"Website"}},"out_of":25,"weighted_score":0},"Project attributes":{"indicators":{"Title":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Website"},"Description":{"status":"Sometimes","sources":[],"score":0,"weight":0.03,"format":"Website"},"Planned dates":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Website"},"Actual dates":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Website"},"Current status":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Website"},"Contact details":{"status":"Sometimes","sources":[],"score":0,"weight":0.01,"format":"Website"},"Sectors":{"status":"Not Published","sources":[],"score":0,"weight":0.025,"format":""},"Location":{"status":"Sometimes","sources":[],"score":0,"weight":0.035,"format":"Website"},"Location (with activity-scope exclusion)":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Conditions":{"status":"Not Published","sources":[],"score":0,"weight":0.035,"format":""},"Unique ID":{"status":"Not Published","sources":[],"score":0,"weight":0.025,"format":""}},"out_of":24,"weighted_score":0},"Joining-up development data":{"indicators":{"Flow type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Aid type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Finance type":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Tied aid status":{"status":"Not Published","sources":[],"score":0,"weight":0.03,"format":""},"Networked Data - Implementors":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Participating Orgs":{"status":"Not Published","sources":[],"score":0,"weight":0.02,"format":""},"Networked Data - Transactions with valid receiver":{"status":"Not Published","sources":[],"score":0,"weight":0.01,"format":""},"Project procurement":{"status":["Not Published","Not Published"],"sources":[[],[]],"score":0,"weight":0.03,"format":["",""]}},"out_of":20,"weighted_score":0},"Performance":{"indicators":{"Objectives":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Pre-project impact appraisals":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Reviews and evaluations":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""},"Results":{"status":"Not Published","sources":[],"score":0,"weight":0.05,"format":""}},"out_of":20,"weighted_score":0}},"history":[{"score":5,"performance_group":"Very Poor","year":"2022"},{"score":1.249875,"performance_group":"Very poor","year":"2020"},{"score":1.249875,"performance_group":"Very poor","year":"2018"},{"score":2.2,"performance_group":"Very poor","year":"2016"},{"score":2.2,"performance_group":"Very poor","year":"2014"},{"score":2.2,"performance_group":"Very poor","year":"2013"}]}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.css */ "./src/index.css");
/* harmony import */ var _serviceWorker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./serviceWorker */ "./src/serviceWorker.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./App */ "./src/App.js");







//const target = document.getElementById('ati-root');
const targets = document.querySelectorAll('.ati-root');
const defaultSettings = {
  'display': 'graph',
  // 'graph', // 'barchart', // 'table'
  'color': '#0000ff',
  'theme': '2024',
  'name': 'World',
  'height': 480,
  'width': 1080,
  'agency': 'Korea, KOICA'
};
Array.prototype.forEach.call(targets, target => {
  const id = target.dataset.id;
  const settings = !!id ? window.atiSettings[id] : defaultSettings;
  const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(target);
  root.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)((react__WEBPACK_IMPORTED_MODULE_0___default().StrictMode), null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_App__WEBPACK_IMPORTED_MODULE_4__["default"], {
    settings: settings,
    key: id
  })));
});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.

_serviceWorker__WEBPACK_IMPORTED_MODULE_3__.unregister();
})();

/******/ })()
;
//# sourceMappingURL=index.js.map