export function loadConfig(env = process.env) {
  return { port: env.PORT, host: env.HOST, debug: env.DEBUG };
}
