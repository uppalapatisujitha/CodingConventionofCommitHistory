# parsing C# code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
_ = require 'underscore'

javaParser = module.exports =
  lang: 'csharp'

  parse: (line, convention, commitUrl) ->
    convention = this.indent line, convention, commitUrl
    convention = this.blockstatement line, convention, commitUrl
    convention = this.constant line, convention, commitUrl
    convention = this.conditionstatement line, convention, commitUrl
    convention = this.argumentdef line, convention, commitUrl
    convention = this.linelength line, convention, commitUrl

  indent: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        {
          key: "tab", display: "Tab",
          code: """
                public string GetSomething()
                {
                    // use tab for indentation
                    return something;
                }
                """
        }
        {
          key: "space", display: "Space",
          code: """
                public string GetSomething()
                {
                  return something;
                }
                """
        }
      ]
      tab: 0
      space: 0
      commits: []
    ) unless convention.indent

    tab = /^\t+.*/
    space = /^\s+.*/

    convention.indent.tab = convention.indent.tab + 1 if tab.test line
    convention.indent.space = convention.indent.space + 1 if space.test line

    convention.indent.commits.push commitUrl if tab.test(line) or space.test(line)
    convention.indent.commits = _.uniq convention.indent.commits
    console.log 'hi'
    convention

  blockstatement: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.blockstatement =
      title: "How to write block statements"
      column: [
        {
          key: "onespace", display: "Curlybrace with one space",
          code: """
                if (height < MIN_HEIGHT) {
                  //..
                }

                while (isTrue) {
                  //..
                }

                switch (foo) {
                  //..
                }
                """
        }
        {
          key: "nospace", display: "Curlybrace with no space",
          code: """
                if (height < MIN_HEIGHT){
                  //..
                }

                while (isTrue){
                  //..
                }

                switch (foo){
                  //..
                }
                """
        }
        {
          key: "newline", display: "Curlybrace at new line",
          code: """
                if (height < MIN_HEIGHT)
                {
                  //..
                }

                while (isTrue)
                {
                  //..
                }

                switch (foo)
                {
                  //..
                }
                """
        }
      ]
      onespace: 0
      nospace: 0
      newline: 0
      commits: []
    ) unless convention.blockstatement

    onespace = /((if|while|switch|try).*\s+{)|(}\s+(else|catch|finally).*\s+{)/
    nospace = /((if|while|switch).*\){)|(try|else|finally){|(}\s*(else|catch|finally).*\){)/
    newline = /((if|while|switch).*\)\s*$)|((if|while|switch).*\)\s*\/[\/\*])|(try|else|finally)\s*\/[\/\*]|(^\s*(else|catch|finally))/

    convention.blockstatement.onespace = convention.blockstatement.onespace + 1 if onespace.test line
    convention.blockstatement.nospace = convention.blockstatement.nospace + 1 if nospace.test line
    convention.blockstatement.newline = convention.blockstatement.newline + 1 if newline.test line

    convention.blockstatement.commits.push commitUrl if onespace.test(line) or nospace.test(line) or newline.test(line)
    convention.blockstatement.commits = _.uniq convention.blockstatement.commits
    convention

  constant: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.constant =
      title: "Constant name"
      column: [
        {
          key: "pascal", display: "Constant is Pascal cased",
          code: """
                const string FooBar = "baz";
                """
        }
        {
          key: "allcaps", display: "Constant name is all caps with underscore(_)",
          code: """
                const string FOO_BAR = "baz";
                """
        }
        {
          key: "notallcaps", display: "Constant name is neither all caps and pascal cased",
          code: """
                const string foo_bar = "baz";

                const string fooBar = "baz";
                """
        }
      ]
      pascal: 0
      allcaps: 0
      notallcaps: 0
      commits: []
    ) unless convention.constant

    pascal = /const\s+\w+\s+([A-Z][a-z0-9]+)+\s*=/
    allcaps = /const\s+\w+\s+([A-Z0-9_]+)+\s*=/
    notallcaps = /const\s+\w+\s+([a-z][A-Za-z0-9_]*)+\s*=/

    convention.constant.pascal = convention.constant.pascal + 1 if pascal.test line
    convention.constant.allcaps = convention.constant.allcaps + 1 if allcaps.test line
    convention.constant.notallcaps = convention.constant.notallcaps + 1 if notallcaps.test line

    convention.constant.commits.push commitUrl if pascal.test(line) or allcaps.test(line) or notallcaps.test(line)
    convention.constant.commits = _.uniq convention.constant.commits
    convention

  conditionstatement: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.conditionstatement =
      title: "How to write conditional statement"
      column: [
        {
          key: "onespace", display: "Condition with one space",
          code: """
                if (true) {
                  //...
                }

                while (true) {
                  //...
                }

                switch (v) {
                  //...
                }
                """
        }
        {
          key: "nospace", display: "Condition with no space",
          code: """
                if(true) {
                  //...
                }

                while(true) {
                  //...
                }

                switch(v) {
                  //...
                }
                """
        }
      ]
      onespace: 0
      nospace: 0
      commits: []
    ) unless convention.conditionstatement

    onespace = /(if|while|switch)\s+\(/
    nospace = /(if|while|switch)\(/

    convention.conditionstatement.onespace = convention.conditionstatement.onespace + 1 if onespace.test line
    convention.conditionstatement.nospace = convention.conditionstatement.nospace + 1 if nospace.test line

    convention.conditionstatement.commits.push commitUrl if onespace.test(line) or nospace.test(line)
    convention.conditionstatement.commits = _.uniq convention.conditionstatement.commits
    convention

  argumentdef: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.argumentdef =
      title: "Arguments definition with one space vs. no space"
      column: [
        {
          key: "onespace", display: "One space",
          code: """
                public void SetName( String name ) {
                  // ...
                }

                if( isTrue ) {}

                while( isTrue ) {}
                """
        }
        {
          key: "nospace", display: "No space",
          code: """
                public void SetName(String name) {
                  // ...
                }

                if(isTrue) {}

                while(isTrue) {}
                """
        }
      ]
      onespace: 0
      nospace: 0
      commits: []
    ) unless convention.argumentdef

    onespace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\s+/
    nospace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\S+/

    convention.argumentdef.onespace = convention.argumentdef.onespace + 1 if onespace.test line
    convention.argumentdef.nospace = convention.argumentdef.nospace + 1 if nospace.test line

    convention.argumentdef.commits.push commitUrl if onespace.test(line) or nospace.test(line)
    convention.argumentdef.commits = _.uniq convention.argumentdef.commits
    convention

  linelength: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.linelength =
      title: "Line length is over 80 characters?"
      column: [
        {
          key: "char80", display: "Line length is within 80 characters.",
          code: "/* width is within 80 characters */"
        }
        {
          key: "char120", display: "Line length is within 120 characters",
          code: "/* width is within 120 characters */"
        }
        {
          key: "char150", display: "Line length is within 150 characters",
          code: "/* width is within 150 characters */"
        }
      ]
      char80: 0
      char120: 0
      char150: 0
      commits: []
    ) unless convention.linelength

    width = line.length
    tabcount = line.split('\t').length - 1
    # assume tab size is 4 space
    width += tabcount * 3

    if width < 80
      convention.linelength.char80 = convention.linelength.char80 + 1
    else if width < 120
      convention.linelength.char120 = convention.linelength.char120 + 1
    else
      convention.linelength.char150 = convention.linelength.char150 + 1

    convention.linelength.commits.push commitUrl
    convention.linelength.commits = _.uniq convention.linelength.commits
    convention

