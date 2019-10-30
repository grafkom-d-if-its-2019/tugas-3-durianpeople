<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Belajar WebGL</title>
    <style>
        /* * {
            margin: 0;
            padding: 0;
        }
        html,
        body {
            width: 100%;
            height: 100%;
        } */

        canvas {
            display: block;
            /* width: 100%;
            height: 100%; */
        }
    </style>
</head>

<body>
    <canvas id="glcanvas" width="640" height="640">
        Browser Anda tidak mendukung HTML5 <code>&lt;canvas&gt;</code>.
    </canvas>
    <script name="shader" data-src="vertex_advanced.glsl" data-type="vertex" data-version="v1"></script>
    <script name="shader" data-src="fragment.glsl" data-type="fragment" data-version="v1"></script>
    <script type="text/javascript" src="libs/signals.js"></script>
    <script type="text/javascript" src="libs/glUtils.js"></script>
    <script type="text/javascript" src="index.js"></script>
</body>

</html>