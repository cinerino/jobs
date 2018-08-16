/**
 * 映画作品インポート
 */
import * as cinerino from '@cinerino/domain';
import * as createDebug from 'debug';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('cinerino-jobs:*');

export async function main() {
    debug('connecting mongodb...');
    await cinerino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions);

    const creativeWorkRepository = new cinerino.repository.CreativeWork(cinerino.mongoose.connection);
    const organizationRepository = new cinerino.repository.Organization(cinerino.mongoose.connection);

    // 全劇場組織を取得
    const movieTheaters = await organizationRepository.searchMovieTheaters({});

    // 劇場ごとに映画作品をインポート
    await Promise.all(movieTheaters.map(async (movieTheater) => {
        try {
            debug('importing movies...', movieTheater);
            await cinerino.service.masterSync.importMovies({ branchCode: movieTheater.location.branchCode })({
                creativeWork: creativeWorkRepository
            });
            debug('movies imported');
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
