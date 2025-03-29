import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class ProceduresDefnoreturn extends Block {
    // tslint:disable-next-line:max-line-length
    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<void> {
        this._checkStep(context, blockContext);
        const code = ProceduresDefnoreturn.getNodeStack(node);
        if (code) {
            await this.executeAllNext(code, `${path}.${this.name}`, context, blockContext, true);
        }
    }

    static getFuncName(node: Element): string {
        return node.querySelector('field[name=NAME]').textContent;
    }

    static getNodeStack(node: Element): Element {
        return node.querySelector('statement[name=STACK]');
    }
}