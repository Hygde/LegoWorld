function getPlaneGeometry(indexes, axeRotation, radian, translation) {

    console.log(indexes, axeRotation, radian, translation);

    //experimental func
    var plane = new THREE.PlaneBufferGeometry(100, 100);
    plane.attributes.uv.array[indexes[0]] = 0.5;
    plane.attributes.uv.array[indexes[1]] = 0.5;

    switch (axeRotation) {//select good rotation
        case 'x': plane.rotateX(radian); break;
        case 'y': plane.rotateY(radian); break;
        case 'z': plane.rotateZ(radian); break;
        default: break;
    }

    //translate [0] -> x; [1] -> y; [2] -> z
    plane.translate(translation[0], translation[1], translation[2]);
    return new THREE.Geometry().fromBufferGeometry(plane);
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

    var pxTmpGeometry = getPlaneGeometry([1, 3], 'y', (Math.PI / 2), [50, 0, 0]);
    var nxTmpGeometry = getPlaneGeometry([1, 3], 'y', -(Math.PI / 2), [-50, 0, 0]);
    var pyTmpGeometry = getPlaneGeometry([5, 7], 'x', -(Math.PI / 2), [0, 50, 0]);
    var pzTmpGeometry = getPlaneGeometry([1, 3], 'n', (Math.PI / 2), [0, 0, 50]);
    var nzTmpGeometry = getPlaneGeometry([1, 3], 'y', (Math.PI), [0, 0, -50]);

    var geometries = [pxTmpGeometry, nxTmpGeometry, pzTmpGeometry, nzTmpGeometry];

    for (var z = 0; z < worldDepth; z++) {
        for (var x = 0; x < worldWidth; x++) {

            var h = getY(x, z);

            matrix.makeTranslation(x * 100 - worldHalfWidth * 100, h * 100, z * 100 - worldHalfDepth * 100);//transform

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
