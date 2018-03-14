///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
                                  //variables
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
logger.info(new Error().stack+" : Initiaizing three.js variables");


//threeJS
var container, stats;
var camera, controls, scene, renderer;
var mesh;

//materials
var water, grass, dirt;

//color
var ambientLight_color = 0xcccccc;
var background_color = 0xbfd1e5;

//stats
var clock = new THREE.Clock();

//wolrd
var worldWidth = 256, worldDepth = 256;
var worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var data = generateHeight(worldWidth, worldDepth);

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
                                  //functions
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function isSupported() {//true : threejs supported
    var res = true;

    if (!Detector.webgl) {
        console.log("init.js isSupported() : Error, threeJS not supported");
        Detector.addGetWebGLMessage();
        document.getElementById('container').innerHTML = "";
        res = false;
    }
    return res;
}

function loadTexture(filename) {//load a texture
    console.log('init.js loadTexture() :', filename);
    var texture = new THREE.TextureLoader().load(filename);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    return texture;
}

function initTHREEJS() {//initialize values

    var ambientColor = new THREE.AmbientLight(ambientLight_color);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();

    container = document.getElementById('container');
    container.innerHTML = "";

    console.log(data);

    water = loadTexture('textures/water.png');
    grass = loadTexture('textures/atlas.png');
    dirt  = loadTexture('textures/dirt.png');

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100;

    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 1000;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(background_color);

    scene.add(ambientColor);
    scene.add(directionalLight);


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);
}
