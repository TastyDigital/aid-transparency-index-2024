(function( $ ) {
	'use strict';

	$(function() {
		
		if( $('#nav-tab').length && $('#deep-dive').length ) {

			let url = location.href.replace(/\/$/, "");

			const scrollToTabs = () => {
				$('html, body').animate({
					scrollTop: $("#deep-dive").offset().top
				}, 1000);
			}

			if (location.hash) {
				const hash = url.split("#");
				$('#nav-tab a[href="#'+hash[1]+'"]').tab("show");
				url = location.href.replace(/\/#/, "#");
				history.replaceState(null, null, url);
				scrollToTabs();
			}

			$('a[data-toggle="tab"]').on("click", function() {
				let newUrl;
				const hash = $(this).attr("href");
				if(hash === "#organisational-planning-and-commitments") {
					newUrl = url.split("#")[0];
				} else {
					newUrl = url.split("#")[0] + hash;
				}
				newUrl += "/";
				history.replaceState(null, null, newUrl);
				if($(this).hasClass('tab-toggler')){
					$('#nav-tab a[href="'+hash+'"]').tab("show");
					scrollToTabs();

				}
			});
		}

		const canvas = $('#donor-graphic');
		if(canvas.length > 0){
			rankingGraph(canvas);
		}
		const canvas2 = $('#historic-performance-graphic');
		if(canvas2.length > 0){
			document.fonts.load('300 14px Montserrat').then(function() {
				// The font has loaded
				historicGraph(canvas2);
			}).catch(function(err) {
				console.error('Font loading failed', err);
			});

			
		}

	});


})( jQuery );



function rankingGraph(canvas){

		const ctx = canvas[0].getContext('2d', {
				alpha: false
			});
			const code = canvas.data( "code" );
			const colours = canvas.data( "colours" ).split(',');
			const path = canvas.data( "path" );
			const categories = ["Very good", "Good", "Fair", "Poor", "Very poor"];
			const sizeThreshold = 3;
			const groups = [];
			const spacer = 24;
			const padding = 10;
			const chartWidth = canvas.attr('width');
			const chartHeight = canvas.attr('height');
			const graphHeight = chartHeight-(2*padding);


			$.getJSON( path, function( Results ) {
				//console.log(colours[1]);


				let catCount = categories.length;
				let target = false;
				let data = [];

				Object.keys(Results).map((ati,index) => {
					Results[ati].label = Results[ati].display_name + ' (' + Results[ati].score.toFixed(1) + ')';
					Results[ati].id = index;
					Results[ati].code = ati;
					return data.push(Results[ati]);
				});

				let unitCount = data.length;

				// console.log(data);

				categories.map( (category, key) => {
					let groupData = data.filter( donor => donor['performance_group'] === category);
					let thisGroup = [];
					thisGroup['label'] = category;
					thisGroup['color'] = colours[0]; //default
					thisGroup['donors'] = [];
					groupData.map( donor => {
						if(donor.code === code) {
							target = {'cat':key, 'donor':donor.id, 'label': donor.label};
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

				const unit = ((chartWidth - ((catCount-1) * spacer) - (2 * padding))/unitCount).toFixed(2);

				// console.log('chartWidth',chartWidth);
				// console.log('catCount',catCount);
				//
				// console.log('spacer',spacer);
				// console.log('padding',padding);
				//
				// console.log('unit',unit)



				// draw background box
				ctx.beginPath();
				ctx.moveTo( 0,0);
				ctx.lineTo( chartWidth ,0);
				ctx.lineTo( chartWidth ,chartHeight);
				ctx.lineTo( 0 ,chartHeight);
				ctx.fillStyle = '#384147';
				ctx.fill();

				let xPlot = 0;
				let aggregate = padding;
				//console.log('groups', groups);
				groups.forEach((element, index) => {
					//console.log(element);
					//console.log(element.label);
					if(target && target.cat !== index){
						element.color = "rgba(255, 255, 255, 0.3)";
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
				//console.log('target',target)
				if(target){
					let color = colours[1];
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
					let textX = (target.x + text.width + padding > chartWidth) ? chartWidth - text.width - padding : target.x + 6;
					//let textY = (Number(target.y) - 18 < 0 ) ? 'hanging': 'bottom';
					// console.log('textX',textX);
					//console.log('posY',textY);// 56;
					//ctx.moveTo(posX, posY);
					ctx.textBaseline = 'bottom';
					ctx.fillText(target.label, textX, target.y-6)


				}
			});
}



function historicGraph(canvas){
	
		const ctx = canvas[0].getContext('2d', {
				alpha: false
			});
			const code = canvas.data( "code" );
			const name = canvas.data( "name" );
			const performance = canvas.data( "performance" );
			
			// console.log('name',name);
			// console.log('performance',performance);

			const spacer = 24;
			const dotRadius = 8;
			const padding = 18;
			const chartWidth = canvas.attr('width');
			const chartHeight = canvas.attr('height');
			const graphHeight = chartHeight - ( 2 * padding ) - spacer;
			const graphWidth = chartWidth - ( 2 * padding ) - spacer;
			const timeSteps = graphWidth / 11; // 2013 - 2024 (11 years)
			const strokeStyle = "rgba(255, 255, 255, 0.4)";
			const fontStyle = "300 14px 'Montserrat', sans-serif";
			
				// draw background box
				ctx.beginPath();
				ctx.moveTo( 0,0);
				ctx.lineTo( chartWidth ,0);
				ctx.lineTo( chartWidth ,chartHeight);
				ctx.lineTo( 0 ,chartHeight);
				ctx.fillStyle = '#384147';
				//ctx.fillStyle = "rgba(0,0,0, 0.2)";
				ctx.fill();

				// draw the y axis
				ctx.beginPath();
				ctx.moveTo( padding + spacer, padding);
				ctx.lineTo( padding + spacer, graphHeight + padding);
				ctx.strokeStyle = strokeStyle;
				ctx.lineWidth = 1;
				ctx.stroke();

				for(let i = 0; i <= 100; i+=20){
					let yPlot = (graphHeight + padding) - ((i / 100) * graphHeight);
					ctx.beginPath();
					ctx.moveTo( padding + spacer - 1, yPlot);
					ctx.lineTo( padding + spacer - dotRadius, yPlot);
					ctx.strokeStyle = strokeStyle;
					ctx.lineWidth = 1;
					ctx.stroke();

					ctx.font = fontStyle;
					ctx.textAlign = "right";
					ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
					ctx.fillText(i, padding + spacer - dotRadius - 3, yPlot + 4);
				}

				// draw the x axis
				ctx.beginPath();
				ctx.moveTo( padding + spacer, graphHeight + padding);
				ctx.lineTo( chartWidth - padding, graphHeight + padding);
				ctx.strokeStyle = strokeStyle;
				ctx.lineWidth = 1;
				ctx.stroke();

				// first plot the line graph
				ctx.beginPath();	
				let count = 0;
				for(let i = 2013; i <= 2024; i++){
					let element = performance[i];
					if(!element) continue;
					
					let score = element[0];
					let xPlot = Math.round((i - 2013) * timeSteps) + spacer + padding;
					let yPlot = (graphHeight + padding) - ((score / 100) * graphHeight);
					
					if(count === 0){
						ctx.moveTo(xPlot , yPlot);
					}else{
						ctx.lineTo(xPlot , yPlot);
					}

					count++;
				}
				ctx.strokeStyle = strokeStyle;
				ctx.lineWidth = 1;
				ctx.stroke();

				// now plot the dots
				for(let i = 2013; i <= 2024; i++){

					let xPlot = Math.round((i - 2013) * timeSteps) + spacer + padding;
					ctx.beginPath();
					ctx.moveTo(xPlot , graphHeight + padding + 1);
					ctx.lineTo(xPlot , graphHeight + padding + dotRadius);
					ctx.strokeStyle = strokeStyle;
					ctx.lineWidth = 1;
					ctx.stroke();

					ctx.font = fontStyle;
					ctx.textAlign = "center";
					ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
					if(i % 2 === 0){
						ctx.fillText(i, xPlot, graphHeight + padding + (2 * dotRadius) + 6);
					}
					

					let element = performance[i];
					if(!element) continue;

					let [score, color] = element;
					let yPlot = (graphHeight + padding) - ((score / 100) * graphHeight);
					
					ctx.fillStyle = "#FFF";
					ctx.fillText(`${score}`, xPlot, yPlot -  (2 * dotRadius));

					ctx.beginPath();
					ctx.arc(xPlot , yPlot, dotRadius, 0, 2 * Math.PI);
					ctx.fillStyle = color;
					ctx.fill();


				}

				// TODO: add years and scores with tick marks to axis increments, also display related scores next to dots.


}
