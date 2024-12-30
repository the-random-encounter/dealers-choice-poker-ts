// src/server.ts
import http from 'http'
import express from 'express'
import { Server } from 'colyseus'
import PokerRoom from './rooms/PokerRoom';

const app = express()
const server = http.createServer(app)
const gameServer = new Server({ server })

// Register PokerRoom
gameServer.define('poker', PokerRoom)

app.use(express.static('public'))

server.listen(2567, () => {
    console.log('Server is running on http://localhost:2567')
})
