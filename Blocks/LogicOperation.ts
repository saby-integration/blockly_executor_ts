import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';

export default class LogicOperation extends SimpleBlock {
    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        if (blockContext.OP === 'ADD') {
            return  blockContext.A && blockContext.B;
        } else if (blockContext.OP === 'OR') {
            return blockContext.A || blockContext.B;
        }
        throw new Error(`LogicCompare operation '${blockContext.OP}' not supported`);
    }
}