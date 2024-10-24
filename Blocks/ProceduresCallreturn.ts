import ProceduresCallnoreturn from './ProceduresCallnoreturn';
import Context, {IDebugContext} from '../Core/Context';

export default class ProceduresCallreturn extends ProceduresCallnoreturn {
    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        return this._execute2(node, path, context, blockContext);
    }
}