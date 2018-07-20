import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services-data-node';
import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from './ILoggingPersistence';
export declare class LogsMongoDbPersistence extends IdentifiableMongoDbPersistence<LogMessageV1, string> implements ILoggingPersistence {
    constructor();
    private composeFilter(filter);
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<LogMessageV1>) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
    addOne(correlationId: string, message: LogMessageV1, callback?: (err: any, message: LogMessageV1) => void): void;
    addBatch(correlationId: string, messages: LogMessageV1[], callback: (err: any) => void): void;
    deleteExpired(correlationId: string, expireLogsTime: Date, expireErrorsTime: Date, callback: (err: any) => void): void;
}
