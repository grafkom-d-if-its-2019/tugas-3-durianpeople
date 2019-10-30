/// <reference path="libs/glUtils.js" />
/// <reference path="libs/signals.js" />

(function (global) {
    var sl = new SL({ callback: function () { main(); } });
    function main() {
        /** @type {HTMLCanvasElement} */
        var canvas = document.getElementById("glcanvas");
        var gl = glUtils.checkWebGL(canvas);

        var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, sl.Shaders.v1.vertex);
        var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, sl.Shaders.v1.fragment);
        var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

        { // VARIABLES
            var theta = 0;
            var difference = 0.0028;
            var scaleX = 1.0;
            var scaleY = 1.0;
            var scaleX_r = 1.0;
            var melebar = 1.0;
        }

        { // MODEL DEFINITIONS
            var w_outline = new Float32Array([
                -1, 0.4,// A
                -0.8325806962992, -0.2982197120845,// C
                -0.6541354173132, -0.2982197120845,// D
                -0.4981347345065, -0.1630338946708,// G
                -0.3405043209135, -0.2928122793879,// I
                -0.1804293111413, -0.2928122793879,// L
                0, 0.4,// K
                -0.1782813400171, 0.3885242403769,// J
                -0.3513191863066, -0.1005892984915,// H
                -0.5027273018099, 0.0262262497083,// F
                -0.6541354173132, -0.1089595677054,// E
                -0.7947286674234, 0.39933910577,// B
            ]);

            var w_fill = new Float32Array([
                0, 0.4,// A
                0.2052713325766, 0.39933910577,// B
                0.1674193037008, -0.2982197120845,// C
                0.3458645826868, -0.1089595677054,// E
                0.3458645826868, -0.2982197120845,// D
                0.5018652654935, -0.1630338946708,// G
                0.3458645826868, -0.1089595677054,// E
                0.4972726981901, 0.0262262497083,// F
                0.5018652654935, -0.1630338946708,// G
                0.6486808136934, -0.1005892984915,// H
                0.6594956790865, -0.2928122793879,// I
                0.8195706888587, -0.2928122793879,// L
                0.6486808136934, -0.1005892984915,// H
                0.8217186599829, 0.3885242403769,// J
                0.8195706888587, -0.2928122793879,// L
                1, 0.4,// K
            ]);
        }

        { // UNIFORM LOCATION
            var thetaUniformLocation = gl.getUniformLocation(program, 'theta');
            var scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
            var scaleYUniformLocation = gl.getUniformLocation(program, 'scaleY');
            var vCenterXLocation = gl.getUniformLocation(program, 'vCenterX');
            var vCenterYLocation = gl.getUniformLocation(program, 'vCenterY');
            var whichUniformLocation = gl.getUniformLocation(program, 'which');
        }

        { // RENDER
            gl.uniform1f(scaleXUniformLocation, scaleX);
            gl.uniform1f(scaleYUniformLocation, scaleY);

            function render() {
                glUtils.clear(gl);

                theta += difference;
                glUtils.draw(gl, program, gl.LINE_LOOP, w_outline, 2, 2, function (gl) {
                    gl.uniform1f(thetaUniformLocation, theta);
                    gl.uniform1i(whichUniformLocation, 2);
                    gl.uniform1f(vCenterXLocation, -0.49891469942);
                    gl.uniform1f(vCenterYLocation, 0.004953571);
                    return gl;
                });
                if (scaleX >= 1.0) melebar = -1.0;
                else if (scaleX <= -1.0) melebar = 1.0;
                scaleX += difference * melebar;
                glUtils.draw(gl, program, gl.TRIANGLE_STRIP, w_fill, 2, 2, function (gl) {
                    gl.uniform1f(scaleXUniformLocation, scaleX);
                    gl.uniform1i(whichUniformLocation, 3);
                    gl.uniform1f(vCenterXLocation, 0.45806280985);
                    gl.uniform1f(vCenterYLocation, -0.03787201176);
                    return gl;
                });


                requestAnimationFrame(render);
            }
            render();
        }
        global.gl = gl;
    }
})(window || this); 