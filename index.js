window.onload = function(){
  var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');
  var container, stats;
  var camera, scene, renderer, particle, mesh;
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

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    camera.position.x = 1000;
    camera.position.y = 1000;
    scene = new THREE.Scene();
    var data = generateHeight( 1024, 1024 );

    scene.add( camera );

    // set up camera controller
    // was 0,0,100 when just planes
    // headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 27, [60,300,1000], new THREE.Vector3(0,0,0), {damping : 0.5});
    headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 27, [0,0,70], new THREE.Vector3(0,0,0), {damping : 0.5});

    //---------------- PLANES ----------------------

    // //top wall
    // plane1 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
    // plane1.rotation.x = Math.PI/2;
    // plane1.position.y = 250;
    // plane1.position.z = 50-1500;
    // scene.add( plane1 );
    //
    // //left wall
    // plane2 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
    // plane2.rotation.y = Math.PI/2;
    // plane2.position.x = -250;
    // plane2.position.z = 50-1500;
    // scene.add( plane2 );
    //
    // //right wall
    // plane3 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
    // plane3.rotation.y = -Math.PI/2;
    // plane3.position.x = 250;
    // plane3.position.z = 50-1500;
    // scene.add( plane3 );
    //
    // //bottom wall
    // plane4 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
    // plane4.rotation.x = -Math.PI/2;
    // plane4.position.y = -250;
    // plane4.position.z = 50-1500;
    // scene.add( plane4 );


    var material = new THREE.MeshBasicMaterial( { overdraw: 0.5, wireframe: true } );
    var quality = 16, step = 1024 / quality;
    var geometry = new THREE.PlaneGeometry( 3000, 3000, quality - 1, quality - 1 );

    //rotate so can view from the top;
    geometry.rotateX( - Math.PI / 2 );

    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
      var x = i % quality, y = Math.floor( i / quality );
      geometry.vertices[ i ].y = data[ ( x * step ) + ( y * step ) * 1024 ] * 2 - 128;
    }

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    renderer = new THREE.CanvasRenderer();


    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.innerHTML = "";
    container.appendChild( renderer.domElement );


  }

  function generateHeight( width, height ) {
    var data = new Uint8Array( width * height ), perlin = new ImprovedNoise(),
    size = width * height, quality = 2, z = Math.random() * 100;
    for ( var j = 0; j < 4; j ++ ) {
      quality *= 4;
      for ( var i = 0; i < size; i ++ ) {
        var x = i % width, y = ~~ ( i / width );
        data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * 0.5 ) * quality + 10;
      }
    }
    return data;
  }

  function animate() {
    // renderer.render(scene, camera);
    render();

    requestAnimationFrame( animate );
  }

  function render() {
    // camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    // camera.position.y += ( - mouseY - camera.position.y ) * 0.05 + 15;
    // camera.lookAt( scene.position );
    renderer.render( scene, camera );

  }

  document.addEventListener('headtrackingEvent', function(event) {
    // scene.fog = new THREE.Fog( 0x000000, 1+(event.z*27), 3000+(event.z*27) );
  }, false);
}
