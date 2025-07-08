import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class TextJoin extends Block {
    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        const textCount = +Block.getMutation(node, 'items', 0);
        let result = '';
        for (let j = 0; j < textCount; j++) {
            const _key = `ADD${j}`;
            if (_key in blockContext) {
                result = blockContext[_key];
            } else {
                const nodeText = TextJoin.getNodeText(node, j);
                const nextNodeResult = await this.executeAllNext(nodeText, `${path}.add${j}`, context, blockContext);
                result += nextNodeResult;
            }
        }
        return result;
    }

    // tslint:disable-next-line:variable-name
    static getNodeText(node: Element, number: number): Element {
        return node.querySelector(`value[name=ADD${number}]`);
    }
}