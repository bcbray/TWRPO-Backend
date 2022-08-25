/* eslint-disable object-curly-newline */

import { FactionRealFull } from './meta';

export type AssumeOther = 'assumeNpNoOther' | 'assumeNp' | 'assumeOther' | 'someOther' | 'neverNp';

export interface Character {
    id: number;
    name: string;
    factions?: FactionRealFull[];
    displayName?: number;
    nicknames?: string[];
    leader?: boolean;
    highCommand?: boolean;
    affiliate?: boolean;
    assume?: AssumeOther;
    assumeChar?: boolean;
}

export type WrpCharacters = { [key: string]: Character[] };

const reg = (r: RegExp): string => `/${r.source}/`;

// Make character map

// Next ID: 998

export const wrpCharacters: WrpCharacters = {
    '0Reed': [
        { id: 1, name: 'Creedence McPoyle' },
    ],
    '1018tersk': [
        { id: 2, name: 'Erling Haraldson' },
        { id: 3, name: 'Stefano Salvaturi' },
    ],
    '2hands2thumbs': [
        { id: 4, name: 'Ernest Dooly' },
        { id: 5, name: 'Maverik Stone' },
        { id: 6, name: 'Sheppard Dutton' },
    ],
    '893SHIRO': [
        { id: 7, name: 'Mitsuhide Nagahama' },
    ],
    AaronOnAir: [
        { id: 8, name: 'Dylan Texler' },
    ],
    abbbz: [
        { id: 9, name: '[Deputy] Francesca Romano', factions: ['Law'] },
        { id: 10, name: 'Sanjay Patel' },
        { id: 11, name: 'Gertrude Goose', nicknames: ['Mrs. Goose'], displayName: 3 },
    ],
    AChanceOfCosplay: [
        { id: 12, name: 'Bart Bancroft' },
        { id: 13, name: 'Jason Forsworn' },
        { id: 14, name: 'William "Billy" Boomer' },
    ],
    aDarkFilly: [
        { id: 15, name: 'Magnolia Decker', factions: ['The Nameless'] },
    ],
    Aero_Films: [
        { id: 16, name: 'Skeeter Carlisle' },
    ],
    Aestannar: [
        { id: 17, name: 'Arthur Jones' },
        { id: 18, name: 'Del Parker' },
    ],
    Afro: [
        { id: 19, name: 'Gordon Parks' },
    ],
    Agidon: [
        { id: 20, name: 'Holt MacMillan' },
    ],
    aJimmy: [
        { id: 21, name: 'James Kelly', nicknames: ['Kame Jelly', 'Kelbert'], factions: ['Kettleman Gang'] }, // Briefly led Kelly Gang
    ],
    Altrah: [
        { id: 22, name: 'Victor Morteza' },
    ],
    AlwayStayBlack: [
        { id: 23, name: 'Shaggy McRaggzzah' },
    ],
    alyssajeanaf: [
        { id: 24, name: 'Dahlia Malone', nicknames: ['Songbird'] }, // Dicenzo hangaround? Former Sam's Club
    ],
    AM_Raid: [
        { id: 25, name: 'Cain Lockhart' },
        { id: 26, name: 'Clifford Buck' },
        { id: 27, name: '[Deputy] Giorgio Santorelli', factions: ['Law'] },
        { id: 28, name: 'Raul Sanchez' },
    ],
    andromedastarry: [
        { id: 29, name: 'Andi Walker' },
        { id: 30, name: 'Quinn Connolly' },
        { id: 31, name: 'Gabriella Gonzales' },
    ],
    AngelKnivez: [
        { id: 32, name: 'Renni Bradshaw', nicknames: ['Rimmy'] }, // Former Danger Gang. Briefly Kelly Gang
        { id: 33, name: 'Sissi Marie', factions: ['DiCenzo Famiglia'] },
    ],
    AngryPotatoChipz: [
        { id: 34, name: 'Jamie Marlow' },
        { id: 35, name: 'Isiah Trebuchet' },
    ],
    AnthonyZ: [
        { id: 36, name: 'Antonio Corleone', nicknames: ['Tony'], factions: ['DiCenzo Famiglia'] },
    ],
    APPLESHAMPOO: [
        { id: 37, name: 'Kenny Kidman' },
    ],
    Arc_Of_Fire: [
        { id: 38, name: 'Nathan Terriers' },
    ],
    ArmoredAndy: [
        { id: 39, name: '[Sr. Ranger] Buzz Buxton', factions: ['Rangers'] },
        { id: 40, name: 'Adolf "Dolfie" Hofcooperstedder' },
        { id: 41, name: 'Moose' },
    ],
    Ashen_Rabbit: [
        { id: 42, name: '[Trainee] Dovie Parker', factions: ['Medical'] },
    ],
    AtomosCLU: [
        { id: 43, name: 'George Anderson' },
    ],
    AtopDerekMountain: [
        { id: 44, name: 'Dante Valentino' },
        { id: 45, name: 'Devoghn Lowery Brown', nicknames: ['D-Lo', reg(/d(?:\-|\s*)lo/)], displayName: 4 },
        { id: 46, name: 'Red Stag' },
        { id: 47, name: 'Walter Cross' },
        { id: 48, name: 'Wechugue Wechugue' },
        { id: 49, name: 'Zhang Wei' }, // TODO: Add Tai Pan faction
    ],
    aureliawrites: [
        { id: 50, name: 'Lena Phipps' },
        { id: 51, name: 'Scarlet ?' }, // TODO: Last name?
    ],
    AustiinTV: [
        { id: 52, name: 'Mickey Toolin' },
    ],
    aviceration: [
        { id: 53, name: 'Ella Mason' },
        { id: 54, name: 'Vincencia "Vinnie" Romeo' },
        { id: 55, name: 'Kitty LaRoux' },
    ],
    Avioto_: [
        { id: 56, name: 'Amadeo Moretti', factions: ['DiCenzo Famiglia'] },
        { id: 57, name: 'Mo Tengfei' },
    ],
    AwaBeats: [
        { id: 58, name: 'Ali Mason' },
        { id: 59, name: 'Nokosi Ahanu' },
        { id: 60, name: '[Deputy] Cleveland Brown', nicknames: ['C-Lo'], displayName: 3, factions: ['Law'] },
        { id: 61, name: 'Yorrik Morales' },
    ],
    ayekayy47_: [
        { id: 62, name: 'Misty Shaw' },
        { id: 63, name: 'Rayne Beaux' },
        { id: 64, name: 'Toni Chambers' },
    ],
    AzzTazz: [
        { id: 65, name: 'Eric Butter' },
        { id: 66, name: 'Solomon Kray' },
        { id: 67, name: 'Thomas Ethan', nicknames: ['The Kid'] },
    ],
    B3UDown: [
        { id: 68, name: 'Zip Quil', factions: ['Kettleman Gang'] },
    ],
    babysiren_: [
        { id: 69, name: 'Laura Dunn' },
    ],
    Balmer: [
        { id: 70, name: 'Little Tibbles' },
    ],
    bananabrea: [
        { id: 71, name: 'Josephine Gold' },
    ],
    barrybogan: [
        { id: 72, name: 'Bernard "Bernie" Bogan', nicknames: ['Bernie the Butcher'] }, // Former Bloody Hood. Bloody Hoods disbanded
        { id: 73, name: 'Jack Doolan' },
    ],
    BASHZOR: [
        { id: 74, name: 'Wade Kilian' },
    ],
    Beanblanket: [
        { id: 75, name: 'Clifford Dawes' },
        { id: 76, name: 'Emilio Peralta' },
    ],
    BeardofOz: [
        { id: 77, name: 'Euclid Vane' },
        { id: 78, name: 'Ivan Smith' },
        { id: 79, name: 'Liam Baker' },
        { id: 80, name: 'Shep Ross' },
    ],
    beesneez: [
        { id: 81, name: 'Georgie Meadows' },
        { id: 82, name: 'Nora Boyle' },
        { id: 83, name: '[Deputy] Avery Eliss', factions: ['Law'] },
    ],
    BernieIsLive: [
        { id: 84, name: 'Noah Little' },
    ],
    BikeMan: [
        { id: 85, name: 'Thaddeus Wick' },
    ],
    Bionic_Toothpick: [
        { id: 86, name: 'Elia Marekson' },
    ],
    BitterRabbit: [
        { id: 87, name: 'Eliza Kerrigan' }, // Kerrigan Ranch
        { id: 88, name: 'Grace Shelton' },
        { id: 89, name: '[Deputy] Kate Hearst', factions: ['Law'] },
        { id: 90, name: 'Sam Caldwell' },
    ],
    blackhawkgamiing: [
        { id: 91, name: 'Chris Edwoods' },
    ],
    Blaustoise: [
        { id: 92, name: 'Jesse Flint' },
    ],
    bldrs: [
        { id: 93, name: 'Casey Rigsby', factions: ['The Unhung', 'Guppy Gang'] }, // Former Sam's Club
    ],
    BlitzyNation: [
        { id: 94, name: 'Charlie Walker' },
        { id: 95, name: 'Craig the Wizard' },
        { id: 96, name: 'Howi Bennet' },
        { id: 97, name: 'James Wayne Twin' },
        { id: 98, name: 'Juan Diego Moralez' },
        { id: 99, name: 'Tommy Bennett' },
        { id: 987, name: 'Felix Valentino' },
    ],
    blkcat: [
        { id: 100, name: 'Johnny Walker' },
    ],
    BloomOnline: [
        { id: 101, name: 'Norman Kobbs' },
    ],
    BooksBlanketsandTea: [
        { id: 102, name: 'Edith Scriven' },
    ],
    BoosterGreg: [
        { id: 103, name: 'Roy Whitmore' },
    ],
    Boxeryedig: [
        { id: 104, name: 'Timothy Johnson' },
        { id: 105, name: 'Daniel McCormic' },
        { id: 106, name: 'Bud Pierce' },
    ],
    BradWOTO: [
        { id: 107, name: 'Bentley Fog' },
        { id: 108, name: 'Rufus Lorde' }, // Dead End Kid. Summer's Gang. Dead
        { id: 109, name: 'Tar Sullivan' },
    ],
    Brizzo24: [
        { id: 110, name: 'Craig Johnson' }, // Former Sam's Club
        { id: 111, name: 'Karl Feckles' }, // Dead
    ],
    BrutalBri: [
        { id: 112, name: 'Cooter O\'Doole' },
        { id: 113, name: 'Dakota Rush' },
        { id: 114, name: 'Robin Fischer' },
    ],
    bryanprograms: [
        { id: 115, name: 'Blue Vanderweit' },
        { id: 116, name: 'Butch Fairway' },
        { id: 117, name: 'Johnny Quick' },
    ],
    Buddha: [
        { id: 118, name: 'Wu Buddha', factions: ['DiCenzo Famiglia'] },
    ],
    buddyandy88: [
        { id: 119, name: 'Carla Johanson' },
    ],
    Buffalo995: [
        { id: 120, name: 'Clayton Woods' },
    ],
    BumbBard: [
        { id: 121, name: 'Fewis Oxhandler' },
        { id: 122, name: 'Fyodor' },
    ],
    BunglingNormal2: [
        { id: 123, name: 'Henry Gearhardt' },
    ],
    Burn: [
        { id: 124, name: 'Lloyd "The Ghost" Chambers', nicknames: ['Ghost'] },
    ],
    BurtLington: [
        { id: 125, name: '[Sheriff] Marty Malone', factions: ['Law'] },
        { id: 126, name: 'Paddy Connelly', nicknames: ['The Sweeper'] },
    ],
    buttrito: [
        { id: 127, name: 'Dakota Ellis' },
    ],
    Caffine5: [
        { id: 128, name: 'Billy Falco', nicknames: ['Billy Blasters', 'Billy Blunders'] }, // Former Danger Gang
        { id: 129, name: 'Vincenzo Struzzo' },
    ],
    calibriggs: [
        { id: 130, name: 'Henry Baptiste' },
        { id: 131, name: '[Deputy] Joseph Parrish', factions: ['Law'] },
    ],
    CallieCakez: [
        { id: 132, name: '[Ranger] Amelie Ashton', factions: ['Rangers'] },
    ],
    CallisTV: [
        { id: 133, name: 'August Wheeler' },
    ],
    CannaCasual: [
        { id: 134, name: 'Calvin Corbin' },
    ],
    CapitalOGttv: [
        { id: 135, name: 'Franklin Costella' },
        { id: 136, name: 'James "Jimi" Black' },
    ],
    CaptainMeef: [
        { id: 137, name: 'Casey Jones' },
    ],
    CaptRubble: [
        { id: 138, name: 'Joseph Stone' },
        { id: 139, name: 'Percy Peanut' },
    ],
    CarbonitePlays: [
        { id: 140, name: '[Deputy] Evan Madeley', factions: ['Law'] },
        { id: 141, name: 'Karl North' },
        { id: 142, name: 'Lance Irwin' },
        { id: 143, name: 'Mervyn Castor' },
        { id: 144, name: 'Miguel Sanchez' },
    ],
    Carlos_Spicyw3iner: [
        { id: 145, name: 'Larry Brown' },
    ],
    CaseFace5: [
        { id: 146, name: 'Willie "Gramps" Walker' },
    ],
    charlieblossom: [
        { id: 147, name: 'Katarina Lovette' },
        { id: 148, name: 'Eleanor Wood' },
    ],
    Cheever7: [
        { id: 149, name: 'Aurora Rayne', factions: ['Kettleman Gang'] },
    ],
    ChickPenguin: [
        { id: 150, name: 'Lily Linwood', nicknames: ['Lily Fish', 'Lilly', 'Lilly Fish'], factions: ['Independent', 'Guppy Gang'] },
    ],
    Chief: [
        { id: 151, name: 'Caesar Coal' },
        { id: 152, name: 'Tuuyship Áama' },
    ],
    CHUDOCKEN: [
        { id: 153, name: 'Qeljayiden', nicknames: ['Qelajayiden', 'Jaden'] },
        { id: 154, name: 'Josiah Wayne' },
    ],
    ChrisTombstone: [
        { id: 155, name: 'Joffery Wilkins' },
    ],
    ClassicSteeve: [
        { id: 156, name: 'Melvin Brown' },
        { id: 157, name: 'Jimmy Duncs' },
    ],
    ClassyPax: [
        { id: 158, name: 'Eugene Calloway' },
        { id: 159, name: 'Father Hickey' },
    ],
    CloakingHawk: [
        { id: 160, name: '[Deputy] Danni Jackson', factions: ['Law'], displayName: 1 },
        { id: 161, name: 'Roo' },
        { id: 162, name: 'Tilly-May Edwards' },
    ],
    CloeeBee: [
        { id: 163, name: 'Alice Bennett' },
        { id: 164, name: 'Rose Pond' },
    ],
    Coda19us: [
        { id: 165, name: 'Cecil Prichard' },
    ],
    Cojothebro: [
        { id: 166, name: 'Oliver Toscano', nicknames: ['Mad Dog'], factions: ['DiCenzo Famiglia'] },
        { id: 991, name: 'Asher Bell' },
    ],
    ConnorCronus: [
        { id: 167, name: '[Deputy] Rip Riley', factions: ['Law'] },
        { id: 168, name: 'Isaac Smith' },
        { id: 169, name: 'Karlias Drex' },
        { id: 170, name: 'Richard Sionis' },
    ],
    Coolidge: [
        { id: 171, name: 'Frank Murdock' },
        { id: 172, name: 'Cash Colton', factions: ['Coltons'] },
    ],
    Criken: [
        { id: 173, name: 'Festus Asbestus' },
        { id: 982, name: 'Barry Beaver' },
    ],
    crocc_: [
        { id: 174, name: 'Santino "Sonny" DiCenzo', factions: ['DiCenzo Famiglia'], leader: true },
    ],
    Crom: [
        { id: 175, name: 'Elias McDurn' },
        { id: 176, name: 'Aleister Reid' },
    ],
    cruddycheese: [
        { id: 177, name: 'Donald McMuffin' },
    ],
    CyboargTV: [
        { id: 178, name: 'Porter ONeill' },
    ],
    DadnOut: [
        { id: 179, name: 'Cletus Clifton' },
        { id: 180, name: 'Dusty Wilder' },
    ],
    Daftmedic: [
        { id: 181, name: '[Doctor] Tristan Shipman', factions: ['Medical'] },
        { id: 182, name: 'Archibald Shaw' },
    ],
    Dam_O: [
        { id: 183, name: 'Grover Carlson' },
    ],
    DangitLacie: [
        { id: 184, name: '[Deputy] Doreen Pavus', factions: ['Law'] },
        { id: 185, name: 'Judith Amerine' },
        { id: 186, name: 'Kid Kelley' },
    ],
    DaniOregon: [
        { id: 187, name: 'Wesley Daniels' },
    ],
    DanMysteryHero: [
        { id: 188, name: 'Brett Jordan' },
        { id: 189, name: 'Wolverine Payton' },
    ],
    dannyfloriduh: [
        { id: 190, name: 'Cliff Westwood' },
    ],
    Danzenken: [
        { id: 191, name: 'Aadi G. Boom' },
    ],
    Darthbobo77: [
        { id: 192, name: 'Walter Rinsen' },
        { id: 193, name: 'Cooter Jonason' },
    ],
    DarysFrost: [
        { id: 194, name: 'Hunter Solomons' },
    ],
    Dastardly_Dog: [
        { id: 195, name: 'Barry Smith' },
        { id: 196, name: 'Cassel bottom' },
    ],
    DatVoiceGuy: [
        { id: 197, name: 'Alejandro Ariez' },
        { id: 198, name: 'Luther Van Dam' },
    ],
    Daveybe: [
        { id: 199, name: 'Pip Delahan', factions: ['Kettleman Gang'] },
        { id: 200, name: 'Edge Lamburg' },
    ],
    DEANSUMMERWIND: [
        { id: 201, name: 'Doug Darrell Dan' },
        { id: 202, name: 'Ham Royce' },
    ],
    DeFrostSC: [
        { id: 203, name: 'Eyota "Thunder" Tiama' },
        { id: 204, name: 'Hank Boon' },
    ],
    DeneeSays: [
        { id: 205, name: 'Brooke "Babs" Burns' }, // DiCenzo hangaround?
    ],
    Deputy_Games: [
        { id: 206, name: 'Sam Rosco' }, // Former The Cut
    ],
    DetectiveDoorag: [
        { id: 207, name: '[Deputy] Casey Kramer', factions: ['Law'] },
        { id: 208, name: 'Beau Wilder' },
        { id: 209, name: 'Colt Clifford' },
    ],
    deviliac: [
        { id: 210, name: 'Rafael "Rafa" Ramirez', nicknames: ['SnakeFace'] },
    ],
    Dimitri: [
        { id: 211, name: 'Clem Colton' },
    ],
    Dimoak: [
        { id: 212, name: 'Fiddleford "Phil" Mackit' }, // Dead
        { id: 213, name: 'Kaz Brekker' },  // Dead
        { id: 214, name: 'Tommy Townsand' },
        { id: 215, name: 'Matthias Helvar' },
        { id: 216, name: 'Ramsley Gracey' },
    ],
    Dirty_10: [
        { id: 217, name: 'Richard Long', assume: 'assumeOther' },
        { id: 218, name: 'Wesley Long' },
        { id: 219, name: 'Vincent La Guardia' },
    ],
    Dirty_Fisherman: [
        { id: 220, name: 'Archibald Trout' },
    ],
    DisbeArex: [
        { id: 221, name: 'Timmy Took' },
        { id: 222, name: 'Dolly Dixon' }, // Dead
        { id: 223, name: 'Morgana Fay' },
        { id: 224, name: 'The Blood Witch', displayName: 0 },
    ],
    DJADIP: [
        { id: 225, name: 'Juan Pablo' },
    ],
    DjinnJee: [
        { id: 226, name: 'Jack Burton' },
    ],
    docrimbo: [
        { id: 227, name: 'Butch Nickle' },
        { id: 228, name: 'Fondue Framboise' },
        { id: 229, name: 'Princess Biscuits' },
        { id: 230, name: 'Jonah Harper' },
    ],
    DongerDayz: [
        { id: 231, name: 'Blue Brows' },
        { id: 232, name: 'Hubert Timbol' },
        { id: 233, name: 'Mean Dillard' },
        { id: 234, name: 'Stranger' },
        { id: 235, name: 'Garibaldi' },
    ],
    DonnGaston: [
        { id: 236, name: 'Miguel Hidalgo' },
    ],
    Doodlebag: [
        { id: 237, name: 'Damian Castle' },
    ],
    DreadfullyDespized: [
        { id: 238, name: 'Byong Ho' },
    ],
    DrensWorld: [
        { id: 239, name: 'Danny Kerrigan' }, // Kerrigan Ranch. Dead
        { id: 240, name: 'Duncan Ladle' },
        { id: 241, name: '[Deputy] Duncan Weller', factions: ['Law'] },
        { id: 242, name: 'Darwin Howe' },
    ],
    DrulkTV: [
        { id: 243, name: 'Lawrence Noll' },
        { id: 244, name: 'Wayne Colt' },
    ],
    DrXeroLive: [
        { id: 245, name: 'Jack Thompson' },
        { id: 246, name: 'Maurice Dillard' },
    ],
    DubEkostep: [
        { id: 247, name: 'Pancho "El Cucuy" Zapata' },
    ],
    duhDonniee: [
        { id: 248, name: 'Dirty Dougie', displayName: 0 }, // TODO: Is this their real name?
    ],
    DukeOfFlukes: [
        { id: 249, name: 'Alexander Poe', factions: ['Medical'] },
        { id: 250, name: 'Duke Colt', nicknames: ['Handsome Colt'] },
        { id: 251, name: 'Charles Morgan' },
    ],
    Dunrunnin12: [
        { id: 252, name: 'Clay' },
    ],
    DustMonkeyGames: [
        { id: 253, name: '[Deputy] Charles Slaughter', factions: ['Law'] },
        { id: 254, name: 'Solomon Walker' }, // Leader of The Cut. Dead
        { id: 255, name: 'Lawrence "The Major" Stirling' },
        { id: 256, name: 'Isaac "Dr. Creed" Creed' }, // Leader of The Ward
        { id: 257, name: 'Reginald "Reggie" Richardson' },
        { id: 258, name: 'Cullen Vane' },
    ],
    Dwoalin: [
        { id: 259, name: 'Jeff “Smed” Smedley' },
    ],
    dynadivine: [
        { id: 260, name: 'Lucille Davis' },
        { id: 261, name: 'Lucille Walker' }, // Former The Cut
        { id: 262, name: 'Danielle ?' },
    ],
    DzarekK: [
        { id: 263, name: 'Eleonor Parker' },
    ],
    Eatindatcereal: [
        { id: 264, name: '[Deputy] Jax Sanctum', factions: ['Law'] },
        { id: 265, name: 'Al Lombardo' },
    ],
    Ellethwen_: [
        { id: 266, name: 'Adaleigh Winters' },
        { id: 267, name: 'Anna Mayfield' },
        { id: 268, name: 'Magnolia Williams' },
        { id: 269, name: 'Nascha Onawa' },
        { id: 270, name: 'Della Sterling' },
    ],
    embernocte: [
        { id: 271, name: '[Deputy] Saffron Mitchell', factions: ['Law'] },
        { id: 272, name: 'Crissy "Cricket" Blitz' },
        { id: 273, name: 'Holly Frost' },
        { id: 274, name: 'Sadhbh O\'Brien', factions: ['Hagen', 'The Humble Bunch'] }, // Is a current Hagen as far as I'm aware.
    ],
    EmptyDome: [
        { id: 275, name: 'Barry Armstrong' },
    ],
    endangeredfinley: [
        { id: 276, name: 'Amelia Riddle' },
        { id: 277, name: 'Bonnie Gray' },
        { id: 278, name: 'Kit' },
        { id: 279, name: 'Paul Güttman' },
    ],
    entspeak: [
        { id: 280, name: 'Faolain McDiarmid' },
        { id: 281, name: 'Bran Speaksy' },
    ],
    EquinoxRP: [
        { id: 282, name: 'Brendyn Cormac' },
    ],
    EricaPlz: [
        { id: 283, name: 'Briget Thorson' },
        { id: 284, name: 'Vera Helvig' },
    ],
    eternalsong: [
        { id: 285, name: 'Kora Vane' }, // Former Sam's Club
    ],
    EthanSchriver: [
        { id: 286, name: 'Leanord Scout', displayName: 2 },
    ],
    ewanruss: [
        { id: 287, name: 'Alfonso Bonucci', factions: ['DiCenzo Famiglia'], nicknames: ['Coach Al', 'Al'], displayName: 4 },
    ],
    extralivia: [
        { id: 288, name: 'Lydia Spade' },
        { id: 289, name: 'Aria Monroe' },
    ],
    Eyebyte: [
        { id: 290, name: 'Amarillo Marnen' },
        { id: 291, name: 'Edbert Trunk' },
        { id: 292, name: 'Norman Hatt' },
        { id: 293, name: 'Rutherford Peabody' },
    ],
    famousivan: [
        { id: 294, name: 'Raul Dominguez' },
        { id: 295, name: 'Manual Salamanca', factions: ['Half Wits'] },
        { id: 296, name: 'Chavez Rodríguez' },
    ],
    Farmhouse78: [
        { id: 297, name: 'Stewart Harington' },
        { id: 298, name: 'Steven Hayes' },
    ],
    fayebles: [
        { id: 299, name: 'Clementine "Clem" Fisher' },
        { id: 300, name: 'Nessa Evans' },
    ],
    feardeer: [
        { id: 301, name: 'Bryn "Sloan" Keith', factions: ['DiCenzo Famiglia'] }, // Former Kettleman. She would disagree, but she was definitely a Kettleman.
    ],
    FhaeLin: [
        { id: 302, name: '[Deputy] Tabitha Thorne', factions: ['Law'], displayName: 1 }, // Senior Deputy
        { id: 303, name: 'Amber Sage' }, // Medic?
    ],
    FireLordRevan: [
        { id: 304, name: 'Hannah Belles' },
    ],
    FistofTheWalrus: [
        { id: 305, name: 'Gabriel Thompson' },
        { id: 306, name: 'Karl Casterbane' },
        { id: 307, name: 'Richard Flemington' },
        { id: 308, name: 'Theodore Timers' },
        { id: 309, name: 'William Killmore' },
    ],
    flaymayweather: [
        { id: 310, name: 'Cade Cross' },
    ],
    Flickerclad: [
        { id: 311, name: 'Evangeline Thorne' },
        { id: 312, name: 'Frankie Czepanski' },
        { id: 313, name: '[Sheriff] Rabbit Windward', factions: ['Law'] },
        { id: 314, name: 'Saskia "Fang" Wolf' },
        { id: 315, name: 'Quinn Thatcher' },
    ],
    ForeheadSkin: [
        { id: 316, name: 'Edmund "Eddy" Reddington', factions: ['The Unhung'] }, // Former Sam's Club
        { id: 317, name: 'Henry Huff' },
        { id: 318, name: 'Joseph Walters' },
        { id: 319, name: 'Morris Sterling' },
        { id: 320, name: 'Chester Fox' },
        { id: 321, name: 'Robert "Bobo" Thompson', nicknames: ['Bob'] }, // Dead?
    ],
    FortyOne: [
        { id: 322, name: 'Sean Mercer' },
    ],
    FrankTheTank5494: [
        { id: 323, name: 'Matthew Isaiah' },
    ],
    Freumont: [
        { id: 324, name: 'Edward Shaw' },
        { id: 325, name: 'Leonardo E. "Leo" Fantoni', factions: ['DiCenzo Famiglia'] },
    ],
    friendly_chick: [
        { id: 326, name: 'Angelica "Angel" Ward', nicknames: ['Angle'] },
        { id: 327, name: 'Charlotte "Lottie" Davis' },
        { id: 328, name: 'Haven Rivers' },
        { id: 329, name: 'Lillian Frost' },
    ],
    FrostFromFire: [
        { id: 330, name: '[Doctor] Bianca Mackenna', factions: ['Medical'] },
    ],
    FunnyMatters: [
        { id: 331, name: 'Clint Brimshaw', assumeChar: true },
    ],
    Gallethril: [
        { id: 332, name: 'Annabel Barnes' },
        { id: 333, name: 'Claire Marsh' },
    ],
    GameBaked: [
        { id: 334, name: 'Mato Tahoma', factions: ['Medical'] },
        { id: 335, name: 'Adriaan' },
        { id: 336, name: 'Nyander Furrest' },
    ],
    GameishTV: [
        { id: 337, name: 'Doug Chipper' },
        { id: 338, name: 'Mike McCoy' },
    ],
    GauchoEscobar: [
        { id: 339, name: 'Gaucho Escobar' },
        { id: 340, name: 'Juana Soto' },
    ],
    GeDWiCK79: [
        { id: 341, name: 'Kennway Mallory' },
    ],
    GeneralEmu: [
        { id: 342, name: 'Lance Divine' },
        { id: 343, name: '[Cadet] Jimmy Avola', nicknames: ['Two Times', 'Jimmy "Two Times"'], displayName: 4, factions: ['Law'] },
    ],
    GeorgiaBanks: [
        { id: 344, name: 'Georgia Banks' },
    ],
    GiveMeUhMinute: [
        { id: 345, name: 'James Willow' },
    ],
    GlitchedHelix: [
        { id: 346, name: 'Ada Standish' },
        { id: 347, name: '[Doctor] Mya Ennis', factions: ['Medical'] },
        { id: 348, name: 'Rubella Davies' },
    ],
    glitchy: [
        { id: 349, name: '[Deputy] James Faraday', factions: ['Law'] },
        { id: 350, name: 'Raymond "Rayray" Willis' },
    ],
    GmanRBI: [
        { id: 351, name: 'Max Brady' }, // Former Sam's Club
        { id: 352, name: 'Gianni Peccati' },
        { id: 353, name: 'Mordecai Butterbee' },
        { id: 354, name: 'Giano Greywolf' },
        { id: 355, name: 'Rudy Allaway' },
    ],
    GnarIyDavidson: [
        { id: 356, name: 'Lluka Darkwood' },
    ],
    goose_thegreat: [
        { id: 357, name: 'Thaddeus Owens' },
    ],
    GooseyOfficial: [
        { id: 358, name: 'Jaimie Quinn' },
        { id: 359, name: 'MaN Sauers' },
        { id: 360, name: 'Speedy McGillagully' },
    ],
    GrammTheGibbon: [
        { id: 361, name: 'Herbert Parker', nicknames: ['Herb', 'Cowboy', 'Young'] }, // Kettleman hangaround
        { id: 362, name: '[Detective] Homer Carnes', factions: ['Law'], nicknames: ['Cop'] },
        { id: 363, name: '"LJ" Little Jimothy', nicknames: ['Kid', 'Soldier'] }, // Former Dead End Kid
        { id: 364, name: 'Clayton Orwell', nicknames: ['Clay Tone', 'Clay Tony Tone'], factions: ['Kettleman Gang'] }, // Dead. Considered to be the one and only leader of the Kettleman Gang
    ],
    GraveGamerTV: [
        { id: 365, name: 'Paulson Greer' },
        { id: 366, name: 'Peter Gray', nicknames: ['Pete'] },
        { id: 367, name: 'Balter Duncans' },
        { id: 368, name: 'Paz Ferrer' },
    ],
    GreenEnigma: [
        { id: 369, name: 'Jericho Blackfoot' },
    ],
    Grennig: [
        { id: 370, name: 'Wesley "Wes" Shields', factions: ['Kettleman Gang'] }, // Former Law
    ],
    grigoriypeppo: [
        { id: 371, name: 'Jack Kettleman', factions: ['Kettleman Gang'], leader: true, displayName: 2 },
        { id: 372, name: 'Robert Dixon' },
        { id: 373, name: 'Manuel Diaz', nicknames: ['El Coyote', 'Coyote'], displayName: 3 },
    ],
    gtplays: [
        { id: 374, name: 'Gene Tiffin' },
        { id: 375, name: 'Granville Turner' },
    ],
    GunterOfficial: [
        { id: 376, name: 'Austin Scott' },
        { id: 377, name: 'James Connor' },
    ],
    HaCha_art: [
        { id: 378, name: 'Ava "La Nina" Jimenes' },
    ],
    HanyClaps: [
        { id: 379, name: 'Levi Sawyer' },
        { id: 380, name: 'Stumpy McBride' },
        { id: 381, name: 'Virgil Sterling' },
    ],
    HappyYouniverse: [
        { id: 382, name: 'Danny Ford' },
    ],
    Haxi_: [
        { id: 383, name: 'Matt Dursk' },
    ],
    Heikima: [
        { id: 989, name: 'Kaifeng Mi' },
    ],
    HerbtheNerd: [
        { id: 384, name: 'Charles Kane' },
    ],
    HeroMexii: [
        { id: 385, name: 'George Shaffer' },
    ],
    Hibblejaybob: [
        { id: 386, name: 'Astrið Aleksdóttir', factions: ['Medical'] },
    ],
    hidaruma: [
        { id: 387, name: 'Rico Kanto' },
    ],
    highkingfrazzal: [
        { id: 388, name: 'James Delany' },
    ],
    Highpriest999: [
        { id: 389, name: 'Athos Lepida' },
    ],
    Hurnani: [
        { id: 390, name: 'James Brown' },
    ],
    Hoop: [
        { id: 391, name: 'Barry Bjornson' }, // Former Sam's Club
        { id: 392, name: 'Clyde Davis', nicknames: ['Dusty Danger'] }, // Leader of the Danger Gang. Dead.
        { id: 393, name: 'Jonathan Redding', nicknames: ['Redshirt'], displayName: 3, factions: ['Half Wits'] },
        { id: 394, name: '[Deputy] Miles Gyles', factions: ['Law'] },
    ],
    Hoss: [
        { id: 395, name: 'Buck Cherry' },
    ],
    IanMMori: [
        { id: 396, name: '[Deputy] Enrique Vespucci', factions: ['Law'] },
        { id: 397, name: 'Ewan Byrne' },
        { id: 398, name: 'Jonathan Coiner' },
        { id: 399, name: 'Nate Coiner' },
        { id: 400, name: '[Trainee] Luther Lake', factions: ['Medical'] },
    ],
    ianriveras: [
        { id: 401, name: 'Hugo Teach' },
    ],
    IBabaganoosh: [
        { id: 402, name: 'Chuck ?' },
    ],
    IboonI: [
        { id: 403, name: 'Elias Boon' }, // Emerald Ranch
    ],
    ICoolioM: [
        { id: 404, name: 'Arie ?' },
    ],
    illwac: [
        { id: 405, name: 'Ira Smith' },
    ],
    Im_HexeD: [
        { id: 406, name: 'Ronnie Tate' },
        { id: 407, name: 'Theodore Ellis' },
    ],
    IMeMine30: [
        { id: 408, name: 'Angelo Clemente' },
    ],
    ImFromTheFuture: [
        { id: 409, name: 'Roscoe Montana', factions: ['The Unhung'] }, // Former Sam's Club
    ],
    inkyblackdreams: [
        { id: 410, name: 'Vera Dragavei' },
    ],
    iruASH: [
        { id: 411, name: 'Kayce Smith' },
    ],
    Its_Brogan2k: [
        { id: 412, name: 'Bogdan Hughes' },
    ],
    ItsAsaii: [
        { id: 413, name: '[Deputy] Buck Montana', factions: ['Law'] },
        { id: 414, name: 'Calvin Oakes' },
        { id: 415, name: 'Eli Ryckman' },
        { id: 416, name: 'Shaine Calhoun' },
        { id: 417, name: 'Wayne Kavanaugh' },
        { id: 418, name: 'Dandy Smells' },
    ],
    itsSANDR: [
        { id: 419, name: 'Deacon Walker' },
    ],
    Iwhuttt: [
        { id: 420, name: 'Archibald Welch' },
        { id: 421, name: 'Houston Gray' },
        { id: 422, name: 'Patch "Patches" Twine' },
    ],
    J0J0: [
        { id: 423, name: 'Delilah Kane' },
        { id: 424, name: 'Effie Parker', factions: ['DiCenzo Famiglia'] }, // Former The Cut
        { id: 425, name: 'Katherine Dunn' },
    ],
    Jackariah: [
        { id: 426, name: 'Bo Whitmore' },
    ],
    jackiejackpot: [
        { id: 427, name: 'Tilly Demeter', assume: 'assumeOther' }, // Dead
        { id: 428, name: 'Jade Ming' },
        { id: 429, name: 'Jezrael King' },
        { id: 430, name: 'Maria Gonzales' }, // Former Bloody Hood
        { id: 431, name: 'Widow Fan' },
        { id: 976, name: 'Sabina ?' },
    ],
    jakeyp0o: [
        { id: 432, name: 'Danner Wynn' },
        { id: 433, name: 'Jim Chatfield' },
    ],
    JamesWob: [
        { id: 434, name: 'Benjamin Jameson' },
    ],
    JaneDizzle: [
        { id: 435, name: 'Jane Pebbleswood' },
    ],
    JarlOfGoats: [
        { id: 436, name: 'Gabriel Lenihan' },
    ],
    JayBritton: [
        { id: 437, name: 'Heath Marker-Brown' },
        { id: 438, name: 'Lucius Alabaster' },
        { id: 439, name: '[Deputy] Obidiah Colt', factions: ['Law'] },
        { id: 440, name: 'Scooter Brown' },
    ],
    jdot: [
        { id: 441, name: 'James McAfee' },
    ],
    Jennybeartv: [
        { id: 442, name: 'Gemma Middleton' },
    ],
    JesterTheRyda: [
        { id: 443, name: 'Jordin Bradley' },
        { id: 444, name: 'Joseph "Hobo Joe" Silvers' },
        { id: 445, name: 'Margrett Anderson' },
    ],
    jobyonekanobi: [
        { id: 446, name: 'Clint Gunther' },
    ],
    Jogiiee: [
        { id: 447, name: 'Eloise Carter' },
        { id: 448, name: 'Daisy Cromwell' },
        { id: 449, name: 'Naomi Fletcher' },
    ],
    JoeFudge: [
        { id: 450, name: 'Ronald Mayfair' },
        { id: 451, name: 'Jackie ?' },
    ],
    johnnyblamz: [
        { id: 452, name: 'Gavin Summers', factions: ['Summers Gang'], leader: true },
        { id: 453, name: 'Jody Quinn' },
        { id: 454, name: 'Logan Miller' },
        { id: 455, name: 'Avery Woods' },
        { id: 456, name: 'Peggy Brown' },
    ],
    Jonthebroski: [
        { id: 457, name: 'Jonathan Divine', nicknames: ['Johnny', 'JBaas', 'J\'Baas', 'J Baas'], displayName: 5, factions: ['The Unhung'] }, // Former Sam's Club
        { id: 458, name: '[Deputy] Jaime Ruth', factions: ['Law'] },
    ],
    JugsySiegel: [
        { id: 459, name: 'Lyle Lancaster' },
    ],
    JunkieEzek: [
        { id: 460, name: 'Jeremiah Harth' },
    ],
    JustAnotherBro: [
        { id: 461, name: 'Billy Blood' },
    ],
    JustSam42: [
        { id: 462, name: '[Ranger] Nathan Thompson', factions: ['Rangers'] },
    ],
    JustxJodi: [
        { id: 463, name: 'Minnie Mines' },
    ],
    KADOsLIVE: [
        { id: 464, name: 'Dan Douglas' },
    ],
    kadxon: [
        { id: 465, name: 'Vivian Lashea' },
    ],
    Kanny1887: [
        { id: 466, name: 'Enrico Rodriguez' },
        { id: 467, name: 'Jonathan Schütz' },
        { id: 468, name: 'Julio Rodriguez' },
    ],
    KateMadison: [
        { id: 469, name: 'Ellie Whitmoore' },
        { id: 470, name: 'Scarlett' },
    ],
    Kelsenpai: [
        { id: 471, name: 'Edward Bolton' },
    ],
    Khandur_: [
        { id: 472, name: 'Tommy Cooper' },
    ],
    killboy011: [
        { id: 473, name: 'John Frisco', displayName: 2 },
    ],
    KillrBeauty: [
        { id: 474, name: 'Deborah "Deb" VanBurton' },
    ],
    KinkyHobo: [
        { id: 475, name: 'Emmett Edwards' },
    ],
    KittyLeigh: [
        { id: 476, name: 'Delilah' },
    ],
    Kiva: [
        { id: 477, name: 'Harper Madison' },
    ],
    Kiwo: [
        { id: 972, name: 'Gretta Inga' },
        { id: 973, name: 'Nancy Bancroft' },
        { id: 988, name: 'Maeve Murdoch' },
    ],
    KlokWrk: [
        { id: 478, name: 'Joshua Reeves' },
    ],
    Kouts3: [
        { id: 479, name: 'Felix Colt' },
    ],
    KripkeyTV: [
        { id: 480, name: 'Sergio Scarpatti', factions: ['DiCenzo Famiglia'] },
    ],
    KristoferYee: [
        { id: 481, name: 'Posie Tiv' },
    ],
    ksinz: [
        { id: 482, name: '[Deputy] Syles MacKenna', factions: ['Law'] },
        { id: 483, name: 'Cucamonga Kid', factions: ['Half Wits'], displayName: 0 },
        { id: 484, name: 'Milliken Fuller', nicknames: ['Mills'], displayName: 3, factions: ['Kettleman Gang'] },
    ],
    KYCaffiend: [
        { id: 485, name: 'Emerson Cain' },
        { id: 486, name: 'Montgomery Flynn' },
        { id: 487, name: 'Tommaso Scaglietti' },
    ],
    Kyle: [
        { id: 488, name: 'Ren Solo' },
    ],
    Kyltrex: [
        { id: 489, name: 'Jackson "Dead-Eye Jack" Pryde', nicknames: ['#1'] }, // Former leader of the Bloody Hoods
        { id: 490, name: 'Louis "Louie" Lancaster' },
        { id: 491, name: 'Luther Von Brandt' },
    ],
    KyQuinn: [
        { id: 492, name: 'Carmen Beckett' },
        { id: 493, name: 'Jackson Riggs' },
        { id: 494, name: 'Miss Mystery' },
        { id: 495, name: 'Olive Wallace' },
        { id: 496, name: 'Portia Hartley' },
        { id: 497, name: '[Deputy] Quinton Ivy', factions: ['Law'] },
        { id: 498, name: 'Trixie Davenport' },
        { id: 499, name: 'Jade ?' },
    ],
    L00seyG005ey: [
        { id: 500, name: 'Elijah Grayson' },
    ],
    LakunaRP: [
        { id: 501, name: 'Tavish Black' },
        { id: 502, name: 'Jack "Ash" James', nicknames: ['Wolf-kin'] },
    ],
    Lawlman: [
        { id: 981, name: 'Jim Walker' },
    ],
    LEAH: [
        { id: 503, name: '[Ranger] Francesca "Frankie" Bright', factions: ['Rangers'], displayName: 2 },
        { id: 504, name: 'Harriet "Hawk" Hawkins', factions: ['Summers Gang'] },
        { id: 505, name: 'Brie Haviour' },
        { id: 506, name: 'Ruthie Samuels' },
    ],
    Lendermations: [
        { id: 507, name: 'Inessa "Miss Match" Bornlof' },
        { id: 508, name: 'Riley Rivens' },
        { id: 509, name: 'Tantallia Tippins' },
    ],
    leoDOTmae: [
        { id: 510, name: 'Eleanor Cain' },
    ],
    LetterJaye: [
        { id: 511, name: 'Wisteria Snowdon' },
        { id: 512, name: 'Poppy Florian' },
    ],
    LimaZuluTango: [
        { id: 513, name: 'Henri Sinclair' },
    ],
    LiteralBear: [
        { id: 514, name: 'Marcus Danner' },
        { id: 515, name: '[Deputy] Negan McAlister', factions: ['Law'], displayName: 1 },
        { id: 516, name: 'Joseph "JoJo" Johanson', factions: ['Half Wits'] },
        { id: 517, name: 'Diego Marin', factions: ['Conductors'] },
    ],
    Lithiaris: [
        { id: 518, name: '[Doctor] Lark Atwood', factions: ['Medical'] },
        { id: 519, name: '[Deputy] Sylvie Chevalier', factions: ['Law'] },
    ],
    livraan: [
        { id: 520, name: 'Hanna Eriksson' },
    ],
    ll_Marziano_ll: [
        { id: 521, name: 'James Lawson' },
        { id: 522, name: 'Lawrence Kelley' },
        { id: 523, name: 'Nitokaayi “Lone Bison” Nawakwa' },
    ],
    LLumiya: [
        { id: 524, name: 'Elizabeth Black' },
    ],
    Lovebot44: [
        { id: 525, name: 'Annie Applebee' },
        { id: 526, name: 'Charlotte Blackwood' },
        { id: 527, name: 'Eustice Dixon' },
        { id: 528, name: 'Lillian Church' },
    ],
    Luckcue: [
        { id: 529, name: 'Alex Mystic' },
    ],
    Lt_Custard: [
        { id: 530, name: 'Kian McNulty' },
    ],
    Lt_Raven: [
        { id: 531, name: '[Father] Samuel O\'Keeffe', displayName: 2 },
        { id: 532, name: '? ?' },
    ],
    luka_aus: [
        { id: 533, name: 'Lukeas Winsmore' },
        { id: 534, name: 'Louis O\'Neil' },
    ],
    Lunabee: [
        { id: 535, name: 'Abigale Hart' },
    ],
    Lyndi: [
        { id: 536, name: 'Delilah Deveaux' },
    ],
    MaceyMclovin: [
        { id: 537, name: 'Jackson Slater' },
    ],
    mackaelroni: [
        { id: 538, name: 'Bobby-Sue Fredrickson' },
        { id: 539, name: 'Everett Bondurant' },
        { id: 540, name: 'Jarvis Jones' },
        { id: 541, name: 'Mack Fredrickson' },
        { id: 542, name: 'William White' },
    ],
    MackieLTD: [
        { id: 543, name: '[Deputy] Jack Cameron', factions: ['Law'] },
        { id: 544, name: 'Scott Samuel' },
        { id: 545, name: 'Nathanial ?', nicknames: ['Smoke'] },
        { id: 546, name: 'Richard Watson' },
        { id: 547, name: 'Terrance King' },
    ],
    Madmoiselle: [
        { id: 548, name: 'Lily Landry' },
        { id: 549, name: 'Oola Lafayette' },
    ],
    MafiaDrew: [
        { id: 550, name: 'Donatello "Don" Jameson' },
    ],
    MannersMaketh_: [
        { id: 551, name: 'Horatio Hudson' },
    ],
    MartyO248: [
        { id: 552, name: 'Bobby Brampton' },
        { id: 553, name: 'Dmitri Crenshaw' },
        { id: 554, name: 'Marty Hanes' },
        { id: 555, name: 'Ernie Crabgrass' },
    ],
    MattBreckly: [
        { id: 556, name: 'Dan Gerous' },
    ],
    MaverickHavoc: [
        { id: 557, name: 'Cornellius Orvid' },
    ],
    McBlairTV: [
        { id: 558, name: 'Cyrus McGill' },
    ],
    MDMums: [
        { id: 559, name: 'Edward Moore' },
        { id: 560, name: '[Cadet] Matthew McAllister', factions: ['Law'] },
    ],
    MEKABEAR: [
        { id: 561, name: '[Deputy] Audrey Dusk', factions: ['Law'] },
        { id: 562, name: 'Goldie Fisher', factions: ['Dead End Kids'] }, // Former Kettleman.
    ],
    MeMine30: [
        { id: 563, name: 'Walt McGrath' },
    ],
    Mhaple_: [
        { id: 564, name: 'Morgan Lee' },
    ],
    Mick: [
        { id: 565, name: 'Gladys Berry' },
    ],
    MinksOfMars: [
        { id: 566, name: 'Irene "Peaches" Corvus', nicknames: ['Forbidden Fruit'], factions: ['The Unhung', 'Hagen'] }, // Former Sam's Club
        { id: 567, name: 'Ana Stravinski' },
        { id: 568, name: 'Willow Wisp' },
    ],
    mishkaxoxo: [
        { id: 569, name: 'Mishka Agapova' },
    ],
    MrArkay: [
        { id: 570, name: 'Casper Hems' },
    ],
    MrFreak_TV: [
        { id: 571, name: 'Arliss Hagen' },
        { id: 572, name: 'Colt Youngblood' },
        { id: 573, name: 'Fergus McDuffy' },
        { id: 574, name: 'Mal Tompkins' },
        { id: 575, name: 'Orland Boggs' },
        { id: 576, name: 'Blem Jinkins' },
    ],
    MrGoonBones: [
        { id: 577, name: 'Goon "Goom-Boobie" Bones' },
    ],
    MrMoonsHouse: [
        { id: 578, name: 'Tommy Roach', nicknames: ['Two Snakes', 'Tommy Two Snakes'], displayName: 4, assumeChar: true }, // Former Momma's Boys, but I'm not sure if they still exist or not. May have been the leader?
        { id: 579, name: 'Kang Colton', factions: ['Coltons'] },
    ],
    MrPandaaBear: [
        { id: 580, name: 'Cathal McCarthy' },
    ],
    MsVenture: [
        { id: 581, name: 'Martina Guzman', factions: ['Hagen'] },
    ],
    muhzzy: [
        { id: 582, name: 'Dr. Cloth', displayName: 0 },
        { id: 583, name: 'Grim' },
        { id: 584, name: 'Herman Wilbur' },
        { id: 585, name: 'Leon Taylor' },
        { id: 586, name: 'Conny Cage' },
    ],
    Myre: [
        { id: 587, name: 'Benoit Baratie' },
        { id: 588, name: 'Crispin Cantabile' },
        { id: 589, name: '[Ranger] Dallas Wolf', factions: ['Rangers'] },
        { id: 590, name: 'Phineas Fentworth' },
        { id: 591, name: 'Saul South' },
    ],
    Mythematic: [
        { id: 592, name: 'Ben Bealz' },
        { id: 593, name: 'Chauncy "The Barman" Charles' },
        { id: 594, name: 'Cooper Garret' },
        { id: 595, name: 'Jack Woulfe' },
        { id: 596, name: 'Pikup Dropov' },
    ],
    Nakkida: [
        { id: 597, name: 'Lyra Woods' },
    ],
    nathankb_: [
        { id: 598, name: 'Dug Dug', nicknames: ['Dug Money'] },
    ],
    NaniNerd: [
        { id: 599, name: 'Ivy Hill' },
    ],
    Nbodo: [
        { id: 600, name: 'Peter Rockwell' },
    ],
    NiaDrools: [
        { id: 601, name: 'Madeline "Moxy" Maddox' },
        { id: 602, name: 'Edith "Ed" Gretchen', factions: ['Conductors'] },
        { id: 603, name: 'Guinevere "Snow" Snow' },
        { id: 604, name: 'Penelope Kringle', nicknames: ['Queen of Roaches'], factions: ['Half Wits'] },
    ],
    Nidas: [
        { id: 605, name: 'Eustace Goodwin' },
    ],
    NoahsDay: [
        { id: 606, name: 'Cliff Otis' },
    ],
    Nopheros: [
        { id: 607, name: 'Robert Fisher' },
    ],
    NOTmackfrew: [
        { id: 608, name: 'Seymour Humphries' },
    ],
    NouieMan: [
        { id: 609, name: 'James Henderson' },
        { id: 610, name: 'Jim Fandango' },
        { id: 611, name: 'John Tatum' },
        { id: 612, name: 'Leviticus Starr' },
        { id: 613, name: 'Louis Darling' },
        { id: 614, name: 'William Martinez' },
    ],
    Novatic: [
        { id: 615, name: 'Doug Heartland' },
    ],
    Novatorium: [
        { id: 616, name: 'Minnie Bean' },
        { id: 617, name: 'Trix' },
    ],
    nziech: [
        { id: 618, name: 'Kuniklo', factions: ['Kettleman Gang'] },
        { id: 619, name: 'Orpheus "Buck" Buck', factions: ['Half Wits'] },
    ],
    OfficialBea: [
        { id: 974, name: 'Lois Miles' },
    ],
    og_cush00: [
        { id: 620, name: 'Walter Bridges' },
    ],
    OhHeyItsFunk: [
        { id: 621, name: 'Lucius Tubbs' },
    ],
    ohheyliam: [
        { id: 622, name: 'Oliver "Ollie" Quil', factions: ['Kettleman Gang'] },
    ],
    OhJessBee: [
        { id: 623, name: 'Carmine Crimson' },
    ],
    ohnopojo: [
        { id: 624, name: 'Billy Kim' },
    ],
    oldkelvo: [
        { id: 625, name: 'Jack Crow' },
        { id: 626, name: 'Beth Gout' },
        { id: 627, name: 'Carver Reilly' },
        { id: 628, name: 'Boyd Cassidy' },
    ],
    onebaw: [
        { id: 995, name: 'John Loch' },
    ],
    Orcish: [
        { id: 629, name: '[Deputy] Allistair McGregor', factions: ['Law'] }, // Senior Deputy
        { id: 630, name: 'Billy Beetur' },
        { id: 631, name: 'Otis Potts' },
        { id: 632, name: 'Richard Westlake' },
        { id: 633, name: 'Tripp Riggs' },
    ],
    Ormais: [
        { id: 634, name: 'Lloyd Conway' },
    ],
    PapaDrgnz: [
        { id: 635, name: 'Shiv Bailey' },
    ],
    Paracast: [
        { id: 636, name: 'Erasmus South' },
    ],
    PBandJLee: [
        { id: 637, name: 'Elsie Fletcher' }, // TODO: `factions: ['News']` maybe?
    ],
    PeachTreeMcGee: [
        { id: 638, name: 'Charlotte Toussaint' },
    ],
    peachycoaster: [
        { id: 639, name: 'Chrissy Snow' },
        { id: 640, name: 'Toosie Loo' }, // Kettleman hangaround? I would consider her Kettleman, but Jack doesn't
        { id: 641, name: 'Kipper O\'Neil' },
    ],
    Pengwin: [
        { id: 642, name: 'Staniel Wilkerson' },
    ],
    PENTA: [
        { id: 997, name: 'Walter Thomas', nicknames: ['Big Walter Bulge'] },
    ],
    Pers: [
        { id: 643, name: 'Dr. Carrie Williams' },
        { id: 644, name: 'Mischa Crane' },
    ],
    Pezz: [
        { id: 645, name: 'Cid Speedwagon', nicknames: ['Highwayman'] },
    ],
    PibbJont: [
        { id: 646, name: '[Cadet] Thatcher Mantell', factions: ['Law'] },
    ],
    pinkchyu: [
        { id: 647, name: 'Caroline Kroll' },
        { id: 648, name: 'Kelly Crockett' },
        { id: 649, name: 'Dorothy Dean' },
        { id: 650, name: 'Violet Rockefeller' },
    ],
    Pinkfie: [
        { id: 651, name: 'Abigail Burke' },
    ],
    Point1985: [
        { id: 652, name: 'Joe Jackson' },
    ],
    potsie30: [
        { id: 653, name: 'Doug Landers' },
    ],
    privyLore: [
        { id: 654, name: 'Wren Lebow', nicknames: ['Lilith', 'The Siren'] }, // Former Sam's Club
        { id: 655, name: 'Kathryn ?' },
        { id: 656, name: 'Minerva Ackerman' },
    ],
    ProJB: [
        { id: 657, name: 'Odin Borr' },
    ],
    Psikage: [
        { id: 658, name: 'Oscar Caraballo' },
    ],
    PuckNatorGaming: [
        { id: 659, name: 'Ernest Thorton' },
    ],
    PukingFerrets: [
        { id: 660, name: 'Alice Quinn', factions: ['Kettleman Gang'] },
    ],
    Pumpkinberry: [
        { id: 661, name: 'Honey Sparks' },
        { id: 662, name: 'Imogen Blackwell' },
        { id: 663, name: 'Nora Boone' },
        { id: 664, name: 'Omens' },
    ],
    Question_Box: [
        { id: 665, name: 'Lydia Lewis' }, // Former Sheriff
        { id: 666, name: 'Blaire Turner' },
        { id: 993, name: 'Opal Davis' }, // Deputy hopeful
    ],
    Quip_TV: [
        { id: 667, name: '[Deputy] Dove Hopkins', factions: ['Law'] },
        { id: 668, name: 'Sally Higgins', nicknames: ['Shotgun'] },
        { id: 669, name: 'Sofia Sherman' },
    ],
    RaddRema: [
        { id: 670, name: 'Bonnie Sunn' },
    ],
    Rayormy: [
        { id: 671, name: 'Adelaide Henry' },
    ],
    RayforRachel: [
        { id: 672, name: 'Winifred "Dot" Barlow' },
        { id: 673, name: 'Shirley Lemons', nicknames: ['Cowgirl'] },
    ],
    REKKRPRO: [
        { id: 674, name: 'Rekks Tanner' },
    ],
    RickMongoLIVE: [
        { id: 675, name: 'Cole Dalton' },
        { id: 676, name: 'Furio Bonanno' },
    ],
    Roach_tm: [
        { id: 677, name: 'Tony Moretti', factions: ['DiCenzo Famiglia'] },
    ],
    rosco: [
        { id: 678, name: 'Awkward Johnson', displayName: 0 }, // Dead.
        { id: 679, name: 'Frank Church' },
        { id: 680, name: 'John Hell' },
    ],
    RookGoose: [
        { id: 681, name: 'Leto McMorris ' },
    ],
    rossthehsauce: [
        { id: 682, name: 'Forest Fish', factions: ['Guppy Gang'] },
        { id: 683, name: 'Dominic Disouza', factions: ['DiCenzo Famiglia'] },
        { id: 684, name: 'Lionel Miles' },
    ],
    RY4N: [
        { id: 685, name: 'Christine "Momma" Thomas' }, // Former Momma's Boys? Maybe leader of Momma's Boys?
        { id: 686, name: 'Joe "Moonshine Joe" Burns' },
        { id: 687, name: 'Randy Randy' },
        { id: 688, name: 'Thomas Church' },
    ],
    s0upes: [
        { id: 689, name: 'Ace Grimmer' },
    ],
    s5ashadow01: [
        { id: 690, name: '[Deputy] Adam Skye', factions: ['Law'] },
        { id: 691, name: 'Froiland Jackson' },
    ],
    SaberTV: [
        { id: 692, name: 'Constance Miles' },
    ],
    SaffyPie: [
        { id: 693, name: 'Cassidy Reynolds' },
    ],
    saffyra: [
        { id: 694, name: 'Birdy Hawke' },
        { id: 695, name: 'Poppy Pascal' },
    ],
    SalsaRage: [
        { id: 696, name: 'Norman McCain' },
        { id: 697, name: 'Bitt McGee' },
    ],
    Sammyyyyyyy: [
        { id: 698, name: 'Lizzie Clarke' },
    ],
    sannmann_: [
        { id: 699, name: 'Jack Milton' },
    ],
    sarahpeathatsme: [
        { id: 700, name: 'Ruby Raines' },
    ],
    satyr_queen: [
        { id: 701, name: 'Cornelius Tias' },
        { id: 702, name: 'Curtis Cunningham' },
        { id: 703, name: 'Daisy Shields' },
        { id: 704, name: 'Jolene Quinn' },
        { id: 705, name: 'Josiah Matthews' },
        { id: 706, name: 'Sam Bridges' },
        { id: 707, name: 'Bethany Ryder' },
    ],
    ScarletRosePlays: [
        { id: 708, name: 'Allison Chase' },
        { id: 709, name: 'Bella Baker' },
        { id: 710, name: '[Deputy] Zoe Winters', factions: ['Law'] },
    ],
    SciFri: [
        { id: 985, name: 'Pat Hetic' },
    ],
    ScottJitsu: [
        { id: 711, name: 'Reno Cash' },
    ],
    Scriffboy: [
        { id: 712, name: 'Tane' },
    ],
    Scwair: [
        { id: 713, name: 'Roman Blanco' },
        { id: 714, name: 'Teddy Graves' },
    ],
    seakeon: [
        { id: 715, name: 'Eoghan Quinn' },
        { id: 716, name: 'Pat Campbell' },
        { id: 717, name: 'William Stone' },
    ],
    section9_Browncoat: [
        { id: 718, name: '[Deputy] Ned Fuller', factions: ['Law'] },
        { id: 719, name: 'Nick Carver' },
        { id: 720, name: 'Loup Farrow' },
    ],
    Selvek: [
        { id: 721, name: 'Clayton Colton', factions: ['Coltons'] },
    ],
    SencneS: [
        { id: 722, name: 'Desmond Potts' },
    ],
    sgttyn: [
        { id: 723, name: 'Jacob Dubois' },
        { id: 724, name: 'Norris Olson' },
        { id: 725, name: '[Deputy] Sam Winters', factions: ['Law'] }, // Sam Winters
    ],
    shadowsINsilence: [
        { id: 726, name: 'Emily Marie Kenward' },
    ],
    Shake4L: [
        { id: 727, name: 'Buzz Bleu' }, // Former Sam's Club.
    ],
    ShawW0w: [
        { id: 728, name: 'Clarence Crudewater' },
    ],
    SheepDog59: [
        { id: 729, name: 'Wyatt Mason Kennedy' },
    ],
    Shyirasky: [
        { id: 730, name: 'Twitch Cooper' },
    ],
    Sidkriken: [
        { id: 731, name: 'Dane Swan', factions: ['Law'] },
        { id: 732, name: 'Gator Weaver' },
        { id: 733, name: 'Odysseus Kain' },
        { id: 734, name: 'Mr. White', displayName: 0 }, // TODO: Don't know first name
    ],
    Silbullet: [
        { id: 735, name: '[Deputy] Shawn Maple', factions: ['Law'] },
        { id: 736, name: 'Stefano Amendo' },
        { id: 737, name: 'Leopold Von Schitzen' },
    ],
    SilentSentry: [
        { id: 738, name: 'Emmet "Stripes" Wagner' },
    ],
    SincerelyIndie: [
        { id: 739, name: 'Truly Tillery' },
    ],
    SinnixTv: [
        { id: 740, name: 'Frank Brower' },
    ],
    SirisLuv: [
        { id: 741, name: 'Denise Neve' },
    ],
    Skids_N_Cones: [
        { id: 742, name: '"Old Greg" Boone', nicknames: ['Old Greg'], displayName: 3 },
        { id: 743, name: 'Bear' },
        { id: 744, name: 'Henry "West"' },
    ],
    SkoogFFS: [
        { id: 745, name: 'Billy Joe Barber', nicknames: ['Billy Joe', 'BJB'], displayName: 4, factions: ['The Nameless'] },
        { id: 746, name: 'Lefty Lone' },
        { id: 747, name: 'Reidar Hagen' },
    ],
    SLiMt: [
        { id: 748, name: 'Jimmy "Slim Jim" Slimper' },
    ],
    smorgenborgendorgen: [
        { id: 749, name: 'Martha Crook' },
    ],
    sneakyShadower: [
        { id: 750, name: '[Deputy] Abigail Jones', factions: ['Law'] }, // I'm pretty sure she's a reporter
        { id: 751, name: 'Azula Brooks' },
        { id: 752, name: '[Doctor] Isabella Vautour', factions: ['Medical'] },
        { id: 753, name: '[Deputy] Jackie Lockwood', factions: ['Law'] },
        { id: 754, name: 'Raven Bennett' },
    ],
    SocialTortoise: [
        { id: 755, name: 'Billy Jackson' },
    ],
    Sock22: [
        { id: 756, name: 'Daniel "Danny" Moss' },
    ],
    SolidSinn: [
        { id: 757, name: 'Carl Lawsen' },
        { id: 758, name: 'Jed Wicker', factions: ['Kettleman Gang'] },
        { id: 759, name: 'Roger Thyne' },
    ],
    SomethingBees: [
        { id: 760, name: '[Ranger] Isla White', factions: ['Rangers'] },
        { id: 761, name: 'Berdie Lloyd' },
        { id: 762, name: '[Deputy] Cait McAlister', factions: ['Law'] },
        { id: 763, name: 'Amarok' },
    ],
    Sonneflower: [
        { id: 764, name: 'Eliana Diaz' },
        { id: 765, name: 'Jean Rivers' },
    ],
    SpaceAndromeda: [
        { id: 766, name: '[Deputy] Aoife McCarthy', factions: ['Law'] }, // Senior Deputy
        { id: 767, name: 'Clarabelle Manson' },
        { id: 768, name: 'Cora Crow' },
    ],
    Spaceboy: [
        { id: 769, name: 'James Randal', nicknames: ['Jim Beef'] },
    ],
    Speckie_: [
        { id: 770, name: '[Deputy] Andrew Hamilton', factions: ['Law'] },
        { id: 771, name: 'Emmet Gray' },
        { id: 772, name: 'James Parker' },
        { id: 773, name: 'Archie ?' }, // Last name maybe “Richardson”?
    ],
    spicybackpain: [
        { id: 774, name: 'Pepper Jackson' },
        { id: 775, name: 'Tormund Kray' },
    ],
    sporkerific: [
        { id: 776, name: 'Rosamaria Sandoval' },
    ],
    SprayNprayErik: [
        { id: 777, name: 'Butch Marlow', factions: ['Hagen'] },
    ],
    spriteleah: [
        { id: 778, name: '[Ranger] Francesca "Frankie" Bright', factions: ['Rangers'], displayName: 2 },
        { id: 779, name: 'Harriet "Hawk" Hawkins', factions: ['Summers Gang'] },
        { id: 780, name: 'Brie Haviour' },
        { id: 781, name: 'Ruthie Samuels' },
    ],
    Sput: [
        { id: 782, name: 'Marvin Mayflower' },
        { id: 980, name: 'Biwwy Baker' },
    ],
    squareiz: [
        { id: 783, name: 'Eddy Doyle', nicknames: ['Ed'] },
        { id: 979, name: 'Moe McQueen' },
        { id: 983, name: 'Malaha Mage' },
    ],
    Ssaab: [
        { id: 784, name: 'Sam Baas', factions: ['The Unhung'], leader: true, nicknames: ['Dank Outlaw'], assumeChar: true }, // Former Sam's Club. leader of Sam's Club
        { id: 785, name: 'Ali Baba', displayName: 0 },
        { id: 786, name: '[Deputy] Leo Slack', factions: ['Law'] },
    ],
    Ssmacky: [
        { id: 787, name: 'Jackson Marsh' },
    ],
    StarBarf: [
        { id: 788, name: 'Elich Doherty' },
    ],
    stardaze: [
        { id: 789, name: 'Edie Barlowe' },
    ],
    SteelRain27: [
        { id: 790, name: 'Moses Maddox' },
    ],
    Stichboy: [
        { id: 791, name: 'Jeremiah Smoak' },
    ],
    StormBreaker: [
        { id: 792, name: 'Jasper Dickens' },
        { id: 793, name: 'Gretchen Morgan' },
    ],
    Strippin: [
        { id: 794, name: 'Archie Turner' },
    ],
    suddenly_pandas: [
        { id: 795, name: 'Flamboise Chambord' },
        { id: 796, name: 'Harry Chapman' },
        { id: 797, name: '[Sheriff] Hudson Hart', factions: ['Law'] },
        { id: 798, name: 'Kevin Higgins' },
        { id: 799, name: 'Mackenzie Kale' },
        { id: 800, name: 'Boyd Banks' },
    ],
    Sugarsockzgg: [
        { id: 801, name: 'Mason Memphis' },
    ],
    sweetcraw: [
        { id: 802, name: '[Ranger] Joey Crawford', factions: ['Rangers'] },
        { id: 803, name: 'Ephraim Teller' },
    ],
    Sylasism: [
        { id: 804, name: 'Atty Windward' },
        { id: 805, name: 'Franklin Czepanski' },
        { id: 806, name: 'Bartleby Sinclair' },
    ],
    Syraphic: [
        { id: 807, name: 'Emilia "Emi" Song' },
    ],
    TacticalGH0STT: [
        { id: 808, name: 'Beaux Carter' },
    ],
    TaintedRUMBLER: [
        { id: 809, name: 'Drew Peters', assume: 'assumeOther' },
    ],
    TalkingRecklessPodcast: [
        { id: 810, name: 'Jeremiah Rent' },
    ],
    TankGirl: [
        { id: 811, name: 'Effie Mae Braithwaite' }, // Dead.
        { id: 812, name: 'Gloria Bonanno' },
    ],
    tanklovesyou: [
        { id: 813, name: 'Ethan Cross' },
        { id: 814, name: 'Eugene Goodman' },
        { id: 815, name: '[Deputy] Jean-Pierre Lefrancois', factions: ['Law'] },
        { id: 816, name: 'Julius "The Jade King" Bradshaw' },
        { id: 817, name: '[Marshal] Rico Ortega', nicknames: ['Deputy Marshal'], factions: ['Law'] }, // Deputy Marshal
    ],
    Taranix: [
        { id: 818, name: 'Mattias Temble' },
    ],
    Tasara22: [
        { id: 819, name: '[Deputy] Jane Ripley', factions: ['Law'] }, // Senior Deputy
        { id: 820, name: 'Betty Butcher' },
        { id: 821, name: 'Madame Milena' },
        { id: 822, name: 'Monica Peach' },
        { id: 823, name: 'Oneida Zonta' },
        { id: 824, name: 'Precious Cargo' },
        { id: 825, name: 'Gertrude Nelson' },
    ],
    Tech_Otter: [
        { id: 826, name: 'Chester McGuckin' },
        { id: 827, name: 'Nathan Riggs' },
    ],
    TehJamJar: [
        { id: 828, name: 'Alvin Biggs' },
        { id: 829, name: 'Dwight Bridger', displayName: 2, factions: ['The Humble Bunch'] },
        { id: 830, name: 'Klaus Pudovkin' },
        { id: 831, name: 'Luke Colton', factions: ['Coltons'] },
    ],
    Thadrius: [
        { id: 832, name: 'Jimmy Frick' },
    ],
    ThatStickyTickle: [
        { id: 975, name: 'Dustin Barlowe' },
    ],
    ThatTrollsomeGuy: [
        { id: 833, name: 'Logan Callaway' },
        { id: 834, name: '[Deputy] Jonathan Robertson', factions: ['Law'] },
        { id: 835, name: 'Alexander Rose' },
    ],
    The_Beautiful_Void: [
        { id: 836, name: 'Katherine Byrne' },
    ],
    The_Devils_Son: [
        { id: 837, name: 'Fredrick Smythe' },
    ],
    The_Metro_Man1: [
        { id: 838, name: 'Jim Sky' },
        { id: 839, name: 'Felix Nileson' },
        { id: 840, name: 'Henry ColeSlaw' },
        { id: 841, name: 'Millard Van Dough' }, // TODO: Confirm last name
    ],
    The_Mountain_Troll: [
        { id: 842, name: 'Basey "Red" Bohannon' },
    ],
    TheAaronShaq: [
        { id: 843, name: 'Kenneth "Ricky" Randall' },
        { id: 844, name: 'Wesley Spats' },
    ],
    TheAmelina: [
        { id: 845, name: 'Elisabeth "Ellie" Beauregard' },
    ],
    TheBanditKingUK: [
        { id: 846, name: 'Damien Gallagher' },
        { id: 847, name: 'Sebastien Woodrow' },
        { id: 848, name: 'Tobias Graves' },
        { id: 849, name: 'Adam Brand' },
        { id: 850, name: 'Jonas Steel' },
    ],
    TheChief1114: [
        { id: 996, name: 'Jimmy "Toad" Blister' },
    ],
    TheCocacolafreak: [
        { id: 851, name: 'Clint "Busty Danger" David' },
        { id: 852, name: 'Ernst Schneider' },
        { id: 853, name: 'Javier Moreno' },
        { id: 854, name: 'Thomas Schneider', nicknames: ['Butcher Of Berlin'] },
        { id: 855, name: 'W. J. Patterson' },
    ],
    TheCourtJester: [
        { id: 856, name: 'Dr. Nikolai' },
    ],
    TheDasTony: [
        { id: 857, name: 'Antonio "Tony" Salerno', factions: ['DiCenzo Famiglia'] },
    ],
    TheFoodcartGamer: [
        { id: 858, name: 'Felix Ellis' },
    ],
    TheForerunner: [
        { id: 859, name: 'Nico Aventi' },
    ],
    TheGawkyGoat: [
        { id: 860, name: 'Cillian McCarty' },
    ],
    TheGeneralSmokey: [
        { id: 861, name: 'Edwin Braithwaite', nicknames: ['Eddie'], factions: ['Kettleman Gang'] }, // Former Dead End Kid. Former Kettleman
    ],
    TheGoochTV: [
        { id: 862, name: 'Becker Lang' },
    ],
    TheHairyCelt: [
        { id: 863, name: 'Ronnie Hurbert' },
    ],
    TheHardcorian: [
        { id: 864, name: 'Edgar Buckle' },
        { id: 865, name: 'Bill Hill' },
        { id: 866, name: 'Lucius Thorn' },
        { id: 867, name: 'Pope Langer' },
        { id: 868, name: 'Ron Bryer' },
        { id: 869, name: '[Deputy] William Campbell', factions: ['Law'] },
    ],
    TheJasonPhoenix: [
        { id: 870, name: 'Fenix Hayston' },
        { id: 871, name: '[Deputy] John Claymore', factions: ['Law'] },
    ],
    theLGX: [
        { id: 872, name: 'Abner Ace' },
    ],
    TheObsidianTravelersCo: [
        { id: 873, name: 'Cornileus Moon' },
        { id: 874, name: 'Amadeus "Adonis" Silver' },
    ],
    ThePatrician69: [
        { id: 875, name: 'Nate Casey' }, // Former Kelly Gang
    ],
    TheRandomChick: [
        { id: 876, name: '[Doctor] Bella Trix', nicknames: ['Bellatrix'], displayName: 3, factions: ['Medical'] },
        { id: 877, name: 'Poppet Deveaux' },
    ],
    TheRudyDuck: [
        { id: 986, name: 'Phineas "Phi" Klein' },
    ],
    TheSlappyOne: [
        { id: 878, name: 'Marcus Hutchinson' },
    ],
    TheStreetMagnet: [
        { id: 879, name: 'Josiah Shepard' },
    ],
    TheTofuSamurai: [
        { id: 880, name: 'Jimothy James' },
        { id: 881, name: 'John Crath' },
        { id: 978, name: 'Charles Haberdash' },
    ],
    theweyu: [
        { id: 882, name: 'Alawa "Ali" Meota' },
    ],
    TheZenPunk: [
        { id: 883, name: 'William "Wild Willy" Brown' },
    ],
    ThinkingQuill: [
        { id: 884, name: 'Cian Malloy' },
        { id: 885, name: 'Hymnal Smed' },
        { id: 886, name: 'Elliot Teller' },
    ],
    thisisgillie: [
        { id: 887, name: 'Balwinder Singh' },
    ],
    ThrallJo: [
        { id: 888, name: 'Corvus Clements' },
    ],
    TiltedSun: [
        { id: 889, name: 'Madison Windward' },
        { id: 890, name: 'Clem Griffiths' },
    ],
    Timmac: [
        { id: 891, name: 'Gomer Colton', factions: ['Coltons'] },
        { id: 892, name: 'Enzo Valentino' },
    ],
    tmcrane: [
        { id: 893, name: 'Lucius Bickmore' },
        { id: 894, name: 'Alfred Kidd' },
    ],
    TnFD: [
        { id: 895, name: 'Julian Charleston' },
    ],
    ToneeChoppa: [
        { id: 896, name: 'Antonio Borges' },
    ],
    Tonixion: [
        { id: 897, name: 'Howard Purdnar' },
        { id: 898, name: 'Samson Graves' },
    ],
    toodlehausn: [
        { id: 899, name: 'Adelae "Ada" Wright' },
        { id: 900, name: 'Sadie Stronge' },
        { id: 901, name: 'Mary Rassler', nicknames: ['Old'] },
    ],
    travpiper: [
        { id: 902, name: 'William "Bill" Gunner', nicknames: ['Carlos Sanchez', 'Carlos'] },
    ],
    TullyCuffs: [
        { id: 903, name: 'Hugo Hopper' },
    ],
    Two_Beans_2B: [
        { id: 904, name: 'Dieter Krankenkasse' },
        { id: 905, name: 'Hawthorne Sapling' },
        { id: 906, name: 'Jonathan Badtmann' },
    ],
    UberHaxorNova: [
        { id: 907, name: 'Rooporian Roo', factions: ['Independent', 'Guppy Gang'], displayName: 2 },
    ],
    UberJazer: [
        { id: 908, name: 'Nahmala "Wolf" Wolfe' }, // Wapiti?
    ],
    Ukrainy_: [
        { id: 909, name: 'Willie Reuben' },
    ],
    unstoppableLARN: [
        { id: 910, name: 'Gertrude Cockburn' },
        { id: 911, name: 'Razormouth' },
        { id: 912, name: 'Terry Hogan' },
    ],
    upfl0w: [
        { id: 913, name: 'Roman Blanco' },
        { id: 914, name: 'Teddy Graves' },
    ],
    valenam: [
        { id: 915, name: 'Laura Flores' },
    ],
    ValenVain: [
        { id: 916, name: 'Salazar Fisk' },
    ],
    valkyrionrp: [
        { id: 917, name: 'Jack Volker' },
    ],
    Vantilles: [
        { id: 994, name: '[Deputy] John Beckwith', factions: ['Law'] }, // Unsure of rank
    ],
    Vaughtex: [
        { id: 992, name: 'Henry Laveer' },
    ],
    VersaLK: [
        { id: 918, name: 'Carlo Marciano', factions: ['DiCenzo Famiglia'] },
    ],
    VERTiiGOGAMING: [
        { id: 919, name: '[Deputy] Boyd Kerrigan', factions: ['Law'] }, // Former Kerrigan Ranch
        { id: 920, name: 'Joey "The Wallaby Kid" Johns', factions: ['Dead End Kids'] },
        { id: 921, name: 'Les Darcy' },
        { id: 922, name: 'Bazz Kerrigan', factions: ['Kettleman Gang'] }, // leader of Kerrigan Ranch. Dead.
        { id: 923, name: 'Clarence McCloud' },
    ],
    Viviana: [
        { id: 924, name: 'Mary Anne LeStrange' },
    ],
    VTM___: [
        { id: 925, name: 'Boone Morales' },
        { id: 926, name: 'Guy Hyneman' },
    ],
    vtrich: [
        { id: 927, name: 'Fester Buckland' },
    ],
    WaistcoatDave: [
        { id: 928, name: 'Dr. C.J Matthews' },
    ],
    WANTED_MANIAC: [
        { id: 929, name: 'Brian Wright' }, // Former Senior Deputy
        { id: 930, name: 'Taylor Hicks' },
        { id: 931, name: 'William "Bill" Carver' },
        { id: 932, name: 'Benji Bell' },
    ],
    WeeJimcent: [
        { id: 933, name: 'Sergio ?' },
    ],
    WestCoastWayne: [
        { id: 934, name: 'Ervin Haywood' },
        { id: 935, name: 'Charles "Smoke" Dunn' },
    ],
    Wetbow: [
        { id: 936, name: 'Amadeus Abraham' },
    ],
    WhiskeyTheRedd: [
        { id: 937, name: 'Devyn "Dakota" Dunning' },
    ],
    WingTroker: [
        { id: 938, name: 'Bert Silver' },
        { id: 939, name: 'Sally Cooper-Borr' },
    ],
    Wombax: [
        { id: 940, name: 'Nash' }, // Former Kettleman. Dead.
    ],
    woplotomo: [
        { id: 941, name: '? ?', assume: 'neverNp' },
    ],
    Wrighty: [
        { id: 942, name: 'Jack Reed' },
        { id: 943, name: '[Marshal] Logan Monroe', factions: ['Law'] }, // Deputy Marshal
        { id: 944, name: 'Roscoe Riggs' },
        { id: 945, name: 'Joseph Carter' },
    ],
    WTFGameNation: [
        { id: 946, name: 'Morgan Calloway' },
    ],
    Xiceman: [
        { id: 947, name: 'Michael Bayo', factions: ['The Unhung'] },
        { id: 948, name: 'Andrew Kennedy' },
    ],
    xlt588gaming: [
        { id: 949, name: 'Adam Garica' },
    ],
    XxAshleyxX: [
        { id: 950, name: 'Rayven Hope', nicknames: ['Rayvn'] },
        { id: 951, name: 'Zola Caiman' },
        { id: 952, name: 'Noel "Leon" Taylor' },
    ],
    YatoTheMad: [
        { id: 953, name: 'Cassius Evans' },
        { id: 954, name: 'Charles Campbell' },
        { id: 955, name: 'Liam Reilly' },
        { id: 956, name: 'Alexander Williams' },
    ],
    yeka221: [
        { id: 957, name: 'Tabitha "Tibbit" Birch' },
        { id: 977, name: '[Deputy] Harley Bolton', factions: ['Law'] },
    ],
    Yorkoh: [
        { id: 958, name: '[Sheriff] Kai Ming', factions: ['Law'], displayName: 1 },
    ],
    YouKnowItsJuno: [
        { id: 959, name: 'Kima Abrams' },
    ],
    Yuet: [
        { id: 960, name: 'Woodrow Hale' },
    ],
    yully89: [
        { id: 961, name: 'Jacob Arlington' },
    ],
    yuukidav: [
        { id: 962, name: 'Everett Silver' },
    ],
    Zarrqq: [
        { id: 963, name: 'Benjamin Gaines', nicknames: ['Ben'], displayName: 3 }, // Former Sam's Club
    ],
    ZetarkGG: [
        { id: 964, name: 'Cesare DiCenzo', factions: ['DiCenzo Famiglia'], leader: true },
    ],
    ZeusLair: [
        { id: 965, name: 'Robbie Gold' }, // Former Lang Gang.
        { id: 984, name: 'Elijah James' },
    ],
    Ziggy: [
        { id: 966, name: 'Norman Bones' },
        { id: 967, name: 'Marly Clifton' },
    ],
    ZoltanTheDestroyer: [
        { id: 968, name: 'Emmett Fitz' },
    ],
    Zombiefun: [
        { id: 969, name: '[Ranger] Hal Dreen', factions: ['Rangers'] },
        { id: 970, name: 'Alexander McCoy' },
        { id: 971, name: 'Langston Bolo' },
    ],
};
