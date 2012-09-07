DATE=$(shell date +%I:%M%p)
STYLESHEETS = ./public/stylesheets
SASS = ${STYLESHEETS}/sass
TMP = ./tmp
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#

build:
	@echo "\n${HR}"
	@echo "Building DidGomezScore..."
	@echo "${HR}\n"
	@echo "Setting up build environment..."
	@mkdir -p ${TMP}
	@echo "Compiling SASS..."
	@sass ${SASS}/styles-fr.scss ${TMP}/styles-fr.tmp.css --style compressed
	@sass ${SASS}/styles-en.scss ${TMP}/styles-en.tmp.css --style compressed
	@sass ${SASS}/styles.scss ${TMP}/styles.tmp.css --style compressed
	@echo "Building Stylesheets..."
	@cat ${TMP}/styles.tmp.css ${TMP}/styles-fr.tmp.css > ${STYLESHEETS}/styles-fr.min.css
	@cat ${TMP}/styles.tmp.css ${TMP}/styles-en.tmp.css > ${STYLESHEETS}/styles-en.min.css
	@echo "Running JSHint on javascript..."
	@jshint app.js
	@jshint routes/*.js
	@echo "Cleaning up build environment..."
	@rm -Rf ${TMP}
