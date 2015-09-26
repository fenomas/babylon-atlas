#!/bin/sh
set -ex
git checkout gh-pages
git merge -X theirs master -m "Merge branch 'master' into gh-pages"
browserify example/example.js > example/bundle.js
git add example/bundle.js
git commit example/bundle.js -m "Regenerate bundle.js from deploy script"
git checkout master
