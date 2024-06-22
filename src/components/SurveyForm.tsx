// src/SurveyForm.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';

interface FormData {
  fullName: string;
  email: string;
  surveyTopic: string;
  favoriteProgrammingLanguage: string;
  yearsOfExperience: string;
  exerciseFrequency: string;
  dietPreference: string;
  highestQualification: string;
  fieldOfStudy: string;
  feedback: string;
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  surveyTopic: '',
  favoriteProgrammingLanguage: '',
  yearsOfExperience: '',
  exerciseFrequency: '',
  dietPreference: '',
  highestQualification: '',
  fieldOfStudy: '',
  feedback: '',
};

const SurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [additionalQuestions, setAdditionalQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (formData.surveyTopic) {
      fetchAdditionalQuestions(formData.surveyTopic);
    }
  }, [formData.surveyTopic]);

  const fetchAdditionalQuestions = async (topic: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/questions?topic=${topic}`);
      setAdditionalQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching additional questions', error);
    }
  };
  
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = (): boolean => {
    let newErrors: Partial<FormData> = {};

    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.surveyTopic) newErrors.surveyTopic = 'Survey Topic is required';

    if (formData.surveyTopic === 'Technology') {
      if (!formData.favoriteProgrammingLanguage) newErrors.favoriteProgrammingLanguage = 'Favorite Programming Language is required';
      if (!formData.yearsOfExperience || isNaN(Number(formData.yearsOfExperience)) || Number(formData.yearsOfExperience) <= 0) {
        newErrors.yearsOfExperience = 'Years of Experience is required and must be a number greater than 0';
      }
    }

    if (formData.surveyTopic === 'Health') {
      if (!formData.exerciseFrequency) newErrors.exerciseFrequency = 'Exercise Frequency is required';
      if (!formData.dietPreference) newErrors.dietPreference = 'Diet Preference is required';
    }

    if (formData.surveyTopic === 'Education') {
      if (!formData.highestQualification) newErrors.highestQualification = 'Highest Qualification is required';
      if (!formData.fieldOfStudy) newErrors.fieldOfStudy = 'Field of Study is required';
    }

    if (!formData.feedback || formData.feedback.length < 50) {
      newErrors.feedback = 'Feedback is required and must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await fetchAdditionalQuestions(formData.surveyTopic); // Fetch additional questions before submitting
      setSubmittedData(formData);
      setFormData(initialFormData);
      setErrors({});
    }
  };

  return (
    <div>
      <h1>Survey Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.fullName}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.email}</p>}
        </div>
        <div>
          <label>Survey Topic:</label>
          <select name="surveyTopic" value={formData.surveyTopic} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
          </select>
          {errors.surveyTopic && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.surveyTopic}</p>}
        </div>
        
        {formData.surveyTopic === 'Technology' && (
          <>
            <div>
              <label>Favorite Programming Language:</label>
              <select name="favoriteProgrammingLanguage" value={formData.favoriteProgrammingLanguage} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C#">C#</option>
              </select>
              {errors.favoriteProgrammingLanguage && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.favoriteProgrammingLanguage}</p>}
            </div>
            <div>
              <label>Years of Experience:</label>
              <input type="text" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} />
              {errors.yearsOfExperience && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.yearsOfExperience}</p>}
            </div>
          </>
        )}

        {formData.surveyTopic === 'Health' && (
          <>
            <div>
              <label>Exercise Frequency:</label>
              <select name="exerciseFrequency" value={formData.exerciseFrequency} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Rarely">Rarely</option>
              </select>
              {errors.exerciseFrequency && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.exerciseFrequency}</p>}
            </div>
            <div>
              <label>Diet Preference:</label>
              <select name="dietPreference" value={formData.dietPreference} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              {errors.dietPreference && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.dietPreference}</p>}
            </div>
          </>
        )}

        {formData.surveyTopic === 'Education' && (
          <>
            <div>
              <label>Highest Qualification:</label>
              <select name="highestQualification" value={formData.highestQualification} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="High School">High School</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
              {errors.highestQualification && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.highestQualification}</p>}
            </div>
            <div>
              <label>Field of Study:</label>
              <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} />
              {errors.fieldOfStudy && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.fieldOfStudy}</p>}
            </div>
          </>
        )}

        <div>
          <label>Feedback:</label>
          <textarea name="feedback" value={formData.feedback} onChange={handleChange}></textarea>
          {errors.feedback && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.feedback}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>

      {submittedData && (
        <div>
          <h2>Form Submitted</h2>
          <p><strong>Full Name:</strong> {submittedData.fullName}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Survey Topic:</strong> {submittedData.surveyTopic}</p>
          
          {submittedData.surveyTopic === 'Technology' && (
            <>
              <p><strong>Favorite Programming Language:</strong> {submittedData.favoriteProgrammingLanguage}</p>
              <p><strong>Years of Experience:</strong> {submittedData.yearsOfExperience}</p>
            </>
          )}

          {submittedData.surveyTopic === 'Health' && (
            <>
              <p><strong>Exercise Frequency:</strong> {submittedData.exerciseFrequency}</p>
              <p><strong>Diet Preference:</strong> {submittedData.dietPreference}</p>
            </>
          )}

          {submittedData.surveyTopic === 'Education' && (
            <>
              <p><strong>Highest Qualification:</strong> {submittedData.highestQualification}</p>
              <p><strong>Field of Study:</strong> {submittedData.fieldOfStudy}</p>
            </>
          )}

          <p><strong>Feedback:</strong> {submittedData.feedback}</p>
          <p>Note to get the additional information please run the level 3 in local host because I have created a created a local server in express js. So to use it you have to start it in the local server typing cd server-backend, node index.js </p>
          {additionalQuestions.length > 0 && (
            <>
              <h3>Additional Questions</h3>
              <ul>
                {additionalQuestions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SurveyForm;
