logger.info(new Error().stack+" : Loading Window events");

function onWindowResize() {//on resize window event

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();
}
