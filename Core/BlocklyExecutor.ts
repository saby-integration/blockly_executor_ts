import ProceduresDefnoreturn from '../Blocks/ProceduresDefnoreturn';
import ProceduresDefreturn from '../Blocks/ProceduresDefreturn';
import Root from '../Blocks/Root';
import Block from './Block';
import Context from './Context';

export interface IBlocklyExecutorOptions {
    debug: boolean;
    blocks: string;
    step?: string;
    selected?: any;
}

export type Vareables = {[key: string]: string | number};
export type Functions = {[key: string]: Block};

export default class BlocklyExecutor {
    private _root: Document;
    functions: Functions = {};
    private _variables: Vareables;
    private _robot: Functions[0];
    step: string;
    extendBlocks: string;
    stepByStep: boolean;
    _selected: any;
    selected: any;
    nextStep: boolean;
    multiThreadMode: boolean = false;
    commands: any[] = [];
    commandsResult: any[] = [];

    constructor(options?: IBlocklyExecutorOptions) {
        this.stepByStep = options.debug;
        this.extendBlocks = options.blocks;
        this.step = options.step;
        this._selected = options.selected;
        this.selected = this.step === this._selected ? null : this._selected;
        this.nextStep = (this.stepByStep && !this.step) ? true : null;
    }

    async execute(workspaceXml: string, context: Context, endpoint: string = null): Promise<any> {
        try {
            const XmlParser = new window.DOMParser();
            this._root = XmlParser.parseFromString(workspaceXml, 'text/xml');
            this.readProceduresAndFunctions();
            this._variables = this.readVariables();
            if (endpoint) {
                this._robot = this.functions[endpoint];
            } else {
                const robot = this.functions.main;
                if (robot) {
                    this._robot = robot;
                } else {
                    this._robot = Root.init(this, '', this._root);
                }
            }
            context.operation.commands = [];

            if (context.deferred) {
                this._executeDeferred(this._robot, context);
            }
            context.checkCommandLimit();

            context.operation.data = await this._robot.execute(this._robot.node, '', context, context.debug);
            context.operation.variables = context.variables;
            context.operation.status = 'complete';
        } catch (error) {
            if (error.context) {
                context.operation.step = error.blockId;
                context.operation.data = error.blockContext;
                context.operation.variables = error.context.variables;
            } else {
                context.operation.status = 'error';
                context.operation.data = `${error.message} ${error.stack}`;
            }
        }
        context.operation.commands = this.commands;
        return context;
    }

    _executeDeferred(robot: Functions[0], context: Context): void {
        const _deferred = context.deferred;
        context.operation.commands = [];
        const _delete = [];
        for (let i = 0; i < _deferred.length; i++) {
            const _context = context.initDeferred(_deferred[i]);
            robot.execute(this._robot.node, '', _context, _context.debug);
            _delete.push(i);
        }
        _delete.reverse();
        for (const elem of _delete) {
            context.deferred.filter(el => el !== elem);
        }
    }

    readProceduresAndFunctions(): void {
        this._root.querySelectorAll('block[type=procedures_defreturn]')
            .forEach((node) => {
                const name = node.querySelector('field[name=NAME]').textContent;
                this.functions[name] = ProceduresDefreturn.init(this, name, node);
            });

        this._root.querySelectorAll('block[type=procedures_defnoreturn]')
            .forEach((node) => {
                const name = node.querySelector('field[name=NAME]').textContent;
                this.functions[name] = ProceduresDefnoreturn.init(this, name, node);
            });
    }

    readVariables(): Vareables {
        const result = {};
        this._root.querySelectorAll('variables > variable')
            .forEach(node => {
                const name = node.textContent;
                result[name] = null;
            });
        return result;
    }
}