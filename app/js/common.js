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
	/*var UpButtonEnter = document.getElementById("UpButtonEnter");
	var DownButtonEnter = document.getElementById("DownButtonEnter");*/
	var ClearButton = document.getElementById("ClearButton");
	var NoiseButton = document.getElementById("NoiseButton");
	var FastBuild = document.getElementById("FastBuild");
	var valueOfU = document.getElementById("valueOfU");
	var valueOfU1 = document.getElementById("valueOfU1");
	var valueOfLiquid = document.getElementById("valueOfLiquid");
	var valueOfX = document.getElementById("valueOfX");

	class ElementPID {

		constructor(K, Td, Tu, X){
			this.K = K;
			this.Tu = Tu;
			this.Td = Td;
			this.X = X;

			this.Q_0 = 0;
			this.Q_1 = 0;
			this.Q_2 = 0;

			this._Y = 0;
			this._X = 0;
			this._Tkv = 1;
			this._time = 0;
			this._timer;
			this.e = [0];
			this.U = 50;
			this.U1 = 0;
			this._Uvs = 0;
			this._Xdif = 0;
		}

		set setU(U){
			if(U < 101 && U >= 0){
				this.U = U;
			} else {
				console.log("Error, You cannot change U, more than unit of 100 or less than 0");
			}
		}

		get getU(){
			return this.U;
		}

		set setU1(U){
			if(U < 101 && U >= 0){
				this.U1 = U;
			} else {
				console.log("Error, You cannot change U, more than unit of 100 or less than 0");
			}
		}

		get getU1(){
			return this.U1;
		}	

		set setQ_0(obj) {
			this.Q_0 = obj.K*(1 + obj.Td/this._Tkv);
		} 	

		get getQ_0() {
			return this.Q_0;
		}

		set setQ_1(obj){
			this.Q_1 = -obj.K*(1+ 2*(obj.Td/this._Tkv) -(this._Tkv/obj.Tu));
		}

		get getQ_1(){
			return this.Q_1;
		}

		set setQ_2(obj){
			this.Q_2 = obj.K*(obj.Td/this._Tkv);
		}

		get getQ_2(){
			return this.Q_2;
		}

		set setE(obj){
			this.e.push(obj.Yn - obj.X);
		}

		get getE(){
			return this.e[this.e.length-1];
		}

		set setY(Y1){
			this._Y = (this.K * this._Xdif * this._time + this.Tu * Y1) / (this.Tu + this._time); /*this.U*/;
			if(this._Y  < 0){
				this._Y = 0;
			} 

			valueOfLiquid.innerHTML = `<p><b>${this._Y} ml</b></p>`;
		}

		get getY(){
			return this._Y;
		}

		set setUvs(obj) {

			obj.Yn_1 == undefined ? obj.Yn_1 = 0 : '';
			obj.E_k == undefined ? obj.E_k = 0 : '';
			obj.E_k_1 == undefined ? obj.E_k_1 = 0 : '';
			obj.E_k_2 == undefined ? obj.E_k_2 = 0 : '';
			obj.Q_0 == Infinity ||  obj.Q_0 == -Infinity ? obj.Q_0 = 0 : '';
			obj.Q_1 == Infinity ||  obj.Q_1 == -Infinity ? obj.Q_1 = 0 : '';
			obj.Q_2 == Infinity ||  obj.Q_2 == -Infinity ? obj.Q_2 = 0 : '';

			this._Uvs = obj.Yn_1+obj.Q_0*obj.E_k + obj.Q_1*obj.E_k_1+ obj.Q_2*obj.E_k_2 ;/*+ this.Noise();*/
			valueOfU.innerHTML = `<p><b>U = ${newTank.getU}</b></p>`;
			
			if(this._Y > this.X + 0.25) {
				this.setU = this.getU - 1;
			} else if(this._Y < this.X - 0.25){
				this.setU = this.getU + 1;
			}
			this._Xdif = this.U - this._Uvs;
		}

		get getUvs() {
			return this._Uvs;
		}

		set setX(value){
			return this._X = value
		}

		get getX(){
			return this._X;
		}

		set settingX(X){
			this.X = X;
		}
		get gettingX(){
			return this.X;
		}



		// `creatingChart` create chart with using library Chart.js, `makechart` launch timer and create chart dynamically depend from real time

		creatingChart(){
		   this.setQ_0 = {K: this.K, Td: this.Td};
		   this.setQ_1 = {K: this.K, Td: this.Td, Tu: this.Tu};
		   this.setQ_2 = {K: this.K, Td: this.Td};
		   this.setUvs = {Yn_1: chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1], Q_0: this.getQ_0, E_k: this.getE, Q_1: this.getQ_1, E_k_1: this.e[this.e.length-2], Q_2: this.getQ_2, E_k_2: this.e[this.e.length-3]};
		   this.setY = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
/*		   this.setY = {Yn_1: chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1], Q_0: this.getQ_0, E_k: this.getE, Q_1: this.getQ_1, E_k_1: this.e[this.e.length-2], Q_2: this.getQ_2, E_k_2: this.e[this.e.length-3]};*/
   		   this.setE = {Yn: this.getY, X: this.X};
		   chart.data.datasets[0].data.push(this.getY);   // set new Point at the Y`s axe
		   // ------ ------ ------- --------- ------------ ------------- -------------- ----------    //
		   this.setX = chart.data.labels[chart.data.labels.length-1] + 1;
		   chart.data.labels.push(this.getX);								
		   chart.update();  
		   this._time = this._time + 100;
		}

		startTimer(){
			if(this._timer == undefined && chart.data.labels[chart.data.labels.length-1] < 45){
				this._timer = setInterval(() => {
					this.creatingChart();
				}, 200)
			} else {
				this.stopTimer();
				alert("Error");
			}	
		}

		stopTimer(){
			if(this._timer != undefined){
				clearInterval(this._timer); 																	// if timer exist i stop it
				this._timer = undefined;
			} else {
				console.log("timer is undefined");
			}
		}

		clearChart(){
			this.stopTimer();
			this._time = 0;
			this.setX = 0;
			this.setY = {U: this.U, K: this.K, Yn_1: 0};
			chart.data.datasets[0].data.splice(1, chart.data.datasets[0].data.length);
			chart.data.labels.splice(1, chart.data.labels.length);
			valueOfLiquid.innerHTML = `<p><b>${chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1]} ml</b></p>`;
		    chart.update();
		}

		Noise(){
			if(NoiseButton.defaultValue == `Noise On`){
				return ElementPID.randomNumber(-.05, .05);
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

/*				if(this.U > this.U1) {
					console.log("s1s");
					console.log(chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1]);
					while(chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] > 0){
						this.creatingChart()
					}
				} else {
					console.log("ss");*/
					while(chart.data.labels.length < 100 && chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] < 10000) {
						this.creatingChart()
					}
				//}
			}
		}

	}

	// Creating new object with name newTank

	var newTank = new ElementPID(0.2, 0.6, 1.2, 6);
	valueOfU.innerHTML = `<p><b>U = ${newTank.getU}</b></p>`;
	valueOfU1.innerHTML = `<p><b>U1 = ${newTank.getU1}</b></p>`;
	valueOfX.innerHTML = `<p><b>X = <input type="text" name="EnteringX" id='inputX' value=${newTank.gettingX}></b></p>`;
	var inputX = document.getElementById("inputX");
	valueOfLiquid.innerHTML = `<p><b>${chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1]} ml</b></p>`;
	var timer = '';   												// timer`ll use below
	var timer1 = '';   												// timer`ll use below

	// Buttons -----> They start functional of class`s methods

	StartButton.onclick = () => { newTank.startTimer(); } 

	StopButton.onclick = () => { newTank.stopTimer() }

	// UpButton.onclick = () => { newTank.setU = newTank.getU + 1; valueOfU.innerHTML = `<p><b>U = ${newTank.getU}</b></p>`; }

	UpButton.addEventListener("mousedown", () => {
		timer = setInterval(() => {
			newTank.setU = newTank.getU + 1; valueOfU.innerHTML = `<p><b>U = ${newTank.getU}</b></p>`;
		}, 50);
	})

	UpButton.addEventListener("mouseup", () => {
		timer != undefined ? clearInterval(timer) : console.log("timer doesn`t exist");
	});

	DownButton.addEventListener("mousedown", () => {
		timer = setInterval(() => {
			newTank.setU = newTank.getU - 1; valueOfU.innerHTML = `<p><b>U = ${newTank.getU}</b></p>`;
		}, 50);
	});

	DownButton.addEventListener("mouseup", () => {
		timer != undefined ? clearInterval(timer) : console.log("timer doesn`t exist");
	});	
/*
	inputX.addEventListener("change", () => {
		alert(inputX.value);
	});*/

	inputX.addEventListener("keypress", () => {
		setTimeout(() => {
			newTank.settingX = +inputX.value;
		}, 0);
	});


	UpButtonEnter.addEventListener("mousedown", () => {
		timer1 = setInterval(() => {
			newTank.setU1 = newTank.getU1 + 1; valueOfU1.innerHTML = `<p><b>U = ${newTank.getU1}</b></p>`;
		}, 50);
	})

	UpButtonEnter.addEventListener("mouseup", () => {
		timer1 != undefined ? clearInterval(timer1) : console.log("timer doesn`t exist");
	});

	DownButtonEnter.addEventListener("mousedown", () => {
		timer1 = setInterval(() => {
			newTank.setU1 = newTank.getU1 - 1; valueOfU1.innerHTML = `<p><b>U = ${newTank.getU1}</b></p>`;
		}, 50);
	});

	DownButtonEnter.addEventListener("mouseup", () => {
		timer1 != undefined ? clearInterval(timer1) : console.log("timer doesn`t exist");
	});

	// DownButton.onclick = () => {  newTank.setU = newTank.getU - 1; valueOfU.innerHTML = `<p><b>U = ${newTank.getU}</b></p>`; };

	ClearButton.onclick = () => { newTank.clearChart(); }

	NoiseButton.onclick = () => { 
		NoiseButton.defaultValue = (NoiseButton.defaultValue == `Noise On`) ? `Noise Off` : `Noise On`;
		newTank.Noise(); 
	}

	FastBuild.onclick = () => { newTank.fastBuild() }

});