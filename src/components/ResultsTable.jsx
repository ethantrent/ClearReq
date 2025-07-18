import React from 'react';
import PropTypes from 'prop-types';

const ResultsTable = ({ requirements }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full" aria-label="Requirements analysis results">
      <thead>
        <tr className="bg-[#2563eb] text-white">
          <th scope="col" className="px-4 py-2 text-left">ID</th>
          <th scope="col" className="px-4 py-2 text-left">Requirement Text</th>
          <th scope="col" className="px-4 py-2 text-left">Type</th>
          <th scope="col" className="px-4 py-2 text-left">Confidence</th>
          <th scope="col" className="px-4 py-2 text-left">Ambiguity</th>
          <th scope="col" className="px-4 py-2 text-left">AI Suggestions</th>
        </tr>
      </thead>
      <tbody>
        {requirements && requirements.length > 0 ? (
          requirements.map(req => (
            <tr key={req.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-[#2563eb]">{req.id}</td>
              <td className="px-4 py-3 text-gray-800">{req.text}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  req.type === 'Functional' ? 'bg-[#059669] text-white' : 
                  req.type === 'Non-Functional' ? 'bg-[#ea580c] text-white' : 
                  'bg-gray-500 text-white'
                }`}>
                  {req.type}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{req.confidence}%</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  req.ambiguity === 'Low' ? 'bg-green-100 text-green-800' : 
                  req.ambiguity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {req.ambiguity}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 text-sm">{req.suggestion}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-4 py-6 text-center text-gray-400">No requirements found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

ResultsTable.propTypes = {
  requirements: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ResultsTable; 