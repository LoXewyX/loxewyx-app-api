import { Elysia } from 'elysia';

import swaggerConfig from './swagger';

import websocketRoutes from './ws';
import api from './api';

const app = new Elysia({
  websocket: {
    idleTimeout: 30,
    publishToSelf: true,
  },
})
  .use(swaggerConfig)
  .use(websocketRoutes)
  .group('/api', (app) => app.use(api))
  .listen(process.env.PORT || 4200);

// ANSI escape codes for colors
const cyan = '\x1b[36m';
const magenta = '\x1b[35m';
const green = '\x1b[32m';
const white = '\x1b[37m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';

// Constructing the message
const hostname = app.server?.hostname;
const port = app.server?.port;
const routeURL = `http://${hostname}:${bold}${port}${reset}`;

// Formatted output
console.log(
  '\n' +
    `  ${magenta}${bold}[Ekilox API]${reset}\n` +
    '\n' +
    `  ${green}${bold}[HTTP]${reset}\n` +
    `  ${green}${bold}➜  ${white}Local${reset}:     ${cyan}${routeURL}${cyan}/${reset}\n` +
    `  ${green}${bold}➜  ${white}API Doc${reset}:   ${cyan}${routeURL}${cyan}/swagger/${reset}\n` +
    '\n' +
    `  ${green}${bold}[WS]\n` +
    `  ${green}${bold}➜  ${white}WebSocket${reset}: ${cyan}${routeURL}${cyan}/ws/${reset}\n` +
    `  ${green}${bold}  ➜  ${white}Room${reset}:    ${cyan}${routeURL}${cyan}/ws/room/${reset}\n`
);
