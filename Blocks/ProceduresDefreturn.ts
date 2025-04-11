import ProceduresDefnoreturn from './ProceduresDefnoreturn' ;
import Context, {IDebugContext} from '../Core/Context';

export default class ProceduresDefreturn extends ProceduresDefnoreturn {
    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        await super._execute(node, path, context, blockContext);
        const _returnNode = ProceduresDefreturn.getNodeReturn(node);
        return this.executeAllNext(_returnNode, `${path}.${this.name}`, context, blockContext);
    }

    static getNodeReturn(node: Element): Element {
        return node.querySelector('value[name=RETURN]');
    }
}