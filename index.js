window.onload = function(){
  var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');
  var container, stats;
  var camera, scene, renderer, particle;
  var mouseX = 0, mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  // Face detection setup
  var htracker = new headtrackr.Tracker({altVideo : {ogv : "./media/capture5.ogv", mp4 : "./media/capture5.mp4"}});
  htracker.init(videoInput, canvasInput);
  htracker.start();

  init();
  animate();

  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x000000, 1, 5000 );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 1000;
    scene.add( camera );

    // set up camera controller
    headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 27, [0,0,1000], new THREE.Vector3(0,0,0), {damping : 0.5});

    //---------------- PLANES ----------------------

    //top wall
    plane1 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
    plane1.rotation.x = Math.PI/2;
    plane1.position.y = 250;
    plane1.position.z = 50-1500;
    // scene.add( plane1 );

    //left wall
    plane2 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
    plane2.rotation.y = Math.PI/2;
    plane2.position.x = -250;
    plane2.position.z = 50-1500;
    // scene.add( plane2 );

    //right wall
    plane3 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
    plane3.rotation.y = -Math.PI/2;
    plane3.position.x = 250;
    plane3.position.z = 50-1500;
    // scene.add( plane3 );

    //bottom wall
    plane4 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
    plane4.rotation.x = -Math.PI/2;
    plane4.position.y = -250;
    plane4.position.z = 50-1500;
    // scene.add( plane4 );

    var material = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(generateSprite()),
      blending: THREE.AdditiveBlending
    });

    for(var i = 0; i < 1000; i++){
      particle = new THREE.Sprite(material);
      initParticle(particle, i * 10);
      scene.add(particle);
    }

    // renderer = new THREE.WebGLRenderer({ clearAlpha: 1 });
    // renderer.setSize( window.innerWidth, window.innerHeight );

    renderer = new THREE.CanvasRenderer();
				renderer.setClearColor( 0x000040 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );
  }

  function generateSprite() {
		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 16;

		var context = canvas.getContext( '2d' );
		var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
		gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
		gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
		gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );

		return canvas;
	}

  function initParticle( particle, delay ) {
		var particle = this instanceof THREE.Sprite ? this : particle;
		var delay = delay !== undefined ? delay : 0;

		particle.position.set( 0, 0, 0 );
		particle.scale.x = particle.scale.y = Math.random() * 32 + 16;

		new TWEEN.Tween( particle )
			.delay( delay )
			.to( {}, 10000 )
			.onComplete( initParticle )
			.start();

		new TWEEN.Tween( particle.position )
			.delay( delay )
			.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
			.start();

		new TWEEN.Tween( particle.scale )
			.delay( delay )
			.to( { x: 0.01, y: 0.01 }, 10000 )
			.start();
	}

  function animate() {
    // renderer.render(scene, camera);
    render();

    requestAnimationFrame( animate );
  }

  function render() {
    TWEEN.update();

    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    camera.lookAt( scene.position );

    renderer.render( scene, camera );
  }

  document.addEventListener('headtrackingEvent', function(event) {
    scene.fog = new THREE.Fog( 0x000000, 1+(event.z*27), 3000+(event.z*27) );
  }, false);
}
