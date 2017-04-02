import { Factory } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';

import { LoggingMemoryPersistence } from '../persistence/LoggingMemoryPersistence';
import { LoggingController } from '../logic/LoggingController';
import { LoggingHttpServiceV1 } from '../services/version1/LoggingHttpServiceV1';
import { LoggingSenecaServiceV1 } from '../services/version1/LoggingSenecaServiceV1'; 

export class LoggingFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-logging", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-logging", "persistence", "memory", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-logging", "controller", "default", "*", "1.0");
	public static SenecaServiceDescriptor = new Descriptor("pip-services-logging", "service", "seneca", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-logging", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(LoggingFactory.MemoryPersistenceDescriptor, LoggingMemoryPersistence);
		this.registerAsType(LoggingFactory.ControllerDescriptor, LoggingController);
		this.registerAsType(LoggingFactory.SenecaServiceDescriptor, LoggingSenecaServiceV1);
		this.registerAsType(LoggingFactory.HttpServiceDescriptor, LoggingHttpServiceV1);
	}
	
}
