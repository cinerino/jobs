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
 * 注文取引集計
 */
const cinerino = require("@cinerino/domain");
const createDebug = require("debug");
const moment = require("moment");
const mongooseConnectionOptions_1 = require("../../../mongooseConnectionOptions");
const debug = createDebug('cinerino-jobs');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const measureFrom = moment(moment().format('YYYY-MM-DDTHH:mm:00Z')).toDate();
        const measureThrough = moment(measureFrom).add(1, 'minute').toDate();
        debug('aggregating...', measureFrom);
        yield cinerino.mongoose.connect(process.env.MONGOLAB_URI, mongooseConnectionOptions_1.default);
        const telemetryRepo = new cinerino.repository.Telemetry(cinerino.mongoose.connection);
        const transactionRepo = new cinerino.repository.Transaction(cinerino.mongoose.connection);
        yield cinerino.service.report.telemetry.aggregatePlaceOrder({ measureFrom, measureThrough })({
            telemetry: telemetryRepo,
            transaction: transactionRepo
        });
        yield cinerino.mongoose.disconnect();
    });
}
main().then(() => {
    debug('success!');
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
