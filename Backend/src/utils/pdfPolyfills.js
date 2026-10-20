/**
 * Polyfills for browser APIs required by pdfjs-dist / pdf-parse in headless/serverless environments
 * (AWS Lambda, Vercel Serverless Functions) where native @napi-rs/canvas is not bundled or available.
 */

if (typeof globalThis.DOMMatrix === "undefined") {
    class DOMMatrix {
        constructor(init) {
            if (Array.isArray(init) && init.length === 6) {
                this.a = init[0]; this.b = init[1]; this.c = init[2]; this.d = init[3]; this.e = init[4]; this.f = init[5];
                this.m11 = init[0]; this.m12 = init[1]; this.m13 = 0; this.m14 = 0;
                this.m21 = init[2]; this.m22 = init[3]; this.m23 = 0; this.m24 = 0;
                this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
                this.m41 = init[4]; this.m42 = init[5]; this.m43 = 0; this.m44 = 1;
            } else if (Array.isArray(init) && init.length === 16) {
                this.m11 = init[0]; this.m12 = init[1]; this.m13 = init[2]; this.m14 = init[3];
                this.m21 = init[4]; this.m22 = init[5]; this.m23 = init[6]; this.m24 = init[7];
                this.m31 = init[8]; this.m32 = init[9]; this.m33 = init[10]; this.m34 = init[11];
                this.m41 = init[12]; this.m42 = init[13]; this.m43 = init[14]; this.m44 = init[15];
                this.a = this.m11; this.b = this.m12; this.c = this.m21; this.d = this.m22; this.e = this.m41; this.f = this.m42;
            } else {
                this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
                this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
                this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
                this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
                this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;
            }
            this.is2D = true;
            this.isIdentity = true;
        }
        multiply(other) { return this; }
        translate(tx = 0, ty = 0, tz = 0) { return this; }
        scale(sx = 1, sy = sx, sz = 1) { return this; }
        rotate(angle = 0) { return this; }
        rotateAxisAngle(x = 0, y = 0, z = 0, angle = 0) { return this; }
        skewX(sx = 0) { return this; }
        skewY(sy = 0) { return this; }
        flipX() { return this; }
        flipY() { return this; }
        inverse() { return this; }
        transformPoint(p) { return p; }
        toFloat32Array() { return new Float32Array([this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44]); }
        toFloat64Array() { return new Float64Array([this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44]); }
        toString() { return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`; }
        static fromMatrix(other) { return new DOMMatrix(); }
        static fromFloat32Array(arr) { return new DOMMatrix(Array.from(arr)); }
        static fromFloat64Array(arr) { return new DOMMatrix(Array.from(arr)); }
    }
    globalThis.DOMMatrix = DOMMatrix;
    global.DOMMatrix = DOMMatrix;
}

if (typeof globalThis.ImageData === "undefined") {
    class ImageData {
        constructor(width = 0, height = 0) {
            this.width = width;
            this.height = height;
            this.data = new Uint8ClampedArray(width * height * 4);
        }
    }
    globalThis.ImageData = ImageData;
    global.ImageData = ImageData;
}

if (typeof globalThis.Path2D === "undefined") {
    class Path2D {
        addPath() {}
        closePath() {}
        moveTo() {}
        lineTo() {}
        bezierCurveTo() {}
        quadraticCurveTo() {}
        arc() {}
        rect() {}
    }
    globalThis.Path2D = Path2D;
    global.Path2D = Path2D;
}

if (typeof globalThis.DOMPoint === "undefined") {
    class DOMPoint {
        constructor(x = 0, y = 0, z = 0, w = 1) {
            this.x = x; this.y = y; this.z = z; this.w = w;
        }
    }
    globalThis.DOMPoint = DOMPoint;
    global.DOMPoint = DOMPoint;
}

if (typeof globalThis.DOMRect === "undefined") {
    class DOMRect {
        constructor(x = 0, y = 0, width = 0, height = 0) {
            this.x = x; this.y = y; this.width = width; this.height = height;
            this.top = y; this.left = x; this.right = x + width; this.bottom = y + height;
        }
    }
    globalThis.DOMRect = DOMRect;
    global.DOMRect = DOMRect;
}

// Safely intercept require("@napi-rs/canvas") if the native binary is missing
const Module = require("module");
const origRequire = Module.prototype.require;
Module.prototype.require = function (id) {
    if (id === "@napi-rs/canvas") {
        try {
            return origRequire.apply(this, arguments);
        } catch {
            return {
                DOMMatrix: globalThis.DOMMatrix,
                Path2D: globalThis.Path2D,
                ImageData: globalThis.ImageData,
                DOMPoint: globalThis.DOMPoint,
                DOMRect: globalThis.DOMRect,
                createCanvas: (w, h) => ({
                    getContext: () => ({
                        drawImage: () => {},
                        getImageData: () => ({ data: new Uint8ClampedArray(w * h * 4) })
                    }),
                    width: w,
                    height: h
                })
            };
        }
    }
    return origRequire.apply(this, arguments);
};

module.exports = {
    DOMMatrix: globalThis.DOMMatrix,
    ImageData: globalThis.ImageData,
    Path2D: globalThis.Path2D,
    DOMPoint: globalThis.DOMPoint,
    DOMRect: globalThis.DOMRect
};
