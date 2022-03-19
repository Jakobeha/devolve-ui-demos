#!/bin/bash
pnpm run codegen || exit 1

# https://gist.github.com/vlucas/1a155a9b5ece5eb36d54

GIT_REPO_URL=$(git config --get remote.origin.url)

mkdir .deploy
cp -R site/* .deploy
cp -R out/app/* .deploy/scripts
cp -R assets/* .deploy/assets
cd .deploy || exit 1
git init .
git remote add github "$GIT_REPO_URL"
git checkout -b gh-pages
git add .
git commit -am "Static site deploy"
git push github gh-pages --force
cd ..
rm -rf .deploy
