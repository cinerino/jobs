/**
 * 注文取引集計
 */
import * as cinerino from '@cinerino/domain';
import * as createDebug from 'debug';
import * as moment from 'moment';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('cinerino-jobs');

cinerino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions).then(debug).catch(console.error);

const INTERVAL_MILLISECONDS = 60000;
const telemetryRepo = new cinerino.repository.Telemetry(cinerino.mongoose.connection);
const transactionRepo = new cinerino.repository.Transaction(cinerino.mongoose.connection);

setInterval(
    async () => {
        try {
            const measureThrough = moment(moment().format('YYYY-MM-DDTHH:mm:00Z')).toDate();
            const measureFrom = moment(measureThrough).add(-1, 'minute').toDate();
            debug('aggregating...', measureFrom);

            await cinerino.service.report.telemetry.aggregatePlaceOrder({ measureFrom, measureThrough })({
                telemetry: telemetryRepo,
                transaction: transactionRepo
            });
        } catch (error) {
            console.error(error);
        }
    },
    INTERVAL_MILLISECONDS
);
