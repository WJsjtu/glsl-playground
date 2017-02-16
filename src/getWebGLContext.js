import {on as DOM_ON} from 'dom-helpers/events';

/**
 *
 * @param {element} canvas
 * @param options
 * @return {context}
 */
export default function getWebGLContext(canvas, options) {

    /**
     *
     * @param {string} message
     * @return {string}
     */
    const getMessage = (message) => {
        let errorMessage = message;

        if (window.WebGLRenderingContext) {
            errorMessage += `It doesn't appear your computer can support WebGL.\n`;
            errorMessage += `You can read "http://get.webgl.org" for more information.\n`;
        } else {
            errorMessage += `This page requires a browser that supports WebGL.\n`;
            errorMessage += `You can visit "http://get.webgl.org" to upgrade your browser.\n`;
        }

        return errorMessage;
    };


    DOM_ON(canvas, `webglcontextcreationerror`, (event) => {
        throw new Error(getMessage(event.statusMessage ? `Status: ${event.statusMessage}.\n` : 'Unknown error!'));
    });

    const names = [`webgl`, `experimental-webgl`, `webkit-3d`, `moz-webgl`];
    let context = null;
    for (let i = 0; i < names.length; ++i) {
        try {
            context = canvas.getContext(names[i], options);
        } catch (e) {
        }
        if (context) {
            break;
        }
    }

    if (!context) {
        throw new Error(getMessage(`Fail to get webgl context.`));
    }

    return context;
}