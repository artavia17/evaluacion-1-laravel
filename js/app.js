'user strict'

function initCanvas(){

	var canvas = document.querySelector('#my_canvas');
	var ctx = canvas.getContext('2d');
	var backgrondImage = new Image();
	var naveImage = new Image();
	var enemiespic1 = new Image();
	var enemiespic2 = new Image();

	// Colocando las imagenes
	backgrondImage.src = "images/fondo.png";
	naveImage.src = "images/avion.png";
	enemiespic1.src = "images/ataque.png";
	enemiespic2.src = "images/ataque.png";

	// width and height (canvas)
    var cW = ctx.canvas.width; // 700px 
    var cH = ctx.canvas.height;// 600px

	// Altura y ancho de canvas

	var enemyTemplate = function(options){
		return {
			id: options.id || '',
			x: options.x || '',
			y: options.y || '',
			w: options.w || '',
			h: options.h || '',
			image: options.image || enemiespic1
		}
	}

	var enemies = [
		new enemyTemplate({id: "enemy1", x: 100, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
                   new enemyTemplate({id: "enemy4", x:100,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy5", x:225,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy6", x:350,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),

                   // Segundo grupo de enemigos
                   new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 })
	];

	var renderEnemies = function(enemyList){
		for(var i = 0; i< enemyList.length; i++){
			var enemy = enemyList[i];
			ctx.drawImage(enemy.image, enemy.x, enemy.y += .5, enemy.w, enemy.h);

			launcher.hitDetectLowerlevel(enemy);
		}
	}

	// Mostrar fondo en canvas

	function Launcher(){
		this.y = 500,
		this.x = cW*.5 - 25,
		this.w = 100,
		this.h = 100,
		this.direccion,
		this.bg = 'white',
		this.misiles = [];

		this.gameStatus = {
			over: false,
			message: "",
			fillstyle: 'red',
			font: 'italic bold 36px Arial, sans-serif',
		}

		this.render = function(){

			if(this.direccion === 'left'){
				this.x -= 5;
			}else if(this.direccion == 'right'){
				this.x += 5;
			}else if(this.direccion === 'downArrow'){
				this.y += 5;
			}else if(this.direccion === 'upArrow'){
				this.y -= 5;
			}

			ctx.fillStyle = this.bg;
			ctx.drawImage(backgrondImage, 0, 0);
			ctx.drawImage(naveImage, this.x, this.y, 100, 90);

			// Tirar las balas

			for(var i=0; i < this.misiles.length; i++){

				// Variable misil

				var m = this.misiles[i];
				ctx.fillRect(m.x, m.y-=5, m.w, m.h);


				// El primer parametro es el misil
				this.hitDetect(m, i);


				if(m.y <= 0){
					// Se remueve un elemento, por eso se pone 1
					this.misiles.splice(i, 1);
				}
			}


			if(enemies.length === 0){
				clearInterval(animateInterval);
				ctx.fillStyle = 'yellow';
				ctx.font = this.gameStatus.font;
				ctx.fillText('Tu ganaste', cW * .5 - 80, 50);
			}

		}


		this.hitDetect = function(m, mi){


			for(var i=0;  i < enemies.length; i++){

				var e = enemies[i];

				if(	m.x <= e.x + e.w && m.x + m.w >= e.x &&
					m.y >= e.y && m.y <= e.y + e.h){
					// Remover un elemento de un arreglo
					enemies.splice(i, 1);
					console.log("Destruido el" + " " + e.id);
				}

			}

		}

		this.hitDetectLowerlevel = function(enemy){


			if(enemy.y > 550){
				this.gameStatus.over = true;
				this.gameStatus.message = 'Ya paso el enemigo';
			}

			// Cuando el avion enemigo llegue al limite el juego se tiene que terminar

			if((enemy.y < this.y+25 && enemy.y > this.y - 25) && (enemy.x < this.x+45 && enemy.x > this.x - 45)){
				this.gameStatus.over = true;
				this.gameStatus.message = "Tu moriste";
			}

			// Para cuando el avion enemigo llega al limite

			if(this.gameStatus.over === true){
				clearInterval(animateInterval);
				ctx.fillStyle = this.gameStatus.fillStyle;
				ctx.font = this.gameStatus.font;

				ctx.fillText(this.gameStatus.message, cW*0.5-80, 50)
			}


		}


	}

	var launcher = new Launcher();


	function animate(){
		ctx.clearRect(0,0, cW, cH);
		launcher.render();
		renderEnemies(enemies);
	}

	var animateInterval = setInterval(animate, 6);


	// ---------------------------------Precionar teclas------------------------------------------------


	document.addEventListener('keydown', function(event){

		if(event.keyCode === 37){
			launcher.direccion = 'left';

			if(launcher.x < cW*.2 -130){
				launcher.x += 0;
				launcher.direccion = '';
			}

		}

	});

	document.addEventListener('keydown', function(event){

		if(event.keyCode === 39){
			launcher.direccion = 'right';
			if(launcher.x > cW-110){
				launcher.x -= 0;
				launcher.direccion = '';
			}

		}

	});

	document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) // up arrow
         {
           launcher.direccion = 'downArrow';  
           if(launcher.y > cH-110){
              launcher.y -= 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keydown', function(event){
    	if(event.keyCode === 32){

    		// El metodo push agrega lo que uno desee, en este caso se va agregar las balas
    		launcher.misiles.push({
    			// Esta operacion + launcher.w*.5 se realiza para arreglar el dispara, y si se quita dispara pero torcido
    			x: launcher.x + launcher.w*.5,
    			y: launcher.y,
    			w: 3,
    			h: 10
    		})
    	}
    })

    // ---------------------------------------Dejar de precionar teclas---------------------------------------


	document.addEventListener('keyup', function(event){

		if(event.keyCode === 37){
			
			launcher.x +=0;		
			launcher.direccion = '';


		}

	});
	document.addEventListener('keyup', function(event){

		if(event.keyCode === 39){
			
			launcher.x -=0;		
			launcher.direccion = '';


		}

	});

	document.addEventListener('keyup', function(event){

		if(event.keyCode === 38){
			
			launcher.y -=0;		
			launcher.direccion = '';


		}

	});

	document.addEventListener('keyup', function(event){

		if(event.keyCode === 40){
			
			launcher.y +=0;		
			launcher.direccion = '';


		}

	});

	document.addEventListener('keydown', function(event){

		if(event.keyCode === 80){
			
			location.reload();


		}

	});


}	


window.addEventListener("load", function(){
	initCanvas();
})