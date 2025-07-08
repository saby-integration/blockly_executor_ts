import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';

const operations = {
    ADD: (a, b) => a + b,
    MINUS: (a, b) => a - b,
    MULTIPLY: (a, b) => a * b,
    DIVIDE: (a, b) => a / b,
    // tslint:disable-next-line:no-bitwise
    POWER: (a, b) => a ^ b
};

export default class MathArithmetic extends SimpleBlock {
    requiredParam: string[] = ['OP', 'A', 'B'];

    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        return operations[blockContext.OP](blockContext.A, blockContext.B);
    }
}