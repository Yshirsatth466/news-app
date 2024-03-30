import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedArticleDetails, setSelectedArticleDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsType, setNewsType] = useState('world'); // Default to 'world' news
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [searchQuery, newsType]);

  useEffect(() => {
    document.getElementById('root').className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&q=${searchQuery}&apiKey=d10b0b6243c24c9887ce9df42bbabfcc`);
      setNews(response.data.articles);
    } catch (error) {
      if (error.response && error.response.status === 426) {
        setError('Upgrade Required: Please use a secure connection (HTTPS).');
      } else {
        setError('Error fetching news. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowSource = (article) => {
    setSelectedArticle(article.url);
    setSelectedArticleDetails(article);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleNewsTypeChange = (type) => {
    setNewsType(type);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="container">
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className={`nav-item ${newsType === 'world' ? 'active' : ''}`}>
                <button className="nav-link btn btn-link" onClick={() => handleNewsTypeChange('world')}>World</button>
              </li>
              <li className={`nav-item ${newsType === 'bollywood' ? 'active' : ''}`}>
                <button className="nav-link btn btn-link" onClick={() => handleNewsTypeChange('bollywood')}>Bollywood</button>
              </li>
              <li className={`nav-item ${newsType === 'india' ? 'active' : ''}`}>
                <button className="nav-link btn btn-link" onClick={() => handleNewsTypeChange('india')}>Indian Political</button>
              </li>
              <li className={`nav-item ${newsType === 'sports' ? 'active' : ''}`}>
                <button className="nav-link btn btn-link" onClick={() => handleNewsTypeChange('sports')}>Sports</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-dark" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </div>
      <h2 className="mt-4 mb-4">Top News Headlines</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Search for news..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button  id="serach"className="btn btn-primary rounded-pill" onClick={fetchNews}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="row">
        {news.map((article, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <img src={article.urlToImage} className="card-img-top" alt={article.title} />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleShowSource(article)}
                >
                  Show Source
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedArticleDetails && (
        <div className="modal" tabIndex="-1" role="dialog" style={{display: 'block'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedArticleDetails.title}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setSelectedArticleDetails(null)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{selectedArticleDetails.description}</p>
                <p>Author: {selectedArticleDetails.author}</p>
                <p>Published At: {selectedArticleDetails.publishedAt}</p>
                <p>Source: {selectedArticleDetails.source.name}</p>
                <p>URL: <a href={selectedArticleDetails.url} target="_blank" rel="noreferrer">{selectedArticleDetails.url}</a></p>
                <img src={selectedArticleDetails.urlToImage} className="img-fluid" alt={selectedArticleDetails.title} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
