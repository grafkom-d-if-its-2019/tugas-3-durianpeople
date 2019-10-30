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
        // Mendefinisikan verteks-verteks
        var vertices = [];
        var cubePoints = [
            [-0.5, -0.5, 0.5],
            [-0.5, 0.5, 0.5],
            [0.5, 0.5, 0.5],
            [0.5, -0.5, 0.5],
            [-0.5, -0.5, -0.5],
            [-0.5, 0.5, -0.5],
            [0.5, 0.5, -0.5],
            [0.5, -0.5, -0.5]
        ];
        var cubeColors = [
            [],
            [1.0, 0.0, 0.0], // merah
            [0.0, 1.0, 0.0], // hijau
            [0.0, 0.0, 1.0], // biru
            [1.0, 1.0, 1.0], // putih
            [1.0, 0.5, 0.0], // oranye
            [1.0, 1.0, 0.0], // kuning
            []
        ];
        var cubeNormals = [
            [],
            [0.0, 0.0, 1.0], // depan
            [1.0, 0.0, 0.0], // kanan
            [0.0, -1.0, 0.0], // bawah
            [0.0, 0.0, -1.0], // belakang
            [-1.0, 0.0, 0.0], // kiri
            [0.0, 1.0, 0.0], // atas
            []
        ];
        function quad(a, b, c, d) {
            var indices = [a, b, c, a, c, d];
            for (var i = 0; i < indices.length; i++) {
                for (var j = 0; j < 3; j++) {
                    vertices.push(cubePoints[indices[i]][j]);
                }
                for (var j = 0; j < 3; j++) {
                    vertices.push(cubeColors[a][j]);
                }
                for (var j = 0; j < 3; j++) {
                    vertices.push(cubeNormals[a][j]);
                }
            }
        }
        quad(1, 0, 3, 2);
        quad(2, 3, 7, 6);
        quad(3, 0, 4, 7);
        quad(4, 5, 6, 7);
        quad(5, 4, 0, 1);
        quad(6, 5, 1, 2);

        console.log(vertices.length);
        console.log(vertices);

        // Membuat vertex buffer object (CPU Memory <==> GPU Memory)
        var vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Membuat sambungan untuk attribute
        var vPosition = gl.getAttribLocation(program, 'vPosition');
        var vColor = gl.getAttribLocation(program, 'vColor');
        var vNormal = gl.getAttribLocation(program, 'vNormal');
        gl.vertexAttribPointer(
            vPosition,    // variabel yang memegang posisi attribute di shader
            3,            // jumlah elemen per atribut
            gl.FLOAT,     // tipe data atribut
            gl.FALSE,
            9 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
            0                                   // offset dari posisi elemen di array
        );
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
            9 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, gl.FALSE,
            9 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(vPosition);
        gl.enableVertexAttribArray(vColor);
        gl.enableVertexAttribArray(vNormal);

        // Membuat sambungan untuk uniform
        var thetaUniformLocation = gl.getUniformLocation(program, 'theta');
        var theta = 0;
        var thetaSpeed = 0.0;
        var axis = [true, true, true];
        var x = 0;
        var y = 1;
        var z = 2;

        // Definisi untuk matriks model
        var mmLoc = gl.getUniformLocation(program, 'modelMatrix');
        var mm = glMatrix.mat4.create();
        glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

        // Definisi untuk matrix view dan projection
        var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
        var vm = glMatrix.mat4.create();
        var pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
        var pm = glMatrix.mat4.create();
        var camera = { x: 0.0, y: 0.0, z: 0.0 };
        glMatrix.mat4.perspective(pm,
            glMatrix.glMatrix.toRadian(90), // fovy dalam radian
            canvas.width / canvas.height,     // aspect ratio
            0.5,  // near
            10.0, // far
        );
        gl.uniformMatrix4fv(pmLoc, false, pm);

        // Uniform untuk pencahayaan
        var dcLoc = gl.getUniformLocation(program, 'diffuseColor');
        var dc = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);  // rgb
        gl.uniform3fv(dcLoc, dc);
        var ddLoc = gl.getUniformLocation(program, 'diffuseDirection');
        var dd = glMatrix.vec3.fromValues(0.5, 3.0, 4.0);  // xyz
        gl.uniform3fv(ddLoc, dd);
        var acLoc = gl.getUniformLocation(program, 'ambientColor');
        var ac = glMatrix.vec3.fromValues(0.2, 0.2, 0.2);
        gl.uniform3fv(acLoc, ac);

        // Uniform untuk modelMatrix vektor normal
        var nmLoc = gl.getUniformLocation(program, 'normalMatrix');

        // Kontrol menggunakan keyboard
        function onKeyDown(event) {
            if (event.keyCode == 189) thetaSpeed -= 0.01;       // key '-'
            else if (event.keyCode == 187) thetaSpeed += 0.01;  // key '='
            else if (event.keyCode == 48) thetaSpeed = 0;       // key '0'
            if (event.keyCode == 88) axis[x] = !axis[x];
            if (event.keyCode == 89) axis[y] = !axis[y];
            if (event.keyCode == 90) axis[z] = !axis[z];
            if (event.keyCode == 38) camera.z -= 0.1;
            else if (event.keyCode == 40) camera.z += 0.1;
            if (event.keyCode == 37) camera.x -= 0.1;
            else if (event.keyCode == 39) camera.x += 0.1;
        }
        document.addEventListener('keydown', onKeyDown);

        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            theta += thetaSpeed;
            if (axis[z]) glMatrix.mat4.rotateZ(mm, mm, thetaSpeed);
            if (axis[y]) glMatrix.mat4.rotateY(mm, mm, thetaSpeed);
            if (axis[x]) glMatrix.mat4.rotateX(mm, mm, thetaSpeed);
            gl.uniformMatrix4fv(mmLoc, false, mm);

            // Perhitungan modelMatrix untuk vektor normal
            var nm = glMatrix.mat3.create();
            glMatrix.mat3.normalFromMat4(nm, mm);
            gl.uniformMatrix3fv(nmLoc, false, nm);

            glMatrix.mat4.lookAt(vm,
                [camera.x, camera.y, camera.z], // di mana posisi kamera (posisi)
                [0.0, 0.0, -2.0], // ke mana kamera menghadap (vektor)
                [0.0, 1.0, 0.0]  // ke mana arah atas kamera (vektor)
            );
            gl.uniformMatrix4fv(vmLoc, false, vm);

            gl.drawArrays(gl.TRIANGLES, 0, 36);
            requestAnimationFrame(render);
        }
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        render();
    }
    global.gl = gl;
}) (window || this); 
