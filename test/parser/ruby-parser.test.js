// Generated by CoffeeScript 1.10.0
(function() {
  var parser, should;

  should = require('should');

  parser = require('../../src/parser/ruby-parser');

  describe('ruby-parser >', function() {
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
    describe('whitespace >', function() {
      it('one whitespace #1', function() {
        var convention;
        convention = parser.whitespace('sum = 1 + 2', {});
        return convention.whitespace.spaces.should.equal(1);
      });
      it('one whitespace #2', function() {
        var convention;
        convention = parser.whitespace('a, b = 1, 2', {});
        return convention.whitespace.spaces.should.equal(1);
      });
      it('one whitespace #3', function() {
        var convention;
        convention = parser.whitespace("1 > 2 ? true : false; puts 'Hi'", {});
        return convention.whitespace.spaces.should.equal(1);
      });
      it('one whitespace #4', function() {
        var convention;
        convention = parser.whitespace("[1, 2, 3].each { |e| puts e }", {});
        return convention.whitespace.spaces.should.equal(1);
      });
      it('one whitespace #5', function() {
        var convention;
        convention = parser.whitespace('[1, 2, 3].each {|e| puts e }', {});
        return convention.whitespace.spaces.should.equal(0);
      });
      it('one whitespace #6', function() {
        var convention;
        convention = parser.whitespace('sum = 1+2', {});
        return convention.whitespace.spaces.should.equal(0);
      });
      it('one whitespace #7', function() {
        var convention;
        convention = parser.whitespace('sum = "1+2"', {});
        return convention.whitespace.spaces.should.equal(1);
      });
      it('one whitespace #8', function() {
        var convention;
        convention = parser.whitespace('a, b = 1,2', {});
        return convention.whitespace.spaces.should.equal(0);
      });
      it('one whitespace #9', function() {
        var convention;
        convention = parser.whitespace('a, b = 1, 2;', {});
        return convention.whitespace.spaces.should.equal(1);
      });
      it('no whitespace #1', function() {
        var convention;
        convention = parser.whitespace('sum = 1 +2', {});
        return convention.whitespace.nospace.should.equal(1);
      });
      it('no whitespace #2', function() {
        var convention;
        convention = parser.whitespace('a,b = 1, 2', {});
        return convention.whitespace.nospace.should.equal(1);
      });
      it('no whitespace #3', function() {
        var convention;
        convention = parser.whitespace("1>2 ? true : false;puts 'Hi'", {});
        return convention.whitespace.nospace.should.equal(1);
      });
      it('no whitespace #4', function() {
        var convention;
        convention = parser.whitespace("[1, 2, 3].each {|e| puts e}", {});
        return convention.whitespace.nospace.should.equal(1);
      });
      it('no whitespace #5', function() {
        var convention;
        convention = parser.whitespace('sum = 1 + 2', {});
        return convention.whitespace.nospace.should.equal(0);
      });
      return it('no whitespace #6', function() {
        var convention;
        convention = parser.whitespace('a, b = 1, 2;c', {});
        return convention.whitespace.nospace.should.equal(1);
      });
    });
    describe('asignDefaultValue >', function() {
      it('use spaces #1', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method(arg1 = :default)', {});
        return convention.asignDefaultValue.space.should.equal(1);
      });
      it('use spaces #2', function() {
        var convention;
        convention = parser.asignDefaultValue('   def some_method(arg2 = nil)', {});
        return convention.asignDefaultValue.space.should.equal(1);
      });
      it('use spaces #3', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method( arg3 = [] )', {});
        return convention.asignDefaultValue.space.should.equal(1);
      });
      it('use spaces #4', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method(arg1 = :default, arg2 = nil, arg3 = [])', {});
        return convention.asignDefaultValue.space.should.equal(1);
      });
      it('use spaces #5', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method(arg3)', {});
        return convention.asignDefaultValue.space.should.equal(0);
      });
      it('use spaces #6', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method(arg1=:default)', {});
        return convention.asignDefaultValue.space.should.equal(0);
      });
      it('no spaces #1', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method(arg1=:default)', {});
        return convention.asignDefaultValue.nospace.should.equal(1);
      });
      it('no spaces #2', function() {
        var convention;
        convention = parser.asignDefaultValue('  def some_method(arg2=nil)', {});
        return convention.asignDefaultValue.nospace.should.equal(1);
      });
      it('no spaces #3', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method( arg3=[] )', {});
        return convention.asignDefaultValue.nospace.should.equal(1);
      });
      it('no spaces #4', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method(arg1=:default, arg2=nil, arg3=[])', {});
        return convention.asignDefaultValue.nospace.should.equal(1);
      });
      it('no spaces #5', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method( arg3 = [] )', {});
        return convention.asignDefaultValue.nospace.should.equal(0);
      });
      return it('no spaces #6', function() {
        var convention;
        convention = parser.asignDefaultValue('def some_method(arg3)', {});
        return convention.asignDefaultValue.nospace.should.equal(0);
      });
    });
    describe('numericLiteral >', function() {
      it('use underscore #1', function() {
        var convention;
        convention = parser.numericLiteral('num = 1_000_000', {});
        return convention.numericLiteral.underscore.should.equal(1);
      });
      it('use underscore #2', function() {
        var convention;
        convention = parser.numericLiteral('num = 7_473', {});
        return convention.numericLiteral.underscore.should.equal(1);
      });
      it('use underscore #3', function() {
        var convention;
        convention = parser.numericLiteral('num = 34_000_000', {});
        return convention.numericLiteral.underscore.should.equal(1);
      });
      it('use underscore #4', function() {
        var convention;
        convention = parser.numericLiteral('str = "404_094"', {});
        return convention.numericLiteral.underscore.should.equal(0);
      });
      it('use underscore #5', function() {
        var convention;
        convention = parser.numericLiteral('num = 438958', {});
        return convention.numericLiteral.underscore.should.equal(0);
      });
      it('use underscore #6', function() {
        var convention;
        convention = parser.numericLiteral('num = 958', {});
        return convention.numericLiteral.underscore.should.equal(0);
      });
      it('use no underscore #1', function() {
        var convention;
        convention = parser.numericLiteral('num = 1000000', {});
        return convention.numericLiteral.nounderscore.should.equal(1);
      });
      it('use no underscore #2', function() {
        var convention;
        convention = parser.numericLiteral('num = 438958', {});
        return convention.numericLiteral.nounderscore.should.equal(1);
      });
      it('use no underscore #3', function() {
        var convention;
        convention = parser.numericLiteral('num = 584058', {});
        return convention.numericLiteral.nounderscore.should.equal(1);
      });
      it('use no underscore #4', function() {
        var convention;
        convention = parser.numericLiteral('num = 504', {});
        return convention.numericLiteral.nounderscore.should.equal(0);
      });
      it('use no underscore #5', function() {
        var convention;
        convention = parser.numericLiteral('str = "404094"', {});
        return convention.numericLiteral.nounderscore.should.equal(0);
      });
      return it('use no underscore #6', function() {
        var convention;
        convention = parser.numericLiteral('num = 584_058', {});
        return convention.numericLiteral.nounderscore.should.equal(0);
      });
    });
    describe('defNoArgs >', function() {
      it('omit parenthenes #1', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method', {});
        return convention.defNoArgs.omit.should.equal(1);
      });
      it('omit parenthenes #2', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method # comment', {});
        return convention.defNoArgs.omit.should.equal(1);
      });
      it('omit parenthenes #3', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method # comment()', {});
        return convention.defNoArgs.omit.should.equal(1);
      });
      it('omit parenthenes #4', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method()', {});
        return convention.defNoArgs.omit.should.equal(0);
      });
      it('omit parenthenes #5', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method arg1, arg2', {});
        return convention.defNoArgs.omit.should.equal(0);
      });
      it('omit parenthenes #6', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method arg1', {});
        return convention.defNoArgs.omit.should.equal(0);
      });
      it('use parenthenes #1', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method()', {});
        return convention.defNoArgs.use.should.equal(1);
      });
      it('use parenthenes #2', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method ()', {});
        return convention.defNoArgs.use.should.equal(1);
      });
      it('use parenthenes #3', function() {
        var convention;
        convention = parser.defNoArgs('    def some_method ( )', {});
        return convention.defNoArgs.use.should.equal(1);
      });
      it('use parenthenes #4', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method # comment()', {});
        return convention.defNoArgs.use.should.equal(0);
      });
      return it('use parenthenes #5', function() {
        var convention;
        convention = parser.defNoArgs(' def some_method(arg)', {});
        return convention.defNoArgs.use.should.equal(0);
      });
    });
    return describe('defArgs >', function() {
      it('omit parenthenes #1', function() {
        var convention;
        convention = parser.defArgs(' def some_method arg1, arg2', {});
        return convention.defArgs.omit.should.equal(1);
      });
      it('omit parenthenes #1', function() {
        var convention;
        convention = parser.defArgs(' def some_method arg1', {});
        return convention.defArgs.omit.should.equal(1);
      });
      it('omit parenthenes #3', function() {
        var convention;
        convention = parser.defArgs(' def some_method  arg1, arg2 # fjeofjeo( arg1, arg2)', {});
        return convention.defArgs.omit.should.equal(1);
      });
      it('omit parenthenes #4', function() {
        var convention;
        convention = parser.defArgs('def some_method()', {});
        return convention.defArgs.omit.should.equal(0);
      });
      it('omit parenthenes #5', function() {
        var convention;
        convention = parser.defArgs('def some_method(arg1, arg2)', {});
        return convention.defArgs.omit.should.equal(0);
      });
      it('omit parenthenes #6', function() {
        var convention;
        convention = parser.defArgs('def some_method', {});
        return convention.defArgs.omit.should.equal(0);
      });
      it('use parenthenes #1', function() {
        var convention;
        convention = parser.defArgs(' def some_method( arg1, arg2)', {});
        return convention.defArgs.use.should.equal(1);
      });
      it('use parenthenes #2', function() {
        var convention;
        convention = parser.defArgs(' def some_method ( arg1 )', {});
        return convention.defArgs.use.should.equal(1);
      });
      it('use parenthenes #3', function() {
        var convention;
        convention = parser.defArgs('    def some_method (  arg1, arg2 )', {});
        return convention.defArgs.use.should.equal(1);
      });
      it('use parenthenes #4', function() {
        var convention;
        convention = parser.defArgs('def some_method arg1, arg2', {});
        return convention.defArgs.use.should.equal(0);
      });
      it('use parenthenes #5', function() {
        var convention;
        convention = parser.defArgs('def some_method()', {});
        return convention.defArgs.use.should.equal(0);
      });
      it('use parenthenes #6', function() {
        var convention;
        convention = parser.defArgs('def update_requirements(features, group_overrides, init_git_url=nil, user_env_vars=nil)', {});
        return convention.defArgs.use.should.equal(1);
      });
      return it('use parenthenes #7', function() {
        var convention;
        convention = parser.defArgs('def some_method', {});
        return convention.defArgs.use.should.equal(0);
      });
    });
  });

}).call(this);
