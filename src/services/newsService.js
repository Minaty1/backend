const axios = require('axios')

const API_KEY = () => process.env.SERP_API_KEY

class NewsService {
  async getHeadlines(country = 'us', category = null) {
    try {
      if (!API_KEY()) {
        return {
          status: 'ok',
          totalResults: 3,
          articles: [
            { title: 'Tech Advances in AI', source: 'Tech News', publishedAt: new Date().toISOString() },
            { title: 'Markets Rally', source: 'Finance Daily', publishedAt: new Date().toISOString() },
            { title: 'Sports Highlights', source: 'Sports News', publishedAt: new Date().toISOString() }
          ],
          source: 'mock'
        }
      }

      const params = {
        engine: 'google_news',
        gl: country,
        api_key: API_KEY()
      }
      if (category) params.topic = category

      const resp = await axios.get('https://serpapi.com/search', { params })

      const results = resp.data.news_results || []
      
      return {
        status: 'ok',
        totalResults: results.length,
        articles: results.map(a => ({
          title: a.title,
          description: a.snippet || a.title,
          source: a.source?.name || a.source || 'Unknown',
          author: a.author || null,
          url: a.link,
          publishedAt: a.date || new Date().toISOString(),
          image: a.thumbnail || null
        })),
        source: 'serpapi'
      }
    } catch (err) {
      console.error('News API Error:', err.message)
      throw new Error('Failed to fetch news headlines')
    }
  }

  async searchNews(query) {
    try {
      if (!API_KEY()) {
        return {
          articles: [
            { title: `Search results for: ${query}`, description: 'Mock result', source: 'Mock' }
          ],
          source: 'mock',
          status: 'ok',
          totalResults: 1
        }
      }

      const params = {
        engine: 'google_news',
        q: query,
        api_key: API_KEY()
      }

      const resp = await axios.get('https://serpapi.com/search', { params })

      const results = resp.data.news_results || []

      return {
        status: 'ok',
        totalResults: results.length,
        articles: results.map(a => ({
          title: a.title,
          description: a.snippet || a.title,
          source: a.source?.name || a.source || 'Unknown',
          author: a.author || null,
          url: a.link,
          publishedAt: a.date || new Date().toISOString(),
          image: a.thumbnail || null
        })),
        source: 'serpapi'
      }
    } catch (err) {
      console.error('News Search Error:', err.message)
      throw new Error('Failed to search news')
    }
  }
}

module.exports = new NewsService()
