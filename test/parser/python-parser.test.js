// Generated by CoffeeScript 1.10.0
(function() {
  var parser, should;

  should = require('should');

  parser = require('../../src/parser/python-parser');

  describe('python-parser >', function() {
    describe('indent >', function() {
      it('check space indent #1', function() {
        var convention;
        convention = parser.indent('a = 1;', {});
        return convention.indent.space.should.equal(0);
      });
      it('check space indent #2', function() {
        var convention;
        convention = parser.indent('  a = 1;', {});
        return convention.indent.space.should.equal(1);
      });
      it('check space indent #3', function() {
        var convention;
        convention = parser.indent('  a = 1;', {});
        return convention.indent.space.should.equal(1);
      });
      it('check space indent #4', function() {
        var convention;
        convention = parser.indent('   a = 1;', {});
        return convention.indent.space.should.equal(1);
      });
      it('check tab indent #1', function() {
        var convention;
        convention = parser.indent('\ta = 1;', {});
        return convention.indent.tab.should.equal(1);
      });
      it('check tab indent #2', function() {
        var convention;
        convention = parser.indent('\t\ta = 1;', {});
        return convention.indent.tab.should.equal(1);
      });
      it('check tab indent #3', function() {
        var convention;
        convention = parser.indent('\t\t  a = 1;  ', {});
        return convention.indent.tab.should.equal(1);
      });
      it('check tab indent #4', function() {
        var convention;
        convention = parser.indent('  \ta = 1;', {});
        return convention.indent.tab.should.equal(0);
      });
      return it('check tab indent #5', function() {
        var convention;
        convention = parser.indent('a = 1;', {});
        return convention.indent.tab.should.equal(0);
      });
    });
    describe('linelength >', function() {
      it('line length is 80 characters #1', function() {
        var convention;
        convention = parser.linelength('    public String findFirstName( String name, String age) { return \"a\"; }', {});
        return convention.linelength.char80.should.equal(1);
      });
      it('line length is 80 characters #2', function() {
        var convention;
        convention = parser.linelength('\t\tpublic String findFirstName( String name, String age) { return \"a\"; }', {});
        return convention.linelength.char80.should.equal(1);
      });
      it('line length is 80 characters #3', function() {
        var convention;
        convention = parser.linelength('\t\t\tpublic String findFirstName( String name, String age) { return \"a\"; }', {});
        return convention.linelength.char80.should.equal(0);
      });
      it('line length is 120 characters #1', function() {
        var convention;
        convention = parser.linelength('    public String findFirstName( String name, String age, String job) { return \"a\"; }', {});
        return convention.linelength.char120.should.equal(1);
      });
      it('line length is 120 characters #2', function() {
        var convention;
        convention = parser.linelength('\t\tpublic String findFirstName( String name, String age, String job) { return \"a\"; }', {});
        return convention.linelength.char120.should.equal(1);
      });
      it('line length is 120 characters #3', function() {
        var convention;
        convention = parser.linelength('\t\tpublic String findFirstName( String name, String age) { return \"a\"; }', {});
        return convention.linelength.char120.should.equal(0);
      });
      return it('line length is 150 characters #1', function() {
        var convention;
        convention = parser.linelength('    public String findFirstName( String name, String age, String job) { return \"a\"; } //afijfjeovjfiejffjeifjidjvosjfiejfioejovfjeifjiejfosjfioejfoiejfoi', {});
        return convention.linelength.char150.should.equal(1);
      });
    });
    describe('imports >', function() {
      it('imports on separate lines #1', function() {
        var convention;
        convention = parser.imports('import os', {});
        return convention.imports.separated.should.equal(1);
      });
      it('imports on separate lines #2', function() {
        var convention;
        convention = parser.imports('  import foo.bar.yourclass', {});
        return convention.imports.separated.should.equal(1);
      });
      it('imports on separate lines #3', function() {
        var convention;
        convention = parser.imports('  import os # ,', {});
        return convention.imports.separated.should.equal(1);
      });
      it('imports on separate lines #4', function() {
        var convention;
        convention = parser.imports('  import os, sys', {});
        return convention.imports.separated.should.equal(0);
      });
      it('imports on non-separate lines #1', function() {
        var convention;
        convention = parser.imports('import os, sys', {});
        return convention.imports.noseparated.should.equal(1);
      });
      it('imports on non-separate lines #2', function() {
        var convention;
        convention = parser.imports('  import os, sys', {});
        return convention.imports.noseparated.should.equal(1);
      });
      return it('imports on non-separate lines #3', function() {
        var convention;
        convention = parser.imports('import os', {});
        return convention.imports.noseparated.should.equal(0);
      });
    });
    return describe('whitespace >', function() {
      it('no extraneous whitespace #1', function() {
        var convention;
        convention = parser.whitespace('spam(ham[1], {eggs: 2})', {});
        return convention.whitespace.noextra.should.equal(1);
      });
      it('no extraneous whitespace #2', function() {
        var convention;
        convention = parser.whitespace('if x == 4: print x, y; x, y = y, x', {});
        return convention.whitespace.noextra.should.equal(1);
      });
      it('no extraneous whitespace #3', function() {
        var convention;
        convention = parser.whitespace('spam(1)', {});
        return convention.whitespace.noextra.should.equal(1);
      });
      it('no extraneous whitespace #4', function() {
        var convention;
        convention = parser.whitespace("dict['key'] = list[index]", {});
        return convention.whitespace.noextra.should.equal(1);
      });
      it('no extraneous whitespace #5', function() {
        var convention;
        convention = parser.whitespace('x = 1', {});
        return convention.whitespace.noextra.should.equal(1);
      });
      it('no extraneous whitespace #6', function() {
        var convention;
        convention = parser.whitespace("dict ['key'] = list [index]", {});
        return convention.whitespace.noextra.should.equal(0);
      });
      it('extraneous whitespace #1', function() {
        var convention;
        convention = parser.whitespace('spam( ham[ 1 ], { eggs: 2 } )', {});
        return convention.whitespace.extra.should.equal(1);
      });
      it('extraneous whitespace #2', function() {
        var convention;
        convention = parser.whitespace('if x == 4 : print x , y ; x , y = y , x', {});
        return convention.whitespace.extra.should.equal(1);
      });
      it('extraneous whitespace #3', function() {
        var convention;
        convention = parser.whitespace('spam (1)', {});
        return convention.whitespace.extra.should.equal(1);
      });
      it('extraneous whitespace #4', function() {
        var convention;
        convention = parser.whitespace("dict ['key'] = list [index]", {});
        return convention.whitespace.extra.should.equal(1);
      });
      it('extraneous whitespace #5', function() {
        var convention;
        convention = parser.whitespace('x             = 1', {});
        return convention.whitespace.extra.should.equal(1);
      });
      return it('extraneous whitespace #6', function() {
        var convention;
        convention = parser.whitespace('if x == 4: print x, y; x, y = y, x', {});
        return convention.whitespace.extra.should.equal(0);
      });
    });
  });

}).call(this);
