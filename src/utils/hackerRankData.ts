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

  // Easy test cases generation tailored specifically to be clean & straightforward
  let sample1Input = '5';
  let sample1Output = '15';
  let sample2Input = '3';
  let sample2Output = '6';
  let sample3Input = '10';
  let sample3Output = '55';
  let hiddenInput = '4';
  let hiddenOutput = '10';

  if (titleLower.includes('even') || titleLower.includes('odd')) {
    sample1Input = '4';
    sample1Output = 'Even';
    sample2Input = '7';
    sample2Output = 'Odd';
    sample3Input = '12';
    sample3Output = 'Even';
    hiddenInput = '9';
    hiddenOutput = 'Odd';
  } else if (titleLower.includes('largest') || titleLower.includes('max') || titleLower.includes('maximum')) {
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
      sample1Input = '"racecar"';
      sample1Output = 'true';
      sample2Input = '"gkce"';
      sample2Output = 'false';
      sample3Input = '"madam"';
      sample3Output = 'true';
      hiddenInput = '"level"';
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
  } else if (titleLower.includes('prime')) {
    sample1Input = '7';
    sample1Output = 'true';
    sample2Input = '4';
    sample2Output = 'false';
    sample3Input = '13';
    sample3Output = 'true';
    hiddenInput = '11';
    hiddenOutput = 'true';
  } else if (titleLower.includes('reverse') || titleLower.includes('digit') || titleLower.includes('count')) {
    sample1Input = '1234';
    sample1Output = '4321';
    sample2Input = '500';
    sample2Output = '5';
    sample3Input = '89';
    sample3Output = '98';
    hiddenInput = '765';
    hiddenOutput = '567';
  } else if (topicLower.includes('string') || titleLower.includes('anagram') || titleLower.includes('vowel')) {
    sample1Input = '"hello"';
    sample1Output = '5';
    sample2Input = '"code"';
    sample2Output = '4';
    sample3Input = '"gkce"';
    sample3Output = '4';
    hiddenInput = '"java"';
    hiddenOutput = '4';
  } else if (topicLower.includes('array') || titleLower.includes('array') || titleLower.includes('sum')) {
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
    java: `class Solution {
    public ${javaReturnType} ${methodName}(${javaParam}) {
        // Write your solution here
        return ${javaReturnVal};
    }
}`,
    cpp: `class Solution {
public:
    ${cppReturnType} ${methodName}(${cppParam}) {
        // Write your solution here
        return ${cppReturnVal};
    }
};`,
    python: `class Solution:
    def ${methodName}(self, ${pythonParam}) -> ${pythonReturnType}:
        # Write your solution here
        return ${pythonReturnVal}`,
    javascript: `/**
 * @param {${isStringProb ? 'string' : isNumberProb ? 'number' : 'number[]'}} ${jsParam}
 * @return {${javaReturnType}}
 */
function ${methodName}(${jsParam}) {
    // Write your solution here
    return ${jsReturnVal};
}`,
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
