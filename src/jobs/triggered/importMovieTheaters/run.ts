/**
 * 劇場インポート
 */
import * as cinerino from '@cinerino/domain';
import * as createDebug from 'debug';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('cinerino-jobs');

async function main() {
    debug('connecting mongodb...');
    await cinerino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions);

    const placeRepo = new cinerino.repository.Place(cinerino.mongoose.connection);
    const organizationRepo = new cinerino.repository.Organization(cinerino.mongoose.connection);

    // 全劇場組織を取得
    const movieTheaters = await organizationRepo.searchMovieTheaters({});
    const chevreAuthClient = new cinerino.chevre.auth.ClientCredentials({
        domain: <string>process.env.CHEVRE_AUTHORIZE_SERVER_DOMAIN,
        clientId: <string>process.env.CHEVRE_CLIENT_ID,
        clientSecret: <string>process.env.CHEVRE_CLIENT_SECRET,
        scopes: [],
        state: ''
    });
    const placeService = new cinerino.chevre.service.Place({
        endpoint: <string>process.env.CHEVRE_ENDPOINT,
        auth: chevreAuthClient
    });

    await Promise.all(movieTheaters.map(async (movieTheater) => {
        try {
            debug('importing movieTheater...');
            await cinerino.service.masterSync.importMovieTheater({ branchCode: movieTheater.location.branchCode })({
                place: placeRepo,
                placeService: placeService
            });
            debug('movieTheater imported');
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
