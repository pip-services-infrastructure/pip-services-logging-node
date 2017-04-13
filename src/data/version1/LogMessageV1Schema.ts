import { ObjectSchema } from 'pip-services-commons-node';
import { TypeCode } from 'pip-services-commons-node';

export class LogMessageV1Schema extends ObjectSchema {
    public constructor() {
        super();

        let errorSchema = new ObjectSchema()
            .withOptionalProperty('code', TypeCode.String)
            .withOptionalProperty('message', TypeCode.String)
            .withOptionalProperty('stack_trace', TypeCode.String);

        this.withOptionalProperty('time', null); //TypeCode.DateTime);
        this.withOptionalProperty('correlation_id', TypeCode.String);
        this.withOptionalProperty('source', TypeCode.String);
        this.withRequiredProperty('level', TypeCode.Long);
        this.withOptionalProperty('message', TypeCode.String);
        this.withOptionalProperty('error', errorSchema);
    }
}