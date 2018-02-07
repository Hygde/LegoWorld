function render() {
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}