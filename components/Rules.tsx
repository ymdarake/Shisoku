import React from 'react';

interface ExampleLine {
  label: string;
  value: string;
}

interface RulesProps {
  title: string;
  rules: { [key: string]: string };
  exampleTitle: string;
  exampleLines: ExampleLine[];
}

export const Rules: React.FC<RulesProps> = ({ title, rules, exampleTitle, exampleLines }) => {
  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto my-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-left">
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <ul className="space-y-2 list-disc list-inside text-sm">
        {Object.values(rules).map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-semibold mb-2 text-center">{exampleTitle}</h4>
        <div className="space-y-1 text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            {exampleLines.map((line, index) => (
                <div key={index} className="flex items-center">
                    <span className="w-32 flex-shrink-0 font-medium text-gray-600 dark:text-gray-300">{line.label}:</span>
                    <code className="font-mono text-indigo-600 dark:text-indigo-400">{line.value}</code>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};