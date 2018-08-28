"use strict";
/**
 * 確定注文取引監視
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cinerino = require("@cinerino/domain");
const createDebug = require("debug");
const mongooseConnectionOptions_1 = require("../../../mongooseConnectionOptions");
const debug = createDebug('cinerino-jobs:*');
cinerino.mongoose.connect(process.env.MONGOLAB_URI, mongooseConnectionOptions_1.default).then(debug).catch(console.error);
let countExecute = 0;
const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 200;
const taskRepo = new cinerino.repository.Task(cinerino.mongoose.connection);
const transactionRepo = new cinerino.repository.Transaction(cinerino.mongoose.connection);
setInterval(() => __awaiter(this, void 0, void 0, function* () {
    if (countExecute > MAX_NUBMER_OF_PARALLEL_TASKS) {
        return;
    }
    countExecute += 1;
    try {
        debug('exporting tasks...');
        yield cinerino.service.transaction.placeOrder.exportTasks(cinerino.factory.transactionStatusType.Confirmed)({
            task: taskRepo,
            transaction: transactionRepo
        });
    }
    catch (error) {
        console.error(error);
    }
    countExecute -= 1;
}), INTERVAL_MILLISECONDS);
