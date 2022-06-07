/* eslint-disable no-useless-escape */
/* eslint-disable operator-linebreak */

// import { mergeRegex, replaceAll } from '../utils';

export const minViewers = 1;
export const stopOnMin = true;
export const intervalSeconds = 0.7;

export const regWrp = /(?:wild\s*rp|\bwrp\b)(?![\s\-]*(?:inspired|based|like|ban|\.ins\b))/i;

export const regOthers = [
	{ name: 'Sundance RP', reg: /\bsd\s?rp|sundance\s*(?:rp\b|roleplay)/i, include: 1 },
	{ name: 'Sundown RP', reg: /\bsundown\s*(?:rp\b|roleplay)/i, include: 1 },
	{ name: 'NewCenturyRP', reg: /\bnewcentury\s*(?:rp\b|roleplay)/i, include: 1 },
	{ name: 'New Valley RP', reg: /\bnew\s*valley\s*(?:rp\b|roleplay)/i, include: 1 },
	{ name: 'Haven\'s Crest RP', reg: /\bhaven'?s\s+crest\s+(?:rp\b|roleplay)/i, include: 1 },
	{ name: 'GTA Online', reg: /\bgta[\s:-]*[5v]?[\s:-]*online/i, include: 0 },
	{ name: 'GTA Story', reg: /story[\s\-]*mode|\bgta[\s:-]*[5v]?[\s\-]+story/i, include: 0 },
];
