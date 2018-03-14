logger.info(new Error().stack+" : Starting initialization");

if (isSupported()) {
    logger.info(new Error().stack+" : Loading three.js");
    initTHREEJS();
    logger.info(new Error().stack+" : Generating worldmap");
    generateWorld();
    logger.info(new Error().stack+" : Loading anmation");
    animate();
}
else {
  logger.error(new Error().stack+" : three.js is not supported by your web browser");

}

logger.info(new Error().stack+" : Initialization complete");
