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

}