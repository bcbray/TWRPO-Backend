/* eslint-disable object-curly-newline */

import { FactionRealFull } from './meta';

export type AssumeOther = 'assumeNpNoOther' | 'assumeNp' | 'assumeOther' | 'someOther' | 'neverNp';

export interface Character {
    id: number;
    name: string;
    factions?: FactionRealFull[];
    formerFactions?: FactionRealFull[];
    displayName?: number;
    nicknames?: string[];
    leader?: boolean;
    highCommand?: boolean;
    affiliate?: boolean;
    assume?: AssumeOther;
    assumeChar?: boolean;
    deceased?: boolean;
    telegram?: string;
}

export type WrpCharacters = { [key: string]: Character[] };

const reg = (r: RegExp): string => `/${r.source}/`;

// Make character map

// Next ID: 2454

export const wrpCharacters: WrpCharacters = {
    '0porkchop0': [
        { id: 1612, name: 'Maren McCormack' },
    ],
    '0Reed': [
        { id: 1, name: 'Creedence McPoyle' },
    ],
    '0zark': [
        { id: 2013, name: 'Charlie Riggs' },
        { id: 2048, name: 'Raymond Russo' },
    ],
    '1018tersk': [
        { id: 2, name: 'Erling Haraldson' },
        { id: 3, name: 'Stefano Salvaturi' },
    ],
    '1Kengo': [
        { id: 1381, name: 'Chester Williams' },
    ],
    '2hands2thumbs': [
        { id: 4, name: 'Ernest Dooly' },
        { id: 5, name: 'Maverik Stone', factions: ['Boons Boys'], telegram: 'NK579' },
        { id: 6, name: '[Ranger] Sheppard Dutton', factions: ['Rangers'], telegram: 'IJ772' }, // LOA from Rangers
        { id: 1166, name: '[Deputy] Finnagan Huxley', factions: ['Law'], telegram: 'FH202' },
        { id: 1749, name: 'Barnaby Oswald', telegram: 'QG543' },
        { id: 1832, name: 'Odin Ward' },
        { id: 2154, name: 'Jedidiah Knox' },
    ],
    '3L1554': [
        { id: 2404, name: '[Sr. Ranger] Johanna Alegra', factions: ['Rangers'] },
    ],
    '52Chains': [
        { id: 1122, name: 'Eduardo "Slimy" Guavera' },
        { id: 1329, name: 'Cosmo Costello' },
        { id: 1709, name: 'Rigby Mordikai' },
    ],
    '615time': [
        { id: 1218, name: '[Deputy] Doug Darrell Dan', factions: ['Law'], assume: 'assumeOther' },
        { id: 1917, name: 'Ruth Baby', factions: ['Independent', 'Guarma'] },
    ],
    '893SHIRO': [
        { id: 7, name: 'Mitsuhide Nagahama', nicknames: ['Mitsu'], deceased: true, telegram: 'OT815', assume: 'assumeOther' },
        { id: 1200, name: 'Qurun Alghul' },
        { id: 1201, name: 'Thorkel Olafson' },
        { id: 1209, name: 'Otomo Kitano', nicknames: ['Cobweb'] }, // Agustus. Cobweb?
        { id: 1248, name: 'Giuseppe "Pepe" De Marco', nicknames: ['il Pepe'], deceased: true },
        { id: 1255, name: 'William Stagley' },
        { id: 1341, name: '[Reporter] Shiro Yoshida', factions: ['News'] }, // Medical, Newspaper, Bluestone. Faction jumping. Seems to have settled on Reporter
        { id: 1455, name: 'Adan Jimenez', factions: ['Del Lobos'], telegram: 'XK186' },
        { id: 1470, name: 'Mo Zhaohui' },
        { id: 1741, name: 'Orazio Riina' },
        { id: 1768, name: 'Henry Fisher' },
        { id: 1874, name: 'Ichiro Yoshida', telegram: 'CX905' },
        { id: 2201, name: 'Yang Jianjun', deceased: true },
        { id: 2260, name: 'Abraham Cross' },
    ],
    AaronBlack_: [
        { id: 1514, name: 'Michael Sullivan', factions: ['Conductors'], telegram: 'DB279' }, // Just boats in SCTA
    ],
    AaronOnAir: [
        { id: 8, name: '[Deputy] Dylan "Tex" Texler', factions: ['Law'] },
    ],
    AarynRollsDice: [
        { id: 1671, name: '[Doctor] Elianna Rivers', nicknames: ['Elianna Carver'], factions: ['Medical'], formerFactions: ['Law'], telegram: 'AA883' },
        { id: 2115, name: '[Ranger] Marion Dillard', factions: ['Rangers'] },
    ],
    abbbz: [
        { id: 9, name: '[Deputy] Francesca Romano', factions: ['Law'] },
        { id: 10, name: 'Sanjay Patel' },
        { id: 11, name: 'Gertrude Goose', nicknames: ['Mrs. Goose'], displayName: 3, telegram: 'RJ718', deceased: true },
        { id: 1928, name: 'Eloise Braithwaite', nicknames: ['Auntie', 'Auntie Braithwaite'], displayName: 3 },
    ],
    abrakadave: [
        { id: 2203, name: 'William Cromwell' },
        { id: 2230, name: 'Gus Guthrie' },
    ],
    Acetrope: [
        { id: 1519, name: '[Undersheriff] Dan Lin', factions: ['Law'], telegram: 'BQ109' },
    ],
    AChanceOfCosplay: [
        { id: 12, name: 'Bart Bancroft' },
        { id: 13, name: 'Jason Forsworn' },
        { id: 14, name: 'William "Billy" Boomer' },
    ],
    AcornBandit: [
        { id: 2026, name: 'Aurelia Rickman' },
    ],
    aDarkFilly: [
        { id: 15, name: 'Magnolia Decker', factions: ['The Nameless'] },
    ],
    Adversitix: [
        { id: 1071, name: 'Finley Burton' },
    ],
    Aero_Films: [
        { id: 16, name: 'Skeeter Carlisle', telegram: 'WJ178' },
    ],
    Aestannar: [
        { id: 17, name: 'Arthur Jones' },
        { id: 18, name: 'Del Parker' },
    ],
    Afro: [
        { id: 19, name: 'Gordon Parks' },
    ],
    Agent_Ozone: [
        { id: 2062, name: 'Teddy Turleston' },
    ],
    Agidon: [
        { id: 20, name: 'Holt MacMillan' },
    ],
    AgrippaMaxentius: [
        { id: 1497, name: 'Buster Dalton', formerFactions: ['Quil Gang'] },
        { id: 1499, name: 'Vinny Lombardi' },
        { id: 1836, name: 'Maurice Chevalier' },
        { id: 1837, name: 'Alfonse "Al" Declan' },
        { id: 1968, name: 'Zeca Barbosa' },
        { id: 2103, name: '[Cadet] Bill Duffy', factions: ['Law'] },
        { id: 2222, name: 'Micah Styx' },
        { id: 2411, name: 'Gunter Vonschlapp' },
    ],
    aintitadam: [
        { id: 1842, name: 'Cassius McClure' },
        { id: 2182, name: 'Brock Cactus', factions: ['Perma Trail'], deceased: true },
    ],
    aJimmy: [
        { id: 21, name: 'James Kelly', nicknames: ['Kame Jelly', 'Kelbert'], displayName: 0, factions: ['Kelly Gang'], leader: true, formerFactions: ['Kettleman Gang'], telegram: 'NB240', deceased: true },
        { id: 1029, name: 'Kenny Kingston' },
        { id: 1206, name: 'Sunny Falls' },
        { id: 1718, name: 'Theodore Gold' },
        { id: 2229, name: 'Jasper Woods' },
    ],
    AlbyGG: [
        { id: 1445, name: '[Sheriff] Gabriel Cash', factions: ['Law'], telegram: 'NU948' },
        { id: 1604, name: 'Nile Moss', telegram: 'PJ419' },
    ],
    aleks: [
        { id: 1828, name: 'Eli Smith', telegram: 'UW856' },
    ],
    alleycatpack: [
        { id: 2324, name: 'Eli Blair' },
    ],
    Altrah: [
        { id: 22, name: 'Victor Morteza' },
        { id: 1162, name: 'Kit Saxton' },
        { id: 2038, name: 'Vern ?', factions: ['The Baastards'] },
    ],
    alta_ambulate: [
        { id: 1592, name: 'Clint Solis' },
        { id: 1662, name: 'Brennan Greene' },
    ],
    AlwayStayBlack: [
        { id: 23, name: 'Shaggy McRaggzzah' },
        { id: 1101, name: 'Caveman' },
    ],
    alyssajeanaf: [
        { id: 24, name: 'Dahlia Malone', nicknames: ['Songbird'], telegram: 'WS289' }, // Former Sam's Club. Former Fantoni Crew
        { id: 1099, name: 'Evelyn Salvatore', telegram: 'XR135' },
        { id: 1979, name: 'Chelsea Monroe' },
    ],
    AM_Raid: [
        { id: 25, name: 'Cain Lockhart', nicknames: ['Loverboy'], factions: ['Red Water'] },
        { id: 26, name: 'Clifford Buck' },
        { id: 27, name: 'Giorgio "Gio" Santorelli', nicknames: ['Wolf of Justice'] }, // Former law? Aspiring Law
        { id: 28, name: 'Raul Sanchez' },
    ],
    AmeliaTyler: [
        { id: 1878, name: 'Vivian de Winter' },
        { id: 1879, name: 'Violet Alabaster' },
    ],
    AmiAymi: [
        { id: 2406, name: 'Bailey ?' },
    ],
    Amora_xox: [
        { id: 1625, name: 'Nellie Cipriano', telegram: 'YU662' },
        { id: 1626, name: 'Soriya Grimm', telegram: 'RV828' },
        { id: 1821, name: 'Ginnie Darby', nicknames: ['Broccoli'], telegram: 'FJ125' },
        { id: 2438, name: 'Topanga Berry' },
    ],
    AmRainbowBee: [
        { id: 1246, name: 'Mildred "Millie" Price' },
        { id: 2165, name: 'Dora Smithers', factions: ['Perma Trail'] },
    ],
    AndiiCraft: [
        { id: 1068, name: 'Allison Gator', nicknames: ['Swamp Witch'], telegram: 'ZV440' },
        { id: 1339, name: 'Imogen Clarke' }, // News
        { id: 1940, name: '[Guard] Philippa Melker', factions: ['Sisika Guard'] },
        { id: 2019, name: 'Edith Tillman' },
        { id: 2051, name: '[Deputy] Caroline Kepple', factions: ['Law'] },
        { id: 2157, name: 'Sasha Reznikov' },
        { id: 2179, name: 'Tekla Eriksdotter' },
        { id: 2413, name: 'Lucifer Port', displayName: 0 },
        { id: 2449, name: 'Theodosia Poole' },
    ],
    andromedastarry: [
        { id: 29, name: 'Andi Walker', assume: 'assumeOther', telegram: 'DI612' },
        { id: 30, name: 'Quinn Connolly' },
        { id: 31, name: 'Gabriella Gonzales' },
    ],
    AndyMilonakis: [
        { id: 1691, name: 'Davey Barnes', telegram: 'ZN094' },
    ],
    AngelKnivez: [
        { id: 32, name: 'Renni Bradshaw', factions: ['Dead End Gang'], formerFactions: ['Kelly Gang'], telegram: 'SE192' }, // Former Danger Gang. Briefly Kelly Gang
        { id: 33, name: 'Sissilina "Sissi" Marie', factions: ['DiCenzo Famiglia'], telegram: 'BD695' },
    ],
    AngerMike: [
        { id: 1231, name: 'Virgil Fox', telegram: 'BA975' }, // Former The Ring
    ],
    anonymous_gary: [
        { id: 2309, name: 'Lester Brookes' },
    ],
    anteFrost: [
        { id: 2315, name: 'Ezra Reaves' },
    ],
    AnthonyZ: [
        { id: 36, name: 'Antonio Corleone', nicknames: ['Tony'], factions: ['DiCenzo Famiglia'], telegram: 'SE317' }, // Inactive DiCenzo
    ],
    Apollo_Speaks: [
        { id: 1985, name: 'Winston Halfpenny' },
    ],
    APPLESHAMPOO: [
        { id: 37, name: 'Kenny Kidman' },
    ],
    Arc_Of_Fire: [
        { id: 38, name: 'Nathan Terriers' },
    ],
    ArcticAndre: [
        { id: 1147, name: 'William Jefferson' },
    ],
    ArmoredAndy: [
        { id: 39, name: '[Game Warden] Buzz Buxton', factions: ['Rangers'], telegram: 'QG293' },
        { id: 40, name: 'Adolf "Dolfie" Hofcooperstedder' },
        { id: 41, name: 'Alexei "Moose" Mostokovich' },
    ],
    ArtByRue: [
        { id: 1464, name: 'Daniela "Dani" Fantoni', factions: ['Moretti Crew'] }, // Former Fantoni Crew
        { id: 1565, name: 'Charlie Slack', factions: ['ToPa Ota'], telegram: 'BU895' }, // Telegram might be BU985
    ],
    ARTISNACK: [
        { id: 1417, name: 'Carolina King' },
    ],
    ARustyTrekkie: [
        { id: 1160, name: 'Millicent Walker' },
    ],
    Arvenarl: [
        { id: 1422, name: '[Ranger] Alabaster King', factions: ['Rangers'], telegram: 'BN787' },
        { id: 1512, name: 'Antonio "Fat Tone" Delino' },
    ],
    Ashen_Rabbit: [
        { id: 42, name: '[Deputy] Dovie Parker', factions: ['Law'], formerFactions: ['Medical'] }, // Former Sr. Doctor
        { id: 1465, name: '[Nurse] Vivian Smith', factions: ['Medical'] },
        { id: 1880, name: 'Tyene "Ty" Catell' },
        { id: 1888, name: '[Deputy] Audrey Sandh', factions: ['Law'], telegram: 'JE785', deceased: true },
        { id: 1908, name: 'Roxanna "Roxy" Fairdeigh' },
    ],
    Ashio_exe: [
        { id: 2448, name: 'Cliff Ballinger' },
    ],
    AstroSC: [
        { id: 1450, name: 'Wayne Lovell', factions: ['The Black Company'] },
    ],
    aTinyHorse: [
        { id: 1148, name: 'Antonio "Tiny Tony" Ricci', nicknames: ['Tiny'], telegram: 'AW259' },
    ],
    AtomosCLU: [
        { id: 43, name: 'George Anderson' },
    ],
    AtopDerekMountain: [
        { id: 44, name: 'Dante Valentino' },
        { id: 45, name: 'Devoghn Lowery Brown', nicknames: ['D-Lo', reg(/d(?:\-|\s*)lo/)], displayName: 4 },
        { id: 46, name: 'Red Stag', displayName: 0 },
        { id: 47, name: 'Walter Cross' },
        { id: 48, name: '[Elder] Wechugue', factions: ['ToPa Ota'] }, // To’Pa Ota Elder
        { id: 49, name: 'Zhang Wei', displayName: 0, factions: ['Taipan'], telegram: 'HE892' },
        { id: 1300, name: 'Archibald Stevenson' },
    ],
    aureliarwrites: [
        { id: 50, name: 'Lena Phipps' },
        { id: 51, name: 'Scarlet ?' }, // TODO: Last name?
    ],
    Autumn__Raven: [
        { id: 34, name: '[Deputy] Jamie Marlow', factions: ['Law'], deceased: true },
        { id: 35, name: 'Isiah Trebuchet' },
        { id: 1174, name: '[Guard] Johannes Wolfe', factions: ['Sisika Guard'] },
        { id: 1194, name: 'Dylan Dunning' },
        { id: 1226, name: '[Deputy] Christian Sawyer', factions: ['Law'], telegram: 'DV709' },
        { id: 1466, name: 'Halcón Cardoza', factions: ['Del Lobos'], telegram: 'EQ437', deceased: true },
        { id: 1739, name: '[Deputy] Nika Mercer', factions: ['Law'], telegram: 'WU074' },
        { id: 1959, name: 'Elizabeth Haynes' },
        { id: 2025, name: 'Lex Lockhart' },
        { id: 2295, name: 'Alexander Krause', deceased: true },
    ],
    aviceration: [
        { id: 53, name: 'Ella Mason' },
        { id: 54, name: 'Vincencia "Vinnie" Romeo', deceased: true },
        { id: 55, name: 'Kitty LaRoux' },
    ],
    Avioto_: [
        { id: 56, name: 'Amadeo Moretti', factions: ['Moretti Crew'], leader: true, telegram: 'RI209' },
        { id: 57, name: 'Mo Tengfei' },
    ],
    aviyah: [
        { id: 1955, name: 'Julius Grimes', factions: ['Pruitt Gang'] },
        { id: 2440, name: '[Deputy] Hugh Hammer', factions: ['Law'] },
        { id: 2452, name: 'Pete Littleman', deceased: true },
    ],
    avocadotoasty83: [
        { id: 1371, name: 'Naomi Angeli', nicknames: [reg(/𝒩𝒶𝑜𝓂𝒾|𝒜𝓃𝑔𝑒𝓁𝒾|𝓝𝓪𝓸𝓶𝓲|𝓐𝓷𝓰𝓮𝓵𝓲/)], telegram: 'BP413' }, // 𝒩𝒶𝑜𝓂𝒾 𝒜𝓃𝑔𝑒𝓁𝒾, 𝓝𝓪𝓸𝓶𝓲 𝓐𝓷𝓰𝓮𝓵𝓲
        { id: 1414, name: 'Camila Madrazo', nicknames: [reg(/𝓒𝓪𝓶𝓲𝓵𝓪|𝓜𝓪𝓭𝓻𝓪𝔃𝓸/)] }, // 𝓒𝓪𝓶𝓲𝓵𝓪 𝓜𝓪𝓭𝓻𝓪𝔃𝓸
        { id: 1434, name: 'Raven Blackwood', nicknames: [reg(/𝕽𝖆𝖛𝖊𝖓|𝕭𝖑𝖆𝖈𝖐𝖜𝖔𝖔𝖉/)] }, // 𝕽𝖆𝖛𝖊𝖓 𝕭𝖑𝖆𝖈𝖐𝖜𝖔𝖔𝖉
        { id: 1506, name: 'Cordelia Crabtree', nicknames: [reg(/𝓒𝓸𝓻𝓭𝓮𝓵𝓲𝓪|𝓒𝓻𝓪𝓫𝓽𝓻𝓮𝓮/)] }, // 𝓒𝓸𝓻𝓭𝓮𝓵𝓲𝓪 𝓒𝓻𝓪𝓫𝓽𝓻𝓮𝓮
        { id: 1677, name: 'Rainbow Meadows', nicknames: [reg(/𝑅𝒶𝒾𝓃𝒷𝑜𝓌|𝓡𝓪𝓲𝓷𝓫𝓸𝔀|𝓜𝓮𝓪𝓭𝓸𝔀𝓼/)] }, // 𝓡𝓪𝓲𝓷𝓫𝓸𝔀 𝓜𝓮𝓪𝓭𝓸𝔀𝓼
        { id: 1678, name: 'Sebastian Tivoli' },
        { id: 2184, name: 'Natalia Romano' },
        { id: 2393, name: 'Daphne Blossom', nicknames: [reg(/𝒟𝒶𝓅𝒽𝓃𝑒|𝐵𝓁𝑜𝓈𝓈𝑜𝓂/)] }, // 𝒟𝒶𝓅𝒽𝓃𝑒 𝐵𝓁𝑜𝓈𝓈𝑜𝓂
        { id: 2402, name: 'Twyla Darcy', nicknames: [reg(/𝒯𝓌𝓎𝓁𝒶|𝒟𝒶𝓇𝒸𝓎/)] }, // 𝒯𝓌𝓎𝓁𝒶 𝒟𝒶𝓇𝒸𝓎
    ],
    AwaBeats: [
        { id: 58, name: 'Ali Mason' }, // Red Water? Did a bank job with them
        { id: 59, name: '[Elder] Nokosi Ahanu', factions: ['ToPa Ota', 'Sun Warriors'] },
        { id: 60, name: '[Deputy] Cleveland Brown', nicknames: ['C-Lo'], displayName: 3, factions: ['Law'], telegram: 'ZM161' },
        { id: 61, name: 'Yorrik Morales' },
    ],
    ayebizzi: [
        { id: 1081, name: 'Ariel Madison', formerFactions: ['Little Gang', 'Quil Gang'], telegram: 'GQ613' },
        { id: 1521, name: '[Deputy] Maisie Love', factions: ['Law'], telegram: 'DI869' },
    ],
    ayekayy47_: [
        { id: 62, name: 'Ahari Thatcher', nicknames: ['Misty', 'Misty Shaw', 'Ahari Gayle'], telegram: 'WP204' },
        { id: 63, name: 'Rayne Beaux' },
        { id: 64, name: 'Toni Chambers', factions: ['Freeman Family'], telegram: 'WS220' },
        { id: 1137, name: 'Robyn Duckworth' },
    ],
    AzzTazz: [
        { id: 65, name: 'Eric Butter' },
        { id: 66, name: 'Solomon Kray' },
        { id: 67, name: 'Thomas Ethan', nicknames: ['The Kid'] },
    ],
    B0MBOX: [
        { id: 913, name: 'Roman Blanco' },
        { id: 914, name: 'Teddy Graves' },
    ],
    B3UDown: [
        { id: 68, name: 'Zip Quil', factions: ['Quil Gang'], formerFactions: ['Kettleman Gang'], telegram: 'RK699' },
        { id: 1542, name: 'Braxton Joyner' },
        { id: 1834, name: 'Elliot Underwood' },
    ],
    Baaaadgoat: [
        { id: 1433, name: 'Early Ballard', telegram: 'BP229' },
        { id: 1640, name: 'Tal "Ox" Mohrant', telegram: 'QE884' },
        { id: 2086, name: '[Deputy] James Alley', factions: ['Law'] },
    ],
    badnewsbryan: [
        { id: 115, name: 'Blue Vanderweit' },
        { id: 116, name: 'Butch Fairway' },
        { id: 117, name: 'Johnny Quick' },
        { id: 1415, name: '[Deputy] Clifford Castle', factions: ['Law'], telegram: 'PX411', deceased: true },
        { id: 1673, name: '[Deputy] Floyd Smith', factions: ['Law'], deceased: true },
        { id: 1714, name: 'Tobasco Tom' },
        { id: 1732, name: 'Marigold "Bill" Williamson', nicknames: ['Big Balls Bill'], formerFactions: ['Law'] }, // Former Deputy
        { id: 2080, name: 'Heath Horton' },
    ],
    Balmer: [
        { id: 70, name: 'Little Tibbles', displayName: 2 },
        { id: 2308, name: 'Rubb St. James' },
    ],
    bananabrea: [
        { id: 71, name: 'Josephine Gold' },
    ],
    BandiiitTV: [
        { id: 52, name: '[Recruit] Mickey Toolin', nicknames: ['Mick'], factions: ['Rangers'] },
    ],
    Bardivan: [
        { id: 1149, name: 'Vee Ornitier' },
        { id: 1154, name: 'Bardivan Jeeves' },
    ],
    BarlowOfficial: [
        { id: 833, name: 'Logan Callaway', deceased: true },
        { id: 834, name: '[Deputy] Jonathan Robertson', factions: ['Law'] },
        { id: 835, name: 'Alexander Rose' },
        { id: 1067, name: 'Jesse Ambrose' },
        { id: 1444, name: '[Deputy] Lewis Camden', factions: ['Law'], telegram: 'ED726', deceased: true },
        { id: 1491, name: 'Jason Haynes' },
        { id: 1929, name: 'Cassidy Gray' },
        { id: 2059, name: 'Aoife Byrne' },
        { id: 2385, name: 'Lucas "Hush" Riley' },
    ],
    BarryBogan: [
        { id: 72, name: 'Bernard "Bernie" Bogan', nicknames: ['Bernie the Butcher'] }, // Former Bloody Hood. Bloody Hoods disbanded
        { id: 73, name: 'Jack Doolan' },
    ],
    bashley168: [
        { id: 1638, name: 'Rose Valentine' },
    ],
    BASHZOR: [
        { id: 74, name: 'Wade Kilian' },
    ],
    batnerd420: [
        { id: 1637, name: 'Johnathan "John" Butcher' },
    ],
    BCold_TTV: [
        { id: 1632, name: 'Theodosia "Theo" Ripley', telegram: 'DX020' }, // Victory Street?
    ],
    Beanblanket: [
        { id: 75, name: '[Ranger] Clifford Dawes', factions: ['Rangers', 'Bluestone'] },
        { id: 76, name: 'Emilio Peralta' },
    ],
    BeardofOz: [
        { id: 77, name: 'Euclid Vane' },
        { id: 78, name: 'Ivan Smith' },
        { id: 79, name: 'Liam Baker' },
        { id: 80, name: 'Shep Ross' },
    ],
    bearfromopenseason: [
        { id: 2435, name: 'Issac Reid' },
    ],
    BearofFlame: [
        { id: 1167, name: 'Isaiah Smithers' },
    ],
    beatifulrewind: [
        { id: 1951, name: '? ?', assume: 'neverNp' },
    ],
    beesneez: [
        { id: 81, name: 'Georgie Meadows' },
        { id: 82, name: 'Nora Boyle' },
        { id: 83, name: '[Deputy] Avery Eliss', factions: ['Law'], telegram: 'YU105' },
        { id: 1605, name: 'Gabriella Bailey', displayName: 2, factions: ['Guarma'] },
        { id: 1919, name: 'Roxanne Robins' },
    ],
    BennayTee: [
        { id: 1112, name: 'Otto Orleans', assume: 'assumeOther' },
    ],
    BernieHeHe: [
        { id: 84, name: 'Noah Little' },
    ],
    Big_Bear731: [
        { id: 1672, name: '[Deputy] Ehret Dalton', factions: ['Law'] },
    ],
    BIG_BURGER_GUY: [
        { id: 2033, name: 'Hoss Huntley' },
        { id: 2063, name: 'Bodie LaCroix' },
    ],
    BigBadMomma: [
        { id: 1588, name: 'Gladys Pettibone', nicknames: ['Gladys Blanchard', 'Blanchard'] },
        { id: 1967, name: 'Zelda Garfinkel' },
    ],
    bigolefridge_: [
        { id: 2388, name: 'Dale Deacon' }, // Doherty Gang
    ],
    BigRed2243: [
        { id: 2039, name: 'Billy Boston' },
        { id: 2347, name: 'Roger Kennedy', factions: ['Woods Gang'] },
    ],
    BigTimmuh: [
        { id: 1039, name: 'Luke McCoy' },
    ],
    BikeMan: [
        { id: 85, name: 'Thaddeus Wick' },
    ],
    Bionic_Toothpick: [
        { id: 86, name: 'Elia Marekson' },
    ],
    BitterRabbit: [
        { id: 87, name: 'Eliza Kerrigan', telegram: 'GX206' }, // Kerrigan Ranch
        { id: 88, name: 'Grace Shelton' },
        { id: 89, name: '[Sheriff] Kate Hearst', factions: ['Law'], telegram: 'YQ214' },
        { id: 90, name: 'Sam Caldwell' },
    ],
    Bizcotto: [
        { id: 1564, name: 'Colin Carver', factions: ['Independent', 'Guarma'], telegram: 'VT462' },
    ],
    blackhawkgamiing: [
        { id: 91, name: 'Chris Edwoods' },
    ],
    Blackknightkirk: [
        { id: 2210, name: 'Haggart Grieves' },
    ],
    blacklungfilly: [
        { id: 2451, name: 'Peregrine Woody' },
    ],
    blau: [
        { id: 92, name: 'Jesse Flint' },
    ],
    bldrs: [
        { id: 93, name: 'Casey Rigsby', factions: ['The Baastards', 'Guppy Gang'], deceased: true }, // Former Sam's Club
    ],
    BlitzyNation: [
        { id: 94, name: 'Charlie Walker', telegram: 'WF946' },
        { id: 95, name: 'Craig ?', nicknames: ['Craig the Wizard'] },
        { id: 96, name: 'Howi Bennet' },
        { id: 97, name: 'James Wayne Twin' },
        { id: 98, name: 'Juan Diego Moralez' },
        { id: 99, name: 'Tommy Bennett' },
        { id: 987, name: 'Felix Valentino' },
        { id: 1065, name: 'Monte McCannon' },
        { id: 1066, name: 'Cleetus ?' },
        { id: 1489, name: 'Lazarus Cravensworth' },
        { id: 1835, name: 'Mike Fandango' },
        { id: 2017, name: 'Arno ?' },
    ],
    blkcat: [
        { id: 100, name: 'Johnny Walker' },
    ],
    BloomOnline: [
        { id: 101, name: 'Norman Kobbs' },
    ],
    BluebonnetRP: [
        { id: 1475, name: '[Deputy] Lorenzo Roussan', factions: ['Law'], telegram: 'VX740', deceased: true },
        { id: 1551, name: 'Everett "Ev" Thompson', factions: ['The Baastards'] },
    ],
    BobIronthighs: [
        { id: 1907, name: 'Jawn Pain' },
    ],
    BookieBlack: [
        { id: 2064, name: 'John Truesdale' },
    ],
    BooksBlanketsandTea: [
        { id: 102, name: 'Edith Scriven' },
    ],
    BoosterGreg: [
        { id: 103, name: 'Roy Whitmore' },
        { id: 1532, name: 'Miles Hatch' },
        { id: 1533, name: 'Rusty ?' },
    ],
    BoredFloridian: [
        { id: 1897, name: '[Deputy] John Bell', factions: ['Law'] }, // Lee Holt
        { id: 2008, name: 'Roland Margrave' },
        { id: 2147, name: 'Dima Zhukov' },
    ],
    Boxeryedig: [
        { id: 104, name: 'Timothy Johnson' },
        { id: 105, name: 'Daniel McCormic' },
        { id: 106, name: 'Bud Pierce' },
    ],
    Brad__T: [
        { id: 2339, name: 'Sam Rider' },
    ],
    bradrandom: [
        { id: 2285, name: 'Levi Raine' },
        { id: 2330, name: '[Deputy] Lucien Lorde', factions: ['Law'] },
    ],
    BradWOTO: [
        { id: 107, name: 'Bentley Fog' },
        { id: 108, name: 'Rufus Lorde', factions: ['Dead End Gang'], deceased: true }, // Former Summer's Gang.
        { id: 109, name: 'Ronan "Tar" McCarthy', nicknames: ['Tar Sullivan'] },
    ],
    BrambleLeaf: [
        { id: 1755, name: 'Judith "Fiver" Thompson', factions: ['Fuller House'] },
        { id: 1773, name: '[Deputy] Rue Roussan', factions: ['Law'] },
        { id: 1909, name: 'Caroline Braithwaite' },
    ],
    Bringus: [
        { id: 1468, name: 'Linus Lievesley' },
    ],
    Brizzo24: [
        { id: 110, name: 'Craig Johnson' }, // Former Sam's Club
        { id: 111, name: 'Karl Feckles', deceased: true },
        { id: 1016, name: 'Izaac Douglass', telegram: 'BF174', factions: ['Freeman Family'] },
        { id: 1080, name: 'Teddy Payne' },
    ],
    broxh_: [
        { id: 1809, name: 'Toa Cassidy', assume: 'assumeOther' },
    ],
    BrutalBri: [
        { id: 112, name: 'Cooter O’Doole' },
        { id: 113, name: 'Dakota Rush' },
        { id: 114, name: 'Robin Fischer' },
    ],
    Bryce_Reid: [
        { id: 1457, name: 'Melchior "Milk Man" Tarsovich', factions: ['Dead End Gang'] },
    ],
    buddha: [
        { id: 118, name: 'Wu Buddha', factions: ['DiCenzo Famiglia'], telegram: 'EI571' }, // Inactive DiCenzo
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
    BunBelievable: [
        { id: 1845, name: 'Dallan McIrish' },
    ],
    BunglingNormal2: [
        { id: 123, name: 'Henry Gearhardt', factions: ['Sun Warriors'] },
    ],
    Burn: [
        { id: 124, name: 'Lloyd "The Ghost" Chambers', nicknames: ['Ghost'] },
    ],
    BurtLington: [
        { id: 125, name: '[Sheriff] Marty Malone', factions: ['Law'], telegram: 'PF150', deceased: true },
        { id: 126, name: 'Paddy Connelly', nicknames: ['The Sweeper'], factions: ['Dead End Gang'] },
        { id: 1797, name: 'Mort ?', factions: ['Sisika Guard'] },
        { id: 2187, name: 'William Royce' },
    ],
    buttrito: [
        { id: 127, name: 'Dakota Ellis', factions: ['Dead End Gang'], telegram: 'KS130' },
    ],
    BusinessCasualGamer: [
        { id: 1650, name: 'Ezekial Bennett', telegram: 'TU247' },
    ],
    bythybeard: [
        { id: 2191, name: 'Jack Brooks' },
    ],
    Caffine5: [
        { id: 128, name: 'Billy Falco', nicknames: ['Billy Blasters', 'Billy Blunders'], displayName: 3, telegram: 'UO243' }, // Former Danger Gang
        { id: 129, name: 'Vincenzo Struzzo' },
        { id: 1180, name: 'Massimo Aquila' },
        { id: 1254, name: 'Henry Corvo', factions: ['Lifer'] },
    ],
    CALEB402: [
        { id: 1901, name: 'Billard "Billy" Bones' },
    ],
    calibriggs: [
        { id: 130, name: 'Henry Baptiste', telegram: 'QZ333' },
        { id: 131, name: '[Deputy] Joseph Parrish', factions: ['Law'], telegram: 'UF111' },
    ],
    calliecakez: [
        { id: 132, name: 'Amelie Coiner', nicknames: ['Amelie Ashton'], telegram: 'WL938' },
    ],
    CallisTV: [
        { id: 133, name: 'August Wheeler' },
    ],
    CannaCasual: [
        { id: 134, name: 'Calvin Corbin' },
        { id: 1353, name: 'Randall "Rowdy" Winston', telegram: 'GH140' },
    ],
    CapitalOGttv: [
        { id: 135, name: 'Franklin Costella' },
        { id: 136, name: 'James "Jimi" Black' },
    ],
    CapnSmitty9: [
        { id: 1670, name: '[Doctor] Calvin Smith', factions: ['Medical'], telegram: 'VM831' },
    ],
    capsure: [
        { id: 1234, name: '[Deputy] Tim West', factions: ['Law'], telegram: 'MB186' },
        { id: 1312, name: 'Nikolai Drozdov' },
        { id: 1541, name: 'Dawson Kross', telegram: 'XL996' },
    ],
    captain_dimples: [
        { id: 2433, name: 'Marina Barbosa' },
        { id: 2434, name: 'Nancy Whitmore' },
    ],
    CaptainMeef: [
        { id: 137, name: 'Casey Jones' },
    ],
    CaptRubble: [
        { id: 138, name: 'Joseph Stone', factions: ['Independent', 'Guarma'], formerFactions: ['Law'], telegram: 'IU230' }, // Former Senior Deputy
        { id: 139, name: 'Percy Peanut' },
    ],
    CarbonitePlays: [
        { id: 140, name: '[Deputy] Evan Madeley', factions: ['Law'], telegram: 'OI904' },
        { id: 141, name: 'Karl North' },
        { id: 142, name: 'Lance Irwin' },
        { id: 143, name: 'Mervyn Castor' },
        { id: 144, name: 'Miguel Sanchez' },
    ],
    Carlos_Spicyw3iner: [
        { id: 145, name: 'Larry Brown' },
    ],
    carvabowl: [
        { id: 1784, name: 'Cal Reinhardt', telegram: 'PG069' },
    ],
    CaseFace5: [
        { id: 146, name: 'Willie "Gramps" Walker' },
    ],
    CastamereGold: [
        { id: 1239, name: 'William Hathaway', telegram: 'HR656' },
        { id: 1379, name: 'Mister Sicks', nicknames: ['Mister Six'], displayName: 3, telegram: 'RD100' },
        { id: 1703, name: 'Borris Belcher' },
        { id: 1745, name: 'Fester Mime' },
    ],
    CeMakes: [
        { id: 1525, name: 'Boris Tondril' },
    ],
    Ceviks: [
        { id: 1932, name: 'Wyatt Stream' },
    ],
    ChaoticCreative: [
        { id: 2283, name: '[Ranger] Pat Riley', factions: ['Rangers'] },
    ],
    charlieblossom: [
        { id: 147, name: 'Katarina Lovette' },
        { id: 148, name: 'Eleanor Wood' },
    ],
    CharmFruit: [
        { id: 1159, name: 'Aria Westfare' },
    ],
    Cheever7: [
        { id: 149, name: 'Aurora Rayne', factions: ['The Baastards'], formerFactions: ['Kettleman Gang'], telegram: 'KH378', deceased: true },
        { id: 1241, name: '[Sr. Deputy] Maya Brooks', factions: ['Law'], telegram: 'KJ562' },
    ],
    ChickPenguin: [
        { id: 150, name: 'Lily Linwood', nicknames: ['Lily Fish', 'Lilly', 'Lilly Fish'], formerFactions: ['Guppy Gang'] },
    ],
    Chief: [
        { id: 151, name: 'Caesar Coal' },
        { id: 152, name: 'Tuuyship Áama' },
        { id: 1142, name: 'Kinny "Kongo" ?', factions: ['Lifer'] },
    ],
    CHUDOCKEN: [
        { id: 153, name: 'Qeljayiden', nicknames: ['Qelajayiden', 'Jaden'] },
        { id: 154, name: 'Josiah Wayne' },
    ],
    ChrisTombstone: [
        { id: 155, name: 'Joffery Wilkins' },
    ],
    ClassicSteve: [
        { id: 156, name: 'Melvin Brown', telegram: 'KU972' },
        { id: 157, name: 'Jimmy Duncs' },
        { id: 1145, name: 'Blake Davenport' },
        { id: 1555, name: 'Sven Oakwood' },
    ],
    ClassyPax: [
        { id: 158, name: 'Eugene Calloway', deceased: true },
        { id: 159, name: 'Father Hickey' },
        { id: 1158, name: 'Thisbe Fae', nicknames: ['The Sweat Witch'] },
        { id: 1646, name: '[Deputy] Buck Dewberry', factions: ['Law'] },
        { id: 2016, name: 'Jerry Cornrow' },
        { id: 2143, name: 'Beau Jouex' },
    ],
    CloakingHawk: [
        { id: 160, name: '[Sr. Deputy] Danni Jackson', factions: ['Law'], displayName: 1, telegram: 'MH642' },
        { id: 161, name: 'Roo' },
        { id: 162, name: '[Medic] Tilly-May Edwards', factions: ['Medical'], telegram: 'IX902' },
        { id: 1308, name: 'Constance "Conny" Dubois' },
    ],
    CloeeBee: [
        { id: 163, name: 'Alice Bennett' },
        { id: 164, name: 'Rose Pond' },
    ],
    Coda19us: [
        { id: 165, name: 'Cecil Prichard' },
    ],
    cojo: [
        { id: 166, name: 'Oliver Toscano', nicknames: ['Mad Dog'], factions: ['DiCenzo Famiglia'], telegram: 'MS981' },
        { id: 991, name: 'Asher Bell', telegram: 'CY893' },
        { id: 1032, name: 'Shamus McConnell', factions: ['One Life'] },
    ],
    ConnorCronus: [
        { id: 167, name: '[Sr. Deputy] Rip Riley', factions: ['Law'], telegram: 'ZC951' },
        { id: 168, name: 'Isaac Smith' },
        { id: 169, name: 'Karlias Drex', telegram: 'EQ853' },
        { id: 170, name: 'Richard Sionis' },
        { id: 1757, name: 'Antonio El Botas', nicknames: ['Boots'] },
    ],
    Coolidge: [
        { id: 171, name: 'Franco "Frank" Salvatore Murdock', nicknames: ['Fwank'] },
        { id: 172, name: 'Cash Colton', factions: ['Coltons'] },
    ],
    CoolRanchOfficial: [
        { id: 1469, name: 'Jules Preston', telegram: 'LA938', deceased: true },
        { id: 1777, name: '[Sr. Deputy] Sadie Parker', nicknames: ['Sadie Cooper'], factions: ['Law'], telegram: 'ED325' },
        { id: 1937, name: 'Avery Jones' },
        { id: 2338, name: 'Debora "Debs" James' },
    ],
    CopernicusTheDesertWizard: [
        { id: 1478, name: 'Copernicus Desert Wizard', nicknames: ['Perni', 'Copernicus the Desert Wizard'] },
    ],
    corcidzx: [
        { id: 1858, name: 'Kyra Milly' },
    ],
    Cord: [
        { id: 592, name: 'Ben Bealz' },
        { id: 593, name: 'Chauncy "The Barman" Charles' },
        { id: 594, name: 'Cooper Garret', nicknames: ['Coop'], displayName: 3, telegram: 'FH427' },
        { id: 595, name: 'Jack Woulfe' },
        { id: 596, name: 'Pikup Dropov' },
        { id: 1176, name: 'Ira Claymore' },
    ],
    counter_snpc: [
        { id: 2009, name: 'Kyle Row' },
        { id: 2368, name: 'Sydney Rifter' },
    ],
    Coxybaws: [
        { id: 1923, name: '[Deputy] Fionn O’Malley', factions: ['Law'], assume: 'assumeOther' },
    ],
    CptCutlassSD: [
        { id: 1143, name: 'Beck ?' },
        { id: 1144, name: 'Alexander Alistair' },
    ],
    Crazy__Eagle: [
        { id: 2313, name: 'Red Lance', displayName: 0 },
        { id: 2445, name: 'Bullsnake Bowie', displayName: 0 },
    ],
    Criken: [
        { id: 173, name: 'Festus Asbestus', factions: ['Perma Trail'], deceased: true },
        { id: 982, name: 'Barry Beaver' },
        { id: 2142, name: 'Monty Penny' },
    ],
    crocc: [
        { id: 174, name: 'Santino "Sonny" DiCenzo', factions: ['DiCenzo Famiglia'], leader: true, telegram: 'KV974' },
    ],
    Crom: [
        { id: 175, name: 'Elias McDurn', telegram: 'JR921' },
        { id: 176, name: 'Aleister Reid' },
    ],
    cruddycheese: [
        { id: 177, name: 'Donald McMuffin', factions: ['Taipan'], telegram: 'KZ656' },
        { id: 1301, name: 'Abraham Solomon' },
    ],
    CuddlyJays: [
        { id: 1659, name: 'Sebastian Livingstone' },
        { id: 1769, name: 'Franco Mancini', telegram: 'YP169' },
    ],
    cush00: [
        { id: 620, name: 'Walter Bridges' },
    ],
    CyanideX: [
        { id: 2394, name: 'Jay Lewis' },
    ],
    CyberGoosey: [
        { id: 500, name: 'Elijah "Eli" Grayson', factions: ['Little Gang'], telegram: 'HP707', deceased: true }, // Former Boons Boys? Or maybe I just mistagged?
        { id: 1388, name: '[Deputy] Jonathan Grey', nicknames: ['Jonathan Greycastle', 'Greycastle'], displayName: 4, factions: ['Law'], telegram: 'DE408' },
    ],
    CyboargTV: [
        { id: 178, name: '[Deputy] Porter O’Neill', factions: ['Law'] },
    ],
    DabbsGaming: [
        { id: 1791, name: '[Deputy] Jonathan Forester', factions: ['Law'] },
    ],
    DadnOut: [
        { id: 179, name: 'Cletus Clifton' },
        { id: 180, name: 'Dusty Wilder' },
    ],
    Daftmedic: [
        { id: 181, name: '[Doctor] Tristan Shipman', factions: ['Medical'], telegram: 'VJ395' },
        { id: 182, name: 'Archibald Shaw' },
        { id: 2225, name: 'James ?' },
    ],
    Dam_O: [
        { id: 183, name: 'Grover Carlson', telegram: 'VV708' },
        { id: 1367, name: '? ?', nicknames: ['Green'], displayName: 3, factions: ['The Masked Men'] },
        { id: 2133, name: 'Ed Jones' },
    ],
    dandyboy5166: [
        { id: 2223, name: 'Jackie Murphy' },
    ],
    DangitLacie: [
        { id: 184, name: 'Doreen Pavus', formerFactions: ['Law'] }, // Former Deputy
        { id: 185, name: 'Judith Amerine' },
        { id: 186, name: 'Kid Kelley' },
        { id: 1449, name: 'Melody Bell', factions: ['Bell Gang'], deceased: true },
    ],
    DaniOregon: [
        { id: 187, name: 'Wesley Daniels' },
    ],
    DanMysteryHero: [
        { id: 188, name: 'Brett Jordan' },
        { id: 189, name: 'Wolverine Payton' },
        { id: 1981, name: 'Barrett Wesker' },
        { id: 1982, name: 'Percy Blackthorne' },
        { id: 2091, name: 'Louis Williamson' },
        { id: 2095, name: 'Tanner Corbin' },
    ],
    DannyF1orida: [
        { id: 190, name: 'Cliff Westwood' },
    ],
    DapperDame: [
        { id: 1666, name: 'Mae Miller', telegram: 'FJ304' },
    ],
    DarthBoba04: [
        { id: 2307, name: 'George Dune' },
    ],
    Darthbobo77: [
        { id: 192, name: 'Walter Rinsen' },
        { id: 193, name: 'Cooter Jonason', nicknames: ['Koodah'] },
    ],
    DarysFrost: [
        { id: 194, name: 'Hunter Solomons' },
        { id: 1196, name: 'Holden Butts' },
        { id: 1260, name: 'Eanes de Coimbra' },
    ],
    Dastardly_Dog: [
        { id: 195, name: 'Barry Smith' },
        { id: 196, name: 'Cassel bottom' },
    ],
    DatVoiceGuy: [
        { id: 197, name: 'Alejandro Ariez' },
        { id: 198, name: 'Luther Van Dam' },
        { id: 1559, name: 'Blake Dollahan' },
        { id: 1631, name: 'Chester Brown' },
        { id: 1763, name: 'Aleister Moon' },
    ],
    Daveybe: [
        { id: 199, name: 'Pip Delahan', factions: ['Kettleman Gang'], telegram: 'TR637' },
        { id: 200, name: 'Edge Lamburg' },
        { id: 1204, name: 'Peter "Squeaky Pete" Conrad', nicknames: ['Pete'], factions: ['Dead End Gang'], telegram: 'CA349' },
    ],
    DavidEarl: [
        { id: 2263, name: 'Anthony Relish-Lewis', deceased: true },
        { id: 2264, name: 'Alfred Bradford' },
        { id: 2265, name: 'Daddy Piper' },
    ],
    DDPeter: [
        { id: 1245, name: 'Pete "Mudbutt" Rotunda' },
    ],
    Deadly179: [
        { id: 2116, name: 'Perseus "Pippy" Delony', nicknames: ['Pippy D.'], telegram: 'EB313', assume: 'assumeOther' },
        { id: 2117, name: 'Damian Rayson' },
    ],
    DeadRoses21: [
        { id: 1370, name: 'Harmony Rivers', telegram: 'FE865' },
    ],
    DEANSUMMERWIND: [
        { id: 201, name: 'Doug Darrell Dan' },
        { id: 202, name: 'Ham Royce' },
    ],
    DearJhnnn: [
        { id: 1400, name: 'León Fontaine', telegram: 'RN296' },
        { id: 1419, name: 'Francis DeVille' },
        { id: 1634, name: 'Quincy Bill' },
        { id: 1730, name: 'Hudson King' },
        { id: 1781, name: 'Raul Felix' },
        { id: 1904, name: 'Elio Arancini' },
        { id: 1998, name: 'Cith Huntley' },
    ],
    deciBel42: [
        { id: 1141, name: 'Kit Bishop', telegram: 'OG840' },
        { id: 1340, name: 'Billy Burgs', telegram: 'TM375' },
    ],
    defanxious: [
        { id: 2015, name: 'William Soloch' },
        { id: 2043, name: 'Maxwell Thomas' },
        { id: 2066, name: 'Gus Waits' },
        { id: 2067, name: 'Jasper King' },
    ],
    DeFrostSC: [
        { id: 203, name: 'Eyota "Thunder" Tiama' },
        { id: 204, name: 'Hank Boon' },
    ],
    demolitiondan_: [
        { id: 1553, name: '[Deputy] Wallace Wilson', factions: ['Law'], telegram: 'CP350' },
        { id: 2022, name: 'Emily Calloway' },
        { id: 2094, name: 'Barry French' },
    ],
    Demorga_: [
        { id: 1043, name: 'Avery Hobbs', displayName: 2, factions: ['The Black Company'] },
        { id: 1120, name: '[Guard] Cassius Renata', factions: ['Sisika Guard'] },
        { id: 1127, name: 'Sylas "Stache" Kristiansen', formerFactions: ['Law'], telegram: 'NO025' }, // Former Sheriff
        { id: 1628, name: '[Deputy] Ludwig Weiß', nicknames: ['Ludwig Weiss'], factions: ['Law'] },
    ],
    DeneeSays: [
        { id: 205, name: 'Brooke "Babs" Burns', factions: ['DiCenzo Famiglia'], telegram: 'AT704' },
    ],
    Deputy_Games: [
        { id: 206, name: '[Deputy] Sam Rosco', factions: ['Law'], telegram: 'UX593' }, // Former The Cut
    ],
    DetectiveDoorag: [
        { id: 207, name: '[Sr. Deputy] Casey Kramer', factions: ['Law'], telegram: 'JY337' },
        { id: 208, name: 'Beau Wilder' },
        { id: 209, name: 'Colt Clifford' },
    ],
    deviliac: [
        { id: 210, name: 'Rafael "Rafa" Ramirez', nicknames: ['SnakeFace'] },
    ],
    DidaxEric: [
        { id: 2344, name: 'Mitchell Lewis' },
    ],
    DinoNotDeeno: [
        { id: 1970, name: 'Sam Colt' },
        { id: 2162, name: 'Blanche Martin' },
    ],
    Dimitri: [
        { id: 211, name: 'Clem Colton' },
    ],
    Dimoak: [
        { id: 212, name: 'Fiddleford "Phil" Mackit', deceased: true },
        { id: 213, name: 'Kaz Brekker', deceased: true },
        { id: 214, name: 'Tommy Townsand' },
        { id: 215, name: 'Matthias Helvar' },
        { id: 216, name: 'Ramsley Gracey' },
    ],
    dirty_10_jusclowning: [
        { id: 217, name: 'Richard Long', assume: 'assumeOther' },
        { id: 218, name: 'Wesley Long' },
        { id: 219, name: 'Vincent La Guardia' },
        { id: 1815, name: 'Rosalynn Hardin' },
        { id: 1846, name: 'Chance Colter' },
    ],
    Dirty_Fisherman: [
        { id: 220, name: 'Archibald Trout' },
    ],
    DisbeArex: [
        { id: 221, name: 'Timmy Took', telegram: 'CK816' },
        { id: 222, name: 'Dolly Dixon', deceased: true },
        { id: 224, name: 'Morgana "The Blood Witch" Fay', telegram: 'FK879' },
        { id: 1852, name: 'Darla Dimple', factions: ['One Life'] },
        { id: 2028, name: 'Jin Saito' },
        { id: 2060, name: 'Mama "Kat" Colton', factions: ['Coltons'] },
        { id: 2175, name: 'Jane Carnahan', factions: ['Perma Trail'], deceased: true },
    ],
    DJADIP: [
        { id: 225, name: 'Juan Pablo', telegram: 'DY911' },
        { id: 1086, name: 'Frikkie Van Tonder' },
        { id: 1800, name: 'Jack Williamson' },
    ],
    DjinnJee: [
        { id: 226, name: 'Jack Burton' },
    ],
    docrimbo: [
        { id: 227, name: 'Butch Nickle' },
        { id: 228, name: 'Fondue Framboise' },
        { id: 229, name: 'Princess Biscuits' },
        { id: 230, name: 'Jonah Harper', deceased: true },
        { id: 1019, name: '[Deputy] Edison Jones', nicknames: ['Clockwork'], factions: ['Law'], telegram: 'LD837' },
        { id: 1056, name: 'Caleb Milton' },
    ],
    DollarstoreBucc: [
        { id: 1861, name: 'Jack "Preacher" Sproule', factions: ['Kelly Gang'] },
        { id: 2068, name: 'Kennick Douglas' },
        { id: 2077, name: 'Edward Balthcat' },
        { id: 2238, name: 'Judah Boyer' },
        { id: 2249, name: 'Leonidas Adamos' },
        { id: 2300, name: 'Pavel Borys' },
        { id: 2366, name: 'Abe Lovett' },
    ],
    DomoBee2020: [
        { id: 1398, name: 'Ro McClane', telegram: 'HV226' },
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
    dontwatchzach: [
        { id: 1946, name: 'Mac Ledeaux' },
    ],
    Donut3venTryMe: [
        { id: 1306, name: 'Lincoln Holt' },
    ],
    Doodlebag: [
        { id: 237, name: 'Damian Castle' },
    ],
    DoomGuyGhost: [
        { id: 1384, name: 'Michelangelo "Mikey" Scarpatti', factions: ['DiCenzo Famiglia'], telegram: 'ZU162' },
        { id: 1446, name: 'Seamus Bell', factions: ['Bell Gang'] },
    ],
    DravenTAK: [
        { id: 1084, name: 'Draven Woodson', assume: 'assumeOther' },
        { id: 1188, name: 'Damien ?' }, // Undertaker
        { id: 1189, name: 'Winter Frost', factions: ['Lifer'] }, // Unsure of faction
    ],
    Drawn_Sean: [
        { id: 1474, name: 'Dean Bean', factions: ['The Strays'] },
        { id: 1962, name: 'Percy Pickles' },
    ],
    DreadfullyDespized: [
        { id: 238, name: 'Byong Ho' },
    ],
    drendebt: [
        { id: 239, name: 'Danny Kerrigan', deceased: true }, // Kerrigan Ranch
        { id: 240, name: 'Duncan Ladle' },
        { id: 241, name: '[Sr. Deputy] Duncan Weller', factions: ['Law', 'Bluestone'], telegram: 'EY733' }, // Leader of Bluestone
        { id: 242, name: 'Darwin Howe', factions: ['Dead End Gang'] },
        { id: 1227, name: 'Blue Harlow' },
        { id: 2257, name: 'Preston Whittaker' },
    ],
    DrGrouch: [
        { id: 1515, name: 'Varek Gunn' },
    ],
    DrulkTV: [
        { id: 243, name: 'Lawrence Noll' },
        { id: 244, name: 'Wayne Colt' },
        { id: 1242, name: '[Ranger] Ray Lee', factions: ['Rangers'], telegram: 'VX174' },
        { id: 1313, name: 'Damon Decker' },
    ],
    DrXeroLive: [
        { id: 245, name: 'Jack Thompson' },
        { id: 246, name: 'Maurice Dillard' },
        { id: 1849, name: 'Ezekiel Stafford' },
    ],
    DubEkostep: [
        { id: 247, name: 'Pancho "El Cucuy" Zapata' },
    ],
    DuhBuhHuh: [
        { id: 1660, name: 'Blake Harlow', assume: 'assumeOther' },
        { id: 1752, name: 'Naim Pyles' },
    ],
    duhDonniee: [
        { id: 248, name: 'Dirty Dougie', displayName: 0 }, // TODO: Is this their real name?
        { id: 1175, name: '[Father] Simeon Cartwright' },
        { id: 2130, name: '[Deputy] Theodore Rockman', factions: ['Law'] },
    ],
    DukeOfFlukes: [
        { id: 249, name: '[Cadet] Alexander Poe', factions: ['Law'], formerFactions: ['Medical'], telegram: 'YH781' }, // Former Doctor
        { id: 250, name: 'Duke Colt', nicknames: ['Handsome Colt'] },
        { id: 251, name: 'Charles Morgan', telegram: 'ES892' },
        { id: 1052, name: 'Jimmy Billiam' },
        { id: 1181, name: '[Guard] Darren Hobbs', factions: ['Sisika Guard'] },
    ],
    dumbwaystokai: [
        { id: 2018, name: 'Clayton ?' },
        { id: 2058, name: 'Arthur Bishop' },
    ],
    DungeonRP: [
        { id: 2146, name: 'Boris BlackBush' },
        { id: 2217, name: 'Gideon Graves', telegram: 'HJ683' },
    ],
    Dunrunnin: [
        { id: 252, name: 'Clay' },
    ],
    Duntless_: [
        { id: 1070, name: 'Dun Lessozzo' },
    ],
    Durtydoesit: [
        { id: 1479, name: 'Ricky Shay' },
        { id: 1772, name: 'Levi Watcher' },
    ],
    DustMonkey: [
        { id: 253, name: '[Deputy] Charles Slaughter', factions: ['Law'] },
        { id: 254, name: 'Solomon Walker', deceased: true }, // Leader of The Cut
        { id: 255, name: 'Lawrence "The Major" Stirling' },
        { id: 256, name: 'Isaac "Dr. Creed" Creed', factions: ['The Ward'], telegram: 'RU038' }, // Leader of The Ward. But maybe just associated now?
        { id: 257, name: 'Reginald "Reggie" Richardson', factions: ['The Firm'], telegram: 'KV391' },
        { id: 258, name: 'Cullen Vane', displayName: 2, factions: ['Independent', 'Guarma'] },
    ],
    DutchKroket: [
        { id: 1875, name: '? Bjornson', nicknames: ['North', 'White Axe'], displayName: 3, factions: ['Kelly Gang'] },
        { id: 1887, name: '[Sr. Deputy] Antoine Monet', factions: ['Law'] },
    ],
    Dwoalin: [
        { id: 259, name: 'Jeff "Smed" Smedley' },
    ],
    dystic: [
        { id: 1082, name: 'Bruce ?' },
    ],
    dynadivine: [
        { id: 260, name: 'Lucille Davis', nicknames: ['Lucille Walker'], formerFactions: ['Law'] }, // Former The Cut. Former Deputy
        { id: 262, name: 'Danielle ?', factions: ['The Ward'] },
        { id: 1006, name: '[Deputy] Lillian Taylor', factions: ['Law'], telegram: 'MH115' },
        { id: 1107, name: 'Stella Callahan' },
        { id: 1571, name: 'JJ ?', factions: ['Independent', 'Guarma'] },
    ],
    dynastytv_: [
        { id: 1649, name: 'Tom Clark' },
    ],
    Dyoti: [
        { id: 1854, name: 'Thomas Nash' },
        { id: 2170, name: 'Herman Chiwa', factions: ['Perma Trail'], deceased: true },
        { id: 2189, name: 'Henry Rosner' },
    ],
    DzarekK: [
        { id: 263, name: '[Deputy] Eleonor Parker', factions: ['Law'], telegram: 'VQ924' },
        { id: 1543, name: 'Martha Dugmore' },
        { id: 1690, name: 'Ingrid Goldman', telegram: 'CV320' },
        { id: 1770, name: 'Rosalinda Williams', telegram: 'DB411' },
        { id: 1771, name: 'Olivia Puppet' },
    ],
    Eatindatcereal: [
        { id: 264, name: '[Sr. Deputy] Jax Sanctum', factions: ['Law'], telegram: 'OO930' },
        { id: 265, name: 'Al Lombardo', factions: ['DiCenzo Famiglia'], telegram: 'PQ997' }, // Inactive DiCenzo
    ],
    econoben: [
        { id: 2291, name: '[Ranger] Emerson Thoreau', factions: ['Rangers'] },
        { id: 2377, name: 'Rusty McDowell' },
    ],
    EctoSpectrum: [
        { id: 1150, name: 'Ginette "Netty" Margreit' },
        { id: 2122, name: 'Alabaster Willhelm' },
        { id: 2412, name: 'Waxahachie Longhorn' },
    ],
    elegendz77: [
        { id: 1403, name: '[Sr. Deputy] Terry Mallagher', factions: ['Law'], telegram: 'QW096' },
        { id: 1495, name: 'Toby Mallagher', deceased: true }, // Is this truly a different character?
        { id: 1522, name: 'Darren "Dazza" Mercer', nicknames: ['Darren The Drongo'], factions: ['Quil Gang'] },
        { id: 2084, name: 'Damien Cross' },
    ],
    EliDoesStuffIG: [
        { id: 473, name: 'John Frisco', displayName: 2 },
    ],
    Ellethwen_: [
        { id: 266, name: 'Adaleigh Roach', nicknames: ['Adaleigh Winters'], telegram: 'YW740' },
        { id: 267, name: 'Anna Mayfield' },
        { id: 268, name: 'Magnolia Williams' },
        { id: 269, name: 'Nascha Onawa' },
        { id: 270, name: 'Della Sterling' },
        { id: 1135, name: 'Marlena King' },
        { id: 1365, name: 'Sebastian ?', nicknames: ['Pink'], displayName: 3, factions: ['The Masked Men'] },
        { id: 2037, name: 'Bellamy Nakai' },
    ],
    embernocte: [
        { id: 271, name: 'Saffron Riley', nicknames: ['Saffron Mitchell'], telegram: 'MS716', factions: ['Bluestone'], formerFactions: ['Law', 'News'] }, // Former Deputy. Former(?) News
        { id: 272, name: 'Crissy "Cricket" Blitz', telegram: 'KW617' },
        { id: 273, name: 'Holly Frost', factions: ['Taipan'], telegram: 'DU057' },
        { id: 274, name: 'Sadhbh Marlow', nicknames: ['Sadhbh O’Brien', 'Meabh'], factions: ['Hagen', 'The Humble Bunch'] }, // Is a current Hagen as far as I'm aware.
        { id: 1198, name: 'Harmony Bell', nicknames: ['Bellish'], factions: ['Bell Gang'], deceased: true },
        { id: 1423, name: 'Lea Loup' },
        { id: 2078, name: 'Ruby Thread' },
        { id: 2369, name: 'Bambi Bell' },
    ],
    EMBVRMusic: [
        { id: 285, name: 'Kora Vane', telegram: 'JH385' }, // Former Sam's Club
        { id: 1264, name: '[Sr. Ranger] Rayne Farley', factions: ['Rangers'], telegram: 'GZ075' },
    ],
    EmeraldElephant_: [
        { id: 1091, name: 'Jackson Connor', formerFactions: ['Rangers'] }, // Former Ranger
        { id: 1183, name: 'Saturn Goya' },
    ],
    emily_xb: [
        { id: 1390, name: 'Ada-Jane Keller', telegram: 'NK475' },
        { id: 1676, name: 'Dottie Warneck' },
        { id: 1722, name: 'Lucy Lane' },
    ],
    EmptyDome: [
        { id: 275, name: 'Barry Armstrong' },
    ],
    emy99712: [
        { id: 1803, name: 'Ellie West' },
    ],
    // endangeredfinley: [ // Requested removal
    //     { id: 276, name: 'Amelia Riddle', nicknames: ['Eiwaz', 'Kenaz'], factions: ['Daughters of Fenrir'], telegram: 'JY369' },
    //     { id: 277, name: '[Doctor] Bonnifer "Bonnie" Gray', factions: ['Medical'], telegram: 'SE096' },
    //     { id: 278, name: '[Chief] Tanagila Kinya Isakib Hanhepi Wi', nicknames: ['Hummingbird', 'Hummingbird Flies By Moon', 'Kit'], displayName: 6, factions: ['Wapiti', 'Sun Warriors'], leader: true, telegram: 'KX331' },
    //     { id: 279, name: 'Paul Güttman' },
    //     { id: 1199, name: 'Persephone "Bones" Bonesman' },
    //     { id: 1611, name: 'Jolene Davenport' },
    //     { id: 1873, name: 'Cody Curtis' },
    //     { id: 2099, name: 'Ken Oath' }, // Law hopeful
    //     { id: , name: 'Joan Jagger' },
    // ],
    ENiGMAorigin: [
        { id: 1258, name: 'Theodore Paul' },
    ],
    entspeak: [
        { id: 280, name: 'Faolain McDiarmid' },
        { id: 281, name: 'Bran Speaksy' },
    ],
    EquinoxRP: [
        { id: 282, name: 'Brendyn Cormac' },
        { id: 1113, name: 'Ashe Vanderbuilt' },
    ],
    EricaPlz: [
        { id: 283, name: 'Briget Thorson', telegram: 'QS852', deceased: true },
        { id: 284, name: 'Vera Helvig' },
        { id: 1013, name: 'Annabelle Martin', deceased: true },
        { id: 1240, name: '[Deputy] Olya Ivanavia', factions: ['Law'], formerFactions: ['Rangers'], telegram: 'UB094', deceased: true }, // Former Ranger
        { id: 1477, name: 'Revenant Wright', telegram: 'YB671' },
        { id: 1778, name: '[Doctor] Kenzington Downey', factions: ['Medical'] },
        { id: 1871, name: 'Peter Whistler' },
        { id: 1894, name: 'Brick Thompson' },
        { id: 2011, name: 'Bethany "Silver" Lassik', factions: ['Independent', 'Guarma'] },
    ],
    EthanSchriver: [
        { id: 286, name: 'Leanord Scout', displayName: 2, factions: ['Dead End Gang'] },
        { id: 1372, name: '? ?', nicknames: ['Purple'], displayName: 3, factions: ['The Masked Men'] },
    ],
    Euiik: [
        { id: 998, name: 'Leven "LJ" June' },
        { id: 999, name: 'Tilly Smith' },
        { id: 1000, name: 'Parker King' },
        { id: 1001, name: 'Finn Taytum', deceased: true },
    ],
    ewanruss: [
        { id: 287, name: 'Alfonso Bonucci', nicknames: ['Coach Al', 'Al'], displayName: 4, factions: ['DiCenzo Famiglia'], telegram: 'MO798' }, // Inactive DiCenzo
    ],
    Eyebyte: [
        { id: 290, name: 'Amarillo Marnen' },
        { id: 291, name: 'Edbert Trunk' },
        { id: 292, name: 'Norman Hatt' },
        { id: 293, name: 'Rutherford Peabody', factions: ['Conductors'] },
        { id: 1235, name: 'Philo McGee' },
    ],
    famousivan: [
        { id: 294, name: 'Raul Dominguez', telegram: 'BS178' },
        { id: 295, name: 'Manual Salamanca', factions: ['Half Wits'] },
        { id: 296, name: 'Chavez Rodríguez' },
    ],
    Farmhouse78: [
        { id: 297, name: 'Stewart Harington', telegram: 'BG883' },
        { id: 298, name: 'Steven Hayes' },
    ],
    fayebles: [
        { id: 299, name: '[Sr. Deputy] Clementine Fisher', nicknames: ['Clem'], displayName: 1, factions: ['Law', 'Bluestone'], formerFactions: ['Rangers'], telegram: 'IF890' }, // Former Ranger
        { id: 300, name: 'Nessa Evans' },
        { id: 1069, name: 'Ruby Warner' },
        { id: 1325, name: '[Medic] Rana Marsh', factions: ['Medical'], telegram: 'DX713' },
    ],
    feardeer: [
        { id: 301, name: 'Bryn "Sloan" Keith', factions: ['DiCenzo Famiglia'], formerFactions: ['Kettleman Gang'], telegram: 'JH764' }, // Former Kettleman. She would disagree, but she was definitely a Kettleman.
        { id: 1202, name: 'Danielle Beaumont' },
    ],
    fenrirsgaming: [
        { id: 2271, name: 'Julio Barbarcia' },
        { id: 2375, name: '[Renger] Shane Cormac', factions: ['Rangers'] },
    ],
    FhaeLin: [
        { id: 302, name: '[Sheriff] Tabitha Thorne', factions: ['Law'], telegram: 'BR226' },
        { id: 303, name: 'Amber Sage', factions: ['Guarma'], telegram: 'XN181' }, // Guarma Guarda
        { id: 1534, name: 'Josephine "Mist" Taylor' },
        { id: 1578, name: 'Winona Moss', telegram: 'QO695' },
    ],
    FirecrackThat: [
        { id: 1232, name: 'Roy Wheeler' },
        { id: 1945, name: 'Clyde Digby' },
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
        { id: 1432, name: 'Augustus Hammerpenis' },
        { id: 1547, name: 'Sergei Clause' },
        { id: 1548, name: 'Al Timerson' },
        { id: 1641, name: 'Joe Timerson' },
        { id: 1679, name: 'Tony Spumoni' },
        { id: 1966, name: 'Mike Wheeler' },
        { id: 2061, name: 'Bill Washinmire' },
        { id: 2178, name: 'Solomon Evans' },
    ],
    Fizzlethe6th: [
        { id: 2093, name: 'Digby Sinclair' },
        { id: 2298, name: 'Rooster Callahan' },
    ],
    FlamesYue: [
        { id: 1748, name: 'Michael Winslow' },
        { id: 2155, name: 'Skyler Warner' }, // Aspiring Law
    ],
    FlawlessWhale: [
        { id: 1217, name: 'Michael "Big Mike" James' },
    ],
    flaymayweather: [
        { id: 310, name: 'Cade Cross', factions: ['The Black Company'], telegram: 'UY677' },
    ],
    Flickerclad: [
        { id: 311, name: 'Evangeline Thorne', nicknames: ['Thurisaz', 'Sköll'], factions: ['Daughters of Fenrir'], telegram: 'IO207' }, // Former Summers Gang
        { id: 312, name: 'Frankie Czepanski' },
        { id: 313, name: '[Sheriff] Rabbit Windward', nicknames: ['Rory Callaghan'], displayName: 1, factions: ['Law'], telegram: 'NU817' },
        { id: 314, name: 'Saskia "Fang" Wolf' },
        { id: 315, name: 'Quinn Thatcher' },
        { id: 1168, name: '[Deputy] Amity Carrow', factions: ['Law'] },
        { id: 1467, name: 'Mercedes "Mercy" de la Rosa', factions: ['Del Lobos'], telegram: 'ON993' },
        { id: 1876, name: 'Deacon Nott' },
    ],
    FloMcNasty_TV: [
        { id: 1811, name: 'Dick Chiclets' },
    ],
    floralfoxes: [
        { id: 1350, name: '[Reporter] Juniper Ripley', nicknames: ['Juni', 'Juniper Lawrence'], telegram: 'IV378', deceased: true },
        { id: 1351, name: '[Game Warden] Catriona "Cat" Carver', factions: ['Rangers'], telegram: 'IQ879' },
        { id: 1545, name: 'Cass Darling', deceased: true },
        { id: 1546, name: 'Karina Durst' },
        { id: 1796, name: 'Tawny ?' },
        { id: 2443, name: '[Cadet] Chloe Slaughter', factions: ['Law'] },
    ],
    Fluffalumpalump: [
        { id: 1669, name: '[Ranger] Ellie Rose', telegram: 'BL512', factions: ['Rangers'], formerFactions: ['Medical'] },
        { id: 2444, name: 'Clara "Magpie" Corbin' },
    ],
    ForeheadSkin: [
        { id: 316, name: 'Edmund "Eddy" Reddington', factions: ['The Baastards'], deceased: true }, // Former Sam's Club
        { id: 317, name: 'Henry Huff' },
        { id: 318, name: 'Joseph Walters' },
        { id: 319, name: 'Morris Sterling' },
        { id: 320, name: 'Chester Fox' },
        { id: 321, name: 'Robert "Bobo" Thompson', nicknames: ['Bob'] }, // Dead?
        { id: 1153, name: 'Cecilio Marino' },
        { id: 1348, name: 'Lawrence "Larry" Gaines', telegram: 'XY283' },
    ],
    FortyOne: [
        { id: 322, name: 'Sean Mercer' },
    ],
    foxeheart: [
        { id: 2153, name: 'Belle Ryder' },
    ],
    FoxryGaming: [
        { id: 1265, name: 'William Teer', nicknames: ['Bluecoat', 'Blue Coat'], displayName: 3, telegram: 'VU248' },
        { id: 1346, name: 'Nathanael Greene', telegram: 'NL215', deceased: true },
        { id: 1750, name: 'Whitley Lawrence', telegram: 'EY278' },
        { id: 1818, name: 'Jalen Joyce' },
    ],
    Frankster48: [
        { id: 2429, name: 'Adrian Hawkins' },
    ],
    FrankTheTank5494: [
        { id: 323, name: 'Matthew Isaiah' },
    ],
    Freumont: [
        { id: 324, name: 'Edward Shaw' },
        { id: 325, name: 'Leonardo E. "Leo" Fantoni', factions: ['Moretti Crew'], telegram: 'JN223' }, // Former Fantoni Crew leader
        { id: 1804, name: 'Ciqala', factions: ['ToPa Ota'] },
    ],
    friendly_chick: [
        { id: 326, name: 'Angelica "Angel" Ward-Jones', nicknames: ['Angle'], factions: ['Conductors'], telegram: 'DE662' },
        { id: 327, name: 'Charlotte "Lottie" Davis', factions: ['The Firm'], telegram: 'SM304', deceased: true },
        { id: 328, name: 'Haven Rivers' },
        { id: 329, name: 'Lillian Frost' },
        { id: 1488, name: 'Addison Winters' },
        { id: 1810, name: 'Emma Whitfield' },
    ],
    FroisLost: [
        { id: 1872, name: 'Kieran Blythe' },
        { id: 1884, name: 'Lucia Wellmore', nicknames: ['Inya Nordskov'], factions: ['Conductors'], formerFactions: ['Medical'] }, // Former Medic
    ],
    FrontlineBanana: [
        { id: 2228, name: 'Benito Rosetti' },
    ],
    FrostFromFire: [
        { id: 330, name: 'Bianca Mackenna', telegram: 'ZH631' },
        { id: 1668, name: 'Hazel ?', telegram: 'SL459' },
    ],
    FunnyMatters: [
        { id: 331, name: 'Clint Brimshaw', assumeChar: true },
    ],
    FurianBlade: [
        { id: 2151, name: 'Clint Cassidy' },
    ],
    Gallethril: [
        { id: 332, name: 'Annabel Barnes', assume: 'assumeOther' },
        { id: 333, name: 'Claire Marsh' },
    ],
    GameBaked: [
        { id: 334, name: 'Mato Tahoma', telegram: 'FN602' },
        { id: 335, name: 'Adriaan' },
        { id: 336, name: 'Nyander Furrest' },
    ],
    GameishTV: [
        { id: 337, name: 'Doug Chipper' },
        { id: 338, name: 'Mike McCoy' },
    ],
    GaryGLITCHx: [
        { id: 351, name: 'Max Brady', formerFactions: ['Law'], telegram: 'GH469' }, // Former Sam's Club. Former Deputy
        { id: 352, name: 'Gianni Peccati', telegram: 'KS955' },
        { id: 353, name: 'Mordecai Butterbee' },
        { id: 354, name: 'Giano Greywolf' },
        { id: 355, name: 'Rudy Allaway', telegram: 'PX832' },
        { id: 1192, name: 'Roy Martin', factions: ['Lifer'] },
        { id: 1305, name: 'Jessie McCarthy' },
        { id: 1620, name: 'Harold Murray' },
    ],
    GauchoEscobar: [
        { id: 339, name: 'Gaucho Escobar' },
        { id: 340, name: 'Juana Soto' },
    ],
    GeDWiCK79: [
        { id: 341, name: 'Kennway Mallory', assume: 'assumeOther' },
    ],
    GeekyMeepy: [
        { id: 1402, name: 'Olive Myers', telegram: 'JG133', assume: 'assumeOther' },
    ],
    Gelesas: [
        { id: 1663, name: 'Dolly Dyer', nicknames: ['D.D.', 'DD', 'Dede', 'Dee Dee', 'DeeDee'], displayName: 3, factions: ['10 Tonne Gang'], telegram: 'US641' },
        { id: 2280, name: 'Gwendolyn "Gwen" Harper' },
        { id: 2281, name: 'Viola Olsen' },
        { id: 2362, name: '[Deputy] Cody Likly', factions: ['Law'] },
    ],
    GemZo23: [
        { id: 1042, name: 'Doc Ringo' },
        { id: 2024, name: 'Tommy Couso' },
    ],
    GeneralEmu: [
        { id: 342, name: 'Lance Divine', factions: ['The Baastards'] },
        { id: 343, name: '[Deputy] Jimmy Avola', nicknames: ['Two Times', 'Jimmy "Two Times"'], displayName: 4, factions: ['Law'], telegram: 'KK242' },
    ],
    Geodragon21: [
        { id: 1481, name: 'Grace Monroe' },
    ],
    GeorgiaBanks: [
        { id: 344, name: 'Georgia Banks' },
    ],
    getfarked: [
        { id: 1812, name: 'Douglas Barletti' },
    ],
    GhostlyHugs: [
        { id: 2202, name: 'Alexandra Wright' },
    ],
    GilliePG: [
        { id: 887, name: 'Balwinder Singh' },
    ],
    girth_lmao: [
        { id: 1996, name: 'Jon Cooper' },
        { id: 2158, name: 'Jack Murphy' },
    ],
    GiveMeUhMinute: [
        { id: 345, name: 'James Willow', telegram: 'RQ954', factions: ['Freeman Family'] },
        { id: 1848, name: 'Vicente Delgado' },
        { id: 1980, name: 'Curtis LeBeau' },
        { id: 2045, name: 'Han Zheng' },
        { id: 2150, name: 'Quagmire Russell' },
    ],
    Gizmetti: [
        { id: 1345, name: 'Markee McDuff', factions: ['DiCenzo Famiglia'], telegram: 'QX717' }, // Inactive DiCenzo
    ],
    GlitchedHelix: [
        { id: 346, name: 'Ada Standish' },
        { id: 347, name: '[Doctor] Mya Ennis', factions: ['Medical'] },
        { id: 348, name: 'Rubella Davies' },
    ],
    GLiTCHY: [
        { id: 349, name: '[Deputy] James Faraday', factions: ['Law'], assume: 'assumeOther' },
        { id: 350, name: 'Raymond "Rayray" Willis' },
    ],
    GnarIyDavidson: [
        { id: 356, name: 'Lluka Darkwood', telegram: 'NP135' },
    ],
    GobbleHawk: [
        { id: 1259, name: 'Martin Brue' },
        { id: 2047, name: 'Cecil Mann' },
        { id: 2069, name: 'Newt Briar' },
    ],
    Goochy: [
        { id: 862, name: 'Becker Lang', assume: 'assumeOther' },
    ],
    goose_thegreat: [
        { id: 357, name: 'Thaddeus Owens' },
    ],
    GooseyOfficial: [
        { id: 358, name: 'Jaimie Quinn' },
        { id: 359, name: 'MaN Sauers' },
        { id: 360, name: 'Joseph "Speedy" McGillagully' },
        { id: 1015, name: 'Harold Roach' },
    ],
    GothBro: [
        { id: 2274, name: 'Sven Svensson' },
    ],
    gothybee: [
        { id: 882, name: 'Alawa "Ali" Meota' },
    ],
    GrammTheGibbon: [
        { id: 363, name: 'Jimothy Little', nicknames: ['Little Jimothy', 'LJ', 'Kid'], displayName: 3, factions: ['Little Gang'], leader: true, formerFactions: ['Dead End Gang'], telegram: 'SI011' },
        { id: 361, name: 'Herbert Parker', nicknames: ['Herb'], telegram: 'QL725' }, // Kettleman hangaround
        { id: 362, name: 'Homer Carnes', deceased: true }, // Former Deputy?
        { id: 364, name: 'Clayton Orwell', nicknames: ['Clay Tone', 'Clay Tony Tone'], factions: ['Kettleman Gang'], deceased: true }, // Considered to be the one and only leader of the Kettleman Gang
        { id: 1323, name: '[Deputy] Pop Sullivan', factions: ['Law'], telegram: 'EX817' },
        { id: 1684, name: 'Sebasian "Sebas" Rudeo', nicknames: ['Sebastian Rudea', 'Vaquero'], telegram: 'MU856' }, // “Rudea” is the character name, but he seems to use “Rudeo”
        { id: 2089, name: 'G.W. Rapidly', nicknames: ['GW', 'Carnival'] },
    ],
    Grangelz: [
        { id: 2325, name: 'Martin Jaeger' },
        { id: 2327, name: 'Jack Fuchs', deceased: true },
    ],
    GraveGamerTV: [
        { id: 365, name: 'Paulson Greer' },
        { id: 366, name: 'Peter Gray', nicknames: ['Pete'], telegram: 'CI926' }, // Former Summers Gang
        { id: 367, name: 'Balter Duncans' },
        { id: 368, name: 'Paz Ferrer' },
    ],
    GreenEnigma: [
        { id: 369, name: 'Jericho Blackfoot' },
    ],
    GreninjaKiller: [
        { id: 1134, name: 'Gumbo Boppa' },
    ],
    Grennig: [
        { id: 370, name: 'Wesley "Wes" Shields', factions: ['Kettleman Gang'], formerFactions: ['Law'], telegram: 'OC251' }, // Former Law
    ],
    GreymoorGaming: [
        { id: 1337, name: 'Jon Grace' },
        { id: 1405, name: 'Bobby Ratheon', telegram: 'RJ094' },
        { id: 1593, name: '? "Badger" ?' },
        { id: 1761, name: 'Castor Fray', nicknames: ['Cass'], factions: ['Kelly Gang'] },
        { id: 1948, name: '[Deputy] August Gray', factions: ['Law'] },
    ],
    GrumpyChunkyMonkey: [
        { id: 1767, name: 'Arthur Lockwood' },
    ],
    gtplays: [
        { id: 374, name: 'Gene Tiffin' },
        { id: 375, name: 'Granville Turner' },
    ],
    gunknugget: [
        { id: 2276, name: 'Kiet ZyuaMato Chatri' },
    ],
    GunterOfficial: [
        { id: 376, name: 'Austin Scott' },
        { id: 377, name: 'James Connor' },
        { id: 1529, name: 'Finn Roberts' },
        { id: 1629, name: 'Cody Drisko' },
        { id: 1949, name: 'Winston Caldwell' },
        { id: 2090, name: 'Bo Briar' },
    ],
    HaCha_art: [
        { id: 378, name: 'Ava "La Niña" Jimenes', nicknames: ['La Nina'], deceased: true },
        { id: 2416, name: 'Dola Albaladejo' },
        { id: 2430, name: 'Phyllis White' },
    ],
    hanrotheroleplayer: [
        { id: 1321, name: 'Harry Dobbing', factions: ['Boons Boys'] },
    ],
    HanyClaps: [
        { id: 379, name: 'Levi Sawyer' },
        { id: 380, name: 'Stumpy McBride' },
        { id: 381, name: 'Virgil Sterling' },
    ],
    HappyYouniverse: [
        { id: 382, name: 'Danny Ford' },
    ],
    hapue: [
        { id: 1520, name: '[Undersheriff] Frederick Manius', factions: ['Law'] }, // Undersheriff, I think?
    ],
    Haxi_: [
        { id: 383, name: 'Matt Dursk', factions: ['Little Gang'], telegram: 'IF340' },
        { id: 1278, name: 'Rhys O’Felan', telegram: 'HD646' },
        { id: 1342, name: 'Jack De’Ville Kandy' },
        { id: 1799, name: 'Bradley Arthur', factions: ['Bluestone'], telegram: 'VM741' },
    ],
    Heikima: [
        { id: 989, name: 'Kaifeng Mi', factions: ['Independent', 'Guarma'], deceased: true },
        { id: 1054, name: 'Pocky Ma' },
        { id: 1173, name: 'Koxinga Zheng', nicknames: ['Mr. Ko', reg(/\bmr\.?\s+ko\b/)], displayName: 3, formerFactions: ['Taipan'], telegram: 'XN961' },
        { id: 1223, name: 'Pretty Boy Stagley', displayName: 0 },
        { id: 1324, name: 'Big Bear', nicknames: ['BigBear'], displayName: 0 },
        { id: 1972, name: 'Tiedan "Iron Egg" Sun' },
    ],
    HerbtheNerd: [
        { id: 384, name: 'Charles Kane' },
    ],
    hexsteph: [
        { id: 2277, name: 'Winnie Baylor' },
        { id: 2278, name: 'Ivy Brightwell' },
    ],
    Hibblejaybob: [
        { id: 386, name: 'Astrið Aleksdóttir', telegram: 'QT433' },
        { id: 1510, name: 'Thomas Henderson' },
    ],
    HibikiFox: [
        { id: 1186, name: 'Richard Ghearr' },
    ],
    hidaruma: [
        { id: 387, name: 'Rico Kanto' },
    ],
    highkingfrazzal: [
        { id: 388, name: 'James Delany', telegram: 'OR036' },
        { id: 1087, name: 'Jack Graves' },
        { id: 1753, name: 'Edward ?' },
    ],
    Highpriest999: [
        { id: 389, name: 'Athos Lepida' },
        { id: 1550, name: 'Igmuṫaƞka', nicknames: ['Igmutaka', 'Winter Oak'], factions: ['Wapiti'] },
    ],
    hiturshotskheed: [
        // Not WildRP. Also, toxic.
        { id: 2221, name: '- -', assume: 'neverNp' },
    ],
    HulzyRP: [
        { id: 1269, name: 'Ciccio "Cheech" ?' },
    ],
    Huntag: [
        { id: 1827, name: 'Felix Mackwell' },
    ],
    Hurnani: [
        { id: 390, name: 'James Brown' },
    ],
    HuskRP: [
        { id: 1994, name: 'Barry Beavers' },
        { id: 2450, name: 'Tommy Smiles' },
    ],
    HolliverFist: [
        { id: 1603, name: 'Erin McLyre', telegram: 'IA571' },
    ],
    holo12_: [
        { id: 1938, name: '[Deputy] Mari Vallen', factions: ['Law'] },
    ],
    Holoserica: [
        { id: 2319, name: '[Sr. Deputy] Marigold Vallen', factions: ['Law'] },
        { id: 2328, name: 'Calliope Crane' },
    ],
    Hoop: [
        { id: 391, name: 'Barry Bjornson' }, // Former Sam's Club
        { id: 392, name: 'Clyde Davis', nicknames: ['Dusty Danger'], deceased: true }, // Leader of the Danger Gang
        { id: 393, name: 'Jonathan Redding', nicknames: ['Redshirt'], displayName: 3, factions: ['Half Wits'], telegram: 'CH801' }, // Former Half Wits. No longer Redshirt? Guarma?
        { id: 394, name: 'Miles Gyles', formerFactions: ['Law'] }, // Former Deputy
        { id: 1063, name: '[Deputy] Thomas Hooper', nicknames: ['Tom'], factions: ['Law'] },
        { id: 1102, name: '[Sr. Guard] Mickey Doyle', factions: ['Sisika Guard'] },
        { id: 1424, name: 'Richard Gold', nicknames: ['Richie'], factions: ['Fuller House'], telegram: 'AH036' },
        { id: 1807, name: 'William Chillson' },
        { id: 2072, name: 'Steven Gaines' },
        { id: 2111, name: 'Matthew Klein' },
        { id: 2337, name: 'Ezekiel McCoy' },
    ],
    hopdowg: [
        { id: 1681, name: 'Abramo "Abe" Gignte' },
    ],
    horsespirit327: [
        { id: 2345, name: '[Deputy] Jane O’Flynn', factions: ['Law'] },
        { id: 2431, name: 'Ophelia "Dove" Renoux' },
    ],
    Hoss: [
        { id: 395, name: 'Buck Cherry' },
        { id: 1586, name: 'Buster Rivers' },
    ],
    houseofthebear: [
        { id: 2098, name: 'Colin Little', telegram: 'EX011' },
        { id: 2127, name: 'Maurice Monkfish' },
        { id: 2304, name: 'Albert Hastings' },
    ],
    HouseOfZard: [
        { id: 1197, name: 'Dale Cooper' },
        { id: 1215, name: 'Michael Melon', nicknames: ['Mr. Melon'], displayName: 3 },
        { id: 1222, name: 'Wes Givens' },
    ],
    IAmSharkriot: [
        { id: 1721, name: 'Toma Tato' },
    ],
    IanMMori: [
        { id: 396, name: '[Deputy] Enrique Vespucci', factions: ['Law'], deceased: true },
        { id: 397, name: 'Ewan Byrne', telegram: 'AR465' },
        { id: 398, name: '[Editor-in-Chief] Jonathan Coiner', factions: ['News'], telegram: 'HC193' },
        { id: 400, name: '[Trainee] Luther Lake', factions: ['Medical'] },
        { id: 1702, name: 'Elwood "Donnie" Holbrook', telegram: 'SD260' },
    ],
    ianriveras: [
        { id: 401, name: 'Hugo Teach' },
    ],
    IBabaganoosh: [
        { id: 402, name: 'Chuck Morris' },
    ],
    IboonI: [
        { id: 403, name: 'Elias Boon', factions: ['Boons Boys'], deceased: true }, // Emerald Ranch
        { id: 1595, name: 'Dewy ?' },
        { id: 1606, name: 'Bear John', factions: ['Kelly Gang'], formerFactions: ['Boons Boys'] },
    ],
    Iceshredder_: [
        { id: 1630, name: 'Rockford McGillicuddy', nicknames: ['Rock'], telegram: 'PD449' },
    ],
    iCoolioM: [
        { id: 404, name: 'Arie ?' },
    ],
    IEDeadly: [
        { id: 1220, name: 'Jax Houston' },
    ],
    ikitty: [
        { id: 1243, name: 'Minky Solace' },
    ],
    illwac: [
        { id: 405, name: 'Ira Smith' },
        { id: 1023, name: 'Phil Verse' },
    ],
    ILYCappiCat: [
        { id: 1788, name: 'Ethelyne "Grace" Gromko' },
        { id: 1789, name: 'Polina Borokov' },
    ],
    Im_HexeD: [
        { id: 406, name: 'Ronnie Tate' },
        { id: 407, name: 'Theodore Ellis', displayName: 2, factions: ['Boons Boys'], deceased: true },
        { id: 1058, name: '[Deputy] Judah Payne', factions: ['Law'], telegram: 'BO309' },
    ],
    ImagesOfBrokenLight: [
        { id: 1114, name: '[Medic] Cailin "Petal" O’Connor', nicknames: ['Petal Stonewall'], factions: ['Medical'], telegram: 'XB519' },
        { id: 1436, name: 'Gabby Cavalli' },
        { id: 1661, name: 'Audrey Harrington' },
    ],
    IMeMine30: [
        { id: 408, name: 'Angelo Clemente', telegram: 'SN784' }, // Former Fantoni Crew
        { id: 563, name: 'Walt McGrath', telegram: 'PS469' },
        { id: 1280, name: 'Jesse Price' },
    ],
    ImFromTheFuture: [
        { id: 409, name: 'Roscoe Montana', factions: ['The Baastards'] }, // Former Sam's Club
        { id: 1138, name: 'Jackson Diggles' },
    ],
    imradmd: [
        { id: 2310, name: '[Cadet] Rhett Cassidy', factions: ['Law'] },
        { id: 2311, name: 'Ellis Fray' }, // Frey gang? Fray Gang
        { id: 2312, name: 'Ciaran "Ghost" Kelly' },
    ],
    im_unruly: [
        { id: 1425, name: 'Marquise "MF" Frazier', factions: ['Frazier Gang'], leader: true, telegram: 'TN764', deceased: true },
        { id: 1685, name: 'Rudy "Rudeboy Rudy" Smalls', telegram: 'DF337' },
        { id: 2074, name: '[Deputy] Abraham Carter', factions: ['Law'] },
    ],
    inkyblackdreams: [
        { id: 410, name: 'Vera Addley', nicknames: ['Vera Dragavei'], factions: ['Little Gang'] },
        { id: 1376, name: 'Evelyn Harlowe' },
        { id: 1528, name: 'Granny Smith', displayName: 0 },
    ],
    InsomniacFlashback: [
        { id: 2120, name: 'Spink Russo' },
        { id: 2237, name: 'Ollie Star' },
    ],
    IonicEagle: [
        { id: 1079, name: 'Atticus Godson', telegram: 'WH168' },
        { id: 1193, name: 'Eliza Vanderbooben' },
        { id: 1195, name: 'Jensen Beaumont' },
    ],
    iotaindigo: [
        { id: 1349, name: 'Andrew Erickson', telegram: 'IZ499' },
    ],
    iPopoff: [
        { id: 2239, name: 'Blaze Rider' }, // Is this name correct?
    ],
    IronSmithy: [
        { id: 1437, name: '[Recruit] Jesse Hunt', factions: ['Rangers'], telegram: 'WD354' },
    ],
    iruASH: [
        { id: 411, name: 'Kayce Smith', factions: ['The Ward'], deceased: true }, // The Ward associate, but not member?
        { id: 1490, name: 'George Bruton', telegram: 'KT167' },
    ],
    ItalianNinjaa: [
        { id: 2140, name: 'Gabri Molino', nicknames: ['Gigi'] },
    ],
    itmeAGGER: [
        { id: 2219, name: 'Lloyd Barnett' },
    ],
    Its_Brogan2k: [
        { id: 412, name: 'Bogdan Hughes' },
    ],
    ItsAsaii: [
        { id: 413, name: '[Deputy] Buck Montana', factions: ['Law'] },
        { id: 414, name: 'Calvin Oakes' },
        { id: 415, name: 'Eli Ryckman' },
        { id: 416, name: 'Shaine Calhoun' },
        { id: 417, name: 'Wayne Kavanaugh', telegram: 'LQ460' }, // Previously had "PS241" as telegram by mistake?
        { id: 418, name: 'Dandy Smells' },
    ],
    itsBetaShark: [
        { id: 2197, name: 'Willie Boyle', nicknames: ['Rudeboy Willie'] },
    ],
    ItsGrumpyGramps: [
        { id: 1368, name: '[Deputy] Profit Quil', factions: ['Law', 'Bluestone'], telegram: 'OI576' },
    ],
    itsjotsy: [
        { id: 1352, name: '[Sr. Deputy] Elliot Pruitt', factions: ['Law'], telegram: 'PK525' },
        { id: 1736, name: 'Austin Grant', deceased: true },
    ],
    itsjustasummerjob: [
        { id: 1219, name: 'Elisabeth Darling' },
    ],
    ItsMisterPip: [
        { id: 1744, name: 'Terran Ledger' },
    ],
    ItsMoppet: [
        { id: 1653, name: 'James O’Blythe' },
        { id: 1935, name: '[Sr. Ranger] William Pugsley', nicknames: ['Willie'], factions: ['Rangers'] },
    ],
    itsSANDR: [
        { id: 419, name: 'Deacon Walker' },
    ],
    iTszGalaxy: [
        { id: 1104, name: 'James Bum' },
        { id: 2214, name: 'Tim ?' },
    ],
    ittybittybritt: [
        { id: 2282, name: '[Deputy] Clementine "C.J." Dollars', factions: ['Law'] },
    ],
    IvorySnowPlays: [
        { id: 2421, name: 'Hattie Mae "Hattie Mae" Jenkins' },
        { id: 2422, name: 'Bernice "Bernie" Hamilton' },
        { id: 2423, name: 'Nettie Avery' },
    ],
    Iwhuttt: [
        { id: 420, name: 'Archibald Welch' },
        { id: 421, name: 'Houston Gray', deceased: true },
        { id: 422, name: 'Patch "Patches" Twine' },
        { id: 1061, name: 'Phineas "Fin" Faith', factions: ['The Firm'], telegram: 'BJ540' },
        { id: 1089, name: 'Rupert Romano', telegram: 'CB130' },
        { id: 1124, name: 'Dynamo Barbarosa', nicknames: ['The Doctor', 'Doc', 'Dynamo Dolton'], telegram: 'GH698' }, // Character last name Dolton but goes by Barbarosa
        { id: 1429, name: 'Edward Masters' },
        { id: 1430, name: 'Cuthbert Berry', telegram: 'BQ121' },
        { id: 1492, name: 'Dale Dugmore', deceased: true },
        { id: 1990, name: 'Westley Hogarth' },
        { id: 2087, name: 'Sebastian Henberry' },
    ],
    izza_bug: [
        { id: 1184, name: '[Sheriff] Maisie Briar', factions: ['Law'], telegram: 'ZE633', deceased: true },
        { id: 1213, name: '[Nurse] Arlie Everett', factions: ['Medical'], telegram: 'MV473' },
        { id: 1375, name: '[Deputy] Elena Henley', factions: ['Law'], telegram: 'QJ017' },
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
        { id: 427, name: 'Tilly Demeter', assume: 'assumeOther', deceased: true },
        { id: 428, name: 'Jade Ming' },
        { id: 429, name: 'Jezrael King' },
        { id: 430, name: 'Maria Gonzales' }, // Former Bloody Hood
        { id: 431, name: 'Widow Fan' },
        { id: 976, name: 'Sabina Demeter' },
        { id: 1484, name: 'Mamie Holtzclaw' },
        { id: 1485, name: 'Astrid Hansson' },
        { id: 1486, name: 'Jaiyu "Lucky" Gustaffson' },
        { id: 2207, name: 'Beth Murdock' },
    ],
    JackofHeartsodb: [
        { id: 1915, name: 'Alfred Walsh', factions: ['Conductors'], formerFactions: ['Rangers', 'Bluestone'] }, // Former Sr. Ranger
        { id: 2266, name: 'Jude "Omen" Wright', factions: ['Lost Souls'] }, // Church of Lost Souls
        { id: 2290, name: 'Shepherd "Vulture" Collins', factions: ['Woods Gang'] },
    ],
    JackTFD: [
        { id: 1447, name: 'Max Bell', factions: ['Bell Gang'] },
        { id: 1798, name: 'Charlie Branch', deceased: true },
        { id: 1957, name: 'Cody ?', factions: ['Pruitt Gang'] },
    ],
    jaelymawi: [
        { id: 2112, name: 'Barney Butcher' },
        { id: 2113, name: 'Mckie Mcconnelly' },
        { id: 2114, name: 'Samuel Lawson' },
        { id: 2395, name: 'Billy Bumbling' },
    ],
    JakeVdatsme: [
        { id: 2144, name: 'Rufus Meecham' },
        { id: 2171, name: 'Tony James' },
        { id: 2399, name: 'River Rhodes' },
        { id: 2436, name: 'Johnny Silverstone' },
    ],
    jakeyp0o: [
        { id: 432, name: 'Danner Wynn' },
        { id: 433, name: 'Jim Chatfield' },
    ],
    JamesWob: [
        { id: 434, name: 'Benjamin Jameson' },
    ],
    Jamiie99: [
        { id: 1251, name: 'Muskrat Pete', displayName: 0 },
        { id: 1705, name: 'Lou Cicero', telegram: 'LM092' }, // Victory Street?
    ],
    JaneDizzle: [
        { id: 435, name: 'Jane Pebbleswood' },
    ],
    JarlOfGoats: [
        { id: 436, name: 'Gabriel Lenihan', telegram: 'VR309' }, // [Father] Preacher
        { id: 1090, name: 'Ellis Cameron' },
    ],
    JayAitch: [
        { id: 1740, name: 'Roger Soderberg', telegram: 'NJ514' },
    ],
    JayBritton: [
        { id: 437, name: 'Heath Marker-Brown' },
        { id: 438, name: 'Lucius Alabaster' },
        { id: 439, name: '[Deputy] Obidiah Colt', factions: ['Law'] },
        { id: 440, name: 'Scooter Brown' },
    ],
    JayDRated: [
        { id: 1331, name: 'Jay Walker', assume: 'assumeOther' },
    ],
    jdot: [
        { id: 441, name: 'James McAfee' },
    ],
    Jennifer: [
        { id: 1531, name: 'Lucille Montgummery' },
    ],
    Jenny_Bean: [
        { id: 2273, name: 'Anneliese Becker', formerFactions: ['Medical'] }, // Former Medic
    ],
    Jennybeartv: [
        { id: 442, name: 'Gemma Middleton' },
    ],
    JennyHell: [
        { id: 1224, name: 'Rebecca Lang', factions: ['The Baastards'], telegram: 'GL629', deceased: true },
        { id: 1225, name: '[Deputy] Molly Mills', factions: ['Law'], deceased: true, telegram: 'AU029' },
        { id: 1303, name: '[Deputy] Mia Bailey', factions: ['Law'], telegram: 'CQ648' },
        { id: 1304, name: 'Missy Mee', factions: ['Dead End Gang'], deceased: true, telegram: 'EP452' },
        { id: 1701, name: 'Tess Tempest', telegram: 'LI044' },
    ],
    JernyStreams: [
        { id: 2006, name: 'Thomas Woods', factions: ['Woods Gang'] },
        { id: 2356, name: '[Deputy] Richard Valjon', factions: ['Law'] },
    ],
    JesterTheRyda: [
        { id: 443, name: 'Jordin Bradley' },
        { id: 444, name: 'Joseph "Hobo Joe" Silvers' },
        { id: 445, name: 'Margrett Anderson' },
    ],
    JestfulHam: [
        { id: 1273, name: 'Ezra "Bayou" Holder', telegram: 'QT658' },
        { id: 1557, name: 'Eric Hung' },
        { id: 1892, name: 'Emmet Bondurant' },
        { id: 1893, name: 'Christopher Norman' },
    ],
    jev2017: [
        { id: 1221, name: 'Daniel Williams' },
    ],
    jminamistar: [
        { id: 1229, name: 'Felicity "Flick" Turner', telegram: 'RZ870' },
        { id: 1274, name: 'Callie ?' },
    ],
    Jigglin4Justice: [
        { id: 1830, name: 'Arnold Dean Taylor' },
        { id: 1851, name: 'Randall Starkey' },
    ],
    JillardSZN: [
        { id: 1139, name: 'Jilly Rizzo', telegram: 'QF261' }, // Former Fantoni Crew
    ],
    jobyonekanobi: [
        { id: 446, name: 'Clint Gunther' },
        { id: 1857, name: 'Dexter ?', nicknames: ['Dex'] },
        { id: 1961, name: 'Elijah Mays' },
        { id: 2088, name: 'Bartholomew Henberry' },
        { id: 2419, name: 'Everett "Evie" Cooper' },
    ],
    Jogiiee: [
        { id: 447, name: 'Eloise Carter' },
        { id: 448, name: 'Daisy Cromwell' },
        { id: 449, name: 'Naomi Fletcher' },
    ],
    JoeFudge: [
        { id: 450, name: 'Ronald Mayfair' },
        { id: 451, name: 'Jackie Laguna' },
    ],
    JoeGarbage_: [
        { id: 2209, name: 'Deckie Rolnik' },
        { id: 2246, name: 'Dallas Longhorn' },
        { id: 2447, name: 'Desmond Boron' },
    ],
    joemorf: [
        { id: 1814, name: 'Gordon Northrup', nicknames: ['Gordo'] },
    ],
    johnnyblamz: [
        { id: 452, name: 'Gavin Summers', telegram: 'WQ958', deceased: true }, // Former Summers Gang. Leader of Summers Gang
        { id: 453, name: 'Jody Quinn', telegram: 'DW522' },
        { id: 454, name: 'Logan Miller' },
        { id: 455, name: 'Avery Woods' },
        { id: 456, name: 'Peggy Brown', deceased: true },
        { id: 1535, name: 'Terry Flannigan', deceased: true },
        { id: 1639, name: 'Huxley Palmer', telegram: 'DH771' },
        { id: 1838, name: 'Seth South', deceased: true },
        { id: 1896, name: 'Lee Gardner' },
        { id: 1952, name: 'Luke Barrett', factions: ['Pruitt Gang'], deceased: true },
        { id: 2200, name: '[Undersheriff] Hanz Wagner', factions: ['Law'] },
        { id: 2302, name: 'Jude ?' },
    ],
    Jonthebroski: [
        { id: 457, name: 'Jonathan Divine', nicknames: ['Johnny', 'JBaas', 'J’Baas', 'J Baas'], displayName: 5, factions: ['The Baastards'], leader: true, telegram: 'EJ572', deceased: true }, // Former Sam's Club
        { id: 458, name: '[Sr. Deputy] Jaime Ruth', factions: ['Law'], telegram: 'SX271' },
        { id: 1010, name: 'Erik "Ivan" Drugov', nicknames: ['Vladimir', 'Nose'] },
        { id: 1279, name: 'Ceaser Falls' },
        { id: 1355, name: '[Guard] Gary Gallow', factions: ['Sisika Guard'] },
        { id: 1356, name: 'Tomasso Changretta' },
        { id: 1418, name: 'Rocky Jackson', nicknames: ['Jeremiah', 'Jeremiah Silverspoon'], displayName: 3, telegram: 'DS821' },
        { id: 1711, name: 'Rudolph "Ralphie" Gold', nicknames: ['Ralph'], telegram: 'ZT342', deceased: true },
        { id: 2425, name: 'Lincoln Jackson' },
    ],
    JordeeKai: [
        { id: 2029, name: 'Stevie Scarlett', nicknames: ['Snow White'] },
        { id: 2198, name: 'Violet Bennett' },
        { id: 2236, name: 'Roxie Rhodes' },
    ],
    JoSaiYuh: [
        { id: 2296, name: 'Atticus J. Tulliver' },
    ],
    josonni: [
        { id: 2363, name: '[Cadet] Daryl Dickinson', factions: ['Law'] },
    ],
    jovainex: [
        { id: 1708, name: 'El Sali', telegram: 'LR159' },
    ],
    JPinHD_: [
        { id: 2332, name: 'Johnny Borsk' },
    ],
    JRockofBerg: [
        { id: 2123, name: 'Lyle Clambiscuit' },
    ],
    jsaabb: [
        { id: 1463, name: 'Julien Snow', displayName: 2, factions: ['Red Water'], telegram: 'VF848' },
    ],
    JugsySiegel: [
        { id: 459, name: '[Deputy] Lyle Lancaster', factions: ['Law'], telegram: 'FD542' },
        { id: 1706, name: 'Samwell "Sam" Pine', nicknames: ['Samuel'] },
        { id: 1865, name: 'Floyd Batlle' },
    ],
    JunkieEzek: [
        { id: 460, name: 'Jeremiah Harth' },
    ],
    JustAnotherBro: [
        { id: 461, name: 'Billy Blood' },
    ],
    JustSam42: [ // Doesn’t like telegrams visible
        { id: 462, name: '[Ranger] Nathan Thompson', factions: ['Rangers'], deceased: true }, // Former Game Warden. Telegram: EY079
        { id: 1710, name: 'Angel Roberts' }, // Telegram: GX691
        { id: 1758, name: 'Jameson "Bear" Farthing', nicknames: ['Mitchel', 'Hourglass', 'HG'] }, // Telegram: WB970
        { id: 1841, name: 'Cecily "CC" Matthews' },
        { id: 2192, name: '[Sr. Deputy] Keith Oath', factions: ['Law'] },
        { id: 2193, name: 'Virgil "Gil" Johnson' },
        { id: 2194, name: 'Dot Fletcher' }, // First name Dylan. Streamer doesn’t want it known.
    ],
    JVI_Gaming: [
        { id: 2096, name: '[Ranger] Owen Bradley', factions: ['Rangers'] },
    ],
    JxdiTV: [
        { id: 463, name: 'Minnie Mines' },
        { id: 1847, name: 'Winnie Jones' },
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
    keelanAU: [
        { id: 1266, name: 'Jack Adams' },
    ],
    Keldrithh: [
        { id: 1902, name: 'Alexander Drake', nicknames: ['Captain Drake'], displayName: 3 }, // “Captain Alexander Drake”
        { id: 1903, name: 'Seiya Orochi', deceased: true },
    ],
    Kelsenpai: [
        { id: 471, name: 'Edward Bolton' },
    ],
    Khandur_: [
        { id: 472, name: 'Tommy Cooper' },
        { id: 1012, name: '[Sr. Deputy] Dan O’Grady', factions: ['Law'], telegram: 'SM014' },
        { id: 1476, name: 'Kelton Jennings' },
        { id: 2076, name: 'Silas Blackwood' },
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
    Kirah_Hellrose: [
        { id: 873, name: 'Cornileus Moon Frazier', nicknames: ['Seth'], displayName: 2, factions: ['Frazier Gang'], telegram: 'YD718' }, // "Cornileus Moon" "Cornileus Moon-Frazier" "Moon Frazier" "Moon “Seth” Frazier"
        { id: 874, name: 'Amadeus "Adonis" Silver' },
        { id: 1504, name: 'Vega Escudero' },
        { id: 1868, name: 'Kaseem X' },
    ],
    Kirikuwaa: [
        { id: 1427, name: '[Recruit] Matthew Morrow', factions: ['Rangers'], telegram: 'VZ031' },
    ],
    Kirimae: [
        { id: 1156, name: 'Evelynn Walker', nicknames: ['Evie'], telegram: 'DI612' },
    ],
    Kiva: [
        { id: 477, name: 'Harper Madison' },
    ],
    Kiwo: [
        { id: 972, name: 'Gretta Inga' },
        { id: 973, name: 'Nancy Bancroft' },
        { id: 988, name: 'Maeve Murdoch' },
        { id: 2233, name: 'Winifred "Winnie" Moore', nicknames: ['The Milk Maiden'] },
    ],
    Kleronomus: [
        { id: 1483, name: 'Davey Pierce' },
    ],
    KlokWrk: [
        { id: 478, name: 'Joshua Reeves' },
        { id: 1057, name: 'Enzo Ekker' },
    ],
    KokoBananaMan: [
        { id: 1017, name: 'Gideon Graves', telegram: 'XS740' },
        { id: 1438, name: 'Roger Mayberry' },
    ],
    kono5alive: [
        { id: 1177, name: '[Warden] Lawrence "Big L" Thatcher', factions: ['Sisika Guard'], deceased: true },
        { id: 1178, name: '[Deputy] Andrew Weaver', factions: ['Law'], deceased: true },
        { id: 1292, name: 'Benjamin "Benny" Thatcher', formerFactions: ['Law'], telegram: 'LR040', deceased: true }, // Former Deputy
        { id: 2186, name: 'Colson Steele' },
        { id: 2199, name: 'Diego ?', factions: ['Guarma'] },
    ],
    korean_jukebox: [
        { id: 1647, name: '[Deputy] Leon Buckley', factions: ['Law'] },
        { id: 1648, name: 'Alexio Gotti', formerFactions: ['Quil Gang'] }, // Former Quil Gang
    ],
    Kouts3: [
        { id: 479, name: 'Felix Colt' },
    ],
    Kreamies: [
        { id: 1299, name: 'Welshie Bruiser' },
    ],
    KripkeyTV: [
        { id: 480, name: 'Sergio "Scarpo" Scarpatti', factions: ['DiCenzo Famiglia'], telegram: 'MZ340' },
    ],
    KristoferYee: [
        { id: 481, name: 'Posie Tiv' },
    ],
    Krothy11: [
        { id: 1991, name: 'Herbert Barker' },
    ],
    ksinz: [
        { id: 482, name: '[Deputy] Syles MacKenna', factions: ['Law'] },
        { id: 483, name: 'Cucamonga Kid', factions: ['Half Wits'], displayName: 0 },
        { id: 484, name: 'Milliken Fuller', nicknames: ['Mills'], displayName: 3, factions: ['Fuller House'], leader: true, formerFactions: ['Kettleman Gang'], telegram: 'AW313' },
        { id: 1031, name: 'Archie "Little Cheese" Small', factions: ['One Life'] },
        { id: 1118, name: 'James "The Bro" McAllister', deceased: true },
        { id: 1271, name: 'John Hancock', nicknames: ['Unnamed & Unattested', 'Terry Frost'], displayName: 0 },
        { id: 1333, name: '[Deputy] Jessie Valentine', telegram: 'XF491', factions: ['Law'], deceased: true },
        { id: 1925, name: 'Victor Braithwaite' },
        { id: 2163, name: 'Oatis McQuakerson' },
        { id: 2258, name: '[Deputy] Calvin Gray', factions: ['Law'] },
        { id: 2439, name: 'Elijah Valentine' },
    ],
    KShorts: [
        { id: 2110, name: '[Cadet] Thomas Myles', factions: ['Law'] },
        { id: 2136, name: 'Desmond O’Connell' },
    ],
    KuraiCry: [
        { id: 1473, name: 'River Saxton' },
    ],
    KYC151: [ // Moved from using KYCaffiend to using KYCaffiend_ (since renamed to KYC151)
        { id: 1999, name: 'Emerson Cain' },
        { id: 2000, name: 'Montgomery Flynn' },
        { id: 2001, name: 'Tommaso Scaglietti' },
        { id: 2003, name: 'Remington "Remy" Elias Flynn', telegram: 'FB578' },
    ],
    KYCaffiend: [
        { id: 485, name: 'Emerson Cain' },
        { id: 486, name: 'Montgomery Flynn' },
        { id: 487, name: 'Tommaso Scaglietti' },
        { id: 1715, name: 'Remington "Remy" Elias Flynn', telegram: 'FB578' },
    ],
    Kyle: [
        { id: 488, name: 'Ren Solo' },
        { id: 2204, name: 'Seth Callow' },
        { id: 2205, name: 'Marty Buchanan' },
        { id: 2206, name: 'Lakota Tobin', telegram: 'BO227' },
    ],
    KyleMercury: [
        { id: 2227, name: 'Cassidy Johnson' },
    ],
    Kyltrex: [
        { id: 489, name: 'Jackson "Dead-Eye Jack" Pryde', nicknames: ['#1'], telegram: 'MV535' }, // Former leader of the Bloody Hoods
        { id: 490, name: 'Louis "Louie" Lancaster' },
        { id: 491, name: 'Luther Von Brandt' },
        { id: 1282, name: '[Deputy] Daryl Dalton', factions: ['Law'], telegram: 'TV495' },
        { id: 1383, name: '[Guard] John Garrison', factions: ['Sisika Guard'], telegram: 'RA826' },
    ],
    KyQuinn: [
        { id: 492, name: 'Carmen Beckett' },
        { id: 493, name: 'Jackson Riggs', telegram: 'WF336' },
        { id: 494, name: 'Miss Mystery' },
        { id: 495, name: 'Olive Wallace' },
        { id: 496, name: 'Portia Hartley' },
        { id: 497, name: '[Deputy] Quinton Ivy', factions: ['Law'], telegram: 'OK036' },
        { id: 498, name: 'Trixie Davenport' },
        { id: 499, name: 'Jade Turner', telegram: 'DD964' },
        { id: 1560, name: 'Bessie Blessing' },
    ],
    lakuuuna: [
        { id: 501, name: 'Tavish Black' },
        { id: 502, name: 'Jack "Ash" James', nicknames: ['Wolf-kin'] },
    ],
    Langiam: [
        { id: 2216, name: 'Percival O’Leary' },
    ],
    Lawlman: [
        { id: 981, name: 'Jim Walker' },
        { id: 2141, name: 'Johnny Dare' },
    ],
    Lazy_Flamingo: [
        { id: 1774, name: '[Chief] Jairo "River Warrior" Cook', nicknames: ['Wolven Warrior Who Splits the River'], factions: ['ToPa Ota', 'Sun Warriors'], leader: true },
    ],
    LEAH: [
        { id: 503, name: '[Sr. Deputy] Francesca "Frankie" Bright', factions: ['Law'], telegram: 'GG190', deceased: true },
        { id: 504, name: 'Harriet "Hawk" Hawkins', factions: ['Red Water'], telegram: 'JV256', deceased: true }, // Former Summers Gang
        { id: 505, name: 'Brie Haviour' },
        { id: 506, name: 'Ruthie Samuels' },
        { id: 1330, name: 'Ally Ramsey' },
        { id: 1454, name: 'Sierra "Sisi" Castillo', factions: ['Del Lobos'], telegram: 'LS438' },
        { id: 1664, name: 'Margo Rush', telegram: 'ZW004' },
        { id: 1953, name: 'Aoibh O’Connor', factions: ['Pruitt Gang'] },
        { id: 1974, name: '[Sheriff] Guinevere Wilde', factions: ['Law'] },
    ],
    learntoswim: [
        { id: 1658, name: 'Cornelius T Fop' },
    ],
    Leg0s: [
        { id: 1286, name: 'Gabrielle Reyes' },
    ],
    Lemon_Dwarf: [
        { id: 2145, name: 'Marcus Monroe' },
        { id: 2211, name: 'Shaun Murdock' },
    ],
    Lendermations: [
        { id: 507, name: 'Inessa "Miss Match" Bornlof', telegram: 'XI953' },
        { id: 508, name: 'Riley Rivens', nicknames: ['Slim'], telegram: 'RI031' },
        { id: 509, name: 'Tantallia Tippins' },
    ],
    leodotmae: [
        { id: 510, name: 'Eleanor Cain', formerFactions: ['Law'], telegram: 'UW695' }, // Former Law
        { id: 1316, name: '[Deputy] Johannah Briggs', nicknames: ['Johannah Briggs-McAlister'], factions: ['Law'], telegram: 'FR003' },
        { id: 1922, name: 'Judas Taylor' },
    ],
    LetterJaye: [
        { id: 511, name: 'Wisteria Snowdon', telegram: 'IM661' },
        { id: 512, name: 'Poppy Florian' },
        { id: 1064, name: 'Ivy Skinner' },
        { id: 1128, name: 'Fern Rew' },
        { id: 1161, name: 'Myrtle Sherman', factions: ['Lifer'] },
        { id: 1374, name: '? ?', nicknames: ['Blue'], displayName: 3, factions: ['The Masked Men'] },
        { id: 1905, name: 'Judas Taylor' },
        { id: 2164, name: 'Coral Bells', factions: ['Perma Trail'] },
    ],
    Lewdicon: [
        { id: 950, name: 'Rayven Hope', nicknames: ['Rayvn'] },
        { id: 951, name: 'Zola Caiman', telegram: 'GC656' },
        { id: 952, name: 'Noel "Leon" Taylor' }, // Inactive?
        { id: 1103, name: 'Carmen Fuentes' },
        { id: 1698, name: 'Claire Callahan', telegram: 'QD132' },
        { id: 1792, name: 'Gia Barlow' },
        { id: 1813, name: 'Cassandra ?', factions: ['Lifer'] },
    ],
    Life1908: [
        { id: 1505, name: 'Leo Katz' },
    ],
    lillykiyo: [
        { id: 2355, name: 'Evelyn Reaves' },
    ],
    LimaZuluTango: [
        { id: 513, name: 'Henri Sinclair' },
    ],
    LiteralBear: [
        { id: 514, name: 'Marcus Danner', telegram: 'PP448' },
        { id: 515, name: '[Deputy] Negan McAlister', factions: ['Law'], displayName: 1, telegram: 'WD052' },
        { id: 516, name: 'Joseph "JoJo" Johanson', factions: ['Half Wits'], telegram: 'FX403' },
        { id: 517, name: 'Diego Marin', factions: ['Conductors'] },
        { id: 1396, name: 'Duncan Murphy', factions: ['10 Tonne Gang'], telegram: 'QQ407' },
        { id: 1544, name: 'Hutch Vandal' },
    ],
    Lithiaris: [
        { id: 518, name: '[Doctor] Lark Atwood', factions: ['Medical'], telegram: 'MB861' },
        { id: 519, name: '[Deputy] Sylvie Chevalier', factions: ['Law'], telegram: 'OR480' },
        { id: 1024, name: 'Hollyhock' },
    ],
    lithiumGhoul: [
        { id: 1712, name: '[Deputy] Cain Taylor', factions: ['Law'], telegram: 'QE630' },
    ],
    Little_Lulah: [
        { id: 1859, name: 'Ducky Buckshank', deceased: true },
        { id: 1920, name: 'Nana Yetta' },
        { id: 2032, name: '[Cadet] Maria Dimitriou', factions: ['Law'] },
        { id: 2148, name: 'Antoinette Applebottom' },
        { id: 2305, name: 'Earnest Peabody' },
        { id: 2367, name: 'Kathleen Delaney' },
    ],
    livia: [
        { id: 288, name: 'Lydia Spade' },
        { id: 289, name: 'Aria Monroe' },
        { id: 2196, name: '[Deputy] Tori Kalahan', displayName: 1, factions: ['Law'] },
    ],
    Livraan: [
        { id: 520, name: 'Hanna Eriksson' },
    ],
    lizzyyyy: [
        { id: 1290, name: 'Olive Cotter', factions: ['The Black Company'], telegram: 'WX925' },
        { id: 1652, name: 'Margery Linden', telegram: 'EL717' },
        { id: 2118, name: '[Ranger] Cayenne Strong', factions: ['Rangers'] },
    ],
    ll_Marziano_ll: [
        { id: 521, name: 'James Lawson' },
        { id: 522, name: 'Lawrence Kelley' },
        { id: 523, name: 'Nitokaayi "Lone Bison" Nawakwa' },
    ],
    LLumiya: [
        { id: 524, name: 'Elizabeth Black' },
    ],
    llvhydr0vll: [
        { id: 1958, name: 'Connor Olson' },
    ],
    LockTheRaven: [
        { id: 1366, name: 'Ezekiel Proctor' },
    ],
    Lovebot44: [
        { id: 525, name: 'Annie Applebee' },
        { id: 526, name: 'Charlotte Blackwood' },
        { id: 527, name: 'Eustice Dixon' },
        { id: 528, name: 'Lillian Church' },
        { id: 1163, name: 'Endora "The Spit Witch" Fey' },
        { id: 1536, name: 'Bonnie May' },
        { id: 2044, name: 'MaryAnn Maxwell' },
        { id: 2129, name: 'Eloise Chapman' },
    ],
    Lt_Custard: [
        { id: 530, name: 'Kian McNulty' },
    ],
    Lt_Raven: [
        { id: 531, name: '[Father] Samuel O’Keeffe', displayName: 2 },
        { id: 532, name: 'Randall "Ears" ?' }, // Rhodes Ruffians
    ],
    luka_aus: [
        { id: 533, name: 'Lukeas Winsmore', displayName: 2, factions: ['The Baastards'], formerFactions: ['Boons Boys'], telegram: 'YU594' },
        { id: 534, name: 'Louis O’Neil' },
        { id: 1363, name: '[Deputy] Cain Maloo', nicknames: [reg(/\bmaloo+\b/)], telegram: 'QA880', factions: ['Law'] },
        { id: 1717, name: 'Frederick Gold' },
        { id: 1720, name: 'Andre Flocko', telegram: 'BG445' },
    ],
    Lunabee: [
        { id: 535, name: 'Abigale Hart' },
    ],
    lunarpetunia: [
        { id: 2005, name: 'Danya Fetherly', nicknames: ['Dany'], factions: ['Quil Gang'] },
    ],
    Lyndi: [
        { id: 536, name: 'Delilah Deveaux', nicknames: ['Daffodil'] },
    ],
    Maceymclovin: [
        { id: 537, name: 'Jackson Slater' },
        { id: 1132, name: 'Sirus Castermen' },
    ],
    Mackaelroni: [
        { id: 538, name: 'Bobby-Sue Fredrickson' },
        { id: 539, name: 'Everett Bondurant' },
        { id: 540, name: 'Jarvis Jones' },
        { id: 541, name: 'Mack Fredrickson' },
        { id: 542, name: 'William White' },
        { id: 1097, name: 'Abe Cooper' },
    ],
    Mackie_nx: [
        { id: 543, name: '[Sheriff] Jack Cameron', factions: ['Law'], telegram: 'KA482' },
        { id: 544, name: 'Scott Samuel' },
        { id: 545, name: 'Nathanial ?', nicknames: ['Smoke'] },
        { id: 546, name: 'Richard Watson' },
        { id: 547, name: 'Terrance King', factions: ['The Ward'] },
    ],
    Madam4721: [
        { id: 1613, name: 'Evie Jones' },
        { id: 1614, name: 'Gracie Wagoner' },
    ],
    MadHare_23: [
        { id: 1377, name: 'Edward Bretton', telegram: 'IN643', assume: 'assumeOther' },
        { id: 1378, name: 'Jugg Washburn', factions: ['The Strays'], telegram: 'TF573' },
        { id: 1608, name: 'Edmund Rivett', telegram: 'ZP509' },
        { id: 1609, name: 'Kurtis "Big Swell" Swell' },
        { id: 1965, name: 'Zeno Fuda' },
        { id: 2004, name: 'Ralphold "Ralph" Gneer' },
    ],
    Madmoiselle: [
        { id: 548, name: 'Lily Landry' },
        { id: 549, name: 'Oola Lafayette' },
        { id: 1404, name: 'Willafred Beauregard', telegram: 'RF995' },
    ],
    MadsKadie: [
        { id: 1361, name: 'Alessandra Moretti', telegram: 'EY243' },
        { id: 1421, name: 'Scarlett Winters', factions: ['Kelly Gang'], telegram: 'CN670', deceased: true },
        { id: 1700, name: '[Ranger] Raven Hill', factions: ['Rangers'], telegram: 'OP170' },
    ],
    MafiaDrew: [
        { id: 550, name: 'Donatello Jameson', nicknames: ['Don'], displayName: 2, telegram: 'TQ717' },
    ],
    maigly722: [
        { id: 1885, name: 'Mason James', deceased: true },
        { id: 1890, name: '[Sheriff] Mitchell Sandh', nicknames: ['Mitch'], factions: ['Law'] },
    ],
    ManiLive: [
        { id: 1275, name: 'Ting Wu' },
    ],
    MannersMaketh_: [
        { id: 551, name: 'Horatio Hudson' },
    ],
    Mantis: [
        { id: 1843, name: 'Pepe Slivia', nicknames: ['Pepe Silvia'] },
    ],
    ManyFacedSage: [
        { id: 2322, name: 'EJ McCree', nicknames: ['Mad Dog'] },
        { id: 2326, name: 'Caliban McDoodle' },
        { id: 2372, name: 'Cletus McElroy' },
        { id: 2378, name: 'Phineas Blackwood' },
    ],
    Marty__O: [
        { id: 552, name: 'Bobby Brampton' },
        { id: 553, name: 'Dmitri Crenshaw' },
        { id: 554, name: 'Marty Hanes' },
        { id: 555, name: 'Ernie Crabgrass' },
        { id: 1839, name: '[Deputy] Arthur Quinn', factions: ['Law'] },
    ],
    MattRP: [
        { id: 1085, name: 'Guy Newman', displayName: 0 },
        { id: 1310, name: '[Deputy] Jebediah Ripley', factions: ['Law'], telegram: 'AL699' },
    ],
    MaverickHavoc: [
        { id: 557, name: 'Cornellius Orvid', telegram: 'IS013' },
    ],
    McBlairTV: [
        { id: 558, name: 'Cyrus McGill' },
    ],
    MDMums: [
        { id: 559, name: 'Edward Moore' },
        { id: 560, name: '[Deputy] Matthew "Sevens" McAllister', factions: ['Law'] },
    ],
    meechy_hendrix: [
        { id: 1211, name: 'Bobby Johnson', assume: 'assumeOther' },
    ],
    MEKABEAR: [
        { id: 561, name: '[Deputy] Audrey Dusk', factions: ['Law'], telegram: 'RU510' },
        { id: 562, name: 'Goldie Fisher', factions: ['Dead End Gang'], formerFactions: ['Kettleman Gang'], telegram: 'YZ009' },
    ],
    MelanieMint: [
        { id: 1272, name: 'Lula Foster' },
    ],
    MetamorfLive: [
        { id: 1674, name: '[Deputy] John Bishop', factions: ['Law'], telegram: 'FB564' },
        { id: 1738, name: 'Walter Wolf', telegram: 'FI975' },
        { id: 1987, name: 'Silas Shepherd' },
        { id: 2160, name: 'Jack Lawrence' },
    ],
    MexiTheHero: [
        { id: 385, name: 'George Shaffer' },
    ],
    Mhaple_: [
        { id: 564, name: 'Morgan Lee', factions: ['Red Water'], telegram: 'UP111' }, // Former Summers Gang
    ],
    Mick: [
        { id: 565, name: 'Gladys Berry' },
    ],
    Middleditch: [
        { id: 1802, name: '[Deputy] Scrump Toggins', factions: ['Law'] },
        { id: 1997, name: '[Cadet] Ronny McMalligan', factions: ['Law'] },
        { id: 2181, name: 'Darnold DeWitt', factions: ['Perma Trail'], deceased: true },
    ],
    MightyMoonBear: [
        { id: 1028, name: 'Russell Woods', telegram: 'BG616' }, // Former The Ring
        { id: 1253, name: 'Nvdo Kali Yona' },
    ],
    MinksOfMars: [
        { id: 566, name: 'Irene "Peaches" Corvus', nicknames: ['Forbidden Fruit', 'Nelly'], factions: ['Dead End Gang'], formerFactions: ['Hagen'], telegram: 'YV009', deceased: true }, // Former Sam's Club
        { id: 567, name: 'Ana Stravinski' },
        { id: 568, name: 'Willow Wisp' },
        { id: 1126, name: 'Isabela Elena Montoya Cabrera de Isla de Flores III' },
        { id: 1277, name: 'Maia Bailey', telegram: 'MB430' },
        { id: 1776, name: '[Deputy] Charlotte Mae', factions: ['Law'], telegram: 'FE155' },
        { id: 1926, name: 'Victoria Braithwaite' },
    ],
    Mini_MoonFox: [
        { id: 1040, name: 'Angelica Schuyler' },
        { id: 1041, name: 'Crystal Hayston' },
    ],
    miraepls: [
        { id: 1826, name: 'Arlene Watt' },
    ],
    Mirggles: [
        { id: 1906, name: 'Matilda Dunn' },
    ],
    miri2rin: [
        { id: 2299, name: 'Sonny Harrison' },
    ],
    MisfitIsOnline: [
        { id: 1461, name: 'Desmond Pierce', factions: ['Red Water'], telegram: 'SA360' },
        { id: 1552, name: 'Michael "Big Mike" Lansky' },
        { id: 1598, name: 'Atlas ?' },
    ],
    mishkaxoxo: [
        { id: 569, name: 'Mishka Agapova', factions: ['Guarma'], telegram: 'QF055' }, // Guarma Guarda recruit
        { id: 1073, name: 'Lavender Jones' },
        { id: 1074, name: 'Oksana Reznikov' },
        { id: 1487, name: 'Dixie Jacobs', nicknames: ['DJ'], telegram: 'DJ998' },
        { id: 1765, name: 'Sasha Ivanova' },
        { id: 2392, name: 'Honey Holiday' },
    ],
    mMattyP: [
        { id: 1046, name: 'Benito "Beni" Salvatore' },
    ],
    Mo1taz: [
        { id: 1327, name: 'Lennart Hellström', telegram: 'RM829' },
    ],
    mochahearts: [
        { id: 2190, name: 'Carmen Padilla' },
    ],
    mollyruu: [
        { id: 2167, name: 'Martha Burnett', factions: ['Perma Trail'] },
    ],
    Mooftress: [
        { id: 1044, name: 'Erie Waters' },
        { id: 1045, name: 'Dot Lungsford', factions: ['The Firm'], telegram: 'CE927' },
    ],
    MoogieCookies: [
        { id: 1230, name: 'Cecily Caldwell', telegram: 'AI841' },
        { id: 1319, name: 'Seraphine Nostradame' },
        { id: 1523, name: 'Andromeda "Andi" Gotti', factions: ['Quil Gang'] },
        { id: 1636, name: 'Debbie Barkley' },
        { id: 1943, name: 'Robin Dallas' },
    ],
    Mood_SlayerVT: [
        { id: 1686, name: 'John Coleman', telegram: 'LW920' },
    ],
    mr_baker99: [
        { id: 1986, name: 'Charlie Baker', assume: 'assumeOther' },
    ],
    MrArkay: [
        { id: 570, name: 'Casper Hems' },
        { id: 2124, name: 'Teeki Rava' },
        { id: 2226, name: 'Zeke Gibbson' },
        { id: 2306, name: 'Harvey Veil' },
        { id: 2314, name: 'Ralfee Silver' },
    ],
    MrBrandoTV: [
        { id: 1870, name: 'Dante Rizzoto', telegram: 'SA450' },
    ],
    MrFreak_TV: [
        { id: 571, name: 'Arliss Hagen' },
        { id: 572, name: 'Colt Youngblood' },
        { id: 573, name: 'Fergus McDuffy' },
        { id: 574, name: 'Mal Tompkins' },
        { id: 575, name: 'Orland Boggs' },
        { id: 576, name: 'Blem Jinkins' },
    ],
    MRGOONBONES: [
        { id: 577, name: 'Goon "Goom-Boobie" Bones', factions: ['Conductors'] },
    ],
    MrMoonsHouse: [
        { id: 578, name: 'Tommy Roach', nicknames: ['Two Snakes', 'Tommy Two Snakes', 'Tommy 2 Snakes'], displayName: 5, assumeChar: true, telegram: 'LH415' }, // Former Momma's Boys, but I'm not sure if they still exist or not. May have been the leader?
        { id: 579, name: 'Kang Colton', factions: ['Coltons'], deceased: true },
        { id: 1002, name: 'Waylon Puckett', factions: ['One Life'] },
        // { id: 2092, name: 'Moon Dance', displayName: 0, factions: ['One Life'] }, // Removed because matching always matched “Mr. Moon” at the start of titles
    ],
    MrPandaaBear: [
        { id: 580, name: 'Cathal McCarthy' },
    ],
    MrSpacyTV: [
        { id: 1585, name: '[Deputy] Mason Mcree', factions: ['Law'], telegram: 'TZ944' },
        { id: 1731, name: 'Oscar Mcaren', telegram: 'LL405' },
    ],
    mrtibbs268: [
        { id: 2333, name: '[Deputy] ? Titus', factions: ['Law'] },
    ],
    mrwobblestwitch: [
        { id: 1507, name: 'Nickolai Klauss' },
        { id: 1508, name: 'Willie Jelqson' },
    ],
    mrwolfff98: [
        { id: 1369, name: 'Jesse Rivers' },
        { id: 1493, name: '[Sr, Ranger] Ellis Wade', factions: ['Rangers'], telegram: 'SU750' },
        { id: 1989, name: 'Albie Credence' },
        { id: 2294, name: '[Deputy] Buck Bohannon', factions: ['Law'] },
        { id: 2370, name: 'Charlie "Charming Charlie" Ernst' },
    ],
    MsVenture: [
        { id: 581, name: 'Martina Guzman', factions: ['Hagen'], telegram: 'JK700' },
        { id: 1844, name: 'Josephine Treves' },
        { id: 1988, name: 'Bella Huxley' },
        { id: 2303, name: 'Jean Buress' },
    ],
    muchostylee: [
        { id: 2361, name: 'Moxley "Mox" ?' },
    ],
    muhzzy: [
        { id: 582, name: 'Dr. Cloth', displayName: 0 },
        { id: 583, name: 'Grim' },
        { id: 584, name: 'Herman Wilbur' },
        { id: 585, name: '[Cadet] Leon Taylor', factions: ['Law'] },
        { id: 586, name: 'Conny Cage' },
        { id: 1697, name: 'Enoch "Chompy" Holt', nicknames: ['Big Chomp', 'Chomp'], factions: ['10 Tonne Gang'], telegram: 'JN479' },
        { id: 1783, name: 'Fletcher Lee' },
        { id: 1794, name: 'Lyle McCoy' },
        { id: 1916, name: 'Howdie Gerkin' },
        { id: 2270, name: '[Deputy] Corbin Dunn', factions: ['Law'] },
    ],
    Mungo: [
        { id: 1899, name: 'No Knobbs' },
        { id: 2166, name: 'Jensen Jentles', factions: ['Perma Trail'] },
    ],
    my_unexpected_pleasure: [
        { id: 1992, name: 'Devedander "Mud" Abercrombie' },
    ],
    Myre: [
        { id: 587, name: 'Benoit Baratie' },
        { id: 588, name: '[Sr. Reporter] Crispin Cantabile', telegram: 'AX263', factions: ['News'] },
        { id: 589, name: 'Dallas Wolf', nicknames: ['Saul South'], displayName: 1, formerFactions: ['Rangers'], telegram: 'DV817' }, // Former Senior Ranger
        { id: 590, name: 'Phineas Fentworth' },
        { id: 1285, name: 'Felix Stanton' },
        { id: 1287, name: 'Dante Drummer' },
        { id: 1779, name: 'Kip ?' },
    ],
    Myrtle_The_Imp: [
        { id: 1391, name: 'Ishkode Asin', nicknames: ['Fire Rock'], factions: ['Sun Warriors'] },
    ],
    Nakkida: [
        { id: 597, name: 'Lyra Woods' },
        { id: 2168, name: 'N. Threadwell', displayName: 2, factions: ['Perma Trail'] },
    ],
    nathankb_: [
        { id: 598, name: 'Dug Dug', nicknames: ['Dug Money'] },
    ],
    NaniNerd: [
        { id: 599, name: 'Ivy Hill', telegram: 'TL605' },
    ],
    NapoleonsLive: [
        { id: 1747, name: 'Buddy LaFleur' }, // Victory Street?
    ],
    NavyWarVet: [
        { id: 1607, name: '[Sr. Ranger] Chase Reeves', factions: ['Rangers'], telegram: 'AY334' },
    ],
    nawori: [
        { id: 1364, name: 'Jack Bones', telegram: 'OL590' },
    ],
    nawtyeagle: [
        { id: 1302, name: 'Ronnie White' },
    ],
    Nay8RP: [
        { id: 2253, name: 'Marlo Mercer' },
    ],
    Nbodo: [
        { id: 600, name: '[Game Warden] Peter Rockwell', factions: ['Rangers'], telegram: 'PI343' },
        { id: 1877, name: 'Hank Ladle' },
    ],
    Ncbrisk: [
        { id: 1941, name: 'Martin Sedgwick' },
        { id: 2041, name: 'Howard Hobbes' },
    ],
    NeonLoveGalaxy: [
        { id: 1654, name: 'Otis Higgins' },
        { id: 1655, name: 'Horatio Blakely' },
        { id: 1656, name: 'Beckett Kennedy', factions: ['Hagen'] },
    ],
    NeonScorpionPlays: [
        { id: 1596, name: 'Calissian Monroe' },
    ],
    Nerfman_: [
        { id: 1322, name: 'Mick Murphy', telegram: 'YG894' },
    ],
    NewLisaLife: [
        { id: 1973, name: 'Maggie Reilly' },
    ],
    Next_Hokage666: [
        { id: 1934, name: 'Donovan Kray' },
    ],
    NiaDrools: [
        { id: 601, name: 'Madeline "Moxy" Maddox', telegram: 'ZJ152' },
        { id: 602, name: '[Deputy] Edith "Ed" Gretchen', factions: ['Law'], formerFactions: ['Conductors'], telegram: 'BJ726' },
        { id: 603, name: 'Guinevere "Snow" Snow' },
        { id: 604, name: 'Penelope Kringle', nicknames: ['Queen of Roaches'], factions: ['Half Wits'], telegram: 'AB668' },
        { id: 1395, name: 'Victoria ?', telegram: 'ZG829' },
        { id: 2139, name: 'Marry Waterson' },
    ],
    Nicklbean: [
        { id: 1314, name: 'Arther Prince', factions: ['The Firm'], telegram: 'YW855', deceased: true },
        { id: 1357, name: 'Buddy Roland' },
        { id: 1389, name: 'Richard Ironheart' },
        { id: 2012, name: 'Levi Lawson' },
        { id: 2020, name: 'Jayson Ford' },
        { id: 2021, name: 'Roddy MacNeil' },
        { id: 2252, name: 'Jack Crow' },
    ],
    Nidas: [
        { id: 605, name: 'Eustace Goodwin' },
    ],
    Nikcadem: [
        { id: 1119, name: 'Billy Bob Baker' },
    ],
    NoahsDay: [
        { id: 606, name: '[Deputy] Cliff Otis', factions: ['Law'] },
        { id: 1719, name: 'Ace Davis' },
        { id: 2218, name: 'Tobias "T.J." Jones' },
    ],
    NomadDee: [
        { id: 191, name: 'Aadi G. Boom' },
    ],
    Nopheros: [
        { id: 607, name: '[Deputy] Robert Fisher', factions: ['Law'] },
        { id: 1050, name: 'Brick Bagwell' },
        { id: 1373, name: '? ?', nicknames: ['Gold'], displayName: 3, factions: ['The Masked Men'] },
    ],
    NOTmack_: [
        { id: 608, name: 'Seymour Humphries' },
    ],
    NotoriousBuddhaa: [
        { id: 1344, name: 'Benji Clayton', telegram: 'BP221' }, // Red Shirts
    ],
    NouieMan: [
        { id: 609, name: 'James Henderson', nicknames: ['Captain Henderson', 'Captain James Henderson'], displayName: 3, factions: ['Independent', 'Guarma'], telegram: 'CE381' },
        { id: 610, name: 'Jim Fandango' },
        { id: 611, name: 'John Tatum' },
        { id: 612, name: 'Leviticus Starr' },
        { id: 613, name: 'Louis Darling' },
        { id: 614, name: 'William Martinez' },
        { id: 1657, name: 'Lucky Austin' },
    ],
    NovaaBerries: [
        { id: 2213, name: 'Isabelle "Izzy" Watson' },
        { id: 2234, name: 'Molly Burrows' },
        { id: 2240, name: 'Lorelai Clematis' },
    ],
    Novatic: [
        { id: 615, name: 'Doug Heartland' },
    ],
    Novatorium: [
        { id: 616, name: 'Minnie Bean', telegram: 'WD585' },
        { id: 617, name: 'Trix' },
        { id: 2081, name: 'Selene Smith' },
        { id: 2082, name: 'Talulah Branch' },
        { id: 2083, name: '[Deputy] Yalena Volkov', factions: ['Law'] },
    ],
    noz_101: [
        { id: 2442, name: 'Benjamin Croft' },
    ],
    nubbyftwx: [
        { id: 1027, name: 'Jock O’Donell' },
    ],
    nziech: [
        { id: 618, name: 'Kuniklo', factions: ['Kettleman Gang'], telegram: 'ZW545' },
        { id: 619, name: 'Orpheus "Buck" Buck', factions: ['Half Wits'] },
        { id: 1155, name: '? "Moneybags" ?' },
        { id: 1291, name: '[Deputy] Edward Stump', nicknames: ['Ed'], factions: ['Law'], telegram: 'QV960' },
    ],
    OBreezzy_21: [
        // Uses “WildRP” while playing RDR2 Story Mode
        { id: 1038, name: '? ?', assume: 'neverNp' },
    ],
    OfficialBea: [
        { id: 974, name: 'Lois Miles', factions: ['Miles Gang'] },
        { id: 1281, name: 'Sprout ?', factions: ['Hagen'] },
    ],
    oh_nopes: [
        { id: 1918, name: 'Hannah Hanson', nicknames: ['Hannah Malone'], factions: ['Quil Gang'] }, // Hannah Hollard?
        { id: 2108, name: '[Reporter] Emily Mads', factions: ['News'] },
        { id: 2353, name: '[Deputy] Kinsley Ryan', factions: ['Law'] },
        { id: 2354, name: 'Jorie Jones' },
    ],
    OhHeyItsFunk: [
        { id: 621, name: 'Lucius Tubbs' },
    ],
    ohheyliam: [
        { id: 622, name: 'Oliver "Ollie" Quil', factions: ['Quil Gang'], formerFactions: ['Kettleman Gang'], telegram: 'IA639' },
    ],
    OhJessBee: [
        { id: 623, name: 'Carmine Crimson' },
    ],
    ohnopojo: [
        { id: 624, name: 'Billy Kim' },
        { id: 1517, name: 'Sancho ?', factions: ['Del Lobos'], telegram: 'PU409' },
        { id: 1575, name: 'Everett Dunn' },
        { id: 1576, name: 'Felix Zhou' },
    ],
    okaygingervitis: [
        { id: 1332, name: 'Thornton Nigelbury' },
        { id: 1482, name: 'Stylianos "Stelio" Kontros', nicknames: ['Bill', 'Peaches'], telegram: 'FI133' },
        { id: 1503, name: 'Eugene Pemberton', factions: ['Conductors'], telegram: 'WM050' },
        { id: 1573, name: 'Bobby Roberts' },
    ],
    oldkelvo: [
        { id: 625, name: 'Jack Crow' },
        { id: 626, name: 'Beth Gout' },
        { id: 627, name: 'Carver Reilly' },
        { id: 628, name: 'Boyd Cassidy' },
    ],
    oldmangamer4life: [
        { id: 1862, name: 'Nash Hale' },
    ],
    OldManHowler: [
        { id: 1212, name: 'Marco Armando Dantez De La Copa', assume: 'assumeOther' },
    ],
    One_True_Roadie: [
        { id: 1252, name: '[Sr. Ranger] Cole Cade', factions: ['Rangers'], telegram: 'PK751' },
    ],
    onebaw: [
        { id: 995, name: 'John Loch' },
    ],
    OneOceanTenLive: [
        { id: 1971, name: 'Ivar Vilulfsson' },
    ],
    ONLYALEX66: [
        { id: 2432, name: '[Deputy] Julia Boswell', factions: ['Law'] },
    ],
    Orcish: [
        { id: 629, name: '[Undersheriff] Allistair McGregor', factions: ['Law'], telegram: 'HP579' },
        { id: 630, name: 'Billy Beetur', nicknames: ['Charlie'], factions: ['Independent', 'Guarma'], telegram: 'KY632' },
        { id: 631, name: 'Otis Potts' },
        { id: 632, name: 'Richard Westlake' },
        { id: 633, name: 'Tripp Riggs' },
        { id: 2323, name: 'Frank Kennedy' },
    ],
    Ormais: [
        { id: 634, name: 'Lloyd Conway' },
        { id: 1030, name: 'William Maine' },
    ],
    OwenSeven: [
        { id: 1005, name: 'Alfred Hoover', nicknames: ['Lips'] },
        { id: 1833, name: '[Cadet] Malcom Owens', factions: ['Law'] },
    ],
    p3t3_ttv: [
        { id: 1256, name: 'Tex Smith' },
    ],
    PandemoniumRPG: [
        { id: 1018, name: 'Alfie Jacobsmith', telegram: 'QX382' },
        { id: 1480, name: 'Garath "Mitch" Mitchell', telegram: 'WB743' },
        { id: 1556, name: 'Billybob Roberts' },
    ],
    PapaDrgnz: [
        { id: 635, name: 'Shiv Bailey' },
        { id: 1428, name: 'Kiley Cobain', telegram: 'TA866' },
        { id: 1823, name: 'Yane Ayala', factions: ['Independent', 'Guarma'] },
        { id: 1936, name: 'Evelyn Haight' },
        { id: 2014, name: 'Juneau Von Juliet' },
    ],
    PapkaMush: [
        { id: 1105, name: 'John Christian' },
        { id: 1106, name: 'Michael Orville' },
        { id: 1125, name: 'William Peeker', factions: ['Lifer'] },
        { id: 1263, name: 'Viktor Reith' },
        { id: 2235, name: 'Billy Stallion' },
    ],
    Paracast: [
        { id: 636, name: 'Erasmus South', assume: 'assumeOther' },
    ],
    PBandJLee: [
        { id: 637, name: '[Sr. Doctor] Elsie Fletcher', factions: ['Medical'], telegram: 'VR174', deceased: true },
        { id: 1311, name: 'Amelia Evans', telegram: 'VG322' },
        { id: 2023, name: 'Kenneth Benton' },
        { id: 2065, name: 'Caoimhe Quinn' },
        { id: 2079, name: 'Serena Chen' },
        { id: 2132, name: 'Mollie McGee', deceased: true },
        { id: 2292, name: 'Eleanor Clark' },
    ],
    PeachTreeMcGee: [
        { id: 638, name: 'Charlotte Toussaint' },
    ],
    peachycoaster: [
        { id: 639, name: 'Chrissy Snow', factions: ['Dead End Gang'], telegram: 'CE683' },
        { id: 640, name: 'Toosie Loo', telegram: 'NY412' }, // Kettleman hangaround? I would consider her Kettleman, but Jack doesn't
        { id: 641, name: 'Kipper O’Neil' },
        { id: 1494, name: '[Deputy] Justine Prudence', factions: ['Law'], telegram: 'SD737' },
    ],
    Pengwin: [
        { id: 642, name: 'Staniel Wilkerson' },
    ],
    PENTA: [
        { id: 997, name: 'Walter Thomas', nicknames: ['Big Walter Bulge', 'Walter Bulge', 'Bulge', 'Whorehay Bulge'], displayName: 4, telegram: 'DG939' },
    ],
    Peppo: [
        { id: 371, name: 'Jack Kettleman', factions: ['Kettleman Gang'], leader: true, displayName: 2, telegram: 'MT027' },
        { id: 372, name: 'Robert Dixon' },
        { id: 373, name: '[Deputy] Manuel Diaz', nicknames: ['El Coyote', 'Coyote'], displayName: 3, factions: ['Law'], telegram: 'NG146', deceased: true },
        { id: 1170, name: 'Richard Ross' },
        { id: 1435, name: 'Merry Slobbins' },
        { id: 1633, name: 'Edgar Lopez', telegram: 'KG025' },
        { id: 2010, name: 'Tee Stavbar' },
    ],
    PepsiSlush: [
        { id: 529, name: 'Alex Mystic' },
    ],
    Pers: [
        { id: 643, name: 'Dr. Carrie Williams' },
        { id: 644, name: 'Mischa Crane' },
    ],
    pettiemane: [
        { id: 2134, name: 'Freddy Morrison', nicknames: ['Freddy Freedom'] },
    ],
    Pezz: [
        { id: 645, name: 'Cid Speedwagon', nicknames: ['Highwayman'], telegram: 'OR367' },
    ],
    PhantomPlayin: [
        { id: 1964, name: 'Caleb West' },
    ],
    PibbJont: [
        { id: 646, name: '[Deputy] Thatcher Mantell', factions: ['Law'], telegram: 'JR033' },
    ],
    PilotDividend: [
        { id: 2405, name: 'Jack Doherty' },
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
    PissyAtTheDisco: [
        { id: 658, name: 'Oscar Caraballo' },
    ],
    PixiDolll: [
        { id: 1472, name: 'Jane Evans' },
    ],
    Point1985: [
        { id: 652, name: 'Joe Jackson', nicknames: ['JJ'] },
    ],
    Possum_Playz: [
        { id: 1742, name: 'Taras Volkov' },
        { id: 2275, name: '[Deputy] Lazarus Star', factions: ['Law'] },
    ],
    potsieboi: [
        { id: 653, name: 'Doug Landers' },
    ],
    Pr3pared: [
        { id: 1358, name: 'Fred Derwin' },
    ],
    Pranay1992: [
        { id: 1347, name: 'Anton Volkov', telegram: 'VE309' },
        { id: 1406, name: 'Jack Reeds', telegram: 'FJ061' },
    ],
    PredatorNHL: [
        { id: 1950, name: 'Eli Whittaker' }, // Ranger hopeful
    ],
    PretendMonkey: [
        { id: 2387, name: 'Mallory Jane Walsh', nicknames: ['Mal'] },
    ],
    privyLore: [
        { id: 654, name: 'Wren Lebow', nicknames: ['Lilith', 'The Siren'], telegram: 'TS577' }, // Former Sam's Club
        { id: 655, name: 'Kathryn ?' },
        { id: 656, name: 'Minerva Ackerman' },
        { id: 1187, name: 'Jenna Pearl', factions: ['Lifer'] },
        { id: 1309, name: 'Abigail Notaro', nicknames: ['Abigail Quil', 'Mama Quil'], formerFactions: ['Quil Gang'], telegram: 'EN744' },
        { id: 1359, name: '[Cadet] Mildred Rose', factions: ['Law'], telegram: 'NC017' },
        { id: 1850, name: 'Roxie Harlow' },
    ],
    ProJB: [
        { id: 657, name: 'Odin Borr' },
    ],
    provenelk: [
        { id: 1883, name: 'Flyspeck Floyd', factions: ['10 Tonne Gang'] },
        { id: 2414, name: 'Noah Sykes', deceased: true },
        { id: 2415, name: 'Mingo ?' },
    ],
    psyrinity: [
        { id: 69, name: 'Laura Dunn' },
        { id: 1707, name: 'Amalia H. Delray', factions: ['Freeman Family'] },
    ],
    PuckNatorGaming: [
        { id: 659, name: 'Ernest Thorton' },
    ],
    pugsyx3: [
        { id: 1816, name: 'Nathan Shaw' },
    ],
    PukingFerrets: [
        { id: 660, name: 'Alice Fuller', nicknames: ['Alice Quinn'], factions: ['Fuller House'], formerFactions: ['Kettleman Gang'], telegram: 'QN172' },
        { id: 1764, name: '[Guard] Gwendoline Clarke', factions: ['Sisika Guard'] },
        { id: 1801, name: 'Cat ?' },
        { id: 1910, name: 'Annie Braithwaite' },
    ],
    Pumpkinberry: [
        { id: 661, name: 'Cara "Sparks" Murphy', nicknames: ['Honey Sparks', 'Murph'], telegram: 'WD223' },
        { id: 662, name: 'Imogen Blackwell', telegram: 'CI233' },
        { id: 663, name: 'Nora Boone' },
        { id: 664, name: 'Delilah Hemlock', nicknames: ['Omens'], factions: ['Independent', 'Guarma'] }, // Character introduces herself as Delilah, Omens seems to be normally used just for stream titles; there's a very high chance that Delilah is a fake name
        { id: 1443, name: 'Natalie Wilson', factions: ['Guarma'] }, // Guarma Guarda
        { id: 1509, name: 'Coyote Alder', telegram: 'PX024' },
    ],
    PUNK11: [
        { id: 1328, name: 'Chase Ward' },
    ],
    QueenShorkie: [
        { id: 1615, name: 'Aiyana Tsosie' },
    ],
    Question_Box: [
        { id: 665, name: 'Lydia Lewis', formerFactions: ['Law'] }, // Former Sheriff
        { id: 666, name: 'Blaire Turner' },
        { id: 993, name: '[Deputy] Opal Davis', factions: ['Law'], telegram: 'ZV744' },
        { id: 1793, name: '[Cadet] Cordelia Clark', factions: ['Law'], telegram: 'LT761' },
    ],
    QuipRP: [
        { id: 667, name: '[Deputy] Dove Hopkins', factions: ['Law'] },
        { id: 668, name: 'Sally Higgins', nicknames: ['Shotgun'] },
        { id: 669, name: 'Sofia Sherman', factions: ['Moretti Crew'], telegram: 'HV857' },
        { id: 1805, name: 'Nayeli Ba’Cho' },
        { id: 2371, name: '[Medic] Birdie White', factions: ['Medical'] },
    ],
    raaadd_: [
        { id: 670, name: 'Bonnie Sunn' },
        { id: 1108, name: 'Riley Fitzgerald' },
        { id: 1343, name: 'Florence "Flo" Grant', telegram: 'MZ214' },
    ],
    raesic: [
        { id: 2279, name: 'Bridget Leighton' },
    ],
    RageQuitterGaming_: [
        { id: 1380, name: 'Clayton Moor', telegram: 'IM542' },
        { id: 1394, name: 'Bart Whitelock' },
        { id: 1782, name: 'Samual "Sammy" Nilsen', telegram: 'XE040' },
        { id: 1808, name: 'Nathan O’Brian' },
    ],
    RALLY728: [
        { id: 1558, name: 'Joaquin Hernandez' },
    ],
    raulsi: [
        { id: 1682, name: 'Leslie Oak' }, // Seems to try and hide character name on stream. Might be the '????' in stream titles. Not sure if there’s lore around that.
        { id: 1683, name: 'Battuvshin Lkhagvasuren' },
    ],
    Rayormy: [
        { id: 671, name: 'Adelaide Henry' },
    ],
    RayforRachel: [
        { id: 672, name: 'Winifred "Dot" Barlow', telegram: 'ZI419' },
        { id: 673, name: 'Shirley Lemons', nicknames: ['Cowgirl'] },
        { id: 2173, name: 'Annie Taylor', factions: ['Perma Trail'] },
    ],
    RayTwoPlay: [
        { id: 1439, name: 'Freddie Hunt', factions: ['Taipan'], telegram: 'KP895' },
        { id: 1939, name: 'Desmond "Dirty Dez" Higgins' },
        { id: 1960, name: 'Boris Bumblebee' },
        { id: 2109, name: '[Deputy] Rufus Black', factions: ['Law'] },
    ],
    Really_Russ: [
        { id: 1009, name: 'Emerson Newly' },
        { id: 1993, name: '[Deputy] Colton Fisher', factions: ['Law'] },
    ],
    RecallReminisce: [
        { id: 1270, name: 'Victoria Foster' },
    ],
    RecklessComedy: [
        { id: 2071, name: 'Sleepy Pattinson' },
    ],
    REKKRPRO: [
        { id: 674, name: 'Rekks Tanner' },
    ],
    rekKsii: [
        { id: 2364, name: 'Cecil Younger' },
    ],
    Rezo24: [
        { id: 1785, name: 'Roy Woods', telegram: 'AG587' },
        { id: 1817, name: 'Zachary Frost', nicknames: ['Ice'], factions: ['Kelly Gang'], deceased: true },
        { id: 2248, name: 'Mac Bones' },
        { id: 2256, name: 'Eli Dixon' },
    ],
    rezZzyn: [
        { id: 2105, name: 'Barton "Bart" Fields', factions: ['Quil Gang'] },
    ],
    RickMongoLIVE: [
        { id: 675, name: 'Cole Dalton' },
        { id: 676, name: 'Furio Bonanno', factions: ['DiCenzo Famiglia'], telegram: 'FB622' }, // Inactive DiCenzo
    ],
    RiftImpy: [
        { id: 1247, name: 'Bartholomew "Barty" Brue', telegram: 'RY254' }, // Former The Ring
        { id: 1624, name: 'Cole Duncan', nicknames: ['Dusty'], factions: ['The Strays'], telegram: 'US762', deceased: true },
        { id: 2159, name: 'Jonah Sutton' },
    ],
    rlly: [
        { id: 1930, name: 'Delilah Calhoun' },
    ],
    Roach_tm: [
        { id: 677, name: 'Tony Moretti', factions: ['DiCenzo Famiglia'], telegram: 'GW121' }, // Inactive DiCenzo
    ],
    robciclexd: [
        { id: 1362, name: 'Maxwell Woodlock' },
    ],
    rosco: [
        { id: 678, name: 'Awkward Johnson', displayName: 0, deceased: true },
        { id: 679, name: 'Frank Church' },
        { id: 680, name: 'John Hell' },
        { id: 1146, name: 'Maurice Cheeks', factions: ['Lifer'] },
        { id: 1190, name: 'Andy Cabbage', telegram: 'DR608' },
        { id: 1538, name: 'Rockhard Johnson' },
        // Mary Goodfellow [possibly one lifer? was streamed once or twice IIRC]
        { id: 1539, name: 'Sandy Peters', factions: ['One Life'], deceased: true },
        { id: 1540, name: 'Billy Christmas', factions: ['One Life'], deceased: true },
        { id: 1627, name: 'Nedge White' },
    ],
    RookGoose: [
        { id: 681, name: 'Leto McMorris', telegram: 'RT085' },
        { id: 1034, name: '[Deputy] Cleo Haelfort', factions: ['Law'], telegram: 'VL642', deceased: true },
        { id: 1695, name: 'Faye Belofte', telegram: 'ZX382' },
        { id: 1921, name: 'Nadine Fitzsimmons' },
        { id: 2137, name: 'Faith ?' },
    ],
    roooliz: [
        { id: 1121, name: 'Kiono Kolichiyaw', telegram: 'IH929', factions: ['Sun Warriors'], formerFactions: ['Rangers'] }, // Former Ranger
    ],
    RossThehSauce: [
        { id: 682, name: 'Murrietta Walton', nicknames: ['Forest', 'Forest Fish', 'Murry', 'Murri'], displayName: 5, factions: ['Independent', 'Guppy Gang'], formerFactions: ['The Baastards'], telegram: 'IF559', deceased: true },
        { id: 683, name: 'Dominic "Dom" Disouza', factions: ['DiCenzo Famiglia'], telegram: 'HJ726', deceased: true }, // Inactive DiCenzo
        { id: 684, name: 'Lionel Miles', factions: ['Miles Gang'], leader: true },
        { id: 1261, name: 'Jericho Gunne' },
        { id: 1914, name: 'Holden Gold' },
        { id: 2180, name: 'Gene Erik', factions: ['Perma Trail'], deceased: true }, // Unsure of spelling of last name
        { id: 2208, name: '[Deputy] Augustine Graham', factions: ['Law'] },
    ],
    Rouge23_: [
        { id: 2365, name: 'Jesse McKinley' },
    ],
    Rowdywhale: [
        { id: 1863, name: 'Clooter ?' },
    ],
    royalryerye: [
        { id: 1294, name: 'Diana Bennet' },
    ],
    Rudi_Rudes: [
        { id: 2417, name: 'Maximilian Chambers' },
        { id: 2418, name: 'Eli Lockhart' },
    ],
    RY4N: [
        { id: 685, name: 'Christine "Momma" Thomas', telegram: 'VA278', assume: 'assumeOther' }, // Former Momma's Boys? Maybe leader of Momma's Boys?
        { id: 686, name: 'Joe "Moonshine Joe" Burns' },
        { id: 687, name: 'Randy Randy' },
        { id: 688, name: 'Thomas Church' },
        { id: 1976, name: '[Guard] Cedric Worth', factions: ['Sisika Guard'] },
        { id: 2152, name: 'Mary "Sister Mary" ?' },
    ],
    RyanTheGameGuy: [
        { id: 2128, name: 'Marcus Monkfish' },
    ],
    s0upes: [
        { id: 689, name: 'Ace Grimmer' },
    ],
    s5ashadow01: [
        { id: 690, name: '[Deputy] Adam Skye', factions: ['Law'], telegram: 'NJ330' },
        { id: 691, name: 'Froiland Jackson' },
    ],
    SaberTV: [
        { id: 692, name: 'Constance Miles' },
    ],
    Saeynt: [
        { id: 1651, name: 'Michael Krown' },
        { id: 2031, name: 'Sylas Hayes' },
    ],
    SaffyPie: [
        { id: 693, name: 'Cassidy Reynolds' },
    ],
    saffyra: [
        { id: 694, name: 'Birdy Hawke' },
        { id: 695, name: 'Poppy Pascal' },
        { id: 1130, name: 'Louise Loveless', factions: ['Lifer'] },
    ],
    SailorpiXel: [
        { id: 2106, name: 'Rowan McLeod', factions: ['Quil Gang'] },
        { id: 2107, name: '[Deputy] Clarabelle Kelly', displayName: 2, factions: ['Law'], formerFactions: ['Rangers'] }, // Former Ranger
    ],
    saintrabbitt: [
        { id: 2398, name: 'Sisyphus Tumpin' },
    ],
    SalsaRage: [
        { id: 696, name: 'Norman McCain', factions: ['Moretti Crew'], telegram: 'WM372' },
        { id: 697, name: 'Bitt McGee' },
    ],
    Salsinator: [
        { id: 1995, name: 'Arden "Ardie" Remington' },
        { id: 2284, name: 'Ash ?' },
    ],
    SaltyRockGaming: [
        { id: 2030, name: 'Billy McGavin', displayName: 2 },
        { id: 2287, name: 'Donald "Big Bo" Jackson' },
        { id: 2384, name: '[Recruit] Donte Malik', factions: ['Rangers'] },
    ],
    Sammyyyyyyy: [
        { id: 698, name: 'Lizzie Clarke' },
    ],
    samtbull23: [
        { id: 1983, name: 'Clint Carson' },
    ],
    sannmann_: [
        { id: 699, name: 'Jack Milton' },
    ],
    sarahpeathatsme: [
        { id: 700, name: 'Ruby Raines' },
        { id: 1171, name: '[Editor] Abigail Jones', factions: ['News'], telegram: 'WW466' },
    ],
    sass_savage1: [
        { id: 1824, name: 'Amaya Bancroft' }, // Doctor hopeful
        { id: 1825, name: 'Fable Toft' },
        { id: 2073, name: 'Gwenivere Undergrove' },
        { id: 2251, name: 'Janie Clarke' },
    ],
    saturneighteen: [
        { id: 1822, name: 'Henrietta "Henri" Graves', telegram: 'HA761' },
        { id: 2174, name: 'Oksana Petrova', factions: ['Perma Trail'], deceased: true },
    ],
    satyr_queen: [
        { id: 701, name: 'Cornelius Tias' },
        { id: 702, name: 'Curtis Cunningham' },
        { id: 703, name: 'Daisy Shields' },
        { id: 704, name: 'Jolene Quinn' },
        { id: 705, name: 'Josiah Matthews' },
        { id: 706, name: 'Sam Bridges' },
        { id: 707, name: 'Bethany Ryder' }, // Same as “Freddie Ryder”? Or is that a separate character
        { id: 1053, name: 'Steve French' },
        { id: 1116, name: 'Ephrim Coldsteel', factions: ['Lifer'] }, // TODO: Confirm faction
    ],
    SaucedUpWizard: [
        { id: 1336, name: 'Rags Fontaine', telegram: 'YZ680' },
        { id: 1675, name: 'Bear Bridgers', telegram: 'MF233' },
    ],
    Savannieb00: [
        { id: 1036, name: 'Alish Vixen', telegram: 'XT753' },
        { id: 2316, name: 'Esmeray Reaves' },
    ],
    ScarletRosePlays: [
        { id: 708, name: 'Allison "Ally" Chase', deceased: true },
        { id: 709, name: 'Bella Baker' },
        { id: 710, name: '[Sr. Deputy] Zoe Winters', factions: ['Law'], telegram: 'LD969' },
        { id: 1062, name: 'Myrna Meadows' },
        { id: 1157, name: 'Posie Hart', nicknames: ['Kimberly', 'Kimberly Taylor'], displayName: 3 },
        { id: 1228, name: 'Ashley Sky', telegram: 'GR775' }, // Former The Ring
        { id: 1408, name: 'Holly Harper', telegram: 'FQ588', deceased: true },
        { id: 1409, name: '[Guard] Liliana Braytenbach', factions: ['Sisika Guard'] },
        { id: 1537, name: 'Kyla Lane' },
        { id: 1589, name: 'Sophie DeLaRue', telegram: 'NS791' },
        { id: 2241, name: 'Lola West' },
    ],
    ScarlettLollipop: [
        { id: 1412, name: 'Scarlett Kensington', telegram: 'CF169' },
    ],
    SciFri: [
        { id: 985, name: 'Pat Hetic' },
    ],
    ScottAndTheFullEffect: [
        { id: 1471, name: 'Burt Daniels', nicknames: ['Burt Kurt'], factions: ['The Strays'], telegram: 'JY160' },
    ],
    ScottishNapoleon: [
        { id: 1387, name: 'Jonesy Stewart', factions: ['Quil Gang'], telegram: 'VY875', deceased: true },
        { id: 1420, name: 'Glenn Ferguson', telegram: 'EX324' },
        { id: 2244, name: 'Edward Tennent' },
    ],
    ScottJitsu: [
        { id: 711, name: 'Reno Cash' },
    ],
    ScratchyPillow: [
        { id: 2042, name: 'Jeffery Whippens' },
    ],
    Scriffboy: [
        { id: 712, name: 'Tane' },
    ],
    seakeon: [
        { id: 715, name: 'Eoghan Quinn' },
        { id: 716, name: 'Pat Campbell' },
        { id: 717, name: 'William Stone' },
    ],
    SeanVertigo: [
        { id: 2358, name: '[Deputy] Wade Glass', factions: ['Law'] },
        { id: 2359, name: '[Medic] Matthew Vannevar', factions: ['Medical'] },
        { id: 2360, name: 'Rene ?' },
    ],
    sebrrii: [
        { id: 2357, name: 'Nova St. James' },
    ],
    section9_Browncoat: [
        { id: 718, name: '[Deputy] Ned Fuller', factions: ['Law'], telegram: 'AM182' },
        { id: 719, name: 'Nick Carver' },
        { id: 720, name: 'Loup Farrow', telegram: 'LT705' },
        { id: 1733, name: 'Philip Ines', telegram: 'RW729' },
        { id: 1786, name: 'Norman "Wendigo" Crow', telegram: 'DW705' },
        { id: 1819, name: 'Enol Angus', nicknames: ['Col. Angus'], displayName: 3 },
    ],
    Seithrius: [
        { id: 1399, name: 'Yang Kai', displayName: 2, telegram: 'RK551' },
        { id: 1441, name: 'Ed Mayberry' },
        { id: 1496, name: 'Issac Rivers' },
    ],
    Selvek: [
        { id: 721, name: 'Clayton Colton', factions: ['Coltons'], deceased: true },
        { id: 2177, name: 'Waylon Baker' }, // Reverend
    ],
    SencneS: [
        { id: 722, name: 'Desmond Potts' },
    ],
    SentientDNA: [
        { id: 1297, name: 'Jason Caliga' },
    ],
    sgttyn: [
        { id: 723, name: 'Jacob Dubois' },
        { id: 724, name: 'Norris Olson' },
        { id: 725, name: '[Sheriff] Sam Winters', factions: ['Law'], telegram: 'DT600', deceased: true },
        { id: 2343, name: '[Sheriff] ? Greaves', factions: ['Law'] },
    ],
    shadowsINsilence: [
        { id: 726, name: 'Emily Marie Kenward' },
    ],
    Shake4L: [
        { id: 727, name: 'Buzz Bleu' }, // Former Sam's Club.
    ],
    SharpCh3d: [
        { id: 2125, name: 'Alexei Volodsky', nicknames: ['The Butcher'], deceased: true },
        { id: 2232, name: 'Donnie Barton' },
    ],
    ShaunOffShotgun: [
        { id: 2381, name: 'Dickie White', nicknames: ['Sir Dickie White'] },
    ],
    ShawW0w: [
        { id: 728, name: 'Clarence Crudewater' },
    ],
    SheepDog59: [
        { id: 729, name: 'Wyatt Mason Kennedy' },
    ],
    Shepard3B: [
        { id: 1780, name: 'Haystacks Calhoun' }, // Uncertain if that’s their real name
    ],
    Shmooj: [
        { id: 1452, name: 'JoJo Henderson', factions: ['Little Gang'], telegram: 'GI916' },
        { id: 1566, name: 'Mary-Jane "MJ" Macfarlane', factions: ['Conductors'], telegram: 'YJ981' },
        { id: 1599, name: '[Chief] Itukala Cook', nicknames: ['Itukala Wasicu', 'Wash'], factions: ['Wapiti', 'Sun Warriors'], leader: true },
        { id: 1600, name: 'Morgan "Dr. Morgan" Frazier', nicknames: ['Morgan Smith'], factions: ['Frazier Gang'], telegram: 'AF906' },
        { id: 1601, name: 'Todd A. Treacle' },
        { id: 1602, name: 'Juliet Duncan' },
    ],
    ShugrVT: [
        { id: 801, name: 'Mason Memphis' },
        { id: 1693, name: 'Vittoria Vitale' },
    ],
    Shyirasky: [
        { id: 730, name: 'Twitch Cooper', factions: ['The Ward'] },
        { id: 1581, name: '[Deputy] ? Wallace', factions: ['Law'], deceased: true },
        { id: 1886, name: '[Deputy] Harvey Chubs', factions: ['Law'] },
    ],
    SideshowSniper: [
        { id: 1864, name: 'Erick Riggs', assume: 'assumeOther' },
    ],
    Sidkriken: [
        { id: 731, name: 'Dane Swan', displayName: 2, factions: ['Independent', 'Guarma'], formerFactions: ['Law'], telegram: 'TT295' }, // Former Law
        { id: 732, name: 'Gator Weaver' },
        { id: 733, name: 'Odysseus Kain' },
        { id: 734, name: 'Mr. White', displayName: 0, telegram: 'JJ244' }, // TODO: Don't know first name
        { id: 1334, name: 'Buck Curlay' },
    ],
    sigynvina: [
        { id: 1933, name: 'Rhea Williams' },
        { id: 2057, name: 'Julia Thomas' },
    ],
    Sikacalling: [
        { id: 1562, name: 'Nelly Green' },
        { id: 1563, name: 'Esme Stone', telegram: 'QF845' },
        { id: 1574, name: 'Rebecca Parson', telegram: 'QD414' },
        { id: 2149, name: 'Callie Martin' },
    ],
    Silbullet: [
        { id: 735, name: '[Sr. Deputy] Shawn Maple', factions: ['Law'], telegram: 'OQ297' },
        { id: 736, name: 'Stefano Amendo' },
        { id: 737, name: 'Leopold Von Schitzen' },
        { id: 1051, name: 'Ronnie Rivers', factions: ['The Baastards'], telegram: 'YB719', deceased: true },
        { id: 1754, name: 'Ban Krobber', displayName: 0 },
        { id: 2188, name: 'Jimmy Whales', nicknames: ['Jimmy Milk'] },
        { id: 2410, name: 'Heinz Dickens', displayName: 2 },
    ],
    SilentSentry: [
        { id: 738, name: 'Emmet "Stripes" Wagner' },
    ],
    SincerelyIndie: [
        { id: 739, name: 'Truly Tillery' },
        { id: 1554, name: 'Sarabi Brownlee' },
        { id: 1590, name: 'Onélie Bourgeois', nicknames: ['Oni'], telegram: 'RU650' },
    ],
    SINCLVIR: [
        { id: 1984, name: 'Jack Sinclair' },
    ],
    SinCityReject: [
        { id: 1236, name: 'Milo Tremonti' },
    ],
    SinnixTv: [
        { id: 740, name: 'Frank Brower' },
        { id: 1110, name: 'Liam Decker' },
        { id: 1123, name: 'Micheal Spoondard', factions: ['Lifer'], deceased: true },
        { id: 1205, name: 'Ryder Whitlock' },
        { id: 1338, name: 'Daultin Curlay' },
        { id: 1577, name: 'Connor Acree' }, // Old character? Current streams seem to be VODs
    ],
    SirisVT: [
        { id: 741, name: 'Denise Neve' },
    ],
    SirSaltyBacon: [
        { id: 1249, name: 'Ducky Lloyd' },
    ],
    Skids_N_Cones: [
        { id: 742, name: '"Old Greg" Boone', nicknames: ['Old Greg'], displayName: 3 },
        { id: 743, name: 'Bear' },
        { id: 744, name: 'Henry "West"' },
    ],
    SkipGently: [
        { id: 1083, name: 'William "Bill" Bennett', nicknames: ['Bill The Baker'] },
    ],
    SkoogFFS: [
        { id: 745, name: 'Billy Joe Barber', nicknames: ['Billy Joe', 'BJB'], displayName: 5, factions: ['The Nameless'], telegram: 'JC921' },
        { id: 746, name: 'Lefty Lone' },
        { id: 747, name: 'Reidar Hagen' },
        { id: 1172, name: 'Frank Gilbani', telegram: 'KE425' }, // Former The Ring
    ],
    SLiMt: [
        { id: 748, name: 'Jimmy "Slim Jim" Slimper' },
    ],
    SmexyCarter: [
        { id: 1927, name: 'Emma Braithwaite' },
    ],
    smorgenborgendorgen: [
        { id: 749, name: 'Martha Crook' },
        { id: 1567, name: '[Deputy] Irma Kivi', factions: ['Law'], telegram: 'WE394' },
        { id: 2243, name: '\'Idi-Jyt\' Bjørnsdatter' }, // Is that a nickname?
    ],
    sneakyShadower: [
        { id: 750, name: 'Abigail Jones' },
        { id: 751, name: 'Azula Brooks' },
        { id: 752, name: 'Isabella Vautour', factions: ['Red Water'], telegram: 'GA464' },
        { id: 753, name: '[Deputy] Jackie Lockwood', factions: ['Law'] },
        { id: 754, name: 'Raven Bennett' },
        { id: 1766, name: '[Deputy] Arya Clark', factions: ['Law'], telegram: 'OY760' },
    ],
    SocialTortoise: [
        { id: 755, name: 'Billy Jackson' },
    ],
    Sock22: [
        { id: 756, name: 'Daniel "Danny" Moss' },
    ],
    SodaKite: [
        { id: 1035, name: 'Dorothy "Dot" Donovan' },
    ],
    SoftEzie: [
        { id: 2085, name: 'Benni Bones' },
    ],
    SolidSinn: [
        { id: 757, name: 'Carl Lawsen' },
        { id: 758, name: 'Jed Wicker', factions: ['Kettleman Gang'], deceased: true },
        { id: 759, name: 'Roger Thyne', telegram: 'GP238' },
        { id: 2374, name: 'Jeth ?' },
    ],
    SomethingBees: [
        { id: 760, name: 'Isla White', telegram: 'DF338' },
        { id: 761, name: 'Berdie Lloyd' },
        {
            id: 762,
            name: '[Undersheriff] Caitlyn Briggs',
            nicknames: ['McAlister', 'Cait', 'Cait McAlister', 'Cait Briggs', 'Briggs-McAlister'],
            factions: ['Law'],
            telegram: 'XP728',
        },
        { id: 763, name: 'Amarok' },
        { id: 2097, name: 'Robin Banks' },
        { id: 2224, name: 'Cian Mahony' },
        { id: 2348, name: 'Adelaide Finch', nicknames: ['Amarok', 'Lilith'], factions: ['Lost Souls'] },
    ],
    Sonneflower: [
        { id: 764, name: 'Eliana Diaz' },
        { id: 765, name: 'Jean Rivers' },
    ],
    Soulwalkah: [
        { id: 2036, name: 'Declan Dedrick' },
        { id: 2424, name: 'Jackson Walker' },
    ],
    Souza_Forseti: [
        { id: 1385, name: 'Tim Giffen', telegram: 'HE126' },
    ],
    SpaceAndromeda: [
        { id: 766, name: '[Sr. Deputy] Aoife McCarthy', factions: ['Law'], telegram: 'UU547' },
        { id: 767, name: 'Clarabelle Manson' },
        { id: 768, name: 'Cora Crow' },
    ],
    Spaceboy: [
        { id: 769, name: 'James Randal', nicknames: ['Jim Beef'] },
    ],
    Speckie_: [
        { id: 770, name: '[Deputy] Andrew Hamilton', factions: ['Law'] },
        { id: 771, name: 'Emmet Gray', factions: ['The Ward'] },
        { id: 772, name: 'James Parker' },
        { id: 773, name: 'Archie Richardson', factions: ['The Firm'] },
        { id: 1689, name: '[Deputy] Robert Younger', nicknames: ['Bobby'], factions: ['Law'], telegram: 'QE212' },
    ],
    Specklezzz: [
        { id: 2335, name: 'Dahlia Sawyer' },
    ],
    Sperrey: [
        { id: 2352, name: 'Rick Brown' },
    ],
    spicybackpain: [
        { id: 774, name: 'Pepper Jackson' },
        { id: 775, name: 'Tormund Kray' },
    ],
    spiffiness: [
        { id: 1977, name: '[Sr. Ranger] Justine Leroux', factions: ['Rangers'] },
    ],
    split_uni: [
        { id: 1007, name: 'Koho ?', nicknames: ['Fox'], factions: ['Red Water'], telegram: 'JE142' }, // Former Summers Gang
        { id: 1033, name: 'Bai Li Huang', nicknames: ['Bai Li'], displayName: 4, factions: ['Taipan'] },
        { id: 1076, name: 'Gabriel Gashade', displayName: 2, factions: ['Conductors'], telegram: 'RE223' },
        { id: 1208, name: 'Payton Bell', factions: ['Bell Gang'], deceased: true },
        { id: 1453, name: 'Rio ?', factions: ['Del Lobos'], telegram: 'PO419' },
    ],
    Spoofey: [
        { id: 1354, name: 'Enola Quil', telegram: 'IX263', factions: ['Quil Gang'], deceased: true },
        { id: 1716, name: 'June Joy Foxx', nicknames: ['Niece of the West'], factions: ['Kelly Gang'] }, // Birthname is June Joy Foxx, but has been going by June Joy Divine-Lang recently
        { id: 1727, name: 'Opal Foxx' },
        { id: 1728, name: 'Elizabeth "Lizzy" O’Hara', factions: ['Guarma'], telegram: 'AJ333' },// Guarma Guarda
    ],
    sporkerific: [
        { id: 776, name: 'Rosamaria Sandoval' },
    ],
    SprayNprayErik: [
        { id: 777, name: 'Butch Marlow', factions: ['Hagen'] },
    ],
    spriteleah: [ // LEAH alt
        { id: 778, name: '[Sr. Deputy] Francesca "Frankie" Bright', factions: ['Law'], telegram: 'GG190', deceased: true },
        { id: 779, name: 'Harriet "Hawk" Hawkins', factions: ['Red Water'], telegram: 'JV256', deceased: true }, // Former Summers Gang
        { id: 780, name: 'Brie Haviour' },
        { id: 2259, name: 'Ruthie Samuels' },
        { id: 2053, name: 'Ally Ramsey' },
        { id: 2054, name: 'Sierra "Sisi" Castillo', factions: ['Del Lobos'], telegram: 'LS438' },
        { id: 1665, name: 'Margo Rush', telegram: 'ZW004' },
        { id: 2055, name: 'Aoibh O’Connor', factions: ['Pruitt Gang'] },
        { id: 2056, name: '[Sheriff] Guinevere Wilde', nicknames: ['Gwen'], factions: ['Law'] },
    ],
    Sput: [
        { id: 782, name: 'Marvin Mayflower' },
        { id: 980, name: 'Biwwy Baker' },
    ],
    squareiz: [
        { id: 783, name: 'Eddy Doyle', nicknames: ['Ed'], deceased: true },
        { id: 979, name: 'Moe McQueen', telegram: 'SV286' },
        { id: 983, name: 'Malaha Mage' },
        { id: 1185, name: 'Monica McMonigal' },
        { id: 1416, name: 'Paddy Doyle', telegram: 'DS872', deceased: true },
        { id: 1687, name: 'Dolly Donald' },
        { id: 1688, name: 'Zara Fernandez' },
        { id: 1831, name: 'Angus Fraser' },
    ],
    squeakinghiccups: [
        { id: 1524, name: 'Sheila O’Kelly', factions: ['Independent', 'Guarma'] },
        { id: 1724, name: '[Deputy] Penny Wallace', nicknames: ['Penny Shipman', 'Wallace Shipman'], factions: ['Law'], telegram: 'VN087' },
        { id: 1725, name: 'Dwight "Dodge" Hayes' },
        { id: 2453, name: '[Deputy] Sheila O’Kelly', factions: ['Law'], deceased: true },
    ],
    Ssaab: [
        { id: 784, name: 'Sam Baas', factions: ['The Baastards'], leader: true, nicknames: ['Dank Outlaw', 'Sam Christ'], deceased: true, telegram: 'YB638' }, // Former Sam's Club. leader of Sam's Club
        { id: 785, name: 'Ali Baba', displayName: 0 },
        { id: 786, name: '[Deputy] Leo Slacks', nicknames: ['Golden Boy'], factions: ['Law'], telegram: 'EO787', deceased: true },
        { id: 1295, name: 'Charles "CD" Divine', telegram: 'FA344', factions: ['The Baastards'], deceased: true },
        { id: 2408, name: 'Thomas Dickens' },
    ],
    Ssmacky: [
        { id: 787, name: 'Jackson Marsh' },
    ],
    StarBarf: [
        { id: 788, name: 'Elich Doherty' },
        { id: 1610, name: 'Nicki Bastogne' },
    ],
    StarBoyDusk: [
        { id: 2075, name: 'Silas Crow' },
    ],
    stardaze: [
        { id: 789, name: '[Deputy] Edie Barlowe', telegram: 'KW564', factions: ['Law'] },
        { id: 1462, name: 'Rook Pierce', factions: ['Red Water'], telegram: 'SM528' },
    ],
    StardustScale: [
        { id: 2331, name: 'Rosemary Halifax' },
        { id: 2336, name: 'Ethel Reaves' },
    ],
    start_vx: [
        { id: 1238, name: 'Garneesh Tandoori', telegram: 'LL642' }, // Former The Ring
    ],
    SteelRain27: [
        { id: 790, name: 'Moses Maddox' },
    ],
    Steffany686: [
        { id: 1616, name: 'Ember Shaw' },
    ],
    stenchserpow: [
        { id: 1426, name: 'Joseph "Hobo Joe" Quinn', factions: ['The Strays'], telegram: 'MV078' },
    ],
    Stichboy: [
        { id: 791, name: 'Jeremiah Smoak' },
    ],
    Stork1e: [
        { id: 1151, name: 'Enrique Hernandez' },
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
        { id: 797, name: '[Sheriff] Hudson Hart', factions: ['Law'], telegram: 'XH213' },
        { id: 798, name: 'Kevin Higgins' },
        { id: 799, name: 'Mackenzie Kale' },
        { id: 800, name: 'Boyd Banks', deceased: true },
    ],
    sulleyc: [
        { id: 1164, name: 'Raylan "Ray-Ray" Goggins', nicknames: [reg(/\bray(?:\-|\s*)ray\b/)], factions: ['Conductors'] },
        { id: 1169, name: '[Deputy] Black Sky', displayName: 0, factions: ['Law'], telegram: 'OT409' },
        { id: 1392, name: 'John-Michael Douglas' },
        { id: 1410, name: 'Santiago "Santi" Velasquez', factions: ['Del Lobos'], telegram: 'KY343' },
        { id: 1954, name: 'Dee O’Hara', factions: ['Pruitt Gang'] },
        { id: 2261, name: '[Deputy] Hank Hammer', factions: ['Law'] },
        { id: 2409, name: 'Domingo "El Domingo" Ruiz' },
    ],
    sultrywurm: [
        { id: 2035, name: 'Aurore Hopefield' },
    ],
    Sveo0: [
        { id: 1133, name: 'Miguel Garcia', factions: ['Del Lobos'] },
    ],
    sweetcraw: [
        { id: 802, name: 'Joey Crawford', telegram: 'UQ998', deceased: true },
        { id: 803, name: 'Ephraim Teller' },
        { id: 1096, name: 'Robert "Rob" Banks' },
        { id: 1326, name: 'Kip Smith' },
        { id: 1584, name: 'Marshall Lee' },
        { id: 1635, name: '[Deputy] Ollie Cooper', factions: ['Law'], telegram: 'CL140' },
        { id: 1840, name: 'Gilbert Kriger', deceased: true },
        { id: 2131, name: 'Mickey McGee' },
    ],
    Swordofpower1: [
        { id: 1244, name: 'Jim "Lockjaw Jim" Munson', factions: ['Independent', 'Guarma'], telegram: 'OT144', deceased: true },
        { id: 1262, name: 'Charlie "Chucky" Nelson', telegram: 'FW010' },
        { id: 1335, name: 'Sylvester Spectre' },
        { id: 1704, name: 'Lawrence Belcher' },
        { id: 1746, name: 'Johannes Annesburg' },
        { id: 1881, name: 'Javier De La Cruz', telegram: 'NP419' },
    ],
    Sylasism: [
        { id: 804, name: 'Atty Windward' },
        { id: 805, name: 'Franklin Czepanski' },
        { id: 806, name: 'Bartleby Sinclair' },
        { id: 1131, name: '[Ranger] Sue Stout', factions: ['Rangers'] },
    ],
    SyneDax: [
        { id: 1152, name: 'Claire MacCabe' },
    ],
    Syraphic: [
        { id: 807, name: 'Emilia "Emi" Song' },
    ],
    TacticalGH0STT: [
        { id: 808, name: '[Ranger] Beaux Carter', factions: ['Rangers'], telegram: 'EU031' },
        { id: 1210, name: 'Odell Simmons', factions: ['Lifer'] },
        { id: 1267, name: 'Germain Cyr', displayName: 2, telegram: 'PF391', factions: ['Freeman Family'] },
    ],
    TaintedRUMBLER: [
        { id: 809, name: 'Drew Peters', telegram: 'MT042', assume: 'assumeOther' },
        { id: 2390, name: 'Lenny Lawson' },
    ],
    TalkingRecklessPodcast: [
        { id: 810, name: 'Jeremiah Rent' },
    ],
    talon03: [
        { id: 1077, name: '[Sr. Doctor] Eoghan McConnell', factions: ['Medical'], telegram: 'MI070' },
        { id: 1095, name: 'Casey Banks' },
        { id: 1283, name: '[Sr. Deputy] Richard Pointer', factions: ['Law'], telegram: 'OQ417' },
    ],
    TankGirl: [
        { id: 811, name: 'Effie Mae Braithwaite', deceased: true },
        { id: 812, name: 'Gloria Bonanno' },
        { id: 1165, name: '[Warden] Hattie Booker', factions: ['Sisika Guard'], displayName: 2 },
        { id: 1911, name: 'Seraphina Braithwaite' },
        { id: 2050, name: 'Harry ?' },
    ],
    tanklovesyou: [
        { id: 813, name: 'Ethan Cross' },
        { id: 814, name: 'Eugene Goodman' },
        { id: 815, name: '[Deputy] Jean-Pierre Lefrancois', factions: ['Law'] },
        { id: 816, name: 'Julius Bradshaw', nicknames: ['The Jade King'], telegram: 'RU989' },
        { id: 817, name: '[Marshal] Rico Ortega', nicknames: ['Deputy Marshal'], factions: ['Law'], telegram: 'CH119' }, // Deputy Marshal
        { id: 1257, name: 'Ming Yat-Sen' },
    ],
    Tannoyed: [
        { id: 2321, name: 'Barles Bung' },
    ],
    Taranix: [
        { id: 818, name: '[Ranger] Mattias Temble', factions: ['Rangers'], telegram: 'IR372' }, // LOA from Rangers
    ],
    Tasara22: [
        // Characters as of 12/26/2022: https://clips.twitch.tv/SilkyJoyousDinosaurBloodTrail-E0KXK8TIG_hbf3F3
        { id: 819, name: '[Sr. Deputy] Jane Ripley', factions: ['Law'], deceased: true, telegram: 'SG824' },
        { id: 820, name: 'Elizabeth "Betty" Moretti', nicknames: ['Betty Butcher'], deceased: true, telegram: 'ZK132' }, // Former DiCenzo (group 2)
        { id: 821, name: 'Madame Milena', deceased: true }, // Unsure deceased or just inactive
        { id: 822, name: 'Monica Peach', deceased: true }, // Unsure deceased or just inactive
        { id: 823, name: 'Oneida Zonta', deceased: true }, // Unsure deceased or just inactive
        { id: 824, name: 'Precious Cargo', factions: ['10 Tonne Gang'], deceased: true },
        { id: 825, name: 'Gertrude Nelson', formerFactions: ['Law'], deceased: true }, // Former Sheriff, Unsure deceased or just inactive
        { id: 1092, name: 'Mercy Porter', deceased: true }, // Unsure deceased or just inactive
        { id: 1111, name: '[Guard] Angela Payne', factions: ['Sisika Guard'], deceased: true }, // Unsure deceased or just inactive
        { id: 1129, name: 'Jasmine Baro', factions: ['Independent', 'Guarma'] },
        { id: 1621, name: 'Wendy Wallace' },
        { id: 1622, name: 'EmmaLee Strawberry' },
        { id: 1623, name: '[Guard] Katrina Moysov', factions: ['Sisika Guard'] },
        { id: 1975, name: '[Deputy] Mary Dalloway', factions: ['Law'] },
        { id: 2100, name: 'Persephone Sacdecash', nicknames: ['Persephone Fising'] },
        { id: 2267, name: 'Delores "La Delfina" Pintado' },
        { id: 2268, name: '[Guard] Virginia Briscoe', factions: ['Sisika Guard'] },
        { id: 2420, name: 'Luella Huneke' },
        { id: 2269, name: 'Chilali "Storm Touched" ?' },
        { id: 2340, name: 'Monika Strange' },
        { id: 2341, name: 'Ernestine "Smokey Erns" Farwell' },
        { id: 2342, name: '[Guard] Mirabelle Boudreaux', factions: ['Sisika Guard'] },
    ],
    TattooedDude: [
        { id: 2138, name: 'Harvey Hill', factions: ['Bluestone'] },
        { id: 2389, name: 'Wayne Castle' }, // Doherty Gang
    ],
    Tech_Otter: [
        { id: 826, name: 'Chester McGuckin' },
        { id: 827, name: 'Nathan Riggs' },
    ],
    technic_btw: [
        { id: 1214, name: 'Charlie VanDyne' },
    ],
    TehJamJar: [
        { id: 828, name: 'Alvin Biggs' },
        { id: 829, name: 'Dwight Bridger', displayName: 2, factions: ['The Humble Bunch'] },
        { id: 830, name: 'Klaus Pudovkin', telegram: 'DL670' },
        { id: 831, name: 'Luke Colton', factions: ['Coltons'] },
    ],
    tessvalkyrie: [
        { id: 1203, name: 'Molina Larken', assume: 'assumeOther' },
        { id: 1216, name: 'Bertha Makowitz', nicknames: ['Big Bertha'], displayName: 3 },
    ],
    Thadrius: [
        { id: 832, name: 'Jimmy Frick' },
    ],
    thatguysli: [
        { id: 2346, name: 'John "Clay" Henry' },
    ],
    thatmattlive: [
        { id: 556, name: 'Dan Gerous' },
    ],
    thatrouge: [
        { id: 1075, name: 'Warren Clunes' },
    ],
    ThatStickyTickle: [
        { id: 975, name: 'Dustin Barlowe' },
    ],
    The_Beautiful_Void: [
        { id: 836, name: '[Medic] Katherine "Kate" Byrne', factions: ['Medical'], telegram: 'HY310' },
    ],
    The_Clown_Slayer: [
        { id: 2247, name: 'Drin Hoxha' },
    ],
    The_Devils_Son: [
        { id: 837, name: 'Fredrick Smythe' },
    ],
    The_Fezgig: [
        { id: 2318, name: 'Edgar Spitszer' },
    ],
    The_Hug_Dealer: [
        { id: 1276, name: 'Obediah Greye', assume: 'assumeOther' }, // Preacher
    ],
    The_Jadles: [
        { id: 1947, name: 'Benjin Maples' },
        { id: 2027, name: '[Medic] Joshua Margot', factions: ['Medical'] },
    ],
    The_Metro_Man1: [
        { id: 838, name: 'Jim Sky' },
        { id: 839, name: 'Felix Nileson' },
        { id: 840, name: 'Henry ColeSlaw' },
        { id: 841, name: 'Millard Van Dough' }, // TODO: Confirm last name
        { id: 1963, name: 'Lenny Tinklebottom' },
    ],
    The_Mountain_Troll: [
        { id: 842, name: 'Basey "Red" Bohannon' },
    ],
    the_sea_four: [
        { id: 1393, name: 'Ellie Gator', assume: 'assumeOther' },
    ],
    the_spaceshaman: [
        { id: 1093, name: 'Malcom Irvine' }, // Former Sr Ranger? No longer on ranger roster.
    ],
    TheAaronShaq: [
        { id: 843, name: 'Kenneth "Ricky" Randall' },
        { id: 844, name: 'Wesley Spats' },
        { id: 1088, name: 'Donna ?' },
        { id: 1100, name: 'Bob Roberts' },
        { id: 1853, name: '[Deputy] Winston Spats', factions: ['Law'] },
        { id: 2176, name: 'Gordon Lurch', nicknames: ['Uncle Gordon'], displayName: 3, factions: ['Perma Trail'], deceased: true },
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
    TheBigMeech: [
        { id: 2169, name: 'Casey Simmons', factions: ['Perma Trail'] },
    ],
    TheBuffett: [
        { id: 1713, name: '[Deputy] Rose Smith', factions: ['Law'] },
        { id: 1913, name: 'James Buffett' },
    ],
    TheChief1114: [
        { id: 996, name: 'Jimmy "Toad" Blister' },
        { id: 1020, name: 'Clyde Fraiser' },
    ],
    TheCocacolafreak: [
        { id: 851, name: 'Clint "Busty Danger" David' },
        { id: 852, name: 'Ernst Schneider' },
        { id: 853, name: 'Javier Moreno' },
        { id: 854, name: 'Thomas Schneider', nicknames: ['Butcher Of Berlin'] },
        { id: 855, name: 'W. J. Patterson' },
        { id: 1397, name: 'Reuben Roberts', factions: ['10 Tonne Gang'], telegram: 'OW044' },
    ],
    TheCourtJester: [
        { id: 856, name: 'Dr. Nikolai' },
    ],
    TheDasTony: [
        { id: 857, name: 'Antonio "Tony" Salerno', factions: ['DiCenzo Famiglia'], telegram: 'RR471' },
    ],
    thedopemaster93: [ // Ssaab alt
        { id: 1501, name: '[Deputy] Leo Slacks', nicknames: ['Golden Boy'], factions: ['Law'], telegram: 'EO787', deceased: true },
        { id: 1502, name: 'Charles "CD" Divine', telegram: 'FA344', factions: ['The Baastards'], deceased: true },
        { id: 1734, name: 'Sam Baas', factions: ['The Baastards'], leader: true, nicknames: ['Dank Outlaw', 'Sam Christ'], deceased: true, telegram: 'YB638' }, // Former Sam's Club. leader of Sam's Club
        { id: 1735, name: 'Ali Baba', displayName: 0 },
        { id: 2407, name: 'Thomas Dickens' },
    ],
    TheFlipFlopKing: [
        { id: 1413, name: 'Dexter McGavin' },
    ],
    TheFoodcartGamer: [
        { id: 858, name: 'Felix Ellis' },
    ],
    TheForerunner: [
        { id: 859, name: 'Nico Aventi', telegram: 'OE697' },
    ],
    TheGawkyGoat: [
        { id: 860, name: 'Cillian McCarty' },
        { id: 1759, name: 'Alexi "Al" Heller', telegram: 'IT580' },
        { id: 1760, name: 'Marti ?', telegram: 'QT599' },
    ],
    TheGeneralSmokey: [
        { id: 861, name: 'Edwin Braithwaite', nicknames: ['Eddie', 'Eddie Braithwaite', 'Prisoner 462503', '462503'], factions: ['Dead End Gang'], formerFactions: ['Kettleman Gang'], telegram: 'WZ827' },
        { id: 1737, name: 'Emmett Braithwaite', deceased: true },
        { id: 2101, name: '[Recruit] Gerry Murphy', factions: ['Rangers'], deceased: true },
        { id: 2320, name: 'Leroy ?' },
        { id: 2382, name: '[Cadet] Otis Lee', factions: ['Law'] },
    ],
    TheGoldenDunsparce: [
        { id: 1317, name: 'Ngu Daeng', telegram: 'KG865' },
        { id: 1318, name: 'Hmee Noi' },
    ],
    TheHairyCelt: [
        { id: 863, name: 'Ronnie Hurbert', factions: ['The Firm'], telegram: 'EW576', deceased: true },
        { id: 1762, name: 'Joseph Gunn', nicknames: ['James'] },
        { id: 1787, name: 'Rab Connor' },
        { id: 1829, name: 'Shawn Dugmore' },
        { id: 1900, name: 'Bernard Chesterfield' },
    ],
    TheHardcorian: [
        { id: 864, name: 'Edgar Buckle' },
        { id: 865, name: 'Bill Hill' },
        { id: 866, name: 'Lucius Thorn' },
        { id: 867, name: 'Pope Langer' },
        { id: 868, name: 'Ron Bryer' },
        { id: 869, name: '[Deputy] William Campbell', factions: ['Law'], telegram: 'JW452' },
    ],
    TheHomeBreweryTV: [
        { id: 1098, name: 'Bruce Blaze' },
    ],
    theimmortalkoala: [
        { id: 2428, name: 'Kate Smith' },
    ],
    TheJasonPhoenix: [
        { id: 870, name: 'Fenix Hayston' },
        { id: 871, name: '[Deputy] John Claymore', factions: ['Law'] },
    ],
    theLGX: [
        { id: 872, name: 'Abner Ace', telegram: 'ZO730' },
        { id: 2172, name: 'Theodore "Teddy" Ambrose', factions: ['Perma Trail'], deceased: true },
    ],
    themightycaveman: [
        { id: 1047, name: 'Franklin Jones' },
        { id: 2126, name: 'Venezio Gatto' },
    ],
    TheOrchid_: [
        { id: 2289, name: 'Crosby O’Neil' },
    ],
    ThePatrician69: [
        { id: 875, name: '[Deputy] Nate Casey', factions: ['Law', 'Bluestone'], formerFactions: ['Kelly Gang'], telegram: 'AV925' },
        { id: 1680, name: 'Jesse Clay' },
        { id: 2070, name: 'Aaron Lee' },
    ],
    TheRandomChick: [
        { id: 876, name: '[Sr. Doctor] Bella Trix', nicknames: ['Bellatrix'], displayName: 3, factions: ['Medical'], telegram: 'OA974' },
        { id: 877, name: '[Sr. Reporter] Poppet Deveaux', nicknames: ['Caroline'], factions: ['News'], telegram: 'QQ766' },
        { id: 1182, name: '[Guard] Mae Daye', factions: ['Sisika Guard'] },
        { id: 2121, name: 'Piper Pettigrew' },
    ],
    TheRudyDuck: [
        { id: 986, name: 'Phineas "Phi" Klein', telegram: 'VI890', factions: ['Conductors'] },
    ],
    TheSaucePacket: [
        { id: 2046, name: 'Burt Bolton' },
        { id: 2052, name: 'Charlie "Cactus" Walker' },
        { id: 2220, name: 'Quin Meriweather' },
    ],
    TheSlappyOne: [
        { id: 878, name: '[Deputy] Marcus Hutchinson', factions: ['Law'], telegram: 'GJ659', assume: 'assumeOther' },
        { id: 2376, name: 'Jonathan Bannister' },
    ],
    TheSmile__: [
        { id: 1320, name: 'Heinrich "Hank" Boltz' },
    ],
    TheStreetMagnet: [
        { id: 879, name: 'Josiah Shepard' },
    ],
    TheTofuSamurai: [
        { id: 880, name: 'Jimothy James' },
        { id: 881, name: 'John Crath' },
        { id: 978, name: 'Charles Haberdash' },
    ],
    theValiance: [
        { id: 1011, name: 'James Roush', formerFactions: ['Law'], telegram: 'NE915' }, // Former Deputy
        { id: 1386, name: 'Randy Beaver' },
        { id: 1692, name: 'Hector Suarez', factions: ['Del Lobos'], telegram: 'CZ571' },
    ],
    theWhimsicalWizard: [
        { id: 2250, name: 'Charlotte "Lottie" Ellsworth' },
    ],
    TheWltchDoctor: [
        { id: 1448, name: 'Sam Bell', factions: ['Bell Gang'] },
        { id: 1597, name: 'Michael Rowe' },
    ],
    TheZenPunk: [
        { id: 883, name: 'William "Wild Willy" Brown' },
    ],
    ThicciusMaximus: [
        { id: 1307, name: 'Sebastian Davis', telegram: 'ZN969' },
        { id: 1743, name: 'Isaac Tristan' },
        { id: 2104, name: 'Lee Nicholas' },
    ],
    ThinkingQuill: [
        { id: 884, name: 'Cian Malloy' },
        { id: 885, name: 'Hymnal Smed' },
        { id: 886, name: 'Elliot Teller' },
    ],
    Thio: [
        { id: 1898, name: 'Rusty Rankstank' },
        { id: 2183, name: 'Rock Cactus', factions: ['Perma Trail'], deceased: true },
    ],
    thirdradius3: [
        { id: 1587, name: '[Ranger] Nathan Yang', factions: ['Rangers'], telegram: 'QL554' },
        { id: 1594, name: 'Georgie Conlin' },
    ],
    ThrallJo: [
        { id: 888, name: 'Corvus Clements' },
    ],
    ThrillerInstinct: [
        { id: 1526, name: 'Jeb Longwater' },
        { id: 1527, name: 'Willard Carmine' },
    ],
    Tilkymits: [
        { id: 2349, name: 'Margaret Delongpre', nicknames: ['Mags', 'Maggie'], factions: ['Woods Gang'] },
        { id: 2350, name: 'Hope ?', factions: ['Lost Souls'] },
    ],
    TilLuxx: [
        { id: 1179, name: '[Medic] Mara Gloom', factions: ['Medical'], telegram: 'GB639' },
        { id: 1237, name: '[Cadet] Til Lux', factions: ['Law'], telegram: 'GW137' },
        // { id: 1500, name: 'Celeste Demeter' }, // Is this a WildRP Character? Or Saints & Sinners?
    ],
    TiltedKr0w: [
        { id: 2401, name: 'Nathan Faraday' },
        { id: 2403, name: 'Sam Rivers' },
    ],
    TiltedSun: [
        { id: 889, name: 'Madison "Maddy" Windward', factions: ['Bluestone'], telegram: 'RT946' },
        { id: 890, name: 'Clem Griffiths', nicknames: ['Isa'], factions: ['Daughters of Fenrir'], telegram: 'MK095' },
        { id: 1207, name: 'Tessa Zachariah', factions: ['Miles Gang'] },
        { id: 1723, name: '[Sr. Deputy] Eli Vasiliev', factions: ['Law'], telegram: 'LG843' },
        { id: 2034, name: 'Jingyi "Jin" Palmer' },
    ],
    Timmac: [
        { id: 891, name: 'Gomer Colton', factions: ['Coltons'] },
        { id: 892, name: 'Enzo Valentino' },
    ],
    TimtimarooTX: [
        { id: 1382, name: 'Lloyd Pierce', telegram: 'PP379' },
        { id: 2040, name: 'Emmett Throckmorton' },
    ],
    TinySpiritFox: [
        { id: 2293, name: 'August Greene' },
    ],
    tmcrane: [
        { id: 893, name: 'Lucius Bickmore' },
        { id: 894, name: 'Alfred Kidd' },
    ],
    Tmparro01: [
        { id: 1580, name: '[Deputy] Rubin Wiley', factions: ['Law'], telegram: 'SW311' },
    ],
    TnFD: [
        { id: 895, name: 'Julian Charleston', telegram: 'NM481' },
        { id: 1860, name: 'Joshua Johnson' },
    ],
    ToneeChoppa: [
        { id: 896, name: 'Antonio Borges' },
    ],
    Tonixion: [
        { id: 897, name: 'Howard Purdnar', assume: 'assumeOther' },
        { id: 898, name: '[Deputy] Solomon Graves', factions: ['Law'] },
        { id: 2215, name: 'Julius Roth' },
        { id: 2397, name: '[Guard] Leonardo Aldrich', displayName: 2, factions: ['Sisika Guard'] },
    ],
    toodlehausn: [
        { id: 899, name: 'Adelae "Ada" Wright' },
        { id: 900, name: '[Nurse] Sadie Stronge', factions: ['Medical'] },
        { id: 901, name: 'Mary Rassler', nicknames: ['Old'] },
        { id: 1191, name: 'Odie "Jen" Moore' },
    ],
    topspin17: [
        { id: 1008, name: 'Archie Stonewall', telegram: 'BB139' },
        { id: 1060, name: 'Alvin Caster', factions: ['Dead End Gang'], telegram: 'GG577' },
        { id: 1360, name: '[Deputy] Don Deters', telegram: 'AM073', factions: ['Law'] },
        { id: 1561, name: 'Hershall Herbstreet' },
        { id: 1729, name: 'Chev Silver' },
        { id: 1795, name: 'Bryce Wilkins' },
        { id: 2242, name: 'Bo Hawkins' },
        { id: 2254, name: 'Janet Victoria' },
    ],
    TorradPlays: [
        { id: 2426, name: 'Levi Cordell' },
        { id: 2427, name: 'John Rossi' },
    ],
    TorreyAdorey: [
        { id: 2379, name: 'Elena Garcia' },
        { id: 2380, name: 'Ani McKray' },
    ],
    TortillaTheHunTV: [
        { id: 1288, name: '[Medic] Dugold Little', factions: ['Medical'] },
        { id: 1289, name: 'Rodrigo Estrada' },
        { id: 1293, name: 'Llewellen Wood' },
        { id: 2102, name: 'Lem Bodean' },
    ],
    TotallyAFanTAF: [
        { id: 1912, name: 'Mario Rojas', assume: 'assumeOther' },
    ],
    Trader_Nicky: [
        { id: 1694, name: 'Thomas Callahan' },
    ],
    travpiper: [
        { id: 902, name: 'William "Bill" Gunner', nicknames: ['Carlos Sanchez', 'Carlos'] },
    ],
    Trenchmouth: [
        { id: 1458, name: 'Husky Tarbox', factions: ['Dead End Gang'], deceased: true },
        { id: 1516, name: 'Barkley Oglethorpe' },
        { id: 1572, name: 'Herbie Coltrane', factions: ['Independent', 'Guarma'] },
    ],
    Trincaria: [
        { id: 1570, name: 'Henrietta Callaghan', factions: ['Conductors'], telegram: 'VJ944' },
        { id: 1756, name: 'Flo ?' },
    ],
    Tringee: [
        { id: 2391, name: 'Tann Blackwood' },
    ],
    tsunpapi: [
        { id: 1407, name: 'Felix Meyers', telegram: 'RJ703', assume: 'assumeOther' },
    ],
    TTVActivi5t: [
        { id: 1969, name: 'Danny Ward' },
    ],
    tulkas_tv: [
        { id: 1855, name: 'Salvatore Brusco' },
    ],
    TullyCuffs: [
        { id: 903, name: 'Hugo Hopper' },
    ],
    Two_Beans_2B: [
        { id: 904, name: 'Dieter Krankenkasse' },
        { id: 905, name: 'Hawthorne Sapling' },
        { id: 906, name: 'Jonathan Badtmann' },
    ],
    tys0nnnnn: [
        { id: 1037, name: 'Kinley Round' },
    ],
    UberHaxorNova: [
        { id: 907, name: 'Rooporian Roo', factions: ['Independent', 'Guppy Gang'], displayName: 2 },
    ],
    UberJazer: [
        { id: 908, name: 'Nahmala "Wolf" Wolfe', telegram: 'ZM109', assume: 'assumeOther' }, // Wapiti?
        { id: 1315, name: 'Tamar Truner' },
        { id: 1411, name: 'Yandago\'a\' Yates' },
    ],
    Ukrainy_: [
        { id: 909, name: 'Willie Reuben' },
    ],
    uncledirtbag: [
        { id: 1025, name: 'Jason Maynard', telegram: 'GG954' },
        { id: 1026, name: 'Henry Dahlman' },
        { id: 1055, name: 'Rhett Sawyer', telegram: 'VP405' },
        { id: 1136, name: 'Theodore Hammond' },
        { id: 1250, name: '[Deputy] Robert Herrera', factions: ['Law'] },
        { id: 1442, name: '[Undersheriff] Wyatt Schaffer', factions: ['Law'], telegram: 'FU564' },
        { id: 1775, name: 'Pierre Rodgers' },
        { id: 1806, name: 'Amarok' },
    ],
    unstoppableLARN: [
        { id: 910, name: 'Gertrude Cockburn' },
        { id: 911, name: 'Razormouth' },
        { id: 912, name: 'Terry Hogan' },
    ],
    Utael: [
        { id: 1617, name: 'Corey Klein' },
    ],
    valenam: [
        { id: 915, name: 'Laura Flores' },
        { id: 1751, name: 'Yuri Park', factions: ['Taipan'], telegram: 'OW714' },
        { id: 2119, name: '[Deputy] Carmen Sansol', displayName: 1, factions: ['Law'] },
    ],
    ValenVain: [
        { id: 916, name: 'Salazar Fisk' },
    ],
    valkyrionrp: [
        { id: 917, name: 'Jack Volker' },
    ],
    valthebritish: [
        { id: 1298, name: 'Nicodemo Monteleone' },
    ],
    Vantilles: [
        { id: 994, name: '[Sheriff] John Beckwith', factions: ['Law'], telegram: 'XA388' },
        { id: 1460, name: '? "Flood" ?', factions: ['Dead End Gang'], telegram: 'SC651' },
    ],
    Vaughtex: [
        { id: 992, name: 'Henry Laveer', telegram: 'QO153' },
        { id: 1048, name: 'Bubba Linton' },
        { id: 1049, name: 'Kevin Sloop', nicknames: ['Big Kev'] },
    ],
    VellamoSwift: [
        { id: 1284, name: 'Alice Jinks' },
        { id: 1456, name: 'Alice Lungsford', factions: ['The Firm'] }, // Same character as Alice Jinks? Old stream titles use “Jinks,” but unclear
    ],
    Versa: [
        { id: 918, name: 'Carlo Marciano', factions: ['DiCenzo Famiglia'], telegram: 'XX125' }, // Former Fantoni Crew
    ],
    VERTiiGOGAMING: [
        { id: 919, name: '[Deputy] Boyd Kerrigan', factions: ['Law'], telegram: 'KY857', deceased: true }, // Former Kerrigan Ranch
        { id: 920, name: 'Richard "The Wallaby Kid" Eastwick', nicknames: ['Joey Johns'], factions: ['Dead End Gang'], telegram: 'NS591' },
        { id: 921, name: '[Cadet] Les Darcy', factions: ['Law'] },
        { id: 922, name: 'Bazz Kerrigan', factions: ['Kettleman Gang'], deceased: true }, // leader of Kerrigan Ranch
        { id: 923, name: 'Clarence McCloud' },
        { id: 1117, name: 'Steve "The Dude" McAnderson', deceased: true },
        { id: 1401, name: '? Rudd', nicknames: ['Rev. Rudd'], displayName: 3 }, // Clergy
        { id: 2262, name: 'Terence "Terry" Kerrigan' },
    ],
    vexion03: [
        { id: 2386, name: 'Vash Campbell' },
    ],
    VinnieThatsMe: [
        { id: 1511, name: 'Ahnah Adjuk', factions: ['Wapiti', 'Sun Warriors'] },
        { id: 1642, name: 'Indigo "Indy" Riley', telegram: 'XM689' },
        { id: 1643, name: 'Mirai Lee' },
        { id: 1644, name: 'Delilah Tucker' },
        { id: 1645, name: 'Tahoma Desert Wolf', nicknames: ['Desert Wolf'] },
    ],
    virtus: [
        { id: 1618, name: 'Dallas McKinney' },
        { id: 1619, name: 'Theodore Tubwiggle' },
    ],
    vishnyaxx: [
        { id: 2297, name: 'Harriette Lovett', deceased: true },
        { id: 2317, name: 'Esther Reaves', deceased: true },
    ],
    Viviana: [
        { id: 924, name: 'Mary Anne LeStrange' },
    ],
    voytheboi: [
        { id: 1579, name: 'Red ?', factions: ['Del Lobos'] }, // Del Lobos associate
        { id: 1582, name: '[Sr. Deputy] Noah Shaw', factions: ['Law'] },
        { id: 1924, name: 'July Gray' },
    ],
    VTM___: [
        { id: 925, name: 'Boone Morales', factions: ['Guarma'], telegram: 'JG239', assume: 'assumeOther' }, // Guarma Guarda
        { id: 926, name: 'Guy Hyneman' },
    ],
    vtrich: [
        { id: 927, name: 'Fester Buckland' },
        { id: 1059, name: 'Jean Claude', assume: 'assumeOther' },
        { id: 2135, name: 'Marty McClaws' },
        { id: 2288, name: '[Cadet] Jim Hollister', factions: ['Law'] },
    ],
    WackyTally: [
        { id: 1931, name: 'Paxton Wagy' },
        { id: 2245, name: 'Georgia Musgrove' },
        { id: 2383, name: '[Recruit] Guy Caputo', factions: ['Rangers'] },
    ],
    WaistcoatDave: [
        { id: 928, name: 'Dr. C.J Matthews' },
        { id: 1530, name: 'Lucas Black' },
    ],
    walnutcast: [
        { id: 1072, name: 'Regal Julius' },
        { id: 2195, name: 'Adrian Monk' },
    ],
    WANTED_MANIAC: [
        { id: 929, name: 'Brian Wright', formerFactions: ['Law'] }, // Former Senior Deputy
        { id: 930, name: 'Taylor Hicks', factions: ['Red Water'], deceased: true }, // Former Summers Gang
        { id: 931, name: 'William "Bill" Carver' },
        { id: 932, name: 'Benji Bell', factions: ['Bell Gang'], leader: true, telegram: 'VE811' },
        { id: 1956, name: 'David "Dave" Vandyne', factions: ['Pruitt Gang'] },
        { id: 2373, name: 'Lindsey Michaels' },
    ],
    WeeJimcent: [
        { id: 933, name: 'Sergio ?' },
    ],
    Welkkin: [
        { id: 2301, name: 'Carlo Barletti' },
    ],
    WestCoastWayne: [
        { id: 934, name: 'Ervin Haywood' },
        { id: 935, name: 'Charles "Smoke" Dunn' },
    ],
    Wetbow: [
        { id: 936, name: 'Amadeus Abraham' },
    ],
    weyynn: [
        { id: 2351, name: 'Ramy McKinley' },
    ],
    WhiskeyTheRedd: [
        { id: 937, name: 'Devyn Dunning', nicknames: ['Dakota'] },
    ],
    whitmax: [
        { id: 2329, name: 'Lowell Oakland' },
    ],
    WickedPhoenixRP: [
        { id: 1440, name: 'Jeremiah Watson', factions: ['Quil Gang'], deceased: true },
        { id: 1591, name: 'Isaac Quil', factions: ['Quil Gang'], telegram: 'BS485', deceased: true },
    ],
    WildJing: [
        { id: 2437, name: 'Wilmer Guzman' },
    ],
    WingTroker: [
        { id: 938, name: 'Bert Silver' },
        { id: 939, name: 'Sally Cooper-Borr' },
    ],
    WithExtraSauce: [
        { id: 1583, name: 'Jasper Jennings' },
    ],
    Wombax: [
        { id: 940, name: 'Wiley Nash', displayName: 2, formerFactions: ['Kettleman Gang'], deceased: true },
        { id: 1014, name: 'Clay Dempsey' },
        { id: 1022, name: 'Hannibal ?', telegram: 'TV398' },
        { id: 1115, name: 'Nolan Kemp', factions: ['Guarma'] },
        { id: 1296, name: '[Deputy] Scott Wilkins', factions: ['Law'], deceased: true },
        { id: 1518, name: 'Maxwell Tango', formerFactions: ['Law'] }, // Former Law
        { id: 2007, name: 'Rocco Love', deceased: true },
    ],
    woplotomo: [
        { id: 941, name: '? ?', assume: 'neverNp' },
    ],
    Wrighty: [
        { id: 942, name: 'Jack Reed', deceased: true },
        { id: 943, name: '[Marshal] Logan Monroe', factions: ['Law'], telegram: 'AC843', deceased: true }, // Deputy Marshal
        { id: 944, name: 'Roscoe Riggs' },
        { id: 945, name: 'Joseph Carter', deceased: true },
        { id: 1431, name: 'Theodor "Teddy" Mcfarlane', formerFactions: ['Law'], telegram: 'FT994' }, // Former Deputy
        { id: 1459, name: 'Bob ?', factions: ['Dead End Gang'], deceased: true },
        { id: 1549, name: 'James Mustang' },
        { id: 1569, name: '[Guard] Benrique West', factions: ['Sisika Guard'] },
        { id: 1889, name: '[Sheriff] Harrison Holt', factions: ['Law'], nicknames: ['Heriff Sholt'] },
        { id: 1978, name: 'Chester Brown', factions: ['Conductors'] },
        { id: 2231, name: 'Archie Burns' },
        { id: 2272, name: 'Jeremiah "Swifty" Swift' },
    ],
    WTFGameNation: [
        { id: 946, name: 'Morgan Calloway' },
    ],
    wtfmoses: [
        { id: 2161, name: 'George W. Nelson' },
    ],
    WynterWyllowWolfe: [
        { id: 2049, name: 'Hazel Marena' },
    ],
    Xiceman: [
        { id: 947, name: 'Michael Bayo', factions: ['The Baastards'], telegram: 'NA016', deceased: true },
        { id: 948, name: '[Deputy] Andrew Kennedy', factions: ['Law'], telegram: 'VZ460' },
    ],
    xiviathan: [
        { id: 1820, name: 'Lydia Spade', factions: ['Independent', 'Guarma'], telegram: 'AB336' },
        { id: 1866, name: 'Amber Goldberg', telegram: 'MN755' },
        { id: 1867, name: 'Aria Monroe', telegram: 'UK772' },
    ],
    xlt588gaming: [
        { id: 949, name: 'Adam Garica' },
    ],
    xoVESPER: [
        { id: 1021, name: 'Olivia McDurn', factions: ['DiCenzo Famiglia'], deceased: true, telegram: 'FE371' }, // Former DiCenzo
        { id: 1233, name: 'Josephine "Josie" Adders', factions: ['Kelly Gang'], formerFactions: ['The Baastards'], telegram: 'FO336', deceased: true },
        { id: 2441, name: 'Rebecca "Becks" ?', factions: ['Quil Gang'] },
    ],
    XxSammyisGamingxX: [
        { id: 2334, name: 'Sammy Clark' },
    ],
    YatoTheMad: [
        { id: 953, name: 'Cassius Evans' },
        { id: 954, name: 'Charles Campbell' },
        { id: 955, name: 'Liam Reilly', telegram: 'HB537' },
        { id: 956, name: 'Alexander Williams' },
        { id: 1696, name: '[Deputy] Dorian Kelshaw', factions: ['Law'], telegram: 'FH017' },
        { id: 1726, name: 'Bray Cooper' },
        { id: 2400, name: 'Joseph "Billabong Joe" Wilson' },
    ],
    YawnyJ: [
        { id: 1856, name: 'Clara Carter', formerFactions: ['News'] }, // Former Reporter
        { id: 1891, name: 'Imogene Foster' },
    ],
    yeka221: [
        { id: 957, name: '[Ranger] Tabitha "Tibbit" Birch', nicknames: ['Tibbit Mostokova'], factions: ['Rangers'], telegram: 'RQ940' },
        { id: 977, name: '[Sheriff] Harley Bolton', factions: ['Law'], telegram: 'EA773' },
        { id: 1790, name: 'Bonnie Jenkins' },
        { id: 2446, name: 'Nina "Firebird" Volkova', deceased: true },
    ],
    Yorkoh: [
        { id: 958, name: 'Kai Ming', formerFactions: ['Law'], telegram: 'IR145' }, // Former Sheriff
    ],
    YouKnowItsJuno: [
        { id: 959, name: 'Sumanitu Taka Cante Gearhardt', nicknames: ['Kima Abrams'] },
    ],
    youngxsprout: [
        { id: 2286, name: 'Sunday Molinaro' },
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
    zambigames: [
        { id: 1094, name: 'Hank Hanson', nicknames: ['Handsome Hank'], displayName: 3, factions: ['10 Tonne Gang'] },
        { id: 1667, name: 'Marty Fatts', telegram: 'EH280' },
    ],
    zandohr: [
        { id: 1869, name: 'Alasdair McTaggart' },
        { id: 1895, name: 'Alberto Rivera' },
        { id: 1942, name: 'Santino Garcia' },
        { id: 1944, name: 'Manuel Garcia' },
    ],
    Zarrqq: [
        { id: 963, name: 'Benjamin "Ben" Gaines', factions: ['Independent', 'Guarma'], telegram: 'WA374' }, // Former Sam's Club
    ],
    Zelupsy: [
        { id: 1078, name: 'Abigail Bennett' },
    ],
    Zetark: [
        { id: 964, name: 'Cesare DiCenzo', factions: ['DiCenzo Famiglia'], leader: true, telegram: 'GC730' },
        { id: 1882, name: 'Benny Wells', factions: ['One Life'] },
    ],
    ZeusLair: [
        { id: 965, name: 'Robbie Gold', deceased: true }, // Former Lang Gang.
        { id: 984, name: 'Elijah James' },
        { id: 1004, name: 'Johnny Lambs', factions: ['One Life'], deceased: true },
        { id: 1003, name: 'Housten Beebors', factions: ['One Life'], deceased: true },
        { id: 1268, name: 'Jesse Gold', factions: ['The Baastards'] },
    ],
    Ziggy: [
        { id: 966, name: 'Norman Bones' },
        { id: 967, name: 'Marly Clifton' },
        { id: 2156, name: 'Edward Devereaux' },
        { id: 2185, name: 'Clayton Monroe', factions: ['Perma Trail'], deceased: true },
    ],
    ZoltanTheDestroyer: [
        { id: 968, name: 'Emmett Fitz' },
    ],
    Zombiefun: [
        { id: 969, name: '[Game Warden] Henry "Hal" Dreen', factions: ['Rangers'], telegram: 'LH984' },
        { id: 970, name: 'Alexander McCoy' },
        { id: 971, name: '[Deputy] Langston Bolo', factions: ['Law'], telegram: 'VC705' },
        { id: 2396, name: 'Lucas Malone' },
    ],
    ZyberFox: [
        { id: 2212, name: 'Santiago De La Cruz' },
    ],
};

export const requestedRemovedCharacters: string[] = [
    'endangeredfinley',
];
