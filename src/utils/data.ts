export const GAME_WIDTH = 1900;
export const GAME_HEIGHT = 1000;

export const RANK_CHARS = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K' ];
export const SUIT_CHARS = [ 'H', 'C', 'D', 'S' ];

export const PLAYER_ONE_CARDS = { 
  x: (GAME_WIDTH / 2), 
  y: (GAME_HEIGHT - (GAME_HEIGHT / 5)) 
};

export const POCKET_CARDS_DISPLAY = {
  x: (GAME_WIDTH - (GAME_WIDTH / 10)),
  y: (GAME_HEIGHT - (GAME_HEIGHT / 5))
};

export const COMMUNITY_CARDS_DISPLAY = {
  x: (GAME_WIDTH - (GAME_WIDTH / 3)),
  y: (0 + (GAME_HEIGHT / 10))
};

export const CARD_WIDTH = 142;
export const CARD_HEIGHT = 212;

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