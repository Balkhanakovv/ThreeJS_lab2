var container;
var camera, scene, renderer;
var planets = [];
var loader = new THREE.TextureLoader();    
var spotlight = new THREE.PointLight(0xffffff); 
var light = new THREE.AmbientLight( 0x101010 );
var keyboard = new THREEx.KeyboardState();
var keys = [false, false, false, false];
var earthCloud = createEarthCloud();
var moonOrbit;

var geometry, tex, material

var a = 0.0;
var b = a;

init();
animate();

function init()
{
    container = document.getElementById( 'container' );
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 ); 
    camera.position.set(80, 30, 15);
    camera.lookAt(new THREE.Vector3( 0, 0.0, 0));
    
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x0000ff, 1);
    
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );  
    
    spotlight.position.set(0, 0, 0);
    scene.add( spotlight );
    scene.add( light );

    addSpace();
    addSun();
    addPlanet(0.5, 'Planets/mercury/mercurymap.jpg', 'Planets/mercury/mercurybump.jpg', 10);
    addPlanet(0.8, 'Planets/venus/venusmap.jpg', 'Planets/venus/venusbump.jpg', 18);
    addPlanet(1, 'Planets/earth/earthmap1k.jpg', 'Planets/earth/earthbump1k.jpg',30);
    addPlanet(0.8, 'Planets/mars/marsmap1k.jpg', 'Planets/mars/marsbump1k.jpg',45);
    addPlanet(0.3, 'Planets/earth/moon/moonmap1k.jpg', 'Planets/earth/moon/moonbump1k.jpg',32.5);
    scene.add( earthCloud );

    for (var i = 2; i < 6; i++){        
        var geometryOrbit = new THREE.CircleGeometry( planets[i].pos.z, 45 );
        var materialOrbit = new THREE.MeshBasicMaterial( { color: 0x606060 } );
        geometryOrbit.vertices.shift();
        var orbit = new THREE.LineLoop( geometryOrbit, materialOrbit );
        var axis = new THREE.Vector3(1, 0, 0); 
        orbit.rotateOnAxis(axis, Math.PI/2);

        scene.add( orbit );
    }

    var geometryOrbit = new THREE.CircleGeometry( 2.5, 45 );
    var materialOrbit = new THREE.MeshBasicMaterial( { color: 0x606060 } );
    geometryOrbit.vertices.shift();
    moonOrbit = new THREE.LineLoop( geometryOrbit, materialOrbit );
    var axis = new THREE.Vector3(1, 0, 0); 
    moonOrbit.rotateOnAxis(axis, Math.PI/2);
    moonOrbit.position.set(planets[4].planet.position.x, 0, planets[4].planet.position.z);
    scene.add( moonOrbit );
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate()
{
    a += 0.01;
    b += 0.01;
    requestAnimationFrame( animate );
    render();

    for (var i = 2; i < planets.length; i++){
        planets[i].planet.rotation.y = -a * i;
        
        if (i != 6){

            var x = 0 + planets[i].pos.z * Math.cos(a / i);
            var z = 0 + planets[i].pos.z * Math.sin(a / i);
        
            planets[i].planet.position.set(x, 0, z);  
        }
        else
        {
            var x = planets[4].planet.position.x + (planets[i].pos.z - planets[4].pos.z) * Math.cos(a * 2);
            var z = planets[4].planet.position.z + (planets[i].pos.z - planets[4].pos.z) * Math.sin(a * 2);
            
            planets[i].planet.position.set(x, 0, z);
        }        
    }

    for (var i = 0; i < keys.length; i++){
        if (keys[i] == true){
            var x = planets[i+2].planet.position.x + (planets[i+2].pos.z / (i+4)) * Math.cos(b * (i+2));
            var z = planets[i+2].planet.position.z + (planets[i+2].pos.z / (i+4)) * Math.sin(b * (i+2));

            camera.position.set(x, 0, z);
            camera.lookAt(new THREE.Vector3(planets[i+2].planet.position.x, planets[i+2].planet.position.y, planets[i+2].planet.position.z));
        }
        
        if (keys[i] == true && i == 0)
        {
            var x = planets[i+2].planet.position.x + (planets[i+2].pos.z - 8) * Math.cos(b * (i+2));
            var z = planets[i+2].planet.position.z + (planets[i+2].pos.z - 8) * Math.sin(b * (i+2));

            camera.position.set(x, 0, z);
            camera.lookAt(new THREE.Vector3(planets[i+2].planet.position.x, planets[i+2].planet.position.y, planets[i+2].planet.position.z));
        }
    }

    var moonX = planets[4].planet.position.x + 0 * Math.cos(a);
    var moonZ = planets[4].planet.position.z + 0 * Math.sin(a );
    moonOrbit.position.set(moonX, 0, moonZ);

    /*---Keys---*/
    if (keyboard.pressed("0")){
        camera.position.set(80, 30, 15);
        camera.lookAt(new THREE.Vector3( 0, 0.0, 0));

        for (var i = 0; i < keys.length; i++)
            keys[i] = false;
    }

    if (keyboard.pressed("1")){
        keys.fill(false, 0, keys.lenght)
        keys[0] = true;        
    }

    if (keyboard.pressed("2")){
        keys.fill(false, 0, keys.lenght)
        keys[1] = true;
    }

    if (keyboard.pressed("3")){
        keys.fill(false, 0, keys.lenght)
        keys[2] = true;
    }
    
    if (keyboard.pressed("4")){
        keys.fill(false, 0, keys.lenght)
        keys[3] = true;
    }

    if (keyboard.pressed("left")){
        b += 0.005;
    }

    if (keyboard.pressed("right")){
        b -= 0.005;
    }

    earthCloud.position.set(planets[4].planet.position.x, planets[4].planet.position.y, planets[4].planet.position.z);
    earthCloud.rotation.y = -a * 2.2;
}

function render()
{
    renderer.render( scene, camera );
}

function addSpace()
{
    var geometry = new THREE.SphereGeometry( 1000, 32, 32 );
    var tex = loader.load( 'Planets/starmap.jpg' );
    
    tex.minFilter = THREE.NearestFilter;

    var material = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
    });

    var sphere = new THREE.Mesh( geometry, material );
    var pos = new THREE.Vector3(0, 0, 0);

    scene.add( sphere );

    var planet = {};
    planet.planet = sphere;
    planet.pos = pos;

    planets.push(planet);
}

function addSun()
{
    var geometry = new THREE.SphereGeometry( 8, 32, 32);
    var tex = loader.load( 'Planets/sunmap.jpg' );
    
    tex.minFilter = THREE.NearestFilter;

    var material = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
    });

    var sphere = new THREE.Mesh( geometry, material );
    var pos = new THREE.Vector3(0, 0, 0);
    sphere.position.copy(pos);

    scene.add( sphere );

    var planet = {};
    planet.planet = sphere;
    planet.pos = pos;

    planets.push(planet);
}

function addPlanet(radius, texture, bump_map, posZ)
{
    var geometry = new THREE.SphereGeometry( radius, 32, 32 );
    var tex = loader.load( texture );
    var bump = loader.load( bump_map );
    tex.minFilter = THREE.NearestFilter;

    var material = new THREE.MeshPhongMaterial({
        map: tex,
        bumpMap: bump,
        bumpScale: 0.05,
        side: THREE.DoubleSide
    });

    var sphere = new THREE.Mesh( geometry, material );
    var pos = new THREE.Vector3(0, 0, posZ);
    sphere.position.copy(pos);

    scene.add( sphere );

    var planet = {};
    planet.planet = sphere;
    planet.pos = pos;

    planets.push(planet);

}

function createEarthCloud()
{
    // create destination canvas
    var canvasResult = document.createElement('canvas');
    canvasResult.width = 1024;
    canvasResult.height = 512;
    var contextResult = canvasResult.getContext('2d');
    // load earthcloudmap
    var imageMap = new Image();

    imageMap.addEventListener("load", function()
    {
        // create dataMap ImageData for earthcloudmap
        var canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        var contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
        // load earthcloudmaptrans
        var imageTrans = new Image();
        
        imageTrans.addEventListener("load", function()
        {
            var canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            var contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans, 0, 0);
            var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
            var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);

            for(var y = 0, offset = 0; y < imageMap.height; y++)
                for(var x = 0; x < imageMap.width; x++, offset += 4)
                {
                    dataResult.data[offset+0] = dataMap.data[offset+0];
                    dataResult.data[offset+1] = dataMap.data[offset+1];
                    dataResult.data[offset+2] = dataMap.data[offset+2];
                    dataResult.data[offset+3] = 255-dataTrans.data[offset+0];
                }
            
            contextResult.putImageData(dataResult,0,0)
            material.map.needsUpdate = true;
        });

        imageTrans.src = 'Planets/earth/earthcloudmaptrans.jpg';
    }, false);

    imageMap.src = 'Planets/earth/earthcloudmap.jpg';

    var geometry = new THREE.SphereGeometry(1.01, 32, 32);
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture( canvasResult ),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
    });

    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}
