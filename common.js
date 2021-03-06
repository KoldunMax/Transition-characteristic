$(function() {

	//SVG Fallback
	if(!Modernizr.svg) {
		$("img[src*='svg']").attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	};

	//E-mail Ajax Send
	//Documentation & Example: https://github.com/agragregra/uniMail
	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Thank you!");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});

	var ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
	    // The type of chart we want to create
	    type: 'line',

	    // The data for our dataset
	   data: {
		labels : [0],
		datasets : [
			{
				label: "Переходная характеристика",
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : [0]
			}
		]
	},

	    // Configuration options go here
	    options: {
	    	responsive: true,
		    maintainAspectRatio: false,
		    scales: {
		        yAxes: [{
		            ticks: {
		                beginAtZero:true
		            }
		        }]
		    }
	    }
	});

	$('img.img-svg').each(function() {
	    var $img = $(this);
	    var imgID = $img.attr('id');
	    var imgClass = $img.attr('class');
	    var imgURL = $img.attr('src');

	    $.get(imgURL, function(data) {
	        // Get the SVG tag, ignore the rest
	        var $svg = $(data).find('svg');

	        // Add replaced image's ID to the new SVG
	        if (typeof imgID !== 'undefined') {
	            $svg = $svg.attr('id', imgID);
	        }
	        // Add replaced image's classes to the new SVG
	        if (typeof imgClass !== 'undefined') {
	            $svg = $svg.attr('class', imgClass + ' replaced-svg');
	        }

	        // Remove any invalid XML tags as per http://validator.w3.org
	        $svg = $svg.removeAttr('xmlns:a');

	        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
	        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
	            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
	        }

	        // Replace image with new SVG
	        $img.replaceWith($svg);

	    }, 'xml');

	});

////////////--------------------------------------LAB-work NUMBER 2---------------------------------///////////////////

	// get buttons by button`s id

	var StartButton = document.getElementById("StartButton");
	var StopButton = document.getElementById("StopButton");
	var UpButton = document.getElementById("UpButton");
	var DownButton = document.getElementById("DownButton");
	var ClearButton = document.getElementById("ClearButton");
	var NoiseButton = document.getElementById("NoiseButton");
	var FastBuild = document.getElementById("FastBuild");

	class ElementAP {

		constructor(K, T, U, time){
			this.K = K;
			this.T = T;
			this.U = U;
			this.timer;
			this.time = 10;
			this.noise = 0;
		}

		set setU(U){
			this.U = U;
		}

		get getU(){
			return this.U;
		}

		// `creatingChart` create chart with using library Chart.js, `makechart` launch timer and create chart dynamically depend from real time

		creatingChart(){
		   chart.data.datasets[0].data.push(this.U*this.K*(1 - Math.pow(Math.exp(1), -this.time/this.T)) + this.Noise());   // set new Point at the Y`s axe
		   var valOfLabel = chart.data.labels[chart.data.labels.length-1] + 1;
		   chart.data.labels.push(valOfLabel); 	 															// set new Point at the X`s axe
		   chart.update();  
		   this.time = this.time + 100;
		}

		startTimer(){
			if(this.timer == undefined){
				this.timer = setInterval(() => {
					this.creatingChart();
				}, 1000)
			}	
		}

		stopTimer(){
			if(this.timer != undefined){
				clearInterval(this.timer); 																	// if timer exist i stop it
				this.timer = undefined;
			} else {
				console.log("timer is undefined");
			}
		}

		clearChart(){
			this.stopTimer();
			this.time = 10;
			chart.data.datasets[0].data.splice(1, chart.data.datasets[0].data.length);
			chart.data.labels.splice(1, chart.data.labels.length);
		    chart.update();
		}

		Noise(){
			if(NoiseButton.defaultValue == `Noise On`){
				return ElementAP.randomNumber(0, 100)/Math.pow(10, 6);
			} else {
				return 0;
			}
		}

		static randomNumber(min, max){
			var rand = min - 0.5 + Math.random() * (max - min + 1)
		    rand = Math.round(rand);
		    return rand;
		}

		fastBuild(){
			if(chart.data.labels[chart.data.labels.length-1] == 0){
				for(let i = 0; i < 121; i++){
					this.creatingChart()
				}
			}
		}

	}

	// Creating new object with name newTank

	var newTank = new ElementAP(9*Math.pow(10, -4), 1087, 1);

	// Buttons -----> They start functional of class`s methods

	StartButton.onclick = () => { newTank.startTimer(); } 

	StopButton.onclick = () => { newTank.stopTimer() }

	UpButton.onclick = () => { newTank.setU = newTank.getU + 1; }

	DownButton.onclick = () => { newTank.setU = newTank.getU - 1; };

	ClearButton.onclick = () => { newTank.clearChart(); }

	NoiseButton.onclick = () => { 
		NoiseButton.defaultValue = (NoiseButton.defaultValue == `Noise On`) ? `Noise Off` : `Noise On`;
		newTank.Noise(); 
	}

	FastBuild.onclick = () => { newTank.fastBuild() }

});
