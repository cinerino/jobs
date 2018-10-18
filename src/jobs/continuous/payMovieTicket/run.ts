/**
 * ムビチケ着券実行
 */
import * as cinerino from '@cinerino/domain';
import * as createDebug from 'debug';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('cinerino-jobs');

cinerino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions).then(debug).catch(console.error);

let count = 0;

const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 1000;
const taskRepo = new cinerino.repository.Task(cinerino.mongoose.connection);

const authClient = new cinerino.mvtkreserveapi.auth.ClientCredentials({
    domain: <string>process.env.MVTK_RESERVE_AUTHORIZE_SERVER_DOMAIN,
    clientId: <string>process.env.MVTK_RESERVE_CLIENT_ID,
    clientSecret: <string>process.env.MVTK_RESERVE_CLIENT_SECRET,
    scopes: [],
    state: ''
});

setInterval(
    async () => {
        if (count > MAX_NUBMER_OF_PARALLEL_TASKS) {
            return;
        }

        count += 1;

        try {
            await cinerino.service.task.executeByName(
                cinerino.factory.taskName.PayMovieTicket
            )({
                taskRepo: taskRepo,
                connection: cinerino.mongoose.connection,
                mvtkReserveEndpoint: <string>process.env.MVTK_RESERVE_ENDPOINT,
                mvtkReserveAuthClient: authClient
            });
        } catch (error) {
            console.error(error);
        }

        count -= 1;
    },
    INTERVAL_MILLISECONDS
);
