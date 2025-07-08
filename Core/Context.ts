import BlocklyExecutor, {Vareables} from './BlocklyExecutor';
import {guid} from './helpers';
import {dateFormat} from './timeHelper';

interface IContextOperation {
    commands?: any[];
    data?: any;
    variables?: Vareables;
    status?: 'complete' | 'error' | 'run';
    step?: string;
    stepByStep?: boolean;
    begin?: string;
    operation_uuid?: string;
    connection_uuid?: string;
}
export interface IDebugContext {
    __thread_vars?: object;
    __child?: object;
    VAR?: string;
    VALUE?: any;
    result?: any;
    OP?: string;
    A?: string;
    B?: string;
    NUM?: string;
    CONDITION?: any;
    BOOL?: string;
    WHERE?: 'FROM_START' | 'FROM_END' | 'FIRST' | 'LAST' | 'RANDOM';
    MODE?: 'SET' | 'GET' | 'GET_REMOVE' | 'REMOVE';
    AT?: number;
    TO?: number;
    INDEX?: number;
    LIST?: any[];
    value?: any[];
    __deferred?: any;
    ini_name?: string;
    INI_NAME?: string;
    PATH?: string;
    type?: string;
    template?: string;
}
interface IDataContext {
    data: object;
    var: Vareables;
    debug: object;
    operation: IContextOperation;
    deferred: any[];
}

export default class Context {
    operation: IContextOperation = {};
    data: {cache_ini?: any};
    variables: Vareables = {};
    debug: IDebugContext = {__thread_vars: {}};
    deferred: any[] = [];
    params: object = {};
    limitCommands: number;
    isDeferred: boolean = true;

    /**
     * Инициализация контекста, если переданы параменты
     */
    _initFromDict(data: IDataContext): void {
        this.data = data.data || {};
        this.variables = data.var || {};
        this.debug = data.debug || {__thread_vars: {}};
        this.operation = data.operation || {};
        this.deferred = data.deferred || [];
    }

    /**
     * Создание нового экземпляра контекста
     */
    static init(
        executor: BlocklyExecutor,
        operationId: string,
        data: IDataContext,
        connectionId: string,
        params: object
    ): Context {
        if (!operationId) {
            operationId = guid();
        }
        const context = new Context();
        if (!data) {
            context.operation = {
                commands: [],
                status: 'run',
                operation_uuid: operationId,
                connection_uuid: connectionId,
                stepByStep: executor.stepByStep
            };
        } else {
            context._initFromDict(data);
        }
        context.params = params || {};
        context.operation.begin = dateFormat(new Date(), 'Y-m-d H:M:S');
        context.setLimit();
        return context;
    }

    setLimit(): void {
        this.limitCommands = this.operation.stepByStep ? 1 : 25;
    }

    initDeferred(debug: any): Context {
        const _self = new Context();
        _self.params = this.params;
        _self.debug = debug.debug;
        _self.isDeferred = true;
        _self.data = this.data;
        _self.variables = this.variables;
        _self.operation = this.operation;
        _self.deferred = this.deferred;
        return _self;
    }

    checkCommandLimit(): void {
        if (this.operation.commands.length >= this.limitCommands) {
            throw new LimitCommand();
        }
    }

    getChildContext(blockContext: IDebugContext): IDebugContext {
        let childContext = blockContext.__child;
        if (!childContext) {
            childContext = {};
            blockContext.__child = childContext;
        }
        return childContext;
    }

    clearChildContext(blockContext: IDebugContext, deleteChildren: boolean = true): void {
        if (deleteChildren) {
            delete blockContext.__child;
        }
    }
}

class LimitCommand extends Error {}
