import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, AnalysisType, ScanOptions } from "../types";

// Define the response schema for strict JSON output
const securitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: "Uma pontuação de segurança de 0 a 100. Se a análise de segurança for ignorada, retorne 0.",
    },
    seoScore: {
      type: Type.NUMBER,
      description: "Uma pontuação de SEO de 0 a 100. Se a análise de SEO for ignorada, retorne 0.",
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"],
      description: "O nível geral de risco de segurança baseado nas descobertas. Se ignorado, retorne SAFE.",
    },
    summary: {
      type: Type.STRING,
      description: "Um resumo executivo conciso da análise realizada.",
    },
    findings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título curto da vulnerabilidade." },
          severity: { 
            type: Type.STRING, 
            enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"],
            description: "Severidade da vulnerabilidade." 
          },
          description: { type: Type.STRING, description: "Explicação técnica do problema." },
          remediation: { type: Type.STRING, description: "Passos práticos e código para corrigir o problema." },
          affectedComponent: { type: Type.STRING, description: "A linha de código, endpoint ou header afetado." },
        },
        required: ["title", "severity", "description", "remediation"],
      },
    },
    seoFindings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título da melhoria de SEO." },
          importance: { 
            type: Type.STRING, 
            enum: ["HIGH", "MEDIUM", "LOW"],
            description: "Importância dessa melhoria para o ranking." 
          },
          description: { type: Type.STRING, description: "O que está faltando ou pode ser melhorado." },
          recommendation: { type: Type.STRING, description: "Como corrigir (ex: adicionar meta description)." },
        },
        required: ["title", "importance", "description", "recommendation"],
      },
    },
    exposedEndpoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de endpoints de API que parecem estar expostos publicamente ou sem autenticação adequada.",
    },
  },
  required: ["score", "seoScore", "riskLevel", "summary", "findings", "seoFindings", "exposedEndpoints"],
};

export const analyzeSecurity = async (
  content: string,
  type: AnalysisType,
  options: ScanOptions = { checkSecurity: true, checkSeo: true }
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key não encontrada. Configure a variável de ambiente API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let systemPrompt = "Você é um especialista sênior em Segurança Cibernética (AppSec) e Especialista em SEO Técnico. ";
  
  if (type === AnalysisType.URL_SCAN) {
    systemPrompt += "Analise a URL e o conteúdo HTML fornecido. ";
    
    if (options.checkSecurity) {
      systemPrompt += "1) SEGURANÇA: Identifique riscos visíveis, endpoints expostos e configurações inseguras. ";
    } else {
      systemPrompt += "IGNORE a análise de segurança profunda (retorne score 0, riskLevel SAFE e lista vazia em findings). ";
    }

    if (options.checkSeo) {
      systemPrompt += "2) SEO: Verifique tags Meta (Title, Description), estrutura de cabeçalhos (H1-H6), atributos Alt em imagens, Open Graph tags, e melhores práticas de acessibilidade/performance que impactam o ranking. ";
    } else {
      systemPrompt += "IGNORE a análise de SEO (retorne seoScore 0 e lista vazia em seoFindings). ";
    }
  } else {
    // Legacy prompts for other types
    switch (type) {
      case AnalysisType.CODE_SNIPPET:
        systemPrompt += "Analise o código fonte fornecido em busca de vulnerabilidades.";
        break;
      case AnalysisType.HTTP_HEADERS:
        systemPrompt += "Analise os cabeçalhos HTTP brutos fornecidos.";
        break;
      case AnalysisType.API_DEFINITION:
        systemPrompt += "Analise a definição da API.";
        break;
      case AnalysisType.CONFIG_FILE:
        systemPrompt += "Analise o arquivo de configuração.";
        break;
    }
  }

  systemPrompt += " Seja extremamente crítico e técnico nas áreas solicitadas. Para áreas ignoradas, retorne arrays vazios e scores zerados conforme instruído.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `Analise o seguinte conteúdo:\n\n${content}` }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: securitySchema,
        temperature: 0.2,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("O modelo não retornou texto.");
    }

    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Erro na análise de segurança:", error);
    throw error;
  }
};