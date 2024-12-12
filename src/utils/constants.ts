// Individual string chars for Ranks and Suits, as used in card filenames
export const RANK_CHARS = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K' ];
export const SUIT_CHARS = [ 'H', 'D', 'C', 'S' ];

export const RANK_VALUES = {
  two:    2,
  three:  3,
  four:   4,
  five:   5,
  six:    6,
  seven:  7,
  eight:  8,
  nine:   9,
  ten:    10,
  jack:   11,
  queen:  12,
  king:   13,
  ace:    14,
  wild:   100
}

export const SUIT_VALUES = {
  clubs:    1,
  diamonds: 2,
  hearts:   3,
  spades:   4
}

export const SUIT = {
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
  SPADES: 'spades'
}

export const RANK = {
  ACE: 'ace',
  TWO: 'two',
  THREE: 'three',
  FOUR: 'four',
  FIVE: 'five',
  SIX: 'six',
  SEVEN: 'seven',
  EIGHT: 'eight',
  NINE: 'nine',
  TEN: 'ten',
  JACK: 'jack',
  QUEEN: 'queen',
  KING: 'king',
  WILD: 'wild'
}

// Game window dimensions
export const GAME_WIDTH   = 1900;
export const GAME_HEIGHT  = 1000;

// Game window locations for X axis (Half, Quarters, Thirds, Fifths)
export const GAME_X     =  GAME_WIDTH;
export const GAME_X_MID =  GAME_WIDTH  / 2;
export const GAME_X_1H  =  GAME_WIDTH  / 2;
export const GAME_X_1Q  =  GAME_WIDTH  / 4;
export const GAME_X_3Q  = (GAME_WIDTH  / 4) * 3;
export const GAME_X_1T  =  GAME_WIDTH  / 3;
export const GAME_X_2T  = (GAME_WIDTH  / 3) * 2;
export const GAME_X_1F  =  GAME_WIDTH  / 5;
export const GAME_X_2F  = (GAME_WIDTH  / 5) * 2;
export const GAME_X_3F  = (GAME_WIDTH  / 5) * 3;
export const GAME_X_4F  = (GAME_WIDTH  / 5) * 4;

// Game window locations for Y axis (Half, Quarters, Thirds, Fifths)
export const GAME_Y     =  GAME_HEIGHT;
export const GAME_Y_MID =  GAME_HEIGHT  / 2;
export const GAME_Y_1H  =  GAME_HEIGHT  / 2;
export const GAME_Y_1Q  =  GAME_HEIGHT  / 4;
export const GAME_Y_3Q  = (GAME_HEIGHT  / 4) * 3;
export const GAME_Y_1T  =  GAME_HEIGHT  / 3;
export const GAME_Y_2T  = (GAME_HEIGHT  / 3) * 2;
export const GAME_Y_1F  =  GAME_HEIGHT  / 5;
export const GAME_Y_2F  = (GAME_HEIGHT  / 5) * 2;
export const GAME_Y_3F  = (GAME_HEIGHT  / 5) * 3;
export const GAME_Y_4F  = (GAME_HEIGHT  / 5) * 4;

// Poker Table asset dimensions
export const TABLE_WIDTH = 1250;
export const TABLE_HEIGHT = 1100;

// Card asset dimensions
export const CARD_WIDTH = 142;
export const CARD_HEIGHT = 212;

// Starting location for Player One's pocket cards
export const PLAYER_ONE_CARDS = { 
  x: (GAME_WIDTH / 2), 
  y: (GAME_HEIGHT - (GAME_HEIGHT / 5)) 
};

// Starting location for main window display of pocket cards
export const POCKET_CARDS_DISPLAY = {
  x: (GAME_WIDTH - (GAME_WIDTH / 10)),
  y: (GAME_HEIGHT - (GAME_HEIGHT / 5))
};

// Starting location for main window display of board cards
export const COMMUNITY_CARDS_DISPLAY = {
  x: (GAME_WIDTH - (GAME_WIDTH / 3)),
  y: (0 + (GAME_HEIGHT / 10))
};

// Card locations for various players and boards, dpeending on game type
export const CARD_SLOTS = {
        players: {
          p1: {
            texasHoldEm: {
              cardOne: { x: 475, y: 750 },
              cardTwo: { x: 550, y: 750 },
            },
            omaha: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
              cardThree: { x: 0, y: 0 },
              cardFour: { x: 0, y: 0 },
            },
          },
          p2: {
            texasHoldEm: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
            },
            omaha: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
              cardThree: { x: 0, y: 0 },
              cardFour: { x: 0, y: 0 },
            },
          },
          p3: {
            texasHoldEm: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
            },
            omaha: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
              cardThree: { x: 0, y: 0 },
              cardFour: { x: 0, y: 0 },
            },
          },
          p4: {
            texasHoldEm: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
            },
            omaha: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
              cardThree: { x: 0, y: 0 },
              cardFour: { x: 0, y: 0 },
            },
          },
          p5: {
            texasHoldEm: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
            },
            omaha: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
              cardThree: { x: 0, y: 0 },
              cardFour: { x: 0, y: 0 },
            },
          },
          p6: {
            texasHoldEm: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
            },
            omaha: {
              cardOne: { x: 0, y: 0 },
              cardTwo: { x: 0, y: 0 },
              cardThree: { x: 0, y: 0 },
              cardFour: { x: 0, y: 0 },
            },
          },
        },
        boards: {
          stdSingleCommunity: {
            flopOne: { x: 425, y: 475 },
            flopTwo: { x: 465, y: 475 },
            flopThree: { x: 505, y: 475 },
            turn: { x: 595, y: 475 },
            river: { x: 685, y: 475 },
          }
        }
      }