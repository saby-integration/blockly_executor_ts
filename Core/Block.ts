import BlocklyExecutor from './BlocklyExecutor';
import Context, {IDebugContext} from './Context';
import {guid, snakeCaseToUpperCamelCase} from './helpers';

export interface IBlockOptions {
}

export default class Block {
    protected _executor: BlocklyExecutor;
    name: string;
    node: Element;
    blockId: string;

    constructor(executor: BlocklyExecutor, params?: IBlockOptions) {
        this._executor = executor;
    }

    static init(executor: BlocklyExecutor, name: string, node: Element, params?: IBlockOptions): Block {
        const block = new this(executor, params);
        block.name = name;
        block.node = node;
        return block;
    }

    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        return this.executeAllNext(node, path, context, blockContext);
    }

    async executeAllNext(
        node: Element,
        path: string,
        context: Context,
        blockContext: any,
        statement: boolean = false): Promise<any> {
        let statementNumber = 0;
        const childContext = context.getChildContext(blockContext);
        let result;
        while (true) {
            let _childContext;
            if (statement) {
                _childContext = childContext[statementNumber];
                if (!_childContext) {
                    childContext[statementNumber] = {};
                    _childContext = childContext[statementNumber];
                }
            } else {
                _childContext = childContext;
            }
            const child = this.getChildBlock(node);
            let nextNode;
            if (child) {
                nextNode = statement ? this.getNextStatement(child) : null;
                const blockSubtype = child.getAttribute('type');
                if (!('____result' in _childContext)) {
                    path = `${path}.${blockSubtype}`;
                    const obj = await this.getBlockClass(blockSubtype, this._executor.extendBlocks);
                    const Class = obj.default;
                    const blockClass = new Class(this._executor);
                    result = await blockClass.execute(child, path, context, _childContext);
                }
            } else {
                result = null;
            }

            if (nextNode) {
                node = nextNode;
                _childContext.__result = true;
                statementNumber += 1;
            } else {
                context.clearChildContext(blockContext);
                return result;
            }
        }
    }

    private _beforeExecute(node: Element, path: string, context: Context, blockContext: IDebugContext): void {
        this.blockId = node.id;
        // blockContext.__path = path.join('.');
    }

    async execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        this._beforeExecute(node, path, context, blockContext);
        return this._execute(node, path, context, blockContext);
    }

    getChildBlock(node: Element): Element {
        let child;
        if (node) {
            child = node.querySelector('block');
            if (child === null) {
                child = node.querySelector('shadow');
            }
        }
        return child;
    }

    getNextStatement(child: Element): Element {
        return child.querySelector('next');
    }

    private async getBlockClass(blockName: string, extendBlocks: string): Promise<{ default: typeof Block }> {
        try {
            return await import(`../../${extendBlocks}/Blocks/${snakeCaseToUpperCamelCase(blockName)}`);
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(`В ${extendBlocks} нету класса ${snakeCaseToUpperCamelCase(blockName)}`);
        }
        return import(`../Blocks/${snakeCaseToUpperCamelCase(blockName)}`);
    }

    protected _checkStep(context: Context, blockContext: IDebugContext): void {
        if (this._executor.stepByStep) {
            if (this._executor.selected) {
                if (this.blockId === this._executor.selected) {
                    throw new StepForward(this.blockId, context, blockContext);
                }
            } else if (this._executor.nextStep) {
                throw new StepForward(this.blockId, context, blockContext);
            } else if (this.blockId === this._executor.step) {
                if (this._executor.nextStep === false) {
                    throw new StepForward(this.blockId, context, blockContext);
                } else {
                    this._executor.nextStep = true;
                }
            }
        }
    }

    setVariable(context: Context, name: string, value: any): void {
        if (this._executor.multiThreadMode) {
            context.debug.__thread_vars[name] = value;
        }
        context.variables[name] = value;
    }

    static getVariables<T>(context: Context, name: string): T {
        const variable = context.debug.__thread_vars[name];
        if (variable) {
            return variable;
        }
        return context.variables[name] as unknown as T;
    }

    static getMutation(node: Element, mutationName: string, defaultValue: any = null): string {
        const mutation = node.querySelector('mutation');
        if (mutation) {
            return mutation.getAttribute(mutationName) || defaultValue;
        }
        return defaultValue;
    }

    static commandSended(blockContext: IDebugContext): boolean {
        return '__deferred' in blockContext;
    }

    commandsGetResult(commandUuid: string): any {
        const result = this._executor.commandsResult.find(cr => cr !== commandUuid);
        if (!result) {
            throw new Error(`${Block.name} Command no response ${commandUuid}`);
        }
        const _status = result.status;
        const _data = result.data;
        if (!_status || _data) {
            throw new Error(`${Block.name} bad format command result ${commandUuid}`);
        }
        if (_status === 'complete') {
            return _data;
        }
        if (_status === 'error') {
            throw new Error(_data);
        }
        throw new Error(`Not supported command result type ${_status}`);
    }

    commandSend(commandName: string, commandParams: any, context: Context, blockContext: IDebugContext): void {
        const commandsUuid = guid();
        blockContext.__deferred = commandsUuid;
        this._executor.commands.push({
            name: commandName,
            params: commandParams,
            uuid: commandsUuid
        });
        throw new DeferredOperation(commandsUuid, context, blockContext);
    }
}

export class StepForward extends Error {
    constructor(public blockId: string, public context: Context, public blockContext: IDebugContext) {
        super();
    }
}

export class ReturnFromFunction extends Error {}

export class DeferredOperation extends Error {
    constructor(public commandsUuid: string, public context: Context, public blockContext: IDebugContext) {
        super();
    }
}
