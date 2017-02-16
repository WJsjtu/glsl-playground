/**
 *
 * @param context
 * @param {string} vShader
 * @param {string} fShader
 * @param {bool} autoUse
 * @return {int} program
 */
export default function (context, vShader, fShader, autoUse = true) {

    const gl = context, VERTEX_SHADER_SOURCE = vShader, FRAGMENT_SHADER_SOURCE = fShader;

    const vertexShader = (() => {
        const shader = gl.createShader(gl.VERTEX_SHADER);
        if (shader == null) {
            throw new Error('unable to create vertex shader');
        }
        gl.shaderSource(shader, VERTEX_SHADER_SOURCE);
        gl.compileShader(shader);
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            gl.deleteShader(shader);
            throw new Error('Failed to compile vertex shader: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
    })();

    const fragmentShader = (() => {
        const shader = gl.createShader(gl.FRAGMENT_SHADER);
        if (shader == null) {
            throw new Error('unable to create fragment shader');
        }
        gl.shaderSource(shader, FRAGMENT_SHADER_SOURCE);
        gl.compileShader(shader);
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            gl.deleteShader(shader);
            throw new Error('Failed to compile fragment shader: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
    })();

    const program = gl.createProgram();
    if (!program) {
        throw new Error('Failed to create program.');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        throw new Error('Failed to link program: ' + gl.getProgramInfoLog(program));
    }

    autoUse && gl.useProgram(program);

    return {
        program: program,
        dispose: () => {
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
        }
    };
};