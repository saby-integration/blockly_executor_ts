import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';

export default class LogicCompare extends SimpleBlock {
    requiredParam: string[] = ['A', 'B', 'OP'];

    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        const operation = blockContext.OP;
        if (operation === 'EQ') {
            return  blockContext.A === blockContext.B;
        } else if (blockContext.OP === 'NEQ') {
            return blockContext.A !== blockContext.B;
        }
        throw new Error(`LogicCompare operation '${operation}' not supported`);
    }
}