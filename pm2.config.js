module.exports = {
    apps: [
        {
            name: 'workout-app',
            script: './dist/index.js',
            instances: 4,
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};