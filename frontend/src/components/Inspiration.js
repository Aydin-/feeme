import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  Chip, 
  Tabs, 
  Tab, 
  IconButton,
  Link,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import ArticleIcon from '@mui/icons-material/Article';
import YouTubeIcon from '@mui/icons-material/YouTube';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const CARD_WIDTHS = {
  xs: 12,
  sm: 6,
  md: 4,
  lg: 4
};

// RSS feed URLs for Bitcoin news
const RSS_FEEDS = [
  'https://coindesk.com/arc/outboundfeeds/rss/',
  'https://bitcoinmagazine.com/.rss/full/',
  'https://decrypt.co/feed',
  'https://www.coindesk.com/tag/bitcoin/feed/',
  'https://www.theblock.co/rss.xml'
];

// YouTube video IDs for Bitcoin content
const BITCOIN_VIDEOS = [
  {
    id: '41JCpzvnn_0',
    title: 'What is Bitcoin?',
    creator: '3Blue1Brown',
    thumbnail: 'https://img.youtube.com/vi/41JCpzvnn_0/maxresdefault.jpg',
    timestamp: '2023-01-15'
  },
  {
    id: 'bBC-nXj3Ng4',
    title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
    creator: 'Fireship',
    thumbnail: 'https://img.youtube.com/vi/bBC-nXj3Ng4/maxresdefault.jpg',
    timestamp: '2023-02-20'
  },
  {
    id: 'Ywzx7ZA2dMo',
    title: 'The Bitcoin Standard',
    creator: 'Real Vision',
    thumbnail: 'https://img.youtube.com/vi/Ywzx7ZA2dMo/maxresdefault.jpg',
    timestamp: '2023-03-10'
  },
  {
    id: 'Gc2en3nHxA4',
    title: 'Bitcoin Mining Explained',
    creator: 'Simply Explained',
    thumbnail: 'https://img.youtube.com/vi/Gc2en3nHxA4/maxresdefault.jpg',
    timestamp: '2023-04-05'
  },
  {
    id: 'mC43pZkpTec',
    title: 'Bitcoin vs Ethereum',
    creator: 'Whiteboard Crypto',
    thumbnail: 'https://img.youtube.com/vi/mC43pZkpTec/maxresdefault.jpg',
    timestamp: '2023-05-01'
  }
];

export function Inspiration() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [savedItems, setSavedItems] = useState([]);
  const [content, setContent] = useState({
    articles: [],
    videos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      let newContent = { ...content };
      
      switch (activeTab) {
        case 0: // Articles
          // Fetch from multiple RSS feeds
          const articlePromises = RSS_FEEDS.map(async (feedUrl) => {
            try {
              const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
              const data = await response.json();
              return data.items || [];
            } catch (err) {
              console.error(`Error fetching feed ${feedUrl}:`, err);
              return [];
            }
          });

          const allArticles = await Promise.all(articlePromises);
          const flattenedArticles = allArticles.flat();
          
          newContent.articles = flattenedArticles
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
            .slice(0, 12)
            .map(article => ({
              id: article.link,
              title: article.title,
              source: article.author || 'Unknown Source',
              excerpt: article.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
              image: article.thumbnail || 'https://picsum.photos/400/200',
              readTime: '5 min read',
              timestamp: new Date(article.pubDate).toLocaleString(),
              type: 'article'
            }));
          break;

        case 1: // Videos
          // Using curated Bitcoin videos
          newContent.videos = BITCOIN_VIDEOS.map(video => ({
            id: `https://www.youtube.com/watch?v=${video.id}`,
            title: video.title,
            creator: video.creator,
            thumbnail: video.thumbnail,
            timestamp: new Date(video.timestamp).toLocaleString(),
            type: 'video'
          }));
          break;
      }

      setContent(newContent);
    } catch (err) {
      setError(t('errors.failedToLoad'));
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleSave = (itemId) => {
    setSavedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderContentCard = (item) => {
    const isSaved = savedItems.includes(item.id);

    return (
      <Grid item {...CARD_WIDTHS} key={item.id}>
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}
        >
          {item.image && (
            <CardMedia
              component="img"
              height="200"
              image={item.image}
              alt={item.title}
            />
          )}
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {item.type === 'article' && <ArticleIcon sx={{ mr: 1, color: '#FF4500' }} />}
              {item.type === 'video' && <YouTubeIcon sx={{ mr: 1, color: '#FF0000' }} />}
              <Typography variant="subtitle2" color="text.secondary">
                {item.timestamp}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {item.excerpt || item.creator}
            </Typography>
            {item.readTime && (
              <Chip 
                label={item.readTime} 
                size="small" 
                variant="outlined" 
                sx={{ mr: 1 }} 
              />
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            <Box>
              <Tooltip title={isSaved ? t('Remove from saved') : t('Save for later')}>
                <IconButton 
                  onClick={() => toggleSave(item.id)}
                  color={isSaved ? "primary" : "default"}
                >
                  <BookmarkIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Share')}>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Button 
              endIcon={<OpenInNewIcon />}
              size="small"
              component={Link}
              href={item.id}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('View')}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 'bold',
            mb: 4
          }}
        >
          {t('Bitcoin Inspiration')}
        </Typography>

        <Typography 
          variant="h5" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{ mb: 6 }}
        >
          {t('Discover the latest insights, news, and discussions from the Bitcoin community')}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            centered
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1.1rem',
                minWidth: 120
              }
            }}
          >
            <Tab 
              icon={<ArticleIcon />} 
              label={t('Articles')} 
              iconPosition="start"
            />
            <Tab 
              icon={<YouTubeIcon />} 
              label={t('Videos')} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {activeTab === 0 && content.articles.map(renderContentCard)}
            {activeTab === 1 && content.videos.map(renderContentCard)}
          </Grid>
        )}
      </Box>
    </Container>
  );
} 