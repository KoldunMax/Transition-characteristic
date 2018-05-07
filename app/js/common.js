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
				lineTension: 0,
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
	var UpButtonEnter = document.getElementById("UpButtonEnter");
	var DownButtonEnter = document.getElementById("DownButtonEnter");
	var ClearButton = document.getElementById("ClearButton");
	var NoiseButton = document.getElementById("NoiseButton");
	var FastBuild = document.getElementById("FastBuild");
	var valueOfU = document.getElementById("valueOfU");
	var valueOfU1 = document.getElementById("valueOfU1");
	var valueOfLiquid = document.getElementById("valueOfLiquid");
	var valueOfX = document.getElementById("valueOfX");
	var checkbox = document.getElementById("checkbox");
	var inputX = document.getElementById("inputX");

	class Model {
		constructor(K, T) {
			this.K = K;
            this.T = T;
            this._y = 0;
            this._yprev = 0;
            this._time = 0;
		}

		getY(U, U1) {
			this._y = this.K * this._time * (U - U1) / this.T + this._yprev;
			if(this._y < 0) {
				this._y = 0;
			}
			this._yprev = this._y;

			return this._y;
		}
	}

	class PIDcontroler extends Model {
		constructor(Kp, Tu, Td){
			super(Kp, Tu);
			this.Td = Td;
			this.u = 0;
			this.u_1 = 0;
			this.e = 0;
			this.e_1 = 0;
			this.e_2 = 0;
		}

		getU(e) {
            this.u = this.u_1+this.K*(1+this.Td/this._time)*e-this.K*(1+2*(this.Td/this._time)-(this._time/this.T))*this.e_1+this.K*(this.Td/this._time)*this.e_2;
            this.u_1 = this.u;
            this.e_2 = this.e_1;
            this.e_1 = this.e;

            return this.u;
		}
	}


	var timerForChart = null;
	var timer = null;  					// for buttons up and Down U, U1
	var model = new Model(2.5, 9);
	var modelPID = new PIDcontroler(2, 10, 0);
	var y;
	var e;
	var u;

	checkbox.onclick = () => {
		if(checkbox.getAttribute("checked") == "checked"){
			valueOfX.style.display = "none";
			checkbox.setAttribute("checked", "")
			UpButtonEnter.style.opacity = 1;
			DownButtonEnter.style.opacity = 1;
		}	else {
			checkbox.setAttribute("checked", "checked");
			valueOfX.style.display = "block";
			UpButtonEnter.style.opacity = .2;
			DownButtonEnter.style.opacity = .2;

			modelPID._time += 1;
			y = modelPID.getY(+valueOfU.innerText, +valueOfU1.innerText);
		    e = y - (+inputX.value);
		    u = modelPID.getU(e);
		    valueOfU1.innerHTML = `<p><b>U1 = ${Math.round(u)}</b></p>`;
			chart.data.labels.push(modelPID._time);	
	 		chart.data.datasets[0].data.push(y); 
			chart.update();
		}
	}


	
	
	StartButton.addEventListener("click", () => {
		if(checkbox.getAttribute("checked") == "checked"){
			timerForChart = setInterval(() => {
			y = modelPID.getY(+valueOfU.innerText, u);
			e = y - (+inputX.value);
		    u = modelPID.getU(e);
		    valueOfU1.innerHTML = `<p><b>U1 = ${Math.round(u)}</b></p>`;
		    modelPID._time += 1;
			chart.data.labels.push(modelPID._time);	
	 		chart.data.datasets[0].data.push(y); 
			chart.update();
			}, 50);
		} else {
			timerForChart = setInterval(() => {
			model._time += 1;

			chart.data.labels.push(model._time);	
	 		chart.data.datasets[0].data.push(model.getY()); 
			chart.update();
			valueOfLiquid.innerHTML = `<p>${model.getY()}</p>`
		}, 1000)
		}
	});



	StopButton.onclick = function(){
		if(timerForChart) {
			clearInterval(timerForChart);
			timerForChart = null;
		} else {
			alert(`timerForChart is already working`);
		}
	}	


	UpButton.addEventListener("mousedown", () => {
		timer = setInterval(() => {
			let U = +valueOfU.innerText;
			valueOfU.innerHTML = `<p><b>U = ${++U}</b></p>`;
			valueOfU.innerText = U;
		}, 50);
	})

	UpButton.addEventListener("mouseup", () => {
		timer != undefined ? clearInterval(timer) : console.log("timer doesn`t exist");
	});

	DownButton.addEventListener("mousedown", () => {
		timer = setInterval(() => {
			let U = +valueOfU.innerText;
			valueOfU.innerHTML = `<p><b>U = ${--U}</b></p>`;
			valueOfU.innerText = U;
		}, 50);
	});

	DownButton.addEventListener("mouseup", () => {
		timer != undefined ? clearInterval(timer) : console.log("timer doesn`t exist");
	});	

});



