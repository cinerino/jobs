/**
 * 注文取引集計
 */
import * as cinerino from '@cinerino/domain';
import * as createDebug from 'debug';
import * as moment from 'moment';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('cinerino-jobs');

async function main() {
    const measureThrough = moment(moment().format('YYYY-MM-DDTHH:mm:00Z')).toDate();
    const measureFrom = moment(measureThrough).add(-1, 'minute').toDate();
    debug('aggregating...', measureFrom);

    await cinerino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions);
    const telemetryRepo = new cinerino.repository.Telemetry(cinerino.mongoose.connection);
    const transactionRepo = new cinerino.repository.Transaction(cinerino.mongoose.connection);
    await cinerino.service.report.telemetry.aggregatePlaceOrder({ measureFrom, measureThrough })({
        telemetry: telemetryRepo,
        transaction: transactionRepo
    });
    await cinerino.mongoose.disconnect();
}

main().then(() => {
    debug('success!');
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
