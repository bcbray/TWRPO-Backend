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
    ],
    abbbz: [
        { name: '[Deputy] Francesca Romano', factions: ['Law'] },
        { name: 'Sanjay Patel' },
        { name: 'Mrs. Goose', displayName: 0 }, // TODO: First name?
    ],
    AChanceOfCosplay: [
        { name: 'Bart Bancroft' },
        { name: 'Jason Forsworn' },
    ],
    aDarkFilly: [
        { name: 'Magnolia' },
    ],
    Aero_Films: [
        { name: 'Skeeter Carlisle' },
    ],
    Aestannar: [
        { name: 'Arthur Jones' },
        { name: 'Del Parker' },
    ],
    aJimmy: [
        { name: 'James Kelly' },
    ],
    Altrah: [
        { name: 'Victor Morteza' },
    ],
    alyssajeanaf: [
        { name: 'Dahlia Malone', factions: ['Sams Club'] },
    ],
    AM_Raid: [
        { name: 'Cain Lockhart' },
        { name: 'Clifford Buck' },
        { name: '[Deputy] Giorgio Santorelli', factions: ['Law'] },
        { name: 'Raul Sanchez' },
    ],
    AngelKnivez: [
        { name: 'Renni Bradshaw', nicknames: ['Rimmy'] },
    ],
    AngryPotatoChipz: [
        { name: 'Jamie Marlow' },
        { name: 'Isiah Trebuchet' },
    ],
    AnthonyZ: [
        { name: 'Antonio Corleone', nicknames: ['Tony'] },
    ],
    APPLESHAMPOO: [
        { name: 'Kenny Kidman' },
    ],
    Arc_Of_Fire: [
        { name: 'Nathan Terriers' },
    ],
    ArmoredAndy: [
        { name: 'Buzz Buxton' },
        { name: 'Adolf "Dolfie" Hofcooperstedder' },
        { name: 'Moose' },
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
        { name: 'Scarlet' }, // TODO: Last name?
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
    ],
    AwaBeats: [
        { name: 'Ali Mason' },
        { name: 'Nokosi Ahanu' },
        { name: 'C-Lo' }, // TODO: Real name?
        { name: 'Yorrik Morales' },
    ],
    ayekayy47_: [
        { name: 'Misty Shaw' },
        { name: 'Rayne Beaux' },
    ],
    AzzTazz: [
        { name: 'Eric Butter' },
        { name: 'Solomon Kray' },
        { name: 'Thomas Ethan', nicknames: ['The Kid'] },
    ],
    babysiren_: [
        { name: 'Laura Dunn' },
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
        { name: '[Cadet] Clifford Dawes', factions: ['Law'] },
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
        { name: 'Avery Eliss' },
    ],
    BernieIsLive: [
        { name: 'Noah Little' },
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
    BoosterGreg: [
        { name: 'Roy Whitmore' },
    ],
    Boxeryedig: [
        { name: 'Timothy Johnson' },
        { name: 'Daniel McCormic' },
        { name: 'Bud Pierce' },
    ],
    BradWOTO: [
        { name: 'Rufus Lorde' },
        { name: 'Tar Sullivan' },
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
        { name: 'Wu Buddha' },
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
    ],
    buttrito: [
        { name: 'Dakota Slim' },
    ],
    Caffine5: [
        { name: 'Billy Falco' },
        { name: 'Vincenzo Struzzo' },
        { name: 'Vincenzo Struzzo' },
    ],
    calibriggs: [
        { name: 'Henry Baptiste' },
        { name: '[Deputy] Joseph Parrish', factions: ['Law'] },
    ],
    CallieCakez: [
        { name: '[Ranger] Amelie Ashton', factions: ['Rangers'] },
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
    ],
    Cheever7: [
        { name: 'Aurora Rayne' },
    ],
    Chief: [
        { name: 'Caesar Coal' },
        { name: 'Tuuyship Áama' },
    ],
    CHUDOCKEN: [
        { name: 'Qeljayiden', nicknames: ['Qelajayiden', 'Jaden'] },
    ],
    ClassicSteeve: [
        { name: 'Melvin Brown' },
    ],
    ClassyPax: [
        { name: 'Eugene Calloway' },
        { name: 'Father Hickey' },
    ],
    CloakingHawk: [
        { name: '[Ranger] Danni Jackson', factions: ['Rangers'] },
        { name: 'Roo' },
        { name: 'Tilly-May Edwards' },
    ],
    CloeeBee: [
        { name: 'Alice Bennett' },
        { name: 'Rose Pond' },
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
    crocc_: [
        { name: 'Santino "Sonny" DiCenzo', factions: ['DiCenzo Famiglia'], leader: true },
    ],
    Crom: [
        { name: 'Elias McDurn' },
    ],
    cruddycheese: [
        { name: 'Donald McMuffin' },
    ],
    CyboargTV: [
        { name: 'Porter ONeill' },
    ],
    DadnOut: [
        { name: 'Cletus Clifton' },
    ],
    Daftmedic: [
        { name: '[Doctor] Tristan Shipman', factions: ['Medical'] },
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
    dannyfloriduh: [
        { name: 'Cliff Westwood' },
    ],
    danscribe: [
        { name: 'Brett Jordan' },
        { name: 'Wolverine Payton' },
    ],
    Darthbobo77: [
        { name: 'Walter Rinsen' },
        { name: 'Cooter Jonason' },
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
    Deputy_Games: [
        { name: 'Sam Rosco' },
    ],
    DetectiveDoorag: [
        { name: '[Deputy] Casey Kramer', factions: ['Law'] },
        { name: 'Beau Wilder' },
        { name: 'Colt Clifford' },
    ],
    Dimitri: [
        { name: 'Clem Colton' },
    ],
    Dimoak: [
        { name: 'Fiddleford "Phil" Mackit' },
        { name: 'Kaz Brekker' },
        { name: 'Tommy Townsand' },
    ],
    Dirty_10: [
        { name: 'Richard Long', assume: 'assumeOther' },
    ],
    Dirty_Fisherman: [
        { name: 'Archibald Trout' },
    ],
    DisbeArex: [
        { name: 'Timmy Took' },
        { name: 'Dolly Dixon' },
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
    DreadfullyDespized: [
        { name: 'Byong Ho' },
    ],
    drendebt: [
        { name: 'Danny Kerrigan' },
        { name: 'Duncan Ladle' },
        { name: 'Duncan Weller' },
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
        { name: 'Alexander Poe' },
    ],
    Dunrunnin12: [
        { name: 'Clay' },
    ],
    DustMonkeyGames: [
        { name: '[Deputy] Charles Slaughter', factions: ['Law'] },
        { name: 'Solomon Walker' },
    ],
    dynadivine: [
        { name: 'Lucille Davis' },
        { name: 'Lucille Walker' },
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
    eternalsong: [
        { name: 'Kora Vane' },
    ],
    EthanSchriver: [
        { name: 'Leanord Scout', displayName: 2 },
    ],
    ewanruss: [
        { name: 'Alfonso Bonucci', factions: ['DiCenzo Famiglia'], nicknames: ['Coach Al', 'Al'], displayName: 4 },
    ],
    extralivia: [
        { name: 'Lydia Spade' },
    ],
    Eyebyte: [
        { name: 'Amarillo Marnen' },
        { name: 'Edbert Trunk' },
        { name: 'Rutherford Peabody' },
    ],
    famousivan: [
        { name: 'Raul Dominguez' },
        { name: 'Manual Salamanca' },
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
    Flickerclad: [
        { name: 'Evangeline Thorne' },
        { name: 'Frankie Czepanski' },
        { name: '[Sheriff] Rabbit Windward', factions: ['Law'] },
    ],
    ForeheadSkin: [
        { name: 'Edmund "Eddy" Reddington', factions: ['Sams Club'] },
        { name: 'Henry Huff' },
        { name: 'Joseph Walters' },
        { name: 'Morris Sterling' },
        { name: 'Chester Fox' },
        { name: 'Edmund Reddington' },
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
    ],
    GameBaked: [
        { name: 'Mato Tahoma', factions: ['Medical'] },
        { name: 'Adriaan' },
    ],
    GameishTV: [
        { name: 'Doug Chipper' },
        { name: 'Mike McCoy' },
    ],
    GauchoEscobar: [
        { name: 'Gaucho Escobar' },
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
    GlitchedHelix: [
        { name: 'Ada Standish' },
        { name: '[Doctor] Mya Ennis', factions: ['Medical'] },
        { name: 'Rubella Davies' },
    ],
    glitchy: [
        { name: 'James Faraday' },
        { name: 'Raymond "Rayray" Willis' },
    ],
    GmanRBI: [
        { name: 'Max Brady', factions: ['Sams Club'] },
        { name: 'Gianni Peccati' },
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
        { name: '"LJ" Little Jimothy', nicknames: ['Kid'] },
        { name: 'Clayton Orwell' },
    ],
    GraveGamerTV: [
        { name: 'Paulson Greer' },
        { name: 'Peter Gray' },
        { name: 'Balter Duncans' },
    ],
    GreenEnigma: [
        { name: 'Jericho Blackfoot' },
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
    Hoop: [
        { name: 'Barry Bjornson', factions: ['Sams Club'] },
        { name: 'Clyde Davis' },
        { name: 'Jonathan Redding', nicknames: ['Redshirt'], displayName: 3, factions: ['Half Wits'] },
        { name: '[Deputy] Miles Gyles', factions: ['Law'] },
    ],
    IanMMori: [
        { name: '[Deputy] Enrique Vespucci', factions: ['Law'] },
        { name: 'Ewan Byrne' },
        { name: 'Jonathan Coiner' },
        { name: 'Nate Coiner' },
    ],
    ianriveras: [
        { name: 'Hugo Teach' },
    ],
    IboonI: [
        { name: 'Elias Boon' },
    ],
    illwac: [
        { name: 'Ira Smith' },
    ],
    Im_HexeD: [
        { name: 'Ronnie Tate' },
        { name: 'Theodore Ellis' },
    ],
    ImFromTheFuture: [
        { name: 'Roscoe Montana', factions: ['Sams Club'] },
    ],
    iruASH: [
        { name: 'Kayce Smith' },
    ],
    ItsAsaii: [
        { name: '[Deputy] Buck Montana', factions: ['Law'] },
        { name: 'Calvin Oakes' },
        { name: 'Eli Ryckman' },
        { name: 'Shaine Calhoun' },
        { name: 'Wayne Kavanaugh' },
    ],
    Iwhuttt: [
        { name: 'Archibald Welch' },
        { name: 'Houston Gray' },
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
        { name: 'Tilly Demeter' },
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
    ],
    johnnyblamz: [
        { name: 'Gavin Summers' },
        { name: 'Jody Quinn' },
        { name: 'Logan Miller' },
    ],
    Jonthebroski: [
        { name: 'Jonathan Divine', nicknames: ['Johnny', 'JBaas', 'J\'Baas', 'J Baas'], displayName: 5 },
    ],
    JunkieEzek: [
        { name: 'Jeremiah Harth' },
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
    Kyle: [
        { name: 'Ren Solo' },
    ],
    Kyltrex: [
        { name: 'Louis "Louie" Lancaster' },
    ],
    KyQuinn: [
        { name: 'Carmen Beckett' },
        { name: 'Jackson Riggs' },
        { name: 'Miss Mystery' },
        { name: 'Olive Wallace' },
        { name: 'Portia Hartley' },
        { name: '[Deputy] Quinton Ivy', factions: ['Law'] },
        { name: 'Trixie Davenport' },
    ],
    LakunaRP: [
        { name: 'Tavish Black' },
    ],
    LEAH: [
        { name: 'Francesca "Checkers" Bright' },
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
    ],
    LiteralBear: [
        { name: 'Marcus Danner' },
        { name: '[Deputy] Negan McAlister', factions: ['Law'], displayName: 1 },
        { name: 'Joseph "JoJo" Johanson' },
    ],
    Lithiaris: [
        { name: '[Doctor] Lark Atwood', factions: ['Medical'] },
        { name: 'Sylvie Chevalier' },
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
        { name: 'Nathanial', nicknames: ['Smoke'] },
    ],
    Madmoiselle: [
        { name: 'Lily Landry' },
        { name: 'Oola Lafayette' },
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
    MaverickHavoc: [
        { name: 'Cornellius Orvid' },
    ],
    McBlairTV: [
        { name: 'Cyrus McGill' },
    ],
    MEKABEAR: [
        { name: '[Deputy] Audrey Dusk', factions: ['Law'] },
        { name: 'Goldie Fisher', factions: ['Kettleman Gang'] },
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
        { name: 'Dr Cloth' },
        { name: 'Grim' },
        { name: 'Herman Wilbur' },
        { name: 'Leon Taylor' },
    ],
    mums_live: [
        { name: 'Edward Moore' },
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
    Nbodo: [
        { name: 'Peter Rockwell' },
    ],
    NiaDrools: [
        { name: 'Madeline "Moxy" Maddox' },
        { name: 'Edith "Ed" Gretchen' },
        { name: 'Snow' },
        { name: 'Penelope' }, // TODO: Last name?
    ],
    Nidas: [
        { name: 'Eustace Goodwin' },
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
    ohheyliam: [
        { name: 'Oliver "Ollie" Quil' },
    ],
    ohnopojo: [
        { name: 'Billy Kim' },
    ],
    oldkelvo: [
        { name: 'Jack Crow' },
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
    Paracast: [
        { name: 'Erasmus South' },
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
    PibbJont: [
        { name: 'Thatcher Mantell' },
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
    privyLore: [
        { name: 'Wren Lebow' },
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
        { name: 'Nora Boone' },
    ],
    Question_Box: [
        { name: '[Sheriff] Lydia Lewis', factions: ['Law'] },
        { name: 'Blaire Turner' },
    ],
    Quip_TV: [
        { name: '[Deputy] Dove Hopkins', factions: ['Law'] },
        { name: 'Sally Higgins', nicknames: ['Shotgun'] },
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
        { name: 'Tony Moretti' },
    ],
    rosco: [
        { name: 'Awkward Johnson', displayName: 0 },
        { name: 'Frank Church' },
        { name: 'John Hell' },
    ],
    rossthehsauce: [
        { name: 'Forest Fish', factions: ['Guppy Gang'] },
        { name: 'Dominic Aldizousa', factions: ['DiCenzo Famiglia'] },
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
        { name: 'Adam Skye' },
        { name: 'Froiland Jackson' },
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
    ],
    ScarletRosePlays: [
        { name: 'Allison Chase' },
        { name: 'Bella Baker' },
        { name: 'Zoe Winters' },
    ],
    ScottJitsu: [
        { name: 'Reno Cash' },
    ],
    Scriffboy: [
        { name: 'Tane' },
    ],
    seakeon: [
        { name: 'Eoghan Quinn' },
        { name: 'Pat Campbell' },
        { name: 'William Stone' },
    ],
    section9_Browncoat: [
        { name: '[Cadet] Ned Fuller', factions: ['Law'] },
        { name: 'Nick Carver' },
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
    Sidkriken: [
        { name: 'Dane Swan', factions: ['Law'] },
        { name: 'Gator Weaver' },
        { name: 'Odysseus Kain' },
        { name: 'Mr. White', displayName: 0 }, // TODO: Don't know first name
    ],
    Silbullet: [
        { name: '[Deputy] Shawn Maple', factions: ['Law'] },
        { name: 'Stefano Amendo' },
    ],
    SilentSentry: [
        { name: 'Emmet "Stripes" Wagner' },
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
        { name: 'Billy Joe Barber', nicknames: ['Billy Joe', 'BJB'], displayName: 4 },
    ],
    SLiMt: [
        { name: 'Jimmy "Slim Jim" Slimper' },
    ],
    sneakyShadower: [
        { name: '[Deputy] Abigail Jones', factions: ['Law'] },
        { name: 'Azula Brooks' },
        { name: '[Doctor] Isabella Vautour', factions: ['Medical'] },
        { name: '[Deputy] Jackie Lockwood', factions: ['Law'] },
        { name: 'Raven Bennett' },
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
        { name: '[Cadet] Cait McAlister', factions: ['Law'] },
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
        { name: 'Francesca "Frankie" Bright' },
        { name: 'Harriet "Hawk" Hawkins' },
        { name: 'Brie Haviour' },
    ],
    squareiz: [
        { name: 'Ed Doyle' },
    ],
    Ssaab: [
        { name: 'Sam Baas', factions: ['Sams Club'], leader: true, nicknames: ['Dank Outlaw'], assumeChar: true },
        { name: 'Ali Baba', displayName: 0 },
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
    ],
    Sylasism: [
        { name: 'Atty Windward' },
        { name: 'Franklin Czepanski' },
        { name: 'Bartleby Sinclair' },
    ],
    Syraphic: [
        { name: 'Emilia "Emi" Song' },
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
        { name: '[Mershal] Rico Ortega', factions: ['Law'] },
    ],
    Taranix: [
        { name: 'Mattias Temble' },
    ],
    Tasara22: [
        { name: 'Betty Butcher' },
        { name: '[Deputy] Jane Ripley', factions: ['Law'] },
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
        { name: 'Klaus Pudovkin', factions: ['Kettleman Gang'] }, // TODO: Confirm faction
        { name: 'Luke Colton', factions: ['Coltons'] },
    ],
    Thadrius: [
        { name: 'Jimmy Frick' },
    ],
    ThatTrollsomeGuy: [
        { name: 'Logan Callaway' },
        { name: '[Deputy] Robertson', factions: ['Law'] }, // TODO: First name?
    ],
    The_Devils_Son: [
        { name: 'Fredrick Smythe' },
    ],
    The_Metro_Man1: [
        { name: 'Jim Sky' },
        { name: 'Felix Nileson' },
    ],
    The_Mountain_Troll: [
        { name: 'Basey "Red" Bohannon' },
    ],
    TheAaronShaq: [
        { name: 'Kenneth "Ricky" Randall' },
    ],
    TheAmelina: [
        { name: 'Elisabeth "Ellie" Beauregard' },
    ],
    TheBanditKingUK: [
        { name: 'Damien Gallagher' },
        { name: 'Sebastien Woodrow' },
        { name: 'Tobias Graves' },
        { name: 'Jonas Steel' },
    ],
    TheCocacolafreak: [
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
    TheGeneralSmokey: [
        { name: 'Edwin Braithwaite', factions: ['Kettleman Gang'] },
    ],
    TheGoochTV: [
        { name: 'Becker Lang' },
    ],
    TheJasonPhoenix: [
        { name: 'Fenix Hayston' },
    ],
    theLGX: [
        { name: 'Abner Ace' },
    ],
    TheObsidianTravelersCo: [
        { name: 'Cornileus Moon' },
    ],
    ThePatrician69: [
        { name: 'Nate Casey', factions: ['Kettleman Gang'] },
    ],
    TheRandomChick: [
        { name: '[Doctor] Bella Trix', nicknames: ['Bellatrix'], displayName: 3, factions: ['Medical'] },
        { name: 'Poppet Deveaux' },
    ],
    TheStreetMagnet: [
        { name: 'Josiah Shepard' },
    ],
    TheTofuSamurai: [
        { name: 'Jimothy James' },
    ],
    TheZenPunk: [
        { name: 'William "Wild Willy" Brown' },
    ],
    ThinkingQuill: [
        { name: 'Cian Malloy' },
        { name: 'Hymnal Smed' },
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
    ],
    tmcrane: [
        { name: 'Lucius Bickmore' },
        { name: 'Alfred Kidd' },
    ],
    TnFD: [
        { name: 'Julian Charleston' },
    ],
    Tonixion: [
        { name: 'Howard Purdnar' },
        { name: 'Samson Graves' },
    ],
    toodlehausn: [
        { name: 'Adelae "Ada" Wright' },
        { name: 'Sadie Stronge' },
    ],
    travpiper: [
        { name: 'William "Bill" Gunner', nicknames: ['Bill', 'Carlos Sanchez', 'Carlos'] },
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
        { name: 'Carlo Marciano' },
    ],
    VERTiiGOGAMING: [
        { name: '[Deputy] Boyd Kerrigan', factions: ['Law'] },
        { name: 'Joey Johns', nicknames: ['Wallaby Kid'], factions: ['Dead End Kids'] },
        { name: 'Les Darcy' },
        { name: 'Bazz Kerrigan', factions: ['Kettleman Gang'] },
    ],
    VTM___: [
        { name: 'Boone Morales' },
        { name: 'Guy Hyneman' },
    ],
    WaistcoatDave: [
        { name: 'Dr. C.J Matthews' },
    ],
    WANTED_MANIAC: [
        { name: '[Deputy] Brian Wright', factions: ['Law'] },
        { name: 'Taylor Hicks' },
        { name: 'William "Bill" Carver' },
    ],
    Warthog155: [
        { name: 'Porter ONeill' },
    ],
    WestCoastWayne: [
        { name: 'Ervin Haywood' },
        { name: 'Charles "Smoke" Dunn' },
    ],
    weyutv: [
        { name: 'Alawa "Ali" Meota' },
    ],
    WingTroker: [
        { name: 'Bert Silver' },
        { name: 'Sally Cooper-Borr' },
    ],
    Wombax: [
        { name: 'Nash' },
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
    xlt588gaming: [
        { name: 'Adam Garica' },
    ],
    XxAshleyxX: [
        { name: 'Rayven Hope' },
        { name: 'Zola Caiman' },
        { name: 'Noel Taylor' },
    ],
    YatoTheMad: [
        { name: 'Cassius Evans' },
        { name: 'Charles Campbell' },
        { name: 'Liam Reilly' },
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
    ],
};
