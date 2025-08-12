/**
 * AI Prompt Engineering Engine
 * Transforms simple English tasks into well-structured AI prompts
 */

class PromptEngine {
    constructor() {
        this.templates = {
            general: {
                structure: [
                    'System Role & Context',
                    'Task Definition & Objectives', 
                    'Detailed Instructions & Constraints',
                    'Output Format & Structure',
                    'Quality Standards & Evaluation Criteria',
                    'Examples & Edge Cases'
                ],
                rolePrompts: [
                    'Act as an expert consultant with deep domain knowledge',
                    'You are a senior specialist with 10+ years of experience',
                    'Take on the role of a professional advisor and thought leader',
                    'Function as an authoritative expert in your field'
                ],
                techniques: ['few-shot learning', 'chain-of-thought', 'structured reasoning']
            },
            writing: {
                structure: [
                    'Writing Expertise & Authority',
                    'Content Goals & Success Metrics',
                    'Audience Analysis & Personas',
                    'Voice, Tone & Brand Guidelines',
                    'Content Structure & Flow',
                    'SEO & Distribution Strategy',
                    'Quality Assurance & Editing'
                ],
                rolePrompts: [
                    'You are a world-class content strategist and writer with expertise in [DOMAIN]',
                    'Act as a senior copywriter who has crafted award-winning campaigns',
                    'Take the role of an editorial director with deep audience insights',
                    'Function as a content marketing expert with proven conversion expertise'
                ],
                techniques: ['storytelling framework', 'persuasion psychology', 'audience segmentation']
            },
            analysis: {
                structure: [
                    'Analytical Authority & Methodology',
                    'Problem Definition & Scope',
                    'Analytical Framework & Models',
                    'Data Sources & Evidence Standards',
                    'Critical Thinking & Bias Mitigation',
                    'Structured Output & Recommendations',
                    'Confidence Levels & Limitations'
                ],
                rolePrompts: [
                    'You are a senior data scientist with expertise in [DOMAIN] analytics',
                    'Act as a strategic consultant who provides C-level insights',
                    'Take the role of a research director with methodological rigor',
                    'Function as a critical thinking expert who evaluates evidence objectively'
                ],
                techniques: ['root cause analysis', 'comparative analysis', 'scenario modeling']
            },
            creative: {
                structure: [
                    'Creative Authority & Vision',
                    'Creative Brief & Objectives',
                    'Inspiration Sources & References',
                    'Creative Constraints & Parameters',
                    'Innovation Methodology',
                    'Output Specifications & Formats',
                    'Iteration & Refinement Process'
                ],
                rolePrompts: [
                    'You are an award-winning creative director with breakthrough campaign experience',
                    'Act as an innovative design thinking expert and creative strategist',
                    'Take the role of a visionary artist who pushes creative boundaries',
                    'Function as a creative catalyst who generates original, compelling ideas'
                ],
                techniques: ['design thinking', 'lateral thinking', 'creative constraints', 'divergent ideation']
            },
            code: {
                structure: [
                    'Technical Authority & Expertise',
                    'Requirements Analysis & Specification',
                    'Architecture & Design Patterns',
                    'Implementation Standards & Best Practices',
                    'Code Quality & Security Standards',
                    'Testing Strategy & Validation',
                    'Documentation & Maintainability'
                ],
                rolePrompts: [
                    'You are a principal software engineer with deep expertise in [TECHNOLOGY]',
                    'Act as a senior technical architect who designs scalable systems',
                    'Take the role of a code quality expert and security specialist',
                    'Function as a technical lead who mentors and reviews production code'
                ],
                techniques: ['clean code principles', 'test-driven development', 'code review standards']
            },
            research: {
                structure: [
                    'Research Authority & Credentials',
                    'Research Objectives & Hypotheses',
                    'Methodology & Research Design',
                    'Source Evaluation & Validation',
                    'Data Collection & Analysis',
                    'Findings & Evidence Synthesis',
                    'Limitations & Future Research'
                ],
                rolePrompts: [
                    'You are a distinguished research scientist with published expertise in [FIELD]',
                    'Act as a senior academic researcher with methodological expertise',
                    'Take the role of a strategic research analyst with industry insights',
                    'Function as an investigative researcher who uncovers deep insights'
                ],
                techniques: ['systematic review', 'meta-analysis', 'evidence hierarchy', 'peer review standards']
            }
        };

        this.commonInstructions = {
            clarity: 'Provide crystal-clear, logically structured responses with zero ambiguity.',
            accuracy: 'Ensure 100% factual accuracy with verifiable, current information.',
            examples: 'Include specific, relevant examples that demonstrate key concepts.',
            structure: 'Use hierarchical organization with clear sections, headers, and formatting.',
            comprehensive: 'Address all aspects thoroughly while maintaining focus and relevance.',
            actionable: 'Deliver concrete, implementable recommendations with clear next steps.',
            reasoning: 'Show your thinking process and justify conclusions with evidence.',
            constraints: 'Acknowledge limitations and specify assumptions explicitly.'
        };

        this.promptingTechniques = {
            'chain-of-thought': 'Think step-by-step through the problem, showing your reasoning process.',
            'few-shot': 'Provide 2-3 specific examples to illustrate the expected approach and format.',
            'zero-shot': 'Solve the task using your knowledge without examples, focusing on clear instructions.',
            'role-playing': 'Adopt a specific expert persona with relevant credentials and experience.',
            'constraint-based': 'Work within specific limitations and requirements to optimize output.',
            'iterative-refinement': 'Build upon initial responses through systematic improvement cycles.',
            'structured-thinking': 'Break down complex problems into manageable components with clear frameworks.'
        };

        this.toneMapping = {
            professional: 'Maintain executive-level professionalism with authoritative, polished communication.',
            casual: 'Use conversational but intelligent tone, as if consulting with a knowledgeable colleague.',
            friendly: 'Be warm and approachable while maintaining expertise and credibility.',
            authoritative: 'Demonstrate deep expertise with confident, evidence-backed assertions.',
            educational: 'Teach with clarity, using scaffolded explanations and progressive complexity.',
            persuasive: 'Use compelling rhetoric, strong evidence, and logical argumentation.',
            technical: 'Employ precise terminology and industry-standard language for expert audiences.',
            creative: 'Think innovatively while balancing originality with practical feasibility.',
            analytical: 'Apply rigorous logic, data-driven insights, and systematic evaluation.',
            empathetic: 'Show understanding and emotional intelligence while providing solutions.'
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
     * Build the structured prompt using advanced prompt engineering techniques
     */
    buildStructuredPrompt(processedInput, template, options) {
        const sections = [];
        
        // 1. System Role & Context Section (with domain expertise)
        sections.push(this.buildEnhancedRoleSection(template, processedInput, options));
        
        // 2. Task Definition & Objectives
        sections.push(this.buildTaskDefinitionSection(processedInput, options));
        
        // 3. Methodology & Approach
        sections.push(this.buildMethodologySection(template, processedInput, options));
        
        // 4. Detailed Instructions & Constraints
        sections.push(this.buildDetailedInstructionsSection(processedInput, options));
        
        // 5. Output Format & Structure
        sections.push(this.buildEnhancedFormatSection(options, template));
        
        // 6. Quality Standards & Evaluation Criteria
        sections.push(this.buildQualityStandardsSection(processedInput, options));
        
        // 7. Examples & Edge Cases (when applicable)
        sections.push(this.buildExamplesSection(processedInput, template, options));
        
        // 8. Validation & Success Metrics
        sections.push(this.buildValidationSection(processedInput, options));
        
        // Combine all sections with proper spacing
        return sections.filter(section => section.length > 0).join('\n\n');
    }

    /**
     * Build enhanced role section with domain expertise
     */
    buildEnhancedRoleSection(template, processedInput, options) {
        const rolePrompt = template.rolePrompts[Math.floor(Math.random() * template.rolePrompts.length)];
        const domain = this.extractDomain(processedInput.originalInput);
        const enhancedRole = rolePrompt.replace('[DOMAIN]', domain).replace('[TECHNOLOGY]', domain).replace('[FIELD]', domain);
        
        let section = `## SYSTEM ROLE & EXPERTISE\n\n${enhancedRole}`;
        
        if (options.audience) {
            section += `\n\n**Target Audience:** ${options.audience}`;
            section += `\n**Communication Style:** Tailor your expertise and language to resonate with ${options.audience}.`;
        }
        
        section += `\n\n**Authority Indicators:**`;
        section += `\n• Deep domain knowledge with practical, real-world experience`;
        section += `\n• Understanding of industry best practices and emerging trends`;
        section += `\n• Ability to provide context-aware, nuanced insights`;
        section += `\n• Track record of delivering high-impact, actionable solutions`;
        
        return section;
    }

    /**
     * Extract domain from user input
     */
    extractDomain(input) {
        const domains = {
            'marketing': ['marketing', 'campaign', 'brand', 'advertising', 'promotion'],
            'technology': ['code', 'programming', 'software', 'tech', 'development', 'app'],
            'business': ['strategy', 'business', 'revenue', 'profit', 'operations', 'management'],
            'education': ['teach', 'learn', 'education', 'training', 'course', 'student'],
            'content': ['content', 'writing', 'blog', 'article', 'copy', 'social media'],
            'research': ['research', 'analysis', 'study', 'data', 'investigation'],
            'design': ['design', 'creative', 'visual', 'ui', 'ux', 'graphics'],
            'finance': ['finance', 'financial', 'money', 'investment', 'budget', 'economics']
        };
        
        const lowerInput = input.toLowerCase();
        for (const [domain, keywords] of Object.entries(domains)) {
            if (keywords.some(keyword => lowerInput.includes(keyword))) {
                return domain;
            }
        }
        return 'your specialized field';
    }

    /**
     * Build task definition section
     */
    buildTaskDefinitionSection(processedInput, options) {
        let section = `## TASK DEFINITION & OBJECTIVES\n\n`;
        
        section += `**Primary Objective:**\n${processedInput.mainTask}\n\n`;
        
        // Add success criteria
        section += `**Success Criteria:**\n`;
        section += `• Delivers comprehensive solution that fully addresses the core objective\n`;
        section += `• Maintains high quality standards throughout execution\n`;
        section += `• Provides actionable insights and practical implementation guidance\n`;
        
        if (options.length) {
            section += `• Meets target length specification of approximately ${options.length} words\n`;
        }
        
        if (processedInput.keywords.length > 0) {
            section += `\n**Key Focus Areas:**\n${processedInput.keywords.map(keyword => `• ${this.capitalizeFirstLetter(keyword)}`).join('\n')}`;
        }
        
        if (processedInput.impliedRequirements.length > 0) {
            section += `\n\n**Specific Requirements:**\n${processedInput.impliedRequirements.map(req => `• ${req}`).join('\n')}`;
        }
        
        // Add complexity and urgency context
        section += `\n\n**Context Parameters:**\n`;
        section += `• Complexity Level: ${processedInput.complexityLevel.charAt(0).toUpperCase() + processedInput.complexityLevel.slice(1)}\n`;
        section += `• Priority Level: ${processedInput.urgencyLevel.charAt(0).toUpperCase() + processedInput.urgencyLevel.slice(1)}\n`;
        
        return section;
    }

    /**
     * Build methodology section
     */
    buildMethodologySection(template, processedInput, options) {
        let section = `## METHODOLOGY & APPROACH\n\n`;
        
        // Select appropriate technique
        const techniques = template.techniques || ['structured-thinking'];
        const selectedTechnique = techniques[Math.floor(Math.random() * techniques.length)];
        
        section += `**Primary Methodology:** ${selectedTechnique.replace('-', ' ').toUpperCase()}\n`;
        section += `${this.promptingTechniques[selectedTechnique]}\n\n`;
        
        section += `**Approach Framework:**\n`;
        section += `• Begin with comprehensive analysis of the problem/opportunity\n`;
        section += `• Apply systematic thinking and proven methodologies\n`;
        section += `• Incorporate relevant best practices and industry standards\n`;
        section += `• Validate recommendations against success criteria\n`;
        section += `• Provide clear implementation roadmap\n\n`;
        
        if (processedInput.complexityLevel === 'high') {
            section += `**Advanced Considerations:**\n`;
            section += `• Address multiple perspectives and potential edge cases\n`;
            section += `• Consider interdependencies and system-level impacts\n`;
            section += `• Anticipate potential challenges and mitigation strategies\n`;
        }
        
        return section;
    }

    /**
     * Build detailed instructions section
     */
    buildDetailedInstructionsSection(processedInput, options) {
        let section = `## DETAILED INSTRUCTIONS & CONSTRAINTS\n\n`;
        
        // Core behavioral instructions
        section += `**Core Behavioral Guidelines:**\n`;
        section += `${Object.values(this.commonInstructions).map(instruction => `• ${instruction}`).join('\n')}\n\n`;
        
        // Tone-specific instructions
        if (options.tone && this.toneMapping[options.tone.toLowerCase()]) {
            section += `**Communication Style:**\n• ${this.toneMapping[options.tone.toLowerCase()]}\n\n`;
        }
        
        // Complexity-based instructions
        section += `**Complexity Guidelines:**\n`;
        if (processedInput.complexityLevel === 'high') {
            section += `• Provide comprehensive analysis with multiple perspectives and scenarios\n`;
            section += `• Include detailed background context and theoretical foundations\n`;
            section += `• Address potential counterarguments and alternative approaches\n`;
            section += `• Consider long-term implications and strategic considerations\n`;
        } else if (processedInput.complexityLevel === 'low') {
            section += `• Focus on essential information and key takeaways\n`;
            section += `• Use accessible language and avoid unnecessary complexity\n`;
            section += `• Prioritize practical, immediately actionable guidance\n`;
            section += `• Provide clear, straightforward recommendations\n`;
        } else {
            section += `• Balance depth with accessibility for general audiences\n`;
            section += `• Include sufficient detail without overwhelming complexity\n`;
            section += `• Provide both overview and specific guidance as needed\n`;
        }
        
        // Urgency-based prioritization
        if (processedInput.urgencyLevel === 'high') {
            section += `\n**Priority Framework:**\n`;
            section += `• Lead with the most critical information and immediate actions\n`;
            section += `• Organize content by impact and urgency\n`;
            section += `• Provide quick-reference summaries for key decisions\n`;
        }
        
        // Add specific constraints
        section += `\n**Operational Constraints:**\n`;
        section += `• Maintain factual accuracy and cite sources when making claims\n`;
        section += `• Acknowledge limitations and assumptions explicitly\n`;
        section += `• Avoid speculation without clearly labeling it as such\n`;
        section += `• Focus on practical implementation over theoretical discussion\n`;
        
        return section;
    }

    /**
     * Build enhanced format section
     */
    buildEnhancedFormatSection(options, template) {
        let section = `## OUTPUT FORMAT & STRUCTURE\n\n`;
        
        section += `**Required Structure:**\n`;
        
        if (options.format && this.formatMapping[options.format.toLowerCase()]) {
            section += `• ${this.formatMapping[options.format.toLowerCase()]}\n`;
        } else {
            section += `• Begin with executive summary or key takeaways\n`;
            section += `• Organize content with hierarchical headings (H1, H2, H3)\n`;
            section += `• Use bullet points, numbered lists, and tables for clarity\n`;
            section += `• Include clear section breaks and logical flow\n`;
            section += `• End with actionable next steps or conclusions\n`;
        }
        
        if (options.length) {
            const lengthNum = parseInt(options.length);
            if (lengthNum) {
                section += `\n**Length Specification:**\n• Target ${lengthNum} words (±10% acceptable)\n`;
                section += `• Prioritize quality over exact word count\n`;
                section += `• Include word count at end: [Word Count: XXX]\n`;
            }
        }
        
        section += `\n**Formatting Standards:**\n`;
        section += `• Use **bold** for key terms and section headers\n`;
        section += `• Use *italics* for emphasis and important concepts\n`;
        section += `• Include relevant examples in > blockquotes when helpful\n`;
        section += `• Use code formatting for technical terms when applicable\n`;
        section += `• Ensure consistent spacing and visual hierarchy\n`;
        
        return section;
    }

    /**
     * Build quality standards section
     */
    buildQualityStandardsSection(processedInput, options) {
        let section = `## QUALITY STANDARDS & EVALUATION CRITERIA\n\n`;
        
        section += `**Excellence Benchmarks:**\n`;
        section += `• **Accuracy:** 100% factual correctness with verifiable sources\n`;
        section += `• **Relevance:** Direct alignment with stated objectives and audience needs\n`;
        section += `• **Completeness:** Comprehensive coverage of all critical aspects\n`;
        section += `• **Clarity:** Crystal-clear communication with zero ambiguity\n`;
        section += `• **Actionability:** Practical, implementable recommendations\n`;
        section += `• **Value:** Delivers meaningful insights that justify the investment\n\n`;
        
        if (processedInput.complexityLevel === 'high') {
            section += `**Advanced Quality Criteria:**\n`;
            section += `• Demonstrate sophisticated analysis and nuanced understanding\n`;
            section += `• Address potential edge cases and alternative scenarios\n`;
            section += `• Provide strategic context and long-term implications\n`;
            section += `• Include risk assessment and mitigation strategies\n\n`;
        }
        
        section += `**Validation Checkpoints:**\n`;
        section += `• Content serves the primary objective effectively\n`;
        section += `• Communication style matches target audience needs\n`;
        section += `• Recommendations are feasible and well-supported\n`;
        section += `• Structure enhances understanding and usability\n`;
        section += `• Output meets all specified format and length requirements\n`;
        
        return section;
    }

    /**
     * Build examples section
     */
    buildExamplesSection(processedInput, template, options) {
        if (processedInput.complexityLevel === 'low') {
            return ''; // Skip examples for simple tasks
        }
        
        let section = `## EXAMPLES & REFERENCE POINTS\n\n`;
        
        section += `**Response Framework Example:**\n`;
        section += `When addressing the core request, structure your response as follows:\n`;
        section += `1. **Context Setting:** Brief overview of the situation/challenge\n`;
        section += `2. **Analysis:** Key insights and considerations\n`;
        section += `3. **Recommendations:** Specific, actionable next steps\n`;
        section += `4. **Implementation:** How to execute the recommendations\n`;
        section += `5. **Success Metrics:** How to measure effectiveness\n\n`;
        
        if (processedInput.complexityLevel === 'high') {
            section += `**Quality Example:**\n`;
            section += `> "Based on market analysis data from Q3 2024, implementing a customer retention strategy should focus on three key areas: (1) personalized communication touchpoints that increase engagement by 40%, (2) loyalty program optimization targeting high-value segments, and (3) predictive analytics to identify at-risk customers 60 days before churn probability peaks."\n\n`;
        }
        
        return section;
    }

    /**
     * Build validation section
     */
    buildValidationSection(processedInput, options) {
        let section = `## VALIDATION & SUCCESS METRICS\n\n`;
        
        section += `**Before Responding, Verify:**\n`;
        section += `• [ ] All requirements from the task definition are addressed\n`;
        section += `• [ ] Response meets quality standards and evaluation criteria\n`;
        section += `• [ ] Content is appropriate for specified audience and tone\n`;
        section += `• [ ] Format and structure enhance readability and usability\n`;
        section += `• [ ] Recommendations are actionable and well-supported\n\n`;
        
        if (options.length) {
            section += `• [ ] Word count is within target range (${options.length} ±10%)\n`;
        }
        
        section += `**Success Indicators:**\n`;
        section += `• Reader can immediately understand the core message\n`;
        section += `• Recommendations are specific enough to implement\n`;
        section += `• Content provides genuine value and insights\n`;
        section += `• Response would be considered authoritative by domain experts\n`;
        section += `• Output fully satisfies the original request\n\n`;
        
        section += `**Final Check:**\n`;
        section += `Review your complete response against these criteria before submitting. If any area falls short, revise accordingly to meet professional standards.`;
        
        return section;
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
