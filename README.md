# Minimalistic SCORM-based exam template for e-learning

This repository contains template files in order to prepare SCORM 1.2 LMS exam for e-learning purposes. All content-based files are written HTML.

Whole zipped repository can be instantly imported as a SCORM package in Moodle and OLAT.

## Features and libraries

 * Look & feel: [Bootstrap](http://getbootstrap.com),
 * Math notation: [MathJax](https://www.mathjax.org),
 * Code syntax highlighting: [SyntaxHighlighter](http://alexgorbatchev.com/SyntaxHighlighter),
 * Toast messages to check connection with LMS: [jQuery toaster](https://github.com/scottoffen/jquery.toaster),
 * Text decoder: [Web Toolkit](http://www.webtoolkit.info/),
 * Exam: single and multiple choice.

The exam is designed for one-time form send (all UI is blocked and connection with LMS is closed).

All submitted answers (also with correct answers) can be displayed in Moodle/OLAT per user.

## Preview

 * [Exam](http://andre-wojtowicz.github.io/elearning-scorm-exam-template/materials/exam.html).

Note that in the preview you do not have connection to LMS system, so an error will be displayed by toaster plugin.

### Example result

| element | value |
|---|---|
| cmi.comments | Wed Jan 20 2016 17:53:32 GMT+0100 |
| cmi.core.lesson_status | passed |
| cmi.core.score.max | 32 |
| cmi.core.score.min | 0 |
| cmi.core.score.raw | 30 |
| cmi.core.total_time | 3 min 40 sec |
| ... | ... |
| cmi.interactions_4.correct_responses_0.pattern | c |
| cmi.interactions_4.id | 1 |
| cmi.interactions_4.result | correct |
| cmi.interactions_4.student_response | c |
| cmi.interactions_4.type | choice |
| ... | ... |
 
## Brief how-to

 * `imsmanifest.xml` - defines tree of modules (practically nothing to change here).
 * `materials/exam.html` - header and footer have CSS and JS code to proper load the libraries; main part of body has quiz questions; the beginning of body has list of correct answers.

Answers can be either in plain or obfuscated form. You may see in browsers debugger how the obfuscation is done - check `StringED.encode()` and `StringED.decode()` functions in `materials/js/webtoolkit.js`.
