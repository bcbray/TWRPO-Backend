/* eslint-disable no-useless-escape */
/* eslint-disable operator-linebreak */

// import { mergeRegex, replaceAll } from '../utils';

export const minViewers = 1;
export const stopOnMin = true;
export const intervalSeconds = 0.7;

export const regWrp = /(?<!\bnot\b\s+)(?:wild\s*rp|\bwrp\b)(?![\s\-]*(?:inspired|based|like|ban|\.ins\b))/i;

export const regOthers = [
    { name: 'Sundance RP', reg: /\bsd\s*rp|sundance\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Sundown RP', reg: /\bsundown\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'NewCenturyRP', reg: /\bnc\s*rp|\bnew\s*century\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'New Valley RP', reg: /\bnew\s*valley\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Wild West RP', reg: /\bww\s*rp|\bwild\s*west\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Syn County RP', reg: /\bsyn\s*rp|\bsyn\s*county\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Hollow Creek RP', reg: /\bhc\s*rp|\bhollow\s*creek\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Haven\'s Crest RP', reg: /\bhaven'?s\s+crest\s+(?:rp\b|roleplay)/i, include: 1 },
    { name: 'PRC', reg: /\bprc\b/i, include: 1 },
    { name: 'Red Dead Online', reg: /\b(?:rdr[\s:-]*[2]?|read\s*dead)[\s:-]*online/i, include: 0 },
    { name: 'RDR Story', reg: /story[\s\-]*mode|\b(?:rdr|red\s+dead\s+redemption)[\s:-]*[2]?[\s\-]+(?:story|campaign)|playthrough/i, include: 0 },
];
