import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class VariablesGet extends SimpleBlock {
    requiredParam: string[] = ['VAR'];

    // tslint:disable-next-line:max-line-length
    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<string | number> {
        const variable = Block.getVariables<string | number>(context, blockContext.VAR);
        if (variable !== null || variable !== undefined) {
            return variable;
        }
        throw new Error('Variable VAR not defined');
    }
}