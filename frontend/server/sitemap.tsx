import { RequestHandler } from 'express';
import { createRoutesFromChildren, RouteObject } from "react-router";

import { TWRPOApi } from '@twrpo/api';

import { publicRoutes } from '../client/routes';

const flatten = (routes: RouteObject[], base: string | undefined = undefined): string[] =>
  routes.flatMap((route) => {
    const path = route.path
      ? base
        ? `${base}/${route.path}`
        : route.path
      : undefined;
    return ([] as string[]).concat(
      path ? [path] : [],
      flatten(route.children ?? [], path ?? base),
    );
  });

interface TextSegment {
  type: 'text';
  text: string;
}

interface ParamSegment {
  type: 'param';
  param: string;
}

type Segment = TextSegment | ParamSegment;

const paramRe = /(?<=^|\/):(\w+)(?=\/|$)/g;

const segments = (path: string): Segment[] => {
  const found: Segment[] = [];
  const matches = path.matchAll(paramRe);

  let start = 0;
  for (const match of matches) {
    if (!match.index) continue;
    if (start !== match.index) {
      found.push({ type: 'text', text: path.substring(start, match.index)});
    }
    found.push({ type: 'param', param: match[1] });
    start = match.index + match[0].length;
  }
  if (start !== path.length) {
      found.push({ type: 'text', text: path.substring(start, path.length)});
  }
  return found;
}

interface StillHasSegments {
  type: 'still-has-segments';
  prefix: string;
  segments: Segment[];
}

interface Complete {
  type: 'complete';
  value: string;
}

type Replacement = StillHasSegments | Complete;

const stillHasSegments = (replacement: Replacement): replacement is StillHasSegments =>
  replacement.type === 'still-has-segments';

class MissingParamError extends Error {
  param: string;

  constructor(param: string) {
    super();
    this.param = param;
  }
}

const spreadOne = (replacement: StillHasSegments, params: Record<string, string[]>): Replacement[] => {
  let { prefix } = replacement;

  let index = 0;
  for (; index < replacement.segments.length; index++) {
    const segment = replacement.segments[index];
    if (segment.type === 'text') {
      prefix = `${prefix}${segment.text}`;
    } else if (segment.param in params) {
      const nextSegments = replacement.segments.slice(index + 1);
      const prefixUpToNow = prefix;
      const nextReplacement = (newPrefix: string): Replacement =>
        nextSegments.length
          ? { type: 'still-has-segments', prefix: newPrefix, segments: nextSegments }
          : { type: 'complete', value: newPrefix }
      return params[segment.param].map(value =>
        nextReplacement(`${prefixUpToNow}${value}`)
      );
    } else {
      throw new MissingParamError(segment.param)
    }
  }

  return [{ type: 'complete', value: prefix }]
};

const spread = (segments: Segment[], params: Record<string, string[]>): string[] => {
  let replacements: Replacement[] = [
    segments.length
      ? { type: 'still-has-segments', prefix: '', segments }
      : { type: 'complete', value: '' }
  ];
  let nextIndex = replacements.findIndex(stillHasSegments);
  while (nextIndex !== -1) {
    const next = replacements[nextIndex] as StillHasSegments;
    replacements.splice(nextIndex, 1, ...spreadOne(next, params));
    nextIndex = replacements.findIndex(stillHasSegments);
  }
  return (replacements as Complete[]).map(r => r.value);
};

const pages = (params: Record<string, string[]>) => {
  const parsedRoutes = createRoutesFromChildren(publicRoutes);
  const flattenedRoutes = flatten(parsedRoutes);
  const segmentedRoutes = flattenedRoutes.map(segments);
  return segmentedRoutes.flatMap((segments) => {
    try {
      return spread(segments, params)
    } catch (err) {
      if (err instanceof MissingParamError) {
        console.log(`No param for ":${err.param}"`);
        return [];
      } else {
        throw err;
      }
    }
  });
}

const priorities: [RegExp, number][] = [
  [/^\/$/, 0.8],
  [/^\/streams\/.*$/, 0.7],
  [/^\/characters$/, 0.75],
  [/^\/characters\/.*$/, 0.6],
  [/^\/multistream$/, 0.4],
  [/^\/multistream\/.*$/, 0.3],
]

const priority = (page: string): number | undefined => {
  const found = priorities.find(([r]) => r.test(page));
  if (found === undefined) return undefined;
  return found[1];
};

const priorityTag = (page: string): string => {
  const prio = priority(page);
  return prio
    ? `<priority>${prio}</priority>`
    : '';
};


type ChangeFrequency = 'always' | 'daily';

const changeFrequencies: [RegExp, ChangeFrequency][] = [
  [/^\/$/, 'always'],
  [/^\/streams\/.*$/, 'always'],
  [/^\/characters$/, 'daily'],
  [/^\/characters\/.*$/, 'daily'],
  [/^\/multistream$/, 'always'],
  [/^\/multistream\/.*$/, 'always'],
];

const changeFrequency = (page: string): ChangeFrequency | undefined => {
  const found = changeFrequencies.find(([r]) => r.test(page));
  if (found === undefined) return undefined;
  return found[1];
};

const changeFrequencyTag = (page: string): string => {
  const freq = changeFrequency(page);
  return freq
    ? `<changefreq>${freq}</changefreq>`
    : '';
};


const sitemap = (api: TWRPOApi): RequestHandler => async (req, res) => {
  const factions = await api.fetchFactions({ user: null });
  const streamers = await api.fetchStreamers({ user: null });
  const allPages = pages({
    'factionKey': factions.factions.flatMap(f =>
      !f.hideInFilter && f.hasCharacters ? [f.key] : []
    ),
    'streamerName': streamers.streamers.map(s => s.twitchLogin),
  });
  const host = req.get('host');
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page =>
  `<url>
    ${[
      `<loc>https://${host}${page}</loc>`,
      changeFrequencyTag(page),
      priorityTag(page),
    ].filter(Boolean).join('\n    ')}
  </url>`).join('\n  ')}
</urlset>
`;

  return res
    .set('Content-Type', 'text/xml')
    .send(sitemapXml);
};

export default sitemap;
