import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export interface ISimpleBlock {
    _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any>;
}

export default class SimpleBlock extends Block implements ISimpleBlock {
    requiredParam: string[] = [];

    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        await this.getArgs(node, path, context, blockContext);
        await this.getFields(node, path, context, blockContext);

        if (!('result' in blockContext)) {
            this._checkStep(context, blockContext);
            this.checkRequiredParamInBlockContext(blockContext);
            blockContext.result = await this._calcValue(node, path, context, blockContext);
        }
        return blockContext.result;
    }

    async getArgs(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<void> {
        const args = SimpleBlock.getNodesArgs(node);
        if (args) {
            for (let i = 0; i < args.length; i++) {
                const _paramName = args[i].getAttribute('name');
                if (!(_paramName in blockContext)) {
                    blockContext[_paramName] = await this.executeAllNext(args[i], `${path}.${_paramName}`, context,
                        blockContext);
                }
            }
        }
    }

    async getFields(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<void> {
        const fields = SimpleBlock.getNodesFields(node);
        if (fields) {
            for (let i = 0; i < fields.length; i++) {
                const _paramName = fields[i].getAttribute('name');
                blockContext[_paramName] = fields[i].textContent;
            }
        }
    }

    checkRequiredParamInBlockContext(blockContext: IDebugContext): void {
        for (const param of this.requiredParam) {
            if (!(param in blockContext)) {
                throw new Error(`required param not defined (${param})`);
            }
        }
    }

    static getNodesArgs(node: Element): NodeListOf<Element> {
        return node.querySelectorAll(`${node.tagName}:scope > value`);
    }

    static getNodesFields(node: Element): NodeListOf<Element> {
        return node.querySelectorAll(`${node.tagName}:scope > field`);
    }

    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        throw new Error('_calc method not implemented');
    }
}