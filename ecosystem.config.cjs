// PM2 process file. Start with: pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "aexon-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: { NODE_ENV: "production" },
    },
  ],
};
