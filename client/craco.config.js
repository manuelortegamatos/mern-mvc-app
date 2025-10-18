module.exports = {
  devServer: (devServerConfig) => {
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      // Aquí puedes agregar middlewares sin usar onBeforeSetupMiddleware ni onAfterSetupMiddleware
      return middlewares;
    };
    return devServerConfig;
  },
};