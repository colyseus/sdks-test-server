import {
    defineServer,
    defineRoom,
    monitor,
    playground,
    createRouter,
    createEndpoint,
    LobbyRoom,
    QueueRoom,
    auth,
} from "colyseus";

// import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";

// Import auth config
import "./config/auth.js";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom.js";

const server = defineServer({
    /**
     * Define your room handlers:
     */
    rooms: {
        my_room: defineRoom(MyRoom).enableRealtimeListing(),
        lobby: defineRoom(LobbyRoom),
        queue: defineRoom(QueueRoom, {
          matchRoomName: "my_room",
          maxPlayers: 4
        }),
    },

    /**
     * Experimental: Define API routes. Built-in integration with the "playground" and SDK.
     * 
     * Usage from SDK: 
     *   client.http.get("/api/hello").then((response) => {})
     * 
     */
    routes: createRouter({
        test: createEndpoint("/test", { method: "GET" }, async (ctx) => {
            return { things: [1, 2, 3, 4, 5, 6] };
        })
    }),

    // transport: new uWebSocketsTransport(),

    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    express: (app) => {
        app.use(auth.prefix, auth.routes());

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground());
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitoring/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());
    }

});

export default server;