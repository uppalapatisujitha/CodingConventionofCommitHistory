// Generated by CoffeeScript 1.10.0
(function() {
  var parser, should;

  should = require('should');

  parser = require('../../src/parser/java-parser');

  describe('java-parser >', function() {
    describe('indent >', function() {
      it('check space indent #1', function() {
        var convention;
        convention = parser.indent('public String getName{}', {});
        return convention.indent.space.should.equal(0);
      });
      it('check space indent #2', function() {
        var convention;
        convention = parser.indent('  public String getName{}', {});
        return convention.indent.space.should.equal(1);
      });
      it('check space indent #3', function() {
        var convention;
        convention = parser.indent('    public String getName{}', {});
        return convention.indent.space.should.equal(1);
      });
      it('check tab indent #1', function() {
        var convention;
        convention = parser.indent('\tpublic String getName{}', {});
        return convention.indent.tab.should.equal(1);
      });
      it('check tab indent #2', function() {
        var convention;
        convention = parser.indent('\t\tpublic String getName{}', {});
        return convention.indent.tab.should.equal(1);
      });
      it('check tab indent #3', function() {
        var convention;
        convention = parser.indent('\t\t  public String getName{}  ', {});
        return convention.indent.tab.should.equal(1);
      });
      it('check tab indent #4', function() {
        var convention;
        convention = parser.indent('  \tpublic String getName{}', {});
        return convention.indent.tab.should.equal(0);
      });
      return it('check tab indent #5', function() {
        var convention;
        convention = parser.indent('public String getName{}', {});
        return convention.indent.tab.should.equal(0);
      });
    });
    describe('blockstatement >', function() {
      it('check block statement with one space #1', function() {
        var convention;
        convention = parser.blockstatement('if (height < MIN_HIGHT) { return; }', {});
        return convention.blockstatement.onespace.should.equal(1);
      });
      it('check block statement with one space #2', function() {
        var convention;
        convention = parser.blockstatement('} else if (height < MIN_HIGHT) {', {});
        return convention.blockstatement.onespace.should.equal(1);
      });
      it('check block statement with one space #3', function() {
        var convention;
        convention = parser.blockstatement('} else if ( height < MIN_HIGHT ) {', {});
        return convention.blockstatement.onespace.should.equal(1);
      });
      it('check block statement with one space #4', function() {
        var convention;
        convention = parser.blockstatement('else if (height < MIN_HIGHT) {', {});
        return convention.blockstatement.onespace.should.equal(1);
      });
      it('check block statement with one space #5', function() {
        var convention;
        convention = parser.blockstatement('if (height < MIN_HIGHT){ return; }', {});
        return convention.blockstatement.onespace.should.equal(0);
      });
      it('check block statement with one space #6', function() {
        var convention;
        convention = parser.blockstatement('if (isTrue()) { return; }', {});
        return convention.blockstatement.onespace.should.equal(1);
      });
      it('check block statement with no space #1', function() {
        var convention;
        convention = parser.blockstatement('if (height < MIN_HIGHT){ return (); }', {});
        return convention.blockstatement.nospace.should.equal(1);
      });
      it('check block statement with no space #2', function() {
        var convention;
        convention = parser.blockstatement('}else if (height < MIN_HIGHT){', {});
        return convention.blockstatement.nospace.should.equal(1);
      });
      it('check block statement with no space #3', function() {
        var convention;
        convention = parser.blockstatement('if (height < MIN_HIGHT)', {});
        return convention.blockstatement.nospace.should.equal(0);
      });
      it('check block statement with no space #4', function() {
        var convention;
        convention = parser.blockstatement('} else if(height < MIN_HIGHT) {', {});
        return convention.blockstatement.nospace.should.equal(0);
      });
      it('check block statement with no space #5', function() {
        var convention;
        convention = parser.blockstatement('} else if(isTrue()){', {});
        return convention.blockstatement.nospace.should.equal(1);
      });
      it('check block statement at new line #1', function() {
        var convention;
        convention = parser.blockstatement('if (height < MIN_HIGHT)', {});
        return convention.blockstatement.newline.should.equal(1);
      });
      it('check block statement at new line #2', function() {
        var convention;
        convention = parser.blockstatement('if (height < MIN_HIGHT) // comment', {});
        return convention.blockstatement.newline.should.equal(1);
      });
      it('check block statement at new line #3', function() {
        var convention;
        convention = parser.blockstatement('if (height < MIN_HIGHT)/* */', {});
        return convention.blockstatement.newline.should.equal(1);
      });
      it('check block statement at new line #4', function() {
        var convention;
        convention = parser.blockstatement('else if (height < MIN_HIGHT)', {});
        return convention.blockstatement.newline.should.equal(1);
      });
      it('check block statement at new line #5', function() {
        var convention;
        convention = parser.blockstatement('else if (height < MIN_HIGHT) {', {});
        return convention.blockstatement.newline.should.equal(1);
      });
      it('check block statement at new line #6', function() {
        var convention;
        convention = parser.blockstatement('}  else if ( height < MIN_HIGHT ) {', {});
        return convention.blockstatement.newline.should.equal(0);
      });
      return it('check block statement at new line #7', function() {
        var convention;
        convention = parser.blockstatement('if ( isTrue() ) //{}', {});
        return convention.blockstatement.newline.should.equal(1);
      });
    });
    describe('constant >', function() {
      it('check constant with all caps #1', function() {
        var convention;
        convention = parser.constant('	static public final String FOOBAR= "";', {});
        return convention.constant.allcaps.should.equal(1);
      });
      it('check constant with all caps #2', function() {
        var convention;
        convention = parser.constant('	public static final String FOOBAR2= "";', {});
        return convention.constant.allcaps.should.equal(1);
      });
      it('check constant with all caps #3', function() {
        var convention;
        convention = parser.constant('private final static String FOO_BAR = "";', {});
        return convention.constant.allcaps.should.equal(1);
      });
      it('check constant with all caps #4', function() {
        var convention;
        convention = parser.constant('final public static String FOO_BAR = "";', {});
        return convention.constant.allcaps.should.equal(1);
      });
      it('check constant with all caps #5', function() {
        var convention;
        convention = parser.constant('	public final String foobar = "";', {});
        return convention.constant.allcaps.should.equal(0);
      });
      it('check constant with all caps #6', function() {
        var convention;
        convention = parser.constant('public final String FOOBAR = "";', {});
        return convention.constant.allcaps.should.equal(0);
      });
      it('check constant with all caps #7', function() {
        var convention;
        convention = parser.constant('private final static String FOOBARa = "";', {});
        return convention.constant.allcaps.should.equal(0);
      });
      it('check constant with not all caps #1', function() {
        var convention;
        convention = parser.constant('	static public final String foobar= "";', {});
        return convention.constant.notallcaps.should.equal(1);
      });
      it('check constant with not all caps #2', function() {
        var convention;
        convention = parser.constant('	public static final String foobar2= "";', {});
        return convention.constant.notallcaps.should.equal(1);
      });
      it('check constant with not all caps #3', function() {
        var convention;
        convention = parser.constant('public final static String FOOBARa = "";', {});
        return convention.constant.notallcaps.should.equal(1);
      });
      it('check constant with not all caps #4', function() {
        var convention;
        convention = parser.constant('final public static String FOo_BAR = "";', {});
        return convention.constant.notallcaps.should.equal(1);
      });
      it('check constant with not all caps #5', function() {
        var convention;
        convention = parser.constant('	public static final String FOO_BAR= "";', {});
        return convention.constant.notallcaps.should.equal(0);
      });
      return it('check constant with not all caps #6', function() {
        var convention;
        convention = parser.constant('	public final String Foo= "";', {});
        return convention.constant.notallcaps.should.equal(0);
      });
    });
    describe('conditionstatement >', function() {
      it('check condition statement with one space #1', function() {
        var convention;
        convention = parser.conditionstatement('if ( a.equal("")) {', {});
        return convention.conditionstatement.onespace.should.equal(1);
      });
      it('check condition statement with one space #2', function() {
        var convention;
        convention = parser.conditionstatement('while ( isTrue() ) {', {});
        return convention.conditionstatement.onespace.should.equal(1);
      });
      it('check condition statement with one space #3', function() {
        var convention;
        convention = parser.conditionstatement('switch (name) {', {});
        return convention.conditionstatement.onespace.should.equal(1);
      });
      it('check condition statement with one space #4', function() {
        var convention;
        convention = parser.conditionstatement('if( isTrue()) {', {});
        return convention.conditionstatement.onespace.should.equal(0);
      });
      it('check condition statement with no space #1', function() {
        var convention;
        convention = parser.conditionstatement('if( isTrue()) {', {});
        return convention.conditionstatement.nospace.should.equal(1);
      });
      it('check condition statement with no space #2', function() {
        var convention;
        convention = parser.conditionstatement('while( isTrue() ) {', {});
        return convention.conditionstatement.nospace.should.equal(1);
      });
      it('check condition statement with no space #3', function() {
        var convention;
        convention = parser.conditionstatement('switch(name) {', {});
        return convention.conditionstatement.nospace.should.equal(1);
      });
      return it('check condition statement with no space #4', function() {
        var convention;
        convention = parser.conditionstatement('if ( a.equal("")) {', {});
        return convention.conditionstatement.nospace.should.equal(0);
      });
    });
    describe('argumentdef >', function() {
      it('check argument definition with one space #1', function() {
        var convention;
        convention = parser.argumentdef('public void setName11( String name ) {', {});
        return convention.argumentdef.onespace.should.equal(1);
      });
      it('check argument definition with one space #2', function() {
        var convention;
        convention = parser.argumentdef('    public void setName( String name ) {', {});
        return convention.argumentdef.onespace.should.equal(1);
      });
      it('check argument definition with one space #3', function() {
        var convention;
        convention = parser.argumentdef('\t\tpublic void setName( String name, Sting age) {', {});
        return convention.argumentdef.onespace.should.equal(1);
      });
      it('check argument definition with one space #4', function() {
        var convention;
        convention = parser.argumentdef('if ( isTrue() ) {}', {});
        return convention.argumentdef.onespace.should.equal(1);
      });
      it('check argument definition with one space #5', function() {
        var convention;
        convention = parser.argumentdef('while ( isTrue() ) {}', {});
        return convention.argumentdef.onespace.should.equal(1);
      });
      it('check argument definition with one space #6', function() {
        var convention;
        convention = parser.argumentdef('public void setName11(String name ) {', {});
        return convention.argumentdef.onespace.should.equal(0);
      });
      it('check argument definition with no space #1', function() {
        var convention;
        convention = parser.argumentdef('public void setName(String name) {', {});
        return convention.argumentdef.nospace.should.equal(1);
      });
      it('check argument definition with no space #2', function() {
        var convention;
        convention = parser.argumentdef('\t\tpublic void setName(String name) {', {});
        return convention.argumentdef.nospace.should.equal(1);
      });
      it('check argument definition with no space #3', function() {
        var convention;
        convention = parser.argumentdef('public void setName(String name, Sting age) {', {});
        return convention.argumentdef.nospace.should.equal(1);
      });
      it('check argument definition with no space #4', function() {
        var convention;
        convention = parser.argumentdef('if (isTrue()) {}', {});
        return convention.argumentdef.nospace.should.equal(1);
      });
      it('check argument definition with no space #5', function() {
        var convention;
        convention = parser.argumentdef('while (isTrue()) {}', {});
        return convention.argumentdef.nospace.should.equal(1);
      });
      return it('check argument definition with no space #6', function() {
        var convention;
        convention = parser.argumentdef('/t/tpublic void setName( String name) {', {});
        return convention.argumentdef.nospace.should.equal(0);
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
    describe('staticvar >', function() {
      it('static variable with special prefix #1', function() {
        var convention;
        convention = parser.staticvar('	static String _name;', {});
        return convention.staticvar.prefix.should.equal(1);
      });
      it('static variable with special prefix #2', function() {
        var convention;
        convention = parser.staticvar('	static String $name;', {});
        return convention.staticvar.prefix.should.equal(1);
      });
      it('static variable with special prefix #3', function() {
        var convention;
        convention = parser.staticvar('	static String name;', {});
        return convention.staticvar.prefix.should.equal(0);
      });
      it('static variable with no special prefix #1', function() {
        var convention;
        convention = parser.staticvar('	static String _name;', {});
        return convention.staticvar.noprefix.should.equal(0);
      });
      it('static variable with no special prefix #2', function() {
        var convention;
        convention = parser.staticvar('	static String $name;', {});
        return convention.staticvar.noprefix.should.equal(0);
      });
      return it('static variable with no special prefix #3', function() {
        var convention;
        convention = parser.staticvar('	static String name;', {});
        return convention.staticvar.noprefix.should.equal(1);
      });
    });
    return describe('finalstaticorder >', function() {
      it('public - static - final #1', function() {
        var convention;
        convention = parser.finalstaticorder('public static final String t1 = "";', {});
        return convention.finalstaticorder.accstfin.should.equal(1);
      });
      it('public - static - final #2', function() {
        var convention;
        convention = parser.finalstaticorder('public static transient final String t2 = "";', {});
        return convention.finalstaticorder.accstfin.should.equal(1);
      });
      it('public - static - final #3', function() {
        var convention;
        convention = parser.finalstaticorder('transient public static final String t3 = "";', {});
        return convention.finalstaticorder.accstfin.should.equal(1);
      });
      it('public - static - final #4', function() {
        var convention;
        convention = parser.finalstaticorder('public final static String t4 = "";', {});
        return convention.finalstaticorder.accstfin.should.equal(0);
      });
      it('public - final - static #1', function() {
        var convention;
        convention = parser.finalstaticorder('public final static String t1 = "";', {});
        return convention.finalstaticorder.accfinst.should.equal(1);
      });
      it('public - final - static #2', function() {
        var convention;
        convention = parser.finalstaticorder('public final static transient String t2 = "";', {});
        return convention.finalstaticorder.accfinst.should.equal(1);
      });
      it('public - final - static #3', function() {
        var convention;
        convention = parser.finalstaticorder('transient public final static String t3 = "";', {});
        return convention.finalstaticorder.accfinst.should.equal(1);
      });
      it('public - final - static #4', function() {
        var convention;
        convention = parser.finalstaticorder('final public static String t4 = "";', {});
        return convention.finalstaticorder.accfinst.should.equal(0);
      });
      it('final - public - static #1', function() {
        var convention;
        convention = parser.finalstaticorder('final public static String t1 = "";', {});
        return convention.finalstaticorder.finaccst.should.equal(1);
      });
      it('final - public - static #2', function() {
        var convention;
        convention = parser.finalstaticorder('final public static transient String t2 = "";', {});
        return convention.finalstaticorder.finaccst.should.equal(1);
      });
      it('final - public - static #3', function() {
        var convention;
        convention = parser.finalstaticorder('final transient public static String t3 = "";', {});
        return convention.finalstaticorder.finaccst.should.equal(1);
      });
      it('final - public - static #4', function() {
        var convention;
        convention = parser.finalstaticorder('static public final String t4 = "";', {});
        return convention.finalstaticorder.finaccst.should.equal(0);
      });
      it('final - public - static #1', function() {
        var convention;
        convention = parser.finalstaticorder('static public final String t1 = "";', {});
        return convention.finalstaticorder.staccfin.should.equal(1);
      });
      it('final - public - static #2', function() {
        var convention;
        convention = parser.finalstaticorder('static public transient final String t2 = "";', {});
        return convention.finalstaticorder.staccfin.should.equal(1);
      });
      it('final - public - static #3', function() {
        var convention;
        convention = parser.finalstaticorder('static transient public final String t3 = "";', {});
        return convention.finalstaticorder.staccfin.should.equal(1);
      });
      return it('final - public - static #4', function() {
        var convention;
        convention = parser.finalstaticorder('public static final String t4 = "";', {});
        return convention.finalstaticorder.staccfin.should.equal(0);
      });
    });
  });

}).call(this);
