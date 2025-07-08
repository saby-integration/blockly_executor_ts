import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';

export default class LogicBoolean extends SimpleBlock {
    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        return blockContext.BOOL === 'TRUE';
    }
}