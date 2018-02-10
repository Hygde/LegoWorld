function getPxGeometry() {
    var pxGeometry = new THREE.PlaneBufferGeometry(100, 100);
    pxGeometry.attributes.uv.array[1] = 0.5;
    pxGeometry.attributes.uv.array[3] = 0.5;
    pxGeometry.rotateY(Math.PI / 2);
    pxGeometry.translate(50, 0, 0);

    return new THREE.Geometry().fromBufferGeometry(pxGeometry);
}

function getNxGeometry() {
    var nxGeometry = new THREE.PlaneBufferGeometry(100, 100);
    nxGeometry.attributes.uv.array[1] = 0.5;
    nxGeometry.attributes.uv.array[3] = 0.5;
    nxGeometry.rotateY(- Math.PI / 2);
    nxGeometry.translate(- 50, 0, 0);
    return new THREE.Geometry().fromBufferGeometry(nxGeometry);
}

function getPyGeomtry() {
    var pyGeometry = new THREE.PlaneBufferGeometry(100, 100);
    pyGeometry.attributes.uv.array[5] = 0.5;
    pyGeometry.attributes.uv.array[7] = 0.5;
    pyGeometry.rotateX(- Math.PI / 2);
    pyGeometry.translate(0, 50, 0);
    return new THREE.Geometry().fromBufferGeometry(pyGeometry);
}

function getPzGeomtry() {
    var pzGeometry = new THREE.PlaneBufferGeometry(100, 100);
    pzGeometry.attributes.uv.array[1] = 0.5;
    pzGeometry.attributes.uv.array[3] = 0.5;
    pzGeometry.translate(0, 0, 50);
    return new THREE.Geometry().fromBufferGeometry(pzGeometry);
}

function getNzGeomtry() {
    var nzGeometry = new THREE.PlaneBufferGeometry(100, 100);
    nzGeometry.attributes.uv.array[1] = 0.5;
    nzGeometry.attributes.uv.array[3] = 0.5;
    nzGeometry.rotateY(Math.PI);
    nzGeometry.translate(0, 0, -50);
    return new THREE.Geometry().fromBufferGeometry(nzGeometry);
}


function getY(x, z) {//getter of Y coord
    return (data[x + z * worldWidth] * 0.2) | 0;
}

function color3DObject(geometry, texture) {
    var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ map: texture }));
    scene.add(mesh);
}

function generateHeight(width, height) {//gen the wolrd

    var data = [], perlin = new ImprovedNoise(),
        size = width * height, quality = 2, z = Math.random() * 100;

    for (var j = 0; j < 4; j++) {

        if (j === 0) for (var i = 0; i < size; i++) data[i] = 0;

        for (var i = 0; i < size; i++) {

            var x = i % width, y = (i / width) | 0;
            data[i] += perlin.noise(x / quality, y / quality, z) * quality;
        }

        quality *= 4;

    }
    return data;
}

function applyTexture(Object, Texture) {//apply a texture on the object
    var geometry = new THREE.BufferGeometry().fromGeometry(Object);
    geometry.computeBoundingSphere();
    color3DObject(geometry, Texture);
}

function generateWorld() {//todo : divide into 3 parts tmpGeometry (changing texture with y coordinate)
    var matrix = new THREE.Matrix4();

    // BufferGeometry cannot be merged yet.
    var LowLayer = new THREE.Geometry();
    var MiddleLayer = new THREE.Geometry();
    var HighLayer = new THREE.Geometry();

    //getBufferGeometry
    var pxTmpGeometry = getPxGeometry();
    var nxTmpGeometry = getNxGeometry();
    var pyTmpGeometry = getPyGeomtry();
    var pzTmpGeometry = getPzGeomtry();
    var nzTmpGeometry = getNzGeomtry();

    var geometries = [pxTmpGeometry, nxTmpGeometry, pzTmpGeometry, nzTmpGeometry];

    for (var z = 0; z < worldDepth; z++) {
        for (var x = 0; x < worldWidth; x++) {

            var h = getY(x, z);

            matrix.makeTranslation(x * 100 - worldHalfWidth * 100, h * 100, z * 100 - worldHalfDepth * 100);

            var px = getY(x + 1, z);
            var nx = getY(x - 1, z);
            var pz = getY(x, z + 1);
            var nz = getY(x, z - 1);

            var values = [h, x, z, px, nx, pz, nz];

            if (h <= -3) {
                LowLayer.merge(pyTmpGeometry, matrix);
                merge(matrix, LowLayer, pxTmpGeometry, nxTmpGeometry, pzTmpGeometry, nzTmpGeometry, values);
            }
            else {
                if (h <= 0) {
                    MiddleLayer.merge(pyTmpGeometry, matrix);
                    merge(matrix, MiddleLayer, pxTmpGeometry, nxTmpGeometry, pzTmpGeometry, nzTmpGeometry, values);
                }
                else {
                    HighLayer.merge(pyTmpGeometry, matrix);
                    merge(matrix, HighLayer, pxTmpGeometry, nxTmpGeometry, pzTmpGeometry, nzTmpGeometry, values);
                }
            }
        }

    }

    applyTexture(LowLayer, water);//apply a texture on layer
    applyTexture(MiddleLayer, grass);
    applyTexture(HighLayer, dirt);
}

function merge(matrix, layer, pxTmpGeometry, nxTmpGeometry, pzTmpGeometry, nzTmpGeometry, values) {
    var h = values[0], x = values[1], z = values[2];
    var px = values[3], nx = values[4];
    var pz = values[5], nz = values[6];

    if ((px !== h && px !== h + 1) || x === 0) {

        layer.merge(pxTmpGeometry, matrix);

    }

    if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {

        layer.merge(nxTmpGeometry, matrix);

    }

    if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {

        layer.merge(pzTmpGeometry, matrix);

    }

    if ((nz !== h && nz !== h + 1) || z === 0) {

        layer.merge(nzTmpGeometry, matrix);

    }
}