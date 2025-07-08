import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class Text extends Block {
    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        return node.children[0].textContent;
    }
}
