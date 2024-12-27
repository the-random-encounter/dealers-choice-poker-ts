import { Scene } from 'phaser';
import Deck from '../classes/Deck';
import Card from '../classes/Card';
import Hand from '../classes/Hand';
import Table from '../classes/Table';
import Player from '../classes/Player';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import FormUtil from '../classes/FormUtil';
import { Client, Room } from 'colyseus.js';

import { GameVariant, GameConfig, GameState, PlayerAction, } from '../utils/types';
import * as funcs from '../utils/functions';
import * as CONSTS from '../utils/constants';

const c = CONSTS;

export class PokerGame extends Scene {

    client = new Client("ws://localhost:2567");
    room: Room;
    table: Table;

    async create() {
        console.log("Joining room...");

        try {
            this.room = await this.client.joinOrCreate("my_room");
            console.log("Joined successfully!");

            this.table = new Table(this);



        } catch (e) {
            console.error(e);
        }
    }

    update() {

    }

}