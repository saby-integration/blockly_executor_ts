import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class ProceduresCallnoreturn extends Block {
    static getParams(node: Element): [string, string[], Element | null] {
        const mutation = node.querySelector('mutation');
        if (!mutation) {
            throw new Error('Не поддерживаемый callnoreturn');
        }
        const funcName = mutation.getAttribute('name');
        const argsNameNodes = mutation.querySelectorAll('arg');
        const args: string[] = [];
        let valueNodes: Element | null = null;
        if (argsNameNodes) {
            const countArgs = argsNameNodes.length;
            for (let i = 0; i < countArgs; i++) {
                args.push(argsNameNodes[i].getAttribute('name'));
            }
            valueNodes = node.querySelector('value');
        }
        return [funcName, args, valueNodes];
    }

    // tslint:disable-next-line:max-line-length
    protected async _execute2(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
       try {
           const [endpoint, args, values] = ProceduresCallnoreturn.getParams(node);
           if (values) {
               for (let i = 0; i < args.length; i++) {
                   if (!(args[i] in blockContext)) {
                       const _value = await this.executeAllNext(values[i], `${path}.${i}`, context, blockContext);
                       this.setVariable(context, args[i], _value);
                       blockContext[args[i]] = _value;
                   }
               }
           }
           const handler = this._executor.functions[endpoint];
           this._checkStep(context, blockContext);
           return handler.execute(handler.node, path, context, blockContext);
       } catch (e) {
            this._checkStep(context, blockContext);
            context.clearChildContext(blockContext);
            return e.message;
       }
    }

    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        await this._execute2(node, path, context, blockContext);
        return this.getNextStatement(node);
    }
}