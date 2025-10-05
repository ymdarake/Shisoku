import React from 'react';

interface RulesProps {
  title: string;
  rules: { [key: string]: string };
}

export const Rules: React.FC<RulesProps> = ({ title, rules }) => {
  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto my-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-left">
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <ul className="space-y-2 list-disc list-inside text-sm">
        {Object.values(rules).map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </div>
  );
};