(function( $ ) {
	'use strict';

	$(document).ready(() => {
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
					Results[ati].label = Results[ati].name + ' (' + Results[ati].score.toFixed(1) + ')';
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
				ctx.fillStyle = '#FFFFFF';
				ctx.fill();

				let xPlot = 0;
				let aggregate = padding;
				//console.log('groups', groups);
				groups.forEach((element, index) => {
					//console.log(element);
					//console.log(element.label);
					if(target && target.cat !== index){
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

	});


})( jQuery );
