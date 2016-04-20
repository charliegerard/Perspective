window.onload = function(){
  var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');
  var container, stats;
  var camera, scene, renderer, particle, mesh;
  var mouseX = 0, mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  // Face detection setup
  var htracker = new headtrackr.Tracker({});
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
    camera.position.z = 1000;
    scene = new THREE.Scene();
    var data = generateHeight( 1024, 1024 );

    scene.add( camera );

    // set up camera controller
    // was 0,0,100 when just planes
    headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 27, [60,400,1000], new THREE.Vector3(0,0,0), {damping : 0.5});

    //can add wireframe: true for wireframe effect
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide}  );
    var quality = 16, step = 1024 / quality;
    var geometry = new THREE.PlaneGeometry( 3000, 3000, quality - 1, quality - 1 );

    var directionalLight = new THREE.DirectionalLight( 0xffff00, 0.5 );
    directionalLight.position.set( 0, 1, 0 );
    scene.add( directionalLight );

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
    renderer.setClearColor(new THREE.Color("#0d355a"), 1)
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
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05 + 15;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
  }

  document.addEventListener('headtrackingEvent', function(event) {
    scene.fog = new THREE.Fog( 0x000000, 1+(event.z*27), 3000+(event.z*27) );
  }, false);
}
