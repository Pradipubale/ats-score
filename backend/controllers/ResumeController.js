const Resume = require('../models/Resume');
const ai = require('../utils/ai');

exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.scanResume = async (req, res) => {
  try {
    const { id, resumeData, role, jobDescription } = req.body;
    
    // Analyze with AI
    const analysis = await ai.analyzeWithAI(resumeData, role, jobDescription);
    
    // If a resume ID was provided, update its score in the DB
    if (id) {
      await Resume.findByIdAndUpdate(id, { atsScore: analysis.score, updatedAt: Date.now() });
    }
    
    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Analysis failed' });
  }
};

exports.createResume = async (req, res) => {
  try {
    const { name, templateId, data } = req.body;
    const newResume = new Resume({
      userId: req.user.id,
      name,
      templateId,
      data
    });
    const resume = await newResume.save();
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, templateId, data } = req.body;
    resume.name = name || resume.name;
    resume.templateId = templateId || resume.templateId;
    resume.data = data || resume.data;
    resume.updatedAt = Date.now();

    await resume.save();
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
