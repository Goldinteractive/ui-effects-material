-include ui-dotfiles/Makefile

BABEL=./node_modules/.bin/babel

build:
	@ $(BABEL) src/index.js > src/index-tmp.js
	@ cat \
		src/frag/start.frag \
		src/index-tmp.js \
		src/frag/end.frag \
		> index.js
	@ rm src/index-tmp.js
