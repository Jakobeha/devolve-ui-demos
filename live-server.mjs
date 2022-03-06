import liveServer from 'live-server'

liveServer.start({
  port: 8180,
  root: './site',
  wait: 1000,
  mount: [['/scripts', './out/app']],
  logLevel: 0
})
