index.html: dist/main.js

dist/main.js: src/Main.elm
	elm make --output $@ $<
