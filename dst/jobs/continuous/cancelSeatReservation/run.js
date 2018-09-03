"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 座席仮予約キャンセル
 */
const cinerino = require("@cinerino/domain");
const createDebug = require("debug");
const mongooseConnectionOptions_1 = require("../../../mongooseConnectionOptions");
const debug = createDebug('cinerino-jobs');
cinerino.mongoose.connect(process.env.MONGOLAB_URI, mongooseConnectionOptions_1.default).then(debug).catch(console.error);
const chevreAuthClient = new cinerino.chevre.auth.ClientCredentials({
    domain: process.env.CHEVRE_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.CHEVRE_CLIENT_ID,
    clientSecret: process.env.CHEVRE_CLIENT_SECRET,
    scopes: [],
    state: ''
});
let count = 0;
const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 500;
const taskRepo = new cinerino.repository.Task(cinerino.mongoose.connection);
setInterval(() => __awaiter(this, void 0, void 0, function* () {
    if (count > MAX_NUBMER_OF_PARALLEL_TASKS) {
        return;
    }
    count += 1;
    try {
        yield cinerino.service.task.executeByName(cinerino.factory.taskName.CancelSeatReservation)({
            taskRepo: taskRepo,
            connection: cinerino.mongoose.connection,
            chevreEndpoint: process.env.CHEVRE_ENDPOINT,
            chevreAuthClient: chevreAuthClient
        });
    }
    catch (error) {
        console.error(error);
    }
    count -= 1;
}), INTERVAL_MILLISECONDS);
