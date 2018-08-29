/**
 * 中止注文返品取引監視
 */
import * as cinerino from '@cinerino/domain';
import * as createDebug from 'debug';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('cinerino-jobs');

cinerino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions).then(debug).catch(console.error);

let countExecute = 0;

const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 200;
const taskRepo = new cinerino.repository.Task(cinerino.mongoose.connection);
const transactionRepo = new cinerino.repository.Transaction(cinerino.mongoose.connection);

setInterval(
    async () => {
        if (countExecute > MAX_NUBMER_OF_PARALLEL_TASKS) {
            return;
        }

        countExecute += 1;

        try {
            debug('exporting tasks...');
            await cinerino.service.transaction.returnOrder.exportTasks(
                cinerino.factory.transactionStatusType.Canceled
            )({
                task: taskRepo,
                transaction: transactionRepo
            });
        } catch (error) {
            console.error(error);
        }

        countExecute -= 1;
    },
    INTERVAL_MILLISECONDS
);
