/*
MIT License

Copyright (c) 2021 Jonathan Browne

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

let workers = [];
let bigSum = 0;
let callbacks = [];
function setRunningWorkers(numWorkers) {
    while (workers.length > numWorkers) {
        workers.pop().terminate();
    }
    while (workers.length < numWorkers) {
        let worker = new Worker(URL.createObjectURL(
            new Blob([ `
            while (true) {
                let sum = 0;
                for (let i = 0; i < 100000; i++) {
                    sum += Math.random();
                }
                postMessage(sum);
            }
            `
            ])
        ));
        worker.addEventListener("error", function(e) {
            console.error(e);
        });
        worker.addEventListener("message", function(e) {
            bigSum += e.data;
            document.getElementById("sum").innerText = bigSum;

            let now = new Date().getTime();
            callbacks.push(now);
            while (callbacks[0] < now - 1000) callbacks.shift();
            document.getElementById("persec").innerText = callbacks.length;
        });
        workers.push(worker);
    }
}
function onLoad() {
    document.getElementById("threadcount").addEventListener("change", function() {
        setRunningWorkers(this.value);
    });
}
addEventListener("load", onLoad);
