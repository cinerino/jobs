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
 * 上映イベントインポート
 */
const cinerino = require("@cinerino/domain");
const createDebug = require("debug");
const moment = require("moment");
const mongooseConnectionOptions_1 = require("../../../mongooseConnectionOptions");
const debug = createDebug('cinerino-jobs');
/**
 * 上映イベントを何週間後までインポートするか
 * @const {number}
 */
const LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS = (process.env.LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS !== undefined)
    // tslint:disable-next-line:no-magic-numbers
    ? parseInt(process.env.LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS, 10)
    : 1;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        debug('connecting mongodb...');
        yield cinerino.mongoose.connect(process.env.MONGOLAB_URI, mongooseConnectionOptions_1.default);
        const eventRepo = new cinerino.repository.Event(cinerino.mongoose.connection);
        const organizationRepo = new cinerino.repository.Organization(cinerino.mongoose.connection);
        const chevreAuthClient = new cinerino.chevre.auth.ClientCredentials({
            domain: process.env.CHEVRE_AUTHORIZE_SERVER_DOMAIN,
            clientId: process.env.CHEVRE_CLIENT_ID,
            clientSecret: process.env.CHEVRE_CLIENT_SECRET,
            scopes: [],
            state: ''
        });
        const eventService = new cinerino.chevre.service.Event({
            endpoint: process.env.CHEVRE_ENDPOINT,
            auth: chevreAuthClient
        });
        // 全劇場組織を取得
        const movieTheaters = yield organizationRepo.searchMovieTheaters({});
        const importFrom = moment().toDate();
        const importThrough = moment().add(LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS, 'weeks').toDate();
        yield Promise.all(movieTheaters.map((movieTheater) => __awaiter(this, void 0, void 0, function* () {
            try {
                debug('importing screening events...');
                yield cinerino.service.stock.importScreeningEvents({
                    locationBranchCode: movieTheater.location.branchCode,
                    importFrom: importFrom,
                    importThrough: importThrough
                })({
                    event: eventRepo,
                    eventService: eventService
                });
                debug('screening events imported.');
            }
            catch (error) {
                console.error(error);
            }
        })));
        yield cinerino.mongoose.disconnect();
    });
}
main().then(() => {
    debug('success!');
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
