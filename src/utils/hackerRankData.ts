import { Problem } from '../types';

export interface TestCaseData {
  id: number;
  name: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  isHidden?: boolean;
  explanation?: string;
  executionTimeMs?: number;
  difficultyTier?: 'Easy';
}

export interface ProblemDossier {
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  companies: string[];
  testCases: TestCaseData[];
  hints: string[];
  timeComplexity: string;
  spaceComplexity: string;
  starterTemplates: {
    java: string;
    cpp: string;
    python: string;
    javascript: string;
  };
}

/**
 * Generates beginner-friendly, EASY test cases and dossier for all 100 normal practice DSA curriculum problems.
 * Designed to build student coding confidence with elementary inputs and clear outputs.
 */
export const getProblemDossier = (problem: Problem): ProblemDossier => {
  const cleanTitle = problem.title;
  const methodName = cleanTitle
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .slice(0, 4)
    .map((w, idx) => (idx === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('') || 'solve';

  const titleLower = problem.title.toLowerCase();
  const topicLower = problem.topic.toLowerCase();

  // Accurate, problem-specific test case generation for all 100 curriculum problems
  let sample1Input = '5';
  let sample1Output = '15';
  let sample2Input = '3';
  let sample2Output = '6';
  let sample3Input = '10';
  let sample3Output = '55';
  let hiddenInput = '4';
  let hiddenOutput = '10';

  if (titleLower.includes('even and odd digits') || titleLower.includes('count even and odd')) {
    sample1Input = '12345';
    sample1Output = '2 3';
    sample2Input = '2468';
    sample2Output = '4 0';
    sample3Input = '1357';
    sample3Output = '0 4';
    hiddenInput = '102';
    hiddenOutput = '2 1';
  } else if (titleLower.includes('sum of digits')) {
    sample1Input = '1234';
    sample1Output = '10';
    sample2Input = '500';
    sample2Output = '5';
    sample3Input = '89';
    sample3Output = '17';
    hiddenInput = '765';
    hiddenOutput = '18';
  } else if (titleLower.includes('product of digits')) {
    sample1Input = '1234';
    sample1Output = '24';
    sample2Input = '45';
    sample2Output = '20';
    sample3Input = '89';
    sample3Output = '72';
    hiddenInput = '235';
    hiddenOutput = '30';
  } else if (titleLower.includes('count digits')) {
    sample1Input = '1234';
    sample1Output = '4';
    sample2Input = '500';
    sample2Output = '3';
    sample3Input = '89';
    sample3Output = '2';
    hiddenInput = '7';
    hiddenOutput = '1';
  } else if (titleLower.includes('armstrong')) {
    sample1Input = '153';
    sample1Output = 'true';
    sample2Input = '370';
    sample2Output = 'true';
    sample3Input = '123';
    sample3Output = 'false';
    hiddenInput = '9474';
    hiddenOutput = 'true';
  } else if (titleLower.includes('power')) {
    sample1Input = '2 5';
    sample1Output = '32';
    sample2Input = '3 4';
    sample2Output = '81';
    sample3Input = '5 3';
    sample3Output = '125';
    hiddenInput = '2 8';
    hiddenOutput = '256';
  } else if (titleLower.includes('gcd') || titleLower.includes('hcf')) {
    sample1Input = '12 18';
    sample1Output = '6';
    sample2Input = '20 28';
    sample2Output = '4';
    sample3Input = '60 36';
    sample3Output = '12';
    hiddenInput = '15 25';
    hiddenOutput = '5';
  } else if (titleLower.includes('lcm')) {
    sample1Input = '12 18';
    sample1Output = '36';
    sample2Input = '4 6';
    sample2Output = '12';
    sample3Input = '5 7';
    sample3Output = '35';
    hiddenInput = '8 12';
    hiddenOutput = '24';
  } else if (titleLower.includes('factorial')) {
    sample1Input = '5';
    sample1Output = '120';
    sample2Input = '4';
    sample2Output = '24';
    sample3Input = '6';
    sample3Output = '720';
    hiddenInput = '3';
    hiddenOutput = '6';
  } else if (titleLower.includes('fibonacci')) {
    sample1Input = '6';
    sample1Output = '8';
    sample2Input = '5';
    sample2Output = '5';
    sample3Input = '7';
    sample3Output = '13';
    hiddenInput = '4';
    hiddenOutput = '3';
  } else if (titleLower.includes('divisors') || titleLower.includes('divisor')) {
    sample1Input = '12';
    sample1Output = '1 2 3 4 6 12';
    sample2Input = '10';
    sample2Output = '1 2 5 10';
    sample3Input = '6';
    sample3Output = '1 2 3 6';
    hiddenInput = '8';
    hiddenOutput = '1 2 4 8';
  } else if (titleLower.includes('prime') && (titleLower.includes('range') || titleLower.includes('in a given'))) {
    sample1Input = '1 10';
    sample1Output = '4';
    sample2Input = '10 20';
    sample2Output = '4';
    sample3Input = '1 20';
    sample3Output = '8';
    hiddenInput = '20 30';
    hiddenOutput = '2';
  } else if (titleLower.includes('prime')) {
    sample1Input = '7';
    sample1Output = 'true';
    sample2Input = '4';
    sample2Output = 'false';
    sample3Input = '13';
    sample3Output = 'true';
    hiddenInput = '11';
    hiddenOutput = 'true';
  } else if (titleLower.includes('multiplication table')) {
    sample1Input = '5';
    sample1Output = '5 10 15 20 25 30 35 40 45 50';
    sample2Input = '3';
    sample2Output = '3 6 9 12 15 18 21 24 27 30';
    sample3Input = '2';
    sample3Output = '2 4 6 8 10 12 14 16 18 20';
    hiddenInput = '4';
    hiddenOutput = '4 8 12 16 20 24 28 32 36 40';
  } else if (titleLower.includes('even') || titleLower.includes('odd')) {
    sample1Input = '4';
    sample1Output = 'Even';
    sample2Input = '7';
    sample2Output = 'Odd';
    sample3Input = '12';
    sample3Output = 'Even';
    hiddenInput = '9';
    hiddenOutput = 'Odd';
  } else if (titleLower.includes('largest of three') || (titleLower.includes('largest') && !topicLower.includes('array'))) {
    sample1Input = '10 25 15';
    sample1Output = '25';
    sample2Input = '5 3 8';
    sample2Output = '8';
    sample3Input = '100 50 20';
    sample3Output = '100';
    hiddenInput = '7 14 9';
    hiddenOutput = '14';
  } else if (titleLower.includes('leap')) {
    sample1Input = '2024';
    sample1Output = 'true';
    sample2Input = '2023';
    sample2Output = 'false';
    sample3Input = '2000';
    sample3Output = 'true';
    hiddenInput = '2028';
    hiddenOutput = 'true';
  } else if (titleLower.includes('palindrome')) {
    if (topicLower.includes('string') || titleLower.includes('string')) {
      sample1Input = 'racecar';
      sample1Output = 'true';
      sample2Input = 'gkce';
      sample2Output = 'false';
      sample3Input = 'madam';
      sample3Output = 'true';
      hiddenInput = 'level';
      hiddenOutput = 'true';
    } else {
      sample1Input = '121';
      sample1Output = 'true';
      sample2Input = '123';
      sample2Output = 'false';
      sample3Input = '1331';
      sample3Output = 'true';
      hiddenInput = '555';
      hiddenOutput = 'true';
    }
  } else if (titleLower.includes('reverse') && !topicLower.includes('array') && !titleLower.includes('array')) {
    if (topicLower.includes('string') || titleLower.includes('string')) {
      sample1Input = 'hello';
      sample1Output = 'olleh';
      sample2Input = 'gkce';
      sample2Output = 'eckg';
      sample3Input = 'world';
      sample3Output = 'dlrow';
      hiddenInput = 'java';
      hiddenOutput = 'avaj';
    } else {
      sample1Input = '1234';
      sample1Output = '4321';
      sample2Input = '500';
      sample2Output = '5';
      sample3Input = '89';
      sample3Output = '98';
      hiddenInput = '765';
      hiddenOutput = '567';
    }
  } else if (titleLower.includes('vowels') || titleLower.includes('vowel')) {
    sample1Input = 'hello';
    sample1Output = '2 3';
    sample2Input = 'aeiou';
    sample2Output = '5 0';
    sample3Input = 'rhythm';
    sample3Output = '0 6';
    hiddenInput = 'gkce';
    hiddenOutput = '1 3';
  } else if (titleLower.includes('anagram')) {
    sample1Input = 'listen silent';
    sample1Output = 'true';
    sample2Input = 'hello world';
    sample2Output = 'false';
    sample3Input = 'triangle integral';
    sample3Output = 'true';
    hiddenInput = 'rat car';
    hiddenOutput = 'false';
  } else if (titleLower.includes('second largest')) {
    sample1Input = '5\n1 9 3 7 5';
    sample1Output = '7';
    sample2Input = '4\n10 20 5 8';
    sample2Output = '10';
    sample3Input = '5\n12 35 1 10 34';
    sample3Output = '34';
    hiddenInput = '4\n2 5 8 1';
    hiddenOutput = '5';
  } else if (titleLower.includes('second smallest')) {
    sample1Input = '5\n1 9 3 7 5';
    sample1Output = '3';
    sample2Input = '4\n10 20 5 8';
    sample2Output = '8';
    sample3Input = '5\n12 35 1 10 34';
    sample3Output = '10';
    hiddenInput = '4\n2 5 8 1';
    hiddenOutput = '2';
  } else if (titleLower.includes('sum of first') || titleLower.includes('natural numbers')) {
    sample1Input = '5';
    sample1Output = '15';
    sample2Input = '3';
    sample2Output = '6';
    sample3Input = '10';
    sample3Output = '55';
    hiddenInput = '4';
    hiddenOutput = '10';
  } else if (titleLower.includes('count words')) {
    sample1Input = 'Hello world from GKCE';
    sample1Output = '4';
    sample2Input = 'Data Structures and Algorithms';
    sample2Output = '4';
    sample3Input = 'Practice makes perfect';
    sample3Output = '3';
    hiddenInput = 'Code and test';
    hiddenOutput = '3';
  } else if (titleLower.includes('reverse words')) {
    sample1Input = 'the sky is blue';
    sample1Output = 'blue is sky the';
    sample2Input = 'hello world';
    sample2Output = 'world hello';
    sample3Input = 'good morning';
    sample3Output = 'morning good';
    hiddenInput = 'GKCE Campus Coding';
    hiddenOutput = 'Coding Campus GKCE';
  } else if (titleLower.includes('uppercase and lowercase')) {
    sample1Input = 'Hello World';
    sample1Output = '2 8';
    sample2Input = 'GKCE Coding';
    sample2Output = '5 5';
    sample3Input = 'abc';
    sample3Output = '0 3';
    hiddenInput = 'Java';
    hiddenOutput = '1 3';
  } else if (titleLower.includes('remove spaces')) {
    sample1Input = 'hello world';
    sample1Output = 'helloworld';
    sample2Input = 'g k c e';
    sample2Output = 'gkce';
    sample3Input = 'code practice';
    sample3Output = 'codepractice';
    hiddenInput = 'a b c';
    hiddenOutput = 'abc';
  } else if (titleLower.includes('non-repeating') || titleLower.includes('first non repeating')) {
    sample1Input = 'swiss';
    sample1Output = 'w';
    sample2Input = 'racecar';
    sample2Output = 'e';
    sample3Input = 'aabbcc';
    sample3Output = '$';
    hiddenInput = 'stress';
    hiddenOutput = 't';
  } else if (titleLower.includes('rotate array') || titleLower.includes('left rotate')) {
    sample1Input = '5\n1 2 3 4 5\n1';
    sample1Output = '2 3 4 5 1';
    sample2Input = '5\n1 2 3 4 5\n2';
    sample2Output = '3 4 5 1 2';
    sample3Input = '4\n10 20 30 40\n3';
    sample3Output = '40 10 20 30';
    hiddenInput = '3\n1 2 3\n1';
    hiddenOutput = '2 3 1';
  } else if (titleLower.includes('frequency of an element') || titleLower.includes('count occurrences')) {
    sample1Input = '5\n1 2 3 2 2\n2';
    sample1Output = '3';
    sample2Input = '4\n5 5 5 5\n5';
    sample2Output = '4';
    sample3Input = '4\n1 2 3 4\n5';
    sample3Output = '0';
    hiddenInput = '5\n1 2 1 3 1\n1';
    hiddenOutput = '3';
  } else if (titleLower.includes('maximum subarray sum')) {
    sample1Input = '5\n1 2 3 -2 5';
    sample1Output = '9';
    sample2Input = '4\n-1 -2 -3 -4';
    sample2Output = '-1';
    sample3Input = '5\n-2 1 -3 4 -1';
    sample3Output = '4';
    hiddenInput = '5\n5 4 -1 7 8';
    hiddenOutput = '23';
  } else if (titleLower.includes('leaders')) {
    sample1Input = '6\n16 17 4 3 5 2';
    sample1Output = '17 5 2';
    sample2Input = '5\n1 2 3 4 0';
    sample2Output = '4 0';
    sample3Input = '3\n5 4 3';
    sample3Output = '5 4 3';
    hiddenInput = '4\n10 22 12 3';
    hiddenOutput = '22 12 3';
  } else if (titleLower.includes('majority element')) {
    sample1Input = '5\n3 3 4 2 3';
    sample1Output = '3';
    sample2Input = '3\n1 2 3';
    sample2Output = '-1';
    sample3Input = '5\n2 2 1 1 2';
    sample3Output = '2';
    hiddenInput = '4\n4 4 4 1';
    hiddenOutput = '4';
  } else if (titleLower.includes('profit') || titleLower.includes('stock')) {
    sample1Input = '6\n7 1 5 3 6 4';
    sample1Output = '5';
    sample2Input = '5\n7 6 4 3 1';
    sample2Output = '0';
    sample3Input = '5\n1 2 3 4 5';
    sample3Output = '4';
    hiddenInput = '4\n2 4 1 7';
    hiddenOutput = '6';
  } else if (titleLower.includes('longest consecutive')) {
    sample1Input = '6\n100 4 200 1 3 2';
    sample1Output = '4';
    sample2Input = '5\n0 1 2 3 4';
    sample2Output = '5';
    sample3Input = '4\n10 20 30 40';
    sample3Output = '1';
    hiddenInput = '6\n9 1 4 7 3 -1 0 5 8 -1 6';
    hiddenOutput = '7';
  } else if (titleLower.includes('maximum') || titleLower.includes('largest element')) {
    sample1Input = '5\n1 9 3 7 5';
    sample1Output = '9';
    sample2Input = '4\n10 20 5 8';
    sample2Output = '20';
    sample3Input = '3\n100 500 200';
    sample3Output = '500';
    hiddenInput = '5\n-1 -5 -2 -8 -3';
    hiddenOutput = '-1';
  } else if (titleLower.includes('minimum') || titleLower.includes('smallest element')) {
    sample1Input = '5\n1 9 3 7 5';
    sample1Output = '1';
    sample2Input = '4\n10 20 5 8';
    sample2Output = '5';
    sample3Input = '3\n100 500 200';
    sample3Output = '100';
    hiddenInput = '5\n12 4 8 19 6';
    hiddenOutput = '4';
  } else if (titleLower.includes('sorted') && titleLower.includes('check')) {
    sample1Input = '5\n1 2 3 4 5';
    sample1Output = 'true';
    sample2Input = '5\n1 3 2 4 5';
    sample2Output = 'false';
    sample3Input = '4\n10 20 30 40';
    sample3Output = 'true';
    hiddenInput = '4\n5 4 3 2';
    hiddenOutput = 'false';
  } else if (titleLower.includes('duplicates') && titleLower.includes('sorted')) {
    sample1Input = '5\n1 1 2 2 3';
    sample1Output = '3';
    sample2Input = '4\n2 2 2 2';
    sample2Output = '1';
    sample3Input = '6\n1 2 2 3 4 4';
    sample3Output = '4';
    hiddenInput = '3\n1 2 3';
    hiddenOutput = '3';
  } else if (titleLower.includes('zeros to') || titleLower.includes('zeros')) {
    sample1Input = '5\n0 1 0 3 12';
    sample1Output = '1 3 12 0 0';
    sample2Input = '4\n0 0 1 2';
    sample2Output = '1 2 0 0';
    sample3Input = '3\n1 2 3';
    sample3Output = '1 2 3';
    hiddenInput = '4\n4 0 5 0';
    hiddenOutput = '4 5 0 0';
  } else if (titleLower.includes('missing number')) {
    sample1Input = '4\n1 2 4 5';
    sample1Output = '3';
    sample2Input = '3\n1 3 4';
    sample2Output = '2';
    sample3Input = '5\n1 2 3 5 6';
    sample3Output = '4';
    hiddenInput = '2\n1 2';
    hiddenOutput = '3';
  } else if (titleLower.includes('two sum')) {
    sample1Input = '4\n2 7 11 15\n9';
    sample1Output = '0 1';
    sample2Input = '3\n3 2 4\n6';
    sample2Output = '1 2';
    sample3Input = '2\n3 3\n6';
    sample3Output = '0 1';
    hiddenInput = '4\n1 5 3 7\n8';
    hiddenOutput = '0 3';
  } else if (titleLower.includes('linear search') || titleLower.includes('search an element')) {
    sample1Input = '5\n10 20 30 40 50\n30';
    sample1Output = '2';
    sample2Input = '4\n5 15 25 35\n10';
    sample2Output = '-1';
    sample3Input = '3\n1 2 3\n1';
    sample3Output = '0';
    hiddenInput = '4\n8 6 4 2\n4';
    hiddenOutput = '2';
  } else if (titleLower.includes('binary search')) {
    sample1Input = '5\n10 20 30 40 50\n40';
    sample1Output = '3';
    sample2Input = '4\n2 4 6 8\n5';
    sample2Output = '-1';
    sample3Input = '5\n1 3 5 7 9\n7';
    sample3Output = '3';
    hiddenInput = '3\n10 20 30\n10';
    hiddenOutput = '0';
  } else if (titleLower.includes('sort')) {
    sample1Input = '5\n5 1 4 2 8';
    sample1Output = '1 2 4 5 8';
    sample2Input = '4\n10 9 8 7';
    sample2Output = '7 8 9 10';
    sample3Input = '3\n3 1 2';
    sample3Output = '1 2 3';
    hiddenInput = '4\n4 3 2 1';
    hiddenOutput = '1 2 3 4';
  } else if (titleLower.includes('reverse') && (topicLower.includes('array') || titleLower.includes('array'))) {
    sample1Input = '5\n1 2 3 4 5';
    sample1Output = '5 4 3 2 1';
    sample2Input = '3\n10 20 30';
    sample2Output = '30 20 10';
    sample3Input = '4\n2 4 6 8';
    sample3Output = '8 6 4 2';
    hiddenInput = '4\n1 3 5 7';
    hiddenOutput = '7 5 3 1';
  } else if (titleLower.includes('parentheses') || titleLower.includes('brackets')) {
    sample1Input = '()[]{}';
    sample1Output = 'true';
    sample2Input = '(]';
    sample2Output = 'false';
    sample3Input = '([)]';
    sample3Output = 'false';
    hiddenInput = '{[]}';
    hiddenOutput = 'true';
  } else if (topicLower.includes('string') || titleLower.includes('string')) {
    sample1Input = 'hello';
    sample1Output = '5';
    sample2Input = 'code';
    sample2Output = '4';
    sample3Input = 'gkce';
    sample3Output = '4';
    hiddenInput = 'java';
    hiddenOutput = '4';
  } else if (topicLower.includes('array') || titleLower.includes('array') || titleLower.includes('sum of array') || titleLower.includes('sum of elements')) {
    sample1Input = '5\n1 2 3 4 5';
    sample1Output = '15';
    sample2Input = '3\n10 20 30';
    sample2Output = '60';
    sample3Input = '4\n2 4 6 8';
    sample3Output = '20';
    hiddenInput = '3\n5 10 15';
    hiddenOutput = '30';
  }

  const testCases: TestCaseData[] = [
    {
      id: 0,
      name: 'Easy Sample 0',
      input: sample1Input,
      expectedOutput: sample1Output,
      isHidden: false,
      difficultyTier: 'Easy',
      explanation: `Elementary practice case with standard positive input ${sample1Input.replace(/\n/g, ' ')}. Produces expected result ${sample1Output}.`,
    },
    {
      id: 1,
      name: 'Easy Case 1',
      input: sample2Input,
      expectedOutput: sample2Output,
      isHidden: false,
      difficultyTier: 'Easy',
      explanation: `Simple basic validation case evaluating standard condition flow.`,
    },
    {
      id: 2,
      name: 'Easy Case 2',
      input: sample3Input,
      expectedOutput: sample3Output,
      isHidden: false,
      difficultyTier: 'Easy',
      explanation: `Standard small input validating algorithm correctness.`,
    },
    {
      id: 3,
      name: '🔒 Easy Benchmark Case',
      input: hiddenInput,
      expectedOutput: hiddenOutput,
      isHidden: true,
      difficultyTier: 'Easy',
      explanation: 'Easy practice verification test case.',
    },
  ];

  const companiesList = [
    'Amazon', 'TCS Digital', 'Infosys SP', 'Cognizant', 'Wipro Turbo', 'Accenture', 'Microsoft', 'Zoho'
  ];
  const charSum = cleanTitle.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const selectedCompanies = [
    companiesList[charSum % companiesList.length],
    companiesList[(charSum + 2) % companiesList.length],
    companiesList[(charSum + 4) % companiesList.length],
  ];

  const isStringProb = topicLower.includes('string') || titleLower.includes('anagram') || (titleLower.includes('palindrome') && !titleLower.includes('number'));
  const isNumberProb = titleLower.includes('number') || titleLower.includes('prime') || titleLower.includes('digit') || titleLower.includes('even') || titleLower.includes('odd') || titleLower.includes('leap') || titleLower.includes('year') || titleLower.includes('sum of first');

  const javaParam = isStringProb ? 'String s' : isNumberProb ? 'int n' : 'int[] nums';
  const javaReturnType = (titleLower.includes('check') || titleLower.includes('palindrome') || titleLower.includes('prime') || titleLower.includes('leap') || titleLower.includes('even')) ? 'boolean' : 'int';
  const javaReturnVal = javaReturnType === 'boolean' ? 'false' : '0';

  const cppParam = isStringProb ? 'string s' : isNumberProb ? 'int n' : 'vector<int>& nums';
  const cppReturnType = javaReturnType;
  const cppReturnVal = javaReturnVal;

  const pythonParam = isStringProb ? 's: str' : isNumberProb ? 'n: int' : 'nums: list[int]';
  const pythonReturnType = javaReturnType === 'boolean' ? 'bool' : 'int';
  const pythonReturnVal = javaReturnType === 'boolean' ? 'False' : '0';

  const jsParam = isStringProb ? 's' : isNumberProb ? 'n' : 'nums';
  const jsReturnVal = javaReturnVal;

  const starterTemplates = {
    java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read input from sc and compute result for ${cleanTitle}\n        System.out.println(${javaReturnVal});\n    }\n}`,
    cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Read input from cin and compute result for ${cleanTitle}\n    cout << ${cppReturnVal} << endl;\n    return 0;\n}`,
    python: `import sys\n\ndef main():\n    # Read input from sys.stdin and compute result for ${cleanTitle}\n    # data = sys.stdin.read().split()\n    print(${pythonReturnVal})\n\nif __name__ == '__main__':\n    main()`,
    javascript: `// Competitive Programming & Sandbox JavaScript Solution\nconst fs = typeof require !== 'undefined' ? require('fs') : null;\n\nfunction main() {\n    // Read input from stdin or implement solve(input)\n    // const input = fs ? fs.readFileSync(0, 'utf-8').trim() : '';\n    console.log(${jsReturnVal});\n}\n\nmain();`,
  };

  return {
    inputFormat: `Simple practice input: The first line contains standard problem parameters or space-separated values.`,
    outputFormat: `Print the single computed result satisfying the basic problem condition.`,
    constraints: [
      `1 <= Input Values <= 1000 (Easy Practice Limits)`,
      `Array Size <= 100 elements`,
      `Simple positive numbers & basic string characters`,
      `All test cases designed for easy beginner practice.`,
    ],
    companies: selectedCompanies,
    testCases,
    hints: [
      `Read the input carefully and start with simple arithmetic or single loop traversal.`,
      `Test your solution against the sample inputs using the "Run" button.`,
      `Keep your code clean and straightforward!`,
    ],
    timeComplexity: 'O(N) or O(1)',
    spaceComplexity: 'O(1)',
    starterTemplates,
  };
};
