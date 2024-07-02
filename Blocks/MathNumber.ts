import SimpleBlock from '../BlockTemplates/SimpleBlock';
import Context, {IDebugContext} from '../Core/Context';

export default class MathNumber extends SimpleBlock {
    requiredParam: string[] = ['NUM'];

    async _calcValue(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        const value = blockContext.NUM;
        const floatValue = parseFloat(value);
        // tslint:disable-next-line:radix
        const intValue = parseInt(String(floatValue));
        if (intValue === floatValue) {
            return intValue;
        }
        return  floatValue;
    }
}