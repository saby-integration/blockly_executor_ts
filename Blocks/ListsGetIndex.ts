import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class ListsGetIndex extends SimpleBlock {
    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        const array = Block.getVariables<any[]>(context, blockContext.VAR);
        const mode = blockContext.MODE;
        const where = blockContext.WHERE;
        if (mode === 'GET') {
            if (where === 'FROM_START') {
                return array[`${blockContext.AT}`];
            } else if (where === 'FROM_END') {
                throw new Error(`block ${ListsGetIndex.name} where ${where}`);
            } else if (where === 'FIRST') {
                throw new Error(`block ${ListsGetIndex.name} where ${where}`);
            } else if (where === 'LAST') {
                throw new Error(`block ${ListsGetIndex.name} where ${where}`);
            } else if (where === 'RANDOM') {
                throw new Error(`block ${ListsGetIndex.name} where ${where}`);
            } else {
                throw new Error(`block ${ListsGetIndex.name} where ${where}`);
            }
        } else if (mode === 'GET_REMOVE') {
            throw new Error(`block ${ListsGetIndex.name} mode ${where}`);
        } else if (mode === 'REMOVE') {
            throw new Error(`block ${ListsGetIndex.name} mode ${where}`);
        } else {
            throw new Error(`block ${ListsGetIndex.name} mode ${where}`);
        }
    }
}