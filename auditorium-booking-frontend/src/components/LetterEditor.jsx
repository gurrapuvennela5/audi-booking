import React from 'react';

const LetterEditor = ({ value, onChange }) => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-inner bg-gray-50 dark:bg-gray-800/50">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Edit your booking request letter here..."
                className="w-full min-h-[300px] p-5 bg-transparent border-none focus:ring-0 text-sm leading-relaxed text-gray-700 dark:text-gray-200 resize-none font-mono"
            />
        </div>
    );
};

export default LetterEditor;
