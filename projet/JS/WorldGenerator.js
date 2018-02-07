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

function generateWorld() {
    var matrix = new THREE.Matrix4();

    var pxGeometry = new THREE.PlaneBufferGeometry(100, 100);
    pxGeometry.attributes.uv.array[1] = 0.5;
    pxGeometry.attributes.uv.array[3] = 0.5;
    pxGeometry.rotateY(Math.PI / 2);
    pxGeometry.translate(50, 0, 0);

    var nxGeometry = new THREE.PlaneBufferGeometry(100, 100);
    nxGeometry.attributes.uv.array[1] = 0.5;
    nxGeometry.attributes.uv.array[3] = 0.5;
    nxGeometry.rotateY(- Math.PI / 2);
    nxGeometry.translate(- 50, 0, 0);

    var pyGeometry = new THREE.PlaneBufferGeometry(100, 100);
    pyGeometry.attributes.uv.array[5] = 0.5;
    pyGeometry.attributes.uv.array[7] = 0.5;
    pyGeometry.rotateX(- Math.PI / 2);
    pyGeometry.translate(0, 50, 0);

    var pzGeometry = new THREE.PlaneBufferGeometry(100, 100);
    pzGeometry.attributes.uv.array[1] = 0.5;
    pzGeometry.attributes.uv.array[3] = 0.5;
    pzGeometry.translate(0, 0, 50);

    var nzGeometry = new THREE.PlaneBufferGeometry(100, 100);
    nzGeometry.attributes.uv.array[1] = 0.5;
    nzGeometry.attributes.uv.array[3] = 0.5;
    nzGeometry.rotateY(Math.PI);
    nzGeometry.translate(0, 0, -50);

    // BufferGeometry cannot be merged yet.
    var tmpGeometry = new THREE.Geometry();
    var pxTmpGeometry = new THREE.Geometry().fromBufferGeometry(pxGeometry);
    var nxTmpGeometry = new THREE.Geometry().fromBufferGeometry(nxGeometry);
    var pyTmpGeometry = new THREE.Geometry().fromBufferGeometry(pyGeometry);
    var pzTmpGeometry = new THREE.Geometry().fromBufferGeometry(pzGeometry);
    var nzTmpGeometry = new THREE.Geometry().fromBufferGeometry(nzGeometry);

    for (var z = 0; z < worldDepth; z++) {

        for (var x = 0; x < worldWidth; x++) {

            var h = getY(x, z);

            matrix.makeTranslation(
                x * 100 - worldHalfWidth * 100,
                h * 100,
                z * 100 - worldHalfDepth * 100
            );

            var px = getY(x + 1, z);
            var nx = getY(x - 1, z);
            var pz = getY(x, z + 1);
            var nz = getY(x, z - 1);

            tmpGeometry.merge(pyTmpGeometry, matrix);

            if ((px !== h && px !== h + 1) || x === 0) {

                tmpGeometry.merge(pxTmpGeometry, matrix);

            }

            if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {

                tmpGeometry.merge(nxTmpGeometry, matrix);

            }

            if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {

                tmpGeometry.merge(pzTmpGeometry, matrix);

            }

            if ((nz !== h && nz !== h + 1) || z === 0) {

                tmpGeometry.merge(nzTmpGeometry, matrix);

            }

        }

    }

    var geometry = new THREE.BufferGeometry().fromGeometry(tmpGeometry);
    geometry.computeBoundingSphere();

    color3DObject(geometry, water);
}