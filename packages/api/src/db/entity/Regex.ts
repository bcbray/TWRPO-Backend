import { ViewEntity, ViewColumn } from 'typeorm';
import { ForeignType } from './Nickname';
import { mergeRegex } from '../../utils';

export interface CompactRegex {
    regex: string;
    noFormer?: boolean;
    noLater?: boolean;
}

// eslint-disable-next-line max-len
const noLater = (reg: RegExp) => mergeRegex(['(?:', reg, ')', /(?!(?:[\s-_]+(?:char\w*|roleplay|rp))?[^\w.;]+(?:later|after))/i]);

// eslint-disable-next-line max-len
const noFormer = (reg: RegExp) => mergeRegex([/(?<!(?:\b|_)(?:vs?|versus|on|against|e?x|former|fake|wanna\s*be|fighting|clapping|with|becom\w+\s+a|for|then)(?:\s+(?:th?e|some|all|every|el|la|da))?[^a-z0-9]*|vs?)/i, '(?:', reg, ')']);

export const fullRegex = (regex: CompactRegex): RegExp => {
    // TODO: Store flags? (But then, if one is case-insensitive and one isn't …
    // mergeRegex is going to make the whole thing case-insensitive).
    let reg = new RegExp(regex.regex, 'ig');
    if (regex.noFormer) {
        reg = noFormer(reg);
    }
    if (regex.noLater) {
        reg = noLater(reg);
    }
    return reg;
};

@ViewEntity({ name: 'regex', synchronize: false })
export class Regex implements CompactRegex {
    @ViewColumn()
    id: number;

    @ViewColumn({ name: 'foreign_id' })
    foreignId: number;

    @ViewColumn({ name: 'foreign_type' })
    foreignType: ForeignType;

    @ViewColumn()
    regex: string;

    @ViewColumn({ name: 'no_former' })
    noFormer: boolean;

    @ViewColumn({ name: 'no_later' })
    noLater: boolean;

    get fullRegex(): RegExp {
        return fullRegex(this);
    }
}
