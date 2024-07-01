import React, { useState, useEffect } from 'react';
import './App.css';

interface College {
  name: string;
  distanceFromOcean: number;
  schoolRank: number;
  anthropologyRank: number;
  housingAvailability: number;
  housingAffordability: number;
  walkabilityScore: number;
  publicTransport: number;
  employmentOpportunities: number;
  safety: number;
}

const colleges: College[] = [
  { name: "Santa Monica College", distanceFromOcean: 2, schoolRank: 8, anthropologyRank: 9, housingAvailability: 6, housingAffordability: 5, walkabilityScore: 8, publicTransport: 7, employmentOpportunities: 8, safety: 7 },
  { name: "Orange Coast College", distanceFromOcean: 3, schoolRank: 7, anthropologyRank: 7, housingAvailability: 7, housingAffordability: 6, walkabilityScore: 6, publicTransport: 6, employmentOpportunities: 7, safety: 8 },
  { name: "Santa Barbara City College", distanceFromOcean: 1, schoolRank: 9, anthropologyRank: 8, housingAvailability: 5, housingAffordability: 4, walkabilityScore: 7, publicTransport: 6, employmentOpportunities: 6, safety: 8 },
  { name: "Irvine Valley College", distanceFromOcean: 8, schoolRank: 8, anthropologyRank: 7, housingAvailability: 8, housingAffordability: 7, walkabilityScore: 5, publicTransport: 5, employmentOpportunities: 8, safety: 9 },
  { name: "Pasadena City College", distanceFromOcean: 20, schoolRank: 9, anthropologyRank: 8, housingAvailability: 7, housingAffordability: 6, walkabilityScore: 7, publicTransport: 8, employmentOpportunities: 9, safety: 7 },
  { name: "Fullerton College", distanceFromOcean: 15, schoolRank: 7, anthropologyRank: 6, housingAvailability: 6, housingAffordability: 7, walkabilityScore: 6, publicTransport: 5, employmentOpportunities: 7, safety: 7 },
  { name: "Long Beach City College", distanceFromOcean: 4, schoolRank: 8, anthropologyRank: 7, housingAvailability: 5, housingAffordability: 5, walkabilityScore: 7, publicTransport: 7, employmentOpportunities: 8, safety: 6 },
  { name: "Saddleback College", distanceFromOcean: 10, schoolRank: 7, anthropologyRank: 6, housingAvailability: 7, housingAffordability: 6, walkabilityScore: 4, publicTransport: 4, employmentOpportunities: 6, safety: 8 },
  { name: "Ventura College", distanceFromOcean: 5, schoolRank: 6, anthropologyRank: 5, housingAvailability: 6, housingAffordability: 7, walkabilityScore: 5, publicTransport: 5, employmentOpportunities: 6, safety: 7 },
  { name: "San Diego Mesa College", distanceFromOcean: 7, schoolRank: 8, anthropologyRank: 7, housingAvailability: 5, housingAffordability: 4, walkabilityScore: 6, publicTransport: 7, employmentOpportunities: 8, safety: 7 }
];

const factorDescriptions: { [key: string]: string } = {
  distanceFromOcean: "Measures the college's proximity to the ocean in miles. This value is inverted in the scoring system, so colleges closer to the ocean receive higher scores. Methodology: Actual distance is measured using mapping tools, then converted to a 1-10 scale where 1 is farthest and 10 is closest to the ocean.",
  
  schoolRank: "Represents the overall ranking of the school based on various factors such as academic reputation, faculty resources, and student outcomes. Methodology: Derived from published college rankings (e.g., U.S. News & World Report) and converted to a 1-10 scale. Higher values indicate better overall ranking.",
  
  anthropologyRank: "Indicates the strength of the school's Anthropology program. Methodology: Based on factors such as faculty expertise, research output, course offerings, and student outcomes specific to the Anthropology department. Converted to a 1-10 scale where higher values represent stronger programs.",
  
  housingAvailability: "Reflects the ease of finding student housing, both on and off-campus. Methodology: Calculated based on the ratio of available housing units to the student population, as well as the variety of housing options. Scored on a 1-10 scale where higher values indicate greater availability.",
  
  housingAffordability: "Measures how affordable student housing options are relative to the local cost of living and typical student budgets. Methodology: Considers average rent prices, cost of university housing, and local cost of living indices. Scored on a 1-10 scale where higher values indicate more affordable options.",
  
  walkabilityScore: "Assesses how easy it is to get around the campus and surrounding area on foot. Methodology: Based on factors such as pedestrian friendliness, proximity of amenities, and campus layout. Uses data from walkability indices and student surveys. Higher scores (1-10 scale) indicate better walkability.",
  
  publicTransport: "Evaluates the quality and availability of public transportation options near the college. Methodology: Considers factors such as frequency of service, variety of transport options (bus, train, etc.), and coverage area. Based on public transport data and student feedback. Higher scores on the 1-10 scale indicate better public transport systems.",
  
  employmentOpportunities: "Reflects the availability of part-time jobs, internships, and post-graduation employment prospects in the area. Methodology: Combines data on local job markets, college career services effectiveness, and alumni employment rates. Scored 1-10, with higher values indicating more abundant opportunities.",
  
  safety: "Assesses the overall safety of the college campus and surrounding area. Methodology: Based on crime statistics, campus security measures, and student surveys about perceived safety. Also considers factors like lighting, emergency response systems, and safety education programs. Scored on a 1-10 scale where higher values indicate safer environments."
};

const DecisionTool: React.FC = () => {
  const [weights, setWeights] = useState({
    distanceFromOcean: 4,
    schoolRank: 3,
    anthropologyRank: 3,
    housingAvailability: 3,
    housingAffordability: 3,
    walkabilityScore: 3,
    publicTransport: 3,
    employmentOpportunities: 3,
    safety: 5
  });

  const [scores, setScores] = useState<{[key: string]: number}>({});
  const [topCollege, setTopCollege] = useState<College | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);

  const invertDistance = (distance: number): number => {
    const maxDistance = Math.max(...colleges.map(c => c.distanceFromOcean));
    return 10 - ((distance / maxDistance) * 9); // Scale from 1 to 10
  };

  useEffect(() => {
    const newScores = colleges.reduce((acc, college) => {
      acc[college.name] = Object.keys(weights).reduce((sum, factor) => {
        let value = college[factor as keyof College];
        if (factor === 'distanceFromOcean') {
          value = invertDistance(value);
        }
        return sum + (value * weights[factor as keyof typeof weights] / 10);
      }, 0);
      return acc;
    }, {} as {[key: string]: number});
    setScores(newScores);

    const maxScore = Math.max(...Object.values(newScores));
    const topCollege = colleges.find(college => newScores[college.name] === maxScore) || null;
    setTopCollege(topCollege);
  }, [weights]);

  const handleWeightChange = (factor: keyof typeof weights, value: string) => {
    setWeights(prev => ({ ...prev, [factor]: parseInt(value) }));
  };

  const handleCollegeClick = (college: College) => {
    setSelectedCollege(college);
  };

  const handleFactorClick = (factor: string) => {
    setSelectedFactor(factor);
  };

  const renderScoreExplanation = (college: College) => {
    return (
      <div className="score-explanation">
        <h3>Score Calculation for {college.name}</h3>
        <p>Total score: {scores[college.name].toFixed(2)}</p>
        <ul>
          {Object.keys(weights).map(factor => {
            let value = college[factor as keyof College];
            let explanation = '';
            if (factor === 'distanceFromOcean') {
              const invertedValue = invertDistance(value as number);
              explanation = `(${value} miles, inverted to ${invertedValue.toFixed(2)})`;
              value = invertedValue;
            }
            return (
              <li key={factor}>
                {factor.charAt(0).toUpperCase() + factor.slice(1)}: 
                {value.toFixed(2)} {explanation} × {weights[factor as keyof typeof weights] / 10} (your weight) = 
                {((value as number) * weights[factor as keyof typeof weights] / 10).toFixed(2)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="decision-tool">
      <h2>Community College Decision Tool</h2>
      <div className="tool-layout">
        <div className="weights-grid">
          {Object.keys(weights).map(factor => (
            <div key={factor} className="weight-item">
              <label onClick={() => handleFactorClick(factor)}>
                {factor.charAt(0).toUpperCase() + factor.slice(1)} Weight: {weights[factor as keyof typeof weights]}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={weights[factor as keyof typeof weights]}
                onChange={(e) => handleWeightChange(factor as keyof typeof weights, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="description-panel">
          <h3>Factor Description</h3>
          {selectedFactor ? (
            <p>{factorDescriptions[selectedFactor]}</p>
          ) : (
            <p>Click on a factor label to see its description.</p>
          )}
        </div>
      </div>
      <div className="college-scores">
        <h3>College Scores:</h3>
        {colleges.map(college => (
          <div 
            key={college.name} 
            className={`college-score ${college.name === topCollege?.name ? 'top-score' : ''} ${college === selectedCollege ? 'selected' : ''}`}
            onClick={() => handleCollegeClick(college)}
          >
            <span>{college.name}:</span> {scores[college.name]?.toFixed(2)}
          </div>
        ))}
      </div>
      {selectedCollege && renderScoreExplanation(selectedCollege)}
    </div>
  );
};

export default DecisionTool;