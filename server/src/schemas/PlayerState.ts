import { Schema, ArraySchema, type } from '@colyseus/schema'

export class PlayerState extends Schema {
    @type("string") username    : string;
    @type("string") displayName : string;
    @type("string") id          : string;
    @type("number") wallet      : number;
    @type("number") chips       : number  = 0;    
    @type("number") bet         : number  = 0;
    @type("boolean") folded     : boolean = false;
    @type("boolean") allIn      : boolean = false;  
    @type("boolean") isActive   : boolean = false;
    @type(["string"]) hand      : ArraySchema<string> = new ArraySchema<string>();
    @type("string") lastAction  : string  = "NONE";
    @type("boolean") canCheck   : boolean = false;
    @type("boolean") canRaise   : boolean = false;
    @type("boolean") canFold    : boolean = false;
    @type("boolean") canCall    : boolean = false;
    @type("boolean") canBet     : boolean = false;
    

}