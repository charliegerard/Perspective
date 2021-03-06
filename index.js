window.onload = function(){
  var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');
  var header = document.getElementById('top-bar');
  var footer = document.getElementById('footer');
  var aboutLink = document.getElementsByClassName('about-link')[0];
  var aboutSection = document.getElementById('about-section');
  var container, stats;
  var camera, scene, renderer, particle, mesh;
  var mouseX = 0, mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  // Face detection setup
  var htracker = new headtrackr.Tracker({});

  var startButton = document.getElementsByClassName('start-button')[0];
  startButton.onclick = function(){
    var introTextDiv = document.getElementById('intro-text');
    introTextDiv.style.display = 'none';

    var introPage = document.getElementById('intro-page');
    introPage.style.opacity = 0;

    displayHeaderAndFooter();

    htracker.init(videoInput, canvasInput);
    htracker.start();
  };
  init();
  animate();

  function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 6000 );
    // camera.position.z = 1000;
    // camera.position.x = 1000;
    // camera.position.z = 1000;
    scene = new THREE.Scene();
    var data = generateHeight( 1024, 1024 );

    scene.add( camera );

    // set up camera controller
    // was 0,0,100 when just planes

    // headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 127, [60,400,1000], new THREE.Vector3(0,0,0), {damping : 0.5});
    headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 27, [0,500,700], new THREE.Vector3(0,0,0), {damping : 0.5});


    // create a skybox
    var skyGeometry = new THREE.SphereGeometry(2000, 25, 25);
    var texture = THREE.ImageUtils.loadTexture( "sky-dome.png" );
    var skyMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        shading: THREE.SmoothShading
    });

    var sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.material.side = THREE.BackSide;
    scene.add(sky);


    //can add wireframe: true for wireframe effect
    var material = new THREE.MeshPhongMaterial( {color: "#2194ce", side: THREE.DoubleSide, shading: THREE.FlatShading}  );
    var quality = 16, step = 1024 / quality;
    var geometry = new THREE.PlaneGeometry( 3000, 3000, quality - 1, quality - 1 );

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 100, 1000, 100 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add( spotLight );

    //rotate so can view from the top;
    // geometry.rotateX( - Math.PI / 2 );
    geometry.rotateX(90);

    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
      var x = i % quality, y = Math.floor( i / quality );
      geometry.vertices[ i ].y = data[ ( x * step ) + ( y * step ) * 1024 ] * 2 - 128;
    }

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1.5 );
    scene.add( light );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = -50;
    scene.add( mesh );
    renderer = new THREE.WebGLRenderer();

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
    // camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    // camera.position.y += ( - mouseY - camera.position.y ) * 0.05 + 15;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
  }

  document.addEventListener('headtrackingEvent', function(event) {
    scene.fog = new THREE.Fog( 0x000000, 1+(event.z*27), 3000+(event.z*27) );
  }, false);

  var opacity = 0.1;
  function displayHeaderAndFooter(){
    var interval = setInterval(function(){
      if(opacity <= 1.0){
        header.style.opacity = opacity;
        footer.style.opacity = opacity;
      } else {
        clearInterval(interval)
      }
      opacity += 0.08
    }, 100);
  }

  //Displaying the About div
  aboutLink.onclick = function(e){
    e.preventDefault();
    console.log('boo')
    aboutSection.style.display = 'block';
  }
}
