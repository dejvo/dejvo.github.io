from __future__ import print_function
import httplib2
import os
import pprint
import re
import yaml

from apiclient import discovery
import oauth2client
from oauth2client import client
from oauth2client import tools

try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

# If modifying these scopes, delete your previously saved credentials
# at ~/.credentials/drive-python-quickstart.json
SCOPES = [
    'https://www.googleapis.com/auth/drive', 
    'https://www.googleapis.com/auth/drive.appdata', 
    'https://www.googleapis.com/auth/drive.file', 
    'https://www.googleapis.com/auth/drive.metadata', 
    'https://www.googleapis.com/auth/drive.metadata.readonly', 
    'https://www.googleapis.com/auth/drive.photos.readonly', 
    'https://www.googleapis.com/auth/drive.readonly'
]
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Drive API Python Quickstart'


def get_credentials():
    """Gets valid user credentials from storage.

    If nothing has been stored, or if the stored credentials are invalid,
    the OAuth2 flow is completed to obtain the new credentials.

    Returns:
        Credentials, the obtained credential.
    """
    home_dir = os.path.expanduser('~')
    credential_dir = os.path.join(home_dir, '.credentials')
    if not os.path.exists(credential_dir):
        os.makedirs(credential_dir)
    credential_path = os.path.join(credential_dir,
                                   'drive-python-quickstart.json')

    store = oauth2client.file.Storage(credential_path)
    credentials = store.get()
    if not credentials or credentials.invalid:
        flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
        flow.user_agent = APPLICATION_NAME
        if flags:
            credentials = tools.run_flow(flow, store, flags)
        else: # Needed only for compatibility with Python 2.6
            credentials = tools.run(flow, store)
        print('Storing credentials to ' + credential_path)
    return credentials

def create_content(items):
    content = ''
    for item in items:
        # img_url = re.sub(r'(export=)download', r'\1view', item['webViewLink'])
        img_thumbnail = 'https://drive.google.com/thumbnail?authuser=0&sz=h320&id=' + item['id']
        content += '<a href="{0}">\n  <img src="{1}" />\n</a>\n'.format(item['webViewLink'], img_thumbnail)
    return content

def append_to_file(filename, items):
    f = open(filename, 'r')
    orig = f.read()
    f.close()

    end_char = '<!-- end -->'
    pattern = r'(^<!-- start -->\n)((.*\n)*)(' + end_char + ')'
    content = create_content(items)
    new = re.sub(pattern, r'\1' + content + end_char, orig, flags=re.MULTILINE)
    
    f = open(filename, 'w')
    f.write(new)
    f.close()

    print('\n\nGenerated file: ' + filename)
    print(new)

def process_albums(config):
    credentials = get_credentials()
    http = credentials.authorize(httplib2.Http())
    service = discovery.build('drive', 'v3', http=http)

    for item in config:
        if 'id' not in item:
            continue
        results = service.files().list(
                q='"{0}" in parents'.format(item['id']),
                fields='files(id, webViewLink)'
            ).execute()
        pprint.pprint(results)
        items = results.get('files', [])
        if not items:
            print('No files found.')
        else:
            append_to_file('galeria/{0}.html'.format(item['url']), items)
        

def main():
    with open("_data/albums.yml", 'r') as stream:
        try:
            config = yaml.load(stream)
        except yaml.YAMLError as exc:
            print(exc)
    process_albums(config)

if __name__ == '__main__':
    main()
