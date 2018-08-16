/**
 * 上映イベントインポート
 */
import * as cinerino from '@cinerino/domain';
import * as createDebug from 'debug';
import * as moment from 'moment';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('cinerino-jobs:*');

/**
 * 上映イベントを何週間後までインポートするか
 * @const {number}
 */
const LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS = (process.env.LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS !== undefined)
    // tslint:disable-next-line:no-magic-numbers
    ? parseInt(process.env.LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS, 10)
    : 1;

async function main() {
    debug('connecting mongodb...');
    await cinerino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions);

    const eventRepository = new cinerino.repository.Event(cinerino.mongoose.connection);
    const placeRepository = new cinerino.repository.Place(cinerino.mongoose.connection);
    const organizationRepository = new cinerino.repository.Organization(cinerino.mongoose.connection);
    const chevreAuthClient = new cinerino.chevre.auth.ClientCredentials({
        domain: <string>process.env.CHEVRE_AUTHORIZE_SERVER_DOMAIN,
        clientId: <string>process.env.CHEVRE_CLIENT_ID,
        clientSecret: <string>process.env.CHEVRE_CLIENT_SECRET,
        scopes: [],
        state: ''
    });
    const eventService = new cinerino.chevre.service.Event({
        endpoint: <string>process.env.CHEVRE_ENDPOINT,
        auth: chevreAuthClient
    });

    // 全劇場組織を取得
    const movieTheaters = await organizationRepository.searchMovieTheaters({});
    const importFrom = moment().toDate();
    const importThrough = moment().add(LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS, 'weeks').toDate();
    await Promise.all(movieTheaters.map(async (movieTheater) => {
        try {
            debug('importing screening events...');
            await cinerino.service.masterSync.importScreeningEvents({
                theaterCode: movieTheater.location.branchCode,
                importFrom: importFrom,
                importThrough: importThrough
            })({
                event: eventRepository,
                place: placeRepository,
                eventService: eventService
            });
            debug('screening events imported.');
        } catch (error) {
            console.error(error);
        }
    }));

    await cinerino.mongoose.disconnect();
}

main().then(() => {
    debug('success!');
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
