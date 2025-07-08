import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';

export default class VariablesSet extends SimpleBlock {
    requiredParam: string[] = ['VAR'];

    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<void> {
        this.setVariable(context, blockContext.VAR, blockContext.VALUE);
    }
}