precision mediump float;

attribute vec2 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform float theta;
uniform float scaleX;
uniform float scaleY;
uniform float vCenterX;
uniform float vCenterY;
uniform int which;

void main() {
  fColor = vColor;
  vec3 translate = vec3(-0.5, 0.5, 0.0);
  mat4 translationMatrix = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    translate, 1.0
  );
  mat4 centeringMatrix = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    -vCenterX, -vCenterY, 0.0, 1.0
  );
  mat4 counterCenteringMatrix = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    vCenterX, vCenterY, 0.0, 1.0
  );
  mat4 rotationMatrix = mat4(
    cos(theta), sin(theta), 0.0, 0.0,
    -sin(theta), cos(theta), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  mat4 scalationMatrix = mat4(
    scaleX, 0.0, 0.0, 0.0,
    0.0, scaleY, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  
  gl_Position = counterCenteringMatrix * ((which == 1) ? translationMatrix : (which == 2) ? rotationMatrix : scalationMatrix) * centeringMatrix * vec4(vPosition, 0.0, 1.0);
}
