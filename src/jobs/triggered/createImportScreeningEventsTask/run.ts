/**
 * 上映イベントインポートタスク作成
 */
import * as cinerino from '@cinerino/domain';
import * as createDebug from 'debug';
import * as moment from 'moment';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('cinerino-jobs');

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

    const taskRepo = new cinerino.repository.Task(cinerino.mongoose.connection);
    const organizationRepo = new cinerino.repository.Organization(cinerino.mongoose.connection);

    // 全劇場組織を取得
    const movieTheaters = await organizationRepo.searchMovieTheaters({});
    const importFrom = moment().toDate();
    const importThrough = moment().add(LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS, 'weeks').toDate();
    const runsAt = new Date();
    await Promise.all(movieTheaters.map(async (movieTheater) => {
        try {
            const taskAttributes: cinerino.factory.task.IAttributes<cinerino.factory.taskName.ImportScreeningEvents> = {
                name: cinerino.factory.taskName.ImportScreeningEvents,
                status: cinerino.factory.taskStatus.Ready,
                runsAt: runsAt,
                remainingNumberOfTries: 1,
                lastTriedAt: null,
                numberOfTried: 0,
                executionResults: [],
                data: {
                    locationBranchCode: movieTheater.location.branchCode,
                    importFrom: importFrom,
                    importThrough: importThrough
                }
            };
            await taskRepo.save(taskAttributes);
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
