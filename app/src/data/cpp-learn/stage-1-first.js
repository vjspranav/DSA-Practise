// C++ Learn lessons: stage 1, first programs (the learner knows Python and has never written C++).
// Contract and examples: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md and
// docs/superpowers/specs/cpp-learn-lesson-examples.js. Check with: node scripts/verify-cpp-learn.mjs --stage 1
// Ids must start with c1- and be unique across the track. Every piece of syntax a lesson uses must be introduced
// (`introduces`, ids from src/cpp-learn/syntax.js) by that lesson or an earlier one; the checker enforces it.
// Functions are stage 3, so every lesson here is a whole program (main only): concept, program, fix or predict.
// Undefined behaviour (int overflow, an uninitialised read) is taught in prose and in predict rounds marked
// `ub: true`; its output is never stored. Wrap-around is shown only with unsigned.

export const LESSONS = [
  // 1. what compiling means, main, include, cout, endl, ;, return 0, comments
  {
    id: 'c1-hello-main',
    title: 'Hello, main',
    kind: 'concept',
    task: 'This program prints a different greeting. Change the text so it prints <em>Hello, C++!</em> instead.',
    introduces: ['include-iostream', 'using-namespace-std', 'int-main', 'return-zero', 'cout', 'stream-insert', 'endl', 'string-literal', 'semicolon', 'comment'],
    teach: {
      body: [
        `<p>When you run a Python file, the interpreter reads it line by line and does each line as it gets there. A mistake on line 40 only shows up when the program reaches line 40. C++ works in two steps. First you <em>compile</em> the file: a tool called the compiler reads the whole thing and translates it into a machine program. If anything is wrong, it stops and prints an error, and <em>no program is made</em>. Only when the compile succeeds do you <em>run</em> the result. So in C++ most mistakes appear before the program ever starts. In this course the Run button does both steps for you, and the compiler's messages appear below the editor.</p>`,
        `<p>A C++ program has one special function called <code>main</code>. The computer starts there, runs the instructions between the curly braces <code>{ }</code> from top to bottom, and stops at the closing brace. You write it as <code>int main() { ... }</code>. The <code>int</code> says that <code>main</code> hands back a whole number when it finishes, and the empty parentheses <code>()</code> say it takes no input. <code>return 0;</code> at the end hands back 0, which means "finished normally". (C++ lets you leave that line out of <code>main</code>, but writing it is clear.)</p>`,
        `<p>To show text, write <code>cout &lt;&lt; "some text";</code>. <code>cout</code> is the screen (the "console output"). The arrows <code>&lt;&lt;</code> mean "send what is on the right to the screen", and the text between double quotes is called a <em>string literal</em>. You can chain several things in one statement: <code>cout &lt;&lt; "a" &lt;&lt; "b";</code>. <code>endl</code> ends the line, like the newline that Python's <code>print</code> adds for you. C++ never adds a newline by itself.</p>`,
        `<p><code>cout</code> and <code>endl</code> live in a part of the standard library called <code>iostream</code>, so the first line is <code>#include &lt;iostream&gt;</code>, which means "bring that part in" (a bit like <code>import</code>). The line <code>using namespace std;</code> lets you write <code>cout</code> instead of the longer <code>std::cout</code>. Write it as-is for now; stage 3 explains what it does and why.</p>`,
        `<p>Every statement ends with a semicolon <code>;</code>, because C++ does not use the end of a line to end a statement. Two slashes <code>//</code> start a <em>comment</em>: the rest of the line is for humans and the compiler ignores it, like <code>#</code> in Python.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>        // bring in cout and endl\nusing namespace std;       // allow the short name cout (explained in stage 3)\n\nint main() {               // the program starts here\n    // this line is a comment: the compiler ignores it\n    cout << "Hello, C++!" << endl;   // print the text, then end the line\n    return 0;              // finished normally\n}',
          output: 'Hello, C++!',
          caption: 'The smallest useful program.',
        },
        {
          code: 'cout << "Line one" << endl;          // endl ends the line\ncout << "Line " << "two" << endl;    // << can be chained\ncout << "no newline yet, ";           // without endl the next text continues the line\ncout << "now there is" << endl;',
          output: 'Line one\nLine two\nno newline yet, now there is',
          caption: 'Chaining and ending lines. These statements run inside main.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'int main() { ... }', meaning: 'where the program starts; the code goes between the braces' },
        { code: '#include <iostream>', meaning: 'brings in cout and endl from the standard library' },
        { code: 'using namespace std;', meaning: 'lets you write cout instead of std::cout (explained in stage 3)' },
        { code: 'cout << "text"', meaning: 'prints the text; << sends things to the screen and can be chained' },
        { code: 'endl', meaning: 'ends the current line' },
        { code: ';', meaning: 'ends a statement' },
        { code: 'return 0;', meaning: 'main finished normally' },
        { code: '// note', meaning: 'a comment, ignored by the compiler' },
      ],
    },
    compare: {
      py: { code: 'print("Hello")', outcome: 'Prints Hello and a newline', ok: true },
      cpp: { code: 'cout << "Hello" << endl;', outcome: 'Prints Hello; endl adds the newline', ok: true },
      text: 'Python runs line by line and adds the newline itself. C++ is compiled first and only prints the newline you ask for with <code>endl</code>.',
    },
    refresher: [
      'Everything lives inside <code>int main() { ... }</code>. Statements end with <code>;</code>.',
      '<code>cout &lt;&lt; "text" &lt;&lt; endl;</code> prints text and ends the line. It needs <code>#include &lt;iostream&gt;</code>.',
    ],
    hints: [
      'Find the text between the double quotes. That is the only thing to change.',
      'Keep the quotes and the rest of the line as it is, and write the new greeting between the quotes.',
    ],
    inPython: {
      code: 'print("Hello, Python!")',
      note: 'One line in Python, because <code>print</code> is built in and adds the newline. C++ needs the <code>#include</code>, a <code>main</code> and an explicit <code>endl</code>.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Python!" << endl;\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}',
    require: [{ pattern: 'cout\\s*<<', message: 'Print with cout <<' }],
    tests: [{ name: 'Prints the greeting', stdin: '', expected: 'Hello, C++!' }],
  },

  // 2. the first compiler error: a missing semicolon
  {
    id: 'c1-fix-semicolon',
    title: 'The missing semicolon',
    kind: 'fix',
    task: 'This does not compile. Fix it so it prints <em>Almost there</em>.',
    errorMatch: "expected ';'",
    gloss: 'The compiler reached <code>return</code> while still waiting for the <code>;</code> that ends the <code>cout</code> line above it.',
    introduces: [],
    refresher: [
      'Every statement ends with <code>;</code>. The compiler often reports the error on the line AFTER the missing one.',
      'Read the first <code>error:</code> line of the compiler output; later errors are often a knock-on effect of it.',
    ],
    hints: [
      'Look at the line just above the one the compiler points to.',
      'One character is missing at the end of the <code>cout</code> line.',
    ],
    inPython: {
      code: 'print("Almost there")',
      note: 'Python ends a statement at the end of the line, so there is nothing to forget. C++ needs <code>;</code> because a statement may span several lines.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Almost there" << endl\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Almost there" << endl;\n    return 0;\n}',
    require: [{ pattern: 'cout\\s*<<\\s*"Almost there"', message: 'Keep printing Almost there' }],
    tests: [{ name: 'Prints Almost there', stdin: '', expected: 'Almost there' }],
  },

  // 3. chaining << and "\n"
  {
    id: 'c1-lines',
    title: 'Chaining and newlines',
    kind: 'program',
    task: 'Print three lines: <em>Name: Ada</em>, then <em>Language: C++</em>, then <em>Done</em>. Use <code>"\\n"</code> to end at least one line.',
    introduces: ['newline-escape'],
    teach: {
      body: [
        `<p>You have seen that <code>endl</code> ends a line. There is a second way: put the two characters <code>\\n</code> inside a string literal. Inside quotes, a backslash starts an <em>escape</em>: <code>\\n</code> is not a backslash and an n, it stands for the single "new line" character. So <code>cout &lt;&lt; "Hi\\n";</code> and <code>cout &lt;&lt; "Hi" &lt;&lt; endl;</code> both print Hi and move to the next line. It is the same <code>\\n</code> you know from Python strings.</p>`,
        `<p>The difference is small. <code>endl</code> also asks the system to push out everything printed so far right away. That is useful when a program might crash, and slower when you print a lot. For now, either one is fine: use <code>"\\n"</code> when you are printing text anyway, and <code>endl</code> at the end of a line when you like how it reads.</p>`,
        `<p>Because <code>&lt;&lt;</code> can be chained, one statement can print many pieces, and a single string may hold several <code>\\n</code>: <code>cout &lt;&lt; "a\\nb\\n";</code> prints two lines.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "one\\n";                 // \\n ends the line, like endl\n    cout << "two" << "\\n" << "three\\n";   // chained, and the escape can sit anywhere in the text\n    cout << "four" << endl;          // endl still works\n    return 0;\n}',
          output: 'one\ntwo\nthree\nfour',
          caption: 'Two ways to end a line.',
        },
      ],
      terms: [
        { code: '"\\n"', meaning: 'inside quotes, the new-line character; ends the current line' },
        { code: 'endl', meaning: 'ends the line and flushes the output' },
      ],
    },
    refresher: [
      '<code>"\\n"</code> inside a string literal ends the line, just like <code>endl</code>.',
      'Chain pieces with <code>&lt;&lt;</code>: <code>cout &lt;&lt; "a" &lt;&lt; "\\n" &lt;&lt; "b";</code>.',
    ],
    hints: [
      'Three lines means three line endings, or one string with two <code>\\n</code> inside it.',
      'Remember the space after each colon: <em>Name: Ada</em>.',
    ],
    inPython: {
      code: 'print("Name: Ada")\nprint("Language: C++")\nprint("Done")',
      note: 'Each <code>print</code> adds a newline for you. In C++ you add every line ending yourself.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // print the three lines here\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Name: Ada\\n";\n    cout << "Language: C++\\n";\n    cout << "Done" << endl;\n    return 0;\n}',
    require: [{ pattern: '\\\\n', message: 'Use "\\n" to end a line at least once' }],
    tests: [{ name: 'Three lines', stdin: '', expected: 'Name: Ada\nLanguage: C++\nDone' }],
  },

  // 4. std:: written out
  {
    id: 'c1-std-qualified',
    title: 'Writing std:: out',
    kind: 'program',
    task: 'Make this program print <em>Hello, std</em> without the <code>using</code> line: delete it and write <code>std::</code> in front of the names that need it.',
    introduces: ['std-qualified'],
    teach: {
      body: [
        `<p>Every name that comes from the standard library, such as <code>cout</code> and <code>endl</code>, really belongs to a group called <code>std</code> (short for "standard"). Its full name is <code>std::cout</code>. The double colon <code>::</code> means "the thing called <code>cout</code> that lives inside <code>std</code>", a bit like <code>os.path</code> in Python, which says "<code>path</code> inside <code>os</code>".</p>`,
        `<p>The line <code>using namespace std;</code> that you have been copying tells the compiler "when I write a plain name, also look inside <code>std</code>". That is why <code>cout</code> works without the prefix. If you leave that line out, you must write <code>std::cout</code> and <code>std::endl</code> every time. Both styles are real C++. Many large projects write <code>std::</code> out, so you will see it a lot. Stage 3 explains the trade-off properly.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n\nint main() {\n    // no "using namespace std;" here, so every library name gets its std:: prefix\n    std::cout << "Hi" << std::endl;\n    std::cout << "Bye\\n";\n    return 0;\n}',
          output: 'Hi\nBye',
          caption: 'The same program without the using line.',
        },
      ],
      terms: [
        { code: 'std::cout', meaning: 'the full name of cout: the thing called cout inside std' },
        { code: 'std::endl', meaning: 'the full name of endl' },
      ],
    },
    refresher: [
      'Without <code>using namespace std;</code>, write <code>std::cout</code> and <code>std::endl</code>.',
      '<code>::</code> reads "inside": <code>std::cout</code> is the cout that lives inside std.',
    ],
    hints: [
      'Delete the line that starts with <code>using</code>, then see what the compiler complains about.',
      'There are two names to fix: the one that prints and the one that ends the line.',
    ],
    inPython: {
      code: 'import math\nprint(math.sqrt(16))',
      note: 'Python also writes the owner first: <code>math.sqrt</code>. C++ uses <code>::</code> where Python uses a dot for this.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, std" << endl;\n    return 0;\n}',
    solution: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, std" << std::endl;\n    return 0;\n}',
    require: [{ pattern: 'std::cout', message: 'Write std::cout' }],
    forbidden: [{ pattern: 'using\\s+namespace', message: 'Remove the using namespace line' }],
    tests: [{ name: 'Prints Hello, std', stdin: '', expected: 'Hello, std' }],
  },

  // 5. block comments (and an unterminated one)
  {
    id: 'c1-block-comment',
    title: 'Block comments',
    kind: 'fix',
    task: 'A comment was opened and never closed. Close it so the program prints <em>Hello</em>.',
    errorMatch: 'unterminated /\\* comment',
    gloss: 'A <code>/*</code> comment keeps going until it meets <code>*/</code>, so without one it swallows the rest of the file.',
    introduces: ['block-comment'],
    teach: {
      body: [
        `<p>You already know <code>//</code>, which comments out the rest of one line. C++ has a second kind for several lines: it starts with <code>/*</code> and ends with <code>*/</code>, and everything in between is ignored, however many lines it spans. Python has no exact equal (people use a triple-quoted string or many <code>#</code> lines).</p>`,
        `<p>Forgetting the closing <code>*/</code> is a classic mistake: the comment never ends, so it swallows the rest of your file, and the compiler complains that it hit the end while the comment was still open. Block comments cannot be nested, so the first <code>*/</code> closes the comment.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    /* This comment starts here\n       and carries on over a second line.\n       Nothing in it is run. */\n    cout << "Visible" << endl;   // this line is a normal statement\n    /* cout << "Hidden" << endl; */\n    return 0;\n}',
          output: 'Visible',
          caption: 'Block comments, and a statement commented out.',
        },
      ],
      terms: [
        { code: '/* ... */', meaning: 'a comment that can span several lines; ignored by the compiler' },
      ],
    },
    refresher: [
      '<code>/* ... */</code> ignores everything between the markers, over any number of lines. Do not forget <code>*/</code>.',
      'Read the first <code>error:</code> line: an unterminated comment is reported at the place the comment started.',
    ],
    hints: [
      'Find the line that starts with <code>/*</code> and look for its partner.',
      'Close the comment right after its text, before the <code>cout</code> line.',
    ],
    inPython: {
      code: '# one line\n"""\nA triple-quoted string spanning\nseveral lines is often used like a block comment\n"""\nprint("Hello")',
      note: 'Python has only <code>#</code> for real comments. C++ has <code>//</code> for one line and a block form for many.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    /* This program says hello.\n    cout << "Hello" << endl;\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    /* This program says hello. */\n    cout << "Hello" << endl;\n    return 0;\n}',
    tests: [{ name: 'Prints Hello', stdin: '', expected: 'Hello' }],
  },

  // 6. variables: int, declare, assign vs initialise
  {
    id: 'c1-int-variables',
    title: 'Variables hold one kind of value',
    kind: 'concept',
    task: 'The program prints <em>5</em>. After that line, give <code>apples</code> the new value 9 and print it again, so the output is <em>5</em> then <em>9</em>.',
    introduces: ['int', 'assign'],
    teach: {
      body: [
        `<p>A <em>variable</em> is a named box that holds a value. In Python you just write <code>apples = 5</code>. In C++ you must also say <em>what kind</em> of value the box holds, and that kind is fixed for as long as the variable lives. <code>int apples = 5;</code> creates a box named <code>apples</code> that holds a whole number (an <code>int</code>, short for "integer") and puts 5 in it. This is called a <em>declaration</em> with an <em>initial value</em>: the type comes first, then the name, then <code>=</code> and the value.</p>`,
        `<p>Later, <code>apples = 9;</code> (no type this time) puts a new value in the same box. That is <em>assignment</em>. The type goes only in the line that creates the variable. Writing <code>int</code> again would try to create a second box with the same name, which is an error. A variable must be declared before the first line that uses it, because the compiler reads the file from top to bottom.</p>`,
        `<p>To print a variable, put its name where a string literal would go: <code>cout &lt;&lt; apples;</code> prints the number inside. You can mix text and variables in one chain: <code>cout &lt;&lt; "apples: " &lt;&lt; apples &lt;&lt; endl;</code>.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int pears = 3;                // declare an int named pears, starting at 3\n    cout << pears << endl;        // prints 3\n    pears = 10;                   // assign a new value: no type this time\n    cout << "pears: " << pears << endl;   // text and a variable in one chain\n    return 0;\n}',
          output: '3\npears: 10',
          caption: 'Declare once, assign as often as you like.',
        },
      ],
      terms: [
        { code: 'int x = 5;', meaning: 'creates a whole-number variable x and starts it at 5' },
        { code: 'x = 9;', meaning: 'puts a new value in the existing variable x (no type)' },
        { code: 'cout << x', meaning: 'prints the value stored in x' },
      ],
    },
    compare: {
      py: { code: 'apples = 5\napples = 9\nprint(apples)', outcome: 'Prints 9', ok: true },
      cpp: { code: 'int apples = 5;\napples = 9;\ncout << apples << endl;', outcome: 'Prints 9', ok: true },
      text: 'C++ names the type once, when the variable is created, and the variable can only hold that type afterwards. Python decides the type from the value each time.',
    },
    refresher: [
      '<code>int x = 5;</code> declares and initialises. <code>x = 9;</code> assigns to an existing variable.',
      'Declare a variable before its first use. Print it with <code>cout &lt;&lt; x;</code>.',
    ],
    hints: [
      'Assignment is the variable name, <code>=</code>, the value and <code>;</code>. Do not write <code>int</code> again.',
      'Print <code>apples</code> a second time after you change it.',
    ],
    inPython: {
      code: 'apples = 5\nprint(apples)\napples = 9\nprint(apples)',
      note: 'The same two steps in Python, with no type and no <code>;</code>. C++ adds the type up front.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int apples = 5;\n    cout << apples << endl;\n    // give apples the value 9 and print it again\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int apples = 5;\n    cout << apples << endl;\n    apples = 9;\n    cout << apples << endl;\n    return 0;\n}',
    require: [{ pattern: 'apples\\s*=\\s*9', message: 'Assign 9 to apples' }],
    forbidden: [{ pattern: 'int\\s+apples[^;]*;[\\s\\S]*int\\s+apples', message: 'Declare apples only once' }],
    tests: [{ name: 'Prints 5 then 9', stdin: '', expected: '5\n9' }],
  },

  // 7. predict: uninitialised variable (UB), copy semantics
  {
    id: 'c1-predict-uninit',
    title: 'A variable with no value',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    teach: {
      body: [
        `<p>In Python a name cannot exist without a value, because <code>x = 5</code> creates the name and the value together. In C++, <code>int x;</code> creates the box and puts <em>nothing in particular</em> in it. The box holds whatever bits happened to be in that piece of memory before. This is called an <em>uninitialised</em> variable.</p>`,
        `<p>Reading it is <em>undefined behaviour</em>, which is a phrase you will meet often. It means the C++ rules do not say what happens, so anything may happen: it may print 0, or a strange number, or a different number on each run, or behave differently when you change an unrelated line. The compiler is allowed to assume it never happens. The habit to build is simple: give every variable a value when you declare it.</p>`,
        `<p>This course never shows the output of undefined behaviour as if it were an answer, because there is none. When a snippet is undefined, the right answer is "undefined". Finally, assigning one variable to another copies the value: after <code>b = a;</code> the two boxes are independent.</p>`,
      ],
      examples: [
        {
          code: 'int a = 4;            // initialised: a holds 4\nint b = 0;            // initialised: b holds 0\ncout << a << " " << b << endl;',
          output: '4 0',
          caption: 'Give every variable a starting value.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'int x;', meaning: 'creates x with no defined value; reading it is undefined behaviour' },
        { code: 'int x = 0;', meaning: 'creates x and gives it a value at once; the safe habit' },
      ],
    },
    refresher: [
      'An uninitialised local variable holds no defined value; reading it is undefined behaviour, so anything can happen.',
      '<code>b = a;</code> copies the value; later changes to <code>a</code> do not affect <code>b</code>.',
    ],
    rounds: [
      {
        snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x;\n    cout << x << endl;\n    return 0;\n}',
        choices: ['It always prints 0', 'Undefined: it can print anything', 'A compile error'],
        answer: 1,
        why: 'x was never given a value, so reading it is undefined behaviour. It might print 0 today and something else tomorrow. Always initialise.',
        ub: true,
        ubKind: 'uninit',
        output: 'Undefined: anything can happen (x was never given a value).',
      },
      {
        snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 5;\n    int b = a;\n    a = 9;\n    cout << b << " " << a << endl;\n    return 0;\n}',
        choices: ['9 9', '5 9', '5 5'],
        answer: 1,
        why: 'b = a copied the value 5 into its own box. Changing a afterwards does not touch b, so it prints 5 and 9.',
        output: '5 9',
      },
    ],
  },

  // 8. fix: declare before use
  {
    id: 'c1-fix-undeclared',
    title: 'Declare before you use',
    kind: 'fix',
    task: 'This does not compile. Fix it so it prints <em>3</em>.',
    errorMatch: 'use of undeclared identifier',
    gloss: 'The compiler does not know the name <code>lives</code>, because no line created that variable before it was used.',
    introduces: [],
    refresher: [
      'Every variable needs a declaration with a type before its first use: <code>int lives = 3;</code>.',
      '"Use of undeclared identifier" means a name has no declaration above it; check for typos too.',
    ],
    hints: [
      'The error names the variable the compiler does not know. Find where it is first used.',
      'Add a declaration above that line, with the type <code>int</code>.',
    ],
    inPython: {
      code: 'lives = 3\nprint(lives)',
      note: 'In Python the first assignment creates the variable. In C++ creating a variable needs its own declaration with a type.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    lives = 3;\n    cout << lives << endl;\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int lives = 3;\n    cout << lives << endl;\n    return 0;\n}',
    tests: [{ name: 'Prints 3', stdin: '', expected: '3' }],
  },

  // 9. double, bool, char
  {
    id: 'c1-double-bool-char',
    title: 'double, bool and char',
    kind: 'concept',
    task: 'Declare a <code>double</code> named <code>price</code> set to 2.5, a <code>bool</code> named <code>ready</code> set to true and a <code>char</code> named <code>grade</code> set to \'A\'. Print them on one line, separated by spaces.',
    introduces: ['double', 'bool', 'char'],
    teach: {
      body: [
        `<p>Whole numbers are not the only kind of value. C++ has a type for each, and you choose when you declare the variable. <code>double</code> holds a number with a decimal point, like Python's <code>float</code>: <code>double price = 2.5;</code>. (There is also a smaller <code>float</code>, but <code>double</code> is the usual choice.) A number written with a point, like <code>2.5</code> or <code>3.0</code>, is a <code>double</code>; one without, like <code>3</code>, is an <code>int</code>. That difference matters in the next lessons.</p>`,
        `<p><code>bool</code> holds a yes-or-no value: <code>bool ready = true;</code>. The two values are written in lowercase, <code>true</code> and <code>false</code> (Python capitalises them). One surprise: <code>cout</code> prints <code>true</code> as <code>1</code> and <code>false</code> as <code>0</code>.</p>`,
        `<p><code>char</code> holds exactly one character, and you write it in <em>single</em> quotes: <code>char grade = 'A';</code>. In Python single and double quotes are interchangeable. In C++ they are not: single quotes make one character, double quotes make a string literal. <code>'A'</code> and <code>"A"</code> are different things. A <code>char</code> prints as the character.</p>`,
      ],
      examples: [
        {
          code: 'double height = 1.75;     // a number with a decimal point\nbool tall = false;        // true or false, in lowercase\nchar initial = \'J\';       // one character in single quotes\ncout << height << " " << tall << " " << initial << endl;   // tall prints as 0',
          output: '1.75 0 J',
          caption: 'Three more types.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'double x = 2.5;', meaning: 'a number with a decimal point' },
        { code: 'bool b = true;', meaning: 'true or false, in lowercase; prints as 1 or 0' },
        { code: "char c = 'A';", meaning: 'one character, in single quotes' },
      ],
    },
    compare: {
      py: { code: 'ready = True\nprint(ready)', outcome: 'Prints True', ok: true },
      cpp: { code: 'bool ready = true;\ncout << ready << endl;', outcome: 'Prints 1', ok: true },
      text: 'C++ spells the values <code>true</code> and <code>false</code> in lowercase, and <code>cout</code> prints them as 1 and 0 where Python prints the words.',
    },
    refresher: [
      '<code>double</code> holds decimals, <code>bool</code> holds <code>true</code>/<code>false</code>, <code>char</code> holds one character in single quotes.',
      '<code>cout</code> prints a <code>bool</code> as 1 or 0.',
    ],
    hints: [
      'Three declarations, one per variable, each with its type first.',
      'Print all three in a single chain with <code>" "</code> between them. The bool will print as 1.',
    ],
    inPython: {
      code: 'price = 2.5\nready = True\ngrade = "A"\nprint(price, ready, grade)',
      note: 'Python has no separate char type: a single letter is just a string of length one.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // declare price, ready and grade, then print them\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    double price = 2.5;\n    bool ready = true;\n    char grade = \'A\';\n    cout << price << " " << ready << " " << grade << endl;\n    return 0;\n}',
    require: [
      { pattern: 'double\\s+price', message: 'Declare double price' },
      { pattern: 'bool\\s+ready', message: 'Declare bool ready' },
      { pattern: 'char\\s+grade', message: 'Declare char grade' },
    ],
    tests: [{ name: 'Prints 2.5 1 A', stdin: '', expected: '2.5 1 A' }],
  },

  // 10. string
  {
    id: 'c1-string',
    title: 'Text in a string variable',
    kind: 'program',
    task: 'Make two <code>string</code> variables, <code>greeting</code> holding Hello and <code>name</code> holding World. Print them as <em>Hello, World</em> using one <code>cout</code> chain.',
    introduces: ['include-string', 'string-type'],
    teach: {
      body: [
        `<p>Text in a variable has the type <code>string</code>, the counterpart of Python's <code>str</code>. To use it, add <code>#include &lt;string&gt;</code> at the top, the way you added <code>iostream</code>: <code>string name = "Ada";</code>. A <code>string</code> variable holds any amount of text, and <code>cout</code> prints it like a literal.</p>`,
        `<p>Two details to remember. Text in a string always uses <em>double</em> quotes; <code>'Ada'</code> with single quotes is not a string in C++. And, like every variable, a <code>string</code> variable only ever holds strings: you cannot put a number in it later.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <string>          // needed for the string type\nusing namespace std;\n\nint main() {\n    string city = "Paris";    // a string variable: text in double quotes\n    string country = "France";\n    cout << city << " is in " << country << endl;   // variables and literals mix freely\n    return 0;\n}',
          output: 'Paris is in France',
        },
      ],
      terms: [
        { code: '#include <string>', meaning: 'brings in the string type' },
        { code: 'string s = "text";', meaning: 'a variable holding text; text always uses double quotes' },
      ],
    },
    refresher: [
      '<code>string s = "text";</code> needs <code>#include &lt;string&gt;</code>. Strings use double quotes; single quotes are for one <code>char</code>.',
      'Print a string variable with <code>cout &lt;&lt; s;</code>.',
    ],
    hints: [
      'Add the include for string, then two declarations.',
      'Print <code>greeting</code>, then the literal <code>", "</code>, then <code>name</code>.',
    ],
    inPython: {
      code: 'greeting = "Hello"\nname = "World"\nprint(greeting + ", " + name)',
      note: 'Python joins strings with <code>+</code>. In C++ the <code>&lt;&lt;</code> chain does the joining when printing.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // make greeting and name, then print them\n    return 0;\n}',
    solution: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string greeting = "Hello";\n    string name = "World";\n    cout << greeting << ", " << name << endl;\n    return 0;\n}',
    require: [
      { pattern: 'string\\s+greeting', message: 'Declare string greeting' },
      { pattern: 'string\\s+name', message: 'Declare string name' },
    ],
    tests: [{ name: 'Prints Hello, World', stdin: '', expected: 'Hello, World' }],
  },

  // 11. fix: a variable cannot change type
  {
    id: 'c1-fix-type-change',
    title: 'A variable keeps its type',
    kind: 'fix',
    task: 'This does not compile. It should print <em>10</em> and then <em>ten</em>. Keep the number in <code>score</code> and put the text somewhere else.',
    errorMatch: 'incompatible type',
    gloss: 'The box <code>score</code> was made to hold an <code>int</code>, and C++ will not let you put text in it later.',
    introduces: [],
    refresher: [
      'A variable keeps the type it was declared with. To hold something of another type, make another variable.',
      '<code>score = "ten";</code> tries to put text into an int, which the compiler refuses.',
    ],
    hints: [
      'Python lets a name switch from number to text; C++ never does.',
      'Declare a new <code>string</code> variable for the word, and print that instead.',
    ],
    inPython: {
      code: 'score = 10\nprint(score)\nscore = "ten"\nprint(score)',
      note: 'Python happily lets <code>score</code> become text. In C++ the type is part of the variable for good, and the compiler checks it.',
    },
    starter: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int score = 10;\n    cout << score << endl;\n    score = "ten";\n    cout << score << endl;\n    return 0;\n}',
    solution: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int score = 10;\n    cout << score << endl;\n    string word = "ten";\n    cout << word << endl;\n    return 0;\n}',
    require: [{ pattern: 'int\\s+score\\s*=\\s*10', message: 'Keep score as an int holding 10' }],
    tests: [{ name: 'Prints 10 then ten', stdin: '', expected: '10\nten' }],
  },

  // 12. arithmetic, integer division
  {
    id: 'c1-arithmetic',
    title: 'Arithmetic and whole-number division',
    kind: 'concept',
    task: 'With <code>a</code> = 17 and <code>b</code> = 5, print <code>a + b</code>, <code>a - b</code>, <code>a * b</code> and <code>a / b</code>, each on its own line.',
    introduces: ['arithmetic'],
    teach: {
      body: [
        `<p>C++ does arithmetic with <code>+</code>, <code>-</code>, <code>*</code> and <code>/</code>, in the usual order: multiplication and division before addition and subtraction, and parentheses to override. There is no <code>**</code> operator; powers come later with a function.</p>`,
        `<p>There is one big difference from Python. When <em>both</em> numbers are whole numbers (ints), <code>/</code> gives a whole number and drops the fraction. So <code>7 / 2</code> is <code>3</code>, not <code>3.5</code>. Python's <code>/</code> always gives a decimal, and its <code>//</code> gives a whole number but rounds <em>down</em>. C++'s <code>/</code> on ints simply cuts off the part after the point, so it rounds toward zero. For positive numbers that matches Python's <code>//</code>. For negative numbers it does not: <code>-7 / 2</code> is <code>-3</code> in C++ and <code>-4</code> with Python's <code>//</code>.</p>`,
        `<p>This is the most common surprise for Python programmers, because the mistake still compiles and prints a plausible number. A later lesson shows how to get a decimal answer when you need one.</p>`,
      ],
      examples: [
        {
          code: 'cout << 2 + 3 << endl;      // 5\ncout << 10 - 4 << endl;     // 6\ncout << 6 * 7 << endl;      // 42\ncout << 7 / 2 << endl;      // 3: both are whole numbers, so the fraction is dropped\ncout << 2 + 3 * 4 << endl;  // 14: multiplication goes first\ncout << (2 + 3) * 4 << endl; // 20: parentheses go first',
          output: '5\n6\n42\n3\n14\n20',
          wrap: true,
        },
      ],
      terms: [
        { code: '+ - * /', meaning: 'add, subtract, multiply, divide; int divided by int is an int with the fraction dropped' },
        { code: '( )', meaning: 'group a calculation so it runs first' },
      ],
    },
    compare: {
      py: { code: 'print(7 / 2)', outcome: 'Prints 3.5', ok: true },
      cpp: { code: 'cout << 7 / 2 << endl;', outcome: 'Prints 3: both ints, fraction dropped', ok: true },
      text: 'Python\'s <code>/</code> always gives a decimal. C++ gives a whole number when both sides are ints, so <code>7 / 2</code> is 3.',
    },
    refresher: [
      'int divided by int is an int: the fraction is dropped toward zero (<code>7 / 2</code> is 3, <code>-7 / 2</code> is -3).',
      '<code>*</code> and <code>/</code> bind tighter than <code>+</code> and <code>-</code>; use parentheses to be explicit.',
    ],
    hints: [
      'Four <code>cout</code> lines, one for each calculation.',
      'Do the calculation right inside the chain: <code>cout &lt;&lt; a + b &lt;&lt; endl;</code>.',
    ],
    inPython: {
      code: 'a = 17\nb = 5\nprint(a + b, a - b, a * b, a // b)',
      note: 'Python\'s <code>//</code> is the closest thing to C++\'s <code>/</code> on ints, but it rounds down and C++ rounds toward zero.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 17;\n    int b = 5;\n    // print the sum, difference, product and quotient, one per line\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 17;\n    int b = 5;\n    cout << a + b << endl;\n    cout << a - b << endl;\n    cout << a * b << endl;\n    cout << a / b << endl;\n    return 0;\n}',
    tests: [{ name: 'Four results', stdin: '', expected: '22\n12\n85\n3' }],
  },

  // 13. predict: % with negatives
  {
    id: 'c1-predict-modulo',
    title: 'Remainders and negatives',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then run it and compare.',
    introduces: ['modulo'],
    teach: {
      body: [
        `<p><code>%</code> is the <em>remainder</em> after division: <code>17 % 5</code> is <code>2</code>, because 5 goes into 17 three times with 2 left over. Python has the same operator, and for positive numbers the two agree. With a negative number they differ, for the same reason that <code>/</code> differs: C++ rounds the division toward zero, and the remainder is whatever is left. The two always fit together: <code>(a / b) * b + a % b</code> equals <code>a</code>.</p>`,
        `<p>So in C++ the result of <code>%</code> takes the sign of the left number: <code>-7 % 3</code> is <code>-1</code>, while Python's <code>-7 % 3</code> is <code>2</code>. When you need Python's always-positive remainder in C++, you have to adjust it yourself; this matters for things like wrapping around a clock.</p>`,
      ],
      examples: [
        {
          code: 'cout << 17 % 5 << endl;   // 2: the remainder of 17 divided by 5\ncout << 20 % 5 << endl;   // 0: 5 divides 20 exactly\ncout << 6 % 10 << endl;   // 6: 10 does not fit even once, so everything is left over',
          output: '2\n0\n6',
          wrap: true,
        },
      ],
      terms: [{ code: 'a % b', meaning: 'the remainder of a divided by b; takes the sign of a' }],
    },
    inPython: {
      code: 'print(-7 // 2, -7 % 3)',
      note: 'Python rounds division down and gives <code>-4 2</code>. C++ rounds toward zero, so the same numbers give <code>-3 -1</code>.',
    },
    refresher: [
      '<code>a % b</code> is the remainder; with negatives it takes the sign of <code>a</code>: <code>-7 % 3</code> is -1.',
      'C++ keeps <code>(a / b) * b + a % b == a</code>, because <code>/</code> rounds toward zero.',
    ],
    rounds: [
      {
        snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << 17 % 5 << endl;\n    cout << -7 / 2 << endl;\n    cout << -7 % 3 << endl;\n    return 0;\n}',
        choices: ['2, -4, 2 (what Python gives)', '2, -3, -1', '2, -3, 1'],
        answer: 1,
        why: '17 % 5 is 2. -7 / 2 drops the fraction toward zero to -3. The remainder takes the sign of -7, so -7 % 3 is -1. Python would give -4 and 2 for the last two.',
        output: '2\n-3\n-1',
      },
      {
        snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << (-7 / 2) * 2 + (-7 % 2) << endl;\n    return 0;\n}',
        choices: ['-8', '-7', '-6'],
        answer: 1,
        why: 'Here (-7 / 2) is -3 and (-7 % 2) is -1, so -3 * 2 + -1 is -7. C++ always keeps (a / b) * b + a % b equal to a.',
        output: '-7',
      },
    ],
  },

  // 14. mixing int and double, static_cast
  {
    id: 'c1-cast-double',
    title: 'Getting a decimal answer',
    kind: 'concept',
    task: 'The program should print the exact average of 7 and 2, which is <em>3.5</em>, but <code>total / parts</code> would print 3. Convert <code>total</code> to a <code>double</code> with <code>static_cast</code> and print the average.',
    introduces: ['static-cast'],
    teach: {
      body: [
        `<p>If either side of <code>/</code> is a <code>double</code>, C++ turns the other side into a <code>double</code> too and divides as decimals. So <code>7 / 2.0</code> is <code>3.5</code>, and so is <code>7.0 / 2</code>. The rule: int with int stays int; as soon as a <code>double</code> is involved, the result is a <code>double</code>.</p>`,
        `<p>When the numbers are in int <em>variables</em>, you cannot just add <code>.0</code>. You <em>cast</em>: <code>static_cast&lt;double&gt;(total)</code> means "give me the value of <code>total</code> as a <code>double</code>". Then <code>static_cast&lt;double&gt;(total) / parts</code> divides a double by an int, which gives a double. The angle brackets hold the type you want, and the value goes in the parentheses. It makes a converted copy; <code>total</code> itself does not change.</p>`,
        `<p>A common trap: <code>double r = total / parts;</code> still divides two ints first (giving 3) and only then stores 3.0 in <code>r</code>. Cast the operand before dividing, not the answer after.</p>`,
      ],
      examples: [
        {
          code: 'int a = 9;\nint b = 4;\ncout << a / b << endl;                          // 2: int divided by int\ncout << 9 / 4.0 << endl;                        // 2.25: one side is a double\ncout << static_cast<double>(a) / b << endl;     // 2.25: a converted to double first',
          output: '2\n2.25\n2.25',
          caption: 'Three ways to divide the same numbers.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'static_cast<double>(x)', meaning: 'x converted to a double (a copy; x itself is unchanged)' },
        { code: '9 / 4.0', meaning: 'if either side is a double, the division is done as decimals' },
      ],
    },
    compare: {
      py: { code: 'print(9 / 4)', outcome: 'Prints 2.25', ok: true },
      cpp: { code: 'int a = 9;\nint b = 4;\ncout << static_cast<double>(a) / b << endl;', outcome: 'Prints 2.25', ok: true },
      text: 'Python\'s <code>/</code> always divides as decimals. In C++ you ask for that by making one side a double, usually with <code>static_cast&lt;double&gt;</code>.',
    },
    refresher: [
      'int with int divides as ints. If either side is a double, the division is done as decimals.',
      '<code>static_cast&lt;double&gt;(x) / y</code> converts before dividing; <code>double r = x / y;</code> converts too late.',
    ],
    hints: [
      'Cast <code>total</code>, not the finished answer.',
      'Print <code>static_cast&lt;double&gt;(total) / parts</code>.',
    ],
    inPython: {
      code: 'total = 7\nparts = 2\nprint(total / parts)',
      note: 'Python\'s <code>/</code> gives 3.5 without any conversion. C++ needs a double on one side.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int total = 7;\n    int parts = 2;\n    cout << total / parts << endl;\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int total = 7;\n    int parts = 2;\n    cout << static_cast<double>(total) / parts << endl;\n    return 0;\n}',
    require: [{ pattern: 'static_cast\\s*<\\s*double\\s*>', message: 'Use static_cast<double>' }],
    tests: [{ name: 'Prints 3.5', stdin: '', expected: '3.5' }],
  },

  // 15. cin
  {
    id: 'c1-sum-two',
    title: 'Reading input with cin',
    kind: 'program',
    task: 'Read two whole numbers from the input and print their sum on one line.',
    introduces: ['cin', 'stream-extract'],
    teach: {
      body: [
        `<p><code>cin</code> is the keyboard input, the counterpart of <code>cout</code> ("console input"). <code>cin &gt;&gt; a;</code> reads the next value from the input into the variable <code>a</code>. The arrows point the other way from <code>cout</code> because data now flows <em>into</em> the variable. You declare the variable first, and its type tells <code>cin</code> how to read: an <code>int</code> variable reads a whole number.</p>`,
        `<p><code>cin</code> reads <em>whitespace-separated</em> values: spaces, tabs and new lines all count as gaps and are skipped. So <code>3 4</code> and <code>3</code> newline <code>4</code> look the same to it. You can chain: <code>cin &gt;&gt; a &gt;&gt; b;</code> reads two numbers in order. Unlike Python's <code>input()</code>, <code>cin</code> never prints a prompt and never gives you a whole line; it hands you one value at a time, converted to the variable's type, so there is no <code>int(input())</code> step.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a;             // a box for a whole number\n    int b;\n    cin >> a >> b;     // read two numbers from the input\n    cout << a << " and " << b << endl;\n    return 0;\n}',
          stdin: '3 4',
          output: '3 and 4',
          caption: 'Reading two numbers.',
        },
      ],
      terms: [
        { code: 'cin >> a;', meaning: 'reads the next whitespace-separated value into a, converted to the type of a' },
        { code: 'cin >> a >> b;', meaning: 'reads two values in order' },
      ],
    },
    refresher: [
      '<code>int a, b;</code> makes two int variables. <code>cin &gt;&gt; a &gt;&gt; b;</code> reads them in order, whatever whitespace separates them.',
      'Print the answer with <code>cout &lt;&lt; ... &lt;&lt; endl;</code>.',
    ],
    hints: [
      'You need two int variables and one statement that reads both.',
      'Add them inside the <code>cout</code> statement, or in a third variable first.',
    ],
    inPython: {
      code: 'a, b = map(int, "3 4".split())\nprint(a + b)',
      note: 'Python reads a line, splits it and converts each piece. <code>cin &gt;&gt;</code> splits on whitespace and converts to the variable\'s type in one step.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // read two numbers and print their sum\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}',
    tests: [
      { name: 'Two small numbers', stdin: '3 4\n', expected: '7' },
      { name: 'On separate lines', stdin: '10\n-4\n', expected: '6' },
      { name: 'Zeros', stdin: '0 0\n', expected: '0' },
    ],
  },

  // 16. fix: cin direction
  {
    id: 'c1-fix-cin-arrows',
    title: 'The arrows point the wrong way',
    kind: 'fix',
    task: 'This should read a number and print it doubled, but it does not compile. Fix it.',
    errorMatch: 'invalid operands to binary expression',
    gloss: '<code>&lt;&lt;</code> sends data out to a stream, so it cannot read a value from <code>cin</code> into <code>n</code>.',
    introduces: [],
    refresher: [
      '<code>cout</code> goes with <code>&lt;&lt;</code> (data flows out to the screen); <code>cin</code> goes with <code>&gt;&gt;</code> (data flows into the variable).',
      'Picture the arrows pointing in the direction the data travels.',
    ],
    hints: [
      'Look at the line that reads the number.',
      'Reading needs the arrows pointing at the variable.',
    ],
    inPython: {
      code: 'n = 21\nprint(n * 2)',
      note: 'Python has no arrows at all: <code>input()</code> returns the value. In C++ the arrows show which way the data flows.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin << n;\n    cout << n * 2 << endl;\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    cout << n * 2 << endl;\n    return 0;\n}',
    tests: [
      { name: 'Doubles 21', stdin: '21\n', expected: '42' },
      { name: 'Doubles a negative', stdin: '-5\n', expected: '-10' },
    ],
  },

  // 17. cin with a string and an int, whitespace
  {
    id: 'c1-read-mixed',
    title: 'Reading a word and a number',
    kind: 'program',
    task: 'Read a first name (one word) and an age. Print <em>Ada will be 37 next year</em>, with the name and the age plus one filled in.',
    introduces: [],
    teach: {
      body: [
        `<p>The type of the variable decides how <code>cin</code> reads. Into a <code>string</code>, it reads <em>one word</em>: it skips the leading whitespace and stops at the next space or newline. Into an <code>int</code>, it reads a whole number the same way. So <code>cin &gt;&gt; name &gt;&gt; age;</code> works for the input <code>Ada 36</code> and also for <code>Ada</code> newline <code>36</code>.</p>`,
        `<p>This is where <code>cin &gt;&gt;</code> is least like <code>input()</code>: you cannot read "a whole line with spaces" this way, only word by word. (Reading whole lines comes in stage 4.) Order matters too: values come out in the order they were typed, so the variables must be read in that order.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string word;       // will hold one word\n    int n;             // will hold one whole number\n    cin >> word >> n;  // reads a word, then a number\n    cout << word << " " << n * 2 << endl;\n    return 0;\n}',
          stdin: 'apples   21',
          output: 'apples 42',
          caption: 'Extra spaces are skipped.',
        },
      ],
      terms: [
        { code: 'cin >> word;', meaning: 'into a string: reads one whitespace-delimited word' },
        { code: 'cin >> n;', meaning: 'into an int: reads one whole number' },
      ],
    },
    refresher: [
      '<code>cin &gt;&gt; s;</code> into a <code>string</code> reads one word; into an <code>int</code> it reads one number.',
      'Read the values in the order they appear in the input.',
    ],
    hints: [
      'Declare a <code>string</code> and an <code>int</code>, then read both in one chain.',
      'Print the age plus one inside the <code>cout</code> chain, between the text pieces.',
    ],
    inPython: {
      code: 'name, age = "Ada 36".split()\nprint(name, "will be", int(age) + 1, "next year")',
      note: 'Python splits a line and converts the age by hand. <code>cin</code> does both at once for each variable.',
    },
    starter: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    // read a name and an age, then print the sentence\n    return 0;\n}',
    solution: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    int age;\n    cin >> name >> age;\n    cout << name << " will be " << age + 1 << " next year" << endl;\n    return 0;\n}',
    tests: [
      { name: 'Same line', stdin: 'Ada 36\n', expected: 'Ada will be 37 next year' },
      { name: 'Separate lines', stdin: 'Linus\n55\n', expected: 'Linus will be 56 next year' },
      { name: 'Extra spaces', stdin: '   Bo     7\n', expected: 'Bo will be 8 next year' },
    ],
  },

  // 18. += -= *=, ++ --
  {
    id: 'c1-compound-assign',
    title: '+=, ++ and friends',
    kind: 'concept',
    task: 'Read a whole number <code>n</code>. Add 3 to it, then double it, then subtract 1, using <code>+=</code>, <code>*=</code> and <code>--</code>. Print the final value.',
    introduces: ['compound-assign', 'incr-decr'],
    teach: {
      body: [
        `<p>Changing a variable using its own value is so common that C++ has short forms. <code>n += 3;</code> means <code>n = n + 3;</code>. The same pattern works for the other operators: <code>-=</code>, <code>*=</code>, <code>/=</code> and <code>%=</code>. You know these from Python.</p>`,
        `<p>Adding or subtracting exactly 1 is even more common, so there are two tiny operators for it: <code>n++;</code> adds 1 and <code>n--;</code> subtracts 1. Python has no <code>++</code> or <code>--</code> (they are a syntax error or do nothing), so this is new. For now, use them only as a statement on their own line. (They can also sit inside bigger expressions, which is where they get tricky; that waits until you need it.) <code>++n;</code> does the same job as <code>n++;</code> when written alone.</p>`,
      ],
      examples: [
        {
          code: 'int n = 10;\nn += 5;                  // n = n + 5, so 15\ncout << n << endl;\nn *= 2;                  // n = n * 2, so 30\ncout << n << endl;\nn--;                     // one less: 29\ncout << n << endl;\nn++;                     // one more: 30\ncout << n << endl;',
          output: '15\n30\n29\n30',
          wrap: true,
        },
      ],
      terms: [
        { code: 'n += 3;', meaning: 'n = n + 3; also -=, *=, /=, %=' },
        { code: 'n++; n--;', meaning: 'add one to n; subtract one from n' },
      ],
    },
    compare: {
      py: { code: 'n = 5\nn++', outcome: 'SyntaxError: Python has no ++', ok: false },
      cpp: { code: 'int n = 5;\nn++;\ncout << n << endl;', outcome: 'Prints 6', ok: true },
      text: 'Python spells it <code>n += 1</code> and has no <code>++</code> or <code>--</code>. C++ has both forms.',
    },
    refresher: [
      '<code>n += 3;</code> is <code>n = n + 3;</code>. The same idea works for <code>-=</code>, <code>*=</code>, <code>/=</code> and <code>%=</code>.',
      '<code>n++;</code> adds 1 and <code>n--;</code> subtracts 1.',
    ],
    hints: [
      'Read n first, then three statements in order, then print.',
      'The three steps are <code>n += 3;</code>, <code>n *= 2;</code> and <code>n--;</code>.',
    ],
    inPython: {
      code: 'n = 4\nn += 3\nn *= 2\nn -= 1\nprint(n)',
      note: 'Python has <code>+=</code> and <code>*=</code> too. It has no <code>--</code>, so you write <code>n -= 1</code>.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // add 3, double, subtract 1, then print\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    n += 3;\n    n *= 2;\n    n--;\n    cout << n << endl;\n    return 0;\n}',
    require: [
      { pattern: '\\+=', message: 'Use +=' },
      { pattern: '\\*=', message: 'Use *=' },
      { pattern: '--', message: 'Use --' },
    ],
    tests: [
      { name: 'n = 4', stdin: '4\n', expected: '13' },
      { name: 'n = 0', stdin: '0\n', expected: '5' },
      { name: 'Negative n', stdin: '-3\n', expected: '-1' },
    ],
  },

  // 19. const
  {
    id: 'c1-const',
    title: 'const values',
    kind: 'concept',
    task: 'Read a number of hours <code>h</code> and print how many minutes that is. Keep the 60 in a <code>const int</code> named <code>minutesPerHour</code>.',
    introduces: ['const'],
    teach: {
      body: [
        `<p>Some values should never change while the program runs: the number of minutes in an hour, a tax rate, the size of a board. Writing <code>const</code> before a declaration makes the variable <em>read-only</em>: <code>const int minutesPerHour = 60;</code>. A <code>const</code> variable must be given its value right where it is declared, and any later attempt to assign to it is a compile error. The compiler guards your intention for you.</p>`,
        `<p>This also replaces "magic numbers": <code>h * minutesPerHour</code> says what the 60 means, where <code>h * 60</code> does not. Python has no <code>const</code>; by convention people write names in CAPITALS and trust everyone to leave them alone. C++ enforces it.</p>`,
      ],
      examples: [
        {
          code: 'const int daysInWeek = 7;      // read-only: it can never be assigned again\nint weeks = 3;\ncout << weeks * daysInWeek << endl;   // 21',
          output: '21',
          wrap: true,
        },
      ],
      terms: [{ code: 'const int x = 7;', meaning: 'a variable that cannot be assigned to after it is created' }],
    },
    compare: {
      py: { code: 'DAYS = 7\nDAYS = 8\nprint(DAYS)', outcome: 'Prints 8: nothing stops you', ok: true },
      cpp: { code: 'const int days = 7;\ncout << days << endl;', outcome: 'Prints 7; assigning later would not compile', ok: true },
      text: 'Python relies on a CAPITAL-letters habit. C++ makes the compiler reject any change to a <code>const</code>.',
    },
    refresher: [
      '<code>const int x = 60;</code> must be initialised at once, and cannot be assigned to afterwards.',
      'Name the value instead of repeating a bare number like 60.',
    ],
    hints: [
      'Declare the constant first, then read <code>h</code>.',
      'Print <code>h * minutesPerHour</code>.',
    ],
    inPython: {
      code: 'MINUTES_PER_HOUR = 60\nh = 2\nprint(h * MINUTES_PER_HOUR)',
      note: 'Python only has the CAPITALS convention, and nothing stops a later assignment. C++\'s <code>const</code> is checked by the compiler.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int h;\n    cin >> h;\n    // print the minutes in h hours, using a const\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    const int minutesPerHour = 60;\n    int h;\n    cin >> h;\n    cout << h * minutesPerHour << endl;\n    return 0;\n}',
    require: [{ pattern: 'const\\s+int\\s+minutesPerHour', message: 'Declare const int minutesPerHour' }],
    tests: [
      { name: '2 hours', stdin: '2\n', expected: '120' },
      { name: '0 hours', stdin: '0\n', expected: '0' },
      { name: '24 hours', stdin: '24\n', expected: '1440' },
    ],
  },

  // 20. fix: assigning to a const
  {
    id: 'c1-fix-const',
    title: 'Changing a const',
    kind: 'fix',
    task: 'This does not compile. It should print <em>14</em>. Fix it.',
    errorMatch: 'cannot assign to variable',
    gloss: '<code>days</code> was declared <code>const</code>, so the compiler refuses to let the line <code>days = ...</code> change it.',
    introduces: [],
    refresher: [
      'A <code>const</code> variable can never be assigned to after its declaration.',
      'If a value needs to change, it should not be <code>const</code>.',
    ],
    hints: [
      'Find the assignment to <code>days</code>, then look at how <code>days</code> was declared.',
      'Remove <code>const</code> from that declaration.',
    ],
    inPython: {
      code: 'days = 7\ndays = 2 * 7\nprint(days)',
      note: 'Python lets any name be reassigned. In C++ <code>const</code> marks a variable you promised not to change.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    const int days = 7;\n    int weeks = 2;\n    days = weeks * 7;\n    cout << days << endl;\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int days = 7;\n    int weeks = 2;\n    days = weeks * 7;\n    cout << days << endl;\n    return 0;\n}',
    tests: [{ name: 'Prints 14', stdin: '', expected: '14' }],
  },

  // 21. auto
  {
    id: 'c1-auto',
    title: 'Letting the compiler pick the type',
    kind: 'concept',
    task: 'This works. Rewrite the declaration of <code>square</code> using <code>auto</code> instead of <code>int</code>.',
    introduces: ['auto'],
    teach: {
      body: [
        `<p>When you initialise a variable on the same line, the compiler already knows the type of the value. <code>auto</code> tells it to use that type: <code>auto count = 5;</code> makes an <code>int</code>, <code>auto ratio = 2.5;</code> makes a <code>double</code>, and <code>auto ok = true;</code> makes a <code>bool</code>. It is not like Python's dynamic typing: the type is worked out once, at compile time, and then fixed forever. <code>count</code> above can never hold text.</p>`,
        `<p><code>auto</code> needs a value to look at, so <code>auto x;</code> with nothing after it is an error. For now, use it for simple numbers, where it saves typing. Be careful with text: <code>auto s = "hi";</code> does <em>not</em> make a <code>string</code> (it makes a bare C-style text pointer, which later lessons explain), so keep writing <code>string s = "hi";</code>. In later stages <code>auto</code> becomes a real convenience when types get long.</p>`,
      ],
      examples: [
        {
          code: 'auto a = 7;          // 7 is an int, so a is an int\nauto b = 2.5;        // 2.5 is a double, so b is a double\nauto c = a * 2;      // int times int is an int, so c is an int\ncout << a << " " << b << " " << c << endl;',
          output: '7 2.5 14',
          wrap: true,
        },
      ],
      terms: [{ code: 'auto x = 5;', meaning: 'the type of x is taken from its starting value, once, at compile time' }],
    },
    compare: {
      py: { code: 'x = 5\nprint(x)', outcome: 'Prints 5; x may later hold anything', ok: true },
      cpp: { code: 'auto x = 5;\ncout << x << endl;', outcome: 'Prints 5; x is an int for good', ok: true },
      text: 'Both skip writing the type, but <code>auto</code> fixes it at compile time, from the starting value, whereas a Python name can hold any type later.',
    },
    refresher: [
      '<code>auto x = value;</code> gives x the type of the value, fixed at compile time. It needs an initial value.',
      'Keep writing <code>string s = "text";</code>: <code>auto</code> on a literal gives the wrong type for now.',
    ],
    hints: [
      'Only the line that declares <code>square</code> changes.',
      'Replace the word <code>int</code> with <code>auto</code> on that line.',
    ],
    inPython: {
      code: 'n = 6\nsquare = n * n\nprint(square)',
      note: 'Python never asks for a type. <code>auto</code> is the nearest thing in C++, but the type it picks is still fixed.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int square = n * n;\n    cout << square << endl;\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    auto square = n * n;\n    cout << square << endl;\n    return 0;\n}',
    require: [{ pattern: 'auto\\s+square\\s*=', message: 'Declare square with auto' }],
    tests: [
      { name: '6 squared', stdin: '6\n', expected: '36' },
      { name: 'Negative', stdin: '-9\n', expected: '81' },
    ],
  },

  // 22. fixed-size integers
  {
    id: 'c1-int-limits',
    title: 'Whole numbers have a size',
    kind: 'concept',
    task: 'Read two whole numbers and print their product. The result can be far larger than an <code>int</code> holds, so use a <code>long long</code>.',
    introduces: ['include-climits', 'int-max', 'long-long', 'unsigned'],
    teach: {
      body: [
        `<p>A Python <code>int</code> grows as big as you need. A C++ <code>int</code> is a box of a <em>fixed size</em>, usually 32 bits, which holds numbers from about -2.1 billion to +2.1 billion. The exact limits are named <code>INT_MIN</code> and <code>INT_MAX</code> (<code>INT_MAX</code> is 2147483647), and you get them with <code>#include &lt;climits&gt;</code>. If you need bigger numbers, use <code>long long</code>, a 64-bit integer that reaches about 9.2 billion billion (9.2 &times; 10<sup>18</sup>). Reading and printing a <code>long long</code> work just like an <code>int</code>.</p>`,
        `<p>What happens when a calculation goes past the limit? For an ordinary <code>int</code>, the C++ rules say that is <em>undefined behaviour</em>: the language promises nothing, the program may print a nonsense number, or something different depending on how it was compiled, and the compiler may even assume it never happens and remove code. This is <em>not</em> a safe wrap-around. Python never has this problem; the number just gets longer. The habit is to pick a type that is large enough before the calculation, and to remember that <code>int * int</code> is still an <code>int</code> calculation, so storing the result in a <code>long long</code> afterwards is too late. Convert one operand first.</p>`,
        `<p>There is one kind of integer whose overflow <em>is</em> defined: <code>unsigned</code> (short for <code>unsigned int</code>). It holds only numbers from 0 up, and going past the top, or below 0, wraps around by the rules of the language. <code>unsigned int u = 0; u = u - 1;</code> gives 4294967295, the largest value. That wrap-around is useful for some tricks but a nasty surprise if you expected -1, so avoid <code>unsigned</code> for ordinary counting.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <climits>        // INT_MAX and INT_MIN live here\nusing namespace std;\n\nint main() {\n    cout << INT_MAX << endl;      // the biggest int\n    cout << INT_MIN << endl;      // the smallest int\n    long long big = INT_MAX;      // a 64-bit box: the same value fits easily\n    big = big + 1;                // the addition is done as long long, so no overflow\n    cout << big << endl;\n    return 0;\n}',
          output: '2147483647\n-2147483648\n2147483648',
          caption: 'The limits of int, and a long long that goes past them.',
        },
        {
          code: 'unsigned int u = 0;     // unsigned: no negative numbers\nu = u - 1;              // wraps around: defined for unsigned\ncout << u << endl;',
          output: '4294967295',
          caption: 'Unsigned wrap-around is defined; int overflow is not.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'INT_MAX, INT_MIN', meaning: 'the largest and smallest int; from <climits>' },
        { code: 'long long', meaning: 'a 64-bit integer, up to about 9.2 x 10^18' },
        { code: 'unsigned int', meaning: 'a non-negative integer that wraps around at its limits' },
      ],
    },
    compare: {
      py: { code: 'print(2147483647 + 1)', outcome: 'Prints 2147483648: Python ints never overflow', ok: true },
      cpp: { code: 'int big = INT_MAX;\nbig = big + 1;\ncout << big << endl;', outcome: 'Undefined: may print anything', ok: false },
      text: 'Python integers grow without limit. A C++ <code>int</code> is 32 bits, and going past its limit is undefined behaviour, so pick <code>long long</code> when the result may be big.',
    },
    refresher: [
      '<code>int</code> holds about +/-2.1 billion (<code>INT_MAX</code> from <code>&lt;climits&gt;</code>); <code>long long</code> holds about +/-9.2e18.',
      'Overflowing an <code>int</code> is undefined behaviour. Convert an operand to <code>long long</code> before multiplying.',
    ],
    hints: [
      'Store the first number in a <code>long long</code> variable before multiplying.',
      'Declare <code>long long p = a;</code>, then <code>p = p * b;</code> and print <code>p</code>.',
    ],
    inPython: {
      code: 'a = 100000\nb = 100000\nprint(a * b)',
      note: 'Python prints 10000000000 without trouble. The same product in a C++ <code>int</code> is too big to fit, so you need <code>long long</code>.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // print a times b, safely, even for big values\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    long long p = a;\n    p = p * b;\n    cout << p << endl;\n    return 0;\n}',
    require: [{ pattern: 'long\\s+long', message: 'Use long long' }],
    tests: [
      { name: 'Small', stdin: '3 4\n', expected: '12' },
      { name: 'Too big for an int', stdin: '100000 100000\n', expected: '10000000000' },
      { name: 'Near the limit', stdin: '2147483647 2\n', expected: '4294967294' },
      { name: 'Negative and big', stdin: '-50000 100000\n', expected: '-5000000000' },
    ],
  },

  // 23. predict: overflow (ub) and unsigned wrap
  {
    id: 'c1-predict-overflow',
    title: 'Going past the limit',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    refresher: [
      'Signed int overflow is undefined behaviour: the result is not "wrapping" or any fixed number.',
      '<code>unsigned</code> wrap-around is defined: <code>0u - 1</code> is the largest unsigned value.',
    ],
    rounds: [
      {
        snippet: '#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int big = INT_MAX;\n    big = big + 1;\n    cout << big << endl;\n    return 0;\n}',
        choices: ['-2147483648, it wraps around', 'Undefined: anything can happen', '2147483648'],
        answer: 1,
        why: 'Adding to INT_MAX overflows a signed int, which C++ defines as undefined behaviour. It may look like a wrap today, but nothing is promised, and the compiler may assume it never happens.',
        ub: true,
        output: 'Undefined: anything can happen (signed int overflow).',
      },
      {
        snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    unsigned int u = 0;\n    u = u - 1;\n    cout << u << endl;\n    return 0;\n}',
        choices: ['-1', '4294967295', 'Undefined: anything can happen'],
        answer: 1,
        why: 'Unlike a signed int, an unsigned value wraps by the language rules: 0 - 1 gives the largest unsigned int, 4294967295. This one is fully defined.',
        output: '4294967295',
      },
    ],
  },

  // 24. cmath
  {
    id: 'c1-math',
    title: 'Math functions',
    kind: 'program',
    task: 'Read two numbers <code>a</code> and <code>b</code> (they may have decimals). Print the square root of <code>a*a + b*b</code> on one line, then the absolute value of <code>a - b</code> on the next.',
    introduces: ['include-cmath', 'math-functions'],
    teach: {
      body: [
        `<p>Math functions live in a header called <code>cmath</code>: <code>#include &lt;cmath&gt;</code>. It is C++'s <code>import math</code>. A function is used by writing its name, then the input in parentheses: <code>sqrt(16.0)</code> gives <code>4</code>. The ones you need now are <code>sqrt(x)</code> (square root), <code>pow(x, y)</code> (x to the power y, which is Python's <code>x ** y</code>, since C++ has no <code>**</code>), and <code>abs(x)</code> (absolute value). They all work on <code>double</code> numbers and give back a <code>double</code>.</p>`,
        `<p>With the <code>using namespace std;</code> line you write them without a prefix. Two things to notice about printing. First, <code>cout</code> shows a <code>double</code> with at most 6 significant digits by default, and drops a useless <code>.0</code>: <code>sqrt(16.0)</code> prints <code>4</code> and <code>sqrt(2.0)</code> prints <code>1.41421</code>. Second, because <code>pow</code> returns a <code>double</code>, even <code>pow(2, 10)</code> is a <code>double</code> (1024). Do not use it for exact integer arithmetic on huge numbers.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <cmath>        // sqrt, pow, abs\nusing namespace std;\n\nint main() {\n    cout << sqrt(16.0) << endl;     // 4\n    cout << pow(2.0, 10.0) << endl; // 1024: two to the power ten\n    cout << abs(-7.5) << endl;      // 7.5: the absolute value\n    cout << sqrt(2.0) << endl;      // 1.41421: six significant digits by default\n    return 0;\n}',
          output: '4\n1024\n7.5\n1.41421',
        },
      ],
      terms: [
        { code: '#include <cmath>', meaning: 'brings in sqrt, pow, abs and other math functions' },
        { code: 'sqrt(x)', meaning: 'square root' },
        { code: 'pow(x, y)', meaning: 'x to the power y (Python: x ** y)' },
        { code: 'abs(x)', meaning: 'absolute value' },
      ],
    },
    refresher: [
      '<code>sqrt</code>, <code>pow</code> and <code>abs</code> need <code>#include &lt;cmath&gt;</code>. <code>pow(x, y)</code> is Python\'s <code>x ** y</code>.',
      'Read decimals into <code>double</code> variables. <code>cout</code> prints a double with up to 6 significant digits.',
    ],
    hints: [
      'Read the two numbers into <code>double</code> variables.',
      'Use <code>sqrt(a * a + b * b)</code> for the first line and <code>abs(a - b)</code> for the second.',
    ],
    inPython: {
      code: 'import math\na, b = 3.0, 4.0\nprint(math.sqrt(a * a + b * b))\nprint(abs(a - b))',
      note: 'Python\'s <code>abs</code> is built in, while C++ takes it from <code>cmath</code>. With <code>using namespace std;</code> you write the bare name, with no prefix.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // read a and b, print the hypotenuse and then |a - b|\n    return 0;\n}',
    solution: '#include <iostream>\n#include <cmath>\nusing namespace std;\n\nint main() {\n    double a, b;\n    cin >> a >> b;\n    cout << sqrt(a * a + b * b) << endl;\n    cout << abs(a - b) << endl;\n    return 0;\n}',
    require: [
      { pattern: 'sqrt\\s*\\(', message: 'Use sqrt' },
      { pattern: 'abs\\s*\\(', message: 'Use abs' },
    ],
    tests: [
      { name: '3 and 4', stdin: '3 4\n', expected: '5\n1' },
      { name: '6 and 8', stdin: '6 8\n', expected: '10\n2' },
      { name: 'An irrational result', stdin: '1 1\n', expected: '1.41421\n0' },
      { name: 'Negative input', stdin: '-5 12\n', expected: '13\n17' },
    ],
  },

  // 25. predict: how cout prints doubles, int division stored in a double
  {
    id: 'c1-predict-doubles',
    title: 'How doubles print',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then run it and compare.',
    introduces: [],
    refresher: [
      '<code>cout</code> prints a <code>double</code> with up to 6 significant digits and no useless trailing zeros.',
      '<code>double r = a / b;</code> with two ints divides as ints first, then stores the result.',
    ],
    rounds: [
      {
        snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << 1.0 / 3 << " " << 10.0 / 5 << endl;\n    return 0;\n}',
        choices: ['0.3333333333 2.0', '0.333333 2', '0.333333 2.0'],
        answer: 1,
        why: 'By default cout shows at most 6 significant digits and drops a trailing .0, so 1.0 / 3 prints 0.333333 and 10.0 / 5 prints just 2.',
        output: '0.333333 2',
      },
      {
        snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 7;\n    int b = 2;\n    double r = a / b;\n    cout << r << endl;\n    return 0;\n}',
        choices: ['3.5', '3', '3.0'],
        answer: 1,
        why: 'a / b divides two ints first, giving 3, and only then is that 3 stored in the double r. cout prints it as 3. Cast before dividing to get 3.5.',
        output: '3',
      },
    ],
  },

  // 26. fixed << setprecision
  {
    id: 'c1-setprecision',
    title: 'Fixed decimals with setprecision',
    kind: 'concept',
    task: 'Read a unit price (a decimal) and a quantity (a whole number). Print the total cost with exactly 2 digits after the decimal point.',
    introduces: ['include-iomanip', 'setprecision'],
    teach: {
      body: [
        `<p>In Python you format a number inside an f-string: <code>f"{x:.2f}"</code> prints <code>x</code> with 2 digits after the point. C++ has no f-strings. Instead you change how <code>cout</code> prints numbers, and the change stays in effect for later output. You need <code>#include &lt;iomanip&gt;</code> ("input/output manipulators").</p>`,
        `<p><code>cout &lt;&lt; fixed &lt;&lt; setprecision(2);</code> does two things. <code>fixed</code> says "write numbers with a fixed number of digits after the decimal point, never in scientific notation", and <code>setprecision(2)</code> says that number is 2. After that, every double you print has exactly two digits after the point, rounded: <code>2.5</code> prints <code>2.50</code> and <code>3.14159</code> prints <code>3.14</code>. You set it once, before the first number you print, not before every one. Without <code>fixed</code>, <code>setprecision(2)</code> would mean "2 significant digits", which is rarely what you want.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <iomanip>       // fixed and setprecision\nusing namespace std;\n\nint main() {\n    double x = 2.5;\n    cout << fixed << setprecision(2);   // from now on: 2 digits after the point\n    cout << x << endl;                  // 2.50\n    cout << 3.14159 << endl;            // 3.14: rounded\n    cout << 10 / 4.0 << endl;           // 2.50\n    return 0;\n}',
          output: '2.50\n3.14\n2.50',
        },
      ],
      terms: [
        { code: '#include <iomanip>', meaning: 'brings in setprecision and other output formatting tools' },
        { code: 'cout << fixed << setprecision(2);', meaning: 'print every number from now on with 2 digits after the point' },
      ],
    },
    compare: {
      py: { code: 'x = 2.5\nprint(f"{x:.2f}")', outcome: 'Prints 2.50', ok: true },
      cpp: { code: 'double x = 2.5;\ncout << fixed << setprecision(2) << x << endl;', outcome: 'Prints 2.50', ok: true },
      text: 'Python formats one value inside an f-string. C++ changes how <code>cout</code> prints numbers from then on, so set it once before the first number.',
    },
    refresher: [
      '<code>cout &lt;&lt; fixed &lt;&lt; setprecision(2);</code> sets 2 digits after the point for everything printed afterwards. It needs <code>&lt;iomanip&gt;</code>.',
      'Use <code>fixed</code> together with <code>setprecision</code>; alone, setprecision counts significant digits.',
    ],
    hints: [
      'Read the price into a <code>double</code> and the quantity into an <code>int</code>.',
      'Set <code>fixed</code> and <code>setprecision(2)</code> before printing <code>price * quantity</code>.',
    ],
    inPython: {
      code: 'price = 19.99\nqty = 3\nprint(f"{price * qty:.2f}")',
      note: 'The f-string format <code>:.2f</code> applies to one value. In C++, <code>fixed</code> and <code>setprecision</code> stay set for every number you print afterwards.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    double price;\n    int quantity;\n    cin >> price >> quantity;\n    cout << price * quantity << endl;\n    return 0;\n}',
    solution: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    double price;\n    int quantity;\n    cin >> price >> quantity;\n    cout << fixed << setprecision(2);\n    cout << price * quantity << endl;\n    return 0;\n}',
    require: [{ pattern: 'setprecision\\s*\\(\\s*2\\s*\\)', message: 'Use setprecision(2)' }],
    tests: [
      { name: 'Two decimals', stdin: '2.5 4\n', expected: '10.00' },
      { name: 'Rounds', stdin: '19.99 3\n', expected: '59.97' },
      { name: 'Small value', stdin: '0.1 3\n', expected: '0.30' },
      { name: 'Whole numbers', stdin: '100 1\n', expected: '100.00' },
    ],
  },

  // 27. practice: circle
  {
    id: 'c1-practice-circle',
    title: 'Practice: circle',
    kind: 'program',
    task: 'Read a radius. Using <code>const double pi = 3.14159;</code>, print <em>Area: ...</em> and then <em>Circumference: ...</em> on two lines, each number with 2 decimals.',
    introduces: [],
    refresher: [
      'Area is <code>pi * r * r</code>; circumference is <code>2 * pi * r</code>.',
      'Set <code>fixed</code> and <code>setprecision(2)</code> once before printing. A <code>const double</code> must be initialised where it is declared.',
    ],
    hints: [
      'Read the radius into a <code>double</code>, then declare the const <code>pi</code>.',
      'Print the label as text, then the number: <code>cout &lt;&lt; "Area: " &lt;&lt; area &lt;&lt; endl;</code>.',
    ],
    inPython: {
      code: 'pi = 3.14159\nr = 5.0\nprint(f"Area: {pi * r * r:.2f}")\nprint(f"Circumference: {2 * pi * r:.2f}")',
      note: 'Same calculation. The f-string formats each number; in C++ <code>fixed</code> and <code>setprecision(2)</code> do it for everything printed afterwards.',
    },
    starter: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    // read a radius and print the area and circumference\n    return 0;\n}',
    solution: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    const double pi = 3.14159;\n    double r;\n    cin >> r;\n    cout << fixed << setprecision(2);\n    cout << "Area: " << pi * r * r << endl;\n    cout << "Circumference: " << 2 * pi * r << endl;\n    return 0;\n}',
    require: [{ pattern: 'const\\s+double\\s+pi', message: 'Declare const double pi' }],
    tests: [
      { name: 'Radius 5', stdin: '5\n', expected: 'Area: 78.54\nCircumference: 31.42' },
      { name: 'Radius 1', stdin: '1\n', expected: 'Area: 3.14\nCircumference: 6.28' },
      { name: 'Decimal radius', stdin: '2.5\n', expected: 'Area: 19.63\nCircumference: 15.71' },
      { name: 'Radius 0', stdin: '0\n', expected: 'Area: 0.00\nCircumference: 0.00' },
    ],
  },

  // 28. practice: seconds to h m s
  {
    id: 'c1-practice-clock',
    title: 'Practice: seconds to clock time',
    kind: 'program',
    task: 'Read a number of seconds. Print it as <em>H hours M minutes S seconds</em>, for example 3661 gives <em>1 hours 1 minutes 1 seconds</em>.',
    introduces: [],
    refresher: [
      'Whole hours are <code>total / 3600</code>; the leftover seconds are <code>total % 3600</code>.',
      'Repeat the idea on the leftover: minutes are leftover <code>/ 60</code>, seconds are leftover <code>% 60</code>.',
    ],
    hints: [
      'Compute hours first, then the seconds that remain after removing them.',
      'Minutes come from the remainder divided by 60, and seconds from the remainder of that division.',
    ],
    inPython: {
      code: 'total = 3661\nh, rest = divmod(total, 3600)\nm, s = divmod(rest, 60)\nprint(h, "hours", m, "minutes", s, "seconds")',
      note: 'Python\'s <code>divmod</code> gives both parts at once. In C++ you write the <code>/</code> and the <code>%</code> yourself, which agree with Python for non-negative numbers.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int total;\n    cin >> total;\n    // print hours, minutes and seconds\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int total;\n    cin >> total;\n    int hours = total / 3600;\n    int rest = total % 3600;\n    int minutes = rest / 60;\n    int seconds = rest % 60;\n    cout << hours << " hours " << minutes << " minutes " << seconds << " seconds" << endl;\n    return 0;\n}',
    tests: [
      { name: 'One of each', stdin: '3661\n', expected: '1 hours 1 minutes 1 seconds' },
      { name: 'Under a minute', stdin: '45\n', expected: '0 hours 0 minutes 45 seconds' },
      { name: 'Exact hours', stdin: '7200\n', expected: '2 hours 0 minutes 0 seconds' },
      { name: 'A big number', stdin: '86399\n', expected: '23 hours 59 minutes 59 seconds' },
    ],
  },

  // 29. practice: temperature
  {
    id: 'c1-practice-temperature',
    title: 'Practice: Celsius to Fahrenheit',
    kind: 'program',
    task: 'Read a temperature in Celsius (it may have decimals). Print it in Fahrenheit with 1 decimal. Fahrenheit is Celsius times 9, divided by 5, plus 32.',
    introduces: [],
    refresher: [
      '<code>9 / 5</code> with two ints is 1. Keep the calculation in <code>double</code>s, or write <code>9.0 / 5</code>.',
      'Set <code>fixed</code> and <code>setprecision(1)</code> for one digit after the point.',
    ],
    hints: [
      'Read into a <code>double</code> and multiply by 9 before dividing by 5, or use <code>9.0 / 5.0</code>.',
      'Careful with whole-number division: <code>c * (9 / 5)</code> is wrong because 9 / 5 is 1.',
    ],
    inPython: {
      code: 'c = 37.0\nprint(f"{c * 9 / 5 + 32:.1f}")',
      note: 'Python\'s <code>/</code> already divides as decimals, so <code>9 / 5</code> is safe there. In C++ two ints give an int.',
    },
    starter: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    // read Celsius, print Fahrenheit with 1 decimal\n    return 0;\n}',
    solution: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    double c;\n    cin >> c;\n    double f = c * 9 / 5 + 32;\n    cout << fixed << setprecision(1) << f << endl;\n    return 0;\n}',
    tests: [
      { name: 'Boiling point', stdin: '100\n', expected: '212.0' },
      { name: 'Where the scales meet', stdin: '-40\n', expected: '-40.0' },
      { name: 'Body temperature', stdin: '37\n', expected: '98.6' },
      { name: 'Freezing', stdin: '0\n', expected: '32.0' },
      { name: 'Decimal input', stdin: '21.5\n', expected: '70.7' },
    ],
  },

  // 30. practice: average of three
  {
    id: 'c1-practice-average',
    title: 'Practice: average of three',
    kind: 'program',
    task: 'Read three whole numbers and print their exact average with 2 decimals (not rounded down to a whole number).',
    introduces: [],
    refresher: [
      'The sum of three ints is an int. Cast it to <code>double</code> before dividing: <code>static_cast&lt;double&gt;(sum) / 3</code>.',
      'Use <code>fixed</code> and <code>setprecision(2)</code> for two decimals.',
    ],
    hints: [
      'Read three ints, add them, then divide as doubles.',
      'Cast the sum (or one number) to <code>double</code> before the division, not after.',
    ],
    inPython: {
      code: 'a, b, c = 1, 2, 4\nprint(f"{(a + b + c) / 3:.2f}")',
      note: 'Python\'s <code>/</code> gives the decimal average directly. C++ divides ints as ints, so the cast is up to you.',
    },
    starter: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    // read three numbers and print their average\n    return 0;\n}',
    solution: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    int sum = a + b + c;\n    cout << fixed << setprecision(2) << static_cast<double>(sum) / 3 << endl;\n    return 0;\n}',
    require: [{ pattern: 'static_cast\\s*<\\s*double\\s*>|3\\.0|\\.0', message: 'Divide as doubles' }],
    tests: [
      { name: 'Not a whole average', stdin: '1 2 4\n', expected: '2.33' },
      { name: 'All equal', stdin: '10 10 10\n', expected: '10.00' },
      { name: 'Negatives cancel', stdin: '-1 0 1\n', expected: '0.00' },
      { name: 'Larger values', stdin: '100 200 301\n', expected: '200.33' },
    ],
  },
]
