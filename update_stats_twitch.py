#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour récupérer les stats Twitch et générer live_stats.json
Compatible avec GitHub Actions
"""
import json
import os
import sys
import urllib.request
import urllib.parse
from typing import Dict, List, Optional

# Fix pour l'encodage Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Configuration
MEMBERS_URL = "https://createursdecompagnie.fr/data/cdc2025/members.json"
OUTPUT_FILE = "./out/live_stats.json"

# Credentials Twitch (depuis variables d'environnement ou fichier local)
TWITCH_CLIENT_ID = os.environ.get('TWITCH_CLIENT_ID', '')
TWITCH_CLIENT_SECRET = os.environ.get('TWITCH_CLIENT_SECRET', '')

class TwitchAPI:
    """Client simple pour l'API Twitch"""
    
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token = None
    
    def get_access_token(self) -> str:
        """Récupère un token d'accès OAuth"""
        if self.access_token:
            return self.access_token
        
        url = "https://id.twitch.tv/oauth2/token"
        data = urllib.parse.urlencode({
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'client_credentials'
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method='POST')
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read())
            self.access_token = result['access_token']
            return self.access_token
    
    def get_streams(self, user_logins: List[str]) -> Dict[str, dict]:
        """Récupère les infos de stream pour plusieurs utilisateurs"""
        if not user_logins:
            return {}
        
        token = self.get_access_token()
        
        # API Twitch limite à 100 users par requête
        streams_data = {}
        for i in range(0, len(user_logins), 100):
            batch = user_logins[i:i+100]
            
            # Construire l'URL avec les paramètres
            params = '&'.join([f'user_login={login}' for login in batch])
            url = f"https://api.twitch.tv/helix/streams?{params}"
            
            headers = {
                'Client-ID': self.client_id,
                'Authorization': f'Bearer {token}'
            }
            
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read())
                
                # Indexer par user_login (en minuscules)
                for stream in result.get('data', []):
                    login = stream['user_login'].lower()
                    streams_data[login] = {
                        'viewer_count': stream['viewer_count'],
                        'started_at': stream['started_at'],
                        'title': stream['title'],
                        'game_name': stream.get('game_name', '')
                    }
        
        return streams_data

def load_members() -> List[dict]:
    """Charge la liste des membres depuis l'API"""
    print("🔄 Récupération des membres depuis l'API...")
    
    try:
        with urllib.request.urlopen(MEMBERS_URL) as response:
            members = json.loads(response.read())
        print(f"✅ {len(members)} membres récupérés")
        return members
    except Exception as e:
        print(f"❌ Erreur lors du chargement des membres: {e}")
        sys.exit(1)

def enrich_with_live_data(members: List[dict], twitch_api: TwitchAPI) -> List[dict]:
    """Enrichit les membres avec les données de stream"""
    
    # Extraire les logins
    logins = []
    for m in members:
        user_data = m.get('user_data', {})
        login = user_data.get('login', '').lower()
        if login:
            logins.append(login)
    
    print(f"📡 Récupération des données Twitch pour {len(logins)} membres...")
    
    # Récupérer les streams actifs
    streams = twitch_api.get_streams(logins)
    
    # Enrichir les données
    enriched = []
    live_count = 0
    total_viewers = 0
    
    for m in members:
        member = m.copy()
        user_data = member.get('user_data', {})
        login = user_data.get('login', '').lower()
        
        # Vérifier si le membre est en live
        if login in streams:
            stream = streams[login]
            member['is_live'] = True
            member['viewer_count'] = stream['viewer_count']
            live_count += 1
            total_viewers += stream['viewer_count']
            print(f"  🔴 {user_data.get('display_name', login)}: {stream['viewer_count']} viewers")
        else:
            member['is_live'] = False
            member['viewer_count'] = 0
        
        enriched.append(member)
    
    print(f"📊 {live_count} chaînes en direct, {total_viewers} viewers totaux")
    
    return enriched, {
        'live_count': live_count,
        'total_viewers': total_viewers,
        'total_members': len(members)
    }

def save_output(members: List[dict], stats: dict):
    """Sauvegarde le fichier JSON"""
    
    # Créer le dossier de sortie si nécessaire
    os.makedirs(os.path.dirname(OUTPUT_FILE) or '.', exist_ok=True)
    
    output = {
        'members': members,
        'stats': stats
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Fichier généré: {OUTPUT_FILE}")

def load_credentials_from_file():
    """Charge les credentials depuis un fichier local (pour tests)"""
    creds_file = '.twitch_credentials.json'
    if os.path.exists(creds_file):
        with open(creds_file, 'r') as f:
            creds = json.load(f)
            return creds.get('client_id'), creds.get('client_secret')
    return None, None

def main():
    """Fonction principale"""
    
    # Charger les credentials
    client_id = TWITCH_CLIENT_ID
    client_secret = TWITCH_CLIENT_SECRET
    
    # Fallback sur un fichier local pour les tests
    if not client_id or not client_secret:
        client_id, client_secret = load_credentials_from_file()
    
    if not client_id or not client_secret:
        print("❌ Erreur: Credentials Twitch manquants")
        print("   Définissez les variables d'environnement:")
        print("   - TWITCH_CLIENT_ID")
        print("   - TWITCH_CLIENT_SECRET")
        print("   Ou créez un fichier .twitch_credentials.json")
        sys.exit(1)
    
    # Initialiser l'API Twitch
    twitch = TwitchAPI(client_id, client_secret)
    
    # Charger les membres
    members = load_members()
    
    # Enrichir avec les données live
    enriched_members, stats = enrich_with_live_data(members, twitch)
    
    # Sauvegarder
    save_output(enriched_members, stats)
    
    print("✅ Terminé !")

if __name__ == "__main__":
    main()
