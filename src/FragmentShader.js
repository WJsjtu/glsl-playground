import getWebGLContext from './getWebGLContext';
import loadShaders from './loadShaders';
require('raf').polyfill();

export default class FragmentShader {

    constructor(element) {
        this.element = element;
        this.context = getWebGLContext(element);
        this.diposeCalls = [];
    }

    static V_SHADER_SOURCE =
        'attribute vec4 a_position;\n' +
        'void main() {\n' +
        '  gl_Position = a_position;\n' +
        '}\n';

    static TIME_VARIABLE_NAME = 'u_time';

    static RESOLUTION_VARIABLE_NAME = 'u_resolution';

    execute(fShaderSource) {
        const gl = this.context;
        if (!gl) return;


        this.dispose();

        const loadResult = loadShaders(gl, FragmentShader.V_SHADER_SOURCE, fShaderSource);

        this.diposeCalls.push(loadResult.dispose);

        const program = loadResult.program;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        const u_time_location = gl.getUniformLocation(program, FragmentShader.TIME_VARIABLE_NAME);
        if (!u_time_location) {
            throw new Error('Failed to get the storage location of ' + FragmentShader.TIME_VARIABLE_NAME);
        }

        var u_resolution_location = gl.getUniformLocation(program, FragmentShader.RESOLUTION_VARIABLE_NAME);
        if (!u_resolution_location) {
            throw new Error('Failed to get the storage location of ' + FragmentShader.RESOLUTION_VARIABLE_NAME);
        }

        const vertices = new Float32Array([
            -1.0, 1.0,
            1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0
        ]);

        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            throw new Error('Failed to create the buffer object');
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        this.diposeCalls.push(() => {
            gl.deleteBuffer(vertexBuffer);
        });


        const a_position_location = gl.getAttribLocation(program, 'a_position');
        if (a_position_location < 0) {
            throw new Error('Failed to get the storage location of a_position');
        }

        gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_position_location);

        this.diposeCalls.push(() => {
            gl.disableVertexAttribArray(a_position_location);
        });


        window.cancelAnimationFrame(this.animateHandle);

        const startTime = +(new Date());

        const _this = this;

        (function tick() {
            gl.uniform1f(u_time_location, (+(new Date()) - startTime) / 1000);
            gl.uniform2f(u_resolution_location, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            _this.animateHandle = window.requestAnimationFrame(tick);
        })();

    }

    dispose() {
        window.cancelAnimationFrame(this.animateHandle);
        this.diposeCalls.reverse().forEach((func) => {
            if (typeof func === 'function') {
                func();
            }
        });

        this.diposeCalls = [];
    }
}