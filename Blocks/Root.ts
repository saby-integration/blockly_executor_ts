import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class Root extends Block {
    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): any {
        return this.executeAllNext(node, path, context, blockContext);
    }
}