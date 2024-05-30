# adblocker.py

import re
from flask import Flask, request, jsonify

app = Flask(__name__)

def block_ads(html_content):
    ad_patterns = [
        r"<!--\s*ad\s*-->",
        r"class\s*=\s*['\"]?ad['\"]?",
        r"id\s*=\s*['\"]?ad['\"]?",
        # 광고패턴 추가 예정
    ]

    for pattern in ad_patterns:
        html_content = re.sub(pattern, "", html_content, flags=re.IGNORECASE)

    return html_content

@app.route('/block_ads', methods=['POST'])
def block_ads_endpoint():
    data = request.json
    html_content = data.get('html_content', '')
    cleaned_content = block_ads(html_content)
    return jsonify({'cleaned_content': cleaned_content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)