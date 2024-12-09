import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';

export default class ControlsForeach extends SimpleBlock {
    requiredParam: string[] = ['VAR', 'LIST'];

    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        if (!('INDEX' in blockContext)) {
            blockContext.INDEX = 0;
            this.setVariable(context, blockContext.VAR, 0);
        }
        if (blockContext.LIST) {
            while (blockContext.INDEX < blockContext.LIST.length) {
                await this.executeAllNext(node.children[2], path, context, blockContext, true);
                blockContext.INDEX += 1;
                this.setVariable(context, blockContext.VAR, blockContext.INDEX);
            }
        }
    }
}