import Context, {IDebugContext} from '../Core/Context';
import Block from '../Core/Block';

export default class ControlsIf extends Block {
    protected async _execute(node: Element, path: string, context: Context, blockContext: IDebugContext): Promise<any> {
        const ifCount = +Block.getMutation(node, 'elseif', 0) + 1;
        const definedElse = +Block.getMutation(node, 'else', 0);
        let ifComplete = false;
        let result;
        let i = null;
        for (let j = 0; j < ifCount; j++) {
            i = j;
            const _key = `IF${j}`;
            if (_key in blockContext) {
                result = blockContext[_key];
            } else {
                const nodeIf = ControlsIf.getNodeIf(node, j);
                if (!nodeIf) {
                    throw new Error(`Bad ${_key} ${path}`);
                }
                result = await this.executeAllNext(nodeIf, `${path}.if${j}`, context, blockContext);
                blockContext[_key] = result;
            }
            if (result) {
                ifComplete = true;
                break;
            }
        }
        this._checkStep(context, blockContext);
        if (ifComplete && i !== null) {
            const nodeDo = ControlsIf.getNodeDo(node, i);
            if (!nodeDo) return;
            await this.executeAllNext(nodeDo, `${path}.do${i}`, context, blockContext, true);
        } else {
            if (definedElse) {
                const nodeDo = ControlsIf.getNodeElse(node);
                if (!nodeDo) {
                    throw new Error(`Bad else DO ${path}`);
                }
                await this.executeAllNext(nodeDo, `${path}.else`, context, blockContext, true);
            }
        }
    }

    // tslint:disable-next-line:variable-name
    static getNodeIf(node: Element, number: number): Element {
        return node.querySelector(`value[name=IF${number}]`);
    }

    // tslint:disable-next-line:variable-name
    static getNodeDo(node: Element, number: number): Element {
        return node.querySelector(`statement[name=DO${number}]`);
    }

    static getNodeElse(node: Element): Element {
        return node.querySelector('statement[name=ELSE]');
    }
}