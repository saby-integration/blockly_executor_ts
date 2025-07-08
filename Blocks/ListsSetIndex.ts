import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class ListsSetIndex extends SimpleBlock {
    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        const array = Block.getVariables<any[]>(context, blockContext.VAR);
        const mode = blockContext.MODE;
        const where = blockContext.WHERE;
        if (mode === 'SET') {
            if (where === 'FROM_START') {
                array[`${blockContext.AT}`] = blockContext.TO;
                return;
            } else if (where === 'FROM_END') {
                array[`${blockContext.AT * -1}`] = blockContext.TO;
                return;
            } else if (where === 'FIRST') {
                throw new Error(`block ${ListsSetIndex.name} where ${where}`);
            } else if (where === 'LAST') {
                array.push(blockContext.TO);
            } else if (where === 'RANDOM') {
                throw new Error(`block ${ListsSetIndex.name} where ${where}`);
            } else {
                throw new Error(`block ${ListsSetIndex.name} where ${where}`);
            }
        } else {
            throw new Error(`block ${ListsSetIndex.name} mode ${mode}`);
        }
    }
}