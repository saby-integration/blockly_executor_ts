import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class ListsCreateWith extends Block {
    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        const totalSize = ListsCreateWith.getListSize(node);
        let result = [];
        if (!totalSize) {
            return result;
        }
        if (!('value' in blockContext)) {
            blockContext.value = [];
        }
        const currentSize = blockContext.value.length;
        if (currentSize !== totalSize) {
            for (let j = currentSize; j < totalSize; j++) {
                const nodeValue = ListsCreateWith.getNodeAdd(node, j);
                if (!nodeValue) {
                    throw new Error(`плохой блок ADD${j}`);
                }
                result = await this.executeAllNext(nodeValue, `${path}.${j}`, context, blockContext);
                blockContext.value.push(result);
            }
        }
        this._checkStep(context, blockContext);
        return blockContext.value.join(',');
    }

    static getListSize(node: Element): number {
        const mutation = node.querySelector('mutation');
        if (!mutation) {
            return 0;
        }
        return +mutation.getAttribute('items') || 0;
    }

    // tslint:disable-next-line:variable-name
    static getNodeAdd(node: Element, number: number): Element {
        return node.querySelector(`${node.tagName}[type=${node.getAttribute('type')}] > value[name=ADD${number}]`);
    }
}