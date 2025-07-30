import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Users, Star, ChevronRight, Menu, X, MapPin, Clock, User, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [teamsRes, matchesRes, newsRes, eventsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/teams`),
        fetch(`${API_URL}/api/matches?limit=5`),
        fetch(`${API_URL}/api/news?limit=3`),
        fetch(`${API_URL}/api/events?limit=5`),
        fetch(`${API_URL}/api/stats`)
      ]);

      if (teamsRes.ok) setTeams(await teamsRes.json());
      if (matchesRes.ok) setMatches(await matchesRes.json());
      if (newsRes.ok) setNews(await newsRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = [
    { name: 'Home', page: 'home' },
    { name: 'Teams', page: 'teams' },
    { name: 'Calendar', page: 'calendar' },
    { name: 'News', page: 'news' },
    { name: 'Events', page: 'events' },
    { name: 'About', page: 'about' },
    { name: 'Contact', page: 'contact' }
  ];

  const Header = () => (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Champions Club</h1>
              <p className="text-sm text-gray-600">Excellence in Sports</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            {navigation.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.page
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );

  const HomePage = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1709403552725-97e0ba206cb8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxzcG9ydHMlMjBhY3Rpb258ZW58MHx8fGJsdWV8MTc1Mzg4NTQ0MHww&ixlib=rb-4.1.0&q=85"
            alt="Sports Action"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Champions <span className="text-blue-300">Club</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Where excellence meets passion. Join our community of champions and unleash your potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
              onClick={() => setCurrentPage('teams')}
            >
              Explore Teams <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold"
              onClick={() => setCurrentPage('contact')}
            >
              Join Us Today
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.total_teams || 0}</div>
              <div className="text-gray-600 font-medium">Active Teams</div>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.total_players || 0}</div>
              <div className="text-gray-600 font-medium">Athletes</div>
            </div>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.upcoming_matches || 0}</div>
              <div className="text-gray-600 font-medium">Upcoming Matches</div>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">15+</div>
              <div className="text-gray-600 font-medium">Years Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Latest News</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {news.length > 0 ? news.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{article.category}</Badge>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>{article.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {article.author}
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No news articles available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Matches */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Recent Matches</h2>
          <div className="space-y-4">
            {matches.length > 0 ? matches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-semibold">{match.home_team_name}</div>
                        <div className="text-2xl font-bold text-blue-600">{match.home_score || '-'}</div>
                      </div>
                      <div className="text-gray-400 text-lg">VS</div>
                      <div className="text-center">
                        <div className="font-semibold">{match.away_team_name}</div>
                        <div className="text-2xl font-bold text-blue-600">{match.away_score || '-'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={match.status === 'completed' ? 'default' : 'secondary'}
                        className="mb-2"
                      >
                        {match.status}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(match.match_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {match.venue}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8 text-gray-500">
                No matches scheduled yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  const TeamsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">Our Teams</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.length > 0 ? teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 relative">
              {team.image && (
                <img src={team.image} alt={team.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-blue-900/20"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{team.name}</h3>
                <p className="text-blue-100 capitalize">{team.sport} • {team.category}</p>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">{team.description}</p>
              <div className="space-y-2 text-sm">
                {team.coach && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Coach: {team.coach}</span>
                  </div>
                )}
                {team.home_venue && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{team.home_venue}</span>
                  </div>
                )}
                {team.founded_year && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Founded {team.founded_year}</span>
                  </div>
                )}
              </div>
              {team.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Recent Achievements</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.achievements.slice(0, 3).map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-3 text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teams Yet</h3>
            <p className="text-gray-500">Teams will be displayed here once they are added to the system.</p>
          </div>
        )}
      </div>
    </div>
  );

  const CalendarPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">Calendar & Results</h1>
      
      <Tabs defaultValue="matches" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches" className="space-y-6">
          {matches.length > 0 ? matches.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-6">
                    <div className="text-center min-w-0 flex-1">
                      <div className="font-semibold text-lg">{match.home_team_name}</div>
                      <div className="text-3xl font-bold text-blue-600">{match.home_score !== null ? match.home_score : '-'}</div>
                    </div>
                    <div className="text-gray-400 text-xl font-bold">VS</div>
                    <div className="text-center min-w-0 flex-1">
                      <div className="font-semibold text-lg">{match.away_team_name}</div>
                      <div className="text-3xl font-bold text-blue-600">{match.away_score !== null ? match.away_score : '-'}</div>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <Badge 
                      variant={match.status === 'completed' ? 'default' : match.status === 'live' ? 'destructive' : 'secondary'}
                      className="mb-2"
                    >
                      {match.status.toUpperCase()}
                    </Badge>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center justify-center md:justify-end">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(match.match_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center justify-center md:justify-end">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(match.match_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="flex items-center justify-center md:justify-end">
                        <MapPin className="w-4 h-4 mr-1" />
                        {match.venue}
                      </div>
                    </div>
                  </div>
                </div>
                {match.competition && (
                  <div className="mt-4 pt-4 border-t">
                    <Badge variant="outline">{match.competition}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matches Scheduled</h3>
              <p className="text-gray-500">Match schedule will appear here once games are scheduled.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          {events.length > 0 ? events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="mt-2">{event.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {event.event_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {event.organizer && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Organized by {event.organizer}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{event.current_participants}/{event.max_participants} participants</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
              <p className="text-gray-500">Upcoming events will be displayed here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const NewsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">News & Updates</h1>
      <div className="space-y-8">
        {news.length > 0 ? news.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-2xl mb-2">{article.title}</CardTitle>
                  <CardDescription className="text-lg">{article.summary}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap">{article.content}</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  <span>By {article.author}</span>
                </div>
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Available</h3>
            <p className="text-gray-500">Latest news and updates will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );

  const EventsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">Upcoming Events</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {events.length > 0 ? events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {event.event_type}
                </Badge>
              </div>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{event.location}</span>
                </div>
                {event.organizer && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Organized by {event.organizer}</span>
                  </div>
                )}
                {event.max_participants && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{event.current_participants}/{event.max_participants} participants</span>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button className="w-full" variant="outline">
                  {event.is_public ? 'Join Event' : 'Request Invitation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-2 text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
            <p className="text-gray-500">Check back later for upcoming events and activities.</p>
          </div>
        )}
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Champions Club</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Founded with a vision to nurture sporting excellence, Champions Club has been at the forefront 
          of competitive sports for over 15 years.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
        <div>
          <img
            src="https://images.unsplash.com/photo-1496427473315-1408fac9d594?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwc3BvcnRzfGVufDB8fHxibHVlfDE3NTM4ODU0MzN8MA&ixlib=rb-4.1.0&q=85"
            alt="Team Sports"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To provide a platform where athletes of all levels can develop their skills, compete at the highest 
            standards, and build lifelong friendships through sport. We believe in the power of teamwork, 
            dedication, and continuous improvement.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <Trophy className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Excellence in Competition</h3>
                <p className="text-gray-600">Competing at regional and national levels across multiple sports.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Community Building</h3>
                <p className="text-gray-600">Creating lasting bonds through shared passion for sports.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Star className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Personal Development</h3>
                <p className="text-gray-600">Fostering growth both on and off the field through mentorship.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
            <p className="text-gray-600">Striving for the highest standards in everything we do.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Teamwork</h3>
            <p className="text-gray-600">Achieving success through collaboration and mutual support.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
            <p className="text-gray-600">Maintaining fairness, respect, and honesty in all competitions.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ready to join Champions Club? Get in touch with us and start your journey to sporting excellence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Address</h3>
                <p className="text-gray-600">
                  123 Sports Complex Drive<br />
                  Champions City, CC 12345
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">info@championsclub.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Office Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="I'm interested in joining..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about your interest in our programs..."
                ></textarea>
              </div>
              <Button className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Champions Club</span>
            </div>
            <p className="text-gray-400 mb-4">
              Excellence in sports, building champions for life.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.slice(0, 4).map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => setCurrentPage(item.page)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">More</h3>
            <ul className="space-y-2">
              {navigation.slice(4).map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => setCurrentPage(item.page)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">123 Sports Complex Drive</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">info@championsclub.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Champions Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'teams': return <TeamsPage />;
      case 'calendar': return <CalendarPage />;
      case 'news': return <NewsPage />;
      case 'events': return <EventsPage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Champions Club...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;