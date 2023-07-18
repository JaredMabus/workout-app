module.exports = {
  apps: [
    {
      name: "workout-app",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
