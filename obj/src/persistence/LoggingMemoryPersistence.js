"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
class LoggingMemoryPersistence {
    constructor() {
        this._maxPageSize = 100;
        this._maxTotalSize = 10000;
        this._logs = [];
    }
    configure(config) {
        this._maxPageSize = config.getAsIntegerWithDefault('options.max_page_size', this._maxPageSize);
        this._maxTotalSize = config.getAsIntegerWithDefault('options.max_total_size', this._maxTotalSize);
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    messageContains(message, search) {
        search = search.toLowerCase();
        if (this.matchString(message.message, search))
            return true;
        if (this.matchString(message.correlation_id, search))
            return true;
        if (message.error != null) {
            if (this.matchString(message.error.message, search))
                return true;
            if (this.matchString(message.error.stack_trace, search))
                return true;
            if (this.matchString(message.error.code, search))
                return true;
        }
        return false;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
        let search = filter.getAsNullableString("search");
        let level = filter.getAsNullableInteger("level");
        let maxLevel = filter.getAsNullableInteger("max_level");
        let fromTime = filter.getAsNullableDateTime("from_time");
        let toTime = filter.getAsNullableDateTime("to_time");
        paging = paging || new pip_services_commons_node_2.PagingParams();
        let skip = paging.getSkip(0);
        let take = paging.getTake(this._maxPageSize);
        let data = [];
        let logs = this._logs;
        for (let index = 0; index < logs.length; index++) {
            let message = logs[index];
            if (search != null && !this.messageContains(message, search))
                continue;
            if (level != null && level != message.level)
                continue;
            if (maxLevel != null && maxLevel < message.level)
                continue;
            if (fromTime != null && fromTime > message.time)
                continue;
            if (toTime != null && toTime <= message.time)
                continue;
            skip--;
            if (skip >= 0)
                continue;
            data.push(message);
            take--;
            if (take <= 0)
                break;
        }
        let total = data.length;
        let page = new pip_services_commons_node_3.DataPage(data, total);
        callback(null, page);
    }
    truncatelogs(logs, maxSize) {
        // Remove logs from the end
        if (logs.length > maxSize)
            logs.splice(maxSize - 1, logs.length - maxSize);
    }
    insertMessage(message, logs) {
        let index = 0;
        // Find index to keep logs sorted by time
        while (index < logs.length) {
            if (message.time >= logs[index].time)
                break;
            index++;
        }
        if (index < logs.length)
            logs.splice(index, 0, message);
        else
            logs.push(message);
    }
    addOne(correlationId, message, callback) {
        // Add to all logs
        this.truncatelogs(this._logs, this._maxTotalSize);
        this.insertMessage(message, this._logs);
        if (callback)
            callback(null, message);
    }
    addBatch(correlationId, data, callback) {
        async.each(data, (d, callback) => {
            this.addOne(correlationId, d, callback);
        }, callback);
    }
    clear(correlationId, callback) {
        this._logs = [];
        if (callback)
            callback(null);
    }
    deleteExpired(correlationId, expireTime, callback) {
        this._logs = _.filter(this._logs, d => d.time.getTime() > expireTime.getTime());
        if (callback)
            callback(null);
    }
}
exports.LoggingMemoryPersistence = LoggingMemoryPersistence;
//# sourceMappingURL=LoggingMemoryPersistence.js.map