#ifdef GL_ES
precision mediump float;
#endif

uniform float progress; // From 0.0 to 1.0 (controls the wipe progress)
uniform vec2 resolution;
uniform sampler2D uMainSampler;

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution;

    // Determine wipe based on `progress`
    if (uv.x < progress) {
        gl_FragColor = texture2D(uMainSampler, uv);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Transparent
    }
}
