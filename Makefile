DATE=$(shell date +%I:%M%p)
STYLESHEETS = ./public/stylesheets
SASS = ./sass
TMP = ./tmp
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#
CHECK=\033[32m✔\033[39m

build:
	@echo "\n${HR}"
	@echo "Building DidGomezScore..."
	@echo "${HR}\n"
	@mkdir -p ${TMP}
	@echo "Setting up build environment...             ${CHECK} Done"
	@sass ${SASS}/styles-fr.scss ${TMP}/styles-fr.tmp.css --style compressed
	@sass ${SASS}/styles-en.scss ${TMP}/styles-en.tmp.css --style compressed
	@sass ${SASS}/styles.scss ${TMP}/styles.tmp.css --style compressed
	@echo "Compiling SASS...                           ${CHECK} Done"
	@cat ${TMP}/styles.tmp.css ${TMP}/styles-fr.tmp.css > ${STYLESHEETS}/styles-fr.min.css
	@cat ${TMP}/styles.tmp.css ${TMP}/styles-en.tmp.css > ${STYLESHEETS}/styles-en.min.css
	@echo "Building Stylesheets...                     ${CHECK} Done"
	@jshint app.js
	@jshint routes/*.js
	@echo "Running JSHint on javascript...             ${CHECK} Done"
	@rm -Rf ${TMP}
	@echo "Cleaning up build environment...            ${CHECK} Done"
	@echo "\n${HR}"
	@echo "DidGomezScore successfully built at ${DATE}."
	@echo "${HR}\n"
