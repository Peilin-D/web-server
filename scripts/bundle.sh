#!/usr/bin/bash

set -e

browserify static/lib/upload.js -o static/bundles/upload.js
browserify static/lib/jiansuo.js -o static/bundles/jiansuo.js
browserify static/lib/wenzhen.js -o static/bundles/wenzhen.js
browserify static/lib/chufang.js -o static/bundles/chufang.js
# browserify static/lib/jiansuo.js static/lib/julei.js static/lib/register.js static/lib/relation.js \
#            static/lib/tuijian.js static/lib/wenzhen.js static/lib/panel.js \
#            -o static/bundles/panel.js