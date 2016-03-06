// window.onload = function(){
//   var videoInput = document.getElementById('inputVideo');
//   var canvasInput = document.getElementById('inputCanvas');
//
//   var htracker = new headtrackr.Tracker();
//   htracker.init(videoInput, canvasInput);
//   htracker.start();
//
//   var container, stats;
//   var camera, scene, renderer;
//   var plane;
//
//   function init() {
//
//     container = document.createElement( 'div' );
//     document.body.appendChild( container );
//
//     scene = new THREE.Scene();
//     scene.fog = new THREE.Fog( 0x000000, 1, 5000 );
//
//     camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
//     camera.position.z = 6000;
//     scene.add( camera );
//
//     // Planes
//
//     //top wall
//     plane1 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
//     plane1.rotation.x = Math.PI/2;
//     plane1.position.y = 250;
//     plane1.position.z = 50-1500;
//     scene.add( plane1 );
//
//     //left wall
//     plane2 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
//     plane2.rotation.y = Math.PI/2;
//     plane2.position.x = -250;
//     plane2.position.z = 50-1500;
//     scene.add( plane2 );
//
//     //right wall
//     plane3 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
//     plane3.rotation.y = -Math.PI/2;
//     plane3.position.x = 250;
//     plane3.position.z = 50-1500;
//     scene.add( plane3 );
//
//     //bottom wall
//     plane4 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
//     plane4.rotation.x = -Math.PI/2;
//     plane4.position.y = -250;
//     plane4.position.z = 50-1500;
//     scene.add( plane4 );
//
//     // Create sprites with lines
//
//     var placeTarget = function(x,y,z) {
//
//         // Cylinder
//         var cylinder = new THREE.Mesh( new THREE.CylinderGeometry(30,30,1,20,1,false), new THREE.MeshBasicMaterial( { color : 0xeeeeee} ) );
//         cylinder.position.x = x;
//         cylinder.rotation.x = Math.PI/2;
//         cylinder.position.y = y;
//         cylinder.position.z = z;
//         scene.add( cylinder );
//
//         var geometry = new THREE.Geometry();
//         geometry.vertices.push( new THREE.Vector3( 0, 0, -80000 ) );
//         geometry.vertices.push( new THREE.Vector3( 0, 0, z ) );
//         var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xeeeeee } ) );
//         line.position.x = x;
//         line.position.y = y;
//         scene.add( line );
//     }
//
//     placeTarget(-150,-150,-550);
//     placeTarget(0,-150,-200);
//     placeTarget(100,0,500);
//     placeTarget(-150,100,0);
//     placeTarget(150,-100,-1050);
//     placeTarget(50,0,1100);
//     placeTarget(-50,-50,600);
//     placeTarget(0,150,-2100);
//     placeTarget(-130,0,-700);
//
//     renderer = new THREE.WebGLRenderer({ clearAlpha: 1 });
//     renderer.setSize( window.innerWidth, window.innerHeight );
//
//     container.appendChild( renderer.domElement );
//   }
//
//   function animate() {
//     renderer.render(scene, camera);
//
//     requestAnimationFrame( animate );
//   }
//
//   init();
//   animate();
//
//   // video styling
//   videoInput.style.position = 'absolute';
//   videoInput.style.top = '0px';
//   videoInput.style.zIndex = '100001';
//   videoInput.style.display = 'block';
//
//   // set up camera controller
//   headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 27, [0,0,50], new THREE.Vector3(0,0,0), {damping : 0.5});
//
//   // Face detection setup
//   var htracker = new headtrackr.Tracker({altVideo : {ogv : "./media/capture5.ogv", mp4 : "./media/capture5.mp4"}});
//   htracker.init(videoInput, canvasInput);
//   htracker.start();
//
//   document.addEventListener('headtrackingEvent', function(event) {
//     scene.fog = new THREE.Fog( 0x000000, 1+(event.z*27), 3000+(event.z*27) );
//   }, false);
// }



// Test with moving particles

window.onload = function(){
  var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');

  var htracker = new headtrackr.Tracker();
  htracker.init(videoInput, canvasInput);
  htracker.start();

  var container, stats;
  var camera, scene, renderer, particle;
  var mouseX = 0, mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  init();
  animate();

  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1, 5000 );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 1000;
    scene.add( camera );

    //---------------- PLANES ----------------------

    //top wall
    plane1 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
    plane1.rotation.x = Math.PI/2;
    plane1.position.y = 250;
    plane1.position.z = 50-1500;
    scene.add( plane1 );

    //left wall
    plane2 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
    plane2.rotation.y = Math.PI/2;
    plane2.position.x = -250;
    plane2.position.z = 50-1500;
    scene.add( plane2 );

    //right wall
    plane3 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
    plane3.rotation.y = -Math.PI/2;
    plane3.position.x = 250;
    plane3.position.z = 50-1500;
    scene.add( plane3 );

    //bottom wall
    plane4 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
    plane4.rotation.x = -Math.PI/2;
    plane4.position.y = -250;
    plane4.position.z = 50-1500;
    scene.add( plane4 );

    // Create sprites with lines

    var placeTarget = function(x,y,z) {

        // Cylinder
        var cylinder = new THREE.Mesh( new THREE.CylinderGeometry(30,30,1,20,1,false), new THREE.MeshBasicMaterial( { color : 0xeeeeee} ) );
        cylinder.position.x = x;
        cylinder.rotation.x = Math.PI/2;
        cylinder.position.y = y;
        cylinder.position.z = z;
        scene.add( cylinder );

        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( 0, 0, -80000 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, z ) );
        var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xeeeeee } ) );
        line.position.x = x;
        line.position.y = y;
        scene.add( line );
    }

    // placeTarget(-150,-150,-550);
    // placeTarget(0,-150,-200);
    // placeTarget(100,0,500);
    // placeTarget(-150,100,0);
    // placeTarget(150,-100,-1050);
    // placeTarget(50,0,1100);
    // placeTarget(-50,-50,600);
    // placeTarget(0,150,-2100);
    // placeTarget(-130,0,-700);

    //-------------------- END ----------------------

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

  // video styling
  videoInput.style.position = 'absolute';
  videoInput.style.top = '0px';
  videoInput.style.zIndex = '100001';
  videoInput.style.display = 'block';

  // set up camera controller
  headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 27, [0,0,50], new THREE.Vector3(0,0,0), {damping : 0.5});

  // Face detection setup
  var htracker = new headtrackr.Tracker({altVideo : {ogv : "./media/capture5.ogv", mp4 : "./media/capture5.mp4"}});
  htracker.init(videoInput, canvasInput);
  htracker.start();

  document.addEventListener('headtrackingEvent', function(event) {
    scene.fog = new THREE.Fog( 0x000000, 1+(event.z*27), 3000+(event.z*27) );
  }, false);
}
