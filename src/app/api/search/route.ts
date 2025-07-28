import { NextRequest, NextResponse } from 'next/server';
const SerpApi = require('google-search-results-nodejs');
import OpenAI from 'openai';
import { demoProducts } from '@/lib/demo-data';

let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface ProductResult {
  id: string;
  title: string;
  titlePersian: string;
  price: string;
  rating: number;
  image: string;
  link: string;
  shop: string;
  description?: string;
  descriptionPersian?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query, category, filters } = await request.json();

    if (!query && !category) {
      return NextResponse.json({ error: 'Query or category is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `search_${query || category}_${JSON.stringify(filters)}`;
    
    // If API keys are not configured, return demo data
    if (!process.env.SERPAPI_API_KEY || !process.env.OPENAI_API_KEY) {
      console.log('API keys not configured, returning demo data');
      const filteredDemoProducts = demoProducts.filter(product => {
        const searchTerm = (query || category).toLowerCase();
        return product.title.toLowerCase().includes(searchTerm) || 
               product.titlePersian.includes(searchTerm);
      });
      
      return NextResponse.json({
        products: filteredDemoProducts,
        total: filteredDemoProducts.length,
        query: query || category,
        cacheKey,
        demo: true,
      });
    }
    
    // SerpAPI search parameters
    const search = new SerpApi.GoogleSearch(process.env.SERPAPI_API_KEY);
    const searchParams = {
      engine: "google_shopping",
      q: query || category,
      location: "Turkey",
      hl: "tr",
      gl: "tr",
      num: filters?.limit || 20,
    };

    // Add price filter if provided
    if (filters?.priceMin || filters?.priceMax) {
      searchParams.q += ` price:${filters.priceMin || 0}-${filters.priceMax || 999999}`;
    }

    // Fetch from SerpAPI
    const searchResults: any = await new Promise((resolve, reject) => {
      search.json(searchParams, (result: any) => {
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result);
        }
      });
    });

    if (!searchResults.shopping_results) {
      return NextResponse.json({ products: [], total: 0 });
    }

    // Process results
    const products: ProductResult[] = [];
    
    for (const result of searchResults.shopping_results.slice(0, 20)) {
      try {
        // Translate Turkish to Persian using OpenAI
        const titleTranslation = await translateText(result.title);
        const descriptionTranslation = result.snippet ? 
          await translateText(result.snippet) : undefined;

        products.push({
          id: result.position?.toString() || Math.random().toString(),
          title: result.title,
          titlePersian: titleTranslation,
          price: result.price || 'N/A',
          rating: result.rating || 0,
          image: result.thumbnail || '/images/placeholder.png',
          link: result.link,
          shop: result.source,
          description: result.snippet,
          descriptionPersian: descriptionTranslation,
        });
      } catch (error) {
        console.error('Error processing product:', error);
        // Continue with next product
      }
    }

    // Cache results (in production, use Redis or similar)
    // For now, we'll just return the results

    return NextResponse.json({
      products,
      total: products.length,
      query: query || category,
      cacheKey,
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}

async function translateText(text: string): Promise<string> {
  try {
    if (!openai) {
      return text; // Return original text if OpenAI is not configured
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a translator that translates Turkish product names and descriptions to Persian (Farsi). Provide only the translation, no additional text."
        },
        {
          role: "user",
          content: `Translate this Turkish text to Persian: "${text}"`
        }
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');

  if (!query && !category) {
    return NextResponse.json({ error: 'Query or category is required' }, { status: 400 });
  }

  // Forward to POST method
  return POST(request);
}