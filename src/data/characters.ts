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

// const reg = (r: RegExp): string => `/${r.source}/`;

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
        { name: 'Francesca Romano', factions: ['Law'] },
        { name: 'Sanjay Patel' },
    ],
    AChanceOfCosplay: [
        { name: 'Bart Bancroft' },
        { name: 'Jason Forsworn' },
    ],
    aDarkFilly: [
        { name: 'Magnolia' },
    ],
    Aestannar: [
        { name: 'Arthur Jones' },
    ],
    aJimmy: [
        { name: 'James Kelly' },
    ],
    Altrah: [
        { name: 'Victor Morteza' },
    ],
    alyssajeanaf: [
        { name: 'Dahlia Malone' },
    ],
    AM_Raid: [
        { name: 'Cain Lockhart' },
        { name: 'Clifford Buck' },
        { name: 'Giorgio Santorelli', factions: ['Law'] },
        { name: 'Raul Sanchez' },
    ],
    AngelKnivez: [
        { name: 'Renni Bradshaw', nicknames: ['Rimmy'] },
    ],
    AngryPotatoChipz: [
        { name: 'Jamie Marlow' },
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
        { name: 'Adolf Hofcooperstedder', nicknames: ['Dolfie'], displayName: 3 },
        { name: 'Moose' },
    ],
    AtomosCLU: [
        { name: 'George Anderson' },
    ],
    AtopDerekMountain: [
        { name: 'Dante Valentino' },
        { name: 'Devoghn Brown' },
        { name: 'Red Stag' },
        { name: 'Walter Cross' },
        { name: 'Wechugue Wechugue' },
        { name: 'Zhang Wei' },
    ],
    AustiinTV: [
        { name: 'Mickey Toolin' },
    ],
    aviceration: [
        { name: 'Ella Mason' },
        { name: 'Vincencia Romeo', nicknames: ['Vinnie'], displayName: 3 },
        { name: 'Kitty LaRoux' },
    ],
    Avioto_: [
        { name: 'Amadeo Moretti', factions: ['DiCenzo Famiglia'] },
    ],
    AwaBeats: [
        { name: 'Ali Mason' },
        { name: 'Nokosi Ahanu' },
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
    BASHZOR: [
        { name: 'Wade Kilian' },
    ],
    Beanblanket: [
        { name: 'Clifford Dawes' },
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
        { name: '[Cadet] Kate Hearst', factions: ['Law'] },
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
    ],
    BunglingNormal2: [
        { name: 'Henry Gearhardt' },
    ],
    BurtLington: [
        { name: '[Sheriff] Marty Malone', factions: ['Law'] },
    ],
    Caffine5: [
        { name: 'Billy Falco' },
    ],
    calibriggs: [
        { name: 'Henry Baptiste' },
        { name: 'Joseph Parrish', factions: ['Law'] },
    ],
    CallieCakez: [
        { name: '[Ranger] Amelie Ashton', factions: ['Rangers'] },
    ],
    CapitalOGttv: [
        { name: 'Franklin Costella' },
        { name: 'James Black', nicknames: ['Jimi'], displayName: 3 },
    ],
    CaptainMeef: [
        { name: 'Casey Jones' },
    ],
    CaptRubble: [
        { name: 'Joseph Stone' },
        { name: 'Percy Peanut' },
    ],
    CarbonitePlays: [
        { name: 'Evan Madeley', factions: ['Law'] },
        { name: 'Karl North' },
        { name: 'Lance Irwin' },
        { name: 'Mervyn Castor' },
        { name: 'Miguel Sanchez' },
    ],
    Carlos_Spicyw3iner: [
        { name: 'Larry Brown' },
    ],
    CaseFace5: [
        { name: 'Willie Walker', nicknames: ['Gramps'] },
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
        { name: 'Qeljayiden' },
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
    ConnorCronus: [
        { name: '[Deputy] Rip Riley', factions: ['Law'] },
        { name: 'Isaac Smith' },
        { name: 'Karlias Drex' },
        { name: 'Richard Sionis' },
    ],
    Coolidge: [
        { name: 'Frank Murdock' },
    ],
    Crom: [
        { name: 'Elias McDurn' },
    ],
    Daftmedic: [
        { name: '[Doctor] Tristan Shipman', factions: ['Medical'] },
    ],
    Dam_O: [
        { name: 'Grover Carlson' },
    ],
    DangitLacie: [
        { name: 'Doreen Pavus', factions: ['Law'] },
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
        { name: '[Deputy] Kramer', factions: ['Law'] },
        { name: 'Beau Wilder' },
        { name: 'Colt Clifford' },
    ],
    Dimoak: [
        { name: 'Fiddleford Mackit', nicknames: ['Phil'], displayName: 3 },
        { name: 'Kaz Brekker' },
        { name: 'Tommy Townsand' },
    ],
    Dirty_Fisherman: [
        { name: 'Archibald Trout' },
    ],
    DisbeArex: [
        { name: 'Timmy Took' },
        { name: 'Dolly Dixon' },
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
    ],
    DubEkostep: [
        { name: 'Pancho Zapata', nicknames: ['El Cucuy'] },
    ],
    DukeOfFlukes: [
        { name: 'Alexander Poe' },
    ],
    Dunrunnin12: [
        { name: 'Clay' },
    ],
    DustMonkeyGames: [
        { name: '[Cadet] Charles Slaughter', factions: ['Law'] },
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
        { name: 'Crissy Blitz', nicknames: ['Cricket'] },
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
    ],
    EquinoxRP: [
        { name: 'Brendyn Cormac' },
    ],
    eternalangelgames: [
        { name: 'Kora Vane' },
    ],
    EthanSchriver: [
        { name: 'Leanord Scout', displayName: 2 },
    ],
    ewanruss: [
        { name: 'Alfonso Bonucci', factions: ['DiCenzo Famiglia'], nicknames: ['Coach Al', 'Al'] }  
    ],
    extralivia: [
        { name: 'Lydia Spade' },
    ],
    Eyebyte: [
        { name: 'Amarillo Marnen' },
        { name: 'Edbert Trunk' },
    ],
    famousivan: [
        { name: 'Raul Dominguez' },
        { name: 'Manual Salamanca', displayName: 2 },
    ],
    Farmhouse78: [
        { name: 'Stewart Harington' },
    ],
    fayebles: [
        { name: 'Clementine Fisher' },
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
    ],
    Flickerclad: [
        { name: 'Evangeline Thorne' },
        { name: 'Frankie Czepanski' },
        { name: 'Rabbit Windward', factions: ['Law'] },
    ],
    ForeheadSkin: [
        { name: 'Edmund Reddington' },
        { name: 'Henry Huff' },
        { name: 'Joseph Walters' },
    ],
    FrankTheTank5494: [
        { name: 'Matthew Isaiah' },
    ],
    Freumont: [
        { name: 'Edward Shaw' },
    ],
    friendly_chick: [
        { name: 'Angelica Ward', nicknames: ['Angel'] },
        { name: 'Charlotte Davis', nicknames: ['Lottie'] },
        { name: 'Haven Rivers' },
        { name: 'Lillian Frost' },
    ],
    FrostFromFire: [
        { name: 'Bianca Mackenna' },
    ],
    FunnyMatters: [
        { name: 'Clint Brimshaw' },
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
    ],
    GeorgiaBanks: [
        { name: 'Georgia Banks' },
    ],
    GlitchedHelix: [
        { name: 'Ada Standish' },
        { name: 'Mya Ennis' },
        { name: 'Rubella Davies' },
    ],
    glitchy: [
        { name: 'James Faraday' },
        { name: 'Raymond Willis', nicknames: ['Rayray'] },
    ],
    GmanRBI: [
        { name: 'Max Brady' },
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
        { name: 'Little Jimothy', nicknames: ['Kid'] },
        { name: '[Detective] Homer Carnes', factions: ['Law'] },
        { name: 'Clayton Orwell' },
    ],
    GraveGamerTV: [
        { name: 'Paulson Greer' },
        { name: 'Peter Gray' },
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
        { name: 'Ava Jimenes', nicknames: ['La Nina'] },
    ],
    HanyClaps: [
        { name: 'Levi Sawyer' },
        { name: 'Stumpy McBride' },
        { name: 'Virgil Sterling' },
    ],
    HappyYouniverse: [
        { name: 'Danny Ford' },  
    ],
    HeroMexii: [
        { name: 'George Shaffer' },
    ],
    Hibblejaybob: [
        { name: 'Astrid Aleksdóttir' },
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
        { name: 'Miles Gyles', factions: ['Law'] },
    ],
    IanMMori: [
        { name: 'Enrique Vespucci', factions: ['Law'] },
        { name: 'Ewan Byrne' },
        { name: 'Nate Coiner' },
    ],
    ianriveras: [
        { name: 'Hugo' },
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
        { name: 'Buck Montana', factions: ['Law'] },
        { name: 'Calvin Oakes' },
        { name: 'Eli Ryckman' },
        { name: 'Shaine Calhoun' },
        { name: 'Wayne Kavanaugh' },
    ],
    Iwhuttt: [
        { name: 'Houston Gray' },
        { name: 'Archibald' },
    ],
    J0J0: [
        { name: 'Delilah Kane' },
        { name: 'Effie Parker' },
        { name: 'Katherine Dunn' },
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
    JarlOfGoats: [
        { name: 'Gabriel Lenihan' },
    ],
    JayBritton: [
        { name: 'Heath Marker-Brown' },
        { name: 'Lucius Alabaster' },
        { name: 'Obidiah Colt', factions: ['Law'] },
        { name: 'Scooter Brown' },
    ],
    Jennybeartv: [
        { name: 'Gemma Middleton' },
    ],
    JesterTheRyda: [
        { name: 'Jordin Bradley' },
        { name: 'Joseph Silvers', nicknames: ['Hobo Joe'] },
        { name: 'Margrett Anderson' },
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
        { name: 'Nathan Thompson' },
    ],
    JustxJodi: [
        { name: 'Minnie Mines' },
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
        { name: 'Deborah VanBurton', nicknames: ['Deb'], displayName: 3 },
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
    ksinz: [
        { name: '[Deputy] Syles MacKenna', factions: ['Law'] },
        { name: 'Cucamonga Kid', factions: ['Half Wits'], displayName: 0 },
        { name: 'Milliken Fuller', nicknames: ['Mills'], displayName: 3, factions: ['Kettleman Gang'] },
    ],
    Kyle: [
        { name: 'Ren Solo' },
    ],
    Kyltrex: [
        { name: 'Louis Lancaster', nicknames: ['Louie'], displayName: 3 },
    ],
    KyQuinn: [
        { name: 'Carmen Beckett' },
        { name: 'Jackson Riggs' },
        { name: 'Miss Mystery' },
        { name: 'Olive Wallace' },
        { name: 'Portia Hartley' },
        { name: 'Quinton Ivy' },
        { name: 'Trixie Davenport' },
    ],
    LakunaRP: [
        { name: 'Tavish Black' },
    ],
    LEAH: [
        { name: 'Francesca Bright', nicknames: ['Checkers'] },
    ],
    Lendermations: [
        { name: 'Inessa Bornlof', nicknames: ['Miss Match'] },
        { name: 'Riley Rivens' },
        { name: 'Tantallia Tippins' },
    ],
    LetterJaye: [
        { name: 'Wisteria Snowdon' },
    ],
    Lithiaris: [
        { name: 'Lark Atwood' },
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
        { name: 'Jack Cameron', factions: ['Law'] },
        { name: 'Scott Samuel' },
    ],
    Madmoiselle: [
        { name: 'Lily Landry' },
        { name: 'Oola Lafayette' },
    ],
    MartyO248: [
        { name: 'Bobby Brampton' },
        { name: 'Dmitri Crenshaw' },
        { name: 'Marty Hanes' },
    ],
    MaverickHavoc: [
        { name: 'Cornellius Orvid' },
    ],
    MEKABEAR: [
        { name: '[Detective] Audrey Dusk', factions: ['Law'] },
        { name: 'Goldie Fisher', factions: ['Kettleman Gang'] },
    ],
    Mhaple_: [
        { name: 'Morgan Lee' },
    ],
    Mick: [
        { name: 'Gladys Berry' },
    ],
    MinksOfMars: [
        { name: 'Irene Corvis', factions: ['Sams Club'], nicknames: ['Peaches'], displayName: 3 },
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
        { name: 'Goon Bones', nicknames: ['Goom-Boobie'] },
    ],
    MrMoonsHouse: [
        { name: 'Tommy Roach', nicknames: ['Two Snakes', 'Tommy Two Snakes'], displayName: 4 },
    ],
    MrPandaaBear: [
        { name: 'Cathal McCarthy' },
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
        { name: 'Chauncy Charles', nicknames: ['The Barman'] },
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
        { name: 'Madeline Maddox', nicknames: ['Moxy'], displayName: 3 },
        { name: 'Edith Gretchen', nicknames: ['Ed'], displayName: 3 },
        { name: 'Snow' },
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
    ],
    og_cush00: [
        { name: 'Walter Bridges' },
    ],
    ohheyliam: [
        { name: 'Oliver Quil', nicknames: ['Ollie'], displayName: 3 },
    ],
    ohnopojo: [
        { name: 'Billy Kim' },
    ],
    Orcish: [
        { name: '[Deputy] Allistair McGregor', factions: ['Law'] },
        { name: 'Billy Beetur' },
        { name: 'Otis Potts' },
        { name: 'Richard Westlake' },
        { name: 'Tripp Riggs' },
    ],
    peachycoaster: [
        { name: 'Chrissy Snow' },
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
    PukingFerrets: [
        { name: 'Alice Quinn' },
    ],
    Pumpkinberry: [
        { name: 'Honey Sparks' },
        { name: 'Nora Boone' },
    ],
    Question_Box: [
        { name: '[Sheriff] Lydia Lewis', factions: ['Law'] },
    ],
    Quip_TV: [
        { name: 'Dove Hopkins', factions: ['Law'] },
        { name: 'Sally Higgins', nicknames: ['Shotgun'] },
    ],
    REKKRPRO: [
        { name: 'Rekks Tanner' },
    ],
    RickMongoLIVE: [
        { name: 'Cole Dalton' },
        { name: 'Furio Bonanno' },
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
        { name: 'Christine Thomas', nicknames: ['Momma'], displayName: 3 },
        { name: 'Joe Burns', nicknames: ['Moonshine Joe'] },
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
    Scriffboy: [
        { name: 'Tane' },
    ],
    seakeon: [
        { name: 'Eoghan Quinn' },
        { name: 'Pat Campbell' },
        { name: 'William Stone' },
    ],
    section9_Browncoat: [
        { name: 'Ned Fuller' },
        { name: 'Nick Carver' },
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
        { name: 'Emmet Wagner', nicknames: ['Stripes'], displayName: 3 },
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
        { name: 'Jimmy Slimper', nicknames: ['Slim Jim'] },
    ],
    sneakyShadower: [
        { name: 'Abigail Jones', factions: ['Law'] },
        { name: 'Azula Brooks' },
        { name: 'Isabella Vautour' },
        { name: 'Jackie Lockwood', factions: ['Law'] },
        { name: 'Raven Bennett' },
    ],
    Sock22: [
        { name: 'Daniel Moss' },
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
        { name: 'Aoife McCarthy', factions: ['Law'] },
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
        { name: 'Francesca Bright', nicknames: ['Frankie'], displayName: 3 },
        { name: 'Harriet Hawkins', nicknames: ['Hawk'], displayName: 3 },
    ],
    squareiz: [
        { name: 'Ed Doyle' },
    ],
    Ssaab: [
        { name: 'Sam Baas', factions: ['Sams Club'], leader: true, nicknames: ['Dank Outlaw'] },
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
        { name: 'Jean-Pierre Lefrancois', factions: ['Law'] },
        { name: 'Julius Bradshaw', nicknames: ['Jade King'] },
        { name: 'Rico Ortega', factions: ['Law'] },
    ],
    Taranix: [
        { name: 'Mattias Temble' },
    ],
    Tasara22: [
        { name: 'Betty Butcher' },
        { name: 'Jane Ripley', factions: ['Law'] },
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
        { name: 'Luke Colton' },
    ],
    ThatTrollsomeGuy: [
        { name: 'Logan Callaway' },
    ],
    The_Devils_Son: [
        { name: 'Fredrick Smythe' },
    ],
    The_Metro_Man1: [
        { name: 'Jim Sky' },
    ],
    TheAaronShaq: [
        { name: 'Kenneth Randall', nicknames: ['Ricky'], displayName: 3 },
    ],
    TheAmelina: [
        { name: 'Elisabeth Beauregard', nicknames: ['Ellie'], displayName: 3 },
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
    TheFoodcartGamer: [
        { name: 'Felix Ellis' },
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
        { name: 'Bella Trix', nicknames: ['Bellatrix'], displayName: 3 },
        { name: 'Poppet Deveaux' },
    ],
    TheStreetMagnet: [
        { name: 'Josiah Shepard' },
    ],
    TheZenPunk: [
        { name: 'William Brown', nicknames: ['Wild Willy'], displayName: 3 },
    ],
    ThrallJo: [
        { name: 'Corvus Clements' },
    ],
    TiltedSun: [
        { name: 'Madison Windward' },
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
        { name: 'Adelae Wright', nicknames: ['Ada'], displayName: 3 },
        { name: 'Sadie Stronge' },
    ],
    travpiper: [
        { name: 'William Gunner', nicknames: ['Bill', 'Carlos Sanchez', 'Carlos'], displayName: 3 },
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
        { name: 'Nahmala Wolfe', nicknames: ['Wolf'] },
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
    VERTiiGOGAMING: [
        { name: '[Deputy] Boyd Kerrigan', factions: ['Law'] },
        { name: 'Joey Johns', nicknames: ['Wallaby Kid'], factions: ['Dead End Kids'] },
        { name: 'Les Darcy' },
        { name: 'Bazz Kerrigan', factions: ['Kettleman Gang'] },
    ],
    VTM___: [
        { name: 'Boone Morales' },
    ],
    WaistcoatDave: [
        { name: 'Dr. C.J Matthews' },
    ],
    WANTED_MANIAC: [
        { name: 'Brian Wright', factions: ['Law'] },
        { name: 'Taylor Hicks' },
        { name: 'William Carver', nicknames: ['Bill'] },
    ],
    Warthog155: [
        { name: 'Porter ONeill' },
    ],
    WestCoastWayne: [
        { name: 'Ervin Haywood' },
    ],
    weyutv: [
        { name: 'Alawa Meota', nicknames: ['Ali'], displayName: 3 },
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
    XxAshleyxX: [
        { name: 'Rayven Hope' },
        { name: 'Zola Caiman' },
    ],
    YatoTheMad: [
        { name: 'Cassius Evans' },
        { name: 'Charles Campbell' },
    ],
    yeka221: [
        { name: 'Tibbit' },
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
        { name: 'Cesare DiCenzo', factions: ['DiCenzo Famiglia'] },
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
        { name: 'Hal Dreen' },
    ],
};
