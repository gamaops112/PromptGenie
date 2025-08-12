/**
 * AI Prompt Engineering Engine
 * Transforms simple English tasks into well-structured AI prompts
 */

class PromptEngine {
    constructor() {
        this.templates = {
            general: {
                structure: [
                    'Context and Role',
                    'Task Description', 
                    'Specific Instructions',
                    'Output Format',
                    'Quality Guidelines'
                ],
                rolePrompts: [
                    'You are an expert assistant',
                    'You are a professional consultant',
                    'You are a knowledgeable specialist',
                    'You are an experienced advisor'
                ]
            },
            writing: {
                structure: [
                    'Writing Role and Expertise',
                    'Content Objective',
                    'Target Audience',
                    'Tone and Style',
                    'Structure Requirements',
                    'Length and Format'
                ],
                rolePrompts: [
                    'You are an expert content writer',
                    'You are a professional copywriter',
                    'You are a skilled blogger',
                    'You are an experienced journalist'
                ]
            },
            analysis: {
                structure: [
                    'Analytical Role',
                    'Subject Matter',
                    'Analysis Framework',
                    'Key Areas to Examine',
                    'Output Structure',
                    'Evidence Requirements'
                ],
                rolePrompts: [
                    'You are a data analyst',
                    'You are a research specialist',
                    'You are a strategic consultant',
                    'You are an expert evaluator'
                ]
            },
            creative: {
                structure: [
                    'Creative Role',
                    'Creative Brief',
                    'Style and Inspiration',
                    'Creative Constraints',
                    'Output Specifications',
                    'Innovation Guidelines'
                ],
                rolePrompts: [
                    'You are a creative director',
                    'You are an innovative designer',
                    'You are a creative writer',
                    'You are an artistic visionary'
                ]
            },
            code: {
                structure: [
                    'Programming Role',
                    'Technical Requirements',
                    'Programming Language/Framework',
                    'Code Standards',
                    'Documentation Requirements',
                    'Testing Considerations'
                ],
                rolePrompts: [
                    'You are a senior software engineer',
                    'You are a programming expert',
                    'You are a technical architect',
                    'You are a code review specialist'
                ]
            },
            research: {
                structure: [
                    'Research Role',
                    'Research Objective',
                    'Methodology',
                    'Sources and References',
                    'Analysis Framework',
                    'Presentation Format'
                ],
                rolePrompts: [
                    'You are a research scientist',
                    'You are an academic researcher',
                    'You are a market analyst',
                    'You are an investigative specialist'
                ]
            }
        };

        this.commonInstructions = {
            clarity: 'Be clear, concise, and well-organized in your response.',
            accuracy: 'Ensure all information is accurate and up-to-date.',
            examples: 'Provide relevant examples when appropriate.',
            structure: 'Use proper headings, bullet points, and formatting.',
            comprehensive: 'Cover all important aspects of the topic.',
            actionable: 'Make your recommendations practical and actionable.'
        };

        this.toneMapping = {
            professional: 'Maintain a professional, formal tone throughout.',
            casual: 'Use a conversational, approachable tone.',
            friendly: 'Be warm, welcoming, and personable.',
            authoritative: 'Demonstrate expertise with confidence.',
            educational: 'Explain concepts clearly for learning purposes.',
            persuasive: 'Use compelling arguments and evidence.',
            technical: 'Use precise, technical language appropriate for experts.',
            creative: 'Be imaginative and think outside the box.'
        };

        this.formatMapping = {
            'blog post': 'Format as a blog post with engaging title, introduction, body sections, and conclusion.',
            'report': 'Structure as a formal report with executive summary, findings, and recommendations.',
            'list': 'Present information as a well-organized numbered or bulleted list.',
            'email': 'Format as a professional email with appropriate subject line and structure.',
            'article': 'Write as an informative article with compelling headlines and subheadings.',
            'guide': 'Create a step-by-step guide with clear instructions.',
            'summary': 'Provide a concise summary highlighting key points.',
            'presentation': 'Structure for presentation format with clear sections and talking points.'
        };
    }

    /**
     * Main method to generate AI prompt from user input
     */
    generatePrompt(userInput, promptType = 'general', options = {}) {
        if (!userInput || userInput.trim().length === 0) {
            throw new Error('Please provide a task description');
        }

        const template = this.templates[promptType] || this.templates.general;
        const processedInput = this.preprocessInput(userInput);
        
        return this.buildStructuredPrompt(processedInput, template, options);
    }

    /**
     * Preprocess user input to extract key information
     */
    preprocessInput(input) {
        const processed = {
            originalInput: input.trim(),
            mainTask: this.extractMainTask(input),
            keywords: this.extractKeywords(input),
            impliedRequirements: this.extractImpliedRequirements(input),
            urgencyLevel: this.detectUrgencyLevel(input),
            complexityLevel: this.estimateComplexity(input)
        };

        return processed;
    }

    /**
     * Extract the main task from user input
     */
    extractMainTask(input) {
        // Remove common filler words and extract core action
        const actionWords = ['write', 'create', 'analyze', 'design', 'build', 'develop', 'research', 'explain', 'summarize', 'compare', 'evaluate', 'plan', 'generate', 'optimize'];
        const words = input.toLowerCase().split(/\s+/);
        
        const actionWord = words.find(word => actionWords.some(action => word.includes(action)));
        
        if (actionWord) {
            const actionIndex = words.indexOf(actionWord);
            const taskPhrase = words.slice(actionIndex).join(' ');
            return this.capitalizeFirstLetter(taskPhrase);
        }
        
        return this.capitalizeFirstLetter(input);
    }

    /**
     * Extract relevant keywords from input
     */
    extractKeywords(input) {
        // Remove common stop words and extract meaningful terms
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'];
        
        const words = input.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word));
        
        // Return unique keywords, limited to most relevant ones
        return [...new Set(words)].slice(0, 8);
    }

    /**
     * Extract implied requirements from the input
     */
    extractImpliedRequirements(input) {
        const requirements = [];
        const lowerInput = input.toLowerCase();
        
        // Check for common requirement patterns
        if (lowerInput.includes('professional') || lowerInput.includes('business')) {
            requirements.push('Professional tone and presentation');
        }
        
        if (lowerInput.includes('beginner') || lowerInput.includes('simple') || lowerInput.includes('easy')) {
            requirements.push('Accessible language for beginners');
        }
        
        if (lowerInput.includes('detailed') || lowerInput.includes('comprehensive') || lowerInput.includes('thorough')) {
            requirements.push('Comprehensive and detailed coverage');
        }
        
        if (lowerInput.includes('quick') || lowerInput.includes('brief') || lowerInput.includes('summary')) {
            requirements.push('Concise and to-the-point delivery');
        }
        
        if (lowerInput.includes('creative') || lowerInput.includes('innovative') || lowerInput.includes('unique')) {
            requirements.push('Creative and original approach');
        }
        
        if (lowerInput.includes('step') || lowerInput.includes('guide') || lowerInput.includes('how to')) {
            requirements.push('Step-by-step instructions');
        }
        
        return requirements;
    }

    /**
     * Detect urgency level from input
     */
    detectUrgencyLevel(input) {
        const urgentWords = ['urgent', 'asap', 'immediately', 'quickly', 'fast', 'rush', 'deadline'];
        const lowerInput = input.toLowerCase();
        
        return urgentWords.some(word => lowerInput.includes(word)) ? 'high' : 'normal';
    }

    /**
     * Estimate complexity level
     */
    estimateComplexity(input) {
        const complexWords = ['comprehensive', 'detailed', 'analysis', 'research', 'strategy', 'framework', 'methodology'];
        const simpleWords = ['simple', 'basic', 'quick', 'brief', 'overview', 'summary'];
        
        const lowerInput = input.toLowerCase();
        const complexMatches = complexWords.filter(word => lowerInput.includes(word)).length;
        const simpleMatches = simpleWords.filter(word => lowerInput.includes(word)).length;
        
        if (complexMatches > simpleMatches) return 'high';
        if (simpleMatches > complexMatches) return 'low';
        return 'medium';
    }

    /**
     * Build the structured prompt
     */
    buildStructuredPrompt(processedInput, template, options) {
        const sections = [];
        
        // 1. Role and Context Section
        sections.push(this.buildRoleSection(template, processedInput, options));
        
        // 2. Task Description Section
        sections.push(this.buildTaskSection(processedInput, options));
        
        // 3. Specific Instructions Section
        sections.push(this.buildInstructionsSection(processedInput, options));
        
        // 4. Output Format Section
        sections.push(this.buildFormatSection(options));
        
        // 5. Quality Guidelines Section
        sections.push(this.buildQualitySection(processedInput, options));
        
        // Combine all sections
        return sections.filter(section => section.length > 0).join('\n\n');
    }

    /**
     * Build role and context section
     */
    buildRoleSection(template, processedInput, options) {
        const rolePrompt = template.rolePrompts[Math.floor(Math.random() * template.rolePrompts.length)];
        const context = options.audience ? ` Your audience consists of ${options.audience}.` : '';
        
        return `**Role & Context:**\n${rolePrompt} with deep expertise in the relevant field.${context} You understand the nuances and requirements for high-quality work in this domain.`;
    }

    /**
     * Build task description section
     */
    buildTaskSection(processedInput, options) {
        let taskDescription = `**Primary Task:**\n${processedInput.mainTask}`;
        
        if (processedInput.keywords.length > 0) {
            taskDescription += `\n\n**Key Focus Areas:**\n${processedInput.keywords.map(keyword => `• ${this.capitalizeFirstLetter(keyword)}`).join('\n')}`;
        }
        
        if (processedInput.impliedRequirements.length > 0) {
            taskDescription += `\n\n**Specific Requirements:**\n${processedInput.impliedRequirements.map(req => `• ${req}`).join('\n')}`;
        }
        
        return taskDescription;
    }

    /**
     * Build instructions section
     */
    buildInstructionsSection(processedInput, options) {
        const instructions = ['**Instructions:**'];
        
        // Add tone-specific instructions
        if (options.tone && this.toneMapping[options.tone.toLowerCase()]) {
            instructions.push(`• ${this.toneMapping[options.tone.toLowerCase()]}`);
        }
        
        // Add complexity-based instructions
        if (processedInput.complexityLevel === 'high') {
            instructions.push('• Provide in-depth analysis with multiple perspectives');
            instructions.push('• Include relevant background context and supporting details');
        } else if (processedInput.complexityLevel === 'low') {
            instructions.push('• Keep explanations simple and accessible');
            instructions.push('• Focus on the most essential information');
        }
        
        // Add urgency-based instructions
        if (processedInput.urgencyLevel === 'high') {
            instructions.push('• Prioritize the most critical points first');
            instructions.push('• Be direct and actionable in your recommendations');
        }
        
        // Add common quality instructions
        instructions.push('• Use clear, professional language throughout');
        instructions.push('• Support key points with evidence or examples when relevant');
        instructions.push('• Ensure logical flow and organization');
        
        return instructions.join('\n');
    }

    /**
     * Build format section
     */
    buildFormatSection(options) {
        const formatInstructions = ['**Output Format:**'];
        
        if (options.format && this.formatMapping[options.format.toLowerCase()]) {
            formatInstructions.push(`• ${this.formatMapping[options.format.toLowerCase()]}`);
        } else {
            formatInstructions.push('• Structure your response with clear headings and sections');
            formatInstructions.push('• Use bullet points or numbered lists for clarity when appropriate');
        }
        
        if (options.length) {
            const lengthNum = parseInt(options.length);
            if (lengthNum) {
                formatInstructions.push(`• Target approximately ${lengthNum} words in your response`);
            }
        }
        
        formatInstructions.push('• Use proper formatting to enhance readability');
        
        return formatInstructions.join('\n');
    }

    /**
     * Build quality guidelines section
     */
    buildQualitySection(processedInput, options) {
        const guidelines = [
            '**Quality Standards:**',
            '• Ensure accuracy and relevance in all content',
            '• Maintain consistency in tone and style throughout',
            '• Provide actionable insights and practical value'
        ];
        
        if (processedInput.complexityLevel === 'high') {
            guidelines.push('• Demonstrate deep understanding of complex concepts');
            guidelines.push('• Address potential counterarguments or limitations');
        }
        
        guidelines.push('• Review for clarity, coherence, and completeness before responding');
        
        return guidelines.join('\n');
    }

    /**
     * Generate alternative prompt variations
     */
    generateVariations(userInput, promptType, options, count = 3) {
        const variations = [];
        
        for (let i = 0; i < count; i++) {
            // Slightly modify the approach for each variation
            const modifiedOptions = { ...options };
            
            if (i === 1) {
                // More detailed variation
                modifiedOptions.complexityBoost = true;
            } else if (i === 2) {
                // More concise variation
                modifiedOptions.conciseMode = true;
            }
            
            const variation = this.generatePrompt(userInput, promptType, modifiedOptions);
            variations.push({
                id: i + 1,
                prompt: variation,
                style: i === 0 ? 'standard' : i === 1 ? 'detailed' : 'concise'
            });
        }
        
        return variations;
    }

    /**
     * Utility function to capitalize first letter
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Validate user input
     */
    validateInput(input, type, options) {
        const errors = [];
        
        if (!input || input.trim().length === 0) {
            errors.push('Task description is required');
        }
        
        if (input && input.length < 10) {
            errors.push('Please provide a more detailed task description');
        }
        
        if (input && input.length > 1000) {
            errors.push('Task description is too long. Please keep it under 1000 characters');
        }
        
        if (options.length && isNaN(parseInt(options.length))) {
            errors.push('Length must be a valid number');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Get prompt statistics
     */
    getPromptStats(prompt) {
        const words = prompt.split(/\s+/).length;
        const characters = prompt.length;
        const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const sections = (prompt.match(/\*\*/g) || []).length / 2; // Count of markdown bold sections
        
        return {
            words,
            characters,
            sentences,
            sections,
            estimatedReadingTime: Math.ceil(words / 200) // Average reading speed
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptEngine;
} else {
    window.PromptEngine = PromptEngine;
}
