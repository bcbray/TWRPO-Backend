/* eslint-disable prefer-destructuring */

import { Router } from 'express';
import { ApiClient } from 'twitch';
import { DataSource } from 'typeorm';

import { mapObjKeys, cloneDeepJson, log } from '../../utils';
import { getWrpLive } from './liveData';

import type { RecordGen } from '../../utils';

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        // log('Handling request for /live');
        let live = await getWrpLive(
            apiClient,
            dataSource,
            mapObjKeys(req.query as RecordGen, ((_v, k) => {
                if (k === 'faction') return 'factionName';
                return k;
            })),
            undefined, '/live'
        );
        if (!req.header('TWRPO-Extension-Version')) {
            log('Sending old baseHtml');
            live = cloneDeepJson(live) as typeof live;
            // If there's no extension version, assume we're <= 1.13.4
            // and send the old baseHtml (as it's slightly less broken
            // than the new baseHtml with the old extension)
            // eslint-disable-next-line max-len
            live.baseHtml = '<div class="tno-stream" id="tno-stream-_TNOID_" data-target="" style="order: _ORDER_;"><div class="Layout-sc-nxg1ff-0 cUYIUW"><div><div class="Layout-sc-nxg1ff-0"><article data-a-target="card-7" data-a-id="card-_CHANNEL1_" class="Layout-sc-nxg1ff-0 frepDF"><div class="Layout-sc-nxg1ff-0 ggozbG"><div class="Layout-sc-nxg1ff-0 kTkZWx"><div class="ScTextWrapper-sc-14f6evl-1 fejGga"><div class="ScTextMargin-sc-14f6evl-2 biJSak"><div class="Layout-sc-nxg1ff-0 hrCGTZ"><a lines="1" data-a-target="preview-card-title-link" class="ScCoreLink-sc-udwpw5-0 jswAtS ScCoreLink-sc-ybxm10-0 dnhAtW tw-link" href="/_CHANNEL1_"><h3 title="_TITLE_" class="CoreText-sc-cpl358-0 ilJsSZ">_TITLE_</h3></a></div></div><div class="ScTextMargin-sc-14f6evl-2 biJSak"><p class="CoreText-sc-cpl358-0 eyuUlK"><a data-test-selector="ChannelLink" data-a-target="preview-card-channel-link" class="ScCoreLink-sc-udwpw5-0 jswAtS tw-link" href="/_CHANNEL1_/videos">_CHANNEL2_</a></p></div><div class="Layout-sc-nxg1ff-0 dRKpYM"><div class="InjectLayout-sc-588ddc-0 eXNwOD"><div class="InjectLayout-sc-588ddc-0 beXCOC"><button class="ScTag-sc-xzp4i-0 iKNvdP tw-tag" aria-label="English" data-a-target="English"><div class="ScTagContent-sc-xzp4i-1 gONNWj">English</div></button></div></div></div></div><div class="ScImageWrapper-sc-14f6evl-0 jISSAW"><a data-a-target="card-7" data-a-id="card-_CHANNEL1_" data-test-selector="preview-card-avatar" class="ScCoreLink-sc-udwpw5-0 ktfxqP tw-link" href="/_CHANNEL1_/videos"><div class="ScAspectRatio-sc-1sw3lwy-1 eQcihY tw-aspect"><div class="ScAspectSpacer-sc-1sw3lwy-0 dsswUS"></div><figure aria-label="_CHANNEL1_" class="ScAvatar-sc-12nlgut-0 bmqpYD tw-avatar"><img class="InjectLayout-sc-588ddc-0 iDjrEF tw-image tw-image-avatar" alt="_CHANNEL1_" src="_PFP_"></figure></div></a></div><div class="Layout-sc-nxg1ff-0 dJkOSY"><div class="Layout-sc-nxg1ff-0 fUcieP"><div class="InjectLayout-sc-588ddc-0 ktQueN"><div class="Layout-sc-nxg1ff-0 feedback-card"><div data-toggle-balloon-id="8449e4b3-2ebb-4b8b-ad13-cd0cd1f9c3a9" class="Layout-sc-nxg1ff-0 fcPbos"><div data-test-selector="toggle-balloon-wrapper__mouse-enter-detector" style="display: inherit;"><button class="ScCoreButton-sc-1qn4ixc-0 hnikCY ScButtonIcon-sc-o7ndmn-0 bQJLWW" aria-label="Recommendation feedback" data-a-target="rec-feedback-card-button"><div class="ButtonIconFigure-sc-1ttmz5m-0 cmxCiB"><div class="ScIconLayout-sc-1bgeryd-0 cXxJjc"><div class="ScAspectRatio-sc-1sw3lwy-1 kPofwJ tw-aspect"><div class="ScAspectSpacer-sc-1sw3lwy-0 dsswUS"></div><svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 ifdSJl"><g><path d="M10 18a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM8 4a2 2 0 104 0 2 2 0 00-4 0z"></path></g></svg></div></div></div></button></div></div></div></div></div></div></div></div><div class="ScWrapper-sc-uo2e2v-0 IbFZu tw-hover-accent-effect"><div class="ScTransformWrapper-sc-uo2e2v-1 ScCornerTop-sc-uo2e2v-2 lmjSRR gaYszF"></div><div class="ScTransformWrapper-sc-uo2e2v-1 ScCornerBottom-sc-uo2e2v-3 gEIaFB fGRgGA"></div><div class="ScTransformWrapper-sc-uo2e2v-1 ScEdgeLeft-sc-uo2e2v-4 eTyELd eRrHBW"></div><div class="ScTransformWrapper-sc-uo2e2v-1 ScEdgeBottom-sc-uo2e2v-5 kocUMp cWOxay"></div><div class="ScTransformWrapper-sc-uo2e2v-1 ghrhyx"><a data-a-target="preview-card-image-link" class="ScCoreLink-sc-udwpw5-0 ktfxqP tw-link" href="/_CHANNEL1_"><div class="Layout-sc-nxg1ff-0 fjGGXR"><div class="ScAspectRatio-sc-1sw3lwy-1 kPofwJ tw-aspect"><div class="ScAspectSpacer-sc-1sw3lwy-0 kECpQh"></div><img alt="_TITLE_ - _CHANNEL1_" class="tw-image" src="https://static-cdn.jtvnw.net/previews-ttv/live_user__CHANNEL1_-440x248.jpg_TIMEID_"></div><div class="ScPositionCorner-sc-1iiybo2-1 gtpTmt"><div class="ScChannelStatusTextIndicator-sc-1f5ghgf-0 gfqupx tw-channel-status-text-indicator" font-size="font-size-6"><p class="CoreText-sc-cpl358-0 duTViv">LIVE</p></div></div><div class="ScPositionCorner-sc-1iiybo2-1 eHqCXd"><div class="ScMediaCardStatWrapper-sc-1ncw7wk-0 jluyAA tw-media-card-stat">_VIEWERS_ viewers</div></div></div></a></div></div></article></div></div></div></div>';
        }

        // log('live', live);
        return res.send(live);
    });

    return router;
};

export default buildRouter;
