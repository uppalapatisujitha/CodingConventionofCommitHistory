# parsing Java code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
_ = require 'underscore'

javaParser = module.exports =
  lang: 'java'

  parse: (line, convention, commitUrl) ->
    convention = this.indent line, convention, commitUrl
    convention = this.blockstatement line, convention, commitUrl
    convention = this.constant line, convention, commitUrl
    convention = this.conditionstatement line, convention, commitUrl
    convention = this.argumentdef line, convention, commitUrl
    convention = this.linelength line, convention, commitUrl
    convention = this.staticvar line, convention, commitUrl
    convention = this.finalstaticorder line, convention, commitUrl

  indent: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        {
          key: "tab", display: "Tab",
          code: """
                public String getName() {
                    // use tab for indentation
                    return this.name;
                }
                """
        }
        {
          key: "space", display: "Space",
          code: """
                public String getName() {
                  return this.name;
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
    convention

  blockstatement: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.blockstatement =
      title: "How to write block statement"
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
      title: "Constant name is all caps?"
      column: [
        {
          key: "allcaps", display: "Constant name is all caps with underscore(_)",
          code: """
                final static String FOO_BAR = \"baz\";

                static final String FOO_BAR = \"baz\";
                """
        }
        {
          key: "notallcaps", display: "Constant name is not all caps",
          code: """
                final static String foobar = \"baz\";

                static final String foobar = \"baz\";
                """
        }
      ]
      allcaps: 0
      notallcaps: 0
      commits: []
    ) unless convention.constant

    allcaps = /^\s*\w*\s*(static\s+\w*\s*final\s|final\s+\w*\s*static\s)\w+\s[A-Z0-9_]+(\s|=|;)/
    notallcaps = /^\s*\w*\s*(static\s+\w*\s*final\s|final\s+\w*\s*static\s)\w+\s[a-zA-Z0-9_]+(\s|=|;)/

    convention.constant.allcaps = convention.constant.allcaps + 1 if allcaps.test line
    convention.constant.notallcaps = convention.constant.notallcaps + 1 if not allcaps.test(line) and notallcaps.test line

    convention.constant.commits.push commitUrl if allcaps.test line or (not allcaps.test(line) and notallcaps.test line)
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
                public void setName( String name ) {
                  // ...
                }

                if( isTrue ) {}

                while( isTrue ) {}
                """
        }
        {
          key: "nospace", display: "No space",
          code: """
                public void setName(String name) {
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

  staticvar: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.staticvar =
      title: "Use special prefix for staticvar"
      column: [
        {
          key: "prefix", display: "Special prefix",
          code: "static String _name;"
        }
        {
          key: "noprefix", display: "No special prefix",
          code: "static String name"
        }
      ]
      prefix: 0
      noprefix: 0
      commits: []
    ) unless convention.staticvar

    prefix = /static\s+\w+\s+(_|\$)\w+/
    noprefix = /static\s+\w+\s+[^_$]\w+/

    convention.staticvar.prefix = convention.staticvar.prefix + 1 if prefix.test line
    convention.staticvar.noprefix = convention.staticvar.noprefix + 1 if noprefix.test line

    convention.staticvar.commits.push commitUrl if prefix.test(line) or noprefix.test(line)
    convention.staticvar.commits = _.uniq convention.staticvar.commits
    convention

  finalstaticorder: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.finalstaticorder =
      title: "order for final and static"
      column: [
        {
          key: "accstfin", display: "access modifier - static - final|volatile",
          code: """
                public static final String t1 = "";

                public static transient final String t2 = "";

                transient public static final String t3 = "";
                """
        }
        {
          key: "accfinst", display: "access modifier - final|volatile - static",
          code: """
                public final static String t1 = "";

                public final static transient String t2 = "";

                transient public final static String t3 = "";
                """
        }
        {
          key: "finaccst", display: "final|volatile - access modifier - static",
          code: """
                final public static String t1 = "";

                final public static transient String t2 = "";

                final transient public static String t3 = "";
                """
        }
        {
          key: "staccfin", display: "static - access modifier - final|volatile",
          code: """
                static public final String t1 = "";

                static public transient final String t2 = "";

                static transient public final String t3 = "";
                """
        }
      ]
      accstfin: 0
      accfinst: 0
      finaccst: 0
      staccfin: 0
      commits: []
    ) unless convention.finalstaticorder

    accstfin = /^\w*\s*(public|private|protected){1}\s+\w*\s*(static){1}\s+\w*\s*(final|volatile){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/
    accfinst = /^\w*\s*(public|private|protected){1}\s+\w*\s*(final|volatile){1}\s+\w*\s*(static){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/
    finaccst = /^\w*\s*(final|volatile){1}\s+\w*\s*(public|private|protected){1}\s+\w*\s*(static){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/
    staccfin = /^\w*\s*(static){1}\s+\w*\s*(public|private|protected){1}\s+\w*\s*(final|volatile){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/

    convention.finalstaticorder.accstfin = convention.finalstaticorder.accstfin + 1 if accstfin.test line
    convention.finalstaticorder.accfinst = convention.finalstaticorder.accfinst + 1 if accfinst.test line
    convention.finalstaticorder.finaccst = convention.finalstaticorder.finaccst + 1 if finaccst.test line
    convention.finalstaticorder.staccfin = convention.finalstaticorder.staccfin + 1 if staccfin.test line

    convention.finalstaticorder.commits.push commitUrl if accstfin.test line or accfinst.test line or finaccst.test line or staccfin.test line
    convention.finalstaticorder.commits = _.uniq convention.finalstaticorder.commits
    convention
