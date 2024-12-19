import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';
import {ReturnFromFunction} from '../Core/Block';

export default class ProceduresIfreturn extends SimpleBlock {
    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        if (blockContext.CONDITION) {
            throw new ReturnFromFunction(blockContext.VALUE);
        }
    }
}