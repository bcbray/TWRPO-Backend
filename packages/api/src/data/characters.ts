/* eslint-disable object-curly-newline */

import { FactionRealFull } from './meta';

export type AssumeOther = 'assumeNpNoOther' | 'assumeNp' | 'assumeOther' | 'someOther' | 'neverNp';

export interface Character {
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

export const wrpCharacters: WrpCharacters = {
    '0Reed': [
        { name: 'Creedence McPoyle' },
    ],
    '1018tersk': [
        { name: 'Erling Haraldson' },
        { name: 'Stefano Salvaturi' },
    ],
    '2hands2thumbs': [
        { name: 'Ernest Dooly' },
        { name: 'Maverik Stone' },
        { name: 'Sheppard Dutton' },
    ],
    '893SHIRO': [
        { name: 'Mitsuhide Nagahama' },
    ],
    AaronOnAir: [
        { name: 'Dylan Texler' },
    ],
    abbbz: [
        { name: '[Deputy] Francesca Romano', factions: ['Law'] },
        { name: 'Sanjay Patel' },
        { name: 'Gertrude Goose', nicknames: ['Mrs. Goose'], displayName: 3 },
    ],
    AChanceOfCosplay: [
        { name: 'Bart Bancroft' },
        { name: 'Jason Forsworn' },
        { name: 'William "Billy" Boomer' },
    ],
    aDarkFilly: [
        { name: 'Magnolia Decker', factions: ['The Nameless'] },
    ],
    Aero_Films: [
        { name: 'Skeeter Carlisle' },
    ],
    Aestannar: [
        { name: 'Arthur Jones' },
        { name: 'Del Parker' },
    ],
    Afro: [
        { name: 'Gordon Parks' },
    ],
    Agidon: [
        { name: 'Holt MacMillan' },
    ],
    aJimmy: [
        { name: 'James Kelly', factions: ['Kelly Gang', 'Kettleman Gang'] },
    ],
    Altrah: [
        { name: 'Victor Morteza' },
    ],
    AlwayStayBlack: [
        { name: 'Shaggy McRaggzzah' },
    ],
    alyssajeanaf: [
        { name: 'Dahlia Malone' },
    ],
    AM_Raid: [
        { name: 'Cain Lockhart' },
        { name: 'Clifford Buck' },
        { name: '[Deputy] Giorgio Santorelli', factions: ['Law'] },
        { name: 'Raul Sanchez' },
    ],
    andromedastarry: [
        { name: 'Andi Walker' },
        { name: 'Quinn Connolly' },
        { name: 'Gabriella Gonzales' },
    ],
    AngelKnivez: [
        { name: 'Renni Bradshaw', nicknames: ['Rimmy'] },
        { name: 'Sissi Marie' },
    ],
    AngryPotatoChipz: [
        { name: 'Jamie Marlow' },
        { name: 'Isiah Trebuchet' },
    ],
    AnthonyZ: [
        { name: 'Antonio Corleone', nicknames: ['Tony'], factions: ['DiCenzo Famiglia'] },
    ],
    APPLESHAMPOO: [
        { name: 'Kenny Kidman' },
    ],
    Arc_Of_Fire: [
        { name: 'Nathan Terriers' },
    ],
    ArmoredAndy: [
        { name: '[Sr. Ranger] Buzz Buxton', factions: ['Rangers'] },
        { name: 'Adolf "Dolfie" Hofcooperstedder' },
        { name: 'Moose' },
    ],
    Ashen_Rabbit: [
        { name: '[Trainee] Dovie Parker', factions: ['Medical'] },
    ],
    AtomosCLU: [
        { name: 'George Anderson' },
    ],
    AtopDerekMountain: [
        { name: 'Dante Valentino' },
        { name: 'Devoghn Lowery Brown', nicknames: ['D-Lo', reg(/d(?:\-|\s*)lo/)], displayName: 4 },
        { name: 'Red Stag' },
        { name: 'Walter Cross' },
        { name: 'Wechugue Wechugue' },
        { name: 'Zhang Wei' },
    ],
    aureliawrites: [
        { name: 'Lena Phipps' },
        { name: 'Scarlet ?' }, // TODO: Last name?
    ],
    AustiinTV: [
        { name: 'Mickey Toolin' },
    ],
    aviceration: [
        { name: 'Ella Mason' },
        { name: 'Vincencia "Vinnie" Romeo' },
        { name: 'Kitty LaRoux' },
    ],
    Avioto_: [
        { name: 'Amadeo Moretti', factions: ['DiCenzo Famiglia'] },
        { name: 'Mo Tengfei' },
    ],
    AwaBeats: [
        { name: 'Ali Mason' },
        { name: 'Nokosi Ahanu' },
        { name: '[Deputy] Cleveland Brown', nicknames: ['C-Lo'], displayName: 3, factions: ['Law'] },
        { name: 'Yorrik Morales' },
    ],
    ayekayy47_: [
        { name: 'Misty Shaw' },
        { name: 'Rayne Beaux' },
        { name: 'Toni Chambers' },
    ],
    AzzTazz: [
        { name: 'Eric Butter' },
        { name: 'Solomon Kray' },
        { name: 'Thomas Ethan', nicknames: ['The Kid'] },
    ],
    B3UDown: [
        { name: 'Zip Quil' },
    ],
    babysiren_: [
        { name: 'Laura Dunn' },
    ],
    Balmer: [
        { name: 'Little Tibbles' },
    ],
    bananabrea: [
        { name: 'Josephine Gold' },
    ],
    barrybogan: [
        { name: 'Bernard "Bernie" Bogan' },
        { name: 'Jack Doolan' },
    ],
    BASHZOR: [
        { name: 'Wade Kilian' },
    ],
    Beanblanket: [
        { name: 'Clifford Dawes' },
        { name: 'Emilio Peralta' },
    ],
    BeardofOz: [
        { name: 'Euclid Vane' },
        { name: 'Ivan Smith' },
        { name: 'Liam Baker' },
        { name: 'Shep Ross' },
    ],
    beesneez: [
        { name: 'Georgie Meadows' },
        { name: 'Nora Boyle' },
        { name: '[Deputy] Avery Eliss', factions: ['Law'] },
    ],
    BernieIsLive: [
        { name: 'Noah Little' },
    ],
    BikeMan: [
        { name: 'Thaddeus Wick' },
    ],
    Bionic_Toothpick: [
        { name: 'Elia Marekson' },
    ],
    BitterRabbit: [
        { name: 'Eliza Kerrigan' },
        { name: 'Grace Shelton' },
        { name: '[Deputy] Kate Hearst', factions: ['Law'] },
        { name: 'Sam Caldwell' },
    ],
    blackhawkgamiing: [
        { name: 'Chris Edwoods' },
    ],
    Blaustoise: [
        { name: 'Jesse Flint' },
    ],
    bldrs: [
        { name: 'Casey Rigsby', factions: ['Independent', 'Guppy Gang'] },
    ],
    BlitzyNation: [
        { name: 'Charlie Walker' },
        { name: 'Craig the Wizard' },
        { name: 'Howi Bennet' },
        { name: 'James Wayne Twin' },
        { name: 'Juan Diego Moralez' },
        { name: 'Tommy Bennett' },
    ],
    blkcat: [
        { name: 'Johnny Walker' },
    ],
    BloomOnline: [
        { name: 'Norman Kobbs' },
    ],
    BooksBlanketsandTea: [
        { name: 'Edith Scriven' },
    ],
    BoosterGreg: [
        { name: 'Roy Whitmore' },
    ],
    Boxeryedig: [
        { name: 'Timothy Johnson' },
        { name: 'Daniel McCormic' },
        { name: 'Bud Pierce' },
    ],
    BradWOTO: [
        { name: 'Bentley Fog' },
        { name: 'Rufus Lorde' },
        { name: 'Tar Sullivan' },
    ],
    Brizzo24: [
        { name: 'Craig Johnson', factions: ['Sams Club'] },
        { name: 'Karl Feckles' },
    ],
    BrutalBri: [
        { name: 'Cooter O\'Doole' },
        { name: 'Dakota Rush' },
        { name: 'Robin Fischer' },
    ],
    bryanprograms: [
        { name: 'Blue Vanderweit' },
        { name: 'Butch Fairway' },
        { name: 'Johnny Quick' },
    ],
    Buddha: [
        { name: 'Wu Buddha', factions: ['DiCenzo Famiglia'] },
    ],
    buddyandy88: [
        { name: 'Carla Johanson' },
    ],
    Buffalo995: [
        { name: 'Clayton Woods' },
    ],
    BumbBard: [
        { name: 'Fewis Oxhandler' },
        { name: 'Fyodor' },
    ],
    BunglingNormal2: [
        { name: 'Henry Gearhardt' },
    ],
    Burn: [
        { name: 'Lloyd "The Ghost" Chambers', nicknames: ['Ghost'] },
    ],
    BurtLington: [
        { name: '[Sheriff] Marty Malone', factions: ['Law'] },
        { name: 'Paddy Connelly', nicknames: ['The Sweeper'] },
    ],
    buttrito: [
        { name: 'Dakota Ellis' },
    ],
    Caffine5: [
        { name: 'Billy Falco' },
        { name: 'Vincenzo Struzzo' },
    ],
    calibriggs: [
        { name: 'Henry Baptiste' },
        { name: '[Deputy] Joseph Parrish', factions: ['Law'] },
    ],
    CallieCakez: [
        { name: '[Ranger] Amelie Ashton', factions: ['Rangers'] },
    ],
    CallisTV: [
        { name: 'August Wheeler' },
    ],
    CannaCasual: [
        { name: 'Calvin Corbin' },
    ],
    CapitalOGttv: [
        { name: 'Franklin Costella' },
        { name: 'James "Jimi" Black' },
    ],
    CaptainMeef: [
        { name: 'Casey Jones' },
    ],
    CaptRubble: [
        { name: 'Joseph Stone' },
        { name: 'Percy Peanut' },
    ],
    CarbonitePlays: [
        { name: '[Deputy] Evan Madeley', factions: ['Law'] },
        { name: 'Karl North' },
        { name: 'Lance Irwin' },
        { name: 'Mervyn Castor' },
        { name: 'Miguel Sanchez' },
    ],
    Carlos_Spicyw3iner: [
        { name: 'Larry Brown' },
    ],
    CaseFace5: [
        { name: 'Willie "Gramps" Walker' },
    ],
    charlieblossom: [
        { name: 'Katarina Lovette' },
        { name: 'Eleanor Wood' },
    ],
    Cheever7: [
        { name: 'Aurora Rayne' },
    ],
    ChickPenguin: [
        { name: 'Lily Linwood', nicknames: ['Lily Fish', 'Lilly', 'Lilly Fish'], factions: ['Independent', 'Guppy Gang'] },
    ],
    Chief: [
        { name: 'Caesar Coal' },
        { name: 'Tuuyship Áama' },
    ],
    CHUDOCKEN: [
        { name: 'Qeljayiden', nicknames: ['Qelajayiden', 'Jaden'] },
        { name: 'Josiah Wayne' },
    ],
    ChrisTombstone: [
        { name: 'Joffery Wilkins' },
    ],
    ClassicSteeve: [
        { name: 'Melvin Brown' },
        { name: 'Jimmy Duncs' },
    ],
    ClassyPax: [
        { name: 'Eugene Calloway' },
        { name: 'Father Hickey' },
    ],
    CloakingHawk: [
        { name: '[Deputy] Danni Jackson', factions: ['Law'], displayName: 1 },
        { name: 'Roo' },
        { name: 'Tilly-May Edwards' },
    ],
    CloeeBee: [
        { name: 'Alice Bennett' },
        { name: 'Rose Pond' },
    ],
    Coda19us: [
        { name: 'Cecil Prichard' },
    ],
    Cojothebro: [
        { name: 'Oliver Toscano', nicknames: ['Mad Dog'], factions: ['DiCenzo Famiglia'] },
    ],
    ConnorCronus: [
        { name: '[Deputy] Rip Riley', factions: ['Law'] },
        { name: 'Isaac Smith' },
        { name: 'Karlias Drex' },
        { name: 'Richard Sionis' },
    ],
    Coolidge: [
        { name: 'Frank Murdock' },
        { name: 'Cash Colton', factions: ['Coltons'] },
    ],
    Criken: [
        { name: 'Festus Asbestus' },
    ],
    crocc_: [
        { name: 'Santino "Sonny" DiCenzo', factions: ['DiCenzo Famiglia'], leader: true },
    ],
    Crom: [
        { name: 'Elias McDurn' },
        { name: 'Aleister Reid' },
    ],
    cruddycheese: [
        { name: 'Donald McMuffin' },
    ],
    CyboargTV: [
        { name: 'Porter ONeill' },
    ],
    DadnOut: [
        { name: 'Cletus Clifton' },
        { name: 'Dusty Wilder' },
    ],
    Daftmedic: [
        { name: '[Doctor] Tristan Shipman', factions: ['Medical'] },
        { name: 'Archibald Shaw' },
    ],
    Dam_O: [
        { name: 'Grover Carlson' },
    ],
    DangitLacie: [
        { name: '[Deputy] Doreen Pavus', factions: ['Law'] },
        { name: 'Judith Amerine' },
        { name: 'Kid Kelley' },
    ],
    DaniOregon: [
        { name: 'Wesley Daniels' },
    ],
    DanMysteryHero: [
        { name: 'Brett Jordan' },
        { name: 'Wolverine Payton' },
    ],
    dannyfloriduh: [
        { name: 'Cliff Westwood' },
    ],
    Danzenken: [
        { name: 'Aadi G. Boom' },
    ],
    Darthbobo77: [
        { name: 'Walter Rinsen' },
        { name: 'Cooter Jonason' },
    ],
    DarysFrost: [
        { name: 'Hunter Solomons' },
    ],
    Dastardly_Dog: [
        { name: 'Barry Smith' },
        { name: 'Cassel bottom' },
    ],
    DatVoiceGuy: [
        { name: 'Alejandro Ariez' },
        { name: 'Luther Van Dam' },
    ],
    Daveybe: [
        { name: 'Pip Delahan', factions: ['Kettleman Gang'] },
        { name: 'Edge Lamburg' },
    ],
    DEANSUMMERWIND: [
        { name: 'Doug Darrell Dan' },
        { name: 'Ham Royce' },
    ],
    DeFrostSC: [
        { name: 'Eyota "Thunder" Tiama' },
        { name: 'Hank Boon' },
    ],
    DeneeSays: [
        { name: 'Brooke "Babs" Burns' },
    ],
    Deputy_Games: [
        { name: 'Sam Rosco' },
    ],
    DetectiveDoorag: [
        { name: '[Deputy] Casey Kramer', factions: ['Law'] },
        { name: 'Beau Wilder' },
        { name: 'Colt Clifford' },
    ],
    deviliac: [
        { name: 'Rafael "Rafa" Ramirez', nicknames: ['SnakeFace'] },
    ],
    Dimitri: [
        { name: 'Clem Colton' },
    ],
    Dimoak: [
        { name: 'Fiddleford "Phil" Mackit' },
        { name: 'Kaz Brekker' },
        { name: 'Tommy Townsand' },
        { name: 'Matthias Helvar' },
        { name: 'Ramsley Gracey' },
    ],
    Dirty_10: [
        { name: 'Richard Long', assume: 'assumeOther' },
        { name: 'Wesley Long' },
        { name: 'Vincent La Guardia' },
    ],
    Dirty_Fisherman: [
        { name: 'Archibald Trout' },
    ],
    DisbeArex: [
        { name: 'Timmy Took' },
        { name: 'Dolly Dixon' },
        { name: 'Morgana Fay' },
        { name: 'The Blood Witch', displayName: 0 },
    ],
    DJADIP: [
        { name: 'Juan Pablo' },
    ],
    DjinnJee: [
        { name: 'Jack Burton' },
    ],
    docrimbo: [
        { name: 'Butch Nickle' },
        { name: 'Fondue Framboise' },
        { name: 'Princess Biscuits' },
        { name: 'Jonah Harper' },
    ],
    DongerDayz: [
        { name: 'Blue Brows' },
        { name: 'Hubert Timbol' },
        { name: 'Mean Dillard' },
        { name: 'Stranger' },
        { name: 'Garibaldi' },
    ],
    DonnGaston: [
        { name: 'Miguel Hidalgo' },
    ],
    Doodlebag: [
        { name: 'Damian Castle' },
    ],
    DreadfullyDespized: [
        { name: 'Byong Ho' },
    ],
    DrensWorld: [
        { name: 'Danny Kerrigan' },
        { name: 'Duncan Ladle' },
        { name: '[Deputy] Duncan Weller', factions: ['Law'] },
        { name: 'Darwin Howe' },
    ],
    DrulkTV: [
        { name: 'Lawrence Noll' },
        { name: 'Wayne Colt' },
    ],
    DrXeroLive: [
        { name: 'Jack Thompson' },
        { name: 'Maurice Dillard' },
    ],
    DubEkostep: [
        { name: 'Pancho "El Cucuy" Zapata' },
    ],
    duhDonniee: [
        { name: 'Dirty Dougie', displayName: 0 }, // TODO: Is this their real name?
    ],
    DukeOfFlukes: [
        { name: 'Alexander Poe', factions: ['Medical'] },
        { name: 'Duke Colt', nicknames: ['Handsome Colt'] },
        { name: 'Charles Morgan' },
    ],
    Dunrunnin12: [
        { name: 'Clay' },
    ],
    DustMonkeyGames: [
        { name: '[Deputy] Charles Slaughter', factions: ['Law'] },
        { name: 'Solomon Walker' },
        { name: 'Lawrence "The Major" Stirling' },
        { name: 'Isaac "Dr. Creed" Creed' },
        { name: 'Reginald "Reggie" Richardson' },
        { name: 'Cullen Vane' },
    ],
    Dwoalin: [
        { name: 'Jeff “Smed” Smedley' },
    ],
    dynadivine: [
        { name: 'Lucille Davis' },
        { name: 'Lucille Walker' },
        { name: 'Danielle ?' },
    ],
    DzarekK: [
        { name: 'Eleonor Parker' },
    ],
    Eatindatcereal: [
        { name: '[Deputy] Jax Sanctum', factions: ['Law'] },
        { name: 'Al Lombardo' },
    ],
    Ellethwen_: [
        { name: 'Adaleigh Winters' },
        { name: 'Anna Mayfield' },
        { name: 'Magnolia Williams' },
        { name: 'Nascha Onawa' },
        { name: 'Della Sterling' },
    ],
    embernocte: [
        { name: '[Deputy] Saffron Mitchell', factions: ['Law'] },
        { name: 'Crissy "Cricket" Blitz' },
        { name: 'Holly Frost' },
        { name: 'Sadhbh O\'Brien', factions: ['The Humble Bunch'] },
    ],
    EmptyDome: [
        { name: 'Barry Armstrong' },
    ],
    endangeredfinley: [
        { name: 'Amelia Riddle' },
        { name: 'Bonnie Gray' },
        { name: 'Kit' },
        { name: 'Paul Güttman' },
    ],
    entspeak: [
        { name: 'Faolain McDiarmid' },
        { name: 'Bran Speaksy' },
    ],
    EquinoxRP: [
        { name: 'Brendyn Cormac' },
    ],
    EricaPlz: [
        { name: 'Briget Thorson' },
        { name: 'Vera Helvig' },
    ],
    eternalsong: [
        { name: 'Kora Vane', factions: ['Sams Club'] },
    ],
    EthanSchriver: [
        { name: 'Leanord Scout', displayName: 2 },
    ],
    ewanruss: [
        { name: 'Alfonso Bonucci', factions: ['DiCenzo Famiglia'], nicknames: ['Coach Al', 'Al'], displayName: 4 },
    ],
    extralivia: [
        { name: 'Lydia Spade' },
        { name: 'Aria Monroe' },
    ],
    Eyebyte: [
        { name: 'Amarillo Marnen' },
        { name: 'Edbert Trunk' },
        { name: 'Norman Hatt' },
        { name: 'Rutherford Peabody' },
    ],
    famousivan: [
        { name: 'Raul Dominguez' },
        { name: 'Manual Salamanca' },
        { name: 'Chavez Rodríguez' },
    ],
    Farmhouse78: [
        { name: 'Stewart Harington' },
        { name: 'Steven Hayes' },
    ],
    fayebles: [
        { name: 'Clementine Fisher' },
        { name: 'Nessa Evans' },
    ],
    feardeer: [
        { name: 'Bryn "Sloan" Keith' },
    ],
    FhaeLin: [
        { name: '[Deputy] Tabitha Thorne', factions: ['Law'], displayName: 1 },
        { name: 'Amber Sage' },
    ],
    FireLordRevan: [
        { name: 'Hannah Belles' },
    ],
    FistofTheWalrus: [
        { name: 'Gabriel Thompson' },
        { name: 'Karl Casterbane' },
        { name: 'Richard Flemington' },
        { name: 'Theodore Timers' },
        { name: 'William Killmore' },
    ],
    flaymayweather: [
        { name: 'Cade Cross' },
    ],
    Flickerclad: [
        { name: 'Evangeline Thorne' },
        { name: 'Frankie Czepanski' },
        { name: '[Sheriff] Rabbit Windward', factions: ['Law'] },
        { name: 'Saskia "Fang" Wolf' },
        { name: 'Quinn Thatcher' },
    ],
    ForeheadSkin: [
        { name: 'Edmund "Eddy" Reddington', factions: ['Sams Club'] },
        { name: 'Henry Huff' },
        { name: 'Joseph Walters' },
        { name: 'Morris Sterling' },
        { name: 'Chester Fox' },
        { name: 'Robert "Bobo" Thompson', nicknames: ['Bob'] },
    ],
    FortyOne: [
        { name: 'Sean Mercer' },
    ],
    FrankTheTank5494: [
        { name: 'Matthew Isaiah' },
    ],
    Freumont: [
        { name: 'Edward Shaw' },
        { name: 'Leonardo E. "Leo" Fantoni', factions: ['DiCenzo Famiglia'] },
    ],
    friendly_chick: [
        { name: 'Angelica "Angel" Ward', nicknames: ['Angle'] },
        { name: 'Charlotte "Lottie" Davis' },
        { name: 'Haven Rivers' },
        { name: 'Lillian Frost' },
    ],
    FrostFromFire: [
        { name: '[Doctor] Bianca Mackenna', factions: ['Medical'] },
    ],
    FunnyMatters: [
        { name: 'Clint Brimshaw', assumeChar: true },
    ],
    Gallethril: [
        { name: 'Annabel Barnes' },
        { name: 'Claire Marsh' },
    ],
    GameBaked: [
        { name: 'Mato Tahoma', factions: ['Medical'] },
        { name: 'Adriaan' },
        { name: 'Nyander Furrest' },
    ],
    GameishTV: [
        { name: 'Doug Chipper' },
        { name: 'Mike McCoy' },
    ],
    GauchoEscobar: [
        { name: 'Gaucho Escobar' },
        { name: 'Juana Soto' },
    ],
    GeDWiCK79: [
        { name: 'Kennway Mallory' },
    ],
    GeneralEmu: [
        { name: 'Lance Divine' },
        { name: '[Cadet] Jimmy Avola', nicknames: ['Two Times', 'Jimmy "Two Times"'], displayName: 4, factions: ['Law'] },
    ],
    GeorgiaBanks: [
        { name: 'Georgia Banks' },
    ],
    GiveMeUhMinute: [
        { name: 'James Willow' },
    ],
    GlitchedHelix: [
        { name: 'Ada Standish' },
        { name: '[Doctor] Mya Ennis', factions: ['Medical'] },
        { name: 'Rubella Davies' },
    ],
    glitchy: [
        { name: '[Deputy] James Faraday', factions: ['Law'] },
        { name: 'Raymond "Rayray" Willis' },
    ],
    GmanRBI: [
        { name: 'Max Brady', factions: ['Sams Club'] },
        { name: 'Gianni Peccati' },
        { name: 'Mordecai Butterbee' },
        { name: 'Giano Greywolf' },
        { name: 'Rudy Allaway' },
    ],
    GnarIyDavidson: [
        { name: 'Lluka Darkwood' },
    ],
    goose_thegreat: [
        { name: 'Thaddeus Owens' },
    ],
    GooseyOfficial: [
        { name: 'Jaimie Quinn' },
        { name: 'MaN Sauers' },
        { name: 'Speedy McGillagully' },
    ],
    GrammTheGibbon: [
        { name: 'Herbert Parker', nicknames: ['Herb', 'Cowboy', 'Young'] },
        { name: '[Detective] Homer Carnes', factions: ['Law'], nicknames: ['Cop'] },
        { name: '"LJ" Little Jimothy', nicknames: ['Kid', 'Soldier'] },
        { name: 'Clayton Orwell' },
    ],
    GraveGamerTV: [
        { name: 'Paulson Greer' },
        { name: 'Peter Gray', nicknames: ['Pete'] },
        { name: 'Balter Duncans' },
        { name: 'Paz Ferrer' },
    ],
    GreenEnigma: [
        { name: 'Jericho Blackfoot' },
    ],
    Grennig: [
        { name: 'Wesley Shields' },
    ],
    grigoriypeppo: [
        { name: 'Jack Kettleman', factions: ['Kettleman Gang'], leader: true, displayName: 2 },
        { name: 'Robert Dixon' },
        { name: 'Manuel Diaz', nicknames: ['El Coyote', 'Coyote'], displayName: 3 },
    ],
    gtplays: [
        { name: 'Gene Tiffin' },
        { name: 'Granville Turner' },
    ],
    GunterOfficial: [
        { name: 'Austin Scott' },
        { name: 'James Connor' },
    ],
    HaCha_art: [
        { name: 'Ava "La Nina" Jimenes' },
    ],
    HanyClaps: [
        { name: 'Levi Sawyer' },
        { name: 'Stumpy McBride' },
        { name: 'Virgil Sterling' },
    ],
    HappyYouniverse: [
        { name: 'Danny Ford' },
    ],
    Haxi_: [
        { name: 'Matt Dursk' },
    ],
    HerbtheNerd: [
        { name: 'Charles Kane' },
    ],
    HeroMexii: [
        { name: 'George Shaffer' },
    ],
    Hibblejaybob: [
        { name: 'Astrið Aleksdóttir', factions: ['Medical'] },
    ],
    hidaruma: [
        { name: 'Rico Kanto' },
    ],
    highkingfrazzal: [
        { name: 'James Delany' },
    ],
    Highpriest999: [
        { name: 'Athos Lepida' },
    ],
    Hurnani: [
        { name: 'James Brown' },
    ],
    Hoop: [
        { name: 'Barry Bjornson', factions: ['Sams Club'] },
        { name: 'Clyde Davis' },
        { name: 'Jonathan Redding', nicknames: ['Redshirt'], displayName: 3, factions: ['Half Wits'] },
        { name: '[Deputy] Miles Gyles', factions: ['Law'] },
    ],
    Hoss: [
        { name: 'Buck Cherry' },
    ],
    IanMMori: [
        { name: '[Deputy] Enrique Vespucci', factions: ['Law'] },
        { name: 'Ewan Byrne' },
        { name: 'Jonathan Coiner' },
        { name: 'Nate Coiner' },
        { name: '[Trainee] Luther Lake', factions: ['Medical'] },
    ],
    ianriveras: [
        { name: 'Hugo Teach' },
    ],
    IBabaganoosh: [
        { name: 'Chuck ?' },
    ],
    IboonI: [
        { name: 'Elias Boon' },
    ],
    ICoolioM: [
        { name: 'Arie ?' },
    ],
    illwac: [
        { name: 'Ira Smith' },
    ],
    Im_HexeD: [
        { name: 'Ronnie Tate' },
        { name: 'Theodore Ellis' },
    ],
    IMeMine30: [
        { name: 'Angelo Clemente' },
    ],
    ImFromTheFuture: [
        { name: 'Roscoe Montana', factions: ['Sams Club'] },
    ],
    inkyblackdreams: [
        { name: 'Vera Dragavei' },
    ],
    iruASH: [
        { name: 'Kayce Smith' },
    ],
    Its_Brogan2k: [
        { name: 'Bogdan Hughes' },
    ],
    ItsAsaii: [
        { name: '[Deputy] Buck Montana', factions: ['Law'] },
        { name: 'Calvin Oakes' },
        { name: 'Eli Ryckman' },
        { name: 'Shaine Calhoun' },
        { name: 'Wayne Kavanaugh' },
        { name: 'Dandy Smells' },
    ],
    itsSANDR: [
        { name: 'Deacon Walker' },
    ],
    Iwhuttt: [
        { name: 'Archibald Welch' },
        { name: 'Houston Gray' },
        { name: 'Patch "Patches" Twine' },
    ],
    J0J0: [
        { name: 'Delilah Kane' },
        { name: 'Effie Parker' },
        { name: 'Katherine Dunn' },
    ],
    Jackariah: [
        { name: 'Bo Whitmore' },
    ],
    jackiejackpot: [
        { name: 'Tilly Demeter', assume: 'assumeOther' },
        { name: 'Jade Ming' },
        { name: 'Jezrael King' },
        { name: 'Maria Gonzales' },
        { name: 'Widow Fan' },
    ],
    jakeyp0o: [
        { name: 'Danner Wynn' },
        { name: 'Jim Chatfield' },
    ],
    JamesWob: [
        { name: 'Benjamin Jameson' },
    ],
    JaneDizzle: [
        { name: 'Jane Pebbleswood' },
    ],
    JarlOfGoats: [
        { name: 'Gabriel Lenihan' },
    ],
    JayBritton: [
        { name: 'Heath Marker-Brown' },
        { name: 'Lucius Alabaster' },
        { name: '[Deputy] Obidiah Colt', factions: ['Law'] },
        { name: 'Scooter Brown' },
    ],
    jdot: [
        { name: 'James McAfee' },
    ],
    Jennybeartv: [
        { name: 'Gemma Middleton' },
    ],
    JesterTheRyda: [
        { name: 'Jordin Bradley' },
        { name: 'Joseph "Hobo Joe" Silvers' },
        { name: 'Margrett Anderson' },
    ],
    jobyonekanobi: [
        { name: 'Clint Gunther' },
    ],
    Jogiiee: [
        { name: 'Eloise Carter' },
        { name: 'Daisy Cromwell' },
        { name: 'Naomi Fletcher' },
    ],
    JoeFudge: [
        { name: 'Ronald Mayfair' },
        { name: 'Jackie ?' },
    ],
    johnnyblamz: [
        { name: 'Gavin Summers', factions: ['Summers Gang'], leader: true },
        { name: 'Jody Quinn' },
        { name: 'Logan Miller' },
        { name: 'Avery Woods' },
        { name: 'Peggy Brown' },
    ],
    Jonthebroski: [
        { name: 'Jonathan Divine', nicknames: ['Johnny', 'JBaas', 'J\'Baas', 'J Baas'], displayName: 5 },
        { name: '[Cadet] Jaime Ruth', factions: ['Law'] },
    ],
    JugsySiegel: [
        { name: 'Lyle Lancaster' },
    ],
    JunkieEzek: [
        { name: 'Jeremiah Harth' },
    ],
    JustAnotherBro: [
        { name: 'Billy Blood' },
    ],
    JustSam42: [
        { name: '[Ranger] Nathan Thompson', factions: ['Rangers'] },
    ],
    JustxJodi: [
        { name: 'Minnie Mines' },
    ],
    KADOsLIVE: [
        { name: 'Dan Douglas' },
    ],
    kadxon: [
        { name: 'Vivian Lashea' },
    ],
    Kanny1887: [
        { name: 'Enrico Rodriguez' },
        { name: 'Jonathan Schütz' },
        { name: 'Julio Rodriguez' },
    ],
    KateMadison: [
        { name: 'Ellie Whitmoore' },
        { name: 'Scarlett' },
    ],
    Kelsenpai: [
        { name: 'Edward Bolton' },
    ],
    Khandur_: [
        { name: 'Tommy Cooper' },
    ],
    killboy011: [
        { name: 'John Frisco', displayName: 2 },
    ],
    KillrBeauty: [
        { name: 'Deborah "Deb" VanBurton' },
    ],
    KinkyHobo: [
        { name: 'Emmett Edwards' },
    ],
    KittyLeigh: [
        { name: 'Delilah' },
    ],
    Kiva: [
        { name: 'Harper Madison' },
    ],
    KlokWrk: [
        { name: 'Joshua Reeves' },
    ],
    Kouts3: [
        { name: 'Felix Colt' },
    ],
    KripkeyTV: [
        { name: 'Sergio Scarpatti', factions: ['DiCenzo Famiglia'] },
    ],
    KristoferYee: [
        { name: 'Posie Tiv' },
    ],
    ksinz: [
        { name: '[Deputy] Syles MacKenna', factions: ['Law'] },
        { name: 'Cucamonga Kid', factions: ['Half Wits'], displayName: 0 },
        { name: 'Milliken Fuller', nicknames: ['Mills'], displayName: 3, factions: ['Kettleman Gang'] },
    ],
    KYCaffiend: [
        { name: 'Emerson Cain' },
        { name: 'Montgomery Flynn' },
        { name: 'Tommaso Scaglietti' },
    ],
    Kyle: [
        { name: 'Ren Solo' },
    ],
    Kyltrex: [
        { name: 'Jackson "Dead-Eye Jack" Pryde' },
        { name: 'Louis "Louie" Lancaster' },
        { name: 'Luther Von Brandt' },
    ],
    KyQuinn: [
        { name: 'Carmen Beckett' },
        { name: 'Jackson Riggs' },
        { name: 'Miss Mystery' },
        { name: 'Olive Wallace' },
        { name: 'Portia Hartley' },
        { name: '[Deputy] Quinton Ivy', factions: ['Law'] },
        { name: 'Trixie Davenport' },
        { name: 'Jade ?' },
    ],
    L00seyG005ey: [
        { name: 'Elijah Grayson' },
    ],
    LakunaRP: [
        { name: 'Tavish Black' },
        { name: 'Jack "Ash" James', nicknames: ['Wolf-kin'] },
    ],
    LEAH: [
        { name: '[Ranger] Francesca "Frankie" Bright', factions: ['Rangers'], displayName: 2 },
        { name: 'Harriet "Hawk" Hawkins', factions: ['Summers Gang'] },
        { name: 'Brie Haviour' },
        { name: 'Ruthie Samuels' },
    ],
    Lendermations: [
        { name: 'Inessa "Miss Match" Bornlof' },
        { name: 'Riley Rivens' },
        { name: 'Tantallia Tippins' },
    ],
    leoDOTmae: [
        { name: 'Eleanor Cain' },
    ],
    LetterJaye: [
        { name: 'Wisteria Snowdon' },
        { name: 'Poppy Florian' },
    ],
    LimaZuluTango: [
        { name: 'Henri Sinclair' },
    ],
    LiteralBear: [
        { name: 'Marcus Danner' },
        { name: '[Deputy] Negan McAlister', factions: ['Law'], displayName: 1 },
        { name: 'Joseph "JoJo" Johanson' },
        { name: 'Diego Marin', factions: ['Conductors'] },
    ],
    Lithiaris: [
        { name: '[Doctor] Lark Atwood', factions: ['Medical'] },
        { name: '[Deputy] Sylvie Chevalier', factions: ['Law'] },
    ],
    livraan: [
        { name: 'Hanna Eriksson' },
    ],
    ll_Marziano_ll: [
        { name: 'James Lawson' },
        { name: 'Lawrence Kelley' },
        { name: 'Nitokaayi “Lone Bison” Nawakwa' },
    ],
    LLumiya: [
        { name: 'Elizabeth Black' },
    ],
    Lovebot44: [
        { name: 'Annie Applebee' },
        { name: 'Charlotte Blackwood' },
        { name: 'Eustice Dixon' },
        { name: 'Lillian Church' },
    ],
    Luckcue: [
        { name: 'Alex Mystic' },
    ],
    Lt_Custard: [
        { name: 'Kian McNulty' },
    ],
    Lt_Raven: [
        { name: '[Father] Samuel O\'Keeffe', displayName: 2 },
        { name: '? ?' },
    ],
    luka_aus: [
        { name: 'Lukeas Winsmore' },
        { name: 'Louis O\'Neil' },
    ],
    Lunabee: [
        { name: 'Abigale Hart' },
    ],
    Lyndi: [
        { name: 'Delilah Deveaux' },
    ],
    MaceyMclovin: [
        { name: 'Jackson Slater' },
    ],
    mackaelroni: [
        { name: 'Bobby-Sue Fredrickson' },
        { name: 'Everett Bondurant' },
        { name: 'Jarvis Jones' },
        { name: 'Mack Fredrickson' },
        { name: 'William White' },
    ],
    MackieLTD: [
        { name: '[Deputy] Jack Cameron', factions: ['Law'] },
        { name: 'Scott Samuel' },
        { name: 'Nathanial ?', nicknames: ['Smoke'] },
        { name: 'Richard Watson' },
        { name: 'Terrance King' },
    ],
    Madmoiselle: [
        { name: 'Lily Landry' },
        { name: 'Oola Lafayette' },
    ],
    MafiaDrew: [
        { name: 'Donatello "Don" Jameson' },
    ],
    MannersMaketh_: [
        { name: 'Horatio Hudson' },
    ],
    MartyO248: [
        { name: 'Bobby Brampton' },
        { name: 'Dmitri Crenshaw' },
        { name: 'Marty Hanes' },
        { name: 'Ernie Crabgrass' },
    ],
    MattBreckly: [
        { name: 'Dan Gerous' },
    ],
    MaverickHavoc: [
        { name: 'Cornellius Orvid' },
    ],
    McBlairTV: [
        { name: 'Cyrus McGill' },
    ],
    MDMums: [
        { name: 'Edward Moore' },
        { name: '[Cadet] Matthew McAllister', factions: ['Law'] },
    ],
    MEKABEAR: [
        { name: '[Deputy] Audrey Dusk', factions: ['Law'] },
        { name: 'Goldie Fisher', factions: ['Dead End Kids'] },
    ],
    MeMine30: [
        { name: 'Walt McGrath' },
    ],
    Mhaple_: [
        { name: 'Morgan Lee' },
    ],
    Mick: [
        { name: 'Gladys Berry' },
    ],
    MinksOfMars: [
        { name: 'Irene "Peaches" Corvis', factions: ['Sams Club'] },
        { name: 'Ana Stravinski' },
        { name: 'Willow Wisp' },
    ],
    mishkaxoxo: [
        { name: 'Mishka Agapova' },
    ],
    MrArkay: [
        { name: 'Casper Hems' },
    ],
    MrFreak_TV: [
        { name: 'Arliss Hagen' },
        { name: 'Colt Youngblood' },
        { name: 'Fergus McDuffy' },
        { name: 'Mal Tompkins' },
        { name: 'Orland Boggs' },
        { name: 'Blem Jinkins' },
    ],
    MrGoonBones: [
        { name: 'Goon "Goom-Boobie" Bones' },
    ],
    MrMoonsHouse: [
        { name: 'Tommy Roach', nicknames: ['Two Snakes', 'Tommy Two Snakes'], displayName: 4, assumeChar: true },
        { name: 'Kang Colton', factions: ['Coltons'] },
    ],
    MrPandaaBear: [
        { name: 'Cathal McCarthy' },
    ],
    MsVenture: [
        { name: 'Martina Guzman' },
    ],
    muhzzy: [
        { name: 'Dr. Cloth', displayName: 0 },
        { name: 'Grim' },
        { name: 'Herman Wilbur' },
        { name: 'Leon Taylor' },
        { name: 'Conny Cage' },
    ],
    Myre: [
        { name: 'Benoit Baratie' },
        { name: 'Crispin Cantabile' },
        { name: 'Dallas Wolf' },
        { name: 'Phineas Fentworth' },
        { name: 'Saul South' },
    ],
    Mythematic: [
        { name: 'Ben Bealz' },
        { name: 'Chauncy "The Barman" Charles' },
        { name: 'Cooper Garret' },
        { name: 'Jack Woulfe' },
        { name: 'Pikup Dropov' },
    ],
    Nakkida: [
        { name: 'Lyra Woods' },
    ],
    nathankb_: [
        { name: 'Dug Dug' },
    ],
    NaniNerd: [
        { name: 'Ivy Hill' },
    ],
    Nbodo: [
        { name: 'Peter Rockwell' },
    ],
    NiaDrools: [
        { name: 'Madeline "Moxy" Maddox' },
        { name: 'Edith "Ed" Gretchen' },
        { name: 'Snow' },
        { name: 'Penelope ?' }, // TODO: Last name?
    ],
    Nidas: [
        { name: 'Eustace Goodwin' },
    ],
    NoahsDay: [
        { name: 'Cliff Otis' },
    ],
    Nopheros: [
        { name: 'Robert Fisher' },
    ],
    NOTmackfrew: [
        { name: 'Seymour Humphries' },
    ],
    NouieMan: [
        { name: 'James Henderson' },
        { name: 'Jim Fandango' },
        { name: 'John Tatum' },
        { name: 'Leviticus Starr' },
        { name: 'Louis Darling' },
        { name: 'William Martinez' },
    ],
    Novatic: [
        { name: 'Doug Heartland' },
    ],
    Novatorium: [
        { name: 'Minnie Bean' },
        { name: 'Trix' },
    ],
    nziech: [
        { name: 'Kuniklo' },
        { name: 'Orpheus "Buck" Buck' },
    ],
    og_cush00: [
        { name: 'Walter Bridges' },
    ],
    OhHeyItsFunk: [
        { name: 'Lucius Tubbs' },
    ],
    ohheyliam: [
        { name: 'Oliver "Ollie" Quil' },
    ],
    OhJessBee: [
        { name: 'Carmine Crimson' },
    ],
    ohnopojo: [
        { name: 'Billy Kim' },
    ],
    oldkelvo: [
        { name: 'Jack Crow' },
        { name: 'Beth Gout' },
        { name: 'Carver Reilly' },
        { name: 'Boyd Cassidy' },
    ],
    Orcish: [
        { name: '[Deputy] Allistair McGregor', factions: ['Law'] },
        { name: 'Billy Beetur' },
        { name: 'Otis Potts' },
        { name: 'Richard Westlake' },
        { name: 'Tripp Riggs' },
    ],
    Ormais: [
        { name: 'Lloyd Conway' },
    ],
    PapaDrgnz: [
        { name: 'Shiv Bailey' },
    ],
    Paracast: [
        { name: 'Erasmus South' },
    ],
    PBandJLee: [
        { name: 'Elsie Fletcher' }, // TODO: `factions: ['News']` maybe?
    ],
    PeachTreeMcGee: [
        { name: 'Charlotte Toussaint' },
    ],
    peachycoaster: [
        { name: 'Chrissy Snow' },
        { name: 'Toosie Loo' },
        { name: 'Kipper O\'Neil' },
    ],
    Pengwin: [
        { name: 'Staniel Wilkerson' },
    ],
    Pers: [
        { name: 'Dr. Carrie Williams' },
        { name: 'Mischa Crane' },
    ],
    Pezz: [
        { name: 'Cid Speedwagon', nicknames: ['Highwayman'] },
    ],
    PibbJont: [
        { name: '[Cadet] Thatcher Mantell', factions: ['Law'] },
    ],
    pinkchyu: [
        { name: 'Caroline Kroll' },
        { name: 'Kelly Crockett' },
        { name: 'Dorothy Dean' },
        { name: 'Violet Rockefeller' },
    ],
    Pinkfie: [
        { name: 'Abigail Burke' },
    ],
    Point1985: [
        { name: 'Joe Jackson' },
    ],
    potsie30: [
        { name: 'Doug Landers' },
    ],
    privyLore: [
        { name: 'Wren Lebow', nicknames: ['Lilith'] },
        { name: 'Kathryn ?' },
        { name: 'Minerva Ackerman' },
    ],
    ProJB: [
        { name: 'Odin Borr' },
    ],
    Psikage: [
        { name: 'Oscar Caraballo' },
    ],
    PuckNatorGaming: [
        { name: 'Ernest Thorton' },
    ],
    PukingFerrets: [
        { name: 'Alice Quinn', factions: ['Kettleman Gang'] },
    ],
    Pumpkinberry: [
        { name: 'Honey Sparks' },
        { name: 'Imogen Blackwell' },
        { name: 'Nora Boone' },
        { name: 'Omens' },
    ],
    Question_Box: [
        { name: '[Sheriff] Lydia Lewis', factions: ['Law'] },
        { name: 'Blaire Turner' },
    ],
    Quip_TV: [
        { name: '[Deputy] Dove Hopkins', factions: ['Law'] },
        { name: 'Sally Higgins', nicknames: ['Shotgun'] },
        { name: 'Sofia Sherman' },
    ],
    RaddRema: [
        { name: 'Bonnie Sunn' },
    ],
    Rayormy: [
        { name: 'Adelaide Henry' },
    ],
    RayforRachel: [
        { name: 'Winifred "Dot" Barlow' },
        { name: 'Shirley Lemons', nicknames: ['Cowgirl'] },
    ],
    REKKRPRO: [
        { name: 'Rekks Tanner' },
    ],
    RickMongoLIVE: [
        { name: 'Cole Dalton' },
        { name: 'Furio Bonanno' },
    ],
    Roach_tm: [
        { name: 'Tony Moretti', factions: ['DiCenzo Famiglia'] },
    ],
    rosco: [
        { name: 'Awkward Johnson', displayName: 0 },
        { name: 'Frank Church' },
        { name: 'John Hell' },
    ],
    RookGoose: [
        { name: 'Leto McMorris ' },
    ],
    rossthehsauce: [
        { name: 'Forest Fish', factions: ['Guppy Gang'] },
        { name: 'Dominic Disouza', factions: ['DiCenzo Famiglia'] },
        { name: 'Lionel Miles' },
    ],
    RY4N: [
        { name: 'Christine "Momma" Thomas' },
        { name: 'Joe "Moonshine Joe" Burns' },
        { name: 'Randy Randy' },
        { name: 'Thomas Church' },
    ],
    s0upes: [
        { name: 'Ace Grimmer' },
    ],
    s5ashadow01: [
        { name: '[Cadet] Adam Skye', factions: ['Law'] },
        { name: 'Froiland Jackson' },
    ],
    SaberTV: [
        { name: 'Constance Miles' },
    ],
    SaffyPie: [
        { name: 'Cassidy Reynolds' },
    ],
    saffyra: [
        { name: 'Birdy Hawke' },
        { name: 'Poppy Pascal' },
    ],
    SalsaRage: [
        { name: 'Norman McCain' },
        { name: 'Bitt McGee' },
    ],
    Sammyyyyyyy: [
        { name: 'Lizzie Clarke' },
    ],
    sannmann_: [
        { name: 'Jack Milton' },
    ],
    sarahpeathatsme: [
        { name: 'Ruby Raines' },
    ],
    satyr_queen: [
        { name: 'Cornelius Tias' },
        { name: 'Curtis Cunningham' },
        { name: 'Daisy Shields' },
        { name: 'Jolene Quinn' },
        { name: 'Josiah Matthews' },
        { name: 'Sam Bridges' },
        { name: 'Bethany Ryder' },
    ],
    ScarletRosePlays: [
        { name: 'Allison Chase' },
        { name: 'Bella Baker' },
        { name: '[Deputy] Zoe Winters', factions: ['Law'] },
    ],
    ScottJitsu: [
        { name: 'Reno Cash' },
    ],
    Scriffboy: [
        { name: 'Tane' },
    ],
    Scwair: [
        { name: 'Roman Blanco' },
        { name: 'Teddy Graves' },
    ],
    seakeon: [
        { name: 'Eoghan Quinn' },
        { name: 'Pat Campbell' },
        { name: 'William Stone' },
    ],
    section9_Browncoat: [
        { name: '[Deputy] Ned Fuller', factions: ['Law'] },
        { name: 'Nick Carver' },
        { name: 'Loup Farrow' },
    ],
    Selvek: [
        { name: 'Clayton Colton', factions: ['Coltons'] },
    ],
    SencneS: [
        { name: 'Desmond Potts' },
    ],
    sgttyn: [
        { name: 'Jacob Dubois' },
        { name: 'Norris Olson' },
        { name: '[Deputy] Sam Winters', factions: ['Law'] },
    ],
    shadowsINsilence: [
        { name: 'Emily Marie Kenward' },
    ],
    Shake4L: [
        { name: 'Buzz Bleu', factions: ['Sams Club'] },
    ],
    ShawW0w: [
        { name: 'Clarence Crudewater' },
    ],
    SheepDog59: [
        { name: 'Wyatt Mason Kennedy' },
    ],
    Shyirasky: [
        { name: 'Twitch Cooper' },
    ],
    Sidkriken: [
        { name: 'Dane Swan', factions: ['Law'] },
        { name: 'Gator Weaver' },
        { name: 'Odysseus Kain' },
        { name: 'Mr. White', displayName: 0 }, // TODO: Don't know first name
    ],
    Silbullet: [
        { name: '[Deputy] Shawn Maple', factions: ['Law'] },
        { name: 'Stefano Amendo' },
        { name: 'Leopold Von Schitzen' },
    ],
    SilentSentry: [
        { name: 'Emmet "Stripes" Wagner' },
    ],
    SincerelyIndie: [
        { name: 'Truly Tillery' },
    ],
    SinnixTv: [
        { name: 'Frank Brower' },
    ],
    SirisLuv: [
        { name: 'Denise Neve' },
    ],
    Skids_N_Cones: [
        { name: '"Old Greg" Boone', nicknames: ['Old Greg'], displayName: 3 },
        { name: 'Bear' },
        { name: 'Henry "West"' },
    ],
    SkoogFFS: [
        { name: 'Billy Joe Barber', nicknames: ['Billy Joe', 'BJB'], displayName: 4, factions: ['The Nameless'] },
        { name: 'Lefty Lone' },
        { name: 'Reidar Hagen' },
    ],
    SLiMt: [
        { name: 'Jimmy "Slim Jim" Slimper' },
    ],
    smorgenborgendorgen: [
        { name: 'Martha Crook' },
    ],
    sneakyShadower: [
        { name: '[Deputy] Abigail Jones', factions: ['Law'] },
        { name: 'Azula Brooks' },
        { name: '[Doctor] Isabella Vautour', factions: ['Medical'] },
        { name: '[Deputy] Jackie Lockwood', factions: ['Law'] },
        { name: 'Raven Bennett' },
    ],
    SocialTortoise: [
        { name: 'Billy Jackson' },
    ],
    Sock22: [
        { name: 'Daniel "Danny" Moss' },
    ],
    SolidSinn: [
        { name: 'Carl Lawsen' },
        { name: 'Jed Wicker', factions: ['Kettleman Gang'] }, // TODO: Confirm faction
        { name: 'Roger Thyne' },
    ],
    SomethingBees: [
        { name: '[Ranger] Isla White', factions: ['Rangers'] },
        { name: 'Berdie Lloyd' },
        { name: '[Deputy] Cait McAlister', factions: ['Law'] },
        { name: 'Amarok' },
    ],
    Sonneflower: [
        { name: 'Eliana Diaz' },
        { name: 'Jean Rivers' },
    ],
    SpaceAndromeda: [
        { name: '[Deputy] Aoife McCarthy', factions: ['Law'] },
        { name: 'Clarabelle Manson' },
        { name: 'Cora Crow' },
    ],
    Spaceboy: [
        { name: 'James Randal', nicknames: ['Jim Beef'] },
    ],
    Speckie_: [
        { name: '[Deputy] Andrew Hamilton', factions: ['Law'] },
        { name: 'Emmet Gray' },
        { name: 'James Parker' },
        { name: 'Archie ?' }, // Last name maybe “Richardson”?
    ],
    spicybackpain: [
        { name: 'Pepper Jackson' },
        { name: 'Tormund Kray' },
    ],
    sporkerific: [
        { name: 'Rosamaria Sandoval' },
    ],
    SprayNprayErik: [
        { name: 'Butch Marlow' },
    ],
    spriteleah: [
        { name: '[Ranger] Francesca "Frankie" Bright', factions: ['Rangers'], displayName: 2 },
        { name: 'Harriet "Hawk" Hawkins', factions: ['Summers Gang'] },
        { name: 'Brie Haviour' },
        { name: 'Ruthie Samuels' },
    ],
    Sput: [
        { name: 'Marvin Mayflower' },
    ],
    squareiz: [
        { name: 'Eddy Doyle', nicknames: ['Ed'] },
    ],
    Ssaab: [
        { name: 'Sam Baas', factions: ['Sams Club'], leader: true, nicknames: ['Dank Outlaw'], assumeChar: true },
        { name: 'Ali Baba', displayName: 0 },
        { name: 'Leo Slack' },
    ],
    Ssmacky: [
        { name: 'Jackson Marsh' },
    ],
    StarBarf: [
        { name: 'Elich Doherty' },
    ],
    stardaze: [
        { name: 'Edie Barlowe' },
    ],
    SteelRain27: [
        { name: 'Moses Maddox' },
    ],
    Stichboy: [
        { name: 'Jeremiah Smoak' },
    ],
    StormBreaker: [
        { name: 'Jasper Dickens' },
        { name: 'Gretchen Morgan' },
    ],
    Strippin: [
        { name: 'Archie Turner' },
    ],
    suddenly_pandas: [
        { name: 'Flamboise Chambord' },
        { name: 'Harry Chapman' },
        { name: '[Sheriff] Hudson Hart', factions: ['Law'] },
        { name: 'Kevin Higgins' },
        { name: 'Mackenzie Kale' },
        { name: 'Boyd Banks' },
    ],
    Sugarsockzgg: [
        { name: 'Mason Memphis' },
    ],
    sweetcraw: [
        { name: '[Ranger] Joey Crawford', factions: ['Rangers'] },
        { name: 'Ephraim Teller' },
    ],
    Sylasism: [
        { name: 'Atty Windward' },
        { name: 'Franklin Czepanski' },
        { name: 'Bartleby Sinclair' },
    ],
    Syraphic: [
        { name: 'Emilia "Emi" Song' },
    ],
    TacticalGH0STT: [
        { name: 'Beaux Carter' },
    ],
    TaintedRUMBLER: [
        { name: 'Drew Peters', assume: 'assumeOther' },
    ],
    TalkingRecklessPodcast: [
        { name: 'Jeremiah Rent' },
    ],
    TankGirl: [
        { name: 'Effie Mae Braithwaite' },
        { name: 'Gloria Bonanno' },
    ],
    tanklovesyou: [
        { name: 'Ethan Cross' },
        { name: 'Eugene Goodman' },
        { name: '[Deputy] Jean-Pierre Lefrancois', factions: ['Law'] },
        { name: 'Julius "The Jade King" Bradshaw' },
        { name: '[Mershal] Rico Ortega', nicknames: ['Deputy Marshal'], factions: ['Law'] },
    ],
    Taranix: [
        { name: 'Mattias Temble' },
    ],
    Tasara22: [
        { name: '[Deputy] Jane Ripley', factions: ['Law'] },
        { name: 'Betty Butcher' },
        { name: 'Madame Milena' },
        { name: 'Monica Peach' },
        { name: 'Oneida Zonta' },
        { name: 'Precious Cargo' },
        { name: 'Gertrude Nelson' },
    ],
    Tech_Otter: [
        { name: 'Chester McGuckin' },
        { name: 'Nathan Riggs' },
    ],
    TehJamJar: [
        { name: 'Alvin Biggs' },
        { name: 'Dwight Bridger', displayName: 2, factions: ['The Humble Bunch'] },
        { name: 'Klaus Pudovkin' },
        { name: 'Luke Colton', factions: ['Coltons'] },
    ],
    Thadrius: [
        { name: 'Jimmy Frick' },
    ],
    ThatTrollsomeGuy: [
        { name: 'Logan Callaway' },
        { name: '[Deputy] Jonathan Robertson', factions: ['Law'] },
        { name: 'Alexander Rose' },
    ],
    The_Beautiful_Void: [
        { name: 'Katherine Byrne' },
    ],
    The_Devils_Son: [
        { name: 'Fredrick Smythe' },
    ],
    The_Metro_Man1: [
        { name: 'Jim Sky' },
        { name: 'Felix Nileson' },
        { name: 'Henry ColeSlaw' },
        { name: 'Millard Van Dough' }, // TODO: Confirm last name
    ],
    The_Mountain_Troll: [
        { name: 'Basey "Red" Bohannon' },
    ],
    TheAaronShaq: [
        { name: 'Kenneth "Ricky" Randall' },
        { name: 'Wesley Spats' },
    ],
    TheAmelina: [
        { name: 'Elisabeth "Ellie" Beauregard' },
    ],
    TheBanditKingUK: [
        { name: 'Damien Gallagher' },
        { name: 'Sebastien Woodrow' },
        { name: 'Tobias Graves' },
        { name: 'Adam Brand' },
        { name: 'Jonas Steel' },
    ],
    TheCocacolafreak: [
        { name: 'Clint "Busty Danger" David' },
        { name: 'Ernst Schneider' },
        { name: 'Javier Moreno' },
        { name: 'Thomas Schneider', nicknames: ['Butcher Of Berlin'] },
        { name: 'W. J. Patterson' },
    ],
    TheCourtJester: [
        { name: 'Dr. Nikolai' },
    ],
    TheDasTony: [
        { name: 'Antonio "Tony" Salerno', factions: ['DiCenzo Famiglia'] },
    ],
    TheFoodcartGamer: [
        { name: 'Felix Ellis' },
    ],
    TheForerunner: [
        { name: 'Nico Aventi' },
    ],
    TheGawkyGoat: [
        { name: 'Cillian McCarty' },
    ],
    TheGeneralSmokey: [
        { name: 'Edwin Braithwaite', nicknames: ['Eddie'], factions: ['Kettleman Gang'] },
    ],
    TheGoochTV: [
        { name: 'Becker Lang' },
    ],
    TheHairyCelt: [
        { name: 'Ronnie Hurbert' },
    ],
    TheHardcorian: [
        { name: 'Edgar Buckle' },
        { name: 'Bill Hill' },
        { name: 'Lucius Thorn' },
        { name: 'Pope Langer' },
        { name: 'Ron Bryer' },
        { name: '[Deputy] William Campbell', factions: ['Law'] },
    ],
    TheJasonPhoenix: [
        { name: 'Fenix Hayston' },
        { name: '[Deputy] John Claymore', factions: ['Law'] },
    ],
    theLGX: [
        { name: 'Abner Ace' },
    ],
    TheObsidianTravelersCo: [
        { name: 'Cornileus Moon' },
        { name: 'Amadeus "Adonis" Silver' },
    ],
    ThePatrician69: [
        { name: 'Nate Casey', factions: ['Kettleman Gang'] },
    ],
    TheRandomChick: [
        { name: '[Doctor] Bella Trix', nicknames: ['Bellatrix'], displayName: 3, factions: ['Medical'] },
        { name: 'Poppet Deveaux' },
    ],
    TheSlappyOne: [
        { name: 'Marcus Hutchinson' },
    ],
    TheStreetMagnet: [
        { name: 'Josiah Shepard' },
    ],
    TheTofuSamurai: [
        { name: 'Jimothy James' },
        { name: 'John Crath' },
    ],
    theweyu: [
        { name: 'Alawa "Ali" Meota' },
    ],
    TheZenPunk: [
        { name: 'William "Wild Willy" Brown' },
    ],
    ThinkingQuill: [
        { name: 'Cian Malloy' },
        { name: 'Hymnal Smed' },
        { name: 'Elliot Teller' },
    ],
    thisisgillie: [
        { name: 'Balwinder Singh' },
    ],
    ThrallJo: [
        { name: 'Corvus Clements' },
    ],
    TiltedSun: [
        { name: 'Madison Windward' },
        { name: 'Clem Griffiths' },
    ],
    Timmac: [
        { name: 'Gomer Colton', factions: ['Coltons'] },
        { name: 'Enzo Valentino' },
    ],
    tmcrane: [
        { name: 'Lucius Bickmore' },
        { name: 'Alfred Kidd' },
    ],
    TnFD: [
        { name: 'Julian Charleston' },
    ],
    ToneeChoppa: [
        { name: 'Antonio Borges' },
    ],
    Tonixion: [
        { name: 'Howard Purdnar' },
        { name: 'Samson Graves' },
    ],
    toodlehausn: [
        { name: 'Adelae "Ada" Wright' },
        { name: 'Sadie Stronge' },
        { name: 'Mary Rassler', nicknames: ['Old'] },
    ],
    travpiper: [
        { name: 'William "Bill" Gunner', nicknames: ['Carlos Sanchez', 'Carlos'] },
    ],
    TullyCuffs: [
        { name: 'Hugo Hopper' },
    ],
    Two_Beans_2B: [
        { name: 'Dieter Krankenkasse' },
        { name: 'Hawthorne Sapling' },
        { name: 'Jonathan Badtmann' },
    ],
    UberHaxorNova: [
        { name: 'Rooporian Roo', factions: ['Independent', 'Guppy Gang'], displayName: 2 },
    ],
    UberJazer: [
        { name: 'Nahmala "Wolf" Wolfe' },
    ],
    Ukrainy_: [
        { name: 'Willie Reuben' },
    ],
    unstoppableLARN: [
        { name: 'Gertrude Cockburn' },
        { name: 'Razormouth' },
        { name: 'Terry Hogan' },
    ],
    upfl0w: [
        { name: 'Roman Blanco' },
        { name: 'Teddy Graves' },
    ],
    valenam: [
        { name: 'Laura Flores' },
    ],
    ValenVain: [
        { name: 'Salazar Fisk' },
    ],
    valkyrionrp: [
        { name: 'Jack Volker' },
    ],
    VersaLK: [
        { name: 'Carlo Marciano', factions: ['DiCenzo Famiglia'] },
    ],
    VERTiiGOGAMING: [
        { name: '[Deputy] Boyd Kerrigan', factions: ['Law'] },
        { name: 'Joey "The Wallaby Kid" Johns', factions: ['Dead End Kids'] },
        { name: 'Les Darcy' },
        { name: 'Bazz Kerrigan', factions: ['Kettleman Gang'] },
        { name: 'Clarence McCloud' },
    ],
    Viviana: [
        { name: 'Mary Anne LeStrange' },
    ],
    VTM___: [
        { name: 'Boone Morales' },
        { name: 'Guy Hyneman' },
    ],
    vtrich: [
        { name: 'Fester Buckland' },
    ],
    WaistcoatDave: [
        { name: 'Dr. C.J Matthews' },
    ],
    WANTED_MANIAC: [
        { name: '[Deputy] Brian Wright', factions: ['Law'] },
        { name: 'Taylor Hicks' },
        { name: 'William "Bill" Carver' },
        { name: 'Benji Bell' },
    ],
    WeeJimcent: [
        { name: 'Sergio ?' },
    ],
    WestCoastWayne: [
        { name: 'Ervin Haywood' },
        { name: 'Charles "Smoke" Dunn' },
    ],
    Wetbow: [
        { name: 'Amadeus Abraham' },
    ],
    WhiskeyTheRedd: [
        { name: 'Devyn "Dakota" Dunning' },
    ],
    WingTroker: [
        { name: 'Bert Silver' },
        { name: 'Sally Cooper-Borr' },
    ],
    Wombax: [
        { name: 'Nash' },
    ],
    woplotomo: [
        { name: '? ?', assume: 'neverNp' },
    ],
    Wrighty: [
        { name: 'Jack Reed' },
        { name: 'Logan Monroe', factions: ['Law'] },
        { name: 'Roscoe Riggs' },
        { name: 'Joseph Carter' },
    ],
    WTFGameNation: [
        { name: 'Morgan Calloway' },
    ],
    Xiceman: [
        { name: 'Michael Bayo' },
        { name: 'Andrew Kennedy' },
    ],
    xlt588gaming: [
        { name: 'Adam Garica' },
    ],
    XxAshleyxX: [
        { name: 'Rayven Hope', nicknames: ['Rayvn'] },
        { name: 'Zola Caiman' },
        { name: 'Noel "Leon" Taylor' },
    ],
    YatoTheMad: [
        { name: 'Cassius Evans' },
        { name: 'Charles Campbell' },
        { name: 'Liam Reilly' },
        { name: 'Alexander Williams' },
    ],
    yeka221: [
        { name: 'Tabitha "Tibbit" Birch' },
    ],
    Yorkoh: [
        { name: '[Deputy] Kai Ming', factions: ['Law'], displayName: 1 }, // TODO: Unsure of rank
    ],
    YouKnowItsJuno: [
        { name: 'Kima Abrams' },
    ],
    Yuet: [
        { name: 'Woodrow Hale' },
    ],
    yully89: [
        { name: 'Jacob Arlington' },
    ],
    yuukidav: [
        { name: 'Everett Silver' },
    ],
    Zarrqq: [
        { name: 'Benjamin Gaines', factions: ['Sams Club'], nicknames: ['Ben'], displayName: 3 },
    ],
    ZetarkGG: [
        { name: 'Cesare DiCenzo', factions: ['DiCenzo Famiglia'], leader: true },
    ],
    ZeusLair: [
        { name: 'Robbie Gold' },
    ],
    Ziggy: [
        { name: 'Norman Bones' },
        { name: 'Marly Clifton' },
    ],
    ZoltanTheDestroyer: [
        { name: 'Emmett Fitz' },
    ],
    Zombiefun: [
        { name: '[Ranger] Hal Dreen', factions: ['Rangers'] },
        { name: 'Alexander McCoy' },
        { name: 'Langston Bolo' },
    ],
};
