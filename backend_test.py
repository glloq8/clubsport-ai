import requests
import sys
from datetime import datetime, timedelta
import json

class SportsClubAPITester:
    def __init__(self, base_url="https://46c924c6-2786-4948-bd11-ae909be452da.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_data = {
            'teams': [],
            'players': [],
            'matches': [],
            'news': [],
            'events': []
        }

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if method == 'POST' and isinstance(response_data, dict) and 'id' in response_data:
                        print(f"   Created ID: {response_data['id']}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_stats_endpoint(self):
        """Test the stats endpoint"""
        return self.run_test("Dashboard Stats", "GET", "stats", 200)

    def test_teams_crud(self):
        """Test Teams CRUD operations"""
        print("\n" + "="*50)
        print("TESTING TEAMS ENDPOINTS")
        print("="*50)
        
        # Test GET teams (empty initially)
        success, _ = self.run_test("Get Teams (Empty)", "GET", "teams", 200)
        
        # Test POST teams - Create sample teams
        sample_teams = [
            {
                "name": "Champions Football Team",
                "sport": "football",
                "category": "Senior",
                "description": "Our premier football team competing at the highest level",
                "coach": "John Smith",
                "home_venue": "Champions Stadium",
                "founded_year": 2010,
                "achievements": ["Regional Champions 2023", "League Winners 2022"]
            },
            {
                "name": "Elite Basketball Squad",
                "sport": "basketball",
                "category": "Senior",
                "description": "Professional basketball team with outstanding track record",
                "coach": "Sarah Johnson",
                "home_venue": "Sports Arena",
                "founded_year": 2015,
                "achievements": ["State Champions 2023"]
            },
            {
                "name": "Volleyball Warriors",
                "sport": "volleyball",
                "category": "Junior",
                "description": "Rising stars in volleyball competition",
                "coach": "Mike Davis",
                "home_venue": "Community Center",
                "founded_year": 2018,
                "achievements": ["Youth League Winners 2023"]
            }
        ]
        
        for team_data in sample_teams:
            success, response = self.run_test(f"Create Team - {team_data['name']}", "POST", "teams", 200, team_data)
            if success and 'id' in response:
                self.created_data['teams'].append(response)
        
        # Test GET teams (should have data now)
        success, teams = self.run_test("Get Teams (With Data)", "GET", "teams", 200)
        if success:
            print(f"   Found {len(teams)} teams")
        
        # Test GET single team
        if self.created_data['teams']:
            team_id = self.created_data['teams'][0]['id']
            self.run_test("Get Single Team", "GET", f"teams/{team_id}", 200)

    def test_players_crud(self):
        """Test Players CRUD operations"""
        print("\n" + "="*50)
        print("TESTING PLAYERS ENDPOINTS")
        print("="*50)
        
        # Test GET players (empty initially)
        success, _ = self.run_test("Get Players (Empty)", "GET", "players", 200)
        
        if not self.created_data['teams']:
            print("❌ No teams available for player creation")
            return
        
        # Create sample players for each team
        for team in self.created_data['teams'][:2]:  # Use first 2 teams
            sample_players = [
                {
                    "name": f"Player One - {team['name']}",
                    "team_id": team['id'],
                    "jersey_number": 10,
                    "position": "Forward" if team['sport'] == 'football' else "Point Guard" if team['sport'] == 'basketball' else "Spiker",
                    "age": 25,
                    "height": "6'2\"",
                    "weight": "180 lbs",
                    "bio": f"Star player for {team['name']}",
                    "achievements": ["Player of the Year 2023"]
                },
                {
                    "name": f"Player Two - {team['name']}",
                    "team_id": team['id'],
                    "jersey_number": 7,
                    "position": "Midfielder" if team['sport'] == 'football' else "Shooting Guard" if team['sport'] == 'basketball' else "Setter",
                    "age": 23,
                    "height": "5'10\"",
                    "weight": "165 lbs",
                    "bio": f"Talented player for {team['name']}",
                    "achievements": ["Rookie of the Year 2022"]
                }
            ]
            
            for player_data in sample_players:
                success, response = self.run_test(f"Create Player - {player_data['name']}", "POST", "players", 200, player_data)
                if success and 'id' in response:
                    self.created_data['players'].append(response)
        
        # Test GET players (should have data now)
        success, players = self.run_test("Get Players (With Data)", "GET", "players", 200)
        if success:
            print(f"   Found {len(players)} players")
        
        # Test GET players by team
        if self.created_data['teams']:
            team_id = self.created_data['teams'][0]['id']
            success, team_players = self.run_test("Get Players by Team", "GET", f"players?team_id={team_id}", 200)
            if success:
                print(f"   Found {len(team_players)} players for team")

    def test_matches_crud(self):
        """Test Matches CRUD operations"""
        print("\n" + "="*50)
        print("TESTING MATCHES ENDPOINTS")
        print("="*50)
        
        # Test GET matches (empty initially)
        success, _ = self.run_test("Get Matches (Empty)", "GET", "matches", 200)
        
        if len(self.created_data['teams']) < 2:
            print("❌ Need at least 2 teams for match creation")
            return
        
        # Create sample matches
        sample_matches = [
            {
                "home_team_id": self.created_data['teams'][0]['id'],
                "away_team_id": self.created_data['teams'][1]['id'],
                "home_team_name": self.created_data['teams'][0]['name'],
                "away_team_name": self.created_data['teams'][1]['name'],
                "match_date": (datetime.now() + timedelta(days=7)).isoformat(),
                "venue": "Champions Stadium",
                "sport": self.created_data['teams'][0]['sport'],
                "status": "scheduled",
                "season": "2024-25",
                "competition": "League Championship"
            },
            {
                "home_team_id": self.created_data['teams'][1]['id'],
                "away_team_id": self.created_data['teams'][0]['id'],
                "home_team_name": self.created_data['teams'][1]['name'],
                "away_team_name": self.created_data['teams'][0]['name'],
                "match_date": (datetime.now() - timedelta(days=3)).isoformat(),
                "venue": "Sports Arena",
                "sport": self.created_data['teams'][1]['sport'],
                "home_score": 2,
                "away_score": 1,
                "status": "completed",
                "season": "2024-25",
                "competition": "League Championship"
            }
        ]
        
        if len(self.created_data['teams']) >= 3:
            sample_matches.append({
                "home_team_id": self.created_data['teams'][2]['id'],
                "away_team_id": self.created_data['teams'][0]['id'],
                "home_team_name": self.created_data['teams'][2]['name'],
                "away_team_name": self.created_data['teams'][0]['name'],
                "match_date": (datetime.now() + timedelta(days=14)).isoformat(),
                "venue": "Community Center",
                "sport": self.created_data['teams'][2]['sport'],
                "status": "scheduled",
                "season": "2024-25",
                "competition": "Cup Tournament"
            })
        
        for match_data in sample_matches:
            success, response = self.run_test(f"Create Match - {match_data['home_team_name']} vs {match_data['away_team_name']}", "POST", "matches", 200, match_data)
            if success and 'id' in response:
                self.created_data['matches'].append(response)
        
        # Test GET matches (should have data now)
        success, matches = self.run_test("Get Matches (With Data)", "GET", "matches", 200)
        if success:
            print(f"   Found {len(matches)} matches")

    def test_news_crud(self):
        """Test News CRUD operations"""
        print("\n" + "="*50)
        print("TESTING NEWS ENDPOINTS")
        print("="*50)
        
        # Test GET news (empty initially)
        success, _ = self.run_test("Get News (Empty)", "GET", "news", 200)
        
        # Create sample news articles
        sample_news = [
            {
                "title": "Champions Football Team Wins Regional Championship",
                "content": "In an exciting match that went into overtime, our Champions Football Team secured the regional championship with a stunning 3-2 victory. The team showed incredible determination and skill throughout the tournament.",
                "summary": "Champions Football Team wins regional championship in thrilling overtime victory",
                "author": "Sports Reporter",
                "category": "Match Results",
                "published": True,
                "published_at": datetime.now().isoformat(),
                "tags": ["football", "championship", "victory"]
            },
            {
                "title": "New Basketball Coach Joins Elite Squad",
                "content": "We are excited to announce that former professional player Sarah Johnson has joined our Elite Basketball Squad as head coach. With over 15 years of playing experience and 5 years of coaching, she brings valuable expertise to our team.",
                "summary": "Former professional player Sarah Johnson appointed as new basketball coach",
                "author": "Club Management",
                "category": "Team News",
                "published": True,
                "published_at": (datetime.now() - timedelta(days=2)).isoformat(),
                "tags": ["basketball", "coach", "appointment"]
            },
            {
                "title": "Upcoming Youth Training Camp",
                "content": "Registration is now open for our annual youth training camp. The camp will run for two weeks during summer break and will cover all major sports offered by our club. Professional coaches will provide training in football, basketball, and volleyball.",
                "summary": "Annual youth training camp registration now open for summer break",
                "author": "Youth Coordinator",
                "category": "Events",
                "published": True,
                "published_at": (datetime.now() - timedelta(days=1)).isoformat(),
                "tags": ["youth", "training", "camp", "summer"]
            }
        ]
        
        for news_data in sample_news:
            success, response = self.run_test(f"Create News - {news_data['title'][:30]}...", "POST", "news", 200, news_data)
            if success and 'id' in response:
                self.created_data['news'].append(response)
        
        # Test GET news (should have data now)
        success, news = self.run_test("Get News (With Data)", "GET", "news", 200)
        if success:
            print(f"   Found {len(news)} news articles")

    def test_events_crud(self):
        """Test Events CRUD operations"""
        print("\n" + "="*50)
        print("TESTING EVENTS ENDPOINTS")
        print("="*50)
        
        # Test GET events (empty initially)
        success, _ = self.run_test("Get Events (Empty)", "GET", "events", 200)
        
        # Create sample events
        sample_events = [
            {
                "title": "Annual Sports Gala",
                "description": "Join us for our annual sports gala celebrating achievements of all our teams and athletes. Awards ceremony, dinner, and entertainment included.",
                "event_date": (datetime.now() + timedelta(days=30)).isoformat(),
                "location": "Grand Ballroom, Champions Hotel",
                "event_type": "social",
                "organizer": "Club Management",
                "max_participants": 200,
                "current_participants": 45,
                "is_public": True
            },
            {
                "title": "Football Team Training Session",
                "description": "Intensive training session for the football team preparing for upcoming championship matches.",
                "event_date": (datetime.now() + timedelta(days=3)).isoformat(),
                "location": "Champions Stadium Training Ground",
                "event_type": "training",
                "organizer": "John Smith",
                "max_participants": 25,
                "current_participants": 22,
                "is_public": False
            },
            {
                "title": "Inter-Club Basketball Tournament",
                "description": "Three-day basketball tournament featuring teams from multiple clubs across the region.",
                "event_date": (datetime.now() + timedelta(days=21)).isoformat(),
                "end_date": (datetime.now() + timedelta(days=23)).isoformat(),
                "location": "Sports Arena Complex",
                "event_type": "tournament",
                "organizer": "Regional Sports Association",
                "max_participants": 150,
                "current_participants": 89,
                "is_public": True
            }
        ]
        
        for event_data in sample_events:
            success, response = self.run_test(f"Create Event - {event_data['title']}", "POST", "events", 200, event_data)
            if success and 'id' in response:
                self.created_data['events'].append(response)
        
        # Test GET events (should have data now)
        success, events = self.run_test("Get Events (With Data)", "GET", "events", 200)
        if success:
            print(f"   Found {len(events)} events")

    def test_sponsors_endpoints(self):
        """Test Sponsors endpoints"""
        print("\n" + "="*50)
        print("TESTING SPONSORS ENDPOINTS")
        print("="*50)
        
        # Test GET sponsors (empty initially)
        success, _ = self.run_test("Get Sponsors (Empty)", "GET", "sponsors", 200)
        
        # Create sample sponsor
        sample_sponsor = {
            "name": "SportsTech Solutions",
            "website": "https://sportstech.com",
            "contact_email": "partnership@sportstech.com",
            "sponsorship_level": "Gold",
            "description": "Leading provider of sports technology and equipment",
            "active": True
        }
        
        success, response = self.run_test("Create Sponsor", "POST", "sponsors", 200, sample_sponsor)
        
        # Test GET sponsors (should have data now)
        success, sponsors = self.run_test("Get Sponsors (With Data)", "GET", "sponsors", 200)
        if success:
            print(f"   Found {len(sponsors)} sponsors")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Sports Club API Testing")
        print("="*60)
        
        # Test basic endpoints
        self.test_root_endpoint()
        self.test_stats_endpoint()
        
        # Test CRUD operations
        self.test_teams_crud()
        self.test_players_crud()
        self.test_matches_crud()
        self.test_news_crud()
        self.test_events_crud()
        self.test_sponsors_endpoints()
        
        # Final stats test (should show updated counts)
        print("\n" + "="*50)
        print("FINAL STATS CHECK")
        print("="*50)
        success, stats = self.run_test("Final Stats Check", "GET", "stats", 200)
        if success:
            print(f"   Final Stats: {stats}")
        
        # Print summary
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        print(f"\n📈 Created Data Summary:")
        print(f"   Teams: {len(self.created_data['teams'])}")
        print(f"   Players: {len(self.created_data['players'])}")
        print(f"   Matches: {len(self.created_data['matches'])}")
        print(f"   News: {len(self.created_data['news'])}")
        print(f"   Events: {len(self.created_data['events'])}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SportsClubAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())