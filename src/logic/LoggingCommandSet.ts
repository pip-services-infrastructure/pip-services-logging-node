let _ = require('lodash');

import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';
import { LogLevelConverter } from 'pip-services3-components-node';

import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { LogMessageV1Schema } from '../data/version1/LogMessageV1Schema';
import { ILoggingController } from './ILoggingController';

export class LoggingCommandSet extends CommandSet {
	private _logic: ILoggingController;

	constructor(logic: ILoggingController) {
		super();

		this._logic = logic;

		this.addCommand(this.makeReadMessagesCommand());
		this.addCommand(this.makeReadErrorsCommand());
		this.addCommand(this.makeWriteMessageCommand());
		this.addCommand(this.makeWriteMessagesCommand());
		this.addCommand(this.makeClearCommand());
	}

	private makeReadMessagesCommand(): ICommand {
		return new Command(
			"read_messages",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.readMessages(correlationId, filter, paging, callback);
			}
		);
	}

	private makeReadErrorsCommand(): ICommand {
		return new Command(
			"read_errors",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.readErrors(correlationId, filter, paging, callback);
			}
		);
	}

	private makeWriteMessageCommand(): ICommand {
		return new Command(
			"write_message",
			new ObjectSchema(true)
				.withRequiredProperty('message', new LogMessageV1Schema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let message = args.get("message");
				message.level = LogLevelConverter.toLogLevel(message.level);
				message.time = DateTimeConverter.toNullableDateTime(message.time);
				this._logic.writeMessage(correlationId, message, callback);
			}
		);
	}

	private makeWriteMessagesCommand(): ICommand {
		return new Command(
			"write_messages",
			new ObjectSchema(true)
				.withRequiredProperty('messages', new ArraySchema(new LogMessageV1Schema())),
			(correlationId: string, args: Parameters, callback: (err: any) => void) => {
				let messages = args.get("messages");
				_.each(messages, (m) => {
					m.time = DateTimeConverter.toNullableDateTime(m.time);
				});
				this._logic.writeMessages(correlationId, messages, callback);
			}
		);
	}

	private makeClearCommand(): ICommand {
		return new Command(
			"clear",
			null,
			(correlationId: string, args: Parameters, callback: (err: any) => void) => {
				this._logic.clear(correlationId, callback);
			}
		);
	}

}